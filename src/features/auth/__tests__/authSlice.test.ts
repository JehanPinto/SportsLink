import authReducer, {
  setCredentials,
  logout,
  restoreAuth,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthToken,
} from '../authSlice';
import type { RootState } from '../../../app/store';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockToken = 'mock-jwt-token-123';

  describe('reducers', () => {
    it('should return the initial state', () => {
      const result = authReducer(undefined, { type: 'unknown' });
      expect(result).toEqual(initialState);
    });

    it('should handle setCredentials', () => {
      const actual = authReducer(
        initialState,
        setCredentials({ user: mockUser, token: mockToken })
      );

      expect(actual.user).toEqual(mockUser);
      expect(actual.token).toEqual(mockToken);
      expect(actual.isAuthenticated).toBe(true);
    });

    it('should handle logout', () => {
      const authenticatedState = {
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
      };

      const actual = authReducer(authenticatedState, logout());

      expect(actual.user).toBeNull();
      expect(actual.token).toBeNull();
      expect(actual.isAuthenticated).toBe(false);
    });

    it('should handle restoreAuth with valid payload', () => {
      const actual = authReducer(
        initialState,
        restoreAuth({ user: mockUser, token: mockToken })
      );

      expect(actual.user).toEqual(mockUser);
      expect(actual.token).toEqual(mockToken);
      expect(actual.isAuthenticated).toBe(true);
    });
  });

  describe('selectors', () => {
    const mockState = {
      auth: {
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
      },
    } as RootState;

    it('should select current user', () => {
      expect(selectCurrentUser(mockState)).toEqual(mockUser);
    });

    it('should select isAuthenticated status', () => {
      expect(selectIsAuthenticated(mockState)).toBe(true);
    });

    it('should select auth token', () => {
      expect(selectAuthToken(mockState)).toEqual(mockToken);
    });

    it('should return false when not authenticated', () => {
      const unauthState = {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
        },
      } as RootState;

      expect(selectIsAuthenticated(unauthState)).toBe(false);
    });
  });
});