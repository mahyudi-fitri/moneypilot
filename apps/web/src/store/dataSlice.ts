import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '@/api/client';
import type { DashboardSummary } from '@/types';

interface DataState {
  summary: DashboardSummary | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DataState = {
  summary: null,
  status: 'idle',
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk(
  'data/fetchDashboardSummary',
  async () => {
    const res = await api.get('/dashboard/summary');
    return res.data as DashboardSummary;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearData(state) {
      state.summary = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action: PayloadAction<DashboardSummary>) => {
        state.summary = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load dashboard';
      });
  },
});

export const { clearData } = dataSlice.actions;
export default dataSlice.reducer;
