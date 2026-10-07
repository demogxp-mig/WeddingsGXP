import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Plus, 
  UserPlus, 
  Receipt, 
  CheckSquare, 
  Clock, 
  Settings, 
  ChevronDown, 
  Calendar,
  LayoutGrid
} from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { NavigationTab } from '../types/wedding';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSettings: () => void;
  onQuickAction: (action: 'add_guest' | 'log_expense' | 'add_task' | 'add_event') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenSettings,
  onQuickAction,
}) => {
  const { activeTab, settings, countdown, selectProject } = useWedding();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const titles: Record<NavigationTab, { title: string; subtitle: string }> = {
    dashboard: { 
      title: 'Wedding Overview', 
      subtitle: `${settings.venueName} · ${new Date(settings.weddingDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}` 
    },
    guests: { 
      title: 'Guest List & RSVP Manager', 
      subtitle: 'Track invitations, headcounts, dietary requirements & seating' 
    },
    budget: { 
      title: 'Budget & Expense Ledger', 
      subtitle: 'Monitor category allocations, actual spend & vendor payments' 
    },
    checklist: { 
      title: 'Milestone Checklist', 
      subtitle: 'Timeline milestones from 12+ months prior to the wedding day' 
    },
    schedule: { 
      title: 'Day-of Run of Show', 
      subtitle: 'Master chronological timeline with locations, leads & cues' 
    },
    settings: { 
      title: 'Wedding Settings', 
      subtitle: 'Customize celebration details, target budget and backup data' 
    },
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Zone 1: Mobile Hamburger + Breadcrumb & Current Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-0.5">
            <button
              onClick={() => selectProject(null)}
              className="hover:text-stone-900 transition-colors flex items-center gap-1 font-medium"
            >
              <LayoutGrid className="w-3 h-3 text-stone-500" />
              <span>All Weddings</span>
            </button>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <span className="truncate font-serif text-stone-800">
              {settings.partner1Name.split(' ')[0]} & {settings.partner2Name.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 tracking-tight truncate">
              {current.title}
            </h2>
          </div>
          <p className="text-xs text-stone-700 truncate hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Zone 2 & 3: Context Indicator & Quick Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Date / Countdown chip */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-stone-600 bg-stone-100/80 px-3 py-1.5 rounded-lg border border-stone-200/60 font-medium">
          <Calendar className="w-3.5 h-3.5 text-stone-700" />
          <span>
            {countdown.isPast ? 'Celebration passed' : `${countdown.days} days until "I do"`}
          </span>
        </div>

        {/* Quick Action Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Action</span>
            <span className="sm:hidden">Add</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-300" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  onQuickAction('add_guest');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-stone-500" />
                <span>Add Guest to List</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('log_expense');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                <Receipt className="w-4 h-4 text-stone-500" />
                <span>Log Budget Expense</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('add_task');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-stone-500" />
                <span>Create Checklist Task</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('add_event');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                <Clock className="w-4 h-4 text-stone-500" />
                <span>Schedule Run of Show Item</span>
              </button>
            </div>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors border border-stone-200/80 bg-white"
          title="Wedding Settings"
          aria-label="Wedding Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
