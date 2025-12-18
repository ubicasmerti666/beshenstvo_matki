import { describe, it, expect } from 'vitest';
import { getUserIdFromToken, isTokenExpired } from '../utils/jwt';

describe('JWT Utils', () => {
  describe('getUserIdFromToken', () => {
    it('должен извлекать user_id из токена', () => {
      // Тестовый JWT токен с payload: { user_id: 123 }
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsImV4cCI6OTk5OTk5OTk5OX0.signature';
      
      const userId = getUserIdFromToken(token);
      expect(userId).toBe(123);
    });

    it('должен возвращать null для невалидного токена', () => {
      const invalidToken = 'invalid.token.here';
      
      const userId = getUserIdFromToken(invalidToken);
      expect(userId).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('должен возвращать true для истёкшего токена', () => {
      // Токен с exp в прошлом
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsImV4cCI6MTAwMDAwMDAwMH0.signature';
      
      const isExpired = isTokenExpired(expiredToken);
      expect(isExpired).toBe(true);
    });

    it('должен возвращать true для невалидного токена', () => {
      const invalidToken = 'invalid.token';
      
      const isExpired = isTokenExpired(invalidToken);
      expect(isExpired).toBe(true);
    });
  });
});