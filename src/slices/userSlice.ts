import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { UserData } from "../model/UserData";
import { backendApi } from "../api";

interface UserState {
    users: UserData[];
    status: "idle" | "loading" | "success" | "error";
    error: string | null;
}

const initialState: UserState = {
    users: [],
    status: "idle",
    error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    const response = await backendApi.get("/users");
    return response.data;
});

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = "success";
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.error = action.error.message || "Failed to fetch users.";
            });
    },
});

export default userSlice.reducer;