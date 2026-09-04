import React, { useMemo, useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Phone, 
  MessageSquare, 
  FileSpreadsheet, 
  Plus, 
  Table, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  GraduationCap, 
  PieChart as PieIcon, 
  Search, 
  ExternalLink,
  ChevronRight,
  Send,
  Copy,
  Check,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Student, AttendanceRecord, AttendanceStatus, ViewTab, UserProfile } from '../types';
import { getNepaliDate } from '../utils/nepaliDate';

interface HomePageProps {
  students: Student[];
  records: AttendanceRecord[];
  currentDate: string;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onDateChange: (newDate: string) => void;
  onNavigateTab: (tab: ViewTab) => void;
  onSelectClassAndSection: (className: string, section: string) => void;
  onOpenAddStudent: () => void;
  onOpenExcelImport: () => void;
  onViewStudentDetail: (student: Student) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  students,
  records,
  currentDate,
  currentUser,
  onOpenAuthModal,
  onSignOut,
  onDateChange,
  onNavigateTab,
  onSelectClassAndSection,
  onOpenAddStudent,
  onOpenExcelImport,
  onViewStudentDetail,
}) => {
  const [copiedPhones, setCopiedPhones] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trendDays, setTrendDays] = useState<7 | 14 | 30>(14);

  // Current Date Nepali B.S. representation
  const nepaliDate = useMemo(() => getNepaliDate(currentDate), [currentDate]);

  // 1. Current Date Attendance Status calculation
  const todayRecordMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    records.forEach(r => {
      if (r.date === currentDate) {
        map.set(r.studentId, r);
      }
    });
    return map;
  }, [records, currentDate]);

  // Overall counts for currentDate
  const todayStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let unmarked = 0;

    students.forEach(s => {
      const rec = todayRecordMap.get(s.id);
      if (!rec) {
        unmarked++;
      } else if (rec.status === 'present') {
        present++;
      } else if (rec.status === 'absent') {
        absent++;
      } else if (rec.status === 'late') {
        late++;
      } else if (rec.status === 'excused') {
        excused++;
      }
    });

    const markedTotal = present + absent + late + excused;
    const attendancePercentage = markedTotal > 0 ? Math.round(((present + late) / markedTotal) * 100) : 0;
    const totalPercentage = students.length > 0 ? Math.round(((present + late) / students.length) * 100) : 0;

    return {
      total: students.length,
      present,
      absent,
      late,
      excused,
      unmarked,
      markedTotal,
      attendancePercentage,
      totalPercentage
    };
  }, [students, todayRecordMap]);

  // Phone number completeness
  const phoneStats = useMemo(() => {
    let withPhone = 0;
    students.forEach(s => {
      if (s.phone && s.phone !== '9800000000' && s.phone.trim().length >= 7) {
        withPhone++;
      }
    });
    const percentage = students.length > 0 ? Math.round((withPhone / students.length) * 100) : 0;
    return { withPhone, percentage };
  }, [students]);

  // Gender counts
  const genderStats = useMemo(() => {
    let male = 0;
    let female = 0;
    let other = 0;
    students.forEach(s => {
      if (s.gender === 'Male') male++;
      else if (s.gender === 'Female') female++;
      else other++;
    });
    return { male, female, other };
  }, [students]);

  // Caste / Category distribution
  const casteStats = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach(s => {
      const c = s.caste || 'Other';
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [students]);

  // Class & Section Breakdown
  const classBreakdown = useMemo(() => {
    const map = new Map<string, {
      className: string;
      section: string;
      total: number;
      present: number;
      absent: number;
      late: number;
      excused: number;
      unmarked: number;
      students: Student[];
    }>();

    students.forEach(s => {
      const key = `${s.className}::${s.section}`;
      if (!map.has(key)) {
        map.set(key, {
          className: s.className,
          section: s.section,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          unmarked: 0,
          students: []
        });
      }
      const item = map.get(key)!;
      item.total++;
      item.students.push(s);

      const rec = todayRecordMap.get(s.id);
      if (!rec) {
        item.unmarked++;
      } else if (rec.status === 'present') {
        item.present++;
      } else if (rec.status === 'absent') {
        item.absent++;
      } else if (rec.status === 'late') {
        item.late++;
      } else if (rec.status === 'excused') {
        item.excused++;
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.className === b.className) return a.section.localeCompare(b.section);
      return a.className.localeCompare(b.className);
    });
  }, [students, todayRecordMap]);

  // Absent students list for today
  const absentStudents = useMemo(() => {
    return students
      .filter(s => {
        const rec = todayRecordMap.get(s.id);
        return rec && rec.status === 'absent';
      })
      .map(s => {
        const rec = todayRecordMap.get(s.id);
        return {
          student: s,
          remark: rec?.remark
        };
      });
  }, [students, todayRecordMap]);

  // 14/30 day trend data
  const trendData = useMemo(() => {
    const result = [];
    const today = new Date(currentDate);

    for (let i = trendDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const displayLabel = `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`;

      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;
      let excusedCount = 0;

      records.forEach(r => {
        if (r.date === dStr) {
          if (r.status === 'present') presentCount++;
          else if (r.status === 'absent') absentCount++;
          else if (r.status === 'late') lateCount++;
          else if (r.status === 'excused') excusedCount++;
        }
      });

      const totalMarked = presentCount + absentCount + lateCount + excusedCount;
      const rate = totalMarked > 0 ? Math.round(((presentCount + lateCount) / totalMarked) * 100) : 0;

      result.push({
        date: dStr,
        displayLabel,
        dayName,
        rate,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        total: totalMarked
      });
    }

    return result;
  }, [records, currentDate, trendDays]);

  // Search filtered students for quick profile lookups
  const quickSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return students.filter(s => 
      s.fullName.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.admissionNumber.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      (s.fatherName && s.fatherName.toLowerCase().includes(q)) ||
      (s.motherName && s.motherName.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [students, searchQuery]);

  // Copy all absentee phone numbers
  const handleCopyAbsenteePhones = () => {
    const phones = absentStudents
      .map(item => item.student.phone)
      .filter(p => p && p !== '9800000000');
    
    if (phones.length > 0) {
      navigator.clipboard.writeText(phones.join(', '));
      setCopiedPhones(true);
      setTimeout(() => setCopiedPhones(false), 2500);
    }
  };

  // Build WhatsApp Alert URL
  const getWhatsAppAbsenteeUrl = (student: Student) => {
    const rawPhone = student.phone.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('977') ? rawPhone : `977${rawPhone}`;
    const text = encodeURIComponent(
      `Namaste, this is an official attendance notice from School. ` +
      `Your child ${student.fullName} (Roll No: ${student.rollNumber}, Class: ${student.className} - ${student.section}) ` +
      `was marked ABSENT today on date ${currentDate}. Please contact school administration if you need to report sick leave or have any queries.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  // Jump to mark attendance for a class
  const handleOpenClassAttendance = (cls: string, sec: string) => {
    onSelectClassAndSection(cls, sec);
    onNavigateTab('attendance');
  };

  // Jump to student directory for a class
  const handleOpenClassDirectory = (cls: string, sec: string) => {
    onSelectClassAndSection(cls, sec);
    onNavigateTab('students');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Top Welcome Banner & Date Bar */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-sky-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Academic Session 2082 / 2026
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Attendance System
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              School Attendance & Student Hub
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track real-time class attendance, view parent contact records, manage phone notifications, and export monthly school registers seamlessly.
            </p>
          </div>

          {/* Date Selector & Fast Actions & Account */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl">
            
            {/* User Profile / Login Pill */}
            {currentUser ? (
              <div className="flex items-center justify-between sm:justify-start gap-2.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-white truncate max-w-[120px]">
                    {currentUser.displayName}
                  </span>
                  <span className="block text-[10px] text-sky-400 capitalize font-medium">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="ml-1 px-2 py-1 text-[10px] font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Sign out of account"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="flex items-center justify-center gap-2 px-3.5 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Teacher / Admin Login</span>
              </button>
            )}

            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-700/60 shadow-inner">
              <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[8px] font-black uppercase leading-none">वि.सं.</span>
                <span className="text-xs font-black leading-tight">{nepaliDate.day}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-rose-300">
                    {nepaliDate.formattedBadge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    ({nepaliDate.dayNameNp})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-sky-400 flex-shrink-0" />
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
                    title="Change Attendance Date (AD)"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDateChange(new Date().toISOString().split('T')[0])}
              className="px-3 py-2 text-xs font-bold text-sky-300 hover:text-white bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded-xl transition-all active:scale-95 cursor-pointer whitespace-nowrap text-center"
            >
              आज (Today)
            </button>
          </div>
        </div>

        {/* Quick-Launch Action Buttons Bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => {
              onSelectClassAndSection('ALL', 'ALL');
              onNavigateTab('attendance');
            }}
            className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-sky-950/40 border border-slate-800 hover:border-sky-500/40 rounded-2xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white group-hover:text-sky-300">Mark Attendance</span>
                <span className="block text-[10px] text-slate-400">Class-wise roll call</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => {
              const roleUpper = currentUser?.role?.toUpperCase() || '';
              const isAdmin = !currentUser || 
                roleUpper === 'SUPER_ADMIN' || 
                roleUpper === 'PRINCIPAL' || 
                roleUpper === 'VICE_PRINCIPAL' || 
                roleUpper === 'ACADEMIC_COORDINATOR' || 
                roleUpper === 'ADMIN';

              if (isAdmin) {
                onOpenExcelImport();
              } else {
                onOpenAuthModal();
              }
            }}
            className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 rounded-2xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white group-hover:text-emerald-300">
                  Import Excel Students
                </span>
                <span className="block text-[10px] text-slate-400">
                  Auto phone & student upgrade
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectClassAndSection('ALL', 'ALL');
              onNavigateTab('students');
            }}
            className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 rounded-2xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white group-hover:text-indigo-300">Directory & Parents</span>
                <span className="block text-[10px] text-slate-400">Addresses & contact</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectClassAndSection('ALL', 'ALL');
              onNavigateTab('register');
            }}
            className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 rounded-2xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Table className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white group-hover:text-amber-300">Monthly Register</span>
                <span className="block text-[10px] text-slate-400">Official sheet & export</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* 2. Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Students */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Enrolled</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{todayStats.total}</span>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span className="text-sky-300 font-medium">👦 {genderStats.male} Boys</span>
              <span>•</span>
              <span className="text-pink-300 font-medium">👧 {genderStats.female} Girls</span>
            </div>
          </div>
        </div>

        {/* Today's Attendance Rate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Attendance Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{todayStats.attendancePercentage}%</span>
              <span className="text-xs text-slate-400">of marked</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${todayStats.attendancePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Present Today */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Present Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-300">{todayStats.present}</span>
              {todayStats.late > 0 && (
                <span className="text-xs text-amber-300 font-semibold">(+{todayStats.late} Late)</span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              In active attendance
            </span>
          </div>
        </div>

        {/* Absent Today */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-rose-900/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Absent Today</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-2xl font-black ${todayStats.absent > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {todayStats.absent}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              {todayStats.absent > 0 ? (
                <span className="text-rose-300 font-medium flex items-center gap-1">
                  <Phone className="w-3 h-3 text-rose-400" />
                  Calls / WhatsApp ready
                </span>
              ) : (
                <span className="text-slate-400">No absentees reported</span>
              )}
            </div>
          </div>
        </div>

        {/* Phone Contact Reachability */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Phone Coverage</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-purple-300">{phoneStats.withPhone}</span>
            <span className="text-xs text-slate-400 ml-1.5 font-mono">({phoneStats.percentage}%)</span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Verified parent mobile numbers
            </span>
          </div>
        </div>

      </div>

      {/* 3. Main Split Grid: Class-Wise Status & Absentee Communication Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Class-Wise Attendance Status & Direct Links */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-md">
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <span>Class & Section Live Attendance</span>
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                  <span>Current attendance progress for date:</span>
                  <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {nepaliDate.formattedNp} ({nepaliDate.formattedEn})
                  </span>
                  <span className="text-slate-500 font-mono">[{currentDate} AD]</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectClassAndSection('ALL', 'ALL');
                  onNavigateTab('attendance');
                }}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Full Sheet</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {classBreakdown.map((item, idx) => {
                const marked = item.present + item.absent + item.late + item.excused;
                const rate = marked > 0 ? Math.round(((item.present + item.late) / marked) * 100) : 0;
                const isFullyMarked = marked === item.total && item.total > 0;

                return (
                  <div 
                    key={idx}
                    className="bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 transition-all hover:bg-slate-950/80 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white group-hover:text-sky-300 transition-colors">
                            {item.className}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-mono font-bold">
                            Sec {item.section}
                          </span>
                        </div>

                        <span className="text-xs font-mono text-slate-400 font-semibold">
                          {item.total} Students
                        </span>
                      </div>

                      {/* Attendance breakdown pills */}
                      <div className="grid grid-cols-3 gap-2 my-3 text-center">
                        <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl py-1 px-1.5">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase block">Present</span>
                          <span className="text-xs font-extrabold text-emerald-300 font-mono">{item.present}</span>
                        </div>
                        <div className="bg-rose-950/40 border border-rose-800/40 rounded-xl py-1 px-1.5">
                          <span className="text-[10px] text-rose-400 font-bold uppercase block">Absent</span>
                          <span className="text-xs font-extrabold text-rose-300 font-mono">{item.absent}</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl py-1 px-1.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Unmarked</span>
                          <span className="text-xs font-extrabold text-slate-300 font-mono">{item.unmarked}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Attendance Rate</span>
                          <span className={`font-mono font-bold ${
                            rate >= 90 ? 'text-emerald-400' : rate >= 75 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {rate}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              rate >= 90 ? 'bg-emerald-500' : rate >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Direct action buttons */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => handleOpenClassAttendance(item.className, item.section)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 hover:text-white border border-sky-500/30 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Mark Roll</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenClassDirectory(item.className, item.section)}
                        className="flex items-center justify-center p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl text-xs transition-all cursor-pointer"
                        title="View Class Directory & Phone Numbers"
                      >
                        <Users className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attendance Trend Chart Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Attendance History Trend</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Daily presence rate over time
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['7', '14', '30'] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setTrendDays(Number(days) as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      trendDays === Number(days)
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="displayLabel" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    domain={[0, 100]} 
                    tickFormatter={(v) => `${v}%`} 
                    tickLine={false} 
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px' 
                    }}
                    formatter={(value: any) => [`${value}%`, 'Attendance Rate']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#38bdf8" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#rateGradient)" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Absentee Notification Command Center & Demographics */}
        <div className="space-y-6">
          
          {/* Today's Absentees & Quick Contact */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-md">
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Today's Absentees</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold">
                      {absentStudents.length}
                    </span>
                  </h3>
                  <span className="text-[11px] text-slate-400">1-click WhatsApp & Phone alerts</span>
                </div>
              </div>

              {absentStudents.length > 0 && (
                <button
                  type="button"
                  onClick={handleCopyAbsenteePhones}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Copy all absentee phone numbers"
                >
                  {copiedPhones ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Numbers</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Absentees List */}
            {absentStudents.length === 0 ? (
              <div className="py-8 px-4 text-center bg-slate-950/40 rounded-2xl border border-slate-800/60">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 block">All Students Present / Accounted</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">No unexcused absences recorded for today.</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {absentStudents.map(({ student, remark }, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate cursor-pointer hover:text-sky-300" onClick={() => onViewStudentDetail(student)}>
                          {student.fullName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          R: {student.rollNumber}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        <span>{student.className} • {student.section}</span>
                        {student.fatherName && <span className="ml-1.5 text-slate-300">({student.fatherName})</span>}
                      </div>

                      {remark && (
                        <div className="text-[10px] text-amber-400/90 font-medium italic mt-0.5">
                          "{remark}"
                        </div>
                      )}
                    </div>

                    {/* Instant Call & WhatsApp Buttons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {student.phone && student.phone !== '9800000000' && (
                        <>
                          <a
                            href={`tel:${student.phone}`}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-slate-800 hover:border-sky-500/40 transition-colors"
                            title={`Call parent: ${student.phone}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={getWhatsAppAbsenteeUrl(student)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 transition-colors"
                            title="Send WhatsApp Absent Notice"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search Student Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span>Quick Student & Parent Search</span>
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, roll no, father name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {quickSearchResults.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {quickSearchResults.map(st => (
                  <div
                    key={st.id}
                    onClick={() => onViewStudentDetail(st)}
                    className="p-2 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-sky-500/40 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all"
                  >
                    <div className="truncate">
                      <span className="font-bold text-white block">{st.fullName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {st.className} {st.section} • Roll #{st.rollNumber} • 📞 {st.phone}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Caste & Demographics Summary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Category / Caste Distribution</span>
            </h3>

            <div className="space-y-2">
              {casteStats.map((item, idx) => {
                const percentage = students.length > 0 ? Math.round((item.count / students.length) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{item.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
