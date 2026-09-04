// Student Digital Backpack & Portal for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CalendarCheck2,
  Award,
  Clock,
  CheckCircle2,
  FileText,
  Upload,
  Sparkles,
  Bell,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import {
  Student,
  AttendanceRecord,
  Homework,
  ExamRecord,
  Notice,
  HouseStats,
  TimetablePeriod
} from '../types';

interface StudentBackpackProps {
  student: Student;
  records: AttendanceRecord[];
  homework: Homework[];
  exams: ExamRecord[];
  notices: Notice[];
  houses: HouseStats[];
  timetable: TimetablePeriod[];
  onSubmitHomework: (homeworkId: string, text: string) => void;
  onViewReportCard: (student: Student) => void;
}

export const StudentBackpack: React.FC<StudentBackpackProps> = ({
  student,
  records,
  homework,
  exams,
  notices,
  houses,
  timetable,
  onSubmitHomework,
  onViewReportCard
}) => {
  const [submissionModalHw, setSubmissionModalHw] = useState<Homework | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  const myAttendance = records.filter(r => r.studentId === student.id);
  const presentDays = myAttendance.filter(r => r.status === 'present').length;
  const attendanceRate = myAttendance.length > 0
    ? Math.round((presentDays / myAttendance.length) * 100)
    : 96;

  const myClassHomework = homework.filter(
    h => h.className === student.className && h.section === student.section
  );

  const mySchedule = timetable.filter(
    t => t.className === student.className && t.section === student.section
  );

  const myHouse = houses.find(h => h.house === student.house) || houses[0];

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalHw || !submissionText) return;
    onSubmitHomework(submissionModalHw.id, submissionText);
    setSubmissionModalHw(null);
    setSubmissionText('');
    alert('Homework submitted successfully to your teacher!');
  };

  return (
    <div className="space-y-6">
      
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-blue-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-indigo-400 text-lg">
                {student.fullName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Student Digital Backpack
                </span>
                <span className="text-xs text-slate-400">Roll #{student.rollNumber}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">{student.fullName}</h1>
              <p className="text-xs text-slate-300">
                {student.className} — {student.section} • House: 🏔️ <span className="font-bold text-amber-400">{student.house || 'Gaurishankar'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewReportCard(student)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-600/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>My Report Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Attendance Rate</span>
            <CalendarCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{attendanceRate}%</div>
          <div className="text-[11px] text-slate-400">{presentDays} / {myAttendance.length || 10} Days Present</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Assignments</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{myClassHomework.length}</div>
          <div className="text-[11px] text-sky-300">Tasks Due This Week</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>House Rank</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">#{myHouse.rank}</div>
          <div className="text-[11px] text-amber-300">{myHouse.totalPoints} Total House Points</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Academic Standing</span>
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">GPA 3.80</div>
          <div className="text-[11px] text-purple-300">Grade A+ (Distinction)</div>
        </div>
      </div>

      {/* Grid: My Homework & Today's Periods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Homework Hub */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              My Homework & Assignment Submissions
            </h2>
            <span className="text-xs text-slate-400">{myClassHomework.length} Active Tasks</span>
          </div>

          <div className="space-y-3">
            {myClassHomework.map(hw => {
              const mySubmission = hw.submissions.find(s => s.studentId === student.id);

              return (
                <div key={hw.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
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

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Teacher: {hw.teacherName}</span>

                    {mySubmission ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Submitted ({mySubmission.status})
                      </span>
                    ) : (
                      <button
                        onClick={() => setSubmissionModalHw(hw)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Submit Work</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Today's Routine & House Points */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            My Class Timetable
          </h2>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-2.5">
            {mySchedule.map(period => (
              <div
                key={period.id}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="text-[10px] text-sky-400 font-bold block">{period.timeSlot}</span>
                  <span className="font-bold text-white">{period.subject}</span>
                  <span className="text-[10px] text-slate-400 block">{period.teacherName}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">P{period.periodNumber}</span>
              </div>
            ))}
          </div>

          {/* House Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">🏔️ {student.house || 'Gaurishankar House'}</span>
              <span className="text-xs font-black text-amber-400">{myHouse.totalPoints} pts</span>
            </div>
            <p className="text-xs text-slate-400 italic">"{myHouse.motto}"</p>
          </div>
        </div>

      </div>

      {/* Homework Submission Modal */}
      {submissionModalHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div>
              <span className="text-[10px] font-bold text-sky-400">{submissionModalHw.subject}</span>
              <h2 className="text-base font-bold text-white mt-0.5">{submissionModalHw.title}</h2>
              <p className="text-xs text-slate-400 mt-1">Submit your completed assignment text or notes to {submissionModalHw.teacherName}.</p>
            </div>

            <form onSubmit={handleHomeworkSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Answer / Submission Notes
                </label>
                <textarea
                  rows={4}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Type your answers, exercise solution notes, or summary here..."
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl p-3 outline-none focus:border-sky-500 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmissionModalHw(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white rounded-xl shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
