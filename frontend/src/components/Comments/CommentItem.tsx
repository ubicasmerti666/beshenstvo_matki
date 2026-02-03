import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commentService } from '../../services/commentService';
import type { Comment } from '../../types';
import toast from 'react-hot-toast';

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: number) => void;
}

export const CommentItem = ({ comment, onDelete }: CommentItemProps) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = user?.id === comment.author_id;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить комментарий?')) return;

    setIsDeleting(true);
    try {
      await commentService.deleteComment(comment.id);
      onDelete(comment.id);
      toast.success('Комментарий удалён');
    } catch (error: any) {
      toast.error('Ошибка при удалении комментария');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">
            {comment.author} {/* 👈 Теперь это строка */}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(comment.created_at)}
          </span>
        </div>
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
          >
            🗑️ Удалить
          </button>
        )}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap break-words">
        {comment.content}
      </p>
    </div>
  );
};