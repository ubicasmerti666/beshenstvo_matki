import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсептор для добавления токена к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Обработка ошибки сети
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Проблема с подключением к серверу. Проверьте интернет-соединение.',
        status: 0,
      });
    }

    const status = error.response.status;
    const data: any = error.response.data;

    // Логирование для отладки
    console.error('API Error:', {
      status,
      url: error.config?.url,
      method: error.config?.method,
      data,
    });

    // Обработка различных статусов
    switch (status) {
      case 400:
        // Ошибка валидации
        return Promise.reject({
          message: data?.detail || data?.message || 'Неверные данные',
          status: 400,
          errors: data?.errors,
        });

      case 401:
        // Неавторизован - удаляем токен и редиректим
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject({
          message: 'Сессия истекла. Пожалуйста, войдите снова.',
          status: 401,
        });

      case 403:
        // Нет прав доступа
        return Promise.reject({
          message: data?.detail || 'У вас нет прав для выполнения этого действия',
          status: 403,
        });

      case 404:
        // Не найдено
        return Promise.reject({
          message: data?.detail || 'Ресурс не найден',
          status: 404,
        });

      case 422:
        // Ошибка валидации (FastAPI)
        const validationErrors = data?.detail || [];
        const errorMessage = Array.isArray(validationErrors)
          ? validationErrors.map((err: any) => err.msg).join(', ')
          : data?.message || 'Ошибка валидации данных';
        
        return Promise.reject({
          message: errorMessage,
          status: 422,
          errors: validationErrors,
        });

      case 500:
      case 502:
      case 503:
        // Серверная ошибка
        return Promise.reject({
          message: 'Ошибка на сервере. Попробуйте позже.',
          status,
        });

      default:
        return Promise.reject({
          message: data?.detail || data?.message || 'Произошла неизвестная ошибка',
          status,
        });
    }
  }
);