import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WATER_QUALITY_DATA } from '../data/initialData';
import { ProblemCategory } from '../types';
import {
  Activity,
  CheckCircle2,
  ShieldCheck,
  X,
  FileCheck,
  Droplet,
  AlertCircle,
  Bot,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Gauge,
  Sliders,
  Calendar,
  MapPin,
  HelpCircle,
  Layers,
  Wrench,
  Check,
  TrendingDown,
  Building2,
  Radio,
  FileText
} from 'lucide-react';

export type MLStatusColor = 'green' | 'orange' | 'red' | 'grey';
export type MLDomain = 'supply' | 'quality' | 'leakage' | 'predictive' | 'complaints';

interface MLScenario {
  id: string;
  domain: MLDomain;
  status: MLStatusColor;
  statusLabel: string;
  problemDetected: string;
  waterSupplyStatus: string;
  waterQualityAssessment: string;
  affectedLocation: string;
  affectedFHTC: string;
  severity: 'Normal' | 'Warning' | 'High' | 'Critical' | 'Unknown';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency' | 'Data Gap';
  recommendedAction: string;
  explanation: string;
  telemetry: {
    tank: { ph: number; turbidityNTU: number; conductivity: number };
    pipeline: { flowRateLpm: number; pressureBar: number };
    tap: { pressureBar: number };
    pressureBar?: number;
    turbidityNTU?: number;
    ph?: number;
    tdsPPM?: number;
    conductivityUS?: number;
  };
  suggestedCategory: ProblemCategory;
  complaintTitle: string;
  complaintDescription: string;
}

