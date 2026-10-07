import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  WeddingSettings, 
  WeddingProject,
  Guest, 
  Expense, 
  ChecklistTask, 
  ScheduleEvent, 
  NavigationTab,
  RSVPStatus 
} from '../types/wedding';
import { 
  INITIAL_PROJECTS,
  INITIAL_SETTINGS, 
  INITIAL_GUESTS, 
  INITIAL_EXPENSES, 
  INITIAL_TASKS, 
  INITIAL_SCHEDULE,
  createDefaultWeddingProject
} from '../data/seedData';

const STORAGE_KEYS = {
  PROJECTS: 'wedding_planner_projects_v2',
  CURRENT_PROJECT_ID: 'wedding_planner_active_id_v2',
};

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

interface WeddingContextType {
  // Multi-project studio directory
  projects: WeddingProject[];
  currentProjectId: string | null;
  selectProject: (id: string | null) => void;
  createProject: (settings: WeddingSettings) => string;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => string;
  activeProject: WeddingProject | null;

  // Active Project Data & Mutators
  settings: WeddingSettings;
  updateSettings: (newSettings: WeddingSettings) => void;
  
  guests: Guest[];
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  bulkUpdateRSVP: (ids: string[], status: RSVPStatus) => void;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  tasks: ChecklistTask[];
  addTask: (task: Omit<ChecklistTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<ChecklistTask>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  schedule: ScheduleEvent[];
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  updateScheduleEvent: (id: string, updates: Partial<ScheduleEvent>) => void;
  deleteScheduleEvent: (id: string) => void;
  reorderSchedule: (events: ScheduleEvent[]) => void;

  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  countdown: CountdownTime;

  stats: {
    totalBudget: number;
    totalSpent: number;
    remainingBudget: number;
    budgetPercent: number;
    pendingExpensesAmount: number;
    totalInvitedHeadcount: number;
    confirmedAttendingHeadcount: number;
    declinedHeadcount: number;
    pendingHeadcount: number;
    rsvpAcceptanceRate: number;
    totalTasks: number;
    completedTasks: number;
    checklistProgress: number;
  };

  resetToDemoData: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonStr: string) => boolean;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch (err) {
    console.error(`Error loading key ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key} to localStorage:`, err);
  }
}

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store all projects
  const [projects, setProjects] = useState<WeddingProject[]>(() => 
    loadFromStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
  );

  // currentProjectId starts as null so users land on the Projects Directory screen
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Sync projects to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }, [projects]);

  // Active project calculation
  const activeProject = useMemo(() => {
    if (!currentProjectId) return null;
    return projects.find(p => p.id === currentProjectId) || null;
  }, [projects, currentProjectId]);

  // Fallback defaults if no project active
  const defaultProjectFallback = projects[0] || INITIAL_PROJECTS[0];
  const settings = activeProject ? activeProject.settings : defaultProjectFallback.settings;
  const guests = activeProject ? activeProject.guests : defaultProjectFallback.guests;
  const expenses = activeProject ? activeProject.expenses : defaultProjectFallback.expenses;
  const tasks = activeProject ? activeProject.tasks : defaultProjectFallback.tasks;
  const schedule = activeProject ? activeProject.schedule : defaultProjectFallback.schedule;

  // Project navigation
  const selectProject = useCallback((id: string | null) => {
    setCurrentProjectId(id);
    setActiveTab('dashboard');
  }, []);

  const createProject = useCallback((newSettings: WeddingSettings): string => {
    const newProj = createDefaultWeddingProject(newSettings);
    setProjects(prev => [newProj, ...prev]);
    setCurrentProjectId(newProj.id);
    setActiveTab('dashboard');
    return newProj.id;
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProjectId === id) {
      setCurrentProjectId(null);
    }
  }, [currentProjectId]);

  const duplicateProject = useCallback((id: string): string => {
    const target = projects.find(p => p.id === id);
    if (!target) return '';
    const newId = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const copy: WeddingProject = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      coupleName: `${target.coupleName} (Copy)`,
      settings: {
        ...target.settings,
        partner1Name: `${target.settings.partner1Name}`,
        partner2Name: `${target.settings.partner2Name}`,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [copy, ...prev]);
    return newId;
  }, [projects]);

  // Helper to update active project state
  const mutateActiveProject = useCallback((updater: (proj: WeddingProject) => WeddingProject) => {
    if (!currentProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id !== currentProjectId) return p;
      const updated = updater(p);
      return {
        ...updated,
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [currentProjectId]);

  // Settings update
  const updateSettings = useCallback((newSettings: WeddingSettings) => {
    mutateActiveProject(proj => ({
      ...proj,
      settings: newSettings,
      coupleName: `${newSettings.partner1Name.split(' ')[0]} & ${newSettings.partner2Name.split(' ')[0]}`
    }));
  }, [mutateActiveProject]);

  // Live countdown timer
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(settings.weddingDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, isPast: false });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings.weddingDate]);

  // Guest actions
  const addGuest = useCallback((guest: Omit<Guest, 'id'>) => {
    const id = `g-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const partySize = guest.hasPlusOne ? 2 : 1;
    mutateActiveProject(proj => ({
      ...proj,
      guests: [{ ...guest, id, partySize }, ...proj.guests]
    }));
  }, [mutateActiveProject]);

  const updateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    mutateActiveProject(proj => ({
      ...proj,
      guests: proj.guests.map(g => {
        if (g.id !== id) return g;
        const updated = { ...g, ...updates };
        updated.partySize = updated.hasPlusOne ? 2 : 1;
        return updated;
      })
    }));
  }, [mutateActiveProject]);

  const deleteGuest = useCallback((id: string) => {
    mutateActiveProject(proj => ({
      ...proj,
      guests: proj.guests.filter(g => g.id !== id)
    }));
  }, [mutateActiveProject]);

  const bulkUpdateRSVP = useCallback((ids: string[], status: RSVPStatus) => {
    mutateActiveProject(proj => ({
      ...proj,
      guests: proj.guests.map(g => ids.includes(g.id) ? { ...g, rsvpStatus: status } : g)
    }));
  }, [mutateActiveProject]);

  // Expense actions
  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const id = `e-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    mutateActiveProject(proj => ({
      ...proj,
      expenses: [{ ...expense, id }, ...proj.expenses]
    }));
  }, [mutateActiveProject]);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    mutateActiveProject(proj => ({
      ...proj,
      expenses: proj.expenses.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  }, [mutateActiveProject]);

  const deleteExpense = useCallback((id: string) => {
    mutateActiveProject(proj => ({
      ...proj,
      expenses: proj.expenses.filter(e => e.id !== id)
    }));
  }, [mutateActiveProject]);

  // Task actions
  const addTask = useCallback((task: Omit<ChecklistTask, 'id'>) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    mutateActiveProject(proj => ({
      ...proj,
      tasks: [{ ...task, id }, ...proj.tasks]
    }));
  }, [mutateActiveProject]);

  const updateTask = useCallback((id: string, updates: Partial<ChecklistTask>) => {
    mutateActiveProject(proj => ({
      ...proj,
      tasks: proj.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  }, [mutateActiveProject]);

  const toggleTask = useCallback((id: string) => {
    mutateActiveProject(proj => ({
      ...proj,
      tasks: proj.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  }, [mutateActiveProject]);

  const deleteTask = useCallback((id: string) => {
    mutateActiveProject(proj => ({
      ...proj,
      tasks: proj.tasks.filter(t => t.id !== id)
    }));
  }, [mutateActiveProject]);

  // Schedule actions
  const addScheduleEvent = useCallback((event: Omit<ScheduleEvent, 'id'>) => {
    const id = `s-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    mutateActiveProject(proj => {
      const updated = [...proj.schedule, { ...event, id }];
      return {
        ...proj,
        schedule: updated.sort((a, b) => a.startTime.localeCompare(b.startTime))
      };
    });
  }, [mutateActiveProject]);

  const updateScheduleEvent = useCallback((id: string, updates: Partial<ScheduleEvent>) => {
    mutateActiveProject(proj => {
      const updated = proj.schedule.map(s => s.id === id ? { ...s, ...updates } : s);
      return {
        ...proj,
        schedule: updated.sort((a, b) => a.startTime.localeCompare(b.startTime))
      };
    });
  }, [mutateActiveProject]);

  const deleteScheduleEvent = useCallback((id: string) => {
    mutateActiveProject(proj => ({
      ...proj,
      schedule: proj.schedule.filter(s => s.id !== id)
    }));
  }, [mutateActiveProject]);

  const reorderSchedule = useCallback((newSchedule: ScheduleEvent[]) => {
    mutateActiveProject(proj => ({
      ...proj,
      schedule: newSchedule
    }));
  }, [mutateActiveProject]);

  // Reset to Demo Data
  const resetToDemoData = useCallback(() => {
    setProjects(INITIAL_PROJECTS);
    setCurrentProjectId(null);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  }, []);

  // Export & Import
  const exportDataJSON = useCallback(() => {
    const exportData = {
      projects,
      currentProjectId,
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-planner-studio-portfolio.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [projects, currentProjectId]);

  const importDataJSON = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        setProjects(parsed.projects);
        if (parsed.currentProjectId) {
          setCurrentProjectId(parsed.currentProjectId);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to parse imported json', e);
      return false;
    }
  }, []);

  // Computed KPI statistics for current active project
  const stats = useMemo(() => {
    const totalBudget = settings.targetBudget || 50000;
    
    // Financials
    const totalSpent = expenses.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
    const remainingBudget = Math.max(0, totalBudget - totalSpent);
    const budgetPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const pendingExpensesAmount = expenses
      .filter(e => e.status !== 'paid')
      .reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);

    // Guest headcounts
    let totalInvitedHeadcount = 0;
    let confirmedAttendingHeadcount = 0;
    let declinedHeadcount = 0;
    let pendingHeadcount = 0;

    guests.forEach(g => {
      const size = g.hasPlusOne ? 2 : 1;
      totalInvitedHeadcount += size;
      if (g.rsvpStatus === 'attending') confirmedAttendingHeadcount += size;
      else if (g.rsvpStatus === 'declined') declinedHeadcount += size;
      else pendingHeadcount += size;
    });

    const rsvpAcceptanceRate = totalInvitedHeadcount > 0 
      ? Math.round((confirmedAttendingHeadcount / totalInvitedHeadcount) * 100)
      : 0;

    // Tasks checklist
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const checklistProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalBudget,
      totalSpent,
      remainingBudget,
      budgetPercent,
      pendingExpensesAmount,
      totalInvitedHeadcount,
      confirmedAttendingHeadcount,
      declinedHeadcount,
      pendingHeadcount,
      rsvpAcceptanceRate,
      totalTasks,
      completedTasks,
      checklistProgress,
    };
  }, [settings.targetBudget, expenses, guests, tasks]);

  return (
    <WeddingContext.Provider
      value={{
        projects,
        currentProjectId,
        selectProject,
        createProject,
        deleteProject,
        duplicateProject,
        activeProject,
        settings,
        updateSettings,
        guests,
        addGuest,
        updateGuest,
        deleteGuest,
        bulkUpdateRSVP,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        tasks,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        schedule,
        addScheduleEvent,
        updateScheduleEvent,
        deleteScheduleEvent,
        reorderSchedule,
        activeTab,
        setActiveTab,
        countdown,
        stats,
        resetToDemoData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
