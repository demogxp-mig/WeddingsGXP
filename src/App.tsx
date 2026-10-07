/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WeddingProvider, useWedding } from './context/WeddingContext';
import { ProjectsDirectoryView } from './components/projects/ProjectsDirectoryView';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { GuestListView } from './components/guests/GuestListView';
import { BudgetTrackerView } from './components/budget/BudgetTrackerView';
import { ChecklistView } from './components/checklist/ChecklistView';
import { RunOfShowView } from './components/schedule/RunOfShowView';
import { SettingsModal } from './components/settings/SettingsModal';

function MainApp() {
  const { currentProjectId, activeTab, setActiveTab } = useWedding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Quick Action modal triggers
  const [quickAddGuest, setQuickAddGuest] = useState(false);
  const [quickLogExpense, setQuickLogExpense] = useState(false);
  const [quickAddTask, setQuickAddTask] = useState(false);
  const [quickAddEvent, setQuickAddEvent] = useState(false);

  const handleQuickAction = (action: 'add_guest' | 'log_expense' | 'add_task' | 'add_event') => {
    switch (action) {
      case 'add_guest':
        setActiveTab('guests');
        setQuickAddGuest(true);
        break;
      case 'log_expense':
        setActiveTab('budget');
        setQuickLogExpense(true);
        break;
      case 'add_task':
        setActiveTab('checklist');
        setQuickAddTask(true);
        break;
      case 'add_event':
        setActiveTab('schedule');
        setQuickAddEvent(true);
        break;
    }
  };

  // If no project is selected, show the projects directory screen
  if (!currentProjectId) {
    return <ProjectsDirectoryView />;
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col md:flex-row text-stone-900 font-sans selection:bg-[#EAE4D9]">
      {/* Sidebar Navigation */}
      <Sidebar
        onOpenSettings={() => setSettingsModalOpen(true)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Viewport Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onQuickAction={handleQuickAction}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView onQuickAction={handleQuickAction} />
          )}

          {activeTab === 'guests' && (
            <GuestListView
              externalAddOpen={quickAddGuest}
              onCloseExternalAdd={() => setQuickAddGuest(false)}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetTrackerView
              externalAddOpen={quickLogExpense}
              onCloseExternalAdd={() => setQuickLogExpense(false)}
            />
          )}

          {activeTab === 'checklist' && (
            <ChecklistView
              externalAddOpen={quickAddTask}
              onCloseExternalAdd={() => setQuickAddTask(false)}
            />
          )}

          {activeTab === 'schedule' && (
            <RunOfShowView
              externalAddOpen={quickAddEvent}
              onCloseExternalAdd={() => setQuickAddEvent(false)}
            />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <WeddingProvider>
      <MainApp />
    </WeddingProvider>
  );
}
