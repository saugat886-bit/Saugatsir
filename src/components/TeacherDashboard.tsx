// Teacher Operations Hub for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  CalendarCheck2,
  BookOpen,
  Award,
  Sparkles,
  Users,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  Send,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import {
  UserProfile,
  ClassSection,
  Student,
  AttendanceRecord,
  Homework,
  ExamRecord,
  TimetablePeriod,
  ViewTab
} from '../types';

interface TeacherDashboardProps {
  currentUser: UserProfile | null;
  classes: ClassSection[];
  students: Student[];
  records: AttendanceRecord[];
  homework: Homework[];
  timetable: TimetablePeriod[];
  onNavigate: (tab: ViewTab) => void;
  onOpenCreateHomework: () => void;
  onOpenMarksEntry: () => void;
  onOpenAddStudent?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  classes,
  students,
  records,
  homework,
  timetable,
  onNavigate,
  onOpenCreateHomework,
  onOpenMarksEntry,
  onOpenAddStudent
}) => {
  const teacherClasses = classes.filter(c =>
    currentUser?.assignedClasses?.includes(`${c.className}-${c.section}`) ||
    c.classTeacherName?.includes(currentUser?.fullName?.split(' ')[0] || 'Bikash')
  );

  const activeClassList = teacherClasses.length > 0 ? teacherClasses : classes.slice(0, 2);

  // My Timetable periods for today
  const myTimetable = timetable.filter(
    t => t.teacherName.includes(currentUser?.fullName?.split(' ')[0] || 'Bikash')
  );

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-blue-900 to-slate-900 border border-sky-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Teacher Command Center
              </span>
              <span className="text-xs text-slate-400">
                {currentUser?.qualification || 'B.Sc. CSIT, B.Ed.'} • Emp ID: {currentUser?.employeeId || 'EMP-0104'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Namaste, {currentUser?.fullName || 'Teacher'} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Assigned Subjects: <span className="text-sky-300 font-semibold">{currentUser?.assignedSubjects?.join(', ') || 'Compulsory Science, Computer Lab'}</span>
            </p>
          </div>

          {/* Teacher Fast Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Take Today's Attendance</span>
            </button>
            <button
              onClick={onOpenCreateHomework}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Homework</span>
            </button>
            {onOpenAddStudent && (
              <button
                id="btn-teacher-add-student"
                onClick={onOpenAddStudent}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('ai_assistant')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-purple-600/30 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Lesson Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Teaching Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: My Classes & 1-Tap Attendance Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              My Assigned Sections (Fast Attendance)
            </h2>
            <span className="text-xs text-slate-400">Click to start roll call</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activeClassList.map(cls => {
              const count = students.filter(s => s.className === cls.className && s.section === cls.section).length;
              return (
                <div
                  key={cls.id}
                  onClick={() => onNavigate('attendance')}
                  className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition-all cursor-pointer group space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-950 text-sky-300 border border-blue-500/30">
                      {cls.className} — {cls.section}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {count} Students
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <p className="font-semibold text-white">Class Teacher Assigned</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{cls.roomNumber || 'Room 201'} • Projector Smart Class</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-sky-400 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Open Attendance Sheet</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Homework Assignments review */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                Active Homework & Student Submissions
              </h3>
              <button
                onClick={onOpenCreateHomework}
                className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Task</span>
              </button>
            </div>

            <div className="space-y-3">
              {homework.map(hw => (
                <div key={hw.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
                        {hw.className} {hw.section} • {hw.subject}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1">{hw.title}</h4>
                    </div>
                    <span className="text-[10px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 font-semibold">
                      Due: {hw.dueDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{hw.description}</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                    <span>{hw.submissions.length} Students Submitted</span>
                    <span className="text-sky-400 hover:underline cursor-pointer">Review & Grade</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Today's Teaching Periods Timetable */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Today's Class Schedule
            </h2>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs text-sky-400 hover:underline cursor-pointer"
            >
              Full Routine
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3">
            {myTimetable.map((period, idx) => (
              <div
                key={period.id}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-sky-400 block">
                    Period {period.periodNumber} • {period.timeSlot}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{period.subject}</h4>
                  <p className="text-[10px] text-slate-400">{period.className} — {period.section} ({period.room})</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-sky-950/80 border border-sky-500/30 flex items-center justify-center font-black text-sky-300 text-xs">
                  P{period.periodNumber}
                </div>
              </div>
            ))}
          </div>

          {/* AI Helper Banner */}
          <div className="bg-gradient-to-br from-purple-950/60 to-indigo-950/60 border border-purple-500/30 rounded-3xl p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white">AI Teaching Assistant</h3>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Generate 15 science MCQs, create customized lesson plans for Grade 6 & 7, or analyze class marks.
            </p>
            <button
              onClick={() => onNavigate('ai_assistant')}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              Launch AI Assistant
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
