import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../constants/urls';

// Async thunk for fetching current trip
export const fetchCurrentTrip = createAsyncThunk(
  'trips/fetchCurrentTrip',
  async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/current-trip`);
    if (!response.ok) {
      throw new Error('Failed to fetch current trip');
    }
    const data = await response.json();
    return data;
  }
);

// Async thunk for cancelling current trip
export const cancelCurrentTrip = createAsyncThunk(
  'trips/cancelCurrentTrip',
  async (tripId) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/cancel`, {
      method: 'PUT'
    });
    if (!response.ok) {
      throw new Error('Failed to cancel trip');
    }
    return null;
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
      // Cancel current trip
      .addCase(cancelCurrentTrip.fulfilled, (state) => {
        state.currentTrip = null;
      });
  }
});

export default tripSlice.reducer;
