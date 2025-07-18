import type {CartItem} from "../model/CartItem.ts";
import {createSlice} from "@reduxjs/toolkit";
import type {ProductData} from "../model/ProductData.ts";
import type {PayloadAction} from "@reduxjs/toolkit";

interface CartState{
    items: CartItem[];

}
const initialState: CartState = {
    items: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        addItemToCart:(state: CartState,
                       action: PayloadAction<ProductData>) : void => {
            const existingItem = state.items.find((item)=>
                item.product.id == action.payload.id)

            if (!existingItem) {
                state.items.push({
                    product: action.payload,
                    itemCount: 1
                })
            }
        },
        increaseQuantity(state: CartState,action: PayloadAction<number>) : void {
            const item =  state.items.find((existingItem) =>
                existingItem.product.id === action.payload);
            if (item) {
                item.itemCount+= 1;

            }
        },
        decreaseQuantity(state: CartState, action: PayloadAction<number>) : void {
            const item = state.items.find((existingItem) =>
                existingItem.product.id === action.payload);
            if (item) {
                if (item && item.itemCount > 1){
                    item.itemCount -= 1;
                }
            }
        }
    }});
export const {addItemToCart,
    increaseQuantity,
    decreaseQuantity} = cartSlice.actions;
export default cartSlice.reducer