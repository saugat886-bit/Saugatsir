// Academic Coordinator Intelligence & Analytics Dashboard
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  BarChart2,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Student, ExamRecord, ClassSection, UserProfile } from '../types';

interface AcademicCoordinatorDashboardProps {
  currentUser: UserProfile | null;
  students: Student[];
  exams: ExamRecord[];
  classes: ClassSection[];
}

export const AcademicCoordinatorDashboard: React.FC<AcademicCoordinatorDashboardProps> = ({
  currentUser,
  students,
  exams,
  classes
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');

  // Subject statistics calculation
  const subjectAverages = [
    { subject: 'Compulsory Science', avg: 82, passRate: 98, color: '#38bdf8' },
    { subject: 'Mathematics', avg: 76, passRate: 92, color: '#818cf8' },
    { subject: 'English', avg: 85, passRate: 100, color: '#34d399' },
    { subject: 'Nepali', avg: 80, passRate: 96, color: '#fbbf24' },
    { subject: 'Social Studies', avg: 84, passRate: 98, color: '#f87171' },
    { subject: 'Computer Science', avg: 91, passRate: 100, color: '#a78bfa' }
  ];

  // Syllabus progress tracking
  const syllabusProgress = [
    { class: 'Grade 6', subject: 'Compulsory Science', teacher: 'Bikash Thapa', completedChapters: 8, totalChapters: 12, percentage: 67 },
    { class: 'Grade 6', subject: 'Mathematics', teacher: 'Pooja Karki', completedChapters: 7, totalChapters: 10, percentage: 70 },
    { class: 'Grade 7', subject: 'Compulsory Science', teacher: 'Bikash Thapa', completedChapters: 9, totalChapters: 14, percentage: 64 },
    { class: 'Grade 7', subject: 'English', teacher: 'Sarita Sharma', completedChapters: 11, totalChapters: 15, percentage: 73 }
  ];

  // Top performers
  const topStudents = [
    { name: 'Abishek Pandey', class: 'Grade 6 Moon', gpa: 3.80, rank: 1, house: 'Gaurishankar' },
    { name: 'Sneha Gurung', class: 'Grade 6 Moon', gpa: 3.75, rank: 2, house: 'Annapurna' },
    { name: 'Rohan Sharma', class: 'Grade 7 Sun', gpa: 3.85, rank: 1, house: 'Sagarmatha' },
    { name: 'Anjali Thapa', class: 'Grade 7 Sun', gpa: 3.70, rank: 2, house: 'Machhapuchhre' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-bold text-white">Academic Coordination & Curriculum Oversight</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Coordinator: Sarita Sharma (M.Ed. Curriculum) • Continuous Assessment & ISO 9001:2015 Standards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold">
            Term 1 Quality Audit: PASSED 🟢
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="text-xs text-slate-400">School Overall GPA</div>
          <div className="text-2xl font-black text-white">3.42</div>
          <div className="text-[11px] text-emerald-400">+0.18 vs previous term</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="text-xs text-slate-400">Average Pass Rate</div>
          <div className="text-2xl font-black text-emerald-400">97.4%</div>
          <div className="text-[11px] text-slate-400">Grades 6 & 7 combined</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="text-xs text-slate-400">Syllabus Covered</div>
          <div className="text-2xl font-black text-sky-400">68.5%</div>
          <div className="text-[11px] text-sky-300">On Track for Terminal</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="text-xs text-slate-400">Remedial Focus</div>
          <div className="text-2xl font-black text-amber-400">6 Students</div>
          <div className="text-[11px] text-amber-300">Targeted Math clinic</div>
        </div>
      </div>

      {/* Grid: Subject Performance & Syllabus Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Subject Averages */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-sky-400" />
                Subject Average Marks & Pass Percentage
              </h2>
              <span className="text-xs text-slate-400">Term 1 Assessment</span>
            </div>

            <div className="space-y-3">
              {subjectAverages.map(sub => (
                <div key={sub.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{sub.subject}</span>
                    <span className="text-slate-400 font-bold">{sub.avg} / 100 ({sub.passRate}% Pass)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${sub.avg}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus Progress Tracking Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Teacher Syllabus Pace & Progress
            </h3>

            <div className="space-y-3">
              {syllabusProgress.map((sp, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{sp.subject}</span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-purple-950 text-purple-300">
                        {sp.class}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Faculty: {sp.teacher} • {sp.completedChapters} of {sp.totalChapters} Units Completed</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-sky-400">{sp.percentage}%</span>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      On Schedule
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Top Academic Scholars */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Terminal Academic Achievers
          </h2>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3">
            {topStudents.map((ts, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 block">Rank #{ts.rank} Scholar</span>
                  <h4 className="text-xs font-bold text-white">{ts.name}</h4>
                  <p className="text-[10px] text-slate-400">{ts.class} • 🏔️ {ts.house}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-400">GPA {ts.gpa.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500 block">Grade A+</span>
                </div>
              </div>
            ))}
          </div>

          {/* Remedial Intervention Box */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-3xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Remedial Support Plan Active
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              3:30 PM - 4:15 PM Daily Math & English clinic is operating in Room 204 for students scoring below 50% in unit diagnostics.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
