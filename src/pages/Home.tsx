import { memo } from 'react';
import InfoCard from '../components/Home/InfoCard';
import LatestPosts from '../components/Home/LatestPosts';
import { blogPosts } from '../data/blogPosts';

const Home = memo(() => {
  const infoCards = [
    {
      title: 'Get started',
      description:
        'Read our getting started guide to get the most out of your Capitalmind subscription.',
      icon: '↗',
    },
    {
      title: 'Community',
      description:
        'Join the conversation on our exclusive community on Slack for Capitalmind Premium subscribers',
      icon: '↗',
    },
    {
      title: 'Visit website',
      description: 'Keep up with our latest content on our website',
      icon: '↗',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark mb-8">Home</h1>
      
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {infoCards.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}
      </div>

      {/* Latest Posts */}
      <LatestPosts posts={blogPosts} />
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
