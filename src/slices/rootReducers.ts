import {combineReducers} from "redux";
import productReducer from './productSlice.ts';
import cartReducer from './cartSlice.ts';
import userReducer from './userSlice.ts';
import contactReducer from './contactSlice.ts';

export const rootReducer = combineReducers({
    products: productReducer,
    cart: cartReducer,
    user: userReducer,
    contact: contactReducer
});
export type RootState = ReturnType<typeof rootReducer>;