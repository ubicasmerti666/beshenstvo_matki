import { api } from './api';
import type { Post, CreatePostData, UpdatePostData, PaginatedResponse } from '../types';

export const postService = {
  // Получить все посты с пагинацией
  async getPosts(page: number = 1, size: number = 10): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>('/posts', {
      params: { page, size },
    });
    return response.data;
  },

  // Получить пост по ID
  async getPostById(id: number): Promise<Post> {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  // Создать пост
  async createPost(data: CreatePostData): Promise<Post> {
    const response = await api.post<Post>('/posts', data);
    return response.data;
  },

  // Обновить пост
  async updatePost(id: number, data: UpdatePostData): Promise<Post> {
    const response = await api.patch<Post>(`/posts/${id}`, data);
    return response.data;
  },

  // Удалить пост
  async deletePost(id: number): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

  // Получить посты пользователя
  async getUserPosts(userId: number, page: number = 1, size: number = 10): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>(`/users/${userId}/posts`, {
      params: { page, size },
    });
    return response.data;
  },
};  