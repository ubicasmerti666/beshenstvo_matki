import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { PostActions } from '../components/Posts/PostActions';
import { CommentList } from '../components/Comments/CommentList';
import type { Post } from '../types';
import toast from 'react-hot-toast';

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await postService.getPostById(parseInt(id));
        setPost(data);
      } catch (error: any) {
        toast.error('Пост не найден');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!post || !window.confirm('Вы уверены, что хотите удалить этот пост?')) return;

    try {
      await postService.deletePost(post.id);
      toast.success('Пост удалён');
      navigate('/');
    } catch (error: any) {
      toast.error('Ошибка при удалении поста');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <nav className="w-full bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 
              className="text-xl font-bold text-gray-800 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              Blog Platform
            </h1>
          </div>
        </nav>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const isAuthor = user?.id === post.author_id;

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
        <article className="bg-white rounded-lg shadow-md p-8 mb-8">
          {/* Заголовок */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4 break-words">
            {post.title}
          </h1>

          {/* Метаинформация */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">
                <div className="font-semibold text-gray-900">{post.author}</div>
              </span>
              <span className="mx-2">•</span>
              <span>{formatDate(post.created_at)}</span>
            </div>

            {/* Кнопки управления (только для автора) */}
            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  ✏️ Редактировать
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  🗑️ Удалить
                </button>
              </div>
            )}
          </div>

          {/* Контент поста */}
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 text-lg whitespace-pre-wrap break-words leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Кнопки лайка и избранного */}
          <div className="pt-6 border-t border-gray-200">
            <PostActions postId={post.id} initialLikesCount={post.likes_count} />
          </div>
        </article>

        {/* Комментарии */}
        <CommentList postId={post.id} />
      </div>
    </div>
  );
};