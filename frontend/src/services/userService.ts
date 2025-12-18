import { api } from './api';
import type { User, UpdateProfileData, ChangePasswordData, PaginatedResponse, SearchParams } from '../types';

export const userService = {
  // Получить пользователя по ID
  async getUserById(userId: number): Promise<User> {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },

  // Обновить профиль
  async updateProfile(userId: number, data: UpdateProfileData): Promise<User> {
    const response = await api.patch<User>(`/users/${userId}`, data);
    return response.data;
  },

  // Сменить пароль
  async changePassword(userId: number, data: ChangePasswordData): Promise<void> {
    await api.post(`/users/${userId}/change-password`, data);
  },

  // Поиск пользователей
  async searchUsers(params: SearchParams): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>('/users/search', {
      params: {
        q: params.query,
        page: params.page || 1,
        size: params.size || 10,
      },
    });
    return response.data;
  },

  // Получить всех пользователей (опционально)
  async getUsers(page: number = 1, size: number = 10): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>('/users', {
      params: { page, size },
    });
    return response.data;
  },
};