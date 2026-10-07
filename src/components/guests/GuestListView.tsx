import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  LayoutList, 
  LayoutGrid, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  UserCheck, 
  UserX, 
  Clock, 
  Utensils, 
  Download,
  Copy,
  Check
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, RSVPStatus, DietaryRequirement } from '../../types/wedding';
import { Modal } from '../common/Modal';

interface GuestListViewProps {
  externalAddOpen?: boolean;
  onCloseExternalAdd?: () => void;
}

export const GuestListView: React.FC<GuestListViewProps> = ({
  externalAddOpen,
  onCloseExternalAdd
}) => {
  const { guests, addGuest, updateGuest, deleteGuest, bulkUpdateRSVP } = useWedding();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | RSVPStatus>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    rsvpStatus: RSVPStatus;
    hasPlusOne: boolean;
    plusOneName: string;
    tableNumber: string;
    dietaryRequirement: DietaryRequirement;
    dietaryNotes: string;
    invitationSent: boolean;
    notes: string;
  }>({
    name: '',
    email: '',
    phone: '',
    rsvpStatus: 'pending',
    hasPlusOne: false,
    plusOneName: '',
    tableNumber: '',
    dietaryRequirement: 'None',
    dietaryNotes: '',
    invitationSent: true,
    notes: '',
  });

  // Handle external trigger from Quick Actions
  React.useEffect(() => {
    if (externalAddOpen) {
      handleOpenCreate();
      if (onCloseExternalAdd) onCloseExternalAdd();
    }
  }, [externalAddOpen]);

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        guest.name.toLowerCase().includes(q) ||
        (guest.email && guest.email.toLowerCase().includes(q)) ||
        (guest.plusOneName && guest.plusOneName.toLowerCase().includes(q)) ||
        (guest.tableNumber && guest.tableNumber.toLowerCase().includes(q)) ||
        (guest.notes && guest.notes.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // RSVP
      if (rsvpFilter !== 'all' && guest.rsvpStatus !== rsvpFilter) return false;

      // Dietary
      if (dietaryFilter !== 'all' && guest.dietaryRequirement !== dietaryFilter) return false;

      return true;
    });
  }, [guests, searchQuery, rsvpFilter, dietaryFilter]);

  // Headcount Summary
  const summary = useMemo(() => {
    let totalInvited = 0;
    let attending = 0;
    let declined = 0;
    let pending = 0;
    let plusOnes = 0;

    guests.forEach((g) => {
      const size = g.hasPlusOne ? 2 : 1;
      totalInvited += size;
      if (g.hasPlusOne) plusOnes++;
      if (g.rsvpStatus === 'attending') attending += size;
      else if (g.rsvpStatus === 'declined') declined += size;
      else pending += size;
    });

    return { totalInvited, attending, declined, pending, plusOnes, totalEntries: guests.length };
  }, [guests]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingGuest(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      rsvpStatus: 'pending',
      hasPlusOne: false,
      plusOneName: '',
      tableNumber: '',
      dietaryRequirement: 'None',
      dietaryNotes: '',
      invitationSent: true,
      notes: '',
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
      rsvpStatus: guest.rsvpStatus,
      hasPlusOne: guest.hasPlusOne,
      plusOneName: guest.plusOneName || '',
      tableNumber: guest.tableNumber || '',
      dietaryRequirement: guest.dietaryRequirement,
      dietaryNotes: guest.dietaryNotes || '',
      invitationSent: guest.invitationSent,
      notes: guest.notes || '',
    });
    setModalOpen(true);
  };

  // Save Guest
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingGuest) {
      updateGuest(editingGuest.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        rsvpStatus: formData.rsvpStatus,
        hasPlusOne: formData.hasPlusOne,
        plusOneName: formData.hasPlusOne ? formData.plusOneName.trim() : undefined,
        tableNumber: formData.tableNumber.trim() || undefined,
        dietaryRequirement: formData.dietaryRequirement,
        dietaryNotes: formData.dietaryNotes.trim() || undefined,
        invitationSent: formData.invitationSent,
        notes: formData.notes.trim() || undefined,
      });
    } else {
      addGuest({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        rsvpStatus: formData.rsvpStatus,
        hasPlusOne: formData.hasPlusOne,
        plusOneName: formData.hasPlusOne ? formData.plusOneName.trim() : undefined,
        tableNumber: formData.tableNumber.trim() || undefined,
        dietaryRequirement: formData.dietaryRequirement,
        dietaryNotes: formData.dietaryNotes.trim() || undefined,
        invitationSent: formData.invitationSent,
        notes: formData.notes.trim() || undefined,
        partySize: formData.hasPlusOne ? 2 : 1,
      });
    }

    setModalOpen(false);
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'RSVP Status', 'Has Plus One', 'Plus One Name', 'Table', 'Dietary', 'Dietary Notes', 'Invitation Sent', 'Notes'];
    const rows = guests.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${(g.email || '').replace(/"/g, '""')}"`,
      `"${(g.phone || '').replace(/"/g, '""')}"`,
      `"${g.rsvpStatus}"`,
      `"${g.hasPlusOne ? 'Yes' : 'No'}"`,
      `"${(g.plusOneName || '').replace(/"/g, '""')}"`,
      `"${(g.tableNumber || '').replace(/"/g, '""')}"`,
      `"${g.dietaryRequirement}"`,
      `"${(g.dietaryNotes || '').replace(/"/g, '""')}"`,
      `"${g.invitationSent ? 'Sent' : 'Pending'}"`,
      `"${(g.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wedding-guest-list-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copySummary = () => {
    const text = `WEDDING GUEST LIST SUMMARY\n` +
      `Total Headcount: ${summary.totalInvited} (${summary.totalEntries} invitation units)\n` +
      `Confirmed Attending: ${summary.attending}\n` +
      `Declined: ${summary.declined}\n` +
      `Awaiting Response: ${summary.pending}\n` +
      `Plus-Ones Included: ${summary.plusOnes}`;
    
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const getRsvpBadge = (status: RSVPStatus) => {
    switch (status) {
      case 'attending':
        return <span className="text-emerald-700 text-xs font-medium">Attending</span>;
      case 'declined':
        return <span className="text-stone-400 text-xs font-medium">Declined</span>;
      case 'pending':
        return <span className="text-amber-700 text-xs font-medium">Pending</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Summary Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-stone-200/80 rounded-xl p-4 shadow-xs">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
            Total Headcount
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-medium text-stone-900 tabular-nums">
              {summary.totalInvited}
            </span>
            <span className="text-xs text-stone-500">
              ({summary.totalEntries} invites)
            </span>
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
            Confirmed Attending
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-medium text-emerald-800 tabular-nums">
              {summary.attending}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              {summary.totalInvited > 0 ? `${Math.round((summary.attending / summary.totalInvited) * 100)}%` : '0%'}
            </span>
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
            Awaiting RSVP
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-medium text-amber-800 tabular-nums">
              {summary.pending}
            </span>
            <span className="text-xs text-stone-500">guests</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
            Declined
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-medium text-stone-600 tabular-nums">
              {summary.declined}
            </span>
            <span className="text-xs text-stone-500">guests</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, View Mode, Actions */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search & Select Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, table..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* RSVP Status Tabs (Functional Segmented Control) */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200/60">
            <button
              onClick={() => setRsvpFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                rsvpFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRsvpFilter('attending')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                rsvpFilter === 'attending'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Attending
            </button>
            <button
              onClick={() => setRsvpFilter('pending')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                rsvpFilter === 'pending'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setRsvpFilter('declined')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                rsvpFilter === 'declined'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Declined
            </button>
          </div>

          {/* Dietary Filter */}
          <select
            value={dietaryFilter}
            onChange={(e) => setDietaryFilter(e.target.value)}
            className="text-xs bg-white border border-stone-200 text-stone-700 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
          >
            <option value="all">All Dietary Needs</option>
            <option value="None">Standard / None</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Nut Allergy">Nut Allergy</option>
            <option value="Dairy-Free">Dairy-Free</option>
            <option value="Halal">Halal</option>
          </select>
        </div>

        {/* View Switch & Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {/* Table / Cards toggle */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200/60">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Card view"
              aria-label="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export & Copy buttons */}
          <button
            onClick={copySummary}
            className="p-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-700 hover:text-stone-900 transition-colors shadow-2xs"
            title="Copy guest summary to clipboard"
            aria-label="Copy guest summary"
          >
            {copiedNotification ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={exportCSV}
            className="p-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-700 hover:text-stone-900 transition-colors shadow-2xs"
            title="Export CSV"
            aria-label="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Add Guest Button */}
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Main Guest Content */}
      {filteredGuests.length === 0 ? (
        <div className="bg-white border border-stone-200/80 rounded-xl p-12 text-center">
          <p className="font-serif text-lg text-stone-800 font-medium">No guests match your criteria</p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset the RSVP and dietary filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setRsvpFilter('all'); setDietaryFilter('all'); }}
            className="mt-4 px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* High-Density Table View */
        <div className="bg-white border border-stone-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200/80 text-stone-600 font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Guest Name & Party</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">RSVP Status</th>
                  <th className="py-3 px-3">Table Seating</th>
                  <th className="py-3 px-3">Dietary Needs</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Name & Party */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-900 text-sm">
                        {guest.name}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                        {guest.hasPlusOne ? (
                          <span>+1: {guest.plusOneName || 'Guest Included'}</span>
                        ) : (
                          <span>Solo Guest</span>
                        )}
                        {guest.notes && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="truncate max-w-[200px]" title={guest.notes}>
                              {guest.notes}
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3 text-stone-600">
                      <div>{guest.email || '—'}</div>
                      {guest.phone && (
                        <div className="text-[11px] text-stone-400 mt-0.5">{guest.phone}</div>
                      )}
                    </td>

                    {/* RSVP Status selector */}
                    <td className="py-3 px-3">
                      <select
                        value={guest.rsvpStatus}
                        onChange={(e) => updateGuest(guest.id, { rsvpStatus: e.target.value as RSVPStatus })}
                        className={`text-xs font-medium py-1 px-2 rounded-md border focus:outline-none transition-colors ${
                          guest.rsvpStatus === 'attending'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : guest.rsvpStatus === 'declined'
                            ? 'bg-stone-100 text-stone-600 border-stone-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="attending">Attending</option>
                        <option value="pending">Pending</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>

                    {/* Table */}
                    <td className="py-3 px-3 text-stone-800">
                      {guest.tableNumber ? (
                        <span className="font-medium">{guest.tableNumber}</span>
                      ) : (
                        <span className="text-stone-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Dietary Requirement */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-stone-800">
                        {guest.dietaryRequirement !== 'None' ? guest.dietaryRequirement : 'Standard'}
                      </div>
                      {guest.dietaryNotes && (
                        <div className="text-[11px] text-amber-700 italic mt-0.5">
                          {guest.dietaryNotes}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(guest)}
                          className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
                          title="Edit Guest"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove ${guest.name} from guest list?`)) {
                              deleteGuest(guest.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Guest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuests.map((guest) => (
            <div
              key={guest.id}
              className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-lg font-medium text-stone-900 leading-snug">
                      {guest.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {guest.hasPlusOne ? `Party of 2 (+1: ${guest.plusOneName || 'Guest'})` : 'Party of 1'}
                    </p>
                  </div>
                  <div>
                    {getRsvpBadge(guest.rsvpStatus)}
                  </div>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                  {guest.tableNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Seating:</span>
                      <span className="font-medium text-stone-800">{guest.tableNumber}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Dietary:</span>
                    <span className="font-medium text-stone-800">{guest.dietaryRequirement}</span>
                  </div>

                  {guest.dietaryNotes && (
                    <div className="text-[11px] text-amber-700 bg-amber-50/60 p-1.5 rounded border border-amber-200/50">
                      {guest.dietaryNotes}
                    </div>
                  )}

                  {guest.email && (
                    <div className="flex items-center gap-1.5 text-stone-500 truncate pt-1">
                      <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{guest.email}</span>
                    </div>
                  )}

                  {guest.notes && (
                    <p className="text-[11px] text-stone-500 italic pt-1">
                      "{guest.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <select
                  value={guest.rsvpStatus}
                  onChange={(e) => updateGuest(guest.id, { rsvpStatus: e.target.value as RSVPStatus })}
                  className="text-xs py-1 px-2 bg-stone-50 border border-stone-200 rounded text-stone-700"
                >
                  <option value="attending">Attending</option>
                  <option value="pending">Pending</option>
                  <option value="declined">Declined</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(guest)}
                    className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove ${guest.name}?`)) deleteGuest(guest.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Guest Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGuest ? 'Edit Guest Details' : 'Add Guest to List'}
        subtitle="Manage RSVP status, dietary requirements, and table arrangements"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Charlotte Bennett"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* Contact: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="charlotte@example.com"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          {/* RSVP Status & Table Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                RSVP Status
              </label>
              <select
                value={formData.rsvpStatus}
                onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value as RSVPStatus })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                <option value="pending">Pending</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Table Assignment
              </label>
              <input
                type="text"
                value={formData.tableNumber}
                onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                placeholder="e.g. Table 03 - Tuscan Cypress"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          {/* Plus One Toggle & Name */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasPlusOne}
                onChange={(e) => setFormData({ ...formData, hasPlusOne: e.target.checked })}
                className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400"
              />
              <span className="text-xs font-medium text-stone-800">
                Include Plus-One (+1 Party Member)
              </span>
            </label>

            {formData.hasPlusOne && (
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Plus-One Name (if known)
                </label>
                <input
                  type="text"
                  value={formData.plusOneName}
                  onChange={(e) => setFormData({ ...formData, plusOneName: e.target.value })}
                  placeholder="e.g. James Bennett"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>
            )}
          </div>

          {/* Dietary Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Dietary Preference
              </label>
              <select
                value={formData.dietaryRequirement}
                onChange={(e) => setFormData({ ...formData, dietaryRequirement: e.target.value as DietaryRequirement })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                <option value="None">Standard / No Restrictions</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Nut Allergy">Nut Allergy</option>
                <option value="Dairy-Free">Dairy-Free</option>
                <option value="Halal">Halal</option>
                <option value="Custom">Custom / Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Dietary Details / Allergies
              </label>
              <input
                type="text"
                value={formData.dietaryNotes}
                onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
                placeholder="e.g. Severe peanut allergy"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          {/* Invitation Status & Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Personal Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Special accommodations, hotel block booking status..."
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* Form Actions */}
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
              {editingGuest ? 'Save Changes' : 'Add Guest'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
