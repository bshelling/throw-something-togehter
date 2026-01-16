import React from 'react';
import { TrendingUp, User, Heart } from 'lucide-react';

const TRENDS = [
  { id: 1, title: 'Old Money Aesthetic', image: 'https://picsum.photos/400/500?random=10', author: 'Vogue', likes: '12k' },
  { id: 2, title: '90s Minimalist', image: 'https://picsum.photos/400/500?random=11', author: 'StyleCaster', likes: '8.5k' },
  { id: 3, title: 'Fall Layers', image: 'https://picsum.photos/400/500?random=12', author: 'Ralph Lauren', likes: '22k', isAd: true },
  { id: 4, title: 'Utility Chic', image: 'https://picsum.photos/400/500?random=13', author: 'Hypebeast', likes: '5k' },
];

const TrendingStyles: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="text-pink-500" /> Trending Now
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TRENDS.map(trend => (
          <div key={trend.id} className="bg-card rounded-xl overflow-hidden border border-slate-700 hover:border-pink-500/50 transition-all group">
            <div className="relative aspect-[4/5]">
              <img src={trend.image} alt={trend.title} className="w-full h-full object-cover" />
              {trend.isAd && (
                <span className="absolute top-2 right-2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Featured Collection
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{trend.title}</h3>
              <div className="flex justify-between items-center text-sm text-slate-400">
                <span className="flex items-center gap-1"><User size={14}/> {trend.author}</span>
                <span className="flex items-center gap-1 group-hover:text-pink-500 transition-colors"><Heart size={14}/> {trend.likes}</span>
              </div>
              <button className="mt-3 w-full border border-slate-600 hover:bg-slate-700 text-sm py-2 rounded-lg transition-colors">
                Emulate Look
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingStyles;
