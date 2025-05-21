
import APIClient from '@/utils/api';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

describe('APIClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should make authenticated requests when token exists', async () => {
    const mockToken = 'test-token';
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' })
    });

    await APIClient.request('/test');

    expect(global.fetch).toHaveBeenCalledWith(expect.any(String), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockToken}`
      }
    });
  });

  it('should handle API errors', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request'
    });

    await expect(APIClient.request('/test')).rejects.toThrow('API Error: 400');
  });
});
