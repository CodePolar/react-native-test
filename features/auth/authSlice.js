import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null
    },
    reducers: {
        signIn: (state, action) => {
            state.user = action.payload;
        },
        signOut: (state, action) => {
            state.user = null;
        }
    }
})



export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;