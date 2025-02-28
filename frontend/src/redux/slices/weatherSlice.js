import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  weather: null,
  location: '',
  userLocation: null,
  loading: false,
  error: null
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeather: (state, action) => {
      state.weather = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setWeather, setLocation, setUserLocation, setLoading, setError } = weatherSlice.actions;
export default weatherSlice.reducer;
