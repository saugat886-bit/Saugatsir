// School Master Timetable & Class Schedule Module for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Users,
  GraduationCap,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { TimetablePeriod, ClassSection, UserProfile } from '../types';

interface TimetableModuleProps {
  currentUser: UserProfile | null;
  timetable: TimetablePeriod[];
  classes: ClassSection[];
}

export const TimetableModule: React.FC<TimetableModuleProps> = ({
  currentUser,
  timetable,
  classes
}) => {
  const [selectedDay, setSelectedDay] = useState('Sunday');
  const [selectedClass, setSelectedClass] = useState('Grade 6');
  const [selectedSection, setSelectedSection] = useState('Moon');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredPeriods = timetable.filter(
    t => t.className === selectedClass && t.section === selectedSection && t.dayOfWeek === selectedDay
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            <h1 className="text-lg font-bold text-white">Daily Academic Routine & Master Schedule</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Sungabha Public Secondary School • Standard 7-Period Daily Schedule (10:00 AM - 4:00 PM)
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDay === day
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {day.slice(0, 3)}
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

        <span className="text-xs text-sky-400 font-semibold">
          Schedule for {selectedDay}: {selectedClass} — Section {selectedSection}
        </span>
      </div>

      {/* Timetable Period Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredPeriods.map((period) => (
            <div
              key={period.id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-sky-500/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
                  Period {period.periodNumber}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{period.timeSlot}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  {period.subject}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Faculty: {period.teacherName}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-400" />
                  {period.room}
                </span>
                <span className="text-emerald-400 font-medium">Scheduled</span>
              </div>
            </div>
          ))}
        </div>

        {filteredPeriods.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            No routine periods configured for this selection.
          </div>
        )}
      </div>

    </div>
  );
};
