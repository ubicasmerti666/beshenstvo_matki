import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../../utils/validation';
import type { RegisterFormData } from '../../utils/validation'; // 👈 type
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      
      // 1. Регистрируем пользователя
      const userResponse = await authService.register(registerData);
      
      // 2. Автоматически логинимся с теми же данными
      const loginResponse = await authService.login({
        email: registerData.email,
        password: registerData.password,
      });
      
      // 3. Сохраняем токен и данные пользователя
      // Используем данные из регистрации (они уже полные)
      login(userResponse, loginResponse.access_token);
      
      toast.success('Регистрация успешна!');
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка регистрации';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Регистрация
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Логин */}
        <div>
          <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
            Логин
          </label>
          <input
            id="login"
            type="text"
            {...register('login')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.login ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="johndoe"
          />
          {errors.login && (
            <p className="mt-1 text-sm text-red-600">{errors.login.message}</p>
          )}
        </div>

        {/* Email */}
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

        {/* Пароль */}
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

        {/* Подтверждение пароля */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Подтвердите пароль
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Уже есть аккаунт?{' '}
        <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Войти
        </a>
      </p>
    </div>
  );
};