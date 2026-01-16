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
    <div className="p-6 md:p-8">
      <h2 className="text-3xl font-light mb-8 flex items-center gap-3 text-white">
        <TrendingUp className="text-zinc-500" strokeWidth={1.5} /> Trending Now
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TRENDS.map(trend => (
          <div key={trend.id} className="bg-card rounded-none overflow-hidden border border-zinc-800 hover:border-zinc-500 transition-all group">
            <div className="relative aspect-[4/5] bg-zinc-900">
              <img src={trend.image} alt={trend.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              {trend.isAd && (
                <span className="absolute top-3 right-3 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2 text-white">{trend.title}</h3>
              <div className="flex justify-between items-center text-xs text-zinc-400 uppercase tracking-wide">
                <span className="flex items-center gap-1"><User size={12}/> {trend.author}</span>
                <span className="flex items-center gap-1 group-hover:text-white transition-colors"><Heart size={12}/> {trend.likes}</span>
              </div>
              <button className="mt-4 w-full border border-zinc-700 hover:bg-white hover:text-black hover:border-white text-zinc-300 text-xs py-3 font-bold uppercase tracking-widest transition-colors">
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