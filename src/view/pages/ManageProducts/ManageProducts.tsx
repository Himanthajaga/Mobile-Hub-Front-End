import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { deleteProduct, getAllProducts } from "../../../slices/productSlice.ts";

export function ManageProducts() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.products);
    const categories = useSelector((state: RootState) => state.category.list || []);

    useEffect(() => {
        // Fetch products and categories
        dispatch(getAllProducts());
    }, [dispatch]);

    const handleDelete = async (id: string) => {
       if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                alert("Product deleted successfully!");
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    const handleUpdate = (product) => {
        navigate("/add-product", { state: { product } });
    };

    // Helper function to get category name by ID
    const getCategoryName = (categoryId: string) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Unknown Category";
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <button
                    onClick={() => navigate("/add-product")}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Product
                </button>
            </div>
            <div className="flex flex-wrap ml-[1px] mt-6 mb-5 justify-center items-center mx-auto">
                {list.map((product) => (
                    <div
                        key={product.id}
                        className="w-50 h-auto mr-2 mb-2 justify-center items-center border-gray-500 border-[1px] p-4 rounded shadow-md bg-white"
                    >
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-40 object-cover mb-2"
                            />
                        )}
                        <h3 className="text-lg font-bold">{product.name}</h3>
                        <p className="text-sm text-gray-600">Price: {product.price} {product.currency}</p>
                        <p className="text-sm text-gray-600">Category: {getCategoryName(product.category)}</p>
                        <p className="text-sm text-gray-500">{product.description}</p>
                        <div className="mt-2 flex justify-between">
                            <button
                                onClick={() => handleUpdate(product)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}