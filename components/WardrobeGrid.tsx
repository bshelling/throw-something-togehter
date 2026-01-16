import React from 'react';
import { WardrobeItem } from '../types';
import { Shirt, Plus, Tag } from 'lucide-react';

interface Props {
  items: WardrobeItem[];
  onAddItem: () => void;
}

const WardrobeGrid: React.FC<Props> = ({ items, onAddItem }) => {
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-light text-white flex items-center gap-3">
          <Shirt className="text-zinc-400" strokeWidth={1.5} /> My Wardrobe
        </h2>
        <button 
          onClick={onAddItem}
          className="bg-primary hover:bg-white text-black px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-medium text-sm"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group relative bg-card rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all hover:shadow-xl">
            <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-900 relative">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 saturate-50 group-hover:saturate-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-white text-black px-2 py-1 rounded-sm font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{item.brand || 'Unbranded'} • {item.color}</p>
                </div>
                <Tag size={12} className="text-zinc-600 mt-1 shrink-0" />
              </div>
            </div>
          </div>
        ))}
        
        {/* Upload Placeholder */}
        <button 
          onClick={onAddItem}
          className="aspect-[3/4] rounded-lg border border-dashed border-zinc-700 hover:border-white bg-zinc-900/50 hover:bg-zinc-900 flex flex-col items-center justify-center text-zinc-500 hover:text-white transition-all group gap-4"
        >
          <div className="p-4 rounded-full bg-zinc-800 group-hover:bg-white group-hover:text-black transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-xs font-medium uppercase tracking-widest">Add Piece</span>
        </button>
      </div>
    </div>
  );
};

export default WardrobeGrid;