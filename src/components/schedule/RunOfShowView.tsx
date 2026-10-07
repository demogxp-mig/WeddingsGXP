import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Plus, 
  MapPin, 
  User, 
  Phone, 
  Edit2, 
  Trash2, 
  Printer, 
  Sparkles, 
  AlertCircle,
  Copy,
  Check,
  Search
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { ScheduleEvent } from '../../types/wedding';
import { Modal } from '../common/Modal';

interface RunOfShowViewProps {
  externalAddOpen?: boolean;
  onCloseExternalAdd?: () => void;
}

export const RunOfShowView: React.FC<RunOfShowViewProps> = ({
  externalAddOpen,
  onCloseExternalAdd
}) => {
  const { schedule, addScheduleEvent, updateScheduleEvent, deleteScheduleEvent, settings } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    startTime: string;
    endTime: string;
    activity: string;
    location: string;
    assignedLead: string;
    vendorContact: string;
    cuesNotes: string;
    isMilestone: boolean;
  }>({
    startTime: '16:00',
    endTime: '16:45',
    activity: '',
    location: '',
    assignedLead: '',
    vendorContact: '',
    cuesNotes: '',
    isMilestone: false,
  });

  // Handle external trigger
  React.useEffect(() => {
    if (externalAddOpen) {
      handleOpenCreate();
      if (onCloseExternalAdd) onCloseExternalAdd();
    }
  }, [externalAddOpen]);

  const filteredSchedule = useMemo(() => {
    return schedule.filter(item => {
      const q = searchQuery.toLowerCase();
      return (
        item.activity.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.assignedLead.toLowerCase().includes(q) ||
        (item.cuesNotes && item.cuesNotes.toLowerCase().includes(q))
      );
    });
  }, [schedule, searchQuery]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      startTime: '14:00',
      endTime: '15:00',
      activity: '',
      location: '',
      assignedLead: '',
      vendorContact: '',
      cuesNotes: '',
      isMilestone: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setFormData({
      startTime: event.startTime,
      endTime: event.endTime,
      activity: event.activity,
      location: event.location,
      assignedLead: event.assignedLead,
      vendorContact: event.vendorContact || '',
      cuesNotes: event.cuesNotes || '',
      isMilestone: !!event.isMilestone,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activity.trim() || !formData.startTime.trim()) return;

    if (editingEvent) {
      updateScheduleEvent(editingEvent.id, {
        startTime: formData.startTime.trim(),
        endTime: formData.endTime.trim() || formData.startTime.trim(),
        activity: formData.activity.trim(),
        location: formData.location.trim() || 'Main Venue Grounds',
        assignedLead: formData.assignedLead.trim() || 'Coordinator',
        vendorContact: formData.vendorContact.trim() || undefined,
        cuesNotes: formData.cuesNotes.trim() || undefined,
        isMilestone: formData.isMilestone,
      });
    } else {
      addScheduleEvent({
        startTime: formData.startTime.trim(),
        endTime: formData.endTime.trim() || formData.startTime.trim(),
        activity: formData.activity.trim(),
        location: formData.location.trim() || 'Main Venue Grounds',
        assignedLead: formData.assignedLead.trim() || 'Coordinator',
        vendorContact: formData.vendorContact.trim() || undefined,
        cuesNotes: formData.cuesNotes.trim() || undefined,
        isMilestone: formData.isMilestone,
      });
    }

    setModalOpen(false);
  };

  const handleCopySchedule = () => {
    const lines = [
      `WEDDING DAY-OF RUN OF SHOW`,
      `${settings.partner1Name} & ${settings.partner2Name}`,
      `${settings.venueName} · ${settings.weddingDate.slice(0, 10)}`,
      `----------------------------------------------------`
    ];

    schedule.forEach(item => {
      lines.push(`${item.startTime} - ${item.endTime} | ${item.activity}`);
      lines.push(`  Location: ${item.location} | Lead: ${item.assignedLead}`);
      if (item.cuesNotes) lines.push(`  Cues: ${item.cuesNotes}`);
      lines.push(``);
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Run of Show Header */}
      <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-stone-600" />
              <span>Day-of Master Timeline</span>
            </div>
            <h3 className="font-serif text-2xl font-medium text-stone-900 mt-1">
              Run of Show Schedule
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {schedule.length} programmed cues spanning arrival, ceremony, reception & late-night send-off
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopySchedule}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors shadow-2xs"
            >
              {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotification ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Run of Show</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities, locations, or lead contacts..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 space-y-6">
        {filteredSchedule.map((item, idx) => (
          <div 
            key={item.id} 
            className="relative group bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs transition-all hover:border-stone-300"
          >
            {/* Timeline Bullet Anchor */}
            <div 
              className={`absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs transition-colors ${
                item.isMilestone ? 'bg-amber-600 ring-2 ring-amber-200' : 'bg-stone-800'
              }`} 
            />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {/* Time & Milestone tag */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-serif text-lg font-semibold text-stone-900 tabular-nums">
                    {item.startTime} – {item.endTime}
                  </span>
                  {item.isMilestone && (
                    <span className="text-[11px] font-semibold text-amber-800">
                      Key Milestone
                    </span>
                  )}
                </div>

                {/* Activity title */}
                <h4 className="font-serif text-xl font-normal text-stone-900 mt-1">
                  {item.activity}
                </h4>

                {/* Unboxed Location & Lead Details */}
                <div className="mt-2 flex items-center gap-2 text-xs text-stone-600 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {item.location}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    Lead: {item.assignedLead}
                  </span>
                  {item.vendorContact && (
                    <>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="flex items-center gap-1 text-stone-500">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {item.vendorContact}
                      </span>
                    </>
                  )}
                </div>

                {/* Cues & Notes Callout */}
                {item.cuesNotes && (
                  <div className="mt-3 text-xs bg-stone-50 border border-stone-200/70 rounded-lg p-2.5 text-stone-700">
                    <span className="font-semibold text-stone-900 mr-1.5">Coordinator Cue:</span>
                    {item.cuesNotes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
                  title="Edit item"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete event "${item.activity}"?`)) deleteScheduleEvent(item.id);
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Schedule Item Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit Run of Show Item' : 'Add Run of Show Activity'}
        subtitle="Specify precise timing, event location, lead contacts and execution cues"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Activity Name *
            </label>
            <input
              type="text"
              required
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              placeholder="e.g. Cocktail Hour & String Trio Recital"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Location on Grounds
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Olive Grove Court"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Assigned Lead
              </label>
              <input
                type="text"
                value={formData.assignedLead}
                onChange={(e) => setFormData({ ...formData, assignedLead: e.target.value })}
                placeholder="e.g. Wedding Coordinator Elena"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Vendor Contact Info
            </label>
            <input
              type="text"
              value={formData.vendorContact}
              onChange={(e) => setFormData({ ...formData, vendorContact: e.target.value })}
              placeholder="e.g. Quartetto d'Archi (+39 055 33219)"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Specific Timing Cues & Notes
            </label>
            <textarea
              rows={2}
              value={formData.cuesNotes}
              onChange={(e) => setFormData({ ...formData, cuesNotes: e.target.value })}
              placeholder="e.g. Officiant cue: signal musicians after bride kisses father..."
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isMilestone}
                onChange={(e) => setFormData({ ...formData, isMilestone: e.target.checked })}
                className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400"
              />
              <span className="text-xs font-medium text-stone-800">
                Mark as Key Milestone Event (e.g. Ceremony, First Dance, Cake Cutting)
              </span>
            </label>
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
              {editingEvent ? 'Save Changes' : 'Schedule Activity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
