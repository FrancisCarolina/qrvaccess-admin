import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    drivers: [],
};

const driversSlice = createSlice({
    name: 'drivers',
    initialState,
    reducers: {
        setDrivers: (state, action) => {
            state.drivers = action.payload;
        },
    },
});

export const { setDrivers } = driversSlice.actions;

export const selectDrivers = (state) => state.drivers.drivers;

export default driversSlice.reducer;
