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

export const fetchUsers = createAsyncThunk(
    "users/getAllUsers",
        async () => {
            const response = await backendApi.get("/users");
            return response.data;
        }
);
export const addUser = createAsyncThunk(
    "users/addUser",
    async (user: FormData | Record<string, any>, { rejectWithValue }) => {
        try {
            console.log("Request received at addUser endpoint", user);
            const response = await backendApi.post("/auth/register", user);
            console.log("Response received at addUser endpoint", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Backend error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }

);
export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (user: UserData, { rejectWithValue }) => {
        try {
            const response = await backendApi.put(`/users/update/${user.userId}`, user);
            return response.data;
        } catch (error: any) {
            console.error("Backend error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id: string) => {
        const response = await backendApi.delete(`/users/delete/${id}`);
        return response.data;
    }
);

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state:UserState) => {
                state.status = "loading";
            })
            .addCase(fetchUsers.fulfilled, (state:UserState, action:any) => {
                state.status = "success";
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state:UserState, action:any) => {
                state.error = action.error.message || "Failed to fetch users.";
            });
        builder
            .addCase(addUser.fulfilled, (state:UserState, action:any) => {
                state.users.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state:UserState, action:any) => {
                const index = state.users.findIndex(user => user.userId === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(deleteUser.fulfilled, (state:UserState, action:any) => {
                state.users = state.users.filter(user => user.userId !== action.payload.id);
            });
    },
});

export default userSlice.reducer;