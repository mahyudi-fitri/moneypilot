import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';
import { clearToken, setToken } from '@/lib/token';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Rendered on the server first, so the token is hydrated on the client by
// <AuthBootstrap /> instead of being read at module evaluation time.
const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
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
      setToken(action.payload.token);
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      clearToken();
    },
    hydrateToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
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
  hydrateToken,
  clearCredentials,
  setAuthError,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;
