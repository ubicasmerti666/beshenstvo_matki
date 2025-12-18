import { useState } from 'react';
import { interactionService } from '../../services/interactionService';
import toast from 'react-hot-toast';

interface PostActionsProps {
  postId: number;
  initialLikesCount?: number;
  initialIsLiked?: boolean;
  initialIsFavorited?: boolean;
}

export const PostActions = ({ 
  postId, 
  initialLikesCount = 0,
  initialIsLiked = false,
  initialIsFavorited = false
}: PostActionsProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;
  
    setIsLoading(true);
    const prevLiked = isLiked;
    const prevLikesCount = likesCount;
  
    try {
      // ✅ ОДИН вызов — бэкенд сам toggle'ит!
      await interactionService.likePost(postId);
      
      // Меняем состояние локально
      setIsLiked(!isLiked);
      setLikesCount((prev) => isLiked ? Math.max(0, prev - 1) : prev + 1);
      
      toast.success(isLiked ? 'Лайк убран' : 'Лайк поставлен');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Ошибка при изменении лайка');
      setIsLiked(prevLiked);
      setLikesCount(prevLikesCount);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFavorite = async () => {
    if (isLoading) return;
  
    setIsLoading(true);
    const prevFavorited = isFavorited;
  
    try {
      // ✅ ОДИН вызов — бэкенд сам toggle'ит!
      await interactionService.addToFavorites(postId);
      
      // Меняем состояние локально
      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? 'Убрано из избранного' : 'Добавлено в избранное');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Ошибка с избранным');
      setIsFavorited(prevFavorited);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex items-center gap-4">
      {/* Кнопка лайка */}
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${
          isLiked
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
        <span className="font-medium">{likesCount}</span>
      </button>

      {/* Кнопка избранного */}
      <button
        onClick={handleFavorite}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${
          isFavorited
            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span className="text-xl">{isFavorited ? '⭐' : '☆'}</span>
        <span className="font-medium">{isFavorited ? 'В избранном' : 'В избранное'}</span>
      </button>
    </div>
  );
};