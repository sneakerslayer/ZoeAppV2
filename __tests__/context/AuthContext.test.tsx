
import { render, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

jest.mock('expo-secure-store');
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

const TestComponent = () => {
  const auth = useAuth();
  return null;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce(null) // userId
      .mockResolvedValueOnce(null); // email

    let auth;
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('userId');
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('email');
    });
  });

  it('should handle login successfully', async () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      const { login } = useAuth();
      await login(mockEmail, mockPassword);
    });

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('email', mockEmail);
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });

  it('should handle logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      const { logout } = useAuth();
      await logout();
    });

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('userId');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('email');
    expect(router.replace).toHaveBeenCalledWith('/login');
  });
});
