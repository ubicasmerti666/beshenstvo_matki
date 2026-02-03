import { useNavigate } from 'react-router-dom';
import { PostForm } from '../components/Posts/PostForm.tsx';
import { useAuth } from '../context/AuthContext';

export const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Навигация */}
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 cursor-pointer" onClick={() => navigate('/')}>
            Blog Platform
          </h1>
          <span className="text-gray-600">{user?.login}</span>
        </div>
      </nav>

      {/* Контент */}
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Создать новый пост
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <PostForm mode="create" />
        </div>
      </div>
    </div>
  );
};