const ML_SCENARIOS: MLScenario[] = [
  {
    id: 'red_leak',
    domain: 'leakage',
    status: 'red',
    statusLabel: 'Red — Serious potential issue requiring prompt inspection',
    problemDetected: 'Main Distribution Pipe Fracture & Pressure Collapse',
    waterSupplyStatus: 'Severely Disrupted • 0.38 bar (Normal: 2.4 bar)',
    waterQualityAssessment: 'Safe Mineral Balance (7.25 pH, 280 µS/cm) but Rapid Flow Loss',
    affectedLocation: 'East Mada Street & Kutchery Road, Ward 12, Mylapore Town Panchayat',
    affectedFHTC: 'FHTC Cluster #14-B (38 Household Tap Connections affected)',
    severity: 'Critical',
    priority: 'Emergency',
    recommendedAction: 'Isolate Sector 12 sluice valve immediately. Dispatch emergency field crew to replace cracked 300mm pipe sleeve.',
    explanation: 'Volumetric flow surging (590 L/min) accompanied by sudden pressure collapse from 2.40 bar to 0.38 bar within 4 minutes. Signature matches acute underground pipe fracture.',
    telemetry: {
      tank: { ph: 7.25, turbidityNTU: 0.8, conductivity: 280 },
      pipeline: { flowRateLpm: 590, pressureBar: 0.38 },
      tap: { pressureBar: 0.12 },
      pressureBar: 0.38,
      turbidityNTU: 0.8,
      ph: 7.25,
      tdsPPM: 185,
      conductivityUS: 280
    },
    suggestedCategory: 'Water Leakage',
    complaintTitle: 'Main Water Pipe Fracture & Acute Leakage on East Mada St',
    complaintDescription: 'ML Water Diagnosis identified severe pipeline pressure drop to 0.38 bar (ΔP: -2.02 bar) and tap starvation (0.12 bar). Clean drinking water is escaping from damaged pipe joint. 38 household taps affected.'
  },
  {
    id: 'orange_turbidity',
    domain: 'quality',
    status: 'orange',
    statusLabel: 'Orange — Potential issue requiring attention',
    problemDetected: 'Silt Infiltration & Elevated Turbidity (8.6 NTU)',
    waterSupplyStatus: 'Active Flow • 2.10 bar Pressure',
    waterQualityAssessment: 'Not Potable • Turbidity 8.6 NTU (Acceptable Limit < 1.0 NTU)',
    affectedLocation: 'Mandaveli Sector 4, Ward 13, Mylapore Town Panchayat',
    affectedFHTC: 'FHTC Cluster #09 (45 Household Tap Connections affected)',
    severity: 'Warning',
    priority: 'High',
    recommendedAction: 'Advise residents to boil or filter water. Municipal team must flush trunk line scour valves until turbidity drops below 1.0 NTU.',
    explanation: 'Optical turbidity sensors report sustained 8.6 NTU cloudiness and conductivity spike (610 µS/cm) following morning roadwork. High probability of surface silt intrusion into distribution line.',
    telemetry: {
      tank: { ph: 6.45, turbidityNTU: 8.6, conductivity: 610 },
      pipeline: { flowRateLpm: 410, pressureBar: 2.10 },
      tap: { pressureBar: 1.15 },
      pressureBar: 2.1,
      turbidityNTU: 8.6,
      ph: 6.45,
      tdsPPM: 420,
      conductivityUS: 610
    },
    suggestedCategory: 'Dirty Water',
    complaintTitle: 'Muddy / High Turbidity Tap Water in Mandaveli Sector 4',
    complaintDescription: 'ML Water Diagnosis detected turbidity spike to 8.6 NTU and conductivity 610 µS/cm. Tap water is muddy and discolored due to silt intrusion.'
  },
  {
    id: 'green_normal',
    domain: 'supply',
    status: 'green',
    statusLabel: 'Green — No issue detected in the available data',
    problemDetected: 'No Supply or Quality Anomaly Detected',
    waterSupplyStatus: 'Optimal Functional Supply • 2.45 bar Continuous Flow',
    waterQualityAssessment: 'Normal Parameters • pH 7.28, Turbidity 0.4 NTU, Conductivity 275 µS/cm',
    affectedLocation: 'Alwarpet Residential Grid, Ward 14, Mylapore Town Panchayat',
    affectedFHTC: 'FHTC Cluster #02 (120 Household Tap Connections fully functional)',
    severity: 'Normal',
    priority: 'Low',
    recommendedAction: 'Continue automated IoT monitoring. Routine weekly water sampling scheduled for Thursday.',
    explanation: 'All pressure nodes and water quality parameters conform strictly to CPHEEO and Jal Jeevan Mission benchmarks.',
    telemetry: {
      tank: { ph: 7.28, turbidityNTU: 0.4, conductivity: 275 },
      pipeline: { flowRateLpm: 425, pressureBar: 2.45 },
      tap: { pressureBar: 1.32 },
      pressureBar: 2.45,
      turbidityNTU: 0.4,
      ph: 7.28,
      tdsPPM: 182,
      conductivityUS: 275
    },
    suggestedCategory: 'Other',
    complaintTitle: 'Water Supply Running Normally',
    complaintDescription: 'ML Water Diagnosis confirms normal pressure and water quality standards across all monitored taps.'
  },
  {
    id: 'grey_offline',
    domain: 'predictive',
    status: 'grey',
    statusLabel: 'Grey — Insufficient data for diagnosis',
    problemDetected: 'Telemetry Packet Loss & Gateway Sensor Timeout',
    waterSupplyStatus: 'Unknown / Sensor Heartbeat Missing (> 35 min)',
    waterQualityAssessment: 'Telemetry Incomplete • Insufficient readings for predictive model',
    affectedLocation: 'Panchayat Border Trunk Line, Ward 18 (Remote Node)',
    affectedFHTC: 'FHTC Cluster #28 (18 Household Connections unmonitored)',
    severity: 'Unknown',
    priority: 'Data Gap',
    recommendedAction: 'Dispatch field technician to inspect IoT solar gateway, check 4G SIM connectivity and battery voltage.',
    explanation: 'Model requires at least 12 continuous hourly readings for reliable trend evaluation. Only 2 intermittent packets received in past 6 hours.',
    telemetry: {
      tank: { ph: 7.0, turbidityNTU: 0.0, conductivity: 0 },
      pipeline: { flowRateLpm: 0, pressureBar: 0.0 },
      tap: { pressureBar: 0.0 },
      pressureBar: 0.0,
      turbidityNTU: 0.0,
      ph: 7.0,
      tdsPPM: 0,
      conductivityUS: 0
    },
    suggestedCategory: 'Other Problem',
    complaintTitle: 'IoT Water Sensor Gateway Offline in Ward 18',
    complaintDescription: 'Telemetry packet loss detected by ML monitoring system. Sensor gateway is unresponsive, preventing predictive failure analysis.'
  },
  {
    id: 'red_intermittent',
    domain: 'supply',
    status: 'red',
    statusLabel: 'Red — Serious potential issue requiring prompt inspection',
    problemDetected: 'Severe Intermittent Supply & Non-Functional Taps (FHTC Failure)',
    waterSupplyStatus: 'Zero Flow Collapse • 0.02 bar at Household Terminal Taps',
    waterQualityAssessment: 'No Water Flow Available for Testing',
    affectedLocation: 'South Sector Water Feeder Line, Ward 15',
    affectedFHTC: 'FHTC Cluster #07 (52 Household Tap Connections completely dry)',
    severity: 'Critical',
    priority: 'Emergency',
    recommendedAction: 'Check booster pump #2 at Zonal Pump House. Open auxiliary bypass valve to resume drinking water flow.',
    explanation: 'Pressure collapsed to 0.02 bar across terminal households with zero flow. 52 FHTCs have received zero flow for 8 consecutive hours during scheduled supply batch.',
    telemetry: {
      tank: { ph: 7.2, turbidityNTU: 0.2, conductivity: 220 },
      pipeline: { flowRateLpm: 0, pressureBar: 0.05 },
      tap: { pressureBar: 0.02 },
      pressureBar: 0.02,
      turbidityNTU: 0.2,
      ph: 7.2,
      tdsPPM: 150,
      conductivityUS: 220
    },
    suggestedCategory: 'No Water',
    complaintTitle: 'Total Water Supply Outage (Zero Flow at FHTC Taps)',
    complaintDescription: 'ML Water Diagnosis confirms 52 household tap connections in Cluster #07 have zero pressure (0.02 bar). Terminal taps are completely dry.'
  }
];

