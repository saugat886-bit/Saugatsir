import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  UserCheck, 
  Edit3, 
  Trash2, 
  ShieldAlert, 
  Briefcase, 
  MessageSquare,
  Eye,
  CalendarCheck,
  FileSpreadsheet,
  Cake,
  Hash,
  Sparkles,
  Award,
  Lock,
  Plus,
  ShieldCheck,
  User,
  Search,
  Filter,
  X,
  ArrowUpDown
} from 'lucide-react';
import { Student, AttendanceRecord, UserProfile } from '../types';
import { sortStudents, StudentSortMode } from '../utils/studentSort';

interface StudentDirectoryProps {
  students: Student[];
  records: AttendanceRecord[];
  currentUser: UserProfile | null;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onOpenExcelModal?: () => void;
  onOpenAddModal?: () => void;
  onOpenAuthModal?: () => void;
  onResequenceRollNumbers?: (targetClass?: string, targetSection?: string) => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  records,
  currentUser,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onOpenExcelModal,
  onOpenAddModal,
  onOpenAuthModal,
  onResequenceRollNumbers
}) => {
  const [adminNoticeOpen, setAdminNoticeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [sortMode, setSortMode] = useState<StudentSortMode>('roll-asc');

  const roleUpper = currentUser?.role?.toUpperCase() || '';
  const isAdmin = !currentUser || 
    roleUpper === 'SUPER_ADMIN' || 
    roleUpper === 'PRINCIPAL' || 
    roleUpper === 'VICE_PRINCIPAL' || 
    roleUpper === 'ACADEMIC_COORDINATOR' ||
    roleUpper === 'ADMIN';

  const canAddStudent = isAdmin ||
    roleUpper === 'TEACHER' ||
    roleUpper === 'ACCOUNTANT' ||
    roleUpper === 'HOSTEL_WARDEN' ||
    roleUpper === 'ECA_COORDINATOR' ||
    roleUpper === 'TRANSPORT_STAFF';

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

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    const filtered = students.filter(student => {
      if (selectedClass !== 'ALL' && student.className !== selectedClass) return false;
      if (selectedSection !== 'ALL' && student.section !== selectedSection) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameMatch = student.fullName.toLowerCase().includes(q);
      const rollMatch = student.rollNumber?.toLowerCase().includes(q);
      const admMatch = student.admissionNumber?.toLowerCase().includes(q);
      const phoneMatch = (student.phone || student.parents?.phone || '').includes(q);
      const parentMatch = (student.parents?.primaryContactName || student.fatherName || student.motherName || '').toLowerCase().includes(q);

      return nameMatch || rollMatch || admMatch || phoneMatch || parentMatch;
    });

    return sortStudents(filtered, sortMode, selectedClass === 'ALL');
  }, [students, selectedClass, selectedSection, searchQuery, sortMode]);

  // Compute attendance stats per student
  const getStudentStats = (studentId: string) => {
    const studentRecords = records.filter(r => r.studentId === studentId);
    const total = studentRecords.length;
    if (total === 0) return { percentage: 100, present: 0, absent: 0, late: 0, total: 0 };
    
    const present = studentRecords.filter(r => r.status === 'present').length;
    const absent = studentRecords.filter(r => r.status === 'absent').length;
    const late = studentRecords.filter(r => r.status === 'late').length;
    const excused = studentRecords.filter(r => r.status === 'excused').length;
    
    const percentage = Math.round(((present + (late * 0.5)) / total) * 100);
    return { percentage, present, absent, late, excused, total };
  };

  const handleRestrictedAction = (actionName: string) => {
    setAdminNoticeOpen(true);
  };

  return (
    <div className="space-y-4">
      
      {/* Role Notice Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2.5">
          {isAdmin ? (
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
          )}
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span>{isAdmin ? 'Administrator Master Control' : 'Staff & Teacher Directory Hub'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                isAdmin 
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}>
                {currentUser?.role || 'Full Access'}
              </span>
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isAdmin 
                ? 'Full administrative control: add new students, edit master records, bulk Excel upgrades, and manage rosters.' 
                : 'Teachers and staff can add students, update portfolios, take roll call, and contact guardians.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {isAdmin && onOpenExcelModal && (
            <button
              type="button"
              onClick={onOpenExcelModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Upload Excel</span>
            </button>
          )}
          {canAddStudent && onOpenAddModal && (
            <button
              id="btn-directory-add-student"
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          )}
          {!canAddStudent && onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Admin Access</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll no, phone, or parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
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
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
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
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
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

          {/* Sort Order Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as StudentSortMode)}
              className="bg-transparent text-sky-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="roll-asc" className="bg-slate-900 text-white">Roll No (01 → N) & A-Z</option>
              <option value="alpha-asc" className="bg-slate-900 text-white">Alphabetical (A → Z)</option>
              <option value="alpha-desc" className="bg-slate-900 text-white">Alphabetical (Z → A)</option>
              <option value="roll-desc" className="bg-slate-900 text-white">Roll No (N → 01)</option>
            </select>
          </div>

          {/* Resequence Roll Numbers Alphabetically Button */}
          {canAddStudent && onResequenceRollNumbers && (
            <button
              type="button"
              onClick={() => {
                const targetText = selectedClass !== 'ALL' 
                  ? `${selectedClass}${selectedSection !== 'ALL' ? ` - Section ${selectedSection}` : ''}`
                  : 'all classes';
                if (confirm(`Resequence and assign roll numbers in alphabetical order (A → Z) for ${targetText}? Each student's roll number will be updated from 1 upwards alphabetically.`)) {
                  onResequenceRollNumbers(selectedClass, selectedSection);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="Assign roll numbers (1, 2, 3...) strictly in alphabetical order"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resequence Roll Nos A→Z</span>
            </button>
          )}

          {/* Counter Badge */}
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/80 whitespace-nowrap">
            {filteredStudents.length} of {students.length} Students
          </span>
        </div>
      </div>

      {/* Admin Restriction Modal if triggered */}
      {adminNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Administrator Access Required</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Bulk Excel spreadsheet uploads and master student record deletion are restricted to Administrator and Principal accounts.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Teachers can view all student records, mark daily roll call, and upload student portfolio items.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdminNoticeOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminNoticeOpen(false);
                  if (onOpenAuthModal) onOpenAuthModal();
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-400 hover:to-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Login as Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center shadow-xl flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Students Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No student records matched your search query or selected class/section filter.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            {(searchQuery || selectedClass !== 'ALL' || selectedSection !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedClass('ALL');
                  setSelectedSection('ALL');
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Clear Search & Filters
              </button>
            )}
            {canAddStudent && onOpenAddModal && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Student</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStudents.map((student) => {
          const stats = getStudentStats(student.id);
          const parentPhoneClean = (student.phone || student.parents.phone || '').replace(/[^0-9]/g, '');
          const father = student.fatherName || (student.parents.relationship === 'Father' ? student.parents.primaryContactName : '');
          const mother = student.motherName || (student.parents.relationship === 'Mother' ? student.parents.primaryContactName : '');
          const portfolioCount = (student.portfolio || []).length;

          return (
            <div
              key={student.id}
              id={`student-card-${student.id}`}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Avatar, Name, Roll No & Class Badge */}
                <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-3 min-w-0">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 text-white font-bold text-base flex items-center justify-center border border-sky-500/40 flex-shrink-0 shadow-md">
                        {student.fullName.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onViewStudent(student)}
                        className="font-bold text-slate-100 hover:text-sky-400 text-base truncate block text-left transition-colors cursor-pointer"
                      >
                        {student.fullName}
                      </button>
                      
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                          {student.className} • Sec {student.section}
                        </span>
                        <span className="text-xs text-slate-300 font-bold font-mono">
                          R. #{student.rollNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Id: {student.admissionNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance rate badge */}
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        stats.percentage >= 85
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : stats.percentage >= 75
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      <CalendarCheck className="w-3 h-3" />
                      {stats.percentage}%
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      {stats.present}/{stats.total} days
                    </span>
                  </div>
                </div>

                {/* Student Metadata Row: Gender, Caste, DOB, Portfolio Badge */}
                <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px]">
                  <span className={`px-2 py-0.5 rounded font-medium ${
                    student.gender === 'Female' 
                      ? 'bg-pink-950/50 text-pink-300 border border-pink-800/40' 
                      : 'bg-sky-950/50 text-sky-300 border border-sky-800/40'
                  }`}>
                    {student.gender}
                  </span>

                  {student.caste && (
                    <span className="px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/40 font-medium">
                      {student.caste}
                    </span>
                  )}

                  {student.dob && (
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700 flex items-center gap-1 font-mono">
                      <Cake className="w-3 h-3 text-amber-400" />
                      DOB: {student.dob}
                    </span>
                  )}

                  {/* Portfolio Items Count Pill */}
                  <button
                    type="button"
                    onClick={() => onViewStudent(student)}
                    className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                  >
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>{portfolioCount} {portfolioCount === 1 ? 'Portfolio' : 'Portfolios'}</span>
                  </button>
                </div>

                {/* Student Contact & Address */}
                <div className="mt-3 space-y-1.5 text-xs">
                  {/* Phone */}
                  <div className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Phone:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${student.phone}`} className="hover:text-sky-300 font-mono font-medium text-slate-200">
                        {student.phone}
                      </a>
                      {parentPhoneClean && (
                        <a
                          href={`https://wa.me/${parentPhoneClean}?text=${encodeURIComponent(`Hello, regarding student ${student.fullName} at school.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-md border border-emerald-500/30 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start justify-between text-slate-300">
                    <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Address:</span>
                    </div>
                    <span className="text-slate-300 text-right font-medium">
                      {student.address.street}
                    </span>
                  </div>
                </div>

                {/* Parents Details Box (Father & Mother Names) */}
                <div className="mt-3.5 bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Parent Details</span>
                    </span>
                    {student.admissionDate && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Admitted: {student.admissionDate}
                      </span>
                    )}
                  </div>

                  {/* Father Name */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Father's Name:</span>
                    <span className="font-semibold text-slate-200 truncate ml-2">
                      {father || student.parents.primaryContactName || '-'}
                    </span>
                  </div>

                  {/* Mother Name */}
                  {mother && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Mother's Name:</span>
                      <span className="font-semibold text-slate-200 truncate ml-2">
                        {mother}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onViewStudent(student)}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full Record & Portfolio</span>
                </button>

                <div className="flex items-center gap-1">
                  {canAddStudent && (
                    <button
                      type="button"
                      onClick={() => onEditStudent(student)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit Student Record"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ${student.fullName}?`)) {
                          onDeleteStudent(student.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Student (Admin)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={() => onViewStudent(student)}
                      className="px-2.5 py-1 text-slate-300 hover:text-amber-300 bg-slate-800/80 hover:bg-amber-500/15 border border-slate-700/80 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Upload Student Portfolio"
                    >
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Portfolio</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
