import React, { useState } from 'react';
import { WardrobeItem, OutfitRecommendation, CalendarEvent, UserMood } from '../types';
import { generateOutfitPlan, generateOutfitVisual } from '../services/geminiService';
import { Sparkles, MapPin, Calendar, Heart, ShoppingBag, Loader2, Share2, Plus, Trash2, LocateFixed, RefreshCw } from 'lucide-react';
import { MOODS, MOCK_CALENDAR_EVENTS } from '../constants';

interface Props {
  inventory: WardrobeItem[];
}

const OutfitPlanner: React.FC<Props> = ({ inventory }) => {
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Form State
  const [schedule, setSchedule] = useState<CalendarEvent[]>([]);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  
  const [selectedMood, setSelectedMood] = useState<UserMood>(MOODS[0]);
  const [location, setLocation] = useState<string>('New York, NY');
  const [customRequest, setCustomRequest] = useState('');

  // Location Handler
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app we might reverse geocode, but coordinates work fine for the prompt
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          alert("Could not get location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Calendar Handler
  const handleConnectCalendar = () => {
    setCalendarLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSchedule(MOCK_CALENDAR_EVENTS);
      setIsCalendarConnected(true);
      setCalendarLoading(false);
    }, 1000);
  };

  const handleAddEvent = () => {
    const title = prompt("Enter event title:");
    if (title) {
      setSchedule([...schedule, { 
        id: Date.now().toString(), 
        title, 
        time: 'TBD', 
        type: import('../types').then(m => m.Occasion.CASUAL) as any 
      }]);
    }
  };

  const handleRemoveEvent = (id: string) => {
    setSchedule(schedule.filter(e => e.id !== id));
  };

  const handleGenerate = async () => {
    if (!process.env.API_KEY) {
      alert("Please set your API_KEY in the environment variables.");
      return;
    }

    if (schedule.length === 0 && !customRequest) {
      const proceed = confirm("Your schedule is empty. Proceed with a default 'Casual Day'?");
      if (!proceed) return;
    }

    setLoading(true);
    setRecommendation(null);
    setGeneratedImage(null);

    // Format schedule for AI
    const scheduleString = schedule.length > 0 
      ? schedule.map(e => `[${e.time}] ${e.title}`).join(', ')
      : "General Casual Day";

    try {
      // 1. Generate Plan
      const rec = await generateOutfitPlan(inventory, {
        schedule: scheduleString,
        mood: `${selectedMood.label} (${selectedMood.value})`,
        location,
        customRequest
      });
      setRecommendation(rec);
      setLoading(false);

      // 2. Generate Image (Async separate step to show text first)
      setGeneratingImage(true);
      const visual = await generateOutfitVisual(rec.description + " " + rec.items.map(i => i.name).join(", "));
      setGeneratedImage(visual);
      setGeneratingImage(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
      setGeneratingImage(false);
      alert("Failed to generate outfit. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* LEFT: Controls */}
      <div className="w-full lg:w-1/3 p-6 bg-card border-r border-slate-700 overflow-y-auto h-full custom-scrollbar">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="text-secondary" /> AI Stylist
        </h2>

        <div className="space-y-8">
          
          {/* 1. Location & Weather */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
              <MapPin size={14} /> Location (Weather)
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
                placeholder="City, State"
              />
              <button 
                onClick={handleGeolocation}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-3 rounded-lg transition-all tooltip"
                title="Use Current Location"
              >
                <LocateFixed size={20} />
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              *Weather data is fetched automatically based on location.
            </p>
          </div>

          {/* 2. Schedule / Calendar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                <Calendar size={14} /> Today's Agenda
              </label>
              {!isCalendarConnected && (
                <button 
                  onClick={handleConnectCalendar}
                  disabled={calendarLoading}
                  className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded hover:bg-indigo-500/20 transition-all flex items-center gap-1"
                >
                  {calendarLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                  Sync Calendar
                </button>
              )}
            </div>

            <div className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
              {schedule.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  <p>No events scheduled.</p>
                  <button onClick={handleAddEvent} className="mt-2 text-primary hover:text-indigo-400 font-medium text-xs flex items-center justify-center gap-1 mx-auto">
                    <Plus size={12} /> Add Event Manually
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {schedule.map((evt) => (
                    <div key={evt.id} className="p-3 flex items-center justify-between group hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-slate-400 w-16">{evt.time}</div>
                        <div className="text-sm text-slate-200 font-medium">{evt.title}</div>
                      </div>
                      <button onClick={() => handleRemoveEvent(evt.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                   <button onClick={handleAddEvent} className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-1">
                    <Plus size={12} /> Add Another Event
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Mood/Behavioral */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
              <Heart size={14} /> Mood & Feel
            </label>
            <div className="grid grid-cols-1 gap-2">
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none appearance-none"
                onChange={(e) => {
                  const m = MOODS.find(mood => mood.label === e.target.value);
                  if (m) setSelectedMood(m);
                }}
                value={selectedMood.label}
              >
                {MOODS.map(m => (
                  <option key={m.label} value={m.label}>{m.icon} {m.label}</option>
                ))}
              </select>
              <div className="text-xs text-slate-400 bg-slate-800 p-2 rounded border border-slate-700">
                {selectedMood.value}
              </div>
            </div>
          </div>

           {/* 4. Custom Request */}
           <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Notes</label>
            <textarea 
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="e.g. I want to wear my red shoes, or avoid tight belts."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-primary outline-none h-20 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 ${
              loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-secondary hover:brightness-110'
            }`}
          >
            {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><Sparkles /> Generate Outfit</>}
          </button>
        </div>
      </div>

      {/* RIGHT: Display */}
      <div className="w-full lg:w-2/3 bg-dark overflow-y-auto p-6 md:p-10 relative custom-scrollbar">
        {!recommendation && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
            <Sparkles size={64} className="mb-4 text-slate-700" />
            <p className="text-xl font-light">Ready to style your day?</p>
            <p className="text-sm">Connect your calendar or add events to begin.</p>
          </div>
        )}

        {loading && (
           <div className="h-full flex flex-col items-center justify-center text-slate-300">
             <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <Loader2 size={64} className="animate-spin text-primary relative z-10" />
             </div>
             <p className="mt-6 text-lg animate-pulse font-medium">Reviewing your schedule & checking weather...</p>
             <p className="text-sm text-slate-500 mt-2">Planning specifically for: {location}</p>
           </div>
        )}

        {recommendation && (
          <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div>
               <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
                 {recommendation.title}
               </h1>
               <p className="text-slate-400 text-lg leading-relaxed border-l-4 border-primary pl-4 py-1">
                 {recommendation.reasoning}
               </p>
            </div>

            {/* Weather & Mood Tags */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full text-blue-300 text-sm flex items-center gap-2">
                <span className="text-lg">🌤️</span> {recommendation.weatherNote}
              </div>
              <div className="bg-pink-500/10 border border-pink-500/30 px-4 py-2 rounded-full text-pink-300 text-sm flex items-center gap-2">
                 <span className="text-lg">{selectedMood.icon}</span> {recommendation.moodMatch}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Selected Items */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 mb-4">Wardrobe Selection</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {recommendation.items.map(item => (
                      <div key={item.id} className="bg-card rounded-lg p-3 flex items-center gap-3 border border-slate-700 shadow-sm">
                        <img src={item.imageUrl} className="w-14 h-14 rounded object-cover bg-slate-800" alt={item.name} />
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-white truncate">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gap Analysis / Shopping */}
                {recommendation.missingItems.length > 0 && (
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-yellow-500/20 shadow-lg">
                    <h3 className="text-md font-semibold text-yellow-400 flex items-center gap-2 mb-4">
                      <ShoppingBag size={18} /> Recommended Additions
                    </h3>
                    <div className="space-y-3">
                      {recommendation.missingItems.map((gap, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                          <div>
                            <p className="text-sm font-medium text-white">{gap.name}</p>
                            <p className="text-xs text-slate-400 italic">{gap.reason}</p>
                          </div>
                          <button className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-slate-200 transition-colors">
                            Shop
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Visual Generation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 flex justify-between items-center">
                   Visual Preview
                   {generatingImage && <span className="text-xs text-primary animate-pulse">Running Diffusion Model...</span>}
                </h3>
                
                <div className="aspect-[3/4] w-full bg-slate-900 rounded-xl overflow-hidden relative group shadow-2xl border border-slate-800">
                  {generatedImage ? (
                    <>
                      <img src={generatedImage} alt="Generated Look" className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 flex gap-2">
                         <button className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-colors">
                            <Share2 size={18} />
                         </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-sm text-slate-300">{recommendation.description}</p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center flex-col text-slate-600 gap-4">
                      {generatingImage ? (
                         <Loader2 size={40} className="animate-spin text-secondary" />
                      ) : (
                        <Sparkles size={40} />
                      )}
                      <span className="text-sm">{generatingImage ? 'Creating visual...' : 'Waiting for details...'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutfitPlanner;
