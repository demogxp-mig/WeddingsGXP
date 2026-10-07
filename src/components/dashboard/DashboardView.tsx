import React from 'react';
import { 
  Users, 
  Receipt, 
  CheckSquare, 
  Clock, 
  ArrowRight, 
  Plus, 
  MapPin, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { StatsCard } from '../common/StatsCard';

interface DashboardViewProps {
  onQuickAction: (action: 'add_guest' | 'log_expense' | 'add_task' | 'add_event') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onQuickAction }) => {
  const { 
    settings, 
    countdown, 
    stats, 
    tasks, 
    toggleTask, 
    expenses, 
    schedule, 
    guests, 
    setActiveTab 
  } = useWedding();

  const formattedDate = new Date(settings.weddingDate).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Top pending tasks (sorted by high priority first)
  const pendingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  // Next upcoming day-of events
  const dayOfEvents = schedule.slice(0, 4);

  // Recent expenses
  const recentExpenses = expenses.slice(0, 4);

  // Dietary requirements breakdown
  const dietaryCounts = guests.reduce((acc, g) => {
    if (g.rsvpStatus === 'attending' && g.dietaryRequirement !== 'None') {
      acc[g.dietaryRequirement] = (acc[g.dietaryRequirement] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-gradient-to-br from-[#F5F1EA] via-[#FAF7F2] to-[#ECE6DC] p-6 sm:p-10 shadow-xs">
        {/* Subtle decorative background motif */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#E8DEC8]/25 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-16 w-80 h-80 rounded-full bg-stone-200/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs text-stone-700 tracking-wider font-medium uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-stone-700" />
              <span>Wedding Countdown & Plan</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight leading-tight">
              {settings.partner1Name} & {settings.partner2Name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs sm:text-sm text-stone-700">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-stone-700" />
                {formattedDate}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-stone-700" />
                {settings.venueLocation || settings.venueName}
              </span>
            </div>

            {settings.themeNotes && (
              <p className="mt-3 text-xs text-stone-700 italic border-l-2 border-stone-300 pl-3">
                "{settings.themeNotes}"
              </p>
            )}
          </div>

          {/* Live Countdown Display */}
          <div className="bg-white/85 backdrop-blur-xs border border-stone-200/80 rounded-xl p-4 sm:p-5 shadow-xs shrink-0 w-full sm:w-auto">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-2.5 text-center sm:text-left">
              Time Remaining
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-lg px-3 py-2 min-w-[64px]">
                <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums block">
                  {countdown.days}
                </span>
                <span className="text-[10px] text-stone-600 font-medium uppercase tracking-wider">
                  Days
                </span>
              </div>
              <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-lg px-3 py-2 min-w-[64px]">
                <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums block">
                  {countdown.hours}
                </span>
                <span className="text-[10px] text-stone-600 font-medium uppercase tracking-wider">
                  Hours
                </span>
              </div>
              <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-lg px-3 py-2 min-w-[64px]">
                <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums block">
                  {countdown.minutes}
                </span>
                <span className="text-[10px] text-stone-600 font-medium uppercase tracking-wider">
                  Mins
                </span>
              </div>
              <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-lg px-3 py-2 min-w-[64px]">
                <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums block">
                  {countdown.seconds}
                </span>
                <span className="text-[10px] text-stone-600 font-medium uppercase tracking-wider">
                  Secs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons strip */}
        <div className="mt-8 pt-6 border-t border-stone-200/70 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs text-stone-600 font-medium mr-1">
            Quick Actions:
          </span>
          <button
            onClick={() => onQuickAction('add_guest')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-lg text-xs font-medium text-stone-800 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-stone-500" />
            <span>Add Guest</span>
          </button>
          <button
            onClick={() => onQuickAction('log_expense')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-lg text-xs font-medium text-stone-800 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-stone-500" />
            <span>Log Expense</span>
          </button>
          <button
            onClick={() => onQuickAction('add_task')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-lg text-xs font-medium text-stone-800 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-stone-500" />
            <span>New Task</span>
          </button>
          <button
            onClick={() => onQuickAction('add_event')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-lg text-xs font-medium text-stone-800 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-stone-500" />
            <span>Schedule Activity</span>
          </button>
        </div>
      </div>

      {/* High-level KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget KPI */}
        <StatsCard
          label="Budget Allocated"
          value={`$${stats.totalSpent.toLocaleString()}`}
          subValue={`of $${stats.totalBudget.toLocaleString()}`}
          description={`$${stats.remainingBudget.toLocaleString()} remaining buffer`}
          progressPercent={stats.budgetPercent}
          progressColor={stats.budgetPercent > 95 ? 'bg-amber-600' : 'bg-stone-900'}
          auxiliary={
            <button 
              onClick={() => setActiveTab('budget')}
              className="text-stone-400 hover:text-stone-700 transition-colors"
              title="View Budget"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          }
        />

        {/* RSVP Acceptance Rate */}
        <StatsCard
          label="RSVP Confirmation"
          value={`${stats.rsvpAcceptanceRate}%`}
          subValue={`${stats.confirmedAttendingHeadcount} Attending`}
          description={`${stats.pendingHeadcount} awaiting · ${stats.declinedHeadcount} declined`}
          progressPercent={stats.rsvpAcceptanceRate}
          progressColor="bg-stone-800"
          auxiliary={
            <button 
              onClick={() => setActiveTab('guests')}
              className="text-stone-400 hover:text-stone-700 transition-colors"
              title="View Guests"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          }
        />

        {/* Checklist Progress */}
        <StatsCard
          label="Checklist Completion"
          value={`${stats.checklistProgress}%`}
          subValue={`${stats.completedTasks}/${stats.totalTasks} Done`}
          description={`${stats.totalTasks - stats.completedTasks} tasks remaining`}
          progressPercent={stats.checklistProgress}
          progressColor="bg-stone-800"
          auxiliary={
            <button 
              onClick={() => setActiveTab('checklist')}
              className="text-stone-400 hover:text-stone-700 transition-colors"
              title="View Checklist"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          }
        />

        {/* Day-of Events */}
        <StatsCard
          label="Day-of Schedule"
          value={schedule.length}
          subValue="Program Items"
          description="08:30 Prep through 01:00 Exit"
          progressPercent={100}
          progressColor="bg-stone-300"
          auxiliary={
            <button 
              onClick={() => setActiveTab('schedule')}
              className="text-stone-400 hover:text-stone-700 transition-colors"
              title="View Schedule"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          }
        />
      </div>

      {/* Main 2-Column Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Priority Checklist + Recent Expenses */}
        <div className="lg:col-span-7 space-y-6">
          {/* Priority Checklist Section */}
          <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  Priority Tasks
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Action items requiring attention for upcoming deadlines
                </p>
              </div>
              <button
                onClick={() => setActiveTab('checklist')}
                className="text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1 transition-colors"
              >
                <span>All Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100 mt-2">
              {pendingTasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-500">
                  All priority tasks checked off! Excellent work.
                </div>
              ) : (
                pendingTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="py-3 flex items-start gap-3 group transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-1 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-stone-800 leading-snug truncate">
                          {task.title}
                        </span>
                        <span className={`text-[11px] font-medium shrink-0 ${
                          task.priority === 'high' ? 'text-amber-700' : 'text-stone-500'
                        }`}>
                          {task.priority === 'high' ? 'High Priority' : task.priority}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                        <span>{task.milestone}</span>
                        <span aria-hidden="true">·</span>
                        <span>Assignee: {task.assignee}</span>
                        {task.dueDate && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Due {task.dueDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Budget Expenses Log */}
          <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  Recent Expenses
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Latest invoices, vendor retainers and recorded receipts
                </p>
              </div>
              <button
                onClick={() => setActiveTab('budget')}
                className="text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1 transition-colors"
              >
                <span>Full Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100 mt-2">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">
                      {expense.title}
                    </p>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {expense.vendor} <span className="text-stone-300">·</span> {expense.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium text-stone-900 tabular-nums">
                      ${expense.actualCost.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-stone-500 capitalize">
                      {expense.status === 'paid' ? 'Paid in full' : expense.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Day-of Timeline Highlights & Guest Dietary Snapshot */}
        <div className="lg:col-span-5 space-y-6">
          {/* Day-of Run of Show Preview */}
          <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  Day-of Run of Show
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Selected chronological milestones
                </p>
              </div>
              <button
                onClick={() => setActiveTab('schedule')}
                className="text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1 transition-colors"
              >
                <span>Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 relative pl-4 border-l-2 border-stone-200 space-y-4">
              {dayOfEvents.map((evt) => (
                <div key={evt.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-stone-800 border-2 border-white shadow-2xs" />
                  
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-stone-900 tabular-nums">
                      {evt.startTime} – {evt.endTime}
                    </span>
                    {evt.isMilestone && (
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">
                        Milestone
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-stone-900 mt-0.5">
                    {evt.activity}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {evt.location} <span className="text-stone-300">·</span> Lead: {evt.assignedLead}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Requirements Snapshot */}
          <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-stone-600" />
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  Dietary & Catering Notes
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('guests')}
                className="text-xs text-stone-600 hover:text-stone-900"
              >
                Guest List
              </button>
            </div>

            <p className="text-xs text-stone-500 mt-2">
              Confirmed special dietary meal requirements for caterers:
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {Object.keys(dietaryCounts).length === 0 ? (
                <div className="col-span-2 text-stone-400 py-2">
                  No dietary restrictions recorded yet.
                </div>
              ) : (
                Object.entries(dietaryCounts).map(([diet, count]) => (
                  <div key={diet} className="bg-stone-50 border border-stone-200/60 rounded-lg p-2.5 flex items-center justify-between">
                    <span className="font-medium text-stone-800">{diet}</span>
                    <span className="tabular-nums font-semibold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200 text-xs">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
