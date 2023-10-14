import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState:{
    currentUser: null,
    loading: false,
    error: false
  },
  reducers: {
    loginStart: (state, action) => {
        state.loading = true
    },
    loginFinish: (state, action) => {
        state.currentUser = action.payload
        state.loading = false,
        state.error = false
    },
    loginError: (state, action) => {
        state.error = action.payload,
        state.loading = false
    }
  },
});

export const {loginStart, loginFinish, loginError} = userSlice.actions
export const userReducer = userSlice.reducer;