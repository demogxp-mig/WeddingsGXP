import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Calendar, 
  User, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle,
  Tag
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { ChecklistTask, ChecklistMilestone, TaskPriority } from '../../types/wedding';
import { Modal } from '../common/Modal';

const ALL_MILESTONES: ChecklistMilestone[] = [
  '12+ Months Before',
  '9-11 Months Before',
  '6-8 Months Before',
  '3-5 Months Before',
  '1-2 Months Before',
  'Week Of',
  'Day Of'
];

interface ChecklistViewProps {
  externalAddOpen?: boolean;
  onCloseExternalAdd?: () => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  externalAddOpen,
  onCloseExternalAdd
}) => {
  const { tasks, addTask, updateTask, toggleTask, deleteTask, stats } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'incomplete' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Collapsible milestones
  const [collapsedMilestones, setCollapsedMilestones] = useState<Record<string, boolean>>({});

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ChecklistTask | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    milestone: ChecklistMilestone;
    category: string;
    dueDate: string;
    priority: TaskPriority;
    assignee: 'Couple' | 'Partner 1' | 'Partner 2' | 'Planner' | 'Wedding Party';
    notes: string;
  }>({
    title: '',
    milestone: '3-5 Months Before',
    category: 'Planning',
    dueDate: '',
    priority: 'medium',
    assignee: 'Couple',
    notes: '',
  });

  // Handle external trigger
  React.useEffect(() => {
    if (externalAddOpen) {
      handleOpenCreate();
      if (onCloseExternalAdd) onCloseExternalAdd();
    }
  }, [externalAddOpen]);

  const toggleCollapse = (milestone: string) => {
    setCollapsedMilestones(prev => ({ ...prev, [milestone]: !prev[milestone] }));
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      milestone: '3-5 Months Before',
      category: 'Planning',
      dueDate: '',
      priority: 'medium',
      assignee: 'Couple',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (task: ChecklistTask) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      milestone: task.milestone,
      category: task.category,
      dueDate: task.dueDate || '',
      priority: task.priority,
      assignee: task.assignee,
      notes: task.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: formData.title.trim(),
        milestone: formData.milestone,
        category: formData.category.trim() || 'General',
        dueDate: formData.dueDate.trim() || undefined,
        priority: formData.priority,
        assignee: formData.assignee,
        notes: formData.notes.trim() || undefined,
      });
    } else {
      addTask({
        title: formData.title.trim(),
        milestone: formData.milestone,
        category: formData.category.trim() || 'General',
        dueDate: formData.dueDate.trim() || undefined,
        priority: formData.priority,
        assignee: formData.assignee,
        completed: false,
        notes: formData.notes.trim() || undefined,
      });
    }

    setModalOpen(false);
  };

  // Filtered task groups
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(q) ||
        task.category.toLowerCase().includes(q) ||
        (task.notes && task.notes.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedMilestone !== 'all' && task.milestone !== selectedMilestone) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (statusFilter === 'incomplete' && task.completed) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      return true;
    });
  }, [tasks, searchQuery, selectedMilestone, statusFilter, priorityFilter]);

  // Group by milestone
  const groupedTasks = useMemo(() => {
    const map = new Map<ChecklistMilestone, ChecklistTask[]>();
    ALL_MILESTONES.forEach(m => map.set(m, []));

    filteredTasks.forEach(task => {
      const list = map.get(task.milestone) || [];
      list.push(task);
      map.set(task.milestone, list);
    });

    return map;
  }, [filteredTasks]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Completion Progress Banner */}
      <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              Overall Progress
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-stone-900 tabular-nums">
                {stats.checklistProgress}%
              </span>
              <span className="text-xs text-stone-500 font-medium tabular-nums">
                ({stats.completedTasks} of {stats.totalTasks} tasks complete)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-2 mt-4 overflow-hidden">
          <div 
            className="h-full bg-stone-800 rounded-full transition-all duration-500"
            style={{ width: `${stats.checklistProgress}%` }}
          />
        </div>
      </div>

      {/* Toolbar: Search, Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, categories, assignees..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200/60">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('incomplete')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'incomplete' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Incomplete
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'completed' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Done
            </button>
          </div>

          {/* Milestone Filter */}
          <select
            value={selectedMilestone}
            onChange={(e) => setSelectedMilestone(e.target.value)}
            className="text-xs bg-white border border-stone-200 text-stone-700 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
          >
            <option value="all">All Milestones</option>
            {ALL_MILESTONES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-white border border-stone-200 text-stone-700 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Grouped Milestone Lists */}
      <div className="space-y-5">
        {ALL_MILESTONES.map((milestone) => {
          const milestoneTasks = groupedTasks.get(milestone) || [];
          if (selectedMilestone !== 'all' && selectedMilestone !== milestone) return null;
          if (milestoneTasks.length === 0 && searchQuery) return null;

          const completedCount = milestoneTasks.filter(t => t.completed).length;
          const totalCount = milestoneTasks.length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const isCollapsed = collapsedMilestones[milestone];

          return (
            <div key={milestone} className="bg-white border border-stone-200/80 rounded-xl overflow-hidden shadow-xs">
              {/* Milestone Group Header */}
              <div 
                onClick={() => toggleCollapse(milestone)}
                className="px-5 py-3.5 bg-stone-50/70 border-b border-stone-200/60 flex items-center justify-between cursor-pointer hover:bg-stone-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    {milestone}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 tabular-nums">
                    <span>{completedCount} / {totalCount} completed</span>
                    <span aria-hidden="true">·</span>
                    <span>{pct}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-24 bg-stone-200 rounded-full h-1.5 hidden sm:block overflow-hidden">
                    <div 
                      className="h-full bg-stone-800 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-stone-500" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-stone-500" />
                  )}
                </div>
              </div>

              {/* Task Items */}
              {!isCollapsed && (
                <div className="divide-y divide-stone-100">
                  {milestoneTasks.length === 0 ? (
                    <div className="p-4 text-center text-xs text-stone-400">
                      No tasks listed for this milestone yet. Click "+ New Task" to add one.
                    </div>
                  ) : (
                    milestoneTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 flex items-start justify-between gap-3 transition-colors ${
                          task.completed ? 'bg-stone-50/40 text-stone-400' : 'hover:bg-stone-50/60'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="mt-1 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400 cursor-pointer"
                          />

                          {/* Task Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className={`text-sm font-medium ${
                                task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}>
                                {task.title}
                              </span>
                              
                              {/* Priority text */}
                              {task.priority === 'high' && (
                                <span className="text-[11px] font-semibold text-amber-700">
                                  High Priority
                                </span>
                              )}
                            </div>

                            {/* Unboxed Metadata Line with separators */}
                            <div className="mt-1 flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                              <span>Category: {task.category}</span>
                              <span aria-hidden="true">·</span>
                              <span>Assigned to {task.assignee}</span>
                              {task.dueDate && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span>Due: {task.dueDate}</span>
                                </>
                              )}
                            </div>

                            {task.notes && (
                              <p className="mt-1.5 text-xs text-stone-600 italic">
                                "{task.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Row Actions */}
                        <div className="flex items-center gap-1 shrink-0 self-center">
                          <button
                            onClick={() => handleOpenEdit(task)}
                            className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
                            title="Edit task"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete task "${task.title}"?`)) deleteTask(task.id);
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Checklist Task'}
        subtitle="Organize timeline milestones, assignees and target due dates"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Schedule hair and makeup trial"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Timeline Milestone
              </label>
              <select
                value={formData.milestone}
                onChange={(e) => setFormData({ ...formData, milestone: e.target.value as ChecklistMilestone })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                {ALL_MILESTONES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Vendors, Attire, Legal"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Assignee
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                <option value="Couple">Couple</option>
                <option value="Partner 1">Partner 1</option>
                <option value="Partner 2">Partner 2</option>
                <option value="Planner">Planner</option>
                <option value="Wedding Party">Wedding Party</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Notes & Specific Details
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Include inspo photos and review contract cancellation clauses..."
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div className="pt-3 border-t border-stone-200/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
