import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import libraryReducer from './slices/librarySlice';
import preferencesReducer from './slices/preferencesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    library: libraryReducer,
    preferences: preferencesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
