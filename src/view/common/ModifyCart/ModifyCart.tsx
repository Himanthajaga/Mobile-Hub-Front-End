// import type {CartItem} from "../../../model/CartItem.ts";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {decreaseQuantity, increaseQuantity} from "../../../slices/cartSlice.ts";
import type {ProductData} from "../../../model/ProductData.ts";

interface ModifyCartProps {
    data: ProductData
}

// export const itemsList:CartItem[] = [];
export function ModifyCart({ data }: ModifyCartProps) {
    const dispatch = useDispatch<AppDispatch>();
    const item = useSelector((state: RootState) => state.cart.items)
        .find(cartItem => cartItem.product.id === data.id)

    const decreaseItemCount = () => {
        if (item && item.itemCount > 1){
            dispatch(decreaseQuantity(data.id));
        }else {
            alert("Item count can't be less than 1");
        }
    }
    const increaseItemCount = () => {
        dispatch(increaseQuantity(data.id));

    }

    return (
        <div className="w-full mt-4 p-[1px]
                        text-[8px] font-bold text-center">
            <button className="float-left
                 text-[20px] font-bold bg-yellow-300
                 rounded-lg h-7 w-9"
                    onClick={decreaseItemCount}>-</button>
            <small
                className="text-[20px]">{item?.itemCount}</small>
            <button className="float-right
                 text-[20px] font-bold bg-yellow-300
                 rounded-lg h-7 w-9"
                    onClick={increaseItemCount}>+</button>
        </div>
    );
}