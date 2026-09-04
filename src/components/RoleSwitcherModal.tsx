// 10-Role Authentication & Demo Switcher Modal
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Crown,
  GraduationCap,
  BookOpen,
  UserCheck,
  DollarSign,
  Home,
  Bus,
  User,
  Users,
  KeyRound,
  CheckCircle2,
  LogIn,
  Sparkles,
  Phone,
  Lock
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS, SCHOOL_INFO } from '../data/initialData';

interface RoleSwitcherModalProps {
  isOpen?: boolean;
  currentUser: UserProfile | null;
  onSelectRole?: (user: UserProfile) => void;
  onSelectUser?: (user: UserProfile) => void;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen = true,
  currentUser,
  onSelectRole,
  onSelectUser,
  onClose
}) => {
  const handleSelect = onSelectRole || onSelectUser;
  const [activeTab, setActiveTab] = useState<'demo' | 'login'>('demo');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isOpen === false) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter your registered phone or email');
      return;
    }
    // Check if phone matches any demo user
    const matched = DEMO_USERS.find(u => u.phone === phone || u.email?.toLowerCase() === phone.toLowerCase());
    if (matched) {
      if (handleSelect) handleSelect(matched);
      onClose();
    } else {
      // Create guest session for that role
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        phone,
        fullName: 'Sungabha Staff / Parent',
        role: 'TEACHER'
      };
      if (handleSelect) handleSelect(newUser);
      onClose();
    }
  };

  const roleMeta: Record<UserRole, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; desc: string }> = {
    SUPER_ADMIN: {
      label: 'Super Admin',
      icon: Crown,
      color: 'from-rose-500/20 to-red-600/20 border-rose-500/40 text-rose-300',
      desc: 'Full system control, Excel imports, user management, audit logs'
    },
    PRINCIPAL: {
      label: 'Principal',
      icon: ShieldCheck,
      color: 'from-amber-500/20 to-yellow-600/20 border-amber-500/40 text-amber-300',
      desc: 'Executive school oversight, attendance trends, notices & approval'
    },
    VICE_PRINCIPAL: {
      label: 'Vice Principal',
      icon: ShieldCheck,
      color: 'from-orange-500/20 to-amber-600/20 border-orange-500/40 text-orange-300',
      desc: 'Discipline, daily routines, class monitoring & teacher schedules'
    },
    ACADEMIC_COORDINATOR: {
      label: 'Academic Coordinator',
      icon: BookOpen,
      color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/40 text-purple-300',
      desc: 'Exam analysis, class/subject averages, weak student interventions'
    },
    TEACHER: {
      label: 'Teacher',
      icon: GraduationCap,
      color: 'from-sky-500/20 to-blue-600/20 border-sky-500/40 text-sky-300',
      desc: '1-Tap attendance, homework assignments, marks entry, AI assistant'
    },
    PARENT: {
      label: 'Parent (My Child)',
      icon: Users,
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300',
      desc: 'Child daily attendance, homework due, exam marks, fees, teacher WhatsApp'
    },
    STUDENT: {
      label: 'Student',
      icon: User,
      color: 'from-indigo-500/20 to-violet-600/20 border-indigo-500/40 text-indigo-300',
      desc: 'Digital backpack, timetable, homework submissions, house points, ECA'
    },
    HOSTEL_WARDEN: {
      label: 'Hostel Warden',
      icon: Home,
      color: 'from-orange-500/20 to-amber-600/20 border-orange-500/40 text-orange-300',
      desc: '20 hostel students, morning/evening roll call, room allocations'
    },
    ACCOUNTANT: {
      label: 'Accountant',
      icon: DollarSign,
      color: 'from-teal-500/20 to-emerald-600/20 border-teal-500/40 text-teal-300',
      desc: 'Fee records, payment collection, dues report, receipt generation'
    },
    TRANSPORT_STAFF: {
      label: 'Transport / Bus Staff',
      icon: Bus,
      color: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/40 text-yellow-300',
      desc: 'Bus routes, pickup points, student passenger list, route status'
    },
    ECA_COORDINATOR: {
      label: 'ECA Coordinator',
      icon: Sparkles,
      color: 'from-pink-500/20 to-rose-600/20 border-pink-500/40 text-pink-300',
      desc: 'Sports week, science exhibition, quiz contests & house point allocations'
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 p-0.5 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                SUNGABHA CONNECT Access Portal
              </h2>
              <p className="text-xs text-slate-400">
                {SCHOOL_INFO.nameEn} • {SCHOOL_INFO.certification}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('demo')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'demo'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Instant Role Switcher (1-Click Demo)
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'login'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Phone / Password Login
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'demo' ? (
            <div>
              <div className="bg-sky-950/40 border border-sky-500/20 rounded-2xl p-3 mb-4 text-xs text-sky-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Role-Based Experience Testing:</span> Click on any role card below to instantly view SUNGABHA CONNECT from that user’s customized perspective.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_USERS.map((usr) => {
                  const meta = roleMeta[usr.role] || roleMeta.TEACHER;
                  const Icon = meta.icon;
                  const isCurrent = currentUser?.id === usr.id;

                  return (
                    <button
                      key={usr.id}
                      type="button"
                      onClick={() => {
                        if (handleSelect) handleSelect(usr);
                        onClose();
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-start gap-3 bg-gradient-to-br ${meta.color} ${
                        isCurrent ? 'ring-2 ring-sky-400 shadow-lg' : ''
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-950/60 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs text-white truncate">{usr.fullName}</span>
                          {isCurrent && <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />}
                        </div>
                        <span className="inline-block text-[10px] font-semibold text-slate-300 mt-0.5">
                          {meta.label}
                        </span>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {meta.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-4 max-w-md mx-auto py-4">
              {error && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile Number / Email Address
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9857032269 or user@sungabha.edu.np"
                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <span className="text-[11px] text-slate-500">Default test pin: 1234</span>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact Sungabha Administration: 9857032269 for password resets.'); }} className="text-[11px] text-sky-400 hover:underline">
                    Forgot Password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
              >
                Sign In to Sungabha Connect
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            Helpline: {SCHOOL_INFO.phone}
          </span>
          <span className="text-[11px] text-slate-500">{SCHOOL_INFO.slogan}</span>
        </div>

      </div>
    </div>
  );
};
