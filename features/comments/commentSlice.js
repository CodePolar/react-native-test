import { createSlice } from "@reduxjs/toolkit";

export const commentSlice = createSlice({
    name: "comment",
    initialState: {
        comments: []
    },
    reducers: {
        create: (state, action) => {
            state.comments.push(action.payload);
        },
        update: (state, action) => {  
            state.name = action.payload.name;
        },
        destroy: (state, action) => {
            state.comments.pop();        
        },
        list: (state, action) => {
            state.comments = action.payload;
        }
    }
})



export const { create, update, destroy, list } = commentSlice.actions;

export default commentSlice.reducer;