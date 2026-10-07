import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Heart, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Users, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Modal } from '../common/Modal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    settings, 
    updateSettings, 
    resetToDemoData, 
    exportDataJSON, 
    importDataJSON 
  } = useWedding();

  const [formData, setFormData] = useState({
    partner1Name: settings.partner1Name,
    partner2Name: settings.partner2Name,
    weddingDate: settings.weddingDate,
    venueName: settings.venueName,
    venueLocation: settings.venueLocation,
    targetBudget: settings.targetBudget.toString(),
    expectedGuests: settings.expectedGuests.toString(),
    themeNotes: settings.themeNotes || '',
  });

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      partner1Name: formData.partner1Name.trim(),
      partner2Name: formData.partner2Name.trim(),
      weddingDate: formData.weddingDate,
      venueName: formData.venueName.trim(),
      venueLocation: formData.venueLocation.trim(),
      targetBudget: parseFloat(formData.targetBudget) || 50000,
      expectedGuests: parseInt(formData.expectedGuests, 10) || 100,
      themeNotes: formData.themeNotes.trim() || undefined,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJSON(content);
        if (ok) {
          setImportStatus('Wedding plan imported successfully!');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1200);
        } else {
          setImportStatus('Error: Invalid JSON backup file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all guests, budget, checklist and schedule to the realistic initial demo state? Any custom additions will be restored to default.')) {
      resetToDemoData();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wedding Details & Settings"
      subtitle="Customize celebration parameters, budget target, and data backup"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSave} className="space-y-5">
        {/* Couple Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Partner 1 Name *
            </label>
            <input
              type="text"
              required
              value={formData.partner1Name}
              onChange={(e) => setFormData({ ...formData, partner1Name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Partner 2 Name *
            </label>
            <input
              type="text"
              required
              value={formData.partner2Name}
              onChange={(e) => setFormData({ ...formData, partner2Name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
        </div>

        {/* Date and Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Wedding Date & Time *
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
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Venue Location / City
            </label>
            <input
              type="text"
              value={formData.venueLocation}
              onChange={(e) => setFormData({ ...formData, venueLocation: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
            Wedding Aesthetic & Vision Statement
          </label>
          <textarea
            rows={2}
            value={formData.themeNotes}
            onChange={(e) => setFormData({ ...formData, themeNotes: e.target.value })}
            placeholder="e.g. Understated Tuscan romance · Natural linen, olive leaves, warm champagne candlelight"
            className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>

        {/* Data Persistence, Backup & Demo Restore */}
        <div className="pt-4 border-t border-stone-200/80 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            Offline Storage & Data Management
          </div>
          <p className="text-xs text-stone-500">
            All data persists locally in your browser. You can export a JSON backup file or restore the realistic initial demonstration data.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={exportDataJSON}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup (JSON)</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors shadow-2xs cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Plan (JSON)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Demo Data</span>
            </button>
          </div>

          {importStatus && (
            <div className={`text-xs p-2 rounded-lg ${
              importStatus.includes('Error') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {importStatus}
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-stone-200/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{saveSuccess ? 'Saved' : 'Save Details'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
