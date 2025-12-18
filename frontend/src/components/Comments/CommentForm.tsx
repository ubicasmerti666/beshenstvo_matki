import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { commentSchema } from '../../utils/validation';
import type { CommentFormData } from '../../utils/validation';
import { commentService } from '../../services/commentService';
import toast from 'react-hot-toast';

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

export const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsLoading(true);
    try {
      await commentService.createComment(postId, {
        content: data.content,
      });
      toast.success('Комментарий добавлен');
      reset();
      onCommentAdded();
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || 'Ошибка при добавлении комментария';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Написать комментарий
        </label>
        <textarea
          id="content"
          {...register('content')}
          rows={3}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ваш комментарий..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Отправка...' : 'Отправить комментарий'}
      </button>
    </form>
  );
};