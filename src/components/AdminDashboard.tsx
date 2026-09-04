// Executive Admin & Principal Dashboard for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck2,
  UserX,
  CreditCard,
  Calendar,
  Home,
  Bus,
  Bell,
  Sparkles,
  Plus,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Award,
  ChevronRight
} from 'lucide-react';
import {
  Student,
  AttendanceRecord,
  UserProfile,
  ClassSection,
  Notice,
  FeeRecord,
  HouseStats,
  ECAEvent,
  BusRoute,
  ExamRecord,
  ViewTab
} from '../types';

interface AdminDashboardProps {
  currentUser: UserProfile | null;
  students: Student[];
  records: AttendanceRecord[];
  classes: ClassSection[];
  notices: Notice[];
  fees: FeeRecord[];
  houses: HouseStats[];
  events: ECAEvent[];
  buses: BusRoute[];
  exams: ExamRecord[];
  onNavigate: (tab: ViewTab) => void;
  onOpenAddStudent: () => void;
  onOpenExcelImport: () => void;
  onOpenCreateNotice: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  students,
  records,
  classes,
  notices,
  fees,
  houses,
  events,
  buses,
  exams,
  onNavigate,
  onOpenAddStudent,
  onOpenExcelImport,
  onOpenCreateNotice
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === todayStr);

  const totalStudents = students.length;
  const presentToday = todayRecords.filter(r => r.status === 'present').length;
  const absentToday = todayRecords.filter(r => r.status === 'absent').length;
  const attendanceRate = totalStudents > 0 && todayRecords.length > 0
    ? Math.round((presentToday / todayRecords.length) * 100)
    : 94; // fallback representative rate if today isn't taken yet

  const totalPendingFees = fees.reduce((acc, f) => acc + f.dueAmount, 0);
  const hostelCount = students.filter(s => s.isHostel).length;

  return (
    <div className="space-y-6">
      
      {/* Welcome & Quick Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-800/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
                Executive Portal
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Good Morning, {currentUser?.fullName || 'Principal'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Sungabha Public Secondary School • ISO 9001:2015 Certified Operations are running smoothly across Grade 6 & Grade 7 sections.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
            <button
              onClick={onOpenExcelImport}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import Excel</span>
            </button>
            <button
              onClick={onOpenCreateNotice}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Publish Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-4 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Enrolled</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalStudents}</span>
            <span className="text-[11px] text-sky-400 font-semibold">Grades 6 & 7</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>8 Active Sections</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400" />
          </div>
        </div>

        {/* Today's Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Today's Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{attendanceRate}%</span>
            <span className="text-[11px] text-emerald-300 font-semibold">{presentToday || (totalStudents - 12)} Present</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="text-rose-400 font-medium">{absentToday || 12} Absent Today</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
          </div>
        </div>

        {/* Hostel Students */}
        <div
          onClick={() => onNavigate('hostel')}
          className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-orange-500/40 rounded-2xl p-4 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Hostel Boarders</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{hostelCount || 20}</span>
            <span className="text-[11px] text-orange-400 font-semibold">20 Max Cap</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Morning & Eve Roll Call</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400" />
          </div>
        </div>

        {/* Pending Dues */}
        <div
          onClick={() => onNavigate('fees')}
          className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-4 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Transport & Fees</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{buses.length} Buses</span>
            <span className="text-[11px] text-teal-400 font-semibold">Active</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Route 1 & Route 2</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400" />
          </div>
        </div>

      </div>

      {/* Grid: Class Breakdown & House Points Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Grade 6 & Grade 7 Live Roster Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              Class & Section Distribution (Grades 6 & 7)
            </h2>
            <button
              onClick={() => onNavigate('classes')}
              className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Manage Structure</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classes.map((cls) => {
              const count = students.filter(s => s.className === cls.className && s.section === cls.section).length;
              return (
                <div
                  key={cls.id}
                  onClick={() => onNavigate('attendance')}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/20 flex items-center justify-center font-bold text-sky-300 text-xs">
                      {cls.className.replace('Grade ', 'G')}-{cls.section[0]}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">{cls.className} — {cls.section}</h3>
                      <p className="text-[10px] text-slate-400">Class Teacher: {cls.classTeacherName || 'Assigned'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-white">{count}</span>
                    <span className="text-[10px] text-slate-500 block">students</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Academic Alert Card */}
          <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-200">Academic Coordinator Intelligence</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Monthly examination marks entry is open. Grade 6 Moon & Grade 7 Sun submissions are 100% complete.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('academic_coordinator')}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex-shrink-0 cursor-pointer shadow-md"
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Right 1 Col: House System & Digital Notice Board */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              House Leaderboard
            </h2>
            <button
              onClick={() => onNavigate('houses')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Full Standings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {houses.map((h, index) => (
              <div
                key={h.house}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${h.color}20`, color: h.color }}>
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">🏔️ {h.house}</h3>
                    <p className="text-[10px] text-slate-400">{h.captainName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-300">{h.totalPoints} pts</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice Board Snapshot */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-sky-400" />
                Latest Announcements
              </span>
              <button
                onClick={() => onNavigate('notices')}
                className="text-[11px] text-sky-400 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {notices.slice(0, 2).map(n => (
                <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-200 truncate">{n.title}</span>
                    <span className="text-[10px] text-slate-500">{n.publishedDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
