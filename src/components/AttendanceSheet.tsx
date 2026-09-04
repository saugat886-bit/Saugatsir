import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCheck, 
  RotateCcw, 
  Phone, 
  MessageSquare,
  Eye,
  Info,
  Plus,
  Filter,
  ArrowUpDown,
  Search,
  X
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus, AttendanceSummary } from '../types';
import { NepaliDateSelector } from './NepaliDateSelector';
import { getNepaliDate } from '../utils/nepaliDate';
import { sortStudents, StudentSortMode } from '../utils/studentSort';

interface AttendanceSheetProps {
  students: Student[];
  records: AttendanceRecord[];
  currentDate: string;
  onDateChange: (newDate: string) => void;
  onMarkAttendance: (studentId: string, status: AttendanceStatus, remark?: string) => void;
  onBatchMarkAll: (status: AttendanceStatus) => void;
  onClearDate: () => void;
  onViewStudent: (student: Student) => void;
  onOpenAddStudent?: () => void;
}

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  students,
  records,
  currentDate,
  onDateChange,
  onMarkAttendance,
  onBatchMarkAll,
  onClearDate,
  onViewStudent,
  onOpenAddStudent
}) => {
  const [remarkInputStudentId, setRemarkInputStudentId] = useState<string | null>(null);
  const [tempRemark, setTempRemark] = useState<string>('');

  // Class, Section, Search & Sort Filters
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortMode, setSortMode] = useState<StudentSortMode>('roll-asc');

  // Available classes and sections
  const uniqueClasses = useMemo(() => {
    const set = new Set<string>();
    students.forEach(s => s.className && set.add(s.className));
    return Array.from(set).sort();
  }, [students]);

  const uniqueSections = useMemo(() => {
    const set = new Set<string>();
    students.forEach(s => {
      if (selectedClass === 'ALL' || s.className === selectedClass) {
        if (s.section) set.add(s.section);
      }
    });
    return Array.from(set).sort();
  }, [students, selectedClass]);

  // Filter and sort students roll number wise in alphabetical order
  const displayStudents = useMemo(() => {
    const filtered = students.filter(student => {
      if (selectedClass !== 'ALL' && student.className !== selectedClass) return false;
      if (selectedSection !== 'ALL' && student.section !== selectedSection) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameMatch = student.fullName.toLowerCase().includes(q);
      const rollMatch = student.rollNumber?.toLowerCase().includes(q);
      const admMatch = student.admissionNumber?.toLowerCase().includes(q);
      return nameMatch || rollMatch || admMatch;
    });

    return sortStudents(filtered, sortMode, selectedClass === 'ALL');
  }, [students, selectedClass, selectedSection, searchQuery, sortMode]);

  // Map of studentId -> AttendanceRecord for currentDate
  const todayRecordMap = new Map<string, AttendanceRecord>();
  records
    .filter(r => r.date === currentDate)
    .forEach(r => todayRecordMap.set(r.studentId, r));

  // Compute summary for current date & displayed students
  const studentIds = new Set(displayStudents.map(s => s.id));
  const dateRecords = records.filter(r => r.date === currentDate && studentIds.has(r.studentId));
  
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;

  dateRecords.forEach(r => {
    if (r.status === 'present') presentCount++;
    else if (r.status === 'absent') absentCount++;
    else if (r.status === 'late') lateCount++;
    else if (r.status === 'excused') excusedCount++;
  });

  const totalStudents = displayStudents.length;
  const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const nepaliDate = getNepaliDate(currentDate);

  const handleSaveRemark = (studentId: string, currentStatus: AttendanceStatus) => {
    onMarkAttendance(studentId, currentStatus, tempRemark.trim() || undefined);
    setRemarkInputStudentId(null);
    setTempRemark('');
  };

  const handleBatchMarkDisplayed = (status: AttendanceStatus) => {
    displayStudents.forEach(s => {
      onMarkAttendance(s.id, status);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Nepali Date Bar & Quick Batch Controls */}
      <div className="space-y-4">
        {/* Nepali Date Selector Card */}
        <NepaliDateSelector 
          currentDate={currentDate} 
          onDateChange={onDateChange} 
        />

        {/* Quick Batch Actions Toolbar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              हाजिरी मिति (Attendance Date):
            </span>
            <span className="px-2.5 py-1 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold">
              {nepaliDate.formattedBadge}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden md:inline">
              ({currentDate})
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenAddStudent && (
              <button
                id="btn-attendance-add-student"
                type="button"
                onClick={onOpenAddStudent}
                className="flex items-center gap-1.5 px-3 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Enroll new student into this class"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student</span>
              </button>
            )}

            <button
              id="btn-mark-all-present"
              type="button"
              onClick={() => handleBatchMarkDisplayed('present')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title={selectedClass !== 'ALL' ? `Mark all ${displayStudents.length} students in ${selectedClass} present` : 'Mark all filtered students present'}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Filtered Present ({displayStudents.length})</span>
            </button>

            <button
              id="btn-clear-attendance"
              type="button"
              onClick={onClearDate}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 rounded-xl text-xs font-medium transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Date</span>
            </button>
          </div>
        </div>

        {/* Attendance Summary Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Filtered List</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-slate-100">{totalStudents}</span>
              <span className="text-xs text-slate-500">students</span>
            </div>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3">
            <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider block">Present</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-emerald-400">{presentCount}</span>
              <span className="text-xs text-emerald-500/80">({totalStudents > 0 ? Math.round((presentCount/totalStudents)*100) : 0}%)</span>
            </div>
          </div>

          <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-3">
            <span className="text-[11px] font-medium text-rose-400 uppercase tracking-wider block">Absent</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-rose-400">{absentCount}</span>
              <span className="text-xs text-rose-500/80">students</span>
            </div>
          </div>

          <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3">
            <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider block">Late</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-amber-400">{lateCount}</span>
              <span className="text-xs text-amber-500/80">students</span>
            </div>
          </div>

          <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-3">
            <span className="text-[11px] font-medium text-blue-400 uppercase tracking-wider block">Excused</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-blue-400">{excusedCount}</span>
              <span className="text-xs text-blue-500/80">students</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-sky-400 uppercase tracking-wider block">Attendance Rate</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-sky-400">{attendancePercentage}%</span>
              <span className="text-xs text-slate-400">rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Attendance List Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-0">
        
        {/* Header with Title & Legend */}
        <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
              <span>Student Attendance Sheet (विद्यार्थी हाजिरी पुस्तिका)</span>
              <span className="text-xs text-slate-400 font-normal">({displayStudents.length} students)</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-rose-400">
                {nepaliDate.formattedNp}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                • {nepaliDate.formattedEn}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                [{currentDate} AD]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 hidden sm:flex">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> P = Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> A = Absent</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> L = Late</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> E = Excused</span>
          </div>
        </div>

        {/* Filter & Sorting Toolbar */}
        <div className="p-3.5 bg-slate-950/70 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Class Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-sky-400" />
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedSection('ALL');
                }}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Grades</option>
                {uniqueClasses.map(c => (
                  <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <span className="text-slate-400">Sec:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Sections</option>
                {uniqueSections.map(s => (
                  <option key={s} value={s} className="bg-slate-900 text-white">Section {s}</option>
                ))}
              </select>
            </div>

            {/* Sorting Order Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as StudentSortMode)}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="roll-asc" className="bg-slate-900 text-white">Roll No (01 → N) & A-Z</option>
                <option value="alpha-asc" className="bg-slate-900 text-white">Alphabetical (A → Z)</option>
                <option value="alpha-desc" className="bg-slate-900 text-white">Alphabetical (Z → A)</option>
                <option value="roll-desc" className="bg-slate-900 text-white">Roll No (N → 01)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Rows */}
        {displayStudents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 text-sm">No students found matching current class or search filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/70">
            {displayStudents.map((student) => {
              const currentRecord = todayRecordMap.get(student.id);
              const status = currentRecord?.status;
              const remark = currentRecord?.remark;
              const isEditingRemark = remarkInputStudentId === student.id;

              return (
                <div 
                  key={student.id} 
                  id={`attendance-row-${student.id}`}
                  className={`p-4 sm:px-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    status === 'absent' ? 'bg-rose-950/10' : status === 'late' ? 'bg-amber-950/10' : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Student Identity & Basic Info: Roll Number and Alphabetical Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col items-center justify-center flex-shrink-0">
                      <span className="w-9 h-9 rounded-xl bg-slate-800 text-emerald-400 font-black text-xs flex items-center justify-center border border-slate-700 shadow-sm font-mono" title={`Roll Number: ${student.rollNumber}`}>
                        #{student.rollNumber}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium mt-0.5">ROLL</span>
                    </div>

                    {student.avatarUrl ? (
                      <img 
                        src={student.avatarUrl} 
                        alt={student.fullName} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-sky-900/60 text-sky-300 font-bold text-sm flex items-center justify-center border border-sky-700/50 flex-shrink-0">
                        {student.fullName.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewStudent(student)}
                          className="font-semibold text-slate-100 hover:text-sky-400 text-sm truncate text-left transition-colors cursor-pointer"
                        >
                          {student.fullName}
                        </button>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {student.className} - {student.section}
                        </span>
                        {student.house && (
                          <span className="text-[10px] text-slate-400 hidden lg:inline">
                            🏔️ {student.house}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 flex-wrap">
                        <span>Parent: <strong className="text-slate-300 font-medium">{student.parents?.primaryContactName || student.fatherName || 'Guardian'}</strong></span>
                        <span className="hidden md:inline">•</span>
                        {student.phone && (
                          <a 
                            href={`tel:${student.phone}`}
                            className="text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{student.phone}</span>
                          </a>
                        )}
                      </div>

                      {remark && !isEditingRemark && (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 w-fit">
                          <Info className="w-3 h-3" />
                          <span>Note: {remark}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attendance Marking Buttons (P / A / L / E) */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap pl-11 sm:pl-0">
                    <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 shadow-inner">
                      {/* Present Button */}
                      <button
                        id={`btn-mark-present-${student.id}`}
                        type="button"
                        onClick={() => onMarkAttendance(student.id, 'present')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          status === 'present'
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Present</span>
                      </button>

                      {/* Absent Button */}
                      <button
                        id={`btn-mark-absent-${student.id}`}
                        type="button"
                        onClick={() => onMarkAttendance(student.id, 'absent')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          status === 'absent'
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                            : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Absent</span>
                      </button>

                      {/* Late Button */}
                      <button
                        id={`btn-mark-late-${student.id}`}
                        type="button"
                        onClick={() => onMarkAttendance(student.id, 'late')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          status === 'late'
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                            : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Late</span>
                      </button>

                      {/* Excused Button */}
                      <button
                        id={`btn-mark-excused-${student.id}`}
                        type="button"
                        onClick={() => onMarkAttendance(student.id, 'excused')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          status === 'excused'
                            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                            : 'text-slate-400 hover:text-blue-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Excused</span>
                      </button>
                    </div>

                    {/* Secondary Actions: Remark and View */}
                    <div className="flex items-center gap-1">
                      {status === 'absent' && (student.phone || student.parents?.phone) && (
                        <a
                          href={`https://wa.me/${(student.phone || student.parents?.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `नमस्ते, सुनगाभा पब्लिक सेकेन्डरी स्कुलबाट जानकारी: आज मिति ${nepaliDate.formattedNp} मा तपाईंको नानी/बाबु ${student.fullName} (Roll #${student.rollNumber}, Class ${student.className}-${student.section}) विद्यालयमा अनुपस्थित हुनुहुन्छ। कृपया जानकारी गराउनुहोला।`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-xl border border-emerald-500/30 transition-all text-xs flex items-center gap-1"
                          title="WhatsApp Attendance Alert to Parent"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Alert Parent</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewStudent(student)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                        title="View Complete Student Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Inline Remark Edit Box */}
                    {isEditingRemark && (
                      <div className="w-full mt-2 pl-11 flex items-center gap-2">
                        <input 
                          type="text"
                          value={tempRemark}
                          onChange={(e) => setTempRemark(e.target.value)}
                          placeholder="e.g., Medical leave, Sick, Family function"
                          className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRemark(student.id, status || 'present')}
                          className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-semibold"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemarkInputStudentId(null)}
                          className="px-2 py-1.5 text-slate-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
