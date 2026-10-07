import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Calculator, 
  CheckSquare, 
  Clock, 
  ArrowRight, 
  Copy, 
  Trash2, 
  Sparkles, 
  HeartHandshake,
  Download,
  RotateCcw,
  Search
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingSettings, WeddingProject } from '../../types/wedding';
import { Modal } from '../common/Modal';

export const ProjectsDirectoryView: React.FC = () => {
  const { 
    projects, 
    selectProject, 
    createProject, 
    deleteProject, 
    duplicateProject,
    resetToDemoData,
    exportDataJSON
  } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Project Form
  const [formData, setFormData] = useState({
    partner1Name: '',
    partner2Name: '',
    weddingDate: '2027-08-14T16:00',
    venueName: '',
    venueLocation: '',
    targetBudget: '60000',
    expectedGuests: '140',
    themeNotes: '',
  });

  // Aggregated Portfolio Stats
  const portfolioStats = useMemo(() => {
    let totalPortfolioBudget = 0;
    let totalPortfolioSpent = 0;
    let totalGuestsCount = 0;

    projects.forEach(p => {
      totalPortfolioBudget += (p.settings.targetBudget || 0);
      const spent = p.expenses.reduce((s, e) => s + (e.actualCost || e.estimatedCost || 0), 0);
      totalPortfolioSpent += spent;
      p.guests.forEach(g => {
        totalGuestsCount += (g.hasPlusOne ? 2 : 1);
      });
    });

    return {
      activeProjectsCount: projects.length,
      totalPortfolioBudget,
      totalPortfolioSpent,
      totalGuestsCount,
    };
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p => 
      p.coupleName.toLowerCase().includes(q) ||
      p.settings.partner1Name.toLowerCase().includes(q) ||
      p.settings.partner2Name.toLowerCase().includes(q) ||
      p.settings.venueName.toLowerCase().includes(q) ||
      p.settings.venueLocation.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const handleOpenCreate = () => {
    setFormData({
      partner1Name: '',
      partner2Name: '',
      weddingDate: '2027-08-14T16:00',
      venueName: '',
      venueLocation: '',
      targetBudget: '60000',
      expectedGuests: '140',
      themeNotes: '',
    });
    setCreateModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partner1Name.trim() || !formData.partner2Name.trim()) return;

    const newSettings: WeddingSettings = {
      partner1Name: formData.partner1Name.trim(),
      partner2Name: formData.partner2Name.trim(),
      weddingDate: formData.weddingDate,
      venueName: formData.venueName.trim() || 'Venue TBD',
      venueLocation: formData.venueLocation.trim() || 'Location TBD',
      targetBudget: parseFloat(formData.targetBudget) || 50000,
      expectedGuests: parseInt(formData.expectedGuests, 10) || 120,
      themeNotes: formData.themeNotes.trim() || undefined,
    };

    createProject(newSettings);
    setCreateModalOpen(false);
  };

  const getDaysCountdown = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    if (diff <= 0) return 'Celebration passed';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days away`;
  };

  const getProjectMetrics = (project: WeddingProject) => {
    const targetBudget = project.settings.targetBudget || 50000;
    const spent = project.expenses.reduce((s, e) => s + (e.actualCost || e.estimatedCost || 0), 0);
    const budgetPct = targetBudget > 0 ? Math.round((spent / targetBudget) * 100) : 0;

    let confirmedAttending = 0;
    let totalInvited = 0;
    project.guests.forEach(g => {
      const size = g.hasPlusOne ? 2 : 1;
      totalInvited += size;
      if (g.rsvpStatus === 'attending') confirmedAttending += size;
    });

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.completed).length;
    const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      spent,
      targetBudget,
      budgetPct,
      confirmedAttending,
      totalInvited,
      totalTasks,
      completedTasks,
      taskPct,
      scheduleCount: project.schedule.length,
    };
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-sans selection:bg-[#EAE4D9]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-stone-300 bg-white flex items-center justify-center shadow-xs">
            <span className="font-serif text-base font-semibold text-stone-800">
              Æ
            </span>
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 tracking-tight">
              Aethelgard Planning Studio
            </h1>
            <p className="text-xs text-stone-700 hidden sm:block">
              Wedding Projects & Client Workspaces
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportDataJSON}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors shadow-2xs"
            title="Export all projects backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Portfolio</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Wedding Project</span>
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        {/* Studio Hero Intro */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-gradient-to-br from-[#F5F1EA] via-[#FAF7F2] to-[#ECE6DC] p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-stone-700 tracking-wider font-medium uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-stone-700" />
              <span>Multi-Client Wedding Planner Studio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight leading-tight">
              Current Wedding Portfolios
            </h2>
            <p className="mt-3 text-sm text-stone-700 leading-relaxed">
              Select any wedding below to open its dedicated dashboard, RSVP guest manager, budget allocations, milestone checklist, and day-of run of show timeline.
            </p>
          </div>

          {/* Studio Aggregate KPI Strip */}
          <div className="mt-8 pt-6 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-600 font-medium">
                Active Weddings
              </span>
              <div className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums">
                {portfolioStats.activeProjectsCount}
              </div>
              <div className="text-xs text-stone-700 mt-0.5">Under planning</div>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-600 font-medium">
                Portfolio Budget
              </span>
              <div className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums">
                ${portfolioStats.totalPortfolioBudget.toLocaleString()}
              </div>
              <div className="text-xs text-stone-700 mt-0.5">Across all celebrations</div>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-600 font-medium">
                Committed Spend
              </span>
              <div className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums">
                ${portfolioStats.totalPortfolioSpent.toLocaleString()}
              </div>
              <div className="text-xs text-stone-700 mt-0.5">Active contracts</div>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-600 font-medium">
                Managed Guests
              </span>
              <div className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums">
                {portfolioStats.totalGuestsCount}
              </div>
              <div className="text-xs text-stone-700 mt-0.5">Total invited covers</div>
            </div>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wedding projects by couple, venue, or location..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-stone-500">
            <span>Showing {filteredProjects.length} of {projects.length} projects</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                if (window.confirm('Reset all projects back to the realistic studio demo state?')) {
                  resetToDemoData();
                }
              }}
              className="hover:text-stone-900 underline underline-offset-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Roster</span>
            </button>
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const metrics = getProjectMetrics(project);
            const dateStr = new Date(project.settings.weddingDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={project.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top: Date & Countdown Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-stone-700" />
                      <span>{dateStr}</span>
                    </div>
                    <span className="text-[11px] text-stone-700 font-medium bg-stone-100 px-2.5 py-0.5 rounded-full">
                      {getDaysCountdown(project.settings.weddingDate)}
                    </span>
                  </div>

                  {/* Couple Names */}
                  <h3 className="font-serif text-2xl font-normal text-stone-900 tracking-tight mt-3 group-hover:text-stone-700 transition-colors">
                    {project.settings.partner1Name} & {project.settings.partner2Name}
                  </h3>

                  {/* Venue and Location */}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                    <span className="truncate">{project.settings.venueName} · {project.settings.venueLocation}</span>
                  </div>

                  {/* Theme Vision */}
                  {project.settings.themeNotes && (
                    <p className="mt-2 text-xs text-stone-700 italic line-clamp-2">
                      "{project.settings.themeNotes}"
                    </p>
                  )}

                  {/* Health Meters Grid */}
                  <div className="mt-5 pt-4 border-t border-stone-100 space-y-3">
                    {/* Budget progress */}
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-700">Budget: ${metrics.spent.toLocaleString()}</span>
                        <span className="tabular-nums font-medium text-stone-900">${metrics.targetBudget.toLocaleString()} ({metrics.budgetPct}%)</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-stone-800 rounded-full transition-all"
                          style={{ width: `${Math.min(100, metrics.budgetPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Guest RSVP & Checklist unboxed tags */}
                    <div className="pt-1 flex items-center justify-between text-xs text-stone-700">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-700" />
                        <span>{metrics.confirmedAttending} attending</span>
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-stone-700" />
                        <span>{metrics.completedTasks}/{metrics.totalTasks} tasks ({metrics.taskPct}%)</span>
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-700" />
                        <span>{metrics.scheduleCount} cues</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateProject(project.id)}
                      className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Duplicate project as template"
                      aria-label="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete wedding plan for ${project.coupleName}?`)) {
                          deleteProject(project.id);
                        }
                      }}
                      className="p-2 text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete project"
                      aria-label="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => selectProject(project.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Create New Wedding Project Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Wedding Project"
        subtitle="Initialize workspace with couple details, budget target, and standard planning milestones"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Partner 1 Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.partner1Name}
                onChange={(e) => setFormData({ ...formData, partner1Name: e.target.value })}
                placeholder="e.g. Genevieve Clark"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Partner 2 Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.partner2Name}
                onChange={(e) => setFormData({ ...formData, partner2Name: e.target.value })}
                placeholder="e.g. William Mercer"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Target Wedding Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.weddingDate}
                onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Target Total Budget ($)
              </label>
              <input
                type="number"
                value={formData.targetBudget}
                onChange={(e) => setFormData({ ...formData, targetBudget: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Venue Name
              </label>
              <input
                type="text"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                placeholder="e.g. Ocean House & Lawn"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Location (City / Region)
              </label>
              <input
                type="text"
                value={formData.venueLocation}
                onChange={(e) => setFormData({ ...formData, venueLocation: e.target.value })}
                placeholder="e.g. Watch Hill, Rhode Island"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Expected Guest Count
            </label>
            <input
              type="number"
              value={formData.expectedGuests}
              onChange={(e) => setFormData({ ...formData, expectedGuests: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Design Vision & Aesthetic Statement
            </label>
            <textarea
              rows={2}
              value={formData.themeNotes}
              onChange={(e) => setFormData({ ...formData, themeNotes: e.target.value })}
              placeholder="e.g. Coastal black-tie elegance · Crisp sailcloth tent, oyster bar, white hydrangeas and brass lanterns"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 text-xs text-stone-600">
            <span className="font-semibold text-stone-800">Included Starter Kit:</span> Creates standardized planning milestone tasks (12+ months through Day Of) and a sample day-of run of show schedule template ready for customization.
          </div>

          <div className="pt-3 border-t border-stone-200/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
            >
              Create & Open Workspace
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
