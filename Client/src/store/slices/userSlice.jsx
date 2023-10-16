import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
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
    },
    updateSucess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false
      state.error = false
    },
    updateError: (state, action) => {
      state.loading = false
      state.error = true
    },
    deleteSuccess: (state, action) => {
      state.loading = false
      state.error = false
      state.currentUser = null
    },
    signoutSuccess: (state, action) => {
      state.loading = false
      state.error = false
      state.currentUser = null
    }
  },
});

export const {loginStart, loginFinish, loginError, updateSucess, updateError, signoutSuccess, deleteSuccess} = userSlice.actions
export const userReducer = userSlice.reducer;