import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, postSchema, commentSchema } from '../utils/validation';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять невалидный email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен требовать пароль', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        login: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять несовпадающие пароли', () => {
      const invalidData = {
        login: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен требовать минимум 3 символа в логине', () => {
      const invalidData = {
        login: 'ab',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('postSchema', () => {
    it('должен валидировать корректный пост', () => {
      const validData = {
        title: 'Test Post',
        content: 'This is a test post content.',
      };

      const result = postSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять слишком короткий заголовок', () => {
      const invalidData = {
        title: 'ab',
        content: 'This is a test post content.',
      };

      const result = postSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять слишком короткий контент', () => {
      const invalidData = {
        title: 'Test Post',
        content: 'short',
      };

      const result = postSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('commentSchema', () => {
    it('должен валидировать корректный комментарий', () => {
      const validData = {
        content: 'This is a comment',
      };

      const result = commentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять пустой комментарий', () => {
      const invalidData = {
        content: '',
      };

      const result = commentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});