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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        currentView === view 
        ? 'bg-primary text-black shadow-lg shadow-white/5 font-semibold' 
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-dark text-zinc-200 font-sans">
      
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-card rounded-lg border border-zinc-800 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-card border-r border-zinc-800 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 pb-8">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-white text-black flex items-center justify-center font-serif text-lg">T</div>
            <div className="leading-none">
              Throw something<br/>together.
            </div>
          </h1>
        </div>

        <nav className="px-4 space-y-1">
          <NavButton view={View.PLANNER} icon={Sparkles} label="Forecast" />
          <NavButton view={View.WARDROBE} icon={Shirt} label="My Wardrobe" />
          <NavButton view={View.TRENDS} icon={TrendingUp} label="Trends & Feed" />
          <NavButton view={View.TRAVEL} icon={Plane} label="Travel Planning" />
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
             <h4 className="text-sm font-semibold text-white">Pro Access</h4>
             <p className="text-xs text-zinc-500 mt-1">Unlock advanced video styling and personal shopper.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden relative bg-dark">
        {currentView === View.PLANNER && <OutfitPlanner inventory={inventory} />}
        {currentView === View.WARDROBE && <WardrobeGrid items={inventory} onAddItem={handleAddItem} />}
        {currentView === View.TRENDS && <TrendingStyles />}
        {currentView === View.TRAVEL && (
          <div className="flex items-center justify-center h-full text-zinc-500">
             <div className="text-center">
               <Plane size={48} className="mx-auto mb-4 opacity-30" />
               <h2 className="text-xl font-bold text-white mb-2">Travel Mode</h2>
               <p className="text-sm">Use the Daily Planner with "Travel" occasion to pack efficiently.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;