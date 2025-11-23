import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  registerLocalUser,
  loginLocalUser,
  getLocalUsers,
} from '../localAuthStorage';

describe('localAuthStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerLocalUser', () => {
    it('should register a new user successfully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const newUser = await registerLocalUser({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(newUser).toHaveProperty('id');
      expect(newUser.username).toBe('testuser');
      expect(newUser.email).toBe('test@test.com');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should throw error for duplicate username', async () => {
      const existingUsers = [
        {
          id: '1',
          username: 'testuser',
          email: 'other@test.com',
          password: 'pass',
          firstName: 'Test',
          lastName: 'User',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingUsers)
      );

      await expect(
        registerLocalUser({
          username: 'testuser',
          email: 'new@test.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
        })
      ).rejects.toThrow('Username already exists');
    });

    it('should throw error for duplicate email', async () => {
      const existingUsers = [
        {
          id: '1',
          username: 'otheruser',
          email: 'test@test.com',
          password: 'pass',
          firstName: 'Test',
          lastName: 'User',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingUsers)
      );

      await expect(
        registerLocalUser({
          username: 'newuser',
          email: 'test@test.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('loginLocalUser', () => {
    it('should return user on successful login', async () => {
      const users = [
        {
          id: '1',
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(users));

      const user = await loginLocalUser('testuser', 'password123');

      expect(user).not.toBeNull();
      expect(user?.username).toBe('testuser');
      expect(user?.email).toBe('test@test.com');
    });

    it('should return null for invalid username', async () => {
      const users = [
        {
          id: '1',
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(users));

      const user = await loginLocalUser('wronguser', 'password123');

      expect(user).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const users = [
        {
          id: '1',
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(users));

      const user = await loginLocalUser('testuser', 'wrongpassword');

      expect(user).toBeNull();
    });
  });

  describe('getLocalUsers', () => {
    it('should return empty array when no users exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const users = await getLocalUsers();

      expect(users).toEqual([]);
    });

    it('should return all registered users', async () => {
      const mockUsers = [
        {
          id: '1',
          username: 'user1',
          email: 'user1@test.com',
          password: 'pass1',
          firstName: 'User',
          lastName: 'One',
        },
        {
          id: '2',
          username: 'user2',
          email: 'user2@test.com',
          password: 'pass2',
          firstName: 'User',
          lastName: 'Two',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockUsers)
      );

      const users = await getLocalUsers();

      expect(users).toHaveLength(2);
      expect(users[0].username).toBe('user1');
      expect(users[1].username).toBe('user2');
    });
  });
});