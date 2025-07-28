import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { RootState, AppDispatch } from "../../../store/store";
import { addPayment } from "../../../slices/paymentSlice";
import { removeFromCart, updateItemQuantity } from "../../../slices/cartSlice";
import { getUserFromToken, isTokenExpired } from "../../../auth/auth.ts";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51R6ZgFKiBxldEfFS2fX0YC3riyZE1M5C8oFqG239MAcBiLl6TqyoKtzPsqiiXEV5ilYkqRYHvn8hnvqY5EdNfR8L00weOUntYV");

const CheckoutForm = ({ totalAmount }: { totalAmount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

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

            if (!authToken || isTokenExpired(authToken)) {
                alert("You must be logged in to make a payment.");
                return;
            }

            const userData = getUserFromToken(authToken);
            const userId = userData.userId;
            const email = userData.email;

            if (!userId) {
                alert("Unable to retrieve user information.");
                return;
            }

            const paymentData = {
                amount: totalAmount,
                currency: "LKR",
                paymentMethod: "card",
                status: "PENDING",
                userId,
                createdAt: new Date(),
                email,
            };

            const result = await dispatch(addPayment(paymentData)).unwrap();

            const { paymentIntent, error } = await stripe.confirmCardPayment(result.clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                },
            });

            if (error) {
                alert("Payment failed!");
            } else if (paymentIntent?.status === "succeeded") {
                const transactionId = paymentIntent.id;
                const paymentId = paymentIntent.charges?.data[0]?.id;

                const updatedPaymentData = {
                    ...paymentData,
                    status: "COMPLETED",
                    transactionId,
                    paymentId,
                };

                await dispatch(addPayment(updatedPaymentData));

                alert("Payment successful!");
                dispatch({ type: "cart/clearCart" });
                navigate("/");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error during payment process:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-screen-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <div className="w-100">
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <CardNumberElement
                    options={{
                        style: {
                            base: {
                                fontSize: "18px",
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
                    className="border border-gray-300 rounded p-3 w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <CardExpiryElement
                    options={{
                        style: {
                            base: {
                                fontSize: "18px",
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
                    className="border border-gray-300 rounded p-3 w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">CVC</label>
                <CardCvcElement
                    options={{
                        style: {
                            base: {
                                fontSize: "18px",
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
                    className="border border-gray-300 rounded p-3 w-full"
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || !elements}
                className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-8 py-4 rounded w-full text-lg"
            >
                Pay Now
            </button>
        </form>
    );
};

export function ShoppingCart() {
    const { items } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch<AppDispatch>();

    const totalAmount = items.reduce(
        (total, item) => total + item.product.price * item.itemCount,
        0
    );

    const handleRemoveItem = (productId: string) => {
        dispatch(removeFromCart(productId));
    };

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity > 0) {
            dispatch(updateItemQuantity({ productId, quantity: newQuantity }));
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-4 font-sans bg-gradient-to-r from-blue-500 to-green-400">Shopping Cart</h1>
            <table className="min-w-full border-collapse mb-4 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <thead>
                <tr className="border-b bg-green-700 text-white">
                    <th className="px-6 py-4 text-left text-lg font-bold">Name</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Unit Price</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Quantity</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Total Price</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.product.id} className="border-b hover:bg-green-100">
                        <td className="px-6 py-4 text-m">{item.product.name}</td>
                        <td className="px-6 py-4 text-m">
                            {item.product.price} {item.product.currency}
                        </td>
                        <td className="px-6 py-4 text-m flex items-center">
                            <button
                                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => handleUpdateQuantity(item.product.id, item.itemCount - 1)}
                            >
                                -
                            </button>
                            <span className="mx-2">{item.itemCount}</span>
                            <button
                                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => handleUpdateQuantity(item.product.id, item.itemCount + 1)}
                            >
                                +
                            </button>
                        </td>
                        <td className="px-6 py-4 text-m">
                            {(item.product.price * item.itemCount).toFixed(2)} {item.product.currency}
                        </td>
                        <td className="px-6 py-4 text-m">
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveItem(item.product.id)}
                            >
                                🗑️
                            </button>
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