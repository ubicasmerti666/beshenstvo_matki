import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PostList } from '../components/Posts/PostList';

export const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Навигация */}
      <nav className="w-full bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 cursor-pointer" onClick={() => navigate('/')}>
            Blog Platform
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/favorites')}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
            >
              ⭐ Избранное
            </button>
            <button
              onClick={() => navigate('/posts/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              + Создать пост
            </button>
            <button
              onClick={() => navigate(`/profile/${user?.id}`)}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              👤 {user?.login}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </nav>

      {/* Контент */}
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Лента постов
        </h2>
        <PostList />
      </div>
    </div>
  );
};