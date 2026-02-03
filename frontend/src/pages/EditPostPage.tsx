import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { PostForm } from '../components/Posts/PostForm';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';
import toast from 'react-hot-toast';

export const EditPostPage = () => {
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
        
        // Проверяем, что пользователь - автор поста
        if (data.author_id !== user?.id) {
          toast.error('Вы не можете редактировать чужой пост');
          navigate('/');
          return;
        }

        setPost(data);
      } catch (error: any) {
        toast.error('Пост не найден');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id, navigate, user?.id]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Навигация */}
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 
            className="text-xl font-bold text-gray-800 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            Blog Platform
          </h1>
          <span className="text-gray-600">{user?.login}</span>
        </div>
      </nav>

      {/* Контент */}
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Редактировать пост
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <PostForm
            mode="edit"
            postId={post.id}
            initialData={{
              title: post.title,
              content: post.content,
            }}
          />
        </div>
      </div>
    </div>
  );
};