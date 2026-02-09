import { memo } from 'react';
import { BlogPost } from '../../types';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = memo(({ post }: BlogCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="text-sm text-text-light mb-2">{post.date}</div>
      <h3 className="text-lg font-bold text-text-dark mb-3">{post.title}</h3>
      <p className="text-sm text-text-light mb-4 leading-relaxed line-clamp-3">
        {post.excerpt}
      </p>
      <a
        href={post.link}
        className="text-accent-green hover:underline font-medium text-sm"
      >
        Read full post
      </a>
    </div>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;
