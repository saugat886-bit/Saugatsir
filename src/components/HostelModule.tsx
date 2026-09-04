// Hostel Management & Roll Call Module for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  Home,
  Sun,
  Moon,
  CheckCircle2,
  XCircle,
  Phone,
  AlertTriangle,
  UserCheck,
  DoorOpen,
  Plus,
  HeartPulse,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Student, HostelStudent, UserProfile } from '../types';

interface HostelModuleProps {
  currentUser: UserProfile | null;
  students: Student[];
  onUpdateHostelStatus: (studentId: string, isHostel: boolean, room?: string) => void;
}

export const HostelModule: React.FC<HostelModuleProps> = ({
  currentUser,
  students,
  onUpdateHostelStatus
}) => {
  const [rollCallShift, setRollCallShift] = useState<'morning' | 'evening'>('evening');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'sick' | 'study'>>({});
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('ALL');

  // Filter only hostel students
  const hostelStudents = students.filter(s => s.isHostel);

  const rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105'];

  const handleMark = (studentId: string, status: 'present' | 'absent' | 'sick' | 'study') => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const next: Record<string, 'present' | 'absent' | 'sick' | 'study'> = {};
    hostelStudents.forEach(s => {
      next[s.id] = 'present';
    });
    setAttendanceMap(next);
  };

  const handleEmergencyCall = (phone: string, studentName: string) => {
    if (confirm(`Direct Call to Parent of ${studentName} (${phone})?`)) {
      window.open(`tel:${phone}`);
    }
  };

  const filteredList = selectedRoomFilter === 'ALL'
    ? hostelStudents
    : hostelStudents.filter(s => s.hostelRoom === selectedRoomFilter);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 border border-orange-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-orange-400" />
            <h1 className="text-lg font-bold text-white">Sungabha Residential Hostel Wing</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            20 Capacity Boarding Roster • Warden In-Charge: Hari Prasad Neupane (9847123987)
          </p>
        </div>

        {/* Shift Toggle & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setRollCallShift('morning')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                rollCallShift === 'morning'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Morning Roll Call (6:00 AM)</span>
            </button>
            <button
              onClick={() => setRollCallShift('evening')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                rollCallShift === 'evening'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Evening Roll Call (8:00 PM)</span>
            </button>
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/20"
          >
            Mark All 20 Present
          </button>
        </div>
      </div>

      {/* Room Tabs & Capacity Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {rooms.map(rm => {
          const count = hostelStudents.filter(s => s.hostelRoom === rm).length;
          const isSelected = selectedRoomFilter === rm;

          return (
            <button
              key={rm}
              onClick={() => setSelectedRoomFilter(isSelected ? 'ALL' : rm)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-orange-500/20 border-orange-500/50 text-white'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DoorOpen className="w-4 h-4 text-orange-400" />
                <div>
                  <span className="text-xs font-bold text-white block">{rm}</span>
                  <span className="text-[10px] text-slate-400">{count} / 4 Beds Occupied</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${count >= 4 ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'}`}>
                {count >= 4 ? 'Full' : 'Available'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hostel Boarders Roll Call Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white">
              Hostel Boarders ({filteredList.length} Students) — {rollCallShift.toUpperCase()} CHECK
            </h2>
          </div>
          <span className="text-xs text-slate-400">Total Enrolled: {hostelStudents.length} / 20 Maximum Capacity</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredList.map((st, index) => {
            const currentStatus = attendanceMap[st.id] || 'present';

            return (
              <div
                key={st.id}
                className="p-4 hover:bg-slate-850/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-950/80 border border-orange-500/30 flex items-center justify-center font-bold text-xs text-orange-300">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white">{st.fullName}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-800 text-orange-300 border border-orange-500/20">
                        {st.hostelRoom || 'Room 101'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {st.className} - {st.section} • Roll #{st.rollNumber} • Parent: {st.parents.fatherName}
                    </p>
                  </div>
                </div>

                {/* 1-Tap Attendance Toggles for Warden */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleMark(st.id, 'present')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentStatus === 'present'
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleMark(st.id, 'absent')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentStatus === 'absent'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Absent / Out
                  </button>
                  <button
                    onClick={() => handleMark(st.id, 'sick')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentStatus === 'sick'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sick Bay
                  </button>

                  <button
                    onClick={() => handleEmergencyCall(st.parents.phone, st.fullName)}
                    className="p-2 bg-slate-800 hover:bg-emerald-950 text-emerald-400 rounded-xl transition-all cursor-pointer"
                    title={`Call Parent: ${st.parents.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
