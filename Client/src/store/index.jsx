import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import { loginError, loginFinish, loginStart } from './slices/userSlice'

const store = configureStore({
  reducer: {
    user: userReducer
  },
});

export {store, loginStart, loginFinish, loginError}