import { Middleware } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../app/store';

const FAVOURITES_STORAGE_KEY = '@sportify:favourites';
const AUTH_TOKEN_KEY = '@sportify:auth_token';
const AUTH_USER_KEY = '@sportify:auth_user';
const TOKEN_EXPIRY_KEY = '@sportify:token_expiry';

// Token expires after 7 days (adjust as needed)
const TOKEN_EXPIRY_DAYS = 7;

export const persistenceMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save favourites to AsyncStorage whenever they change
  if (action.type?.startsWith('favourites/')) {
    const state = store.getState();
    AsyncStorage.setItem(
      FAVOURITES_STORAGE_KEY,
      JSON.stringify(state.favourites)
    ).catch((error) => {
      console.error('Error saving favourites to storage:', error);
    });
  }

  // Save auth state when user logs in
  if (action.type === 'auth/setCredentials') {
    const { token, user } = action.payload;
    
    // Calculate expiration time
    const expiryTime = Date.now() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    
    Promise.all([
      AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
      AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user)),
      AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString()),
    ]).catch((error) => {
      console.error('Error saving auth to storage:', error);
    });
  }

  // Clear auth state when user logs out
  if (action.type === 'auth/logout') {
    AsyncStorage.multiRemove([
      AUTH_TOKEN_KEY, 
      AUTH_USER_KEY,
      TOKEN_EXPIRY_KEY,
    ]).catch((error) => {
      console.error('Error clearing auth from storage:', error);
    });
  }
  
  return result;
};

// Load favourites from storage
export const loadFavourites = async () => {
  try {
    const savedFavourites = await AsyncStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (savedFavourites) {
      return JSON.parse(savedFavourites);
    }
  } catch (error) {
    console.error('Error loading favourites from storage:', error);
  }
  return null;
};

// Load auth from storage with expiration check
export const loadAuth = async () => {
  try {
    const [token, userString, expiryString] = await AsyncStorage.multiGet([
      AUTH_TOKEN_KEY,
      AUTH_USER_KEY,
      TOKEN_EXPIRY_KEY,
    ]);

    const authToken = token[1];
    const user = userString[1] ? JSON.parse(userString[1]) : null;
    const expiry = expiryString[1] ? parseInt(expiryString[1], 10) : null;

    // Check if token exists and is valid
    if (authToken && user && expiry) {
      // Check if token has expired
      if (Date.now() > expiry) {
        console.log('Token has expired, clearing auth data');
        // Token expired, clear storage
        await AsyncStorage.multiRemove([
          AUTH_TOKEN_KEY,
          AUTH_USER_KEY,
          TOKEN_EXPIRY_KEY,
        ]);
        return null;
      }

      // Token is still valid
      console.log('Token is valid, restoring auth');
      return { token: authToken, user };
    }
  } catch (error) {
    console.error('Error loading auth from storage:', error);
  }
  return null;
};

// Clear all storage (for logout)
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.multiRemove([
      FAVOURITES_STORAGE_KEY,
      AUTH_TOKEN_KEY,
      AUTH_USER_KEY,
      TOKEN_EXPIRY_KEY,
    ]);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// Check if token is expired (can be called anytime)
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const expiryString = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryString) return true;
    
    const expiry = parseInt(expiryString, 10);
    return Date.now() > expiry;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};