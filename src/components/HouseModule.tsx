// House System & Inter-House Leaderboard Module for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trophy,
  Users,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { HouseStats, Student, UserProfile } from '../types';

interface HouseModuleProps {
  currentUser: UserProfile | null;
  houses: HouseStats[];
  students: Student[];
  onAwardHousePoints: (houseName: string, category: string, points: number, reason: string) => void;
}

export const HouseModule: React.FC<HouseModuleProps> = ({
  currentUser,
  houses,
  students,
  onAwardHousePoints
}) => {
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState('Sagarmatha');
  const [selectedCategory, setSelectedCategory] = useState<'sports' | 'academic' | 'discipline' | 'cultural' | 'attendance'>('sports');
  const [pointsAmount, setPointsAmount] = useState(25);
  const [reasonInput, setReasonInput] = useState('');
  const [activeHouseFilter, setActiveHouseFilter] = useState<string | null>(null);

  const isAdminOrTeacher = currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'PRINCIPAL' ||
    currentUser?.role === 'TEACHER' ||
    currentUser?.role === 'ACADEMIC_COORDINATOR';

  const handleAwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonInput) return;
    onAwardHousePoints(selectedHouse, selectedCategory, pointsAmount, reasonInput);
    setIsAwardModalOpen(false);
    setReasonInput('');
  };

  const sortedHouses = [...houses].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg font-bold text-white">Inter-House Championship System</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Sungabha 4 Himalayan Houses: Sagarmatha, Annapurna, Machhapuchhre, Gaurishankar
          </p>
        </div>

        {isAdminOrTeacher && (
          <button
            onClick={() => setIsAwardModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Award House Points</span>
          </button>
        )}
      </div>

      {/* 4 House Standings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedHouses.map((h, index) => {
          const houseStudents = students.filter(s => s.house === h.house);
          const isFilterActive = activeHouseFilter === h.house;

          return (
            <div
              key={h.house}
              onClick={() => setActiveHouseFilter(isFilterActive ? null : h.house)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group shadow-xl ${
                isFilterActive
                  ? 'bg-slate-850 ring-2 ring-amber-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ backgroundColor: h.color }}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 rounded-xl" style={{ backgroundColor: `${h.color}20`, color: h.color }}>
                  Rank #{index + 1}
                </span>
                <span className="text-xs text-slate-400">{houseStudents.length} Members</span>
              </div>

              <div className="mt-3">
                <h2 className="text-base font-black text-white flex items-center gap-1.5">
                  🏔️ {h.house}
                </h2>
                <p className="text-[11px] text-slate-400 italic mt-0.5">"{h.motto}"</p>
              </div>

              <div className="mt-4 flex items-baseline justify-between border-t border-slate-800 pt-3">
                <span className="text-2xl font-black text-white">{h.totalPoints}</span>
                <span className="text-xs font-bold" style={{ color: h.color }}>Points</span>
              </div>

              {/* Breakdown Bars */}
              <div className="mt-3 grid grid-cols-5 gap-1 text-[9px] text-center text-slate-400 font-semibold">
                <div className="bg-slate-950 p-1 rounded">
                  <span>🏀 {h.pointsBreakdown.sports}</span>
                </div>
                <div className="bg-slate-950 p-1 rounded">
                  <span>📚 {h.pointsBreakdown.academic}</span>
                </div>
                <div className="bg-slate-950 p-1 rounded">
                  <span>🎖️ {h.pointsBreakdown.discipline}</span>
                </div>
                <div className="bg-slate-950 p-1 rounded">
                  <span>🎭 {h.pointsBreakdown.cultural}</span>
                </div>
                <div className="bg-slate-950 p-1 rounded">
                  <span>📅 {h.pointsBreakdown.attendance}</span>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-400">
                Captain: <span className="text-slate-200 font-semibold">{h.captainName}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* House Member Roster */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            {activeHouseFilter ? `${activeHouseFilter} House Members` : 'All School House Members'}
          </h3>
          <span className="text-xs text-slate-400">
            {students.filter(s => !activeHouseFilter || s.house === activeHouseFilter).length} Students
          </span>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-[400px] overflow-y-auto">
          {students
            .filter(s => !activeHouseFilter || s.house === activeHouseFilter)
            .map((st) => (
              <div key={st.id} className="p-3.5 hover:bg-slate-850/60 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
                    #{st.rollNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{st.fullName}</h4>
                    <p className="text-[11px] text-slate-400">{st.className} — {st.section}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-950 text-amber-300 border border-slate-800">
                  🏔️ {st.house || 'Sagarmatha'}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Award Points Modal */}
      {isAwardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Award House Championship Points
            </h2>

            <form onSubmit={handleAwardSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Select House</label>
                <select
                  value={selectedHouse}
                  onChange={(e) => setSelectedHouse(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                >
                  <option value="Sagarmatha">Sagarmatha House (Red)</option>
                  <option value="Annapurna">Annapurna House (Blue)</option>
                  <option value="Machhapuchhre">Machhapuchhre House (Green)</option>
                  <option value="Gaurishankar">Gaurishankar House (Yellow)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                >
                  <option value="sports">🏀 Inter-House Sports / Athletics</option>
                  <option value="academic">📚 Quiz & Academic Olympiad</option>
                  <option value="discipline">🎖️ Cleanliness & Discipline</option>
                  <option value="cultural">🎭 Dance, Drama & Speech</option>
                  <option value="attendance">📅 100% Section Attendance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Points to Award</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  step={5}
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Reason / Event Name</label>
                <input
                  type="text"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="e.g. 1st Place in Inter-House Science Quiz Competition"
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAwardModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Award Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
