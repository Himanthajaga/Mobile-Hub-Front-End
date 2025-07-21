import { useEffect } from "react";
import { getAllProducts } from "../../../slices/productSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";

export function AdminPanel() {
    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    return (
        <div>
            <div
                className="flex flex-wrap ml-[1px] mt-6 mb-5
                            justify-center items-center mx-auto"
            >
                {list.map((product) => (
                    <div
                        key={product.id}
                        className="w-50 h-80 mr-2 mb-2 justify-center items-center border-gray-500 border-[1px] p-4 rounded shadow-md bg-white"
                    >
                        <h3 className="text-lg font-bold">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                            {product.category?.name || "Unknown Category"}
                        </p>
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-40 object-cover mt-2"
                            />
                        ) : (
                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">No Image</span>
                            </div>
                        )}
                        <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                        <p className="text-sm text-gray-600 mt-2">${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}