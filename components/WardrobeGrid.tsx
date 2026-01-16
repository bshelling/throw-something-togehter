import React from 'react';
import { WardrobeItem } from '../types';
import { Shirt, Plus, Tag } from 'lucide-react';

interface Props {
  items: WardrobeItem[];
  onAddItem: () => void;
}

const WardrobeGrid: React.FC<Props> = ({ items, onAddItem }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shirt className="text-primary" /> My Wardrobe
        </h2>
        <button 
          onClick={onAddItem}
          className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative bg-card rounded-xl overflow-hidden border border-slate-700 hover:border-primary transition-all shadow-lg hover:shadow-primary/20">
            <div className="aspect-square w-full overflow-hidden bg-slate-800 relative">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                  <p className="text-xs text-slate-400">{item.brand || 'Unbranded'} • {item.color}</p>
                </div>
                <Tag size={14} className="text-slate-500 mt-1" />
              </div>
            </div>
          </div>
        ))}
        
        {/* Upload Placeholder */}
        <button 
          onClick={onAddItem}
          className="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-primary bg-slate-800/50 hover:bg-slate-800 flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-all group"
        >
          <div className="p-4 rounded-full bg-slate-900 group-hover:bg-primary/20 mb-3 transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-sm font-medium">Add New Piece</span>
        </button>
      </div>
    </div>
  );
};

export default WardrobeGrid;
