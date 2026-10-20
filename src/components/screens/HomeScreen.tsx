import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProblemCategory } from '../../types';
import {
  Radio,
  Clock,
  MapPin,
  ArrowRight,
  Droplets,
  PhoneCall,
  ShieldCheck,
  Star,
  Wrench,
  Gauge,
  Activity,
  Sparkles
} from 'lucide-react';

interface HomeScreenProps {
  onReportClick: (category?: ProblemCategory) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onReportClick }) => {
  const {
    currentUser,
    currentRole,
    announcements,
    complaints,
    setActiveTab,
    setActiveModal,
    setSelectedMapPointId,
    officerRatingSummary,
    liveTelemetry,
    t
  } = useApp();

  // Citizen Privacy: Strictly only complaints submitted by this citizen!
  const myComplaints = complaints.filter((c) => {
    if (currentRole === 'officer') return c.assignedOfficerId === currentUser?.id;
    if (currentRole === 'admin') return true;
    return (
      (currentUser?.id && c.userId === currentUser.id) ||
      (currentUser?.mobile && c.userMobile === currentUser.mobile) ||
      (currentUser?.name && c.userName && c.userName.toLowerCase() === currentUser.name.toLowerCase())
    );
  });

  const activeComplaints = myComplaints.filter(
    (c) => c.status !== 'Resolved' && c.status !== 'Rejected'
  );
  const activeComplaintsCount = activeComplaints.length;

  const resolvedComplaintsCount = myComplaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 selection:bg-cyan-500 selection:text-white">
      {/* 1. HERO WATER CARD - SPACIOUS & MOBILE OPTIMIZED */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl text-white shadow-xl shadow-sky-950/20 bg-gradient-to-br from-[#023769] via-[#025a90] to-[#017fad] border border-cyan-300/35 ring-1 ring-white/20">
        {/* Natural Crystal Pure Water Texture Backdrop */}
        <img
          src="/images/crystal_pure_water_1791899804764.jpg"
          alt="Clean Municipal Water"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen filter contrast-125 saturate-150"
          referrerPolicy="no-referrer"
        />

        {/* Crisp Gradient Scrim for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#022f57]/85 via-[#024a7a]/60 to-transparent" />

        <div className="relative z-10 p-3.5 sm:p-6 md:p-7 space-y-3 sm:space-y-5">
          {/* Frosted Citizen Greeting Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-5 border border-white/20 shadow-xs space-y-1.5 sm:space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl bg-white/15 backdrop-blur-md text-[11px] sm:text-xs font-semibold tracking-wide text-cyan-100 border border-white/25 shadow-xs">
              <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-300 shrink-0" />
              <span className="truncate">
                {currentUser?.village && currentUser?.gramPanchayat
                  ? `${currentUser.village} · ${currentUser.gramPanchayat} (${currentUser.district || ''})`
                  : currentUser?.panchayat
                  ? `${currentUser.panchayat} · ${currentUser.ward}`
                  : (currentUser?.ward || 'Smart Water Management')}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-xs">
              {t.hello}, {currentUser?.name?.split(' ')[0] || 'Citizen'}! 👋
            </h2>
            {currentUser?.address && (
              <p className="text-[11px] sm:text-xs text-cyan-100 font-medium line-clamp-1">
                📍 {currentUser.address}
              </p>
            )}
            <p className="text-sky-100 text-[11px] sm:text-sm font-medium leading-relaxed max-w-lg">
              {t.howCanWeHelp}
            </p>
          </div>

          {/* Real-time Ward Supply Status Ribbon - 3 Columns on Mobile (Un-cramped side-by-side) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 text-xs">
            {/* Box 1: Supply State */}
            <div className="bg-white/14 backdrop-blur-md p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-white/25 shadow-xs hover:bg-white/18 transition-colors flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/25 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-inner">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse" />
              </div>
              <div className="min-w-0 w-full">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-cyan-200/90 block truncate">Supply</span>
                <span className="font-extrabold text-white text-[11px] sm:text-xs leading-tight block truncate">Active</span>
              </div>
            </div>

            {/* Box 2: Next Distribution */}
            <div className="bg-white/14 backdrop-blur-md p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-white/25 shadow-xs hover:bg-white/18 transition-colors flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-cyan-500/25 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-inner text-cyan-200">
                <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0 w-full">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-cyan-200/90 block truncate">Next Batch</span>
                <span className="font-extrabold text-white text-[11px] sm:text-xs leading-tight block truncate font-mono">05:30 PM</span>
              </div>
            </div>

            {/* Box 3: Main Line Pressure */}
            <div className="bg-white/14 backdrop-blur-md p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-white/25 shadow-xs hover:bg-white/18 transition-colors flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-sky-500/25 border border-sky-400/40 flex items-center justify-center shrink-0 shadow-inner text-sky-200">
                <Gauge className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0 w-full">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-cyan-200/90 block truncate">Pressure</span>
                <span className="font-extrabold text-white text-[11px] sm:text-xs leading-tight block truncate font-mono">2.40 Bar</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 2. REAL-TIME LIVE WATER STATUS (TANK, PIPELINE, TAP & LEAK CHECK) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-3.5 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-black text-slate-900">
                  Live Water Status in Your Area
                </h3>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                Live automatic checks from Water Tank, Main Pipe & House Taps
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('waterQuality')}
            className="text-[11px] font-black text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-xl border border-cyan-200 transition active:scale-95 cursor-pointer shrink-0"
          >
            Water Test
          </button>
        </div>

        {/* 3 Sensor Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* TIER 1: STORAGE TANK */}
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <span>💧</span> Water Tank
              </span>
              <span className="text-[9px] font-bold text-cyan-700 font-mono">
                {liveTelemetry.tankLevelPercent}% Full
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">pH (Acid/Base)</span>
                <span className="text-xs font-black text-slate-800 font-mono">{liveTelemetry.tankPh.toFixed(2)}</span>
                <span className="text-[7px] text-emerald-600 font-bold block">Safe</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Clearness</span>
                <span className="text-xs font-black text-slate-800 font-mono">{liveTelemetry.tankTurbidityNTU.toFixed(2)}</span>
                <span className="text-[7px] text-emerald-600 font-bold block">Clean</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Minerals</span>
                <span className="text-xs font-black text-slate-800 font-mono">{liveTelemetry.tankConductivity}</span>
                <span className="text-[7px] text-slate-500 font-bold block">Good</span>
              </div>
            </div>
          </div>

          {/* TIER 2: MAIN WATER PIPE */}
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <span>🌐</span> Main Pipe
              </span>
              <span className="text-[9px] font-bold text-sky-700 font-mono">
                Main Line
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-center">
              <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Pipe Pressure</span>
                <span className="text-xs font-black text-slate-800 font-mono">{liveTelemetry.pipelinePressureBar.toFixed(2)}</span>
                <span className="text-[7px] text-emerald-600 font-bold block">Normal Flow</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Water Flow</span>
                <span className="text-xs font-black text-slate-800 font-mono">{liveTelemetry.pipelineFlowRateLpm}</span>
                <span className="text-[7px] text-slate-500 font-bold block">Liters/min</span>
              </div>
            </div>
          </div>

          {/* TIER 3: HOME TAP WATER */}
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <span>🚰</span> Home Tap Water
              </span>
              <span className="text-[9px] font-bold text-teal-700 font-mono">
                At Your House
              </span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Tap Pressure</span>
                <span className="text-[9px] text-emerald-600 font-bold">Good Water Flow</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-slate-900 font-mono">{liveTelemetry.tapPressureBar.toFixed(2)}</span>
                <span className="text-[9px] text-slate-500 font-bold block">Bar (Normal)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Pipe Check Status Strip */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-sky-50 border border-cyan-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
            <span className="text-[11px] text-slate-700 font-medium truncate">
              <b>Smart Leak Check:</b> {liveTelemetry.mlBrokenPipeStatus?.message || 'Water flow and pipe pressure are normal. No leaks found.'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-cyan-800 border border-cyan-200 font-mono">
              Pipe Status: Normal
            </span>
            <button
              type="button"
              onClick={() => setActiveModal('mlStudio')}
              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span>Smart Leak Checker</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. PROMINENT & BEAUTIFUL: REPORT A WATER PROBLEM BOX */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onReportClick()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onReportClick();
          }
        }}
        className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 text-white shadow-xl shadow-cyan-600/25 border border-cyan-300/40 hover:shadow-2xl hover:shadow-cyan-600/35 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Structured Icon Box */}
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Droplets className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 text-cyan-100 px-2.5 py-0.5 rounded-lg border border-white/25">
                  Water Help Desk
                </span>
                <span className="text-[10px] font-bold text-cyan-200 hidden sm:inline-block">
                  · Local Lineman Support
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-cyan-100 transition-colors">
                {t.reportProblemBtn}
              </h3>
              <p className="text-xs sm:text-sm text-cyan-100 font-medium mt-0.5 leading-relaxed">
                {t.reportCtaSubtitle}
              </p>
            </div>
          </div>

          {/* Action Box */}
          <div className="w-11 h-11 rounded-2xl bg-white text-cyan-800 flex items-center justify-center shrink-0 shadow-md group-hover:translate-x-1 group-hover:bg-cyan-50 transition-all duration-300 border border-white/50">
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* 4. SENSOR WATER ALERT (OFFICER PRIORITY DISPATCH) */}
      {currentRole === 'officer' && (
        <div
          onClick={() => {
            setSelectedMapPointId('pt_damaged_pipe_1');
            setActiveTab('map');
          }}
          className="cursor-pointer group relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 text-white shadow-xl shadow-rose-600/25 border border-rose-400/40 hover:shadow-2xl transition-all duration-300 transform active:scale-[0.99]"
        >
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/25 backdrop-blur-md border border-white/20 text-xs font-extrabold uppercase tracking-wider text-rose-100">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
              <span>{t.emergencyWaterAlert}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-100 bg-white/15 px-3 py-1 rounded-xl border border-white/20 backdrop-blur-sm group-hover:bg-white group-hover:text-rose-700 transition">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.liveOnMap}</span>
            </div>
          </div>

          <h3 className="relative z-10 text-lg sm:text-xl font-extrabold tracking-tight text-white mb-1.5">
            {t.emergencyPipeTitle}
          </h3>

          <p className="relative z-10 text-xs sm:text-sm text-rose-50/95 leading-relaxed mb-4 font-medium">
            {t.emergencyPipeMsg}
          </p>

          <div className="relative z-10 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-100 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{t.workersOnSiteTime}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-extrabold bg-white text-rose-700 px-4 py-2 rounded-xl shadow-md group-hover:bg-rose-50 transition-all">
              <span>{t.viewOnMap}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>
      )}

      {/* 5. THREE CORE WATER SERVICES - SIMPLE & CLEAR */}
      <div className="space-y-4">
        {/* Section Header with Bulletins Button Box */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 shadow-xs shadow-cyan-600/50" />
              <h3 className="text-xs uppercase font-black tracking-wider text-slate-800">
                {t.quickWaterServices}
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-800 border border-cyan-200">
                Quick Services
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Water timings, area map, and complaint status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('notifications')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-600" />
            <span>Notices ({announcements.length})</span>
          </button>
        </div>

        {/* 3 Quick Water Services Boxes - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* CARD 1: WATER SUPPLY SCHEDULE BOX */}
          <button
            type="button"
            onClick={() => setActiveModal('waterSupply')}
            className="group relative overflow-hidden p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-sky-50/60 to-cyan-50/40 border border-sky-100/90 hover:border-sky-400/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left flex flex-col justify-between cursor-pointer active:scale-[0.985]"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 border border-sky-400/30">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-lg border border-sky-200/80">
                    Distribution
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-sky-100 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 flex items-center justify-center text-slate-400 shadow-2xs transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-sky-800 transition-colors">
                  {t.cardWaterSupply || 'Water Supply Timings'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal line-clamp-2">
                  Morning & evening drinking water timings and emergency tanker booking.
                </p>
              </div>
            </div>

            {/* Inset Live Data Box Strip */}
            <div className="mt-3 p-2 sm:p-2.5 rounded-xl bg-white/90 border border-sky-100/90 shadow-2xs flex flex-wrap items-center justify-between gap-1.5 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-700 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>On Time Today</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-sky-900 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200 shadow-2xs font-mono">
                05:30 AM – 08:30 AM
              </span>
            </div>
          </button>

          {/* CARD 2: WATER MAP & TANKS */}
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className="group relative overflow-hidden p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-blue-50/60 to-indigo-50/40 border border-blue-100/90 hover:border-blue-400/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left flex flex-col justify-between cursor-pointer active:scale-[0.985]"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-600/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 border border-blue-400/30">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-lg border border-blue-200/80">
                    Area Map
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 flex items-center justify-center text-slate-400 shadow-2xs transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-800 transition-colors">
                  Water Map & Tanks
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal line-clamp-2">
                  See water tanks, supply lines, public taps, and repair spots near your home.
                </p>
              </div>
            </div>

            {/* Inset Live Data Box Strip */}
            <div className="mt-3 p-2 sm:p-2.5 rounded-xl bg-white/90 border border-blue-100/90 shadow-2xs flex flex-wrap items-center justify-between gap-1.5 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-blue-700 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>All Areas Monitored</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 shadow-2xs">
                Live Map
              </span>
            </div>
          </button>

          {/* CARD 3: MY COMPLAINTS & STATUS */}
          <button
            type="button"
            onClick={() => setActiveTab('complaints')}
            className="group relative overflow-hidden p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-amber-50/60 to-yellow-50/40 border border-amber-100/90 hover:border-amber-400/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left flex flex-col justify-between cursor-pointer active:scale-[0.985]"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 border border-amber-300/40">
                  <Wrench className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-200/80">
                    {currentRole === 'officer' ? 'Field Tasks' : 'My Status'}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-amber-100 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-500 flex items-center justify-center text-slate-400 shadow-2xs transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-amber-800 transition-colors">
                  {currentRole === 'officer' ? 'Assigned Field Tasks' : 'My Complaints & Status'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal line-clamp-2">
                  {currentRole === 'officer'
                    ? 'Check assigned complaints and update site repair work.'
                    : 'Check your complaint status, which lineman is coming, and repair updates.'}
                </p>
              </div>
            </div>

            {/* Inset Live Data Box Strip */}
            <div className="mt-3 p-2 sm:p-2.5 rounded-xl bg-white/90 border border-amber-100/90 shadow-2xs flex flex-wrap items-center justify-between gap-1.5 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{activeComplaintsCount} Active</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                {resolvedComplaintsCount} Fixed
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 6. DEDICATED WARD WATER OFFICER / LINEMAN BOX */}
      <div className="p-4.5 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Your Local Water Officer / Lineman
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-700 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Available Today</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Lineman Insignia Box */}
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-500 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0 border border-cyan-400/30">
              <span>RK</span>
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-base text-slate-900 truncate">
                Rajesh Kumar
              </h4>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                Water Lineman / Officer · In-charge of Your Area
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80 shadow-2xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black text-slate-800">
                    {officerRatingSummary.formattedRating}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  · {officerRatingSummary.totalRatings} Citizen Reviews
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Button Box */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="tel:+919876543210"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm shadow-cyan-600/20 transition active:scale-95 border border-cyan-500"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Lineman</span>
            </a>
          </div>
        </div>
      </div>


      {/* 8. PUBLIC WATER ADVISORY BANNER BOX */}
      {announcements.length > 0 && (
        <div className="p-4.5 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 border border-cyan-200/90 flex items-start gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-cyan-500">
            <Radio className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900 truncate">
                {announcements[0].title}
              </span>
              <span className="text-[11px] font-semibold text-cyan-900 bg-white/80 px-2.5 py-0.5 rounded-lg border border-cyan-200/80 shrink-0 shadow-2xs">
                {announcements[0].publishedAt}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {announcements[0].content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

