import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import type { User, Post } from '../types';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = currentUser?.id === Number(userId);

  useEffect(() => {
    const loadProfile = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
          // ✅ ТОЛЬКО профиль, БЕЗ постов с бэка
          const userData = await userService.getUserById(parseInt(userId));
          setUser(userData);
          setPosts([]); // ✅ Пустой массив
        } catch (error: any) {
          toast.error('Ошибка загрузки профиля');
          navigate('/');
        } finally {
          setIsLoading(false);
        }
      };

    loadProfile();
  }, [userId, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  if (!user) {
    return null;
  }

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
            <span className="text-gray-600">{currentUser?.login}</span>
          </div>
        </div>
      </nav>

      {/* Контент */}
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        {/* Информация о пользователе */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {user.login}
              </h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-400 text-sm mt-2">
                Зарегистрирован: {formatDate(user.created_at)}
              </p>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => navigate('/profile/edit')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                ✏️ Редактировать профиль
              </button>
            )}
          </div>

          {/* Статистика */}
          <div className="flex gap-6 pt-6 border-t border-gray-200">
            
          </div>
        </div>

        
      </div>
    </div>
  );
};