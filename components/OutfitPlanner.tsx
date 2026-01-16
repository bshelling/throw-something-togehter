import React, { useState, useEffect } from 'react';
import { WardrobeItem, OutfitRecommendation, CalendarEvent, UserMood } from '../types';
import { generateOutfitPlan, generateOutfitVisual } from '../services/geminiService';
import { Sparkles, MapPin, Calendar, Heart, ShoppingBag, Loader2, Share2, Plus, Trash2, LocateFixed, RefreshCw, ChevronLeft, ChevronRight, Wind } from 'lucide-react';
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

  // Calendar Week State
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  // Initialize Week (Find recent Sunday)
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    setCurrentWeekStart(sunday);
  }, []);

  // Update WeekDays when week start changes
  useEffect(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      return d;
    });
    setWeekDays(days);
  }, [currentWeekStart]);

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  // Location Handler
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
        date: selectedDate,
        title, 
        time: 'TBD', 
        type: import('../types').then(m => m.Occasion.CASUAL) as any 
      }]);
    }
  };

  const handleRemoveEvent = (id: string) => {
    setSchedule(schedule.filter(e => e.id !== id));
  };

  // Get events for selected date
  const todaysEvents = schedule.filter(e => e.date === selectedDate);
  
  // Format selected date for display
  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00'); // hack to avoid timezone shifts
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleGenerate = async () => {
    if (!process.env.API_KEY) {
      alert("Please set your API_KEY in the environment variables.");
      return;
    }

    if (todaysEvents.length === 0 && !customRequest) {
      const proceed = confirm(`No events scheduled for ${formatDateDisplay(selectedDate)}. Proceed with a default 'Casual Day'?`);
      if (!proceed) return;
    }

    setLoading(true);
    setRecommendation(null);
    setGeneratedImage(null);

    // Format schedule for AI
    const scheduleString = todaysEvents.length > 0 
      ? todaysEvents.map(e => `[${e.time}] ${e.title}`).join(', ')
      : "General Casual Day";

    try {
      // 1. Generate Plan
      const rec = await generateOutfitPlan(inventory, {
        targetDate: formatDateDisplay(selectedDate),
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
      <div className="w-full lg:w-1/3 p-6 md:p-8 bg-card border-r border-zinc-800 overflow-y-auto h-full custom-scrollbar">
        <h2 className="text-2xl font-light mb-8 flex items-center gap-2 text-white">
          <Sparkles className="text-zinc-400" strokeWidth={1.5} /> Stylist
        </h2>

        <div className="space-y-8">
          
          {/* 1. Location */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
              <MapPin size={12} /> Location
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-white outline-none transition-colors placeholder-zinc-600"
                placeholder="City, State"
              />
              <button 
                onClick={handleGeolocation}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-white p-3 rounded-lg transition-all"
                title="Use Current Location"
              >
                <LocateFixed size={20} />
              </button>
            </div>
          </div>

          {/* 2. Calendar Window */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <label className="text-xs font-bold text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
                <Calendar size={12} /> Weekly Plan
              </label>
               <div className="flex items-center gap-2">
                 <button onClick={handlePrevWeek} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"><ChevronLeft size={16}/></button>
                 <span className="text-xs text-zinc-400 font-mono">
                   {weekDays[0]?.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - {weekDays[6]?.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                 </span>
                 <button onClick={handleNextWeek} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"><ChevronRight size={16}/></button>
               </div>
            </div>

            {/* Date Strip */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((d) => {
                const dateStr = d.toISOString().split('T')[0];
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`flex flex-col items-center justify-center p-2 rounded-md transition-all border ${
                      isSelected 
                        ? 'bg-primary text-black border-primary' 
                        : 'bg-zinc-900 text-zinc-500 border-zinc-900 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
                    <span className={`text-sm font-bold ${isToday && !isSelected ? 'text-white underline decoration-zinc-500' : ''}`}>
                      {d.getDate()}
                    </span>
                  </button>
                )
              })}
            </div>
            
            {/* Agenda List */}
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 overflow-hidden min-h-[120px]">
              <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800 flex justify-between items-center">
                 <span className="text-xs font-semibold text-zinc-300">{formatDateDisplay(selectedDate)}</span>
                 {!isCalendarConnected && (
                    <button 
                      onClick={handleConnectCalendar}
                      disabled={calendarLoading}
                      className="text-[10px] bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 px-2 py-0.5 rounded transition-all flex items-center gap-1"
                    >
                      {calendarLoading ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />} Sync
                    </button>
                 )}
              </div>

              {todaysEvents.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-sm">
                  <p>No events scheduled.</p>
                  <button onClick={handleAddEvent} className="mt-3 text-white hover:text-zinc-300 font-medium text-xs flex items-center justify-center gap-1 mx-auto border border-zinc-700 px-3 py-1 rounded-full">
                    <Plus size={12} /> Add Event
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {todaysEvents.map((evt) => (
                    <div key={evt.id} className="p-3 flex items-center justify-between group hover:bg-zinc-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-zinc-500 w-16">{evt.time}</div>
                        <div className="text-sm text-zinc-200 font-medium">{evt.title}</div>
                      </div>
                      <button onClick={() => handleRemoveEvent(evt.id)} className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                   <button onClick={handleAddEvent} className="w-full py-2 text-xs text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1">
                    <Plus size={12} /> Add Event
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Mood */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
              <Heart size={12} /> Mood & Feel
            </label>
            <div className="grid grid-cols-1 gap-2">
              <select 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-white outline-none appearance-none"
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
              <div className="text-xs text-zinc-500 bg-zinc-900 p-2 rounded border border-zinc-800 italic">
                {selectedMood.value}
              </div>
            </div>
          </div>

           {/* 4. Notes */}
           <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Notes</label>
            <textarea 
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="e.g. I want to wear my red shoes, or avoid tight belts."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-white outline-none h-20 resize-none placeholder-zinc-600"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-bold text-md transition-all flex items-center justify-center gap-2 uppercase tracking-wide ${
              loading ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed' : 'bg-primary text-black hover:bg-white'
            }`}
          >
            {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><Sparkles size={18} /> Generate Look</>}
          </button>
        </div>
      </div>

      {/* RIGHT: Display */}
      <div className="w-full lg:w-2/3 bg-dark overflow-y-auto p-6 md:p-10 relative custom-scrollbar">
        {!recommendation && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-60">
            <div className="w-16 h-16 border border-zinc-700 rounded-full flex items-center justify-center mb-6">
              <Sparkles size={24} className="text-zinc-500" />
            </div>
            <p className="text-2xl font-light text-white mb-2">Throw something together.</p>
            <p className="text-sm">Select a date, check your mood, and generate a look.</p>
          </div>
        )}

        {loading && (
           <div className="h-full flex flex-col items-center justify-center text-zinc-400">
             <div className="relative mb-8">
                <Loader2 size={48} className="animate-spin text-white" />
             </div>
             <p className="text-lg font-light text-white">Forecasting & Styling</p>
             <p className="text-sm text-zinc-600 mt-2">Targeting {formatDateDisplay(selectedDate)} for {location}</p>
           </div>
        )}

        {recommendation && (
          <div className="space-y-10 animate-fade-in pb-10 max-w-4xl mx-auto">
            {/* Header */}
            <div>
               <div className="flex items-center gap-2 mb-4">
                 <span className="text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded uppercase tracking-wider">
                    {formatDateDisplay(selectedDate)}
                 </span>
               </div>
               <h1 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
                 {recommendation.title}
               </h1>
               <div className="flex flex-wrap gap-3 mb-6">
                  <div className="border border-zinc-700 bg-zinc-900 px-4 py-1.5 rounded-full text-zinc-300 text-sm flex items-center gap-2">
                    <Wind size={14} /> {recommendation.weatherNote}
                  </div>
                  <div className="border border-zinc-700 bg-zinc-900 px-4 py-1.5 rounded-full text-zinc-300 text-sm flex items-center gap-2">
                    <span>{selectedMood.icon}</span> {recommendation.moodMatch}
                  </div>
               </div>
               <p className="text-zinc-400 text-lg leading-relaxed font-light">
                 {recommendation.reasoning}
               </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {/* Selected Items */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-3 mb-5">Wardrobe Selection</h3>
                  <div className="space-y-4">
                    {recommendation.items.map(item => (
                      <div key={item.id} className="bg-card rounded-none p-4 flex items-center gap-4 border border-zinc-800 hover:border-zinc-600 transition-colors">
                        <img src={item.imageUrl} className="w-16 h-16 object-cover bg-zinc-900 grayscale hover:grayscale-0 transition-all duration-500" alt={item.name} />
                        <div className="overflow-hidden">
                          <p className="text-base font-medium text-white truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mt-1">{item.category} • {item.brand}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gap Analysis / Shopping */}
                {recommendation.missingItems.length > 0 && (
                  <div className="bg-zinc-900 p-6 border border-dashed border-zinc-700">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 uppercase tracking-widest">
                      <ShoppingBag size={14} /> Missing Essentials
                    </h3>
                    <div className="space-y-3">
                      {recommendation.missingItems.map((gap, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-black/40 p-3 border border-zinc-800">
                          <div>
                            <p className="text-sm font-medium text-zinc-200">{gap.name}</p>
                            <p className="text-xs text-zinc-500 italic mt-0.5">{gap.reason}</p>
                          </div>
                          <button className="text-[10px] bg-white text-black px-3 py-1 uppercase font-bold tracking-wider hover:bg-zinc-200 transition-colors">
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
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-3 mb-5 flex justify-between items-center">
                   Visual Preview
                   {generatingImage && <span className="text-[10px] text-zinc-400 animate-pulse">RENDERING...</span>}
                </h3>
                
                <div className="aspect-[3/4] w-full bg-zinc-900 overflow-hidden relative group border border-zinc-800">
                  {generatedImage ? (
                    <>
                      <img src={generatedImage} alt="Generated Look" className="w-full h-full object-cover saturate-[.8] contrast-125 hover:saturate-100 transition-all duration-700" />
                      <div className="absolute top-4 right-4 flex gap-2">
                         <button className="p-3 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors shadow-xl">
                            <Share2 size={16} />
                         </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm text-zinc-300 font-light leading-relaxed">{recommendation.description}</p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center flex-col text-zinc-600 gap-6">
                      {generatingImage ? (
                         <Loader2 size={32} className="animate-spin text-white" />
                      ) : (
                        <div className="w-20 h-20 border border-zinc-800 rounded-full flex items-center justify-center">
                           <Sparkles size={32} strokeWidth={1} />
                        </div>
                      )}
                      <span className="text-xs tracking-widest uppercase">{generatingImage ? 'Generating Visual...' : 'Waiting for input'}</span>
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