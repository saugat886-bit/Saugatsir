import React from 'react';
import { Search, Filter, Plus, Users, School, FileSpreadsheet, Lock, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface ClassFilterProps {
  classes: string[];
  sections: string[];
  selectedClass: string;
  selectedSection: string;
  searchQuery: string;
  currentUser?: UserProfile | null;
  onSelectClass: (c: string) => void;
  onSelectSection: (s: string) => void;
  onSearchChange: (q: string) => void;
  onOpenAddModal: () => void;
  onOpenExcelModal?: () => void;
  onOpenAuthModal?: () => void;
  totalFilteredCount: number;
}

export const ClassFilter: React.FC<ClassFilterProps> = ({
  classes,
  sections,
  selectedClass,
  selectedSection,
  searchQuery,
  currentUser,
  onSelectClass,
  onSelectSection,
  onSearchChange,
  onOpenAddModal,
  onOpenExcelModal,
  onOpenAuthModal,
  totalFilteredCount
}) => {
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

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Class & Section Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium pr-1">
            <School className="w-4 h-4 text-sky-400" />
            <span>Class:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              id="filter-class-all"
              type="button"
              onClick={() => onSelectClass('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedClass === 'ALL'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
              }`}
            >
              All Classes
            </button>
            {classes.map((cls) => (
              <button
                key={cls}
                id={`filter-class-${cls.replace(/\s+/g, '-').toLowerCase()}`}
                type="button"
                onClick={() => onSelectClass(cls)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block mx-1" />

          {/* Section Filter */}
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sec:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              id="filter-sec-all"
              type="button"
              onClick={() => onSelectSection('ALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedSection === 'ALL'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
              }`}
            >
              All
            </button>
            {sections.map((sec) => (
              <button
                key={sec}
                id={`filter-sec-${sec.toLowerCase()}`}
                type="button"
                onClick={() => onSelectSection(sec)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedSection === sec
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                }`}
              >
                Sec {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="student-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search student, parent, phone..."
              className="w-full bg-slate-950/70 border border-slate-700/70 text-slate-200 text-xs rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Import Excel Button - Admin vs Teacher */}
          {isAdmin ? (
            onOpenExcelModal && (
              <button
                id="btn-excel-import-filter"
                type="button"
                onClick={onOpenExcelModal}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-all active:scale-95 whitespace-nowrap cursor-pointer shadow-sm"
                title="Admin: Add or update students from Excel / CSV"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Import Excel (Admin)</span>
              </button>
            )
          ) : (
            <button
              id="btn-excel-import-restricted"
              type="button"
              onClick={() => onOpenAuthModal && onOpenAuthModal()}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-700/60 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer"
              title="Excel spreadsheet upgrades are restricted to Administrators"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Import Excel (Admin)</span>
            </button>
          )}

          {canAddStudent ? (
            <button
              id="btn-add-new-student"
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-sky-500/25 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Student</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Info strip */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span>Showing <strong className="text-slate-200">{totalFilteredCount}</strong> students in {selectedClass === 'ALL' ? 'all classes' : selectedClass} {selectedSection !== 'ALL' && `(Section ${selectedSection})`}</span>
        </div>
        {searchQuery && (
          <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-[11px]">
            Filtered by: &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>
    </div>
  );
};
