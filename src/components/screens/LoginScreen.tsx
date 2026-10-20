import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { SAMPLE_USERS } from '../../data/initialData';
import {
  Droplets,
  Eye,
  EyeOff,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle2,
  AlertCircle,
  Wrench
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { setCurrentScreen, loginAsRole, currentUser, updateUserProfile, t } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [userName, setUserName] = useState(currentUser?.name || 'Priya Sharma');
  const [identifier, setIdentifier] = useState('9840123456');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    const sample = SAMPLE_USERS.find((u) => u.role === role);
    if (sample) {
      setIdentifier(role === 'citizen' ? sample.mobile : sample.email);
      setPassword('password123');
      if (role === 'officer') {
        setUserName(sample.name);
      } else {
        setUserName(currentUser?.name || sample.name);
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please type your phone number or email.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const roleToLogin: UserRole = selectedRole;

    const success = loginAsRole(roleToLogin, {
      identifier: identifier.trim(),
      password: password.trim(),
      name: userName.trim() || undefined
    });
    if (!success) {
      setErrorMessage('Details did not match. Please check and try again.');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    handleRoleChange(role);
    loginAsRole(role);
  };

  return (
    <div className="min-h-full bg-white text-slate-900 flex flex-col justify-between p-4 sm:p-6 relative">
      <div className="relative z-10 max-w-md mx-auto w-full">
        {/* Top Back bar */}
        <div className="flex items-center justify-between mb-4 px-0.5">
          <button
            type="button"
            onClick={() => setCurrentScreen('language')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e8f6fd] hover:bg-sky-100 text-[#0284c7] text-xs font-bold border border-[#bae6fd] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Language / Welcome</span>
          </button>
          <span className="text-xs font-semibold text-slate-400">
            AquaCare Portal
          </span>
        </div>

        {/* Top Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#eaf7fd] border-2 border-[#38bdf8] p-0.5 shadow-sm mb-3">
            <Droplets className="w-7 h-7 text-[#0284c7] fill-[#0284c7]/20 stroke-[2.2]" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Welcome Back!
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Sign in to use AquaCare
          </p>
        </div>

        {/* Role Selection (Citizen / Officer) */}
        <div className="mb-4">
          <div className="bg-[#eef5fa] p-1.5 rounded-2xl flex items-center border border-slate-200/80">
            <button
              type="button"
              onClick={() => handleRoleChange('citizen')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                selectedRole === 'citizen'
                  ? 'bg-white text-[#008be3] shadow-xs border border-[#38bdf8] font-extrabold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4 text-[#008be3]" />
              <span>Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('officer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                selectedRole === 'officer'
                  ? 'bg-white text-[#008be3] shadow-xs border border-[#38bdf8] font-extrabold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Officer</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLoginSubmit}
          className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm"
        >
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Identifier field */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Phone Number or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="9840123456"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#008be3] focus:ring-2 focus:ring-sky-500/20 transition"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-xs text-[#008be3] hover:text-sky-700 font-bold transition cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#008be3] focus:ring-2 focus:ring-sky-500/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#008be3] hover:bg-[#007bcc] text-white font-black text-sm shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Demo Accounts Quick-Bar */}
        <div className="mt-4 p-4 rounded-2xl bg-[#f0f9ff] border border-[#bae6fd] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0369a1]">
            <Info className="w-4 h-4 text-[#0284c7] shrink-0" />
            <span>Try with a Sample Account (Tap to Test):</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('citizen')}
              className="py-2.5 px-3 bg-white hover:bg-sky-50 text-slate-800 rounded-xl text-xs font-bold border border-[#bae6fd] flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#008be3] fill-[#008be3]/20" />
              <span>Citizen (Priya)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('officer')}
              className="py-2.5 px-3 bg-white hover:bg-sky-50 text-slate-800 rounded-xl text-xs font-bold border border-[#bae6fd] flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-[#008be3]" />
              <span>Officer (Rajesh)</span>
            </button>
          </div>
        </div>

        {/* Citizen Registration Link */}
        <div className="mt-4 text-center space-y-2">
          <button
            type="button"
            onClick={() => setCurrentScreen('register')}
            className="w-full py-2.5 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200 flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
          >
            <span>✨ New Citizen? Register with Grampanchayath Address</span>
          </button>
          <p className="text-xs text-slate-500 font-medium">
            Cascading State → District → Village → Grampanchayath selection
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Reset Your AquaCare Password
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your registered mobile or email to receive an OTP verification code.
            </p>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 mb-4 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Reset OTP sent to your registered contact number!</span>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Mobile number or Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 mb-4 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setForgotSuccess(false);
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
              {!forgotSuccess && (
                <button
                  type="button"
                  onClick={() => setForgotSuccess(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Send OTP
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
