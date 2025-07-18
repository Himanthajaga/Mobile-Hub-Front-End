import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {ProductData} from "../model/ProductData.ts";
import {backendApi} from "../api.ts";

interface ProductState {
    list: ProductData[],
    error: string | null | undefined

}

//type ekai object ekak asiign kara
const initialState: ProductState = {
    list:[],
    error: null,

}

export const getAllProducts = createAsyncThunk(
    'product/getAllProducts',
    async () => {
        const response = await backendApi.get("/products/all");
        return await response.data;
    }
)

//producr ekata related dewal maintain karana nisa
//udin define karapu init
const productSlice = createSlice({
    name: 'product',
    initialState: initialState,
    reducers:{},
    extraReducers:(builder) => {

//Async Response pending
        builder.addCase(getAllProducts.pending, () => {
            alert("Product data is still loading...");
// Async Response Complete State
        }) .addCase(getAllProducts.fulfilled, (state, action) => {
            state.list = action.payload;
// Async Response Failure State
        }) .addCase(getAllProducts.rejected, (state, action) => {
            state.error = action.error.message;
            alert("Error loading :" + state.error);
        })
    }
});

export default productSlice.reducer;
