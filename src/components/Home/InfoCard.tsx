import { memo } from 'react';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: string;
}

const InfoCard = memo(({ title, description, icon }: InfoCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 relative hover:shadow-md transition-shadow">
      {icon && (
        <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400">
          <span className="text-xl">↗</span>
        </div>
      )}
      <h3 className="text-lg font-bold text-text-dark mb-2 pr-8">{title}</h3>
      <p className="text-sm text-text-light leading-relaxed">{description}</p>
    </div>
  );
});

InfoCard.displayName = 'InfoCard';

export default InfoCard;
