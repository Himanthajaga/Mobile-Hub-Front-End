import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { RootState, AppDispatch } from "../../../store/store";
import { addPayment } from "../../../slices/paymentSlice";
import {getUserFromToken, isTokenExpired} from "../../../auth/auth.ts";
import {jwtDecode} from "jwt-decode";
const stripePromise = loadStripe("pk_test_51R6ZgFKiBxldEfFS2fX0YC3riyZE1M5C8oFqG239MAcBiLl6TqyoKtzPsqiiXEV5ilYkqRYHvn8hnvqY5EdNfR8L00weOUntYV");

const CheckoutForm = ({ totalAmount }: { totalAmount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error("Stripe or Elements is not available.");
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) {
            console.error("CardNumberElement is not available.");
            return;
        }

        try {
            const authToken = localStorage.getItem("token");
            console.log("Retrieved authToken:", authToken);

            if (!authToken || isTokenExpired(authToken)) {
                alert("You must be logged in to make a payment.");
                console.error("User is not authenticated or token is expired.");
                return;
            }

            // Decode the token to get the userId
            const userData = getUserFromToken(authToken);
            const userId = userData.userId;

            if (!userId) {
                console.error("User ID not found in token.");
                alert("Unable to retrieve user information.");
                return;
            }

            const paymentData = {
                amount: totalAmount,
                currency: "LKR",
                paymentMethod: "card",
                status: "PENDING",
                userId, // Use the decoded userId
                createdAt: new Date(),
                transactionId: "txn_12345", // Replace with actual transaction ID
                paymentId: "pay_12345", // Replace with actual payment ID
            };
            console.log("Payment data to be sent:", paymentData);
            const result = await dispatch(addPayment(paymentData)).unwrap();

            console.log("PaymentIntent created successfully:", result);

            const { paymentIntent, error } = await stripe.confirmCardPayment(result.clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                },
            });

            if (error) {
                console.error("Payment error:", error);
                alert("Payment failed!");
            } else if (paymentIntent?.status === "succeeded") {
                console.log("Payment successful:", paymentIntent);
                alert("Payment successful!");
            }
        } catch (error) {
            console.error("Error during payment process:", error);
        }
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <CardNumberElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#424770",
                                letterSpacing: "0.025em",
                                fontFamily: "Arial, sans-serif",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                    className="border border-gray-300 rounded p-2 w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <CardExpiryElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#424770",
                                letterSpacing: "0.025em",
                                fontFamily: "Arial, sans-serif",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                    className="border border-gray-300 rounded p-2 w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">CVC</label>
                <CardCvcElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#424770",
                                letterSpacing: "0.025em",
                                fontFamily: "Arial, sans-serif",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                    className="border border-gray-300 rounded p-2 w-full"
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || !elements}
                className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-3 rounded w-full"
            >
                Pay Now
            </button>
        </form>
    );
};

export function ShoppingCart() {
    const { items } = useSelector((state: RootState) => state.cart);

    const totalAmount = items.reduce(
        (total, item) => total + item.product.price * item.itemCount,
        0
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            <table className="min-w-full border-collapse mb-4">
                <thead>
                <tr className="border-b bg-green-700 text-white">
                    <th className="px-6 py-4 text-left text-sm font-medium">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Unit Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Total Price</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.product.id} className="border-b">
                        <td className="px-6 py-4 text-sm">{item.product.name}</td>
                        <td className="px-6 py-4 text-sm">
                            {item.product.price} {item.product.currency}
                        </td>
                        <td className="px-6 py-4 text-sm">{item.itemCount}</td>
                        <td className="px-6 py-4 text-sm">
                            {(item.product.price * item.itemCount).toFixed(2)}{" "}
                            {item.product.currency}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">
                    Total Amount: {totalAmount.toFixed(2)} {items[0]?.product.currency}
                </h2>
                <Elements stripe={stripePromise}>
                    <CheckoutForm totalAmount={totalAmount} />
                </Elements>
            </div>
        </div>
    );
}