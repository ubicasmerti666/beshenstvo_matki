import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postSchema } from '../../utils/validation';
import type { PostFormData } from '../../utils/validation';
import { postService } from '../../services/postService';
import toast from 'react-hot-toast';

interface PostFormProps {
  initialData?: PostFormData;
  postId?: number;
  mode?: 'create' | 'edit';
}

export const PostForm = ({ initialData, postId, mode = 'create' }: PostFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: PostFormData) => {
    setIsLoading(true);
    try {
      if (mode === 'edit' && postId) {
        await postService.updatePost(postId, data);
        toast.success('Пост обновлён!');
        navigate(`/posts/${postId}`);
      } else {
        const newPost = await postService.createPost(data);
        toast.success('Пост создан!');
        navigate(`/posts/${newPost.id}`);
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || 'Ошибка при сохранении поста';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Заголовок */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Заголовок
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Введите заголовок поста"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Содержимое */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Содержимое
        </label>
        <textarea
          id="content"
          {...register('content')}
          rows={12}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Напишите свой пост..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* Кнопки */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Сохранение...' : mode === 'edit' ? 'Обновить пост' : 'Опубликовать'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};