import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import { loginError, loginFinish, loginStart, updateError,updateSucess } from './slices/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducers = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

// Create the store with Redux DevTools Extension
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export { loginStart, loginFinish, loginError, updateSucess, updateError };
