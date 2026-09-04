// Flexible Class & Section Management Module
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  Users,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  DoorOpen,
  ArrowUpCircle
} from 'lucide-react';
import { ClassSection, Student } from '../types';

interface ClassSectionManagerProps {
  classes: ClassSection[];
  students: Student[];
  onAddClassSection: (newSection: Omit<ClassSection, 'id'>) => void;
  onUpdateClassSection: (id: string, updated: Partial<ClassSection>) => void;
  onDeleteClassSection: (id: string) => void;
  onPromoteStudents: (fromClass: string, toClass: string) => void;
  onTransferStudent: (studentId: string, targetClass: string, targetSection: string) => void;
}

export const ClassSectionManager: React.FC<ClassSectionManagerProps> = ({
  classes,
  students,
  onAddClassSection,
  onUpdateClassSection,
  onDeleteClassSection,
  onPromoteStudents,
  onTransferStudent
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Form State for Add
  const [classNameInput, setClassNameInput] = useState('Grade 6');
  const [sectionInput, setSectionInput] = useState('Moon');
  const [teacherInput, setTeacherInput] = useState('');
  const [roomInput, setRoomInput] = useState('Room 201');

  // Transfer State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [transferTargetClass, setTransferTargetClass] = useState('Grade 6');
  const [transferTargetSection, setTransferTargetSection] = useState('Moon');

  // Promote State
  const [promoteFrom, setPromoteFrom] = useState('Grade 6');
  const [promoteTo, setPromoteTo] = useState('Grade 7');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput || !sectionInput) return;
    onAddClassSection({
      className: classNameInput,
      section: sectionInput,
      classTeacherName: teacherInput || 'To be assigned',
      roomNumber: roomInput || 'Room 101',
      capacity: 40
    });
    setIsAddModalOpen(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    onTransferStudent(selectedStudentId, transferTargetClass, transferTargetSection);
    setIsTransferModalOpen(false);
    setSelectedStudentId('');
  };

  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteFrom || !promoteTo) return;
    if (confirm(`Are you sure you want to promote all students from ${promoteFrom} to ${promoteTo}?`)) {
      onPromoteStudents(promoteFrom, promoteTo);
      setIsPromoteModalOpen(false);
    }
  };

  // Group classes by grade
  const gradeGroups = classes.reduce((acc, cls) => {
    if (!acc[cls.className]) acc[cls.className] = [];
    acc[cls.className].push(cls);
    return acc;
  }, {} as Record<string, ClassSection[]>);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-sky-400" />
            <h1 className="text-lg font-bold text-white">Class & Section Operating Structure</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic academic configuration for Sungabha Public Secondary School. Manage grades, sections, room allocations and student promotions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-600/30 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>Promote Batch</span>
          </button>
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfer Student</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class / Section</span>
          </button>
        </div>
      </div>

      {/* Grade Groups Roster */}
      <div className="space-y-6">
        {(Object.entries(gradeGroups) as [string, ClassSection[]][]).map(([gradeName, sectionsList]) => {
          const totalGradeStudents = students.filter(s => s.className === gradeName).length;

          return (
            <div key={gradeName} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-950 border border-blue-500/30 flex items-center justify-center font-black text-sky-400 text-sm">
                    {gradeName.replace('Grade ', 'G')}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">{gradeName}</h2>
                    <p className="text-xs text-slate-400">{sectionsList.length} Sections configured</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-sky-400">{totalGradeStudents}</span>
                  <span className="text-[11px] text-slate-500 block">Total Enrolled</span>
                </div>
              </div>

              {/* Section Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {sectionsList.map((sec) => {
                  const sectionStudents = students.filter(s => s.className === sec.className && s.section === sec.section);

                  return (
                    <div
                      key={sec.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 relative group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-sky-300">Section {sec.section}</span>
                          <h3 className="text-sm font-black text-white">{sec.className} — {sec.section}</h3>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-500/30">
                          {sectionStudents.length} Stds
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>Class Teacher:</span>
                          <span className="text-slate-200 font-medium truncate max-w-[110px]">{sec.classTeacherName || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Room:</span>
                          <span className="text-slate-200 font-medium">{sec.roomNumber || 'Room 101'}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => {
                            const newTeacher = prompt('Enter new Class Teacher Name:', sec.classTeacherName);
                            if (newTeacher) onUpdateClassSection(sec.id, { classTeacherName: newTeacher });
                          }}
                          className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Info</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove Section ${sec.section} from ${sec.className}?`)) {
                              onDeleteClassSection(sec.id);
                            }
                          }}
                          className="text-[11px] text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Class/Section Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Add New Grade or Section</h2>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Grade / Class Name</label>
                <input
                  type="text"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  placeholder="e.g. Grade 6, Grade 7, Grade 8"
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Section Name</label>
                <input
                  type="text"
                  value={sectionInput}
                  onChange={(e) => setSectionInput(e.target.value)}
                  placeholder="e.g. Moon, Star, Sun, Earth"
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Class Teacher Name</label>
                <input
                  type="text"
                  value={teacherInput}
                  onChange={(e) => setTeacherInput(e.target.value)}
                  placeholder="e.g. Bikash Thapa"
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Assigned Room</label>
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  placeholder="e.g. Room 201"
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white rounded-xl shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Student Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Transfer Student to Another Section</h2>
            <form onSubmit={handleTransferSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.className} - {s.section}, Roll #{s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Target Grade</label>
                <select
                  value={transferTargetClass}
                  onChange={(e) => setTransferTargetClass(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                >
                  {Array.from(new Set(classes.map(c => c.className))).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Target Section</label>
                <select
                  value={transferTargetSection}
                  onChange={(e) => setTransferTargetSection(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                >
                  {['Moon', 'Star', 'Sun', 'Earth'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-amber-600/20 cursor-pointer"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promote Students Modal */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Annual Student Batch Promotion</h2>
            <p className="text-xs text-slate-400">
              Bulk upgrade all students of a grade to the next higher academic class.
            </p>
            <form onSubmit={handlePromoteSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Current Grade (From)</label>
                <select
                  value={promoteFrom}
                  onChange={(e) => setPromoteFrom(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                >
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Promote To Grade</label>
                <select
                  value={promoteTo}
                  onChange={(e) => setPromoteTo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                >
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Graduated">Graduated / Alum</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPromoteModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  Execute Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
