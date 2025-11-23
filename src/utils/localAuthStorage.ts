import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_USERS_KEY = '@sportify:local_users';

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  password: string; // In production, hash this!
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
}

// Get all registered users
export const getLocalUsers = async (): Promise<LocalUser[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(LOCAL_USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error getting local users:', error);
    return [];
  }
};

// Register a new user
export const registerLocalUser = async (user: Omit<LocalUser, 'id'>): Promise<LocalUser> => {
  try {
    const users = await getLocalUsers();
    
    // Check if username or email already exists
    const existingUser = users.find(
      u => u.username === user.username || u.email === user.email
    );
    
    if (existingUser) {
      throw new Error(
        existingUser.username === user.username 
          ? 'Username already exists' 
          : 'Email already exists'
      );
    }
    
    // Create new user with unique ID
    const newUser: LocalUser = {
      ...user,
      id: Date.now().toString(),
    };
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(
      LOCAL_USERS_KEY,
      JSON.stringify([...users, newUser])
    );
    
    return newUser;
  } catch (error) {
    throw error;
  }
};

// Login with local user
export const loginLocalUser = async (
  username: string,
  password: string
): Promise<LocalUser | null> => {
  try {
    const users = await getLocalUsers();
    const user = users.find(
      u => u.username === username && u.password === password
    );
    return user || null;
  } catch (error) {
    console.error('Error logging in local user:', error);
    return null;
  }
};

// Check if username exists
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  const users = await getLocalUsers();
  return users.some(u => u.username === username);
};

// Check if email exists
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const users = await getLocalUsers();
  return users.some(u => u.email === email);
};