import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  UserCheck, 
  Briefcase, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  MessageSquare,
  Send,
  FileText,
  User,
  Heart,
  Award,
  BookOpen,
  Camera,
  Plus,
  Trash2,
  Tag,
  Sparkles,
  Paperclip,
  Check,
  ShieldCheck,
  UploadCloud,
  FileCheck
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus, StudentPortfolioItem, UserProfile } from '../types';
import { getNepaliDate } from '../utils/nepaliDate';

interface StudentDetailModalProps {
  student: Student | null;
  records: AttendanceRecord[];
  currentUser: UserProfile | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onMarkAttendance: (studentId: string, status: AttendanceStatus, remark?: string) => void;
  onUpdateStudentPortfolio: (studentId: string, updatedPortfolio: StudentPortfolioItem[]) => void;
  onUpdateStudentAvatar?: (studentId: string, avatarUrl: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  records,
  currentUser,
  onClose,
  onEdit,
  onMarkAttendance,
  onUpdateStudentPortfolio,
  onUpdateStudentAvatar
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'attendance' | 'notice'>('profile');
  const [selectedNoticeType, setSelectedNoticeType] = useState<'absent' | 'late' | 'custom' | 'praise'>('absent');
  const [customNoticeText, setCustomNoticeText] = useState('');

  // Portfolio Form State
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioCategory, setPortfolioCategory] = useState<StudentPortfolioItem['category']>('achievement');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [portfolioDate, setPortfolioDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [portfolioImageUrl, setPortfolioImageUrl] = useState('');
  const [portfolioAttachmentName, setPortfolioAttachmentName] = useState('');
  const [portfolioFilter, setPortfolioFilter] = useState<string>('ALL');

  // Avatar Upload State
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  if (!student) return null;

  const roleUpper = currentUser?.role?.toUpperCase() || '';
  const isAdmin = !currentUser || 
    roleUpper === 'SUPER_ADMIN' || 
    roleUpper === 'PRINCIPAL' || 
    roleUpper === 'VICE_PRINCIPAL' || 
    roleUpper === 'ACADEMIC_COORDINATOR' ||
    roleUpper === 'ADMIN';
  const teacherName = currentUser?.displayName || 'Class Teacher';

  const studentRecords = records
    .filter(r => r.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalDays = studentRecords.length;
  const presentDays = studentRecords.filter(r => r.status === 'present').length;
  const absentDays = studentRecords.filter(r => r.status === 'absent').length;
  const lateDays = studentRecords.filter(r => r.status === 'late').length;
  const excusedDays = studentRecords.filter(r => r.status === 'excused').length;
  const rate = totalDays > 0 ? Math.round(((presentDays + lateDays * 0.5) / totalDays) * 100) : 100;

  const cleanParentPhone = (student.parents.phone || student.phone || '').replace(/[^0-9]/g, '');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = studentRecords.find(r => r.date === todayStr);

  const getNoticeMessage = () => {
    const nepToday = getNepaliDate(todayStr);
    if (selectedNoticeType === 'absent') {
      return `Dear ${student.parents.primaryContactName}, this is a notice from school that your ward ${student.fullName} (${student.className}-${student.section}) was marked ABSENT today (${nepToday.formattedNp} / ${todayStr}). Please provide a reason or medical slip if applicable.`;
    } else if (selectedNoticeType === 'late') {
      return `Dear ${student.parents.primaryContactName}, your ward ${student.fullName} arrived LATE to school today (${nepToday.formattedBadge}). Please ensure timely arrival.`;
    } else if (selectedNoticeType === 'praise') {
      return `Dear ${student.parents.primaryContactName}, we are pleased to inform you that ${student.fullName} is demonstrating excellent attendance and active classroom participation! Keep up the great work.`;
    }
    return customNoticeText || `Dear ${student.parents.primaryContactName}, regarding student ${student.fullName}...`;
  };

  const handleAddPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioTitle.trim()) return;

    const newItem: StudentPortfolioItem = {
      id: `port_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: portfolioTitle.trim(),
      category: portfolioCategory,
      description: portfolioDescription.trim(),
      date: portfolioDate || new Date().toISOString().split('T')[0],
      addedBy: teacherName,
      imageUrl: portfolioImageUrl.trim() || undefined,
      attachmentName: portfolioAttachmentName.trim() || undefined
    };

    const currentPortfolio = student.portfolio || [];
    const updated = [newItem, ...currentPortfolio];
    onUpdateStudentPortfolio(student.id, updated);

    // Reset Form
    setPortfolioTitle('');
    setPortfolioDescription('');
    setPortfolioImageUrl('');
    setPortfolioAttachmentName('');
    setIsAddingPortfolio(false);
  };

  const handleDeletePortfolioItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to remove this portfolio entry?')) {
      const currentPortfolio = student.portfolio || [];
      const updated = currentPortfolio.filter(p => p.id !== itemId);
      onUpdateStudentPortfolio(student.id, updated);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPortfolioImageUrl(reader.result);
          setPortfolioAttachmentName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && onUpdateStudentAvatar) {
          onUpdateStudentAvatar(student.id, reader.result);
          setIsChangingAvatar(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const portfolioList = student.portfolio || [];
  const filteredPortfolio = portfolioFilter === 'ALL' 
    ? portfolioList 
    : portfolioList.filter(p => p.category === portfolioFilter);

  const getCategoryBadge = (category: StudentPortfolioItem['category']) => {
    switch (category) {
      case 'achievement':
        return { label: 'Achievement / Award', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Award };
      case 'behavior':
        return { label: 'Behavioral Praise', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: Sparkles };
      case 'academic':
        return { label: 'Academic & Project', bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30', icon: BookOpen };
      case 'certificate':
        return { label: 'Certificate / Doc', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30', icon: FileCheck };
      case 'meeting':
        return { label: 'Parent Meeting Log', bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', icon: UserCheck };
      default:
        return { label: 'General Remark', bg: 'bg-slate-800 text-slate-300 border-slate-700', icon: Tag };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-4 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header with Student Identity & Navigation Tabs */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-5 sm:p-6 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              {/* Student Photo with Teacher Change Action */}
              <div className="relative group flex-shrink-0">
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={student.fullName}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-sky-500/40 shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center border-2 border-sky-400/40 shadow-lg">
                    {student.fullName.charAt(0)}
                  </div>
                )}
                
                {/* Photo Upload Trigger for Teachers & Admin */}
                <button
                  type="button"
                  onClick={() => setIsChangingAvatar(!isChangingAvatar)}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 hover:bg-sky-600 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer shadow-md"
                  title="Upload / Change Student Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Student Information */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">{student.fullName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500 text-white shadow-sm">
                    {student.className} • Sec {student.section}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    Roll #{student.rollNumber}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                  <span>Student ID: <strong className="text-slate-200 font-mono">{student.admissionNumber}</strong></span>
                  {student.admissionDate && (
                    <>
                      <span>•</span>
                      <span>Admitted: <strong className="text-slate-300 font-mono">{student.admissionDate}</strong></span>
                    </>
                  )}
                  <span>•</span>
                  <span>Gender: <strong className="text-slate-300">{student.gender}</strong></span>
                  {student.caste && (
                    <>
                      <span>•</span>
                      <span className="text-purple-300 font-semibold">{student.caste}</span>
                    </>
                  )}
                </div>

                {/* Quick Roll Call Row for Teachers */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400">Today's Attendance:</span>
                  <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => onMarkAttendance(student.id, 'present')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        todayRecord?.status === 'present'
                          ? 'bg-emerald-500 text-white'
                          : 'text-slate-400 hover:text-emerald-400'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => onMarkAttendance(student.id, 'absent')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        todayRecord?.status === 'absent'
                          ? 'bg-rose-500 text-white'
                          : 'text-slate-400 hover:text-rose-400'
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => onMarkAttendance(student.id, 'late')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        todayRecord?.status === 'late'
                          ? 'bg-amber-500 text-white'
                          : 'text-slate-400 hover:text-amber-400'
                      }`}
                    >
                      Late
                    </button>
                    <button
                      type="button"
                      onClick={() => onMarkAttendance(student.id, 'excused')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        todayRecord?.status === 'excused'
                          ? 'bg-blue-500 text-white'
                          : 'text-slate-400 hover:text-blue-400'
                      }`}
                    >
                      Excused
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Photo Upload Popup */}
          {isChangingAvatar && (
            <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <Camera className="w-3.5 h-3.5" />
                  Upload Student Photo / Avatar
                </span>
                <button
                  type="button"
                  onClick={() => setIsChangingAvatar(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2.5">
                <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 rounded-xl text-xs text-sky-400 font-semibold cursor-pointer transition-colors">
                  <UploadCloud className="w-4 h-4" />
                  <span>Choose Image File from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="or paste Image URL..."
                    value={newAvatarUrl}
                    onChange={(e) => setNewAvatarUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newAvatarUrl.trim() && onUpdateStudentAvatar) {
                        onUpdateStudentAvatar(student.id, newAvatarUrl.trim());
                        setIsChangingAvatar(false);
                      }
                    }}
                    className="px-3 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Details & Parents</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Student Portfolio ({portfolioList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Attendance History</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notice')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'notice'
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Parent Notice & WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700">
          
          {/* TAB 1: PROFILE & PARENT DETAILS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Quick Attendance Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Rate</span>
                  <div className="text-lg font-bold text-sky-400 mt-0.5">{rate}%</div>
                </div>
                <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase">Present</span>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">{presentDays}</div>
                </div>
                <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-semibold text-rose-400 uppercase">Absent</span>
                  <div className="text-lg font-bold text-rose-400 mt-0.5">{absentDays}</div>
                </div>
                <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-semibold text-amber-400 uppercase">Late</span>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">{lateDays}</div>
                </div>
                <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-semibold text-blue-400 uppercase">Excused</span>
                  <div className="text-lg font-bold text-blue-400 mt-0.5">{excusedDays}</div>
                </div>
              </div>

              {/* Parents' Details Box */}
              <div className="bg-slate-950/90 border border-indigo-500/30 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-100 text-sm">Parents & Guardian Details</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                    Primary: {student.parents.relationship}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Father's Name</span>
                    <span className="text-slate-100 font-semibold text-sm mt-0.5 block">
                      {student.fatherName || (student.parents.relationship === 'Father' ? student.parents.primaryContactName : 'Not specified')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Mother's Name</span>
                    <span className="text-slate-100 font-semibold text-sm mt-0.5 block">
                      {student.motherName || (student.parents.relationship === 'Mother' ? student.parents.primaryContactName : 'Not specified')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Contact Person</span>
                    <span className="text-slate-200 font-medium mt-0.5 block">{student.parents.primaryContactName} ({student.parents.relationship})</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Parent Mobile / Phone</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a href={`tel:${student.parents.phone || student.phone}`} className="text-emerald-400 font-bold hover:underline font-mono">
                        {student.parents.phone || student.phone}
                      </a>
                      {cleanParentPhone && (
                        <a
                          href={`https://wa.me/${cleanParentPhone}?text=${encodeURIComponent(`Namaste, regarding student ${student.fullName} from school.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[11px] font-semibold border border-emerald-500/30"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>

                  {student.parents.secondaryPhone && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Secondary Phone</span>
                      <a href={`tel:${student.parents.secondaryPhone}`} className="text-slate-200 font-medium hover:underline mt-0.5 block font-mono">
                        {student.parents.secondaryPhone}
                      </a>
                    </div>
                  )}

