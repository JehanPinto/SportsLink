import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_USERS_KEY = '@sportify:local_users';

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
}

// Get all registered users
export const getLocalUsers = async (): Promise<LocalUser[]> => {
  const usersJson = await AsyncStorage.getItem(LOCAL_USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Register a new user
export const registerLocalUser = async (user: Omit<LocalUser, 'id'>): Promise<LocalUser> => {
  const users = await getLocalUsers();
  
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
  
  const newUser: LocalUser = {
    ...user,
    id: Date.now().toString(),
  };
  
  await AsyncStorage.setItem(
    LOCAL_USERS_KEY,
    JSON.stringify([...users, newUser])
  );
  
  return newUser;
};

// Login with local user
export const loginLocalUser = async (
  username: string,
  password: string
): Promise<LocalUser | null> => {
  const users = await getLocalUsers();
  const user = users.find(
    u => u.username === username && u.password === password
  );
  return user || null;
};