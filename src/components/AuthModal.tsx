import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  School, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  auth, 
  db, 
  signInWithPopup, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  getDoc
} from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('TEACHER');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!email.trim() || !password.trim() || !fullName.trim()) {
          throw new Error('Please fill in all required fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCred.user;

        const profile: UserProfile = {
          id: user.uid,
          email: user.email || email,
          fullName: fullName.trim(),
          phone: '9847000000',
          role: role,
          avatarUrl: user.photoURL || undefined
        };

        // Save to Firestore
        try {
          await setDoc(doc(db, 'users', user.uid), profile);
        } catch (dbErr) {
          console.warn('Firestore profile write warning:', dbErr);
        }

        onSuccess(profile);
        onClose();
      } else {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter email and password.');
        }

        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = userCred.user;

        // Fetch existing profile or create fallback
        let profile: UserProfile = {
          id: user.uid,
          email: user.email || email,
          fullName: user.displayName || email.split('@')[0] || 'Sungabha Staff',
          phone: '9847000000',
          role: 'TEACHER',
          avatarUrl: user.photoURL || undefined
        };

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            profile = { ...profile, ...(userDoc.data() as Partial<UserProfile>) };
          }
        } catch (dbErr) {
          console.warn('Could not fetch user document:', dbErr);
        }

        onSuccess(profile);
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please try again.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please log in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let profile: UserProfile = {
        id: user.uid,
        email: user.email || '',
        fullName: user.displayName || 'Teacher',
        phone: '9847000000',
        role: 'TEACHER',
        avatarUrl: user.photoURL || undefined
      };

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          profile = { ...profile, ...(userDoc.data() as Partial<UserProfile>) };
        } else {
          await setDoc(doc(db, 'users', user.uid), profile);
        }
      } catch (dbErr) {
        console.warn('Firestore profile check warning:', dbErr);
      }

      onSuccess(profile);
      onClose();
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login Helper for Testing
  const handleQuickDemoLogin = (demoRole: UserRole) => {
    const found = DEMO_USERS.find(u => u.role === demoRole) || DEMO_USERS[0];
    onSuccess(found);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative ambient gradients */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Sungabha Connect Cloud
                </span>
                <h2 className="text-lg font-black text-white">
                  {isSignUp ? 'Create School Account' : 'Staff & Parent Login'}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-400">
            {isSignUp 
              ? 'Register to sync student records, attendance, and routines.'
              : 'Sign in to access your Sungabha portal according to your designated role.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 relative z-10 max-h-[75vh] overflow-y-auto">
          
          {error && (
            <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-800 text-white rounded-2xl border border-slate-700 text-xs font-bold transition-all hover:border-slate-600 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">or with email</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                    <span>Full Name / Teacher Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bikash Thapa"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Role</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="TEACHER">Teacher</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="ACADEMIC_COORDINATOR">Academic Coordinator</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="HOSTEL_WARDEN">Hostel Warden</option>
                    <option value="TRANSPORT_STAFF">Transport Staff</option>
                    <option value="PARENT">Parent</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="teacher@sungabha.edu.np"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-sky-500/25 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
            >
              {isSignUp 
                ? 'Already have an account? Sign In here' 
                : "Don't have an account yet? Register here"}
            </button>
          </div>

          {/* Quick Demo Login Option */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Preview Logins
              </span>
              <span>1-Click Test</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('SUPER_ADMIN')}
                className="px-2.5 py-1.5 bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 rounded-xl text-[11px] font-bold transition-all cursor-pointer truncate"
              >
                Login as Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('TEACHER')}
                className="px-2.5 py-1.5 bg-sky-950/50 hover:bg-sky-900/60 border border-sky-700/50 text-sky-300 rounded-xl text-[11px] font-bold transition-all cursor-pointer truncate"
              >
                Login as Teacher
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
