import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const token = localStorage.getItem('moneypilot_token');

const initialState: AuthState = {
  user: null,
  token,
  status: token ? 'idle' : 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
      localStorage.setItem('moneypilot_token', action.payload.token);
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('moneypilot_token');
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'failed';
    },
    setAuthLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setAuthError,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;
