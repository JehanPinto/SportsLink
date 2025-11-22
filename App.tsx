import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { store } from './src/app/store';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { loadFavourites, loadAuth, loadTheme, isTokenExpired } from './src/store/persistenceMiddleware';
import { loadFavouritesFromStorage } from './src/features/favourites/favouritesSlice';
import { restoreAuth, logout } from './src/features/auth/authSlice';
import { loadThemeFromStorage } from './src/features/ui/uiSlice';

function AppContent() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load persisted data from AsyncStorage on app start
    const initializeApp = async () => {
      try {
        // Check if token is expired first
        const expired = await isTokenExpired();
        
        if (expired) {
          console.log('Token expired, skipping auth restoration');
          // Load theme and favourites, skip auth
          const [savedTheme, savedFavourites] = await Promise.all([
            loadTheme(),
            loadFavourites(),
          ]);

          dispatch(loadThemeFromStorage(savedTheme));
          dispatch(loadFavouritesFromStorage(savedFavourites));
        } else {
          // Load auth, theme, and favourites in parallel
          const [savedAuth, savedTheme, savedFavourites] = await Promise.all([
            loadAuth(),
            loadTheme(),
            loadFavourites(),
          ]);

          // Restore auth state if valid
          if (savedAuth) {
            dispatch(restoreAuth(savedAuth));
          }

          // Restore theme
          dispatch(loadThemeFromStorage(savedTheme));

          // Restore favourites state
          dispatch(loadFavouritesFromStorage(savedFavourites));
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsReady(true);
      }
    };
    
    initializeApp();
  }, [dispatch]);

  // Auto-logout check every 5 minutes (optional)
  useEffect(() => {
    const interval = setInterval(async () => {
      const expired = await isTokenExpired();
      if (expired) {
        console.log('Token expired during session, logging out');
        dispatch(logout());
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  // Show loading screen while restoring state
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});