import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
};

export const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        setLoader: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
