// Header & Navigation Shell for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React from 'react';
import {
  ShieldCheck,
  Phone,
  Bell,
  Search,
  User,
  Users,
  LogIn,
  LogOut,
  Sparkles,
  Wifi,
  WifiOff,
  Calendar,
  FileSpreadsheet,
  Plus,
  AlertTriangle,
  RotateCcw,
  LayoutDashboard,
  GraduationCap,
  Home,
  BookOpen,
  CalendarClock,
  Award,
  Bus,
  DollarSign,
  HeartHandshake,
  Clock,
  Layers
} from 'lucide-react';
import { UserProfile, SchoolConfig, Notice } from '../types';
import { SCHOOL_INFO } from '../data/initialData';

interface HeaderProps {
  currentUser: UserProfile | null;
  activeTab: string;
  notices: Notice[];
  isOnline: boolean;
  onSelectTab: (tab: string) => void;
  onOpenRoleSwitcher: () => void;
  onOpenAuth: () => void;
  onResetDemo: () => void;
  onOpenAddStudent?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  notices,
  isOnline,
  onSelectTab,
  onOpenRoleSwitcher,
  onOpenAuth,
  onResetDemo,
  onOpenAddStudent
}) => {
  const emergencyNotice = notices.find(n => n.isEmergency);

  // Role display label
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return { label: 'Super Admin', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'PRINCIPAL': return { label: 'Principal', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'VICE_PRINCIPAL': return { label: 'Vice Principal', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
      case 'ACADEMIC_COORDINATOR': return { label: 'Coordinator', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'TEACHER': return { label: 'Teacher', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'PARENT': return { label: 'Parent Portal', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'STUDENT': return { label: 'Student', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'HOSTEL_WARDEN': return { label: 'Hostel Warden', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
      case 'ACCOUNTANT': return { label: 'Accountant', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
      case 'TRANSPORT_STAFF': return { label: 'Transport', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
      case 'ECA_COORDINATOR': return { label: 'ECA Lead', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' };
      default: return { label: 'Guest User', color: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  const navigationTabs = [
    { id: 'dashboard', label: 'Executive Hub', icon: LayoutDashboard, role: 'ALL' },
    { id: 'teacher_hub', label: 'Teacher Hub', icon: BookOpen, role: 'ALL' },
    { id: 'parent_portal', label: 'Parent Portal', icon: HeartHandshake, role: 'ALL' },
    { id: 'student_backpack', label: 'Backpack', icon: GraduationCap, role: 'ALL' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, role: 'ALL' },
    { id: 'students', label: 'Directory', icon: Users, role: 'ALL' },
    { id: 'classes', label: 'Grades & Sections', icon: Layers, role: 'ALL' },
    { id: 'exams', label: 'Exams & Reports', icon: Award, role: 'ALL' },
    { id: 'fees', label: 'Fee Accounts', icon: DollarSign, role: 'ALL' },
    { id: 'transport', label: 'School Bus', icon: Bus, role: 'ALL' },
    { id: 'houses', label: 'House Points', icon: Award, role: 'ALL' },
    { id: 'hostel', label: 'Hostel', icon: Home, role: 'ALL' },
    { id: 'eca', label: 'ECA & Sports', icon: Sparkles, role: 'ALL' },
    { id: 'timetable', label: 'Timetable', icon: Clock, role: 'ALL' },
    { id: 'notices', label: 'Notices', icon: Bell, role: 'ALL' },
    { id: 'ai_assistant', label: 'AI Copilot', icon: Sparkles, role: 'ALL' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Emergency Alert Banner if Active */}
      {emergencyNotice && (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold px-4 py-1.5 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-bounce text-amber-300" />
            <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold">Emergency Alert</span>
            <span className="truncate">{emergencyNotice.title}: {emergencyNotice.content}</span>
          </div>
          <span className="text-[11px] text-red-100 hidden sm:inline ml-2 whitespace-nowrap">Sungabha Alert Broadcast</span>
        </div>
      )}

      {/* Main Topbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo & School Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-sky-600 to-red-600 p-0.5 shadow-lg shadow-blue-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-red-400 text-base sm:text-lg">
                SC
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  SUNGABHA CONNECT
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  ISO 9001:2015
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-sky-400 font-medium hidden sm:inline">{SCHOOL_INFO.nameNp}</span>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="truncate max-w-[180px] sm:max-w-none">{SCHOOL_INFO.location}</span>
              </div>
            </div>
          </div>

          {/* Right Controls: Role Demo Switcher, Sync State & Login */}
          <div className="flex items-center gap-2">
            {/* Sync State */}
            <div
              className={`hidden sm:flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border font-medium ${
                isOnline
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-950/40 text-amber-400 border-amber-500/20'
              }`}
              title={isOnline ? 'Online & Synced with Cloud' : 'Offline mode active - changes saved locally'}
            >
              {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
              <span>{isOnline ? 'Cloud Active' : 'Offline'}</span>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetDemo}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Quick Add Student Button */}
            {onOpenAddStudent && (!currentUser || (currentUser.role !== 'STUDENT' && currentUser.role !== 'PARENT')) && (
              <button
                id="btn-header-add-student"
                type="button"
                onClick={onOpenAddStudent}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Register New Student"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Student</span>
              </button>
            )}

            {/* Role Switcher Pill */}
            <button
              id="btn-open-role-switcher"
              type="button"
              onClick={onOpenRoleSwitcher}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${badge.color}`}
              title="Switch between 10 Demo School Roles"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="max-w-[120px] truncate">{currentUser ? currentUser.fullName.split(' ')[0] : 'Switch Role'}</span>
              <span className="text-[10px] uppercase font-bold opacity-80">({badge.label})</span>
            </button>

            {/* Auth Modal Trigger */}
            <button
              onClick={onOpenAuth}
              className="p-2 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title="Account Settings"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Tabs Ribbon */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-none">
          {navigationTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
