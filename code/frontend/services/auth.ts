import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export class AuthService {
  private static async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('clerk_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  public static async initializeSession(sessionId: string): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/auth/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize session');
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error initializing session:', error);
      return false;
    }
  }

  public static async validateSession(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return false;
      }

      const response = await fetch(`${API_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }
}