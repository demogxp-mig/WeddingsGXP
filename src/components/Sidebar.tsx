import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  CheckSquare, 
  Clock, 
  Settings, 
  Sparkles,
  HeartHandshake,
  ArrowLeft,
  ChevronDown,
  FolderOpen
} from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { NavigationTab } from '../types/wedding';

interface SidebarProps {
  onOpenSettings: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onOpenSettings, 
  mobileOpen, 
  onCloseMobile 
}) => {
  const { 
    settings, 
    activeTab, 
    setActiveTab, 
    countdown, 
    projects, 
    currentProjectId, 
    selectProject 
  } = useWedding();

  const [switcherOpen, setSwitcherOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'guests', label: 'Guests & RSVPs', icon: Users },
    { id: 'budget', label: 'Budget Tracker', icon: Calculator },
    { id: 'checklist', label: 'Checklist & Timeline', icon: CheckSquare },
    { id: 'schedule', label: 'Day-of Run of Show', icon: Clock },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  const getMonogram = () => {
    const p1 = settings.partner1Name?.trim().charAt(0) || 'E';
    const p2 = settings.partner2Name?.trim().charAt(0) || 'J';
    return `${p1} & ${p2}`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-[#F6F3EE] border-r border-stone-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Monogram & Couple Profile */}
        <div>
          <div className="p-5 border-b border-stone-200/80 bg-stone-50/50">
            {/* Back to All Weddings */}
            <button
              onClick={() => {
                selectProject(null);
                onCloseMobile();
              }}
              className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 mb-3 px-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Studio Portfolio ({projects.length} Weddings)</span>
            </button>

            {/* Current Wedding Lockup with Switcher */}
            <div className="relative">
              <div 
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center justify-between gap-2 p-2 bg-[#FAF8F5] border border-stone-200 rounded-xl cursor-pointer hover:border-stone-300 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg border border-stone-300 bg-white flex items-center justify-center shrink-0">
                    <span className="font-serif text-sm font-semibold text-stone-800">
                      {getMonogram()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-base font-semibold text-stone-900 truncate leading-snug">
                      {settings.partner1Name.split(' ')[0]} & {settings.partner2Name.split(' ')[0]}
                    </h2>
                    <p className="text-[11px] text-stone-700 truncate">
                      {settings.venueName || 'Wedding Celebration'}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-stone-600 shrink-0" />
              </div>

              {/* Quick Switch Dropdown */}
              {switcherOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-stone-400">
                    Switch Wedding Project
                  </div>
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        selectProject(p.id);
                        setSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 transition-colors ${
                        p.id === currentProjectId ? 'font-semibold text-stone-900 bg-stone-50' : 'text-stone-600'
                      }`}
                    >
                      <span className="truncate">{p.coupleName}</span>
                      <span className="text-[10px] text-stone-400 tabular-nums">
                        {p.settings.weddingDate.slice(0, 7)}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        selectProject(null);
                        setSwitcherOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-stone-700 hover:bg-stone-50 font-medium flex items-center gap-2"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-stone-500" />
                      <span>View All Projects Screen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-stone-600 uppercase">
              Planner Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-stone-900 text-stone-50 shadow-xs'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-stone-200' : 'text-stone-600'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Live Countdown & Settings */}
        <div className="p-4 space-y-3 border-t border-stone-200/80 bg-stone-50/60">
          {/* Live countdown widget */}
          <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-stone-600 font-medium mb-2">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-stone-700" />
                The Big Day
              </span>
              <span className="text-[11px] text-stone-600">
                {new Date(settings.weddingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {countdown.isPast ? (
              <div className="text-center py-1">
                <span className="font-serif text-lg text-stone-800 font-medium">Happily Married!</span>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="bg-white rounded-md py-1.5 border border-stone-200/50">
                  <div className="font-serif text-base font-semibold text-stone-900 tabular-nums">
                    {countdown.days}
                  </div>
                  <div className="text-[10px] text-stone-600 font-medium">Days</div>
                </div>
                <div className="bg-white rounded-md py-1.5 border border-stone-200/50">
                  <div className="font-serif text-base font-semibold text-stone-900 tabular-nums">
                    {countdown.hours}
                  </div>
                  <div className="text-[10px] text-stone-600 font-medium">Hours</div>
                </div>
                <div className="bg-white rounded-md py-1.5 border border-stone-200/50">
                  <div className="font-serif text-base font-semibold text-stone-900 tabular-nums">
                    {countdown.minutes}
                  </div>
                  <div className="text-[10px] text-stone-600 font-medium">Mins</div>
                </div>
                <div className="bg-white rounded-md py-1.5 border border-stone-200/50">
                  <div className="font-serif text-base font-semibold text-stone-900 tabular-nums">
                    {countdown.seconds}
                  </div>
                  <div className="text-[10px] text-stone-600 font-medium">Secs</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Settings trigger */}
          <button
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100/80 border border-stone-200 rounded-lg transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-stone-600" />
            <span>Wedding Details & Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};
