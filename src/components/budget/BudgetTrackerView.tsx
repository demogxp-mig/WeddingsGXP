import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Download, 
  Calendar, 
  Building, 
  Tag, 
  DollarSign,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Expense, BudgetCategory, PaymentStatus } from '../../types/wedding';
import { Modal } from '../common/Modal';

const ALL_CATEGORIES: BudgetCategory[] = [
  'Venue & Ceremony',
  'Catering & Bar',
  'Photography & Videography',
  'Attire & Beauty',
  'Floral & Decor',
  'Music & Entertainment',
  'Stationery & Paper',
  'Transportation & Stay',
  'Favors & Miscellaneous'
];

interface BudgetTrackerViewProps {
  externalAddOpen?: boolean;
  onCloseExternalAdd?: () => void;
}

export const BudgetTrackerView: React.FC<BudgetTrackerViewProps> = ({
  externalAddOpen,
  onCloseExternalAdd
}) => {
  const { expenses, addExpense, updateExpense, deleteExpense, settings } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    category: BudgetCategory;
    title: string;
    vendor: string;
    estimatedCost: string;
    actualCost: string;
    status: PaymentStatus;
    dueDate: string;
    paidDate: string;
    notes: string;
  }>({
    category: 'Venue & Ceremony',
    title: '',
    vendor: '',
    estimatedCost: '',
    actualCost: '',
    status: 'pending',
    dueDate: '',
    paidDate: '',
    notes: '',
  });

  // Handle external trigger
  React.useEffect(() => {
    if (externalAddOpen) {
      handleOpenCreate();
      if (onCloseExternalAdd) onCloseExternalAdd();
    }
  }, [externalAddOpen]);

  // Overall Financial Calculations
  const targetBudget = settings.targetBudget || 55000;
  
  const totalActual = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (e.actualCost || e.estimatedCost || 0), 0);
  }, [expenses]);

  const totalEstimated = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (e.estimatedCost || 0), 0);
  }, [expenses]);

  const remainingBudget = Math.max(0, targetBudget - totalActual);
  const budgetPercent = targetBudget > 0 ? Math.round((totalActual / targetBudget) * 100) : 0;

  const pendingAmount = useMemo(() => {
    return expenses
      .filter(e => e.status !== 'paid')
      .reduce((sum, e) => sum + (e.actualCost || e.estimatedCost || 0), 0);
  }, [expenses]);

  // Category Breakdown Aggregations
  const categoryStats = useMemo(() => {
    return ALL_CATEGORIES.map(category => {
      const items = expenses.filter(e => e.category === category);
      const est = items.reduce((s, e) => s + (e.estimatedCost || 0), 0);
      const act = items.reduce((s, e) => s + (e.actualCost || e.estimatedCost || 0), 0);
      const isOver = act > est && est > 0;
      return {
        category,
        estimated: est,
        actual: act,
        count: items.length,
        isOver,
        difference: act - est
      };
    });
  }, [expenses]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        expense.title.toLowerCase().includes(q) ||
        expense.vendor.toLowerCase().includes(q) ||
        expense.category.toLowerCase().includes(q) ||
        (expense.notes && expense.notes.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedCategory !== 'all' && expense.category !== selectedCategory) return false;
      if (statusFilter !== 'all' && expense.status !== statusFilter) return false;

      return true;
    });
  }, [expenses, searchQuery, selectedCategory, statusFilter]);

  const handleOpenCreate = () => {
    setEditingExpense(null);
    setFormData({
      category: 'Venue & Ceremony',
      title: '',
      vendor: '',
      estimatedCost: '',
      actualCost: '',
      status: 'pending',
      dueDate: '',
      paidDate: '',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      title: expense.title,
      vendor: expense.vendor,
      estimatedCost: expense.estimatedCost.toString(),
      actualCost: expense.actualCost.toString(),
      status: expense.status,
      dueDate: expense.dueDate || '',
      paidDate: expense.paidDate || '',
      notes: expense.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const estNum = parseFloat(formData.estimatedCost) || 0;
    const actNum = parseFloat(formData.actualCost) || estNum;

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        category: formData.category,
        title: formData.title.trim(),
        vendor: formData.vendor.trim(),
        estimatedCost: estNum,
        actualCost: actNum,
        status: formData.status,
        dueDate: formData.dueDate.trim() || undefined,
        paidDate: formData.paidDate.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });
    } else {
      addExpense({
        category: formData.category,
        title: formData.title.trim(),
        vendor: formData.vendor.trim(),
        estimatedCost: estNum,
        actualCost: actNum,
        status: formData.status,
        dueDate: formData.dueDate.trim() || undefined,
        paidDate: formData.paidDate.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });
    }

    setModalOpen(false);
  };

  const exportCSV = () => {
    const headers = ['Category', 'Expense Item', 'Vendor', 'Estimated Cost', 'Actual Cost', 'Payment Status', 'Due Date', 'Paid Date', 'Notes'];
    const rows = expenses.map(e => [
      `"${e.category}"`,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.vendor.replace(/"/g, '""')}"`,
      e.estimatedCost,
      e.actualCost,
      e.status,
      `"${e.dueDate || ''}"`,
      `"${e.paidDate || ''}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wedding-budget-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Financial Health Header Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
            Target Budget
          </span>
          <div className="mt-1 font-serif text-2xl font-medium text-stone-900 tabular-nums">
            ${targetBudget.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 mt-0.5">
            Set in wedding details
          </div>
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
            Committed / Spent
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-medium text-stone-900 tabular-nums">
              ${totalActual.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500 tabular-nums">
              ({budgetPercent}%)
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1 mt-2">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${budgetPercent > 100 ? 'bg-amber-600' : 'bg-stone-900'}`}
              style={{ width: `${Math.min(100, budgetPercent)}%` }}
            />
          </div>
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
            Remaining Buffer
          </span>
          <div className="mt-1 font-serif text-2xl font-medium text-emerald-800 tabular-nums">
            ${remainingBudget.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 mt-0.5">
            Available reserve
          </div>
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
            Pending Balance
          </span>
          <div className="mt-1 font-serif text-2xl font-medium text-amber-800 tabular-nums">
            ${pendingAmount.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 mt-0.5">
            Awaiting final invoice
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Grid */}
      <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <h3 className="font-serif text-lg font-medium text-stone-900">
              Category Allocations & Spend
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Live comparison of planned allocations against confirmed expenditures
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-stone-600 hover:text-stone-900 font-medium self-start sm:self-auto"
            >
              Clear category filter (Show all)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {categoryStats.map((item) => {
            const isSelected = selectedCategory === item.category;
            const catPercent = item.estimated > 0 ? Math.round((item.actual / item.estimated) * 100) : 0;
            return (
              <div
                key={item.category}
                onClick={() => setSelectedCategory(isSelected ? 'all' : item.category)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-stone-900 bg-stone-50 shadow-xs' 
                    : 'border-stone-200/70 bg-stone-50/40 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-stone-900 truncate">
                    {item.category}
                  </h4>
                  <span className="text-[11px] text-stone-500 tabular-nums">
                    {item.count} items
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline justify-between text-xs">
                  <span className="font-serif text-lg font-medium text-stone-900 tabular-nums">
                    ${item.actual.toLocaleString()}
                  </span>
                  <span className="text-stone-500 tabular-nums text-[11px]">
                    Est: ${item.estimated.toLocaleString()}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200/70 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.isOver ? 'bg-amber-600' : 'bg-stone-800'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, catPercent))}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className={item.isOver ? 'text-amber-700 font-medium' : 'text-stone-500'}>
                    {catPercent}% allocated
                  </span>
                  {item.isOver && (
                    <span className="text-amber-700 font-medium">
                      +${item.difference.toLocaleString()} over
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Ledger Table */}
      <div className="space-y-4">
        {/* Table Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search expense, vendor, receipt..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-white border border-stone-200 text-stone-700 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Payment Status Segmented Filter */}
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
                onClick={() => setStatusFilter('paid')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'paid' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setStatusFilter('deposit')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'deposit' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'pending' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={exportCSV}
              className="p-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-700 hover:text-stone-900 transition-colors shadow-2xs"
              title="Export Budget CSV"
              aria-label="Export Budget CSV"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white border border-stone-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200/80 text-stone-600 font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Expense Item & Notes</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Vendor</th>
                  <th className="py-3 px-3 text-right">Estimated</th>
                  <th className="py-3 px-3 text-right">Actual Paid</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Due / Paid</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-stone-500">
                      No expenses found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-stone-900 text-sm leading-snug">
                          {expense.title}
                        </div>
                        {expense.notes && (
                          <div className="text-[11px] text-stone-500 mt-0.5 truncate" title={expense.notes}>
                            {expense.notes}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-stone-700 whitespace-nowrap">
                        {expense.category}
                      </td>

                      <td className="py-3 px-3 text-stone-700 whitespace-nowrap">
                        {expense.vendor || '—'}
                      </td>

                      <td className="py-3 px-3 text-right text-stone-500 tabular-nums">
                        ${expense.estimatedCost.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right font-medium text-stone-900 tabular-nums">
                        ${expense.actualCost.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={expense.status}
                          onChange={(e) => updateExpense(expense.id, { status: e.target.value as PaymentStatus })}
                          className={`text-xs font-medium py-1 px-2 rounded-md border focus:outline-none transition-colors ${
                            expense.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : expense.status === 'deposit'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="paid">Paid</option>
                          <option value="deposit">Deposit</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 text-stone-500 text-[11px] whitespace-nowrap">
                        {expense.paidDate ? `Paid ${expense.paidDate}` : expense.dueDate ? `Due ${expense.dueDate}` : '—'}
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(expense)}
                            className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete expense "${expense.title}"?`)) {
                                deleteExpense(expense.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExpense ? 'Edit Expense Record' : 'Log New Expense'}
        subtitle="Track payment status, invoices and budget category breakdown"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Expense Item Description *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Wedding Cake & Dessert Station"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Budget Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as BudgetCategory })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                {ALL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Vendor / Payee
              </label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                placeholder="e.g. Pasticceria Cavour"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Estimated Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Actual Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.actualCost}
                onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Payment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PaymentStatus })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                <option value="pending">Pending</option>
                <option value="deposit">Deposit Paid</option>
                <option value="paid">Paid in Full</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Paid Date (Optional)
              </label>
              <input
                type="date"
                value={formData.paidDate}
                onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Receipt Reference / Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Invoice #2049, includes delivery fee and tasting discount..."
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
              {editingExpense ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
