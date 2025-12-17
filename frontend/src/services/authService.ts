import { api } from './api';
import type { User, LoginData, RegisterData, RegisterResponse, LoginResponse } from '../types';

export const authService = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<LoginResponse> {
    // Преобразуем данные в формат x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', data.email); // 👈 Используем email как username
    formData.append('password', data.password);
    formData.append('grant_type', '');
    formData.append('scope', '');
    formData.append('client_id', '');
    formData.append('client_secret', '');

    const response = await api.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 👈 Изменили тип контента
      },
    });
    return response.data;
  },

  async getUserById(userId: number): Promise<User> {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};