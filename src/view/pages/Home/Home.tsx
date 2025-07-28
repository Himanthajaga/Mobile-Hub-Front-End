import { useEffect, useState } from "react";
import { Product } from "../../common/product/Product.tsx";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { getAllProducts } from "../../../slices/productSlice.ts";

export function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.products);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [nameFilter, setNameFilter] = useState("");
    const [minPrice, setMinPrice] = useState<number | "">("");
    const [maxPrice, setMaxPrice] = useState<number | "">("");

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    // Get unique categories from the product list
    const categories = ["All", ...new Set(list.map((product) => product.category))];

    // Filter products based on the selected category, name, and price range
    const filteredProducts = list.filter((product) => {
        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;
        const matchesName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesPrice =
            (minPrice === "" || product.price >= minPrice) &&
            (maxPrice === "" || product.price <= maxPrice);
        return matchesCategory && matchesName && matchesPrice;
    });

    return (
        <div>
            {/* Filter Options */}
            <div className="mb-4 p-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded flex gap-20rounded flex gap-4">
                {/* Category Selection Dropdown */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Filter by Category</h2>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Name Filter Input */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Filter by Name</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>

                {/* Price Range Filter */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Filter by Price Range</h2>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value ? +e.target.value : "")}
                            className="border p-2 rounded w-full"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value ? +e.target.value : "")}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Display Filtered Products */}
            <div className="flex flex-wrap justify-center items-center mx-auto">
                {filteredProducts.map((product) => (
                    <Product key={product.id} data={product} />
                ))}
            </div>
        </div>
    );
}

export default Home;