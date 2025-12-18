import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import { PostCard } from './PostCard';
import type { Post } from '../../types';

const mockPost: Post = {
  id: 1,
  title: 'Test Post Title',
  content: 'This is test post content',
  author_id: 1,
  author: 'test@example.com',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  likes_count: 5,
  comments_count: 3,
};

describe('PostCard', () => {
  it('должен отображать заголовок поста', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('должен отображать контент поста', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText(/This is test post content/)).toBeInTheDocument();
  });
  
  it('должен отображать кнопку "Читать далее"', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('Читать далее →')).toBeInTheDocument();
  });
});