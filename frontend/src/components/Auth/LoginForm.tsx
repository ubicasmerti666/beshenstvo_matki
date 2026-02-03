import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validation';
import type { LoginFormData } from '../../utils/validation';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { getUserIdFromToken } from '../../utils/jwt';
import toast from 'react-hot-toast';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const loginResponse = await authService.login(data);
      
      const userId = getUserIdFromToken(loginResponse.access_token);
      
      if (!userId) {
        throw new Error('Не удалось получить ID пользователя из токена');
      }
      
      localStorage.setItem('token', loginResponse.access_token);
      
      const user = await authService.getUserById(userId);
      
      login(user, loginResponse.access_token);
      
      toast.success('Вход выполнен успешно!');
      navigate('/');
    } catch (error: any) {
      localStorage.removeItem('token');
      
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'Неверный email или пароль';
      toast.error(message);
      console.error('Login error:', error.response?.data); // Для отладки
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Вход
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Нет аккаунта?{' '}
        <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Зарегистрироваться
        </a>
      </p>
    </div>
  );
};