import React, { useState } from 'react';
import WardrobeGrid from './components/WardrobeGrid';
import OutfitPlanner from './components/OutfitPlanner';
import TrendingStyles from './components/TrendingStyles';
import { INITIAL_WARDROBE } from './constants';
import { WardrobeItem } from './types';
import { LayoutDashboard, Shirt, Sparkles, TrendingUp, Menu, X, Plane } from 'lucide-react';

enum View {
  PLANNER = 'planner',
  WARDROBE = 'wardrobe',
  TRENDS = 'trends',
  TRAVEL = 'travel'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.PLANNER);
  const [inventory, setInventory] = useState<WardrobeItem[]>(INITIAL_WARDROBE);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAddItem = () => {
    // Simulation of adding an item
    const newItem: WardrobeItem = {
      id: Date.now().toString(),
      category: Object.values(import('./types').then(m => m.ClothingCategory))[0] as any, // lazy mock
      name: `New Item ${inventory.length + 1}`,
      color: 'Black',
      imageUrl: `https://picsum.photos/200/200?random=${Date.now()}`,
      tags: ['new', 'untagged']
    };
    setInventory([...inventory, newItem]);
    alert("Simulated Item Upload: In a real app, this would open a camera/file picker and use Gemini Vision to tag the item.");
  };

  const NavButton = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        currentView === view 
        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-dark text-slate-200 font-sans selection:bg-primary/30">
      
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-card rounded-lg border border-slate-700"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-slate-800 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">S</div>
            StyleMate
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">AI Wardrobe Assistant</p>
        </div>

        <nav className="px-4 space-y-2">
          <NavButton view={View.PLANNER} icon={Sparkles} label="Daily Planner" />
          <NavButton view={View.WARDROBE} icon={Shirt} label="My Wardrobe" />
          <NavButton view={View.TRENDS} icon={TrendingUp} label="Trends & Feed" />
          <NavButton view={View.TRAVEL} icon={Plane} label="Travel Packing" />
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
             <h4 className="text-sm font-semibold text-white">Upgrade to Pro</h4>
             <p className="text-xs text-slate-500 mt-1">Unlock advanced video styling and personal shopper.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden relative">
        {currentView === View.PLANNER && <OutfitPlanner inventory={inventory} />}
        {currentView === View.WARDROBE && <WardrobeGrid items={inventory} onAddItem={handleAddItem} />}
        {currentView === View.TRENDS && <TrendingStyles />}
        {currentView === View.TRAVEL && (
          <div className="flex items-center justify-center h-full text-slate-500">
             <div className="text-center">
               <Plane size={48} className="mx-auto mb-4 opacity-50" />
               <h2 className="text-xl font-bold text-white">Travel Mode</h2>
               <p>Use the Daily Planner with "Travel" occasion to pack efficiently.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
