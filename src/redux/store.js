import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import driversReducer from './driverSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    drivers: driversReducer,
  },
});
