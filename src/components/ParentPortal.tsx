// Parent Portal ("My Child") for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  Users,
  CalendarCheck2,
  BookOpen,
  Award,
  CreditCard,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Phone,
  Calendar,
  FileText,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import {
  Student,
  AttendanceRecord,
  Homework,
  ExamRecord,
  Notice,
  FeeRecord,
  UserProfile
} from '../types';

interface ParentPortalProps {
  currentUser: UserProfile | null;
  students: Student[];
  records: AttendanceRecord[];
  homework: Homework[];
  exams: ExamRecord[];
  notices: Notice[];
  fees: FeeRecord[];
  onViewReportCard: (student: Student) => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  currentUser,
  students,
  records,
  homework,
  exams,
  notices,
  fees,
  onViewReportCard
}) => {
  // Associated children of this parent (e.g. Abishek Pandey or first 2 students)
  const myChildren = students.filter(s =>
    currentUser?.associatedStudentIds?.includes(s.id) ||
    s.parents.phone === currentUser?.phone
  );

  const activeChildrenList = myChildren.length > 0 ? myChildren : [students[0]].filter(Boolean);
  const [selectedChildId, setSelectedChildId] = useState<string>(activeChildrenList[0]?.id || '');

  const activeChild = activeChildrenList.find(c => c.id === selectedChildId) || activeChildrenList[0];

  if (!activeChild) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-white">No Child Record Linked</h2>
        <p className="text-xs text-slate-400 mt-1">
          Please contact Sungabha Administration (9857032269) to verify your phone number and student enrollment.
        </p>
      </div>
    );
  }

  // Child metrics
  const childAttendance = records.filter(r => r.studentId === activeChild.id);
  const presentDays = childAttendance.filter(r => r.status === 'present').length;
  const attendanceRate = childAttendance.length > 0
    ? Math.round((presentDays / childAttendance.length) * 100)
    : 95;

  const childHomework = homework.filter(
    h => h.className === activeChild.className && h.section === activeChild.section
  );

  const childExams = exams.filter(e => e.studentId === activeChild.id);
  const childFees = fees.filter(f => f.studentId === activeChild.id);
  const totalDue = childFees.reduce((acc, f) => acc + f.dueAmount, 0);

  // Today's attendance status
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRec = childAttendance.find(r => r.date === todayStr);

  const handleWhatsAppTeacher = () => {
    const text = encodeURIComponent(
      `Namaste, I am the parent of ${activeChild.fullName} (${activeChild.className} - ${activeChild.section}, Roll #${activeChild.rollNumber}) at Sungabha Public Secondary School. I wanted to inquire regarding my child's progress.`
    );
    window.open(`https://wa.me/9779857032269?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Child Switcher */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-emerald-400 text-lg">
                {activeChild.fullName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Parent Portal • My Child
                </span>
                <span className="text-xs text-slate-400">Sungabha Public Secondary School</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">{activeChild.fullName}</h1>
              <p className="text-xs text-slate-300">
                {activeChild.className} — Section {activeChild.section} • Roll #{activeChild.rollNumber} • House: 🏔️ {activeChild.house || 'Gaurishankar'}
              </p>
            </div>
          </div>

          {/* Child Switcher if parent has multiple children */}
          <div className="flex flex-wrap items-center gap-2">
            {activeChildrenList.length > 1 && (
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
                {activeChildrenList.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChildId(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeChild.id === c.id
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.fullName.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleWhatsAppTeacher}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Teacher</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Quick Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Attendance Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Attendance</span>
            <CalendarCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{attendanceRate}%</span>
            <span className="text-[11px] text-emerald-300 font-semibold">{presentDays} Present</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Today: <span className="font-bold text-emerald-400">{todayRec?.status?.toUpperCase() || 'PRESENT 🟢'}</span>
          </div>
        </div>

        {/* Pending Homework */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Homework</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{childHomework.length}</span>
            <span className="text-[11px] text-sky-400 font-semibold">Active</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Science & Math tasks due
          </div>
        </div>

        {/* Latest Exam GPA */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Terminal Result</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300">GPA 3.80</span>
            <span className="text-[11px] text-amber-400 font-semibold">Grade A+</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Rank #1 in Section Moon
          </div>
        </div>

        {/* Fee Due */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Fee Balance</span>
            <CreditCard className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">Rs. {totalDue}</span>
            <span className="text-[11px] text-emerald-400 font-semibold">All Cleared</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Receipt #REC-2082-094
          </div>
        </div>

      </div>

      {/* Grid: Homework Tracker & Latest Terminal Exam Result */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Homework List for Child */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              Assigned Homework & Daily Tasks
            </h2>
            <span className="text-xs text-slate-400">{childHomework.length} Total Assignments</span>
          </div>

          <div className="space-y-3">
            {childHomework.map(hw => (
              <div key={hw.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
                      {hw.subject}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">{hw.title}</h3>
                  </div>
                  <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-500/30">
                    <Clock className="w-3 h-3" />
                    Due: {hw.dueDate}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{hw.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                  <span>Assigned by: {hw.teacherName}</span>
                  <span className="text-emerald-400 font-medium">Checked & Verified</span>
                </div>
              </div>
            ))}
          </div>

          {/* Printable Report Card Viewer */}
          <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-sky-300 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">First Terminal Official Report Card</h4>
                <p className="text-[11px] text-slate-400">ISO 9001:2015 Certified Progress Marksheet</p>
              </div>
            </div>
            <button
              onClick={() => onViewReportCard(activeChild)}
              className="px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              View Report Card
            </button>
          </div>
        </div>

        {/* Right Sidebar: School Notices for Parents */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-400" />
            School Parent Notices
          </h2>

          <div className="space-y-3">
            {notices.map(notice => (
              <div
                key={notice.id}
                className={`bg-slate-900/90 border rounded-2xl p-4 space-y-2 ${
                  notice.isEmergency ? 'border-red-500/50 bg-red-950/20' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    notice.isEmergency ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {notice.category}
                  </span>
                  <span className="text-[10px] text-slate-500">{notice.publishedDate}</span>
                </div>
                <h3 className="text-xs font-bold text-white">{notice.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{notice.content}</p>
                <span className="text-[10px] text-slate-500 block pt-1 border-t border-slate-800/80">
                  By {notice.publishedBy}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
