
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://api.example.com/v1'; // Replace with your API endpoint

class APIClient {
  private static async getAuthToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('authToken');
  }

  static async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
}

export default APIClient;
