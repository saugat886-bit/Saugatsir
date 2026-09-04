// Notice Board & Emergency Alert System for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  Send,
  Sparkles,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { Notice, UserProfile } from '../types';

interface NoticeBoardModuleProps {
  currentUser: UserProfile | null;
  notices: Notice[];
  onAddNotice: (notice: Omit<Notice, 'id'>) => void;
  onToggleEmergency: (noticeId: string) => void;
}

export const NoticeBoardModule: React.FC<NoticeBoardModuleProps> = ({
  currentUser,
  notices,
  onAddNotice,
  onToggleEmergency
}) => {
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Notice['category']>('ACADEMIC');
  const [targetAudience, setTargetAudience] = useState<Notice['targetAudience']>('ALL');
  const [isEmergency, setIsEmergency] = useState(false);

  const isAdminOrCoordinator = currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'PRINCIPAL' ||
    currentUser?.role === 'VICE_PRINCIPAL' ||
    currentUser?.role === 'ACADEMIC_COORDINATOR';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onAddNotice({
      title,
      content,
      category,
      targetAudience,
      isEmergency,
      publishedBy: currentUser?.fullName || 'School Administration',
      publishedDate: new Date().toISOString().split('T')[0]
    });
    setIsAddNoticeOpen(false);
    setTitle('');
    setContent('');
    setIsEmergency(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-400" />
            <h1 className="text-lg font-bold text-white">Official Notice Board & Emergency Broadcast</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Sungabha Public Secondary School • Direct communication to Parents, Students & Faculty
          </p>
        </div>

        {isAdminOrCoordinator && (
          <button
            onClick={() => setIsAddNoticeOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`rounded-3xl p-5 border transition-all shadow-xl space-y-3 relative overflow-hidden ${
              notice.isEmergency
                ? 'bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-900 border-red-500/60 ring-2 ring-red-500/30'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  notice.isEmergency
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-800 text-sky-300 border border-slate-700'
                }`}>
                  {notice.category}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Target: <span className="text-slate-200">{notice.targetAudience}</span>
                </span>
              </div>
              <span className="text-xs text-slate-400">{notice.publishedDate}</span>
            </div>

            <h2 className="text-base font-bold text-white leading-snug">{notice.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{notice.content}</p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Published by: <span className="text-slate-200 font-semibold">{notice.publishedBy}</span></span>

              {isAdminOrCoordinator && (
                <button
                  onClick={() => onToggleEmergency(notice.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    notice.isEmergency
                      ? 'bg-red-600/30 text-red-300 hover:bg-red-600/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {notice.isEmergency ? 'Emergency Active' : 'Set as Emergency'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Notice Modal */}
      {isAddNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Publish Notice or Circular</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Notice Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for First Terminal Examination 2082"
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAMINATION">Examination</option>
                    <option value="HOLIDAY">Holiday Notice</option>
                    <option value="FEE">Fee Notice</option>
                    <option value="EVENT">Event & ECA</option>
                    <option value="EMERGENCY">Emergency Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-rose-500"
                  >
                    <option value="ALL">All School (Parents & Staff)</option>
                    <option value="PARENTS">Parents Only</option>
                    <option value="STUDENTS">Students Only</option>
                    <option value="TEACHERS">Teachers Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Notice Body</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write clear, formal notice content here in English or Nepali..."
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl p-3 outline-none focus:border-rose-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/30 rounded-xl">
                <input
                  type="checkbox"
                  id="emergency-checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="emergency-checkbox" className="text-xs font-bold text-red-300 cursor-pointer">
                  Display as Top Emergency Banner across all user accounts
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddNoticeOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-rose-600/20 cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