export const WaterQualityModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    liveTelemetry,
    currentRole,
    currentUser,
    openReportWithDiagnosis,
    complaints
  } = useApp();

  // Sub-tabs: 'ml_diagnosis' (Default if opened from ML button or tab) vs 'lab_telemetry'
  const [modalTab, setModalTab] = useState<'ml_diagnosis' | 'lab_telemetry'>('ml_diagnosis');

  // Active ML Scenario being analyzed
  const [selectedScenario, setSelectedScenario] = useState<MLScenario>(ML_SCENARIOS[0]);
  const [activeFilterDomain, setActiveFilterDomain] = useState<MLDomain | 'all'>('all');

  if (activeModal !== 'waterQuality' && activeModal !== 'mlWaterDiagnosis') {
    return null;
  }

  const q = WATER_QUALITY_DATA;

  // Parameters for Lab Telemetry tab
  const labParameters = [
    {
      name: 'Water Balance Sensor (pH)',
      value: `${liveTelemetry.ph}`,
      unit: 'pH',
      standard: 'Optimal (6.5 - 8.5)',
      status: 'Live Continuous Monitor',
      safe: true
    },
    {
      name: 'Mineral Sensor (TDS)',
      value: `${liveTelemetry.tdsPPM}`,
      unit: 'ppm',
      standard: 'Safe (Under 500 ppm)',
      status: 'Healthy Mineral Level',
      safe: true
    },
    {
      name: 'Water Temperature Sensor',
      value: `${q.temperatureC ?? 24.6}`,
      unit: '°C',
      standard: 'Optimal (20°C - 28°C)',
      status: 'Fresh & Normal',
      safe: true
    },
    {
      name: 'Pipeline Pressure Sensor',
      value: `${liveTelemetry.pressureBar}`,
      unit: 'bar',
      standard: 'Normal (2.1 - 2.7 bar)',
      status: 'Active Pipeline Flow',
      safe: true
    },
    {
      name: 'Water Clearness (Turbidity Sensor)',
      value: `${q.turbidityNTU}`,
      unit: 'NTU',
      standard: 'Clean (Under 1.0 NTU)',
      status: 'Crystal Clear',
      safe: true
    }
  ];

  // Status Indicator Visual Helpers
  const getStatusBadge = (status: MLStatusColor) => {
    switch (status) {
      case 'green':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
          name: 'Green — No Issue Detected'
        };
      case 'orange':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
          name: 'Orange — Potential Issue Requiring Attention'
        };
      case 'red':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          dot: 'bg-rose-500',
          icon: AlertCircle,
          name: 'Red — Serious Issue Requiring Inspection'
        };
      case 'grey':
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-400',
          icon: HelpCircle,
          name: 'Grey — Insufficient Data for Diagnosis'
        };
    }
  };

  const statusMeta = getStatusBadge(selectedScenario.status);
  const StatusIcon = statusMeta.icon;

  // Filtered Scenarios
  const filteredScenarios = ML_SCENARIOS.filter(
    (s) => activeFilterDomain === 'all' || s.domain === activeFilterDomain
  );

  // "Report This Problem" Handler (Transfers Diagnosis Summary & Opens Complaint Screen)
  const handleReportThisProblem = () => {
    openReportWithDiagnosis({
      category: selectedScenario.suggestedCategory,
      title: selectedScenario.complaintTitle,
      description: `${selectedScenario.complaintDescription}\n\n[ML Water Diagnosis Summary - Jal Jeevan Mission]\n• Problem Detected: ${selectedScenario.problemDetected}\n• Water Supply Status: ${selectedScenario.waterSupplyStatus}\n• Affected Location: ${selectedScenario.affectedLocation}\n• Recommended Action: ${selectedScenario.recommendedAction}`,
      location: selectedScenario.affectedLocation,
      urgency: selectedScenario.priority === 'Emergency' ? 'Emergency' : selectedScenario.priority === 'High' ? 'High' : 'Medium'
    });
  };

  // Timestamp
  const now = new Date();
  const formattedAnalysisTime = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto border border-slate-200">
        {/* Sticky Header with 2 Distinct Tabs */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/20 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">
                    ML Water Diagnosis & Telemetry
                  </h2>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                    Jal Jeevan Mission
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  Rural water supply functionality & FHTC intelligent diagnostic monitoring
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModal('mlStudio')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-cyan-300 hover:bg-slate-800 text-xs font-black transition flex items-center gap-1.5 border border-cyan-500/30 cursor-pointer shadow-xs"
                title="Open Machine Learning Studio & PPT Presentation Deck"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>ML Model & PPT</span>
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* TWO CLEAR TABS: ML Water Diagnosis (JJM) & Certified Lab Telemetry */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => setModalTab('ml_diagnosis')}
              className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                modalTab === 'ml_diagnosis'
                  ? 'bg-white text-cyan-800 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-600" />
              <span>ML Water Diagnosis</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => setModalTab('lab_telemetry')}
              className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                modalTab === 'lab_telemetry'
                  ? 'bg-white text-teal-800 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Certified Lab & Sensor Telemetry</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: ML WATER DIAGNOSIS (JAL JEEVAN MISSION FHTC MONITORING) */}
        {/* ============================================================== */}
        {modalTab === 'ml_diagnosis' && (
          <div className="p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
            {/* JJM National Mission Header Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#04284d] via-[#064275] to-[#01588c] text-white shadow-lg space-y-2.5 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-cyan-300 bg-black/25 px-2.5 py-0.5 rounded-full border border-white/20">
                    Jal Jeevan Mission (JJM) • Har Ghar Jal
                  </span>
                </div>
                <span className="text-[10px] font-bold text-cyan-200 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                  FHTC Monitoring Protocol
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                  Intelligent Tap Functionality & Quality Diagnosis
                </h3>
                <p className="text-xs text-cyan-100/90 mt-1 leading-relaxed">
                  Real-time machine learning monitoring of Functional Household Tap Connections (FHTC). Identifies supply interruptions, leakage patterns, water quality deviations, and predicts maintenance needs.
                </p>
              </div>

              {/* Mode & Live Timestamp Strip */}
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-[10px] text-cyan-200">
                <span className="flex items-center gap-1 font-semibold">
                  <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
                  <span>Mode: Live IoT Stream & Demonstration Simulation</span>
                </span>
                <span className="font-mono">Analysis Time: {formattedAnalysisTime}</span>
              </div>
            </div>

            {/* Mandatory Standardized 4 Status Indicators Banner */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Standardized Prediction Status Indicators:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-bold">
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="truncate">Green (No Issue)</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="truncate">Orange (Attention)</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="truncate">Red (Serious/Inspect)</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="truncate">Grey (Insufficient Data)</span>
                </div>
              </div>
            </div>

            {/* 5 ML Diagnosis Features Domain Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800">
                  Select Diagnosis Feature / Test Scenario:
                </span>
                <span className="text-[10px] text-slate-400 font-medium">5 Core JJM ML Models</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveFilterDomain('all')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    activeFilterDomain === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All Scenarios
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilterDomain('supply')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    activeFilterDomain === 'supply'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white text-cyan-800 border border-cyan-200 hover:bg-cyan-50'
                  }`}
                >
                  🚰 Water Supply
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilterDomain('quality')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    activeFilterDomain === 'quality'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-50'
                  }`}
                >
                  🧪 Water Quality
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilterDomain('leakage')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    activeFilterDomain === 'leakage'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  💧 Leakage Detection
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilterDomain('predictive')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    activeFilterDomain === 'predictive'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-purple-800 border border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  🔮 Predictive Maint.
                </button>
              </div>

              {/* Scenario Cards Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {filteredScenarios.map((sc) => {
                  const isSelected = selectedScenario.id === sc.id;
                  const badge = getStatusBadge(sc.status);

                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSelectedScenario(sc)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-cyan-50/80 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full mt-0.5 shrink-0 ${badge.dot}`} />
                      <div className="min-w-0 flex-1">
                        <span className="font-extrabold text-xs text-slate-900 block truncate">
                          {sc.problemDetected}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {sc.affectedLocation}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================== */}
            {/* 🌟 MAIN PREDICTION RESULTS CARD (REQUIRED DISPLAY ELEMENTS) */}
            {/* ========================================================== */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3.5">
              {/* Status Header */}
              <div className="flex items-start justify-between gap-2.5 flex-wrap">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2.5 rounded-2xl border ${statusMeta.bg} shrink-0`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Prediction Result
                    </span>
                    <h4 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                      {statusMeta.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Condition highlighted with color border */}
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border-2 ${
                      selectedScenario.status === 'red' || selectedScenario.priority === 'Emergency'
                        ? 'bg-rose-50 text-rose-800 border-rose-500'
                        : selectedScenario.status === 'orange' || selectedScenario.priority === 'High'
                        ? 'bg-amber-50 text-amber-900 border-amber-500'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-500'
                    }`}
                  >
                    {selectedScenario.status === 'red' || selectedScenario.priority === 'Emergency'
                      ? 'Very Danger Condition'
                      : selectedScenario.status === 'orange' || selectedScenario.priority === 'High'
                      ? 'Moderate Condition'
                      : 'Low Condition'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Severity: {selectedScenario.severity}
                  </span>
                </div>
              </div>

              {/* Potential Problem Detected */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 block">
                  Potential Problem Detected:
                </span>
                <p className="font-extrabold text-sm text-slate-900">
                  {selectedScenario.problemDetected}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                  {selectedScenario.explanation}
                </p>
              </div>

              {/* Water Supply Status & Water Quality Assessment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200">
                  <span className="text-[10px] uppercase font-bold text-sky-800 block mb-0.5">
                    🚰 Water Supply Status:
                  </span>
                  <span className="font-extrabold text-sky-950 block">
                    {selectedScenario.waterSupplyStatus}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200">
                  <span className="text-[10px] uppercase font-bold text-teal-800 block mb-0.5">
                    🧪 Water Quality Assessment:
                  </span>
                  <span className="font-extrabold text-teal-950 block">
                    {selectedScenario.waterQualityAssessment}
                  </span>
                </div>
              </div>

              {/* Affected Location & FHTC Connection Count */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    📍 Affected Location / Gram Panchayat:
                  </span>
                  <span className="font-bold text-slate-800 block mt-0.5">
                    {selectedScenario.affectedLocation}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-cyan-700 block">
                    Tap Connections (FHTC):
                  </span>
                  <span className="font-bold text-cyan-900 block mt-0.5">
                    {selectedScenario.affectedFHTC}
                  </span>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-amber-900 text-xs uppercase tracking-wide">
                  <Wrench className="w-3.5 h-3.5 text-amber-700" />
                  <span>Recommended Next Steps & Corrective Action:</span>
                </div>
                <p className="leading-relaxed font-medium">
                  {selectedScenario.recommendedAction}
                </p>
              </div>

              {/* Live Project Sensor Telemetry Strip */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Project Sensor Telemetry (Tank • Pipeline • Tap)
                </span>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[9px] sm:text-[10px]">
                  {/* Tank Group */}
                  <div className="p-2 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="font-extrabold uppercase text-slate-700 block truncate">🛢️ Tank</span>
                    <div className="text-slate-600 truncate">
                      pH: <b className="font-mono text-slate-900">{selectedScenario.telemetry.tank?.ph ?? selectedScenario.telemetry.ph}</b>
                    </div>
                    <div className="text-slate-600 truncate">
                      Turb: <b className="font-mono text-slate-900">{selectedScenario.telemetry.tank?.turbidityNTU ?? selectedScenario.telemetry.turbidityNTU}</b>
                    </div>
                    <div className="text-slate-600 truncate">
                      Cond: <b className="font-mono text-slate-900">{selectedScenario.telemetry.tank?.conductivity ?? selectedScenario.telemetry.conductivityUS ?? 280}</b>
                    </div>
                  </div>

                  {/* Pipeline Group */}
                  <div className="p-2 rounded-lg sm:rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-0.5">
                    <span className="font-extrabold uppercase text-blue-900 block truncate">🌐 Pipeline</span>
                    <div className="text-slate-700 truncate">
                      P: <b className="font-mono text-slate-900">{selectedScenario.telemetry.pipeline?.pressureBar ?? selectedScenario.telemetry.pressureBar}b</b>
                    </div>
                    <div className="text-slate-700 truncate">
                      Flow: <b className="font-mono text-slate-900">{selectedScenario.telemetry.pipeline?.flowRateLpm ?? 420}</b>
                    </div>
                    <div className="text-rose-700 font-bold truncate">
                      ΔP: -{Math.max(0, 2.40 - (selectedScenario.telemetry.pipeline?.pressureBar ?? selectedScenario.telemetry.pressureBar ?? 2.40)).toFixed(2)}b
                    </div>
                  </div>

                  {/* Tap Group */}
                  <div className="p-2 rounded-lg sm:rounded-xl bg-teal-50/50 border border-teal-200/80 space-y-0.5">
                    <span className="font-extrabold uppercase text-teal-900 block truncate">🚰 Tap</span>
                    <div className="text-slate-700 truncate">
                      Tap P: <b className="font-mono text-slate-900">{selectedScenario.telemetry.tap?.pressureBar ?? 1.30}b</b>
                    </div>
                    <div className="text-slate-600 truncate">
                      Nom: 1.30b
                    </div>
                    <div className="text-rose-700 font-bold truncate">
                      ΔP: -{Math.max(0, 1.30 - (selectedScenario.telemetry.tap?.pressureBar ?? 1.30)).toFixed(2)}b
                    </div>
                  </div>
                </div>
              </div>

              {/* Mandatory ML Disclaimer (Technical Requirement) */}
              <div className="p-2.5 rounded-xl bg-slate-100 text-[10px] text-slate-500 leading-relaxed border border-slate-200 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <b>Medical & Safety Notice:</b> ML predictions are automated statistical indicators based on sensor telemetry and complaint frequency. They are distinct from physical officer inspections and laboratory chemical assays. Water should not be declared safe for drinking solely on automated readings.
                </span>
              </div>

              {/* ACTION ROW: "REPORT THIS PROBLEM" BUTTON (INTEGRATION WITH COMPLAINT REPORTING) */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 font-medium">
                  Identified issue can be converted directly into an official complaint ticket.
                </div>

                <button
                  type="button"
                  onClick={handleReportThisProblem}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-md shadow-cyan-600/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Report This Problem</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Role-Specific View Strip */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                Role View: {currentRole === 'officer' ? 'Field Officer Portal' : currentRole === 'admin' ? 'Panchayat Administrator' : 'Citizen View'}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {currentRole === 'officer'
                  ? 'As an Officer, you can inspect the above telemetry, verify pipeline integrity on site, and mark resolution upon completing pipe repair.'
                  : currentRole === 'admin'
                  ? 'As an Administrator, you monitor FHTC functional status across all Gram Panchayats and prioritize recurring infrastructure maintenance.'
                  : 'As a Citizen, you can view tap functionality forecasts, follow recommended safety precautions, and submit official complaints.'}
              </p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CERTIFIED LAB QUALITY REPORT & LIVE TELEMETRY SENSORS   */}
        {/* ============================================================== */}
        {modalTab === 'lab_telemetry' && (
          <div className="p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
            {/* Certificate Header Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">
                  IoT Sensor Telemetry • Certified Lab Standards
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SENSORS NORMAL
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white">
                Safe to Drink & Cook
              </h3>
              <p className="text-xs text-teal-100/90 mt-1 leading-relaxed">
                Real-time sensors actively monitor purity, pH balance, and pipeline pressure. All readings comply with health standards.
              </p>
              <div className="mt-3 pt-2.5 border-t border-teal-600/60 text-[10px] text-teal-200">
                Sensor Node: {q.stationName} • {q.testedAt}
              </div>
            </div>

            {/* Test Parameters Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Active Sensor Readings & Water Parameters
              </h4>

              {labParameters.map((param) => (
                <div
                  key={param.name}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      {param.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Standard Limit: {param.standard}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-black text-teal-700 block">
                      {param.value} {param.unit}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" /> {param.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lab Officer Signature Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Certified Water Quality Officer</span>
                <span className="font-bold text-slate-800">{q.labOfficer}</span>
                <span className="block text-[10px] text-slate-500">Government Certified Water Testing Laboratory</span>
              </div>
              <ShieldCheck className="w-8 h-8 text-teal-600 shrink-0" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
