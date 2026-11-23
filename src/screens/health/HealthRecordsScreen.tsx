import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Upload,
  Search,
  FileText,
  Download,
  Share2,
  Trash2,
  Eye,
  Plus,
  X,
  File,
  ShieldCheck,
} from 'lucide-react';
import { HealthRecord } from '../../types';

export const HealthRecordsScreen: React.FC = () => {
  const {
    goBack,
    healthRecords,
    addHealthRecord,
    deleteHealthRecord,
    showConfirmDialog,
    showToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<HealthRecord | null>(null);

  // Upload Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Prescriptions');
  const [newDoctor, setNewDoctor] = useState('Apollo Hospital');
  const [newNotes, setNewNotes] = useState('');

  const categories = [
    'All',
    'Prescriptions',
    'Lab reports',
    'Imaging',
    'Vaccination records',
    'Discharge summaries',
    'Other documents',
  ];

  const filteredRecords = healthRecords.filter((rec) => {
    const matchesCat = selectedCategory === 'All' || rec.category === selectedCategory;
    const matchesSearch =
      rec.title.toLowerCase().includes(search.toLowerCase()) ||
      rec.doctorOrProvider.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter document title', 'warning');
      return;
    }
    addHealthRecord({
      title: newTitle,
      category: newCategory,
      date: 'Today',
      doctorOrProvider: newDoctor,
      fileSize: '1.2 MB',
      fileType: 'pdf',
      fileUrl: '#',
      notes: newNotes,
    });
    setIsUploadOpen(false);
    setNewTitle('');
    setNewNotes('');
  };

  const handleDelete = (id: string, title: string) => {
    showConfirmDialog({
      title: 'Delete Medical Record?',
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmLabel: 'Delete Record',
      isDestructive: true,
      onConfirm: () => deleteHealthRecord(id),
    });
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Health</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">My Health Records</span>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1 bg-[#087E8B] hover:bg-[#06626D] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records by title, doctor or hospital..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
          />
        </div>

        {/* Categories horizontal scroll */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#087E8B] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Records List */}
        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#172B4D]">No documents in this category</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Upload prescriptions, lab reports, or discharge summaries
              </p>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 bg-[#087E8B] text-white rounded-xl text-xs font-bold"
              >
                Upload First Record
              </button>
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 font-bold text-xs uppercase">
                      {rec.fileType}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#172B4D]">{rec.title}</h4>
                      <p className="text-[11px] text-teal-700 font-semibold">{rec.category}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {rec.doctorOrProvider} • {rec.date} ({rec.fileSize})
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(rec.id, rec.title)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {rec.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{rec.notes}"
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setPreviewDoc(rec)}
                    className="flex items-center gap-1 font-bold text-[#087E8B] hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Document</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast('Share link copied to clipboard', 'info')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                      title="Share document"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => showToast('Document downloaded to device storage', 'success')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                      title="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#172B4D]">Upload Medical Record</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cardiology OPD Prescription"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                >
                  <option value="Prescriptions">Prescriptions</option>
                  <option value="Lab reports">Lab reports</option>
                  <option value="Imaging">Imaging (X-Ray / MRI / CT)</option>
                  <option value="Vaccination records">Vaccination records</option>
                  <option value="Discharge summaries">Discharge summaries</option>
                  <option value="Other documents">Other documents</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Doctor or Provider
                </label>
                <input
                  type="text"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Clinical Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Key diagnoses, recommended doses, doctor advice"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Document Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 space-y-3">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-[#172B4D]">{previewDoc.title}</h3>
                <p className="text-xs text-slate-400">
                  {previewDoc.doctorOrProvider} • {previewDoc.date}
                </p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document graphic */}
            <div className="h-56 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
              <File className="w-16 h-16 text-teal-600 mb-2" />
              <p className="text-xs font-bold text-slate-800">Verified Medical Document</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                {previewDoc.notes || 'Full high-resolution PDF preview available on download'}
              </p>
            </div>

            <button
              onClick={() => {
                showToast('Document downloaded', 'success');
                setPreviewDoc(null);
              }}
              className="w-full py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
