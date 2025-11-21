import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Check if SecureStore is available on this platform
 */
const isSecureStoreAvailable = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return false;
  }
  
  try {
    await SecureStore.isAvailableAsync();
    return true;
  } catch {
    return false;
  }
};

/**
 * Save a token securely to expo-secure-store or AsyncStorage as fallback
 */
export const saveToken = async (key: string, value: string): Promise<void> => {
  try {
    const stringValue = typeof value === 'string' ? value : String(value);
    
    const useSecureStore = await isSecureStoreAvailable();
    
    if (useSecureStore) {
      await SecureStore.setItemAsync(key, stringValue);
    } else {
      // Fallback to AsyncStorage for web or unsupported platforms
      await AsyncStorage.setItem(key, stringValue);
    }
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

/**
 * Retrieve a token from expo-secure-store or AsyncStorage as fallback
 */
export const getToken = async (key: string): Promise<string | null> => {
  try {
    const useSecureStore = await isSecureStoreAvailable();
    
    if (useSecureStore) {
      return await SecureStore.getItemAsync(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Delete a token from expo-secure-store or AsyncStorage as fallback
 */
export const deleteToken = async (key: string): Promise<void> => {
  try {
    const useSecureStore = await isSecureStoreAvailable();
    
    if (useSecureStore) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error deleting token:', error);
    throw error;
  }
};