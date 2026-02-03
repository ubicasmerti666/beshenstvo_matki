// Пользователь
export interface User {
    id: number;
    email: string;
    login: string;
    created_at: string;
    updated_at: string;
  }
  
  // Данные для регистрации
  export interface RegisterData {
    login: string;
    email: string;
    password: string;
  }
  
  // Данные для входа
  export interface LoginData {
    email: string;
    password: string;
  }
  
  // Ответ при регистрации (без токена)
  export interface RegisterResponse {
    id: number;
    email: string;
    login: string;
    created_at: string;
    updated_at: string;
  }
  
  // Ответ при логине
  export interface LoginResponse {
    access_token: string;
    token_type: string;
  }
  
  // Пост
  export interface Post {
    id: number;
    title: string;
    content: string;
    author_id: number;
    author: string;
    created_at: string;
    updated_at: string;
    likes_count?: number;
    comments_count?: number;
  }
  
  // Данные для создания поста
  export interface CreatePostData {
    title: string;
    content: string;
  }
  
  // Данные для обновления поста
  export interface UpdatePostData {
    title?: string;
    content?: string;
  }
  
  // Пагинация
  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }

  export interface SearchParams {
    query: string;
    page?: number;
    size?: number;
  }
  
  // Данные для обновления профиля
  export interface UpdateProfileData {
    login?: string;
    email?: string;
    bio?: string;
    avatar?: string;
  }
  
  // Данные для смены пароля
  export interface ChangePasswordData {
    old_password: string;
    new_password: string;
  }

  export interface Comment {
    id: number;
    content: string;
    author_id: number;
    author: string;
    post_id: number;
    created_at: string;
    updated_at: string;
  }
  
  // Данные для создания комментария
  export interface CreateCommentData {
    content: string;
  }
  
  // Данные для обновления комментария
  export interface UpdateCommentData {
    content: string;
  }
  
  // Лайк
  export interface Like {
    id: number;
    user_id: number;
    post_id: number;
    created_at: string;
  }
  
  // Избранное
  export interface Favorite {
    id: number;
    user_id: number;
    post_id: number;
    created_at: string;
  }