import {useSelector} from "react-redux";
import type {RootState} from "../../../store/store.ts";

export function ShoppingCart() {
    const {items} = useSelector((state: RootState)=>
        state.cart
    )
    return (
        <div className ="flex justify-center items-center h-screen bg-gray-100 px-4">
            <div className="w-full max-w-screen-xl border border-gray-300 bg-white shadow-lg rounded-lg p-6">
                <table className="min-w-full border-collapse">
                    <thead>
                    <tr className="border-b bg-green-700 text-white">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-green-600 p-2">Id</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-green-600 p-2">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-green-600 p-2">Unit Price</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-green-600 p-2">Quantity</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-green-600 p-2">Total Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        items.length===0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-500 p-4 border-green-300 bg-green-100">
                                    <p className=" text-center text-sm text-black">Your cart is empty!!No items to display!</p>
                                </td>
                            </tr>
                        ) :( items.map((item, index) => (
                                <tr key={item.product.id} className={` ${index % 2 === 0? "bg-green-100":"bg-green-200" }hover:bg-green-300 border-green-300`}>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-green-600 p-2">{item.product.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-green-600 p-2">{item.product.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-green-600 p-2">{item.product.price} {item.product.currency}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-green-600 p-2">{item.itemCount}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-green-600 p-2">
                                        {((item.product.price) * item.itemCount).toFixed(2)} {item.product.currency}
                                    </td>
                                </tr>
                            ))
                        )
                    }
                    </tbody>
                </table>

            </div>
        </div>
    );
}