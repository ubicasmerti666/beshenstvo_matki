import { api } from './api';
import type { Comment, CreateCommentData, UpdateCommentData } from '../types';

export const commentService = {
  // Получить комментарии поста
  async getPostComments(postId: number): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`/comments/post/${postId}`);
    return response.data;
  },

  // Создать комментарий
  async createComment(postId: number, data: CreateCommentData): Promise<Comment> {
    const response = await api.post<Comment>(`/comments/post/${postId}`, data);
    return response.data;
  },

  // Обновить комментарий
  async updateComment(commentId: number, data: UpdateCommentData): Promise<Comment> {
    const response = await api.patch<Comment>(`/comments/${commentId}`, data);
    return response.data;
  },

  // Удалить комментарий
  async deleteComment(commentId: number): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};