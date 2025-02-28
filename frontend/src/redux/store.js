import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import tripReducer from './slices/tripSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    trips: tripReducer,
  },
});

export default store;
