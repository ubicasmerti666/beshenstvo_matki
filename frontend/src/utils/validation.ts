import { z } from 'zod';

// Схема для регистрации
export const registerSchema = z.object({
  login: z
    .string()
    .min(3, 'Логин должен быть не менее 3 символов')
    .max(20, 'Логин должен быть не более 20 символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Только латинские буквы, цифры и _'),
  
  email: z
    .string()
    .email('Введите корректный email')
    .min(1, 'Email обязателен'),
  
  password: z
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(50, 'Пароль должен быть не более 50 символов'),
  
  confirmPassword: z.string().min(1, 'Подтвердите пароль'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

// Схема для входа
export const loginSchema = z.object({
  email: z
    .string()
    .email('Введите корректный email')
    .min(1, 'Email обязателен'),
  
  password: z
    .string()
    .min(1, 'Пароль обязателен'),
});

export const postSchema = z.object({
    title: z
      .string()
      .min(3, 'Заголовок должен быть не менее 3 символов')
      .max(200, 'Заголовок должен быть не более 200 символов'),
    
    content: z
      .string()
      .min(10, 'Содержимое должно быть не менее 10 символов')
      .max(10000, 'Содержимое должно быть не более 10000 символов'),
  });

export const commentSchema = z.object({
    content: z
      .string()
      .min(1, 'Комментарий не может быть пустым')
      .max(1000, 'Комментарий должен быть не более 1000 символов'),
  });
  
export type CommentFormData = z.infer<typeof commentSchema>;
  
export type PostFormData = z.infer<typeof postSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;