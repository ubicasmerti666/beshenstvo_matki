import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  login: z
    .string()
    .min(3, 'Логин должен быть не менее 3 символов')
    .max(20, 'Логин должен быть не более 20 символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Только латинские буквы, цифры и _'),
  
  email: z
    .string()
    .email('Введите корректный email')
    .min(1, 'Email обязателен'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const EditProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login: updateAuthContext } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      login: user?.login || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser = await userService.updateProfile(user.id, data);
      
      // Обновляем данные в контексте
      const token = localStorage.getItem('token');
      if (token) {
        updateAuthContext(updatedUser, token);
      }

      toast.success('Профиль обновлён!');
      navigate(`/profile/${user.id}`);
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || 'Ошибка обновления профиля';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Редактировать профиль
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Логин */}
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
                Логин
              </label>
              <input
                id="login"
                type="text"
                {...register('login')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.login ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.login && (
                <p className="mt-1 text-sm text-red-600">{errors.login.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                />
                {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
                </div>
                        {/* Кнопки */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/profile/${user?.id}`)}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
);
};