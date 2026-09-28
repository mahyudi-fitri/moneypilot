import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dataReducer from './dataSlice';

// A store factory keeps state per-request instead of shared across requests
// when client components are pre-rendered on the server.
export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      data: dataReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
