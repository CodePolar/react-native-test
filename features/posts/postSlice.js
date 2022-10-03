import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: []
    },
    reducers: {
        create: (state, action) => {
            state.posts.push(action.payload);
        },
        update: (state, action) => {  
            state.name = action.payload.name;
        },
        destroy: (state, action) => {
            state.name = action.payload.name;        
        },
        list: (state, action) => {
            state.posts = action.payload;
        }
    }
})



export const { create, update, destroy, list } = postSlice.actions;

export default postSlice.reducer;