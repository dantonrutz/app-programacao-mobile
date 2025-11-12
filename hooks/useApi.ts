import { BACKEND_URL } from '@/app/components/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

export function useApi() {
  // Função interna para pegar headers
  const getHeaders = useCallback(async () => {
    const token = await AsyncStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  }, []);

  const handleResponse = async (response: Response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.message || 'Erro ao fazer requisição';
      throw new Error(message);
    }
    return data;
  };

  const get = useCallback(
    async (endpoint: string) => {
      const headers = await getHeaders();
      const response = await fetch(`${BACKEND_URL}${endpoint}`, { method: 'GET', headers });
      return handleResponse(response);
    },
    [getHeaders]
  );

  const post = useCallback(
    async (endpoint: string, body: any) => {
      const headers = await getHeaders();
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      return handleResponse(response);
    },
    [getHeaders]
  );

  const put = useCallback(
    async (endpoint: string, body: any) => {
      const headers = await getHeaders();
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });
      return handleResponse(response);
    },
    [getHeaders]
  );

  const patch = useCallback(
    async (endpoint: string, body: any) => {
      const headers = await getHeaders();
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });
      return handleResponse(response);
    },
    [getHeaders]
  );

  const del = useCallback(
    async (endpoint: string) => {
      const headers = await getHeaders();
      const response = await fetch(`${BACKEND_URL}${endpoint}`, { method: 'DELETE', headers });
      return handleResponse(response);
    },
    [getHeaders]
  );

  return { get, post, put, patch, delete: del };
}
