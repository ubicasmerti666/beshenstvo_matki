import { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import { PostCard } from './PostCard';
import type { Post } from '../../types';
import toast from 'react-hot-toast';

export const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPosts = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const response = await postService.getPosts(pageNum, 10);
      setPosts(response.items);
      setTotalPages(response.pages);
    } catch (error: any) {
      toast.error('Ошибка загрузки постов');
      console.error('Load posts error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">
          Постов пока нет
        </p>
        <p className="text-gray-400">
          Будьте первым, кто создаст пост!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Список постов */}
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
  );
};