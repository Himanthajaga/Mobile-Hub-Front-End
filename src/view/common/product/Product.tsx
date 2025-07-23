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
        <div className="w-50 h-80 mr-2 mb-2 justify-center items-center border-gray-500 border-[1px]">
            <div>
                {data.image ? (
                    <img
                        className="h-[140px] w-[200px] object-cover"
                        src={data.image} // Use the image URL from the database
                        alt={data.name}
                    />
                ) : (
                    <div className="h-[140px] w-[200px] bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image Available</span>
                    </div>
                )}
            </div>
            <div className="flex">
                <div>
                    <h3 className="text-[#1f9e4b] text-[1.5rem] pl-2">{data.name}</h3>
                </div>
                <div className="bg-yellow-300 ml-4 p-[5px] rounded-lg pr-7">
                    <h3 className="text-[12px] pl-2">
                        {data.price} <small className="text-[10px]">{data.currency}</small>
                    </h3>
                </div>
            </div>
            <div className="text-[1rem] pl-2">
                <p>{data.description}</p>
            </div>
            <div className="text-[1rem] pl-2">
                <p>Category: {data.category}</p>
            </div>
            <div className="flex justify-center">
                {item ? (
                    <ModifyCart data={data} />
                ) : (
                    <button
                        className="bg-gradient-to-r from-blue-500 to-green-400 text-white text-[15px] px-4 py-3 rounded mt-2"
                        onClick={addToCart}
                    >
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
}