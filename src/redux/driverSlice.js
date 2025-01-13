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
    updateDriver: (state, action) => {
      const { id, updatedDriver } = action.payload;
      const index = state.drivers.findIndex((driver) => driver.id === id);
      if (index !== -1) {
        state.drivers[index] = { ...state.drivers[index], ...updatedDriver };
      }
    },
  },
});

export const selectDrivers = (state) => state.drivers.drivers;

export const { setDrivers, clearDrivers, updateDriver } = driverSlice.actions;

export default driverSlice.reducer;
