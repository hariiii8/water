import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficerRatingsModal } from '../OfficerRatingsModal';
import {
  ShieldCheck,
  Star,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
  Clock,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const {
    currentUser,
    complaints,
    officerRatingSummary,
    setSelectedMapPointId,
    setActiveTab,
    setActiveModal,
    liveTelemetry,
    t
  } = useApp();

  const [showRatingsModal, setShowRatingsModal] = useState(false);

  // 7-Day Complaint Registration Curve Points ending on current date (Today)
  const registrationPoints = useMemo(() => {
    const now = new Date();
    const counts = [4, 6, 3, 8, 5, 2, Math.max(complaints.length, 4)];
    const notes = [
      'Normal weekday citizen filings',
      'Morning feeder pipe leak checks',
      'Routine municipal water reports',
      'Weekly peak complaint filings',
      'Distribution pressure inquiries',
      'Weekend residential reports',
      'Active citizen filings recorded today'
    ];
    const yCoords = [100, 72, 114, 44, 86, 128, 96];

    const pts = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getTime() - (6 - i) * 86400000);
      const isToday = i === 6;
      pts.push({
        day: isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        count: counts[i],
        note: notes[i],
        x: 45 + i * 70,
        y: yCoords[i]
      });
    }
    return pts;
  }, [complaints.length]);

  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(6); // Default to Today
  const activePoint = registrationPoints[selectedPointIndex] || registrationPoints[6];
  const totalWeekly = useMemo(() => registrationPoints.reduce((acc, curr) => acc + curr.count, 0), [registrationPoints]);
  const avgDaily = (totalWeekly / 7).toFixed(1);

  // Latest active alert message dispatched to Officer Rajesh Kumar
  const latestAlert = useMemo(() => {
    return (
      complaints.find(
        (c) =>
          c.status !== 'Resolved' &&
          (c.urgency === 'Emergency' || !!c.sensorData?.alertMessage)
      ) || complaints.find((c) => c.status !== 'Resolved') || complaints[0]
    );
  }, [complaints]);

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 selection:bg-cyan-500 selection:text-white max-w-4xl mx-auto">
      {/* 1. FIELD OFFICER HERO CARD (GORGEOUS LUMINOUS OCEANIC WATERFRONT WITH VIBRANT WATER RIPPLES) */}
      <div className="relative overflow-hidden rounded-[26px] sm:rounded-3xl text-white shadow-2xl bg-gradient-to-br from-[#032347] via-[#054377] to-[#026aa8] border border-cyan-300/40 ring-1 ring-white/20">
        {/* Layer 1: Vibrant Crystal Pure Water Ripple Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/crystal_pure_water_1791899804764.jpg"
            alt="Crystal Pure Water"
            className="w-full h-full object-cover opacity-30 mix-blend-screen filter contrast-150 saturate-150"
            referrerPolicy="no-referrer"
          />
          {/* Fluid Gradient Scrim for crystal clarity */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#031e3d]/90 via-[#053d6d]/70 to-[#026aa8]/40" />
        </div>

        {/* Layer 2: Flowing Fluid Wave Ribbons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full text-cyan-200">
            <path
              d="M0,160 C320,300, 420,40, 740,160 C900,220, 960,100, 1000,120 L1000,300 L0,300 Z"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <path
              d="M0,190 C220,90, 460,260, 680,140 C840,70, 920,180, 1000,140 L1000,300 L0,300 Z"
              fill="currentColor"
              fillOpacity="0.08"
            />
          </svg>
        </div>

        <div className="relative z-10 p-5 sm:p-6 space-y-4">
          {/* Top Bar: Sector Authority & Real-Time Shift Beacon */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/25 text-xs font-semibold text-cyan-100 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-cyan-300 shrink-0 stroke-[2.4]" />
              <span className="font-bold">{t.officerBadge}</span>
              <span className="text-white/40">·</span>
              <span className="text-white font-mono text-[11px]">Zone 9 (Wards 11–18)</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-300/50 text-xs font-bold text-emerald-200 backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>{t.officerOnline}</span>
              <span className="text-emerald-300/60">·</span>
              <span className="font-mono text-[11px]">Morning Shift</span>
            </div>
          </div>

          {/* Profile Details: Clean Typography & Citizen Trust Score Widget */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight drop-shadow-xs truncate">
                  {currentUser?.name || 'Er. Rajesh Kumar'}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 uppercase tracking-wide">
                  Superintendent
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100 font-medium truncate">
                {currentUser?.designation || 'Panchayat Water Officer'} · Mylapore Town Panchayat
              </p>
              <p className="text-[11px] text-slate-300 font-medium truncate">
                Direct Line: +91 98401 23456
              </p>
            </div>

            {/* Clickable Citizen Trust & Reviews Badge */}
            <button
              type="button"
              onClick={() => setShowRatingsModal(true)}
              className="group self-start sm:self-auto bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-amber-400/50 p-3 sm:py-2.5 sm:px-4 rounded-2xl transition-all shadow-md active:scale-95 text-left shrink-0 cursor-pointer"
              title="Click to view Citizen Reviews & Verified Ratings"
            >
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-lg font-black text-amber-300 tracking-tight">
                      {officerRatingSummary.formattedRating}
                    </span>
                    <span className="text-[11px] text-amber-200/80 font-medium">/ 5.0</span>
                  </div>
                  <span className="block text-[10px] text-slate-200 font-semibold group-hover:text-amber-200 transition-colors mt-0.5">
                    {officerRatingSummary.totalRatings} Citizen Ratings
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME LIVE WATER GRID SENSORS & TELEMETRY (TANK, PIPELINE, TAP & ML PREDICTOR) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 text-cyan-700 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 stroke-[2.4] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  Live Water Grid Sensors & Telemetry
                </h2>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Stream
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Real-time telemetry from Storage Reservoir, Underground Feeder Pipeline & Consumer Taps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveModal('mlStudio')}
              className="text-xs font-black text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-cyan-500/40 transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ML Model & PPT</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('waterQuality')}
              className="text-xs font-black text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-xl border border-cyan-200 transition active:scale-95 cursor-pointer"
            >
              Diagnostics
            </button>
          </div>
        </div>

        {/* 3-Tier Sensor Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* TIER 1: STORAGE RESERVOIR TANK SENSORS */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <span>💧</span> Storage Tank Sensors
              </span>
              <span className="text-[10px] font-bold text-cyan-700 font-mono">
                {liveTelemetry.tankLevelPercent}% Level
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">pH Value</span>
                <span className="text-sm font-black text-slate-900 font-mono">{liveTelemetry.tankPh.toFixed(2)}</span>
                <span className="text-[8px] text-emerald-600 font-bold block">Normal</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Turbidity</span>
                <span className="text-sm font-black text-slate-900 font-mono">{liveTelemetry.tankTurbidityNTU.toFixed(2)}</span>
                <span className="text-[8px] text-slate-500 font-bold block">NTU</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Conduct.</span>
                <span className="text-sm font-black text-slate-900 font-mono">{liveTelemetry.tankConductivity}</span>
                <span className="text-[8px] text-slate-500 font-bold block">µS/cm</span>
              </div>
            </div>
          </div>

          {/* TIER 2: UNDERGROUND PIPELINE SENSORS */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <span>🌐</span> Underground Pipeline
              </span>
              <span className="text-[10px] font-bold text-sky-700 font-mono">
                Main Line Feeder
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Line Pressure</span>
                <span className="text-sm font-black text-slate-900 font-mono">{liveTelemetry.pipelinePressureBar.toFixed(2)}</span>
                <span className="text-[8px] text-emerald-600 font-bold block">bar (Nom: 2.40)</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Volumetric Flow</span>
                <span className="text-sm font-black text-slate-900 font-mono">{liveTelemetry.pipelineFlowRateLpm}</span>
                <span className="text-[8px] text-slate-500 font-bold block">L/min</span>
              </div>
            </div>
          </div>

          {/* TIER 3: CONSUMER TAP SENSOR */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <span>🚰</span> Consumer Tap Sensor
              </span>
              <span className="text-[10px] font-bold text-teal-700 font-mono">
                Household Taps
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Delivery Pressure</span>
                <span className="text-[9px] text-emerald-600 font-bold">Standard Gradient</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-900 font-mono">{liveTelemetry.tapPressureBar.toFixed(2)}</span>
                <span className="text-[9px] text-slate-500 font-bold block">bar (Nom: 1.30)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ML Broken Pipe Diagnostic Strip */}
        <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <Sparkles className="w-4 h-4 text-cyan-700 shrink-0" />
            <span className="text-xs text-slate-700 font-medium truncate">
              <b>ML Model Diagnosis:</b> {liveTelemetry.mlBrokenPipeStatus?.message || 'Nominal pressure gradient. Pipeline integrity intact.'}
            </span>
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white text-cyan-800 border border-cyan-200 shadow-2xs shrink-0 font-mono">
            ΔP: {(liveTelemetry.pipelinePressureBar - 2.40).toFixed(2)} bar
          </span>
        </div>
      </div>

      {/* 3. INCOMING WATER ALERT MESSAGE (DISPLAYED DIRECTLY TO OFFICER) */}
      {latestAlert && (
        <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl shadow-red-600/25 border border-red-400/40">
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/20 text-xs font-extrabold uppercase tracking-wider text-rose-100">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="w-2 h-2 rounded-full bg-amber-300 shrink-0" />
              <span>Incoming Citizen Water Alert</span>
            </div>

            <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-0.5 rounded-lg text-white">
              {latestAlert.id}
            </span>
          </div>

          <h2 className="relative z-10 text-base sm:text-lg font-extrabold tracking-tight text-white mb-1.5">
            {latestAlert.title}
          </h2>

          <div className="relative z-10 p-3.5 rounded-2xl bg-black/25 border border-white/20 text-xs text-rose-50 mb-3 leading-relaxed">
            <span className="text-[10px] uppercase font-bold text-amber-300 block mb-1">
              Dispatched Problem Message:
            </span>
            <p className="font-semibold text-xs sm:text-sm text-white">
              {latestAlert.description}
            </p>
          </div>

          <div className="relative z-10 pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-rose-100 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
              <span className="truncate max-w-[240px]">{latestAlert.location}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedMapPointId(latestAlert.id);
                setActiveTab('map');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white text-rose-800 font-bold text-xs hover:bg-rose-50 transition shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <span>View on Map</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* 3. 7-DAY COMPLAINT REGISTRATION ANALYTICS CURVE (MODERATE, ELEGANT PROPORTIONS) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 text-cyan-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                Complaint Registration Trend
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                7-day citizen complaint registration volume curve
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Avg {avgDaily} Complaints / Day</span>
          </div>
        </div>

        {/* Selected Data Point Highlight Strip */}
        <div className="p-3 bg-gradient-to-r from-sky-50 via-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-cyan-800 tracking-wider block">
                {activePoint.day} ({activePoint.date})
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {activePoint.note}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-[10px] text-slate-500 font-semibold">Complaints Filed</span>
            <span className="font-mono font-black text-cyan-800 text-base sm:text-lg">
              {activePoint.count} registered
            </span>
          </div>
        </div>

        {/* Smooth SVG Line / Area Graph */}
        <div className="relative bg-slate-900 rounded-2xl p-3 sm:p-4 text-white overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-cyan-300 font-bold">Complaints Registered (Curve)</span>
            </div>
            <span className="text-[10px] text-slate-400">
              Past 7 Days ({registrationPoints[0]?.date} – {registrationPoints[registrationPoints.length - 1]?.date})
            </span>
          </div>

          <svg viewBox="0 0 500 170" className="w-full h-44 sm:h-52 overflow-visible">
            <defs>
              <linearGradient id="complaintCurveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid guidelines & Values */}
            <g opacity="0.35">
              <line x1="30" y1="44" x2="480" y2="44" stroke="#475569" strokeDasharray="3 3" strokeWidth="0.8" />
              <text x="18" y="47" fill="#94a3b8" fontSize="8" fontWeight="bold">8</text>

              <line x1="30" y1="72" x2="480" y2="72" stroke="#475569" strokeDasharray="3 3" strokeWidth="0.8" />
              <text x="18" y="75" fill="#94a3b8" fontSize="8" fontWeight="bold">6</text>

              <line x1="30" y1="100" x2="480" y2="100" stroke="#475569" strokeDasharray="3 3" strokeWidth="0.8" />
              <text x="18" y="103" fill="#94a3b8" fontSize="8" fontWeight="bold">4</text>

              <line x1="30" y1="128" x2="480" y2="128" stroke="#475569" strokeDasharray="3 3" strokeWidth="0.8" />
              <text x="18" y="131" fill="#94a3b8" fontSize="8" fontWeight="bold">2</text>

              {/* Base Axis Line */}
              <line x1="30" y1="150" x2="480" y2="150" stroke="#64748b" strokeWidth="1" />
              <text x="18" y="153" fill="#94a3b8" fontSize="8" fontWeight="bold">0</text>
            </g>

            {/* Area Gradient Fill */}
            <path
              d="M 45 100 C 80 100, 85 72, 115 72 C 150 72, 155 114, 185 114 C 220 114, 225 44, 255 44 C 290 44, 295 86, 325 86 C 360 86, 365 128, 395 128 C 430 128, 435 100, 465 100 L 465 150 L 45 150 Z"
              fill="url(#complaintCurveGradient)"
            />

            {/* Continuous Smooth Curve Path */}
            <path
              d="M 45 100 C 80 100, 85 72, 115 72 C 150 72, 155 114, 185 114 C 220 114, 225 44, 255 44 C 290 44, 295 86, 325 86 C 360 86, 365 128, 395 128 C 430 128, 435 100, 465 100"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Interactive Data Points along the curve */}
            {registrationPoints.map((pt, idx) => {
              const isSelected = selectedPointIndex === idx;
              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onClick={() => setSelectedPointIndex(idx)}
                >
                  {/* Subtle vertical indicator line on selected point */}
                  {isSelected && (
                    <line
                      x1={pt.x}
                      y1={pt.y}
                      x2={pt.x}
                      y2="150"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                  )}

                  {/* Pulsing ring for selected point */}
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      className="animate-ping"
                    />
                  )}

                  {/* Node point */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? '6.5' : '4.5'}
                    fill={isSelected ? '#38bdf8' : '#ffffff'}
                    stroke="#0284c7"
                    strokeWidth="2.5"
                  />

                  {/* Count label above point */}
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {pt.count}
                  </text>

                  {/* Day Label below axis */}
                  <text
                    x={pt.x}
                    y="164"
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#94a3b8'}
                    fontSize="9.5"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {pt.day}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>Tap any day point to inspect filings</span>
            <span className="text-cyan-300 font-semibold font-mono">Total Weekly Registrations: {totalWeekly}</span>
          </div>
        </div>
      </div>

      {/* Citizen Ratings & Feedback Inspection Modal */}
      <OfficerRatingsModal
        isOpen={showRatingsModal}
        onClose={() => setShowRatingsModal(false)}
      />
    </div>
  );
};
