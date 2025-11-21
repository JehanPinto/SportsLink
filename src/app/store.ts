import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { sportsApi } from '../api/sportsApi';
import { authApi } from '../api/authApi';
import authReducer from '../features/auth/authSlice';
import favouritesReducer from '../features/favourites/favouritesSlice';

export const store = configureStore({
  reducer: {
    [sportsApi.reducerPath]: sportsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    favourites: favouritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(sportsApi.middleware)
      .concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;