                  {student.parents.occupation && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Occupation</span>
                      <span className="text-slate-200 font-medium mt-0.5 block">{student.parents.occupation}</span>
                    </div>
                  )}

                  {student.parents.emergencyContactName && (
                    <div className="sm:col-span-2 bg-rose-950/20 border border-rose-500/20 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <div>
                          <span className="text-rose-300 font-semibold block text-xs">Emergency Contact</span>
                          <span className="text-slate-300 text-xs">{student.parents.emergencyContactName}</span>
                        </div>
                      </div>
                      {student.parents.emergencyContactPhone && (
                        <a href={`tel:${student.parents.emergencyContactPhone}`} className="text-rose-400 font-bold hover:underline font-mono">
                          {student.parents.emergencyContactPhone}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Residential Address & Student Contact */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm">Residential Address & Student Contact</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Street Address</span>
                    <span className="text-slate-100 font-medium text-sm mt-0.5 block">
                      {student.address.street}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">City, Municipality & State</span>
                    <span className="text-slate-200 font-medium mt-0.5 block">
                      {student.address.city}{student.address.state ? `, ${student.address.state}` : ''} {student.address.zipCode}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Student Direct Phone</span>
                    <a href={`tel:${student.phone}`} className="text-sky-400 font-semibold hover:underline mt-0.5 block font-mono">
                      {student.phone}
                    </a>
                  </div>

                  {student.dob && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Date of Birth (DOB)</span>
                      <span className="text-slate-200 font-medium mt-0.5 block font-mono">{student.dob}</span>
                    </div>
                  )}

                  {student.bloodGroup && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Blood Group</span>
                      <span className="text-rose-400 font-bold mt-0.5 block">{student.bloodGroup}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Teacher Remarks & Notes */}
              {student.notes && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Teacher General Notes
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    &ldquo;{student.notes}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STUDENT PORTFOLIO & TEACHER UPLOADS */}
          {activeTab === 'portfolio' && (
            <div className="space-y-5">
              
              {/* Portfolio Header & Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-950/30 to-slate-900 p-4 rounded-2xl border border-amber-500/20">
                <div>
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Student Portfolio & Teacher Remarks</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Teachers can upload achievements, artwork/project photos, certificates, behavioral notes, and meeting records.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingPortfolio(!isAddingPortfolio)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{isAddingPortfolio ? 'Cancel Entry' : 'Upload Portfolio Entry'}</span>
                </button>
              </div>

              {/* Add New Portfolio Entry Form */}
              {isAddingPortfolio && (
                <form onSubmit={handleAddPortfolioItem} className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Add Portfolio Item / Teacher Upload
                    </span>
                    <span className="text-[11px] text-slate-400">By: {teacherName}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Title / Award / Event</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Science Fair 1st Prize / Math Project"
                        value={portfolioTitle}
                        onChange={(e) => setPortfolioTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Category</label>
                      <select
                        value={portfolioCategory}
                        onChange={(e) => setPortfolioCategory(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                      >
                        <option value="achievement">Achievement & Award</option>
                        <option value="academic">Academic & Project Work</option>
                        <option value="behavior">Behavioral Praise & Leadership</option>
                        <option value="certificate">Certificate & Document</option>
                        <option value="artwork">Artwork & Creative Work</option>
                        <option value="meeting">Parent-Teacher Meeting Record</option>
                        <option value="general">General Teacher Remark</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Date Recorded</label>
                      <input
                        type="date"
                        value={portfolioDate}
                        onChange={(e) => setPortfolioDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Attach Document / Photo</label>
                      <label className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 rounded-xl text-xs text-sky-400 cursor-pointer">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span className="truncate">{portfolioAttachmentName || 'Choose image/document file...'}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Description & Teacher Remarks</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Write detailed remarks, feedback, or achievement summary..."
                      value={portfolioDescription}
                      onChange={(e) => setPortfolioDescription(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {portfolioImageUrl && (
                    <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <img src={portfolioImageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-slate-700" />
                      <div className="text-xs text-slate-300">
                        <span className="font-semibold block">Attachment ready</span>
                        <span className="text-[11px] text-slate-400">{portfolioAttachmentName || 'Image preview'}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPortfolio(false)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md cursor-pointer"
                    >
                      Save Portfolio Record
                    </button>
                  </div>
                </form>
              )}

              {/* Portfolio Category Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {['ALL', 'achievement', 'academic', 'behavior', 'certificate', 'artwork', 'meeting'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPortfolioFilter(cat)}
                    className={`px-3 py-1 rounded-xl font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                      portfolioFilter === cat
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Items' : cat}
                  </button>
                ))}
              </div>

              {/* Portfolio Items Timeline List */}
              {filteredPortfolio.length === 0 ? (
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-8 text-center">
                  <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">
                    No portfolio entries or teacher notes recorded yet for {student.fullName}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddingPortfolio(true)}
                    className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add First Portfolio Item</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPortfolio.map((item) => {
                    const badge = getCategoryBadge(item.category);
                    const BadgeIcon = badge.icon;

                    return (
                      <div
                        key={item.id}
                        className="bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 mt-0.5 ${badge.bg}`}>
                              <BadgeIcon className="w-4 h-4" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${badge.bg}`}>
                                  {badge.label}
                                </span>
                              </div>

                              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                {item.description}
                              </p>

                              {item.imageUrl && (
                                <div className="mt-2.5">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="max-h-48 rounded-xl object-cover border border-slate-800 shadow-md"
                                  />
                                </div>
                              )}

                              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 flex-wrap">
                                <span className="font-mono">Date: {item.date}</span>
                                <span>•</span>
                                <span>Recorded by: <strong className="text-slate-300">{item.addedBy}</strong></span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeletePortfolioItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ATTENDANCE HISTORY LOG */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>Recorded Attendance Log</span>
                </h3>
                <span className="text-xs text-slate-400">{studentRecords.length} recorded session days</span>
              </div>

              <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
                {studentRecords.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No attendance records found yet.</p>
                ) : (
                  studentRecords.map((rec) => {
                    const nepDate = getNepaliDate(rec.date);
                    return (
                      <div key={rec.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-rose-400 font-bold text-xs">
                              {nepDate.formattedNp}
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              ({nepDate.formattedEn})
                            </span>
                            <span className="text-slate-500 font-mono text-[10px]">
                              [{rec.date} AD]
                            </span>
                          </div>
                          {rec.remark && (
                            <span className="text-amber-300/80 text-[11px] italic mt-0.5">
                              Note: {rec.remark}
                            </span>
                          )}
                        </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          rec.status === 'present'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : rec.status === 'absent'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : rec.status === 'late'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                  );
                })
              )}
              </div>
            </div>
          )}

          {/* TAB 4: PARENT NOTICE & WHATSAPP GENERATOR */}
          {activeTab === 'notice' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-slate-100 text-sm">Compose Notice for {student.parents.primaryContactName}</h3>
                </div>

                {/* Templates */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedNoticeType('absent')}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      selectedNoticeType === 'absent'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Absent Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedNoticeType('late')}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      selectedNoticeType === 'late'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Late Arrival
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedNoticeType('praise')}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      selectedNoticeType === 'praise'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Attendance Praise
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedNoticeType('custom')}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      selectedNoticeType === 'custom'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Custom Message
                  </button>
                </div>

                {selectedNoticeType === 'custom' ? (
                  <textarea
                    value={customNoticeText}
                    onChange={(e) => setCustomNoticeText(e.target.value)}
                    placeholder="Type custom notification to parent here..."
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-emerald-400"
                    rows={4}
                  />
                ) : (
                  <div className="bg-slate-900 border border-slate-800 text-slate-200 text-xs p-3.5 rounded-xl leading-relaxed italic">
                    &ldquo;{getNoticeMessage()}&rdquo;
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">
                    Recipient: <strong className="text-emerald-400 font-mono">{student.parents.phone || student.phone}</strong>
                  </span>
                  <a
                    href={`https://wa.me/${cleanParentPhone}?text=${encodeURIComponent(getNoticeMessage())}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send WhatsApp Notice</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky Footer */}
        <div className="bg-slate-950 p-4 px-6 border-t border-slate-800 flex items-center justify-between flex-shrink-0">
          <div>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => onEdit(student)}
                className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Edit Master Records (Admin)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('portfolio')}
                className="px-3.5 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Upload Student Portfolio</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
