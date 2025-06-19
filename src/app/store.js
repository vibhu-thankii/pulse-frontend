/* ========================================================================== */
/* FILE: src/app/store.js (UPDATED)                                           */
/* ========================================================================== */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import competitorsReducer from '../features/competitors/competitorsSlice';
import newsReducer from '../features/news/newsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    competitors: competitorsReducer,
    news: newsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});