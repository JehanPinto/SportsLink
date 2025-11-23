import { configureStore } from '@reduxjs/toolkit';
import { sportsApi } from '../api/sportsApi';
import { authApi } from '../api/authApi';
import authReducer from '../features/auth/authSlice';
import favouritesReducer from '../features/favourites/favouritesSlice';
import uiReducer from '../features/ui/uiSlice'; // NEW
import { persistenceMiddleware } from '../store/persistenceMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouritesReducer,
    ui: uiReducer, // NEW
    [sportsApi.reducerPath]: sportsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(sportsApi.middleware)
      .concat(authApi.middleware)
      .concat(persistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
