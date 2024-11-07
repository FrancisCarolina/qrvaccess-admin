import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  drivers: [],
};

const driverSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    setDrivers: (state, action) => {
      state.drivers = action.payload;
    },
    clearDrivers: (state) => {
      state.drivers = [];
    },
  },
});

export const selectDrivers = (state) => state.drivers.drivers;

export const { setDrivers, clearDrivers } = driverSlice.actions;

export default driverSlice.reducer;
