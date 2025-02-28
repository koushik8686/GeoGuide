import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/urls';

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Async thunk for fetching current trip
export const fetchCurrentTrip = createAsyncThunk(
  'trips/fetchCurrent',
  async (userId) => {
    const response = await axiosInstance.get('/trips/current');
    return response.data;
  }
);

// Async thunk for cancelling current trip
export const cancelCurrentTrip = createAsyncThunk(
  'trips/cancel',
  async (tripId) => {
    const response = await axiosInstance.delete(`/trips/${tripId}`);
    return response.data;
  }
);

// Async thunk for completing current trip
export const completeCurrentTrip = createAsyncThunk(
  'trips/complete',
  async (tripId) => {
    const response = await axiosInstance.post(`/trips/complete/${tripId}`);
    return response.data;
  }
);

const tripSlice = createSlice({
  name: 'trips',
  initialState: {
    currentTrip: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch current trip
      .addCase(fetchCurrentTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrip = action.payload;
      })
      .addCase(fetchCurrentTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Cancel trip
      .addCase(cancelCurrentTrip.fulfilled, (state) => {
        state.currentTrip = null;
      })
      // Complete trip
      .addCase(completeCurrentTrip.fulfilled, (state) => {
        state.currentTrip = null;
      });
  }
});

export default tripSlice.reducer;
