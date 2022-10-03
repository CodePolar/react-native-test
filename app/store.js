import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice';
import postReducer from "../features/posts/postSlice";
import commentReducer from '../features/comments/commentSlice';

export default configureStore({
  reducer: {
    posts: postReducer,
    user: authReducer,
    comments: commentReducer
  },
})
