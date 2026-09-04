// Examination, Marksheet & ISO 9001:2015 Report Card Generator Module
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  Award,
  FileText,
  Printer,
  Download,
  Plus,
  Edit2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Calculator
} from 'lucide-react';
import {
  Student,
  ExamRecord,
  ExamType,
  SubjectMark,
  UserProfile,
  ClassSection
} from '../types';
import { SCHOOL_INFO } from '../data/initialData';

interface ExamReportCardModuleProps {
  currentUser: UserProfile | null;
  students: Student[];
  classes: ClassSection[];
  exams: ExamRecord[];
  onSaveExamRecord: (record: ExamRecord) => void;
}

export const ExamReportCardModule: React.FC<ExamReportCardModuleProps> = ({
  currentUser,
  students,
  classes,
  exams,
  onSaveExamRecord
}) => {
  const [selectedExamType, setSelectedExamType] = useState<ExamType>('First Terminal');
  const [selectedClass, setSelectedClass] = useState('Grade 6');
  const [selectedSection, setSelectedSection] = useState('Moon');
  const [activeStudentForCard, setActiveStudentForCard] = useState<Student | null>(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [studentForEntry, setStudentForEntry] = useState<Student | null>(null);

  // Form State for Marks Entry
  const defaultSubjects = [
    { name: 'Compulsory Science', full: 100, pass: 40, theory: 70, practical: 25 },
    { name: 'Mathematics', full: 100, pass: 40, theory: 90, practical: 0 },
    { name: 'English', full: 100, pass: 40, theory: 65, practical: 20 },
    { name: 'Nepali', full: 100, pass: 40, theory: 60, practical: 25 },
    { name: 'Social Studies', full: 100, pass: 40, theory: 68, practical: 20 },
    { name: 'Computer Science', full: 100, pass: 40, theory: 45, practical: 50 }
  ];

  const [subjectMarksInput, setSubjectMarksInput] = useState(defaultSubjects);
  const [teacherRemarks, setTeacherRemarks] = useState('Active in class and demonstrates high aptitude.');

  const filteredStudents = students.filter(
    s => s.className === selectedClass && s.section === selectedSection
  );

  // Calculate grade & GPA from mark
  const calculateGradeInfo = (totalMark: number) => {
    if (totalMark >= 90) return { grade: 'A+', gpa: 4.0, remarks: 'Outstanding' };
    if (totalMark >= 80) return { grade: 'A', gpa: 3.6, remarks: 'Excellent' };
    if (totalMark >= 70) return { grade: 'B+', gpa: 3.2, remarks: 'Very Good' };
    if (totalMark >= 60) return { grade: 'B', gpa: 2.8, remarks: 'Good' };
    if (totalMark >= 50) return { grade: 'C+', gpa: 2.4, remarks: 'Satisfactory' };
    if (totalMark >= 40) return { grade: 'C', gpa: 2.0, remarks: 'Acceptable' };
    return { grade: 'NG', gpa: 0.0, remarks: 'Needs Improvement' };
  };

  const handleOpenEntry = (st: Student) => {
    setStudentForEntry(st);
    const existingRec = exams.find(e => e.studentId === st.id && e.examName === selectedExamType);
    if (existingRec) {
      setSubjectMarksInput(
        existingRec.marks.map(m => ({
          name: m.subjectName,
          full: m.fullMarks,
          pass: m.passMarks,
          theory: m.theoryMarks,
          practical: m.practicalMarks || 0
        }))
      );
      setTeacherRemarks(existingRec.teacherRemarks);
    }
    setIsEntryModalOpen(true);
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForEntry) return;

    const computedSubjectMarks: SubjectMark[] = subjectMarksInput.map(sub => {
      const total = sub.theory + sub.practical;
      const gInfo = calculateGradeInfo(total);
      return {
        subjectName: sub.name,
        fullMarks: sub.full,
        passMarks: sub.pass,
        theoryMarks: sub.theory,
        practicalMarks: sub.practical,
        totalMarks: total,
        grade: gInfo.grade,
        gradePoint: gInfo.gpa,
        remarks: gInfo.remarks
      };
    });

    const totalFull = computedSubjectMarks.reduce((a, b) => a + b.fullMarks, 0);
    const totalObt = computedSubjectMarks.reduce((a, b) => a + b.totalMarks, 0);
    const pct = Math.round((totalObt / totalFull) * 100);
    const avgGpa = Number((computedSubjectMarks.reduce((a, b) => a + b.gradePoint, 0) / computedSubjectMarks.length).toFixed(2));
    const overallG = calculateGradeInfo(pct).grade;

    const record: ExamRecord = {
      id: `exam-${studentForEntry.id}-${selectedExamType.replace(/\s+/g, '-').toLowerCase()}`,
      examName: selectedExamType,
      academicYear: '2082/2083',
      studentId: studentForEntry.id,
      studentName: studentForEntry.fullName,
      className: studentForEntry.className,
      section: studentForEntry.section,
      rollNumber: studentForEntry.rollNumber,
      marks: computedSubjectMarks,
      totalFullMarks: totalFull,
      totalObtainedMarks: totalObt,
      percentage: pct,
      gpa: avgGpa,
      overallGrade: overallG,
      rank: 1,
      attendanceDays: 62,
      totalSchoolDays: 65,
      teacherRemarks: teacherRemarks,
      principalRemarks: 'Consistent effort and good moral character.',
      resultDate: new Date().toISOString().split('T')[0]
    };

    onSaveExamRecord(record);
    setIsEntryModalOpen(false);
    setActiveStudentForCard(studentForEntry);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-white">Examination, Grading & Official Report Cards</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {SCHOOL_INFO.nameEn} • {SCHOOL_INFO.certification} Academic Evaluation System
          </p>
        </div>

        {/* Exam Type Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          {(['Monthly Test', 'First Terminal', 'Second Terminal', 'Final Examination'] as ExamType[]).map(et => (
            <button
              key={et}
              onClick={() => setSelectedExamType(et)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedExamType === et
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {et}
            </button>
          ))}
        </div>
      </div>

      {/* Class & Section Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold">Grade:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none"
            >
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none"
            >
              <option value="Moon">Moon</option>
              <option value="Star">Star</option>
              <option value="Sun">Sun</option>
              <option value="Earth">Earth</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filteredStudents.length}</span> students in {selectedClass} - {selectedSection}
        </span>
      </div>

      {/* Main Student Examination List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Student Exam Mark Sheet */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                {selectedExamType} Roster & Mark Entry
              </h2>
              <span className="text-xs text-slate-400">Click to enter or generate marksheet</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {filteredStudents.map(st => {
                const rec = exams.find(e => e.studentId === st.id && e.examName === selectedExamType);

                return (
                  <div
                    key={st.id}
                    className="p-4 hover:bg-slate-850/60 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-300">
                        #{st.rollNumber}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white">{st.fullName}</h3>
                        <p className="text-[11px] text-slate-400">Adm ID: {st.admissionNumber} • House: 🏔️ {st.house || 'Gaurishankar'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {rec ? (
                        <div className="text-right mr-2 hidden sm:block">
                          <span className="text-xs font-black text-amber-300">GPA {rec.gpa.toFixed(2)}</span>
                          <span className="text-[10px] text-emerald-400 block font-semibold">Grade {rec.overallGrade} ({rec.percentage}%)</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 hidden sm:inline">Not Entered</span>
                      )}

                      <button
                        onClick={() => handleOpenEntry(st)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{rec ? 'Edit Marks' : 'Enter Marks'}</span>
                      </button>

                      <button
                        onClick={() => setActiveStudentForCard(st)}
                        className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Award className="w-3 h-3" />
                        <span>Report Card</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Report Card Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Official Report Card Preview
            </h2>
            {activeStudentForCard && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 text-xs text-sky-400 hover:underline cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>
            )}
          </div>

          {activeStudentForCard ? (
            <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border-4 border-blue-900 space-y-4 print:p-0 print:border-none print:shadow-none">
              {/* Header */}
              <div className="text-center border-b-2 border-blue-900 pb-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-900 text-white font-black flex items-center justify-center text-xs">
                    SC
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 bg-emerald-100 rounded-full">
                    ISO 9001:2015 CERTIFIED
                  </span>
                </div>
                <h2 className="text-sm font-black text-blue-950 uppercase tracking-tight">
                  {SCHOOL_INFO.nameEn}
                </h2>
                <h3 className="text-xs font-bold text-slate-700">{SCHOOL_INFO.nameNp}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{SCHOOL_INFO.location} • Tel: {SCHOOL_INFO.phone}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-red-600 text-white font-black text-[11px] rounded-full uppercase tracking-wider">
                  {selectedExamType} — Progress Report Card
                </div>
              </div>

              {/* Student Demographics */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                <div>
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900 ml-1">{activeStudentForCard.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Roll No:</span>
                  <span className="font-bold text-slate-900 ml-1">#{activeStudentForCard.rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500">Class & Sec:</span>
                  <span className="font-bold text-slate-900 ml-1">{activeStudentForCard.className} - {activeStudentForCard.section}</span>
                </div>
                <div>
                  <span className="text-slate-500">Adm No:</span>
                  <span className="font-bold text-slate-900 ml-1">{activeStudentForCard.admissionNumber}</span>
                </div>
              </div>

              {/* Subject Marks Table */}
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white font-bold">
                    <th className="p-1.5">Subject</th>
                    <th className="p-1.5 text-center">FM</th>
                    <th className="p-1.5 text-center">Th</th>
                    <th className="p-1.5 text-center">Pr</th>
                    <th className="p-1.5 text-center">Tot</th>
                    <th className="p-1.5 text-center">Grade</th>
                    <th className="p-1.5 text-center">GPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {defaultSubjects.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-1.5 font-medium text-slate-800">{sub.name}</td>
                      <td className="p-1.5 text-center text-slate-600">{sub.full}</td>
                      <td className="p-1.5 text-center font-bold text-slate-800">{sub.theory}</td>
                      <td className="p-1.5 text-center text-slate-600">{sub.practical || '-'}</td>
                      <td className="p-1.5 text-center font-bold text-blue-900">{sub.theory + sub.practical}</td>
                      <td className="p-1.5 text-center font-black text-emerald-700">A+</td>
                      <td className="p-1.5 text-center font-bold text-slate-900">4.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Result Summary Box */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-100 p-2.5 rounded-xl border text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Total Percentage</span>
                  <span className="font-black text-blue-950 text-sm">91%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Grade Point (GPA)</span>
                  <span className="font-black text-emerald-700 text-sm">3.80</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Overall Grade</span>
                  <span className="font-black text-red-600 text-sm">A+</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 gap-4 text-center text-[10px] text-slate-600">
                <div className="border-t border-slate-400 pt-1">
                  <span className="font-bold">Class Teacher's Signature</span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <span className="font-bold">Principal / Seal</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-2">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs">Click "Report Card" on any student to generate the printable marksheet.</p>
            </div>
          )}
        </div>

      </div>

      {/* Marks Entry Modal */}
      {isEntryModalOpen && studentForEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div>
              <span className="text-[10px] font-bold text-sky-400">{selectedExamType}</span>
              <h2 className="text-base font-bold text-white mt-0.5">
                Enter Subject Marks: {studentForEntry.fullName}
              </h2>
              <p className="text-xs text-slate-400">
                {studentForEntry.className} — {studentForEntry.section} (Roll #{studentForEntry.rollNumber})
              </p>
            </div>

            <form onSubmit={handleSaveMarks} className="space-y-4">
              <div className="space-y-3">
                {subjectMarksInput.map((sub, index) => (
                  <div key={sub.name} className="p-3 bg-slate-850 rounded-2xl border border-slate-700 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-white flex-1">{sub.name}</span>
                    
                    <div className="flex items-center gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Theory (FM 75)</label>
                        <input
                          type="number"
                          max={75}
                          min={0}
                          value={sub.theory}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSubjectMarksInput(prev => prev.map((s, idx) => idx === index ? { ...s, theory: val } : s));
                          }}
                          className="w-18 bg-slate-800 border border-slate-600 text-xs text-white rounded-lg px-2 py-1.5 text-center font-bold"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Practical (FM 25)</label>
                        <input
                          type="number"
                          max={25}
                          min={0}
                          value={sub.practical}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSubjectMarksInput(prev => prev.map((s, idx) => idx === index ? { ...s, practical: val } : s));
                          }}
                          className="w-18 bg-slate-800 border border-slate-600 text-xs text-white rounded-lg px-2 py-1.5 text-center font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Teacher Remarks</label>
                <textarea
                  rows={2}
                  value={teacherRemarks}
                  onChange={(e) => setTeacherRemarks(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl p-3 outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white rounded-xl shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  Save & Compute GPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
