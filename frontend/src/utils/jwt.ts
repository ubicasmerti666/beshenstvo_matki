import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub?: string; // обычно здесь user_id
  user_id?: number;
  id?: number;
  exp?: number;
  iat?: number;
  // Добавь другие поля, если они есть в твоём токене
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  // Проверяем разные возможные поля для ID
  return decoded.user_id || decoded.id || (decoded.sub ? parseInt(decoded.sub) : null);
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  return Date.now() >= decoded.exp * 1000;
};