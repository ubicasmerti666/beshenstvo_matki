import { useNavigate } from 'react-router-dom';
import type { Post } from '../../types';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPreview = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <article
      onClick={() => navigate(`/posts/${post.id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer"
    >
      {/* Заголовок */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
        {post.title}
      </h2>

      {/* Автор и дата */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>
          `User #${post.author_id}`
        </span>
        <span className="mx-2">•</span>
        <span>{formatDate(post.created_at)}</span>
      </div>

      {/* Превью контента */}
      <p className="text-gray-600 mb-4 whitespace-pre-line">
        {getPreview(post.content)}
      </p>

      {/* Футер с информацией */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          {post.likes_count !== undefined && (
            <span className="flex items-center gap-1">
              ❤️ {post.likes_count}
            </span>
          )}
          {post.comments_count !== undefined && (
            <span className="flex items-center gap-1">
              💬 {post.comments_count}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/posts/${post.id}`);
          }}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Читать далее →
        </button>
      </div>
    </article>
  );
};