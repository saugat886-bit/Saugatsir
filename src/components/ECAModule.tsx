// Extra-Curricular Activities (ECA), Sports & Events Module for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Award,
  Users,
  Plus,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Medal,
  X
} from 'lucide-react';
import { ECAEvent, Student, UserProfile, HouseStats, HouseType, ECAWinner } from '../types';

interface ECAModuleProps {
  currentUser: UserProfile | null;
  events: ECAEvent[];
  students: Student[];
  houses?: HouseStats[];
  onAddEvent: (newEvent: Omit<ECAEvent, 'id'>) => void;
  onRecordWinner?: (eventId: string, winner: { position: 1 | 2 | 3; studentId?: string; studentName: string; house?: string; points?: number }) => void;
}

export const ECAModule: React.FC<ECAModuleProps> = ({
  currentUser,
  events = [],
  students = [],
  houses = [],
  onAddEvent,
  onRecordWinner
}) => {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<string>('Sports');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [locationInput, setLocationInput] = useState('School Basketball Court');
  const [descInput, setDescInput] = useState('');

  // Winner recording modal state
  const [winnerEvent, setWinnerEvent] = useState<ECAEvent | null>(null);
  const [winnerPosition, setWinnerPosition] = useState<1 | 2 | 3>(1);
  const [winnerStudentName, setWinnerStudentName] = useState('');
  const [winnerHouse, setWinnerHouse] = useState<HouseType>('Sagarmatha');
  const [winnerPoints, setWinnerPoints] = useState<number>(50);

  const isAdminOrTeacher = currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'PRINCIPAL' ||
    currentUser?.role === 'TEACHER' ||
    currentUser?.role === 'ACADEMIC_COORDINATOR';

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    onAddEvent({
      title: titleInput.trim(),
      category: categoryInput,
      date: dateInput,
      location: locationInput.trim(),
      venue: locationInput.trim(),
      description: descInput.trim() || `${categoryInput} inter-house tournament.`,
      status: 'UPCOMING',
      participants: [],
      winners: []
    });
    setIsAddEventOpen(false);
    setTitleInput('');
    setDescInput('');
  };

  const handleRecordWinnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!winnerEvent || !winnerStudentName.trim() || !onRecordWinner) return;

    const matchedStudent = students.find(s => 
      s.fullName.toLowerCase() === winnerStudentName.trim().toLowerCase()
    );

    onRecordWinner(winnerEvent.id, {
      position: winnerPosition,
      studentId: matchedStudent?.id || `st-${Date.now()}`,
      studentName: winnerStudentName.trim(),
      house: winnerHouse,
      points: winnerPoints
    });

    setWinnerEvent(null);
    setWinnerStudentName('');
  };

  const openRecordWinner = (ev: ECAEvent) => {
    setWinnerEvent(ev);
    setWinnerPosition(1);
    setWinnerPoints(50);
    setWinnerHouse('Sagarmatha');
    setWinnerStudentName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border border-teal-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-teal-400" />
            <h1 className="text-lg font-bold text-white">Extra-Curricular Activities & Sports Portal</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Holistic Student Development • Sports, Quiz Olympiad, Music, Science Exhibitions & Scout
          </p>
        </div>

        {isAdminOrTeacher && (
          <button
            onClick={() => setIsAddEventOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create ECA Event</span>
          </button>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => {
          // Robust winners normalization: null-safe fallbacks
          const eventWinners: ECAWinner[] = Array.isArray(ev.winners) && ev.winners.length > 0
            ? ev.winners
            : (Array.isArray(ev.winnerStudentNames) && ev.winnerStudentNames.length > 0
                ? ev.winnerStudentNames.map((name, idx) => ({
                    position: (idx === 0 ? 1 : idx === 1 ? 2 : 3) as 1 | 2 | 3,
                    studentName: name,
                    house: ev.winnerHouse || 'Sagarmatha',
                    points: idx === 0 ? 50 : 30
                  }))
                : []);

          const hasWinners = eventWinners.length > 0;
          const eventLocation = ev.location || ev.venue || 'School Campus';
          const eventStatus = ev.status || (hasWinners ? 'COMPLETED' : 'UPCOMING');

          return (
            <div
              key={ev.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-teal-950 text-teal-300 border border-teal-500/30">
                      {ev.category}
                    </span>
                    <h2 className="text-base font-bold text-white mt-1.5">{ev.title}</h2>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    eventStatus === 'COMPLETED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                  }`}>
                    {eventStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    {ev.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {eventLocation}
                  </span>
                </div>
              </div>

              {/* Winners podium if recorded */}
              {hasWinners ? (
                <div className="pt-3 border-t border-slate-800 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Medal className="w-3.5 h-3.5" />
                      Official Podium Winners
                    </span>
                    {isAdminOrTeacher && onRecordWinner && (
                      <button
                        onClick={() => openRecordWinner(ev)}
                        className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
                      >
                        + Add Winner
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {eventWinners.map(w => (
                      <div key={`${w.position}-${w.studentName}`} className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">
                            {w.position === 1 ? '🥇 1st' : w.position === 2 ? '🥈 2nd' : '🥉 3rd'} {w.studentName}
                          </span>
                          {w.house && (
                            <p className="text-[10px] text-slate-400">House: 🏔️ {w.house}</p>
                          )}
                        </div>
                        {w.points !== undefined && (
                          <span className="text-[11px] font-bold text-amber-300">+{w.points} pts</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500">Winners to be announced post tournament</span>
                  {isAdminOrTeacher && onRecordWinner && (
                    <button
                      onClick={() => openRecordWinner(ev)}
                      className="text-xs text-teal-400 hover:text-teal-300 font-semibold cursor-pointer underline"
                    >
                      Record Winners
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">Create New Extra-Curricular Event</h2>
              <button 
                onClick={() => setIsAddEventOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Annual Inter-House Basketball Championship"
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Category</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                >
                  <option value="Sports">Sports & Athletics</option>
                  <option value="Quiz">Academic & Science Quiz</option>
                  <option value="Debate">English / Nepali Debate</option>
                  <option value="Dance">Cultural Dance & Song</option>
                  <option value="Science Exhibition">Science & Robotics Fair</option>
                  <option value="Scout">Scout Camporee</option>
                  <option value="Music">Music & Instrumental</option>
                  <option value="Yoga & Meditation">Yoga & Meditation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Venue / Location</label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Description / Rules</label>
                <textarea
                  rows={3}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="Participation guidelines, qualifying rounds, house point weights..."
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl p-3 outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-xs font-bold text-slate-950 rounded-xl shadow-lg shadow-teal-500/20 cursor-pointer"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Winner Modal */}
      {winnerEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Medal className="w-4 h-4 text-amber-400" />
                  Record Podium Winner
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{winnerEvent.title}</p>
              </div>
              <button 
                onClick={() => setWinnerEvent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordWinnerSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Podium Position</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setWinnerPosition(1); setWinnerPoints(50); }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      winnerPosition === 1
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    🥇 1st (+50 pts)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setWinnerPosition(2); setWinnerPoints(30); }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      winnerPosition === 2
                        ? 'bg-slate-300/20 text-slate-200 border-slate-400 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    🥈 2nd (+30 pts)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setWinnerPosition(3); setWinnerPoints(20); }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      winnerPosition === 3
                        ? 'bg-amber-700/20 text-amber-500 border-amber-700/50 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    🥉 3rd (+20 pts)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Winner Student Name</label>
                <input
                  type="text"
                  list="students-list"
                  value={winnerStudentName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setWinnerStudentName(val);
                    const matched = students.find(s => s.fullName.toLowerCase() === val.toLowerCase());
                    if (matched && matched.house) {
                      setWinnerHouse(matched.house);
                    }
                  }}
                  placeholder="Type or select student..."
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  required
                />
                <datalist id="students-list">
                  {students.map(s => (
                    <option key={s.id} value={s.fullName}>
                      {s.className}-{s.section} ({s.house || 'No House'})
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">House</label>
                  <select
                    value={winnerHouse}
                    onChange={(e) => setWinnerHouse(e.target.value as HouseType)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  >
                    <option value="Sagarmatha">🏔️ Sagarmatha</option>
                    <option value="Kanchanjunga">🏔️ Kanchanjunga</option>
                    <option value="Gaurishankar">🏔️ Gaurishankar</option>
                    <option value="Machhapuchhre">🏔️ Machhapuchhre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">House Points Awarded</label>
                  <input
                    type="number"
                    value={winnerPoints}
                    onChange={(e) => setWinnerPoints(Number(e.target.value))}
                    min={0}
                    max={200}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWinnerEvent(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Save & Award Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
