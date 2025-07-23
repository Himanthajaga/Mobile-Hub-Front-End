import {useEffect, useState} from "react";
import { getAllProducts } from "../../../slices/productSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { getAllCategories } from "../../../slices/categorySlice.ts";

export function AdminPanel() {
    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.products);
    const categories = useSelector((state: RootState) => state.category.list || []);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Fetch products and categories
        const fetchData = async () => {
            await dispatch(getAllCategories());
            await dispatch(getAllProducts());
            setIsLoading(false); // Set loading to false after data is fetched
        };
        fetchData();
    }, [dispatch]);

    // Helper function to get category name by ID
    const getCategoryName = (category: string | { name: string }) => {
        if (typeof category === "string") {
            const foundCategory = categories.find((cat) => cat.name === category || cat.id === category);
            return foundCategory ? foundCategory.name : "Unknown Category";
        } else if (typeof category === "object" && category.name) {
            return category.name;
        }
        return "Unknown Category";
    };
    if (isLoading) {
        return <div>Loading...</div>; // Show a loading indicator while data is being fetched
    }

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
                            {getCategoryName(product.category)}
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