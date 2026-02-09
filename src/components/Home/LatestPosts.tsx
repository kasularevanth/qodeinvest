import { memo } from 'react';
import { BlogPost } from '../../types';
import BlogCard from './BlogCard';

interface LatestPostsProps {
  posts: BlogPost[];
}

const LatestPosts = memo(({ posts }: LatestPostsProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-text-dark mb-6">Latest Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, index) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>
    </div>
  );
});

LatestPosts.displayName = 'LatestPosts';

export default LatestPosts;
