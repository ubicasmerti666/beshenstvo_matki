import { api } from './api';
import type { Post, PaginatedResponse } from '../types';

export const interactionService = {
  // Лайки
  async likePost(postId: number): Promise<void> {
    await api.post(`/posts/${postId}/like`);
  },

  // Избранное
  async addToFavorites(postId: number): Promise<void> {
    await api.post(`/post/${postId}/favorite`);
  },

  // Получить избранные посты
  async getFavoritePosts(page: number = 1, size: number = 10): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>('/favorites', {
      params: { page, size },
    });
    return response.data;
  },
};