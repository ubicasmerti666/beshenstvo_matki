import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interactionService } from '../services/interactionService';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/Posts/PostCard';
import type { Post } from '../types';
import toast from 'react-hot-toast';

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadFavorites = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const response = await interactionService.getFavoritePosts(pageNum, 10);
      setPosts(response.items);
      setTotalPages(response.pages);
    } catch (error: any) {
      toast.error('Ошибка загрузки избранного');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites(page);
  }, [page]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Навигация */}
      <nav className="w-full bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 
            className="text-xl font-bold text-gray-800 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            Blog Platform
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Назад к ленте
            </button>
            <button
              onClick={() => navigate(`/profile/${user?.id}`)}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              👤 {user?.login}
            </button>
          </div>
        </div>
      </nav>

      {/* Контент */}
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          ⭐ Избранное
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              У вас пока нет избранных постов
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Перейти к ленте
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Назад
                </button>

                <span className="px-4 py-2 text-gray-600">
                  Страница {page} из {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Вперёд →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};