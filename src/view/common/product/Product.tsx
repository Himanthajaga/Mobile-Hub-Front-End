import { ModifyCart } from "../ModifyCart/ModifyCart.tsx";
import type { ProductData } from "../../../model/ProductData.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { addItemToCart } from "../../../slices/cartSlice.ts";

type ProductProps = {
    data: ProductData;
};

export function Product({ data }: ProductProps) {
    const dispatch = useDispatch<AppDispatch>();

    const item = useSelector((state: RootState) =>
        state.cart.items.find(cartItem => cartItem.product.id === data.id)
    );


    const addToCart = () => {
        dispatch(addItemToCart(data));
    };
    return (
        <div className="w-65 h-auto mr-2 mb-2 justify-center items-center border-gray-500 border-[1px] p-4 rounded shadow-md bg-white">
            {/* Name */}
            <h3 className="text-[#1f9e4b] text-[1.2rem] pl-1 font-bold mb-2">{data.name}</h3>

            {/* Image */}
            <div>
                {data.image ? (
                    <img
                        className="h-[230px] w-[200px] object-cover mb-2"
                        src={data.image}
                        alt={data.name}
                    />
                ) : (
                    <div className="h-[140px] w-[200px] bg-gray-600 flex items-center justify-center mb-2">
                        <span className="text-gray-500">No Image Available</span>
                    </div>
                )}
            </div>

            {/* Price with Currency */}
            <div className="bg-green-400 p-[1px] rounded-lg pr-1 mb-2 align-middle px-3">
                <h3 className="text-[20px] pl-1 font-medium text-blue-800">
                    {data.price} <small className="text-[15px]">{data.currency}</small>
                </h3>
            </div>

            {/* Description */}
            <div className="text-[1rem] pl-1 mb-2">
                <p>{data.description}</p>
            </div>

            {/* Category */}
            <div className="text-[1rem] pl-1 mb-2">
                <p>Category: {data.category}</p>
            </div>

            {/* Add to Cart or Modify Cart */}
            <div className="flex justify-center">
                {item ? (
                    <ModifyCart data={data} />
                ) : (
                    <button
                        className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-medium text-[15px] px-4 py-2 rounded mt-2"
                        onClick={addToCart}
                    >
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
}