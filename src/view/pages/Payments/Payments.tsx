import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPayments } from "../../../slices/paymentSlice";

export function Payments() {
    const dispatch = useDispatch();
    const { list: payments, error } = useSelector((state) => state.payment);

    useEffect(() => {
        dispatch(getAllPayments());
    }, [dispatch]);

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Payments</h1>
            {payments && payments.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Payment ID</th>
                        <th className="border border-gray-300 px-4 py-2">Amount</th>
                        <th className="border border-gray-300 px-4 py-2">Currency</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">User Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map((payment) => (
                        <tr key={payment._id}>
                            <td className="border border-gray-300 px-4 py-2">{payment.paymentId}</td>
                            <td className="border border-gray-300 px-4 py-2">{payment.amount}</td>
                            <td className="border border-gray-300 px-4 py-2">{payment.currency}</td>
                            <td className="border border-gray-300 px-4 py-2">{payment.status}</td>
                            <td className="border border-gray-300 px-4 py-2">{payment.userId?.email || "N/A"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No payments available.</p>
            )}
        </div>
    );
}
export default Payments;