import { useState, useEffect } from 'react';
import { commentService } from '../../services/commentService';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import type { Comment } from '../../types';
import toast from 'react-hot-toast';

interface CommentListProps {
  postId: number;
}

export const CommentList = ({ postId }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await commentService.getPostComments(postId);
      setComments(data || []);
    } catch (error: any) {
      console.error('Load comments error:', error);
      toast.error('Ошибка загрузки комментариев');
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleCommentAdded = () => {
    loadComments();
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">
        Комментарии {!isLoading && `(${comments.length})`}
      </h3>

      {/* Форма добавления комментария */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      </div>

      {/* Список комментариев */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">
            Комментариев пока нет. Будьте первым!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};