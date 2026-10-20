import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MLModelSummary, MLPPTSlide, ProblemCategory } from '../types';
import fallbackMetadata from '../data/ml_model_metadata.json';
import {
  Cpu,
  Sparkles,
  Sliders,
  BarChart3,
  Presentation,
  Copy,
  Check,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  X,
  Droplets,
  Gauge,
  Flame,
  ArrowRight,
  TrendingDown,
  Activity,
  Layers,
  ChevronRight,
  Database,
  Binary,
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';

export const MLStudioModal: React.FC = () => {
  const { activeModal, setActiveModal, liveTelemetry, openReportWithDiagnosis } = useApp();

  const [activeTab, setActiveTab] = useState<'workbench' | 'architecture' | 'ppt'>('workbench');
  const [modelSummary, setModelSummary] = useState<MLModelSummary>(fallbackMetadata as unknown as MLModelSummary);
  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [copiedSlideIndex, setCopiedSlideIndex] = useState<number | null>(null);
  const [copiedAllDeck, setCopiedAllDeck] = useState(false);

  // Live Workbench Interactive Slider States (initialized from liveTelemetry)
  const [pipelinePressure, setPipelinePressure] = useState<number>(liveTelemetry.pipelinePressureBar || 2.40);
  const [tapPressure, setTapPressure] = useState<number>(liveTelemetry.tapPressureBar || 1.30);
  const [pipelineFlow, setPipelineFlow] = useState<number>(liveTelemetry.pipelineFlowRateLpm || 420);
  const [tankTurbidity, setTankTurbidity] = useState<number>(liveTelemetry.tankTurbidityNTU || 0.45);
  const [tankPh, setTankPh] = useState<number>(liveTelemetry.tankPh || 7.25);
  const [tankConductivity, setTankConductivity] = useState<number>(liveTelemetry.tankConductivity || 310);

  // Workbench Inference Output State
  const [prediction, setPrediction] = useState<any>(null);
  const [isInferencing, setIsInferencing] = useState(false);

  // Fetch model metadata on open
  useEffect(() => {
    if (activeModal === 'mlStudio') {
      fetch('/api/ml/model-info')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.summary) {
            setModelSummary(data.summary);
          }
        })
        .catch((err) => console.warn('Could not fetch server model-info:', err));
    }
  }, [activeModal]);

  // Synchronize when opening workbench with live telemetry
  useEffect(() => {
    if (activeModal === 'mlStudio') {
      setPipelinePressure(liveTelemetry.pipelinePressureBar);
      setTapPressure(liveTelemetry.tapPressureBar);
      setPipelineFlow(liveTelemetry.pipelineFlowRateLpm);
      setTankTurbidity(liveTelemetry.tankTurbidityNTU);
      setTankPh(liveTelemetry.tankPh);
      setTankConductivity(liveTelemetry.tankConductivity);
    }
  }, [activeModal, liveTelemetry]);

  // Run live inference whenever sliders change
  useEffect(() => {
    if (activeModal !== 'mlStudio') return;

    let isMounted = true;
    setIsInferencing(true);

    const timer = setTimeout(() => {
      fetch('/api/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipelinePressureBar: pipelinePressure,
          tapPressureBar: tapPressure,
          pipelineFlowRateLpm: pipelineFlow,
          tankTurbidityNTU: tankTurbidity,
          tankPh: tankPh,
          tankConductivity: tankConductivity
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.success && data.prediction) {
            setPrediction(data.prediction);
          }
        })
        .catch((err) => {
          console.warn('Inference error:', err);
        })
        .finally(() => {
          if (isMounted) setIsInferencing(false);
        });
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [pipelinePressure, tapPressure, pipelineFlow, tankTurbidity, tankPh, tankConductivity, activeModal]);

  if (activeModal !== 'mlStudio') return null;

  // Presets for quick testing
  const handleApplyPreset = (type: 'burst' | 'turbidity' | 'normal' | 'pump_fail' | 'throttling') => {
    switch (type) {
      case 'burst':
        setPipelinePressure(0.85);
        setTapPressure(0.18);
        setPipelineFlow(580);
        setTankTurbidity(0.6);
        setTankPh(7.20);
        setTankConductivity(290);
        break;
      case 'turbidity':
        setPipelinePressure(2.20);
        setTapPressure(1.25);
        setPipelineFlow(410);
        setTankTurbidity(7.8);
        setTankPh(6.40);
        setTankConductivity(790);
        break;
      case 'normal':
        setPipelinePressure(2.40);
        setTapPressure(1.30);
        setPipelineFlow(420);
        setTankTurbidity(0.40);
        setTankPh(7.28);
        setTankConductivity(285);
        break;
      case 'pump_fail':
        setPipelinePressure(0.04);
        setTapPressure(0.0);
        setPipelineFlow(0);
        setTankTurbidity(0.5);
        setTankPh(7.2);
        setTankConductivity(300);
        break;
      case 'throttling':
        setPipelinePressure(2.35);
        setTapPressure(0.40);
        setPipelineFlow(240);
        setTankTurbidity(0.5);
        setTankPh(7.2);
        setTankConductivity(310);
        break;
    }
  };

  // Retrain Trigger
  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const res = await fetch('/api/ml/retrain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samples: 2400 })
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setModelSummary(data.summary);
      }
    } catch (e) {
      console.error('Retrain error:', e);
    } finally {
      setRetraining(false);
    }
  };

  // Copy Single Slide Text
  const handleCopySlide = (slide: MLPPTSlide, index: number) => {
    const text = `### ${slide.title}\n\n` + slide.bullets.map((b) => `• ${b}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedSlideIndex(index);
    setTimeout(() => setCopiedSlideIndex(null), 2000);
  };

  // Copy Full PPT Deck Markdown
  const handleCopyAllSlides = () => {
    const deckText = (modelSummary.pptSlideSummary || [])
      .map(
        (s, idx) =>
          `========================================\nSLIDE ${idx + 1}: ${s.title}\n========================================\n\n` +
          s.bullets.map((b) => `• ${b}`).join('\n') +
          `\n\n`
      )
      .join('\n');

    navigator.clipboard.writeText(deckText);
    setCopiedAllDeck(true);
    setTimeout(() => setCopiedAllDeck(false), 2500);
  };

  // Forward Diagnosis into Citizen Complaint
  const handleReportFromDiagnosis = () => {
    if (!prediction) return;

    let cat: ProblemCategory = 'Water Leakage';
    if (prediction.classIndex === 1 || prediction.classIndex === 2) cat = 'Water Leakage';
    else if (prediction.classIndex === 3) cat = 'Dirty Water';
    else if (prediction.classIndex === 4) cat = 'No Water';
    else if (prediction.classIndex === 5) cat = 'Slow Water Flow';
    else cat = 'Other Problem';

    openReportWithDiagnosis({
      category: cat,
      title: `${prediction.predictedClass} flagged by ML Diagnosis`,
      description: `${prediction.explanation}\n\n[XGBoost ML Diagnostic Attribution]\n• Model Confidence: ${prediction.confidence}%\n• Broken Pipe Probability: ${prediction.brokenPipeProbability}%\n• Pipeline Pressure: ${pipelinePressure.toFixed(2)} bar (ΔP: -${prediction.calculatedMetrics?.deltaPipelinePressure} bar)\n• Consumer Tap Pressure: ${tapPressure.toFixed(2)} bar\n• Flow Rate: ${pipelineFlow} L/min\n• Recommended Action: ${prediction.recommendedAction}`,
      location: 'Ward 12 Municipal Distribution Sector',
      urgency: prediction.isBrokenPipePredicted || prediction.classIndex === 1 ? 'Emergency' : 'High'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl relative my-auto border border-cyan-500/30 flex flex-col">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-lg px-4 sm:px-6 py-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/25 shrink-0">
                <Cpu className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                    Machine Learning Water Diagnosis Studio
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                    XGBoost GBDT v{modelSummary.version}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  3-Tier IoT Sensor Classification • Real-time Hydraulic Pipeline Fracture Detection
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer shrink-0"
              title="Close ML Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('workbench')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'workbench'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Workbench</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Model & Training Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab('ppt')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'ppt'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>PPT Slide Deck</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">

          {/* ================= TAB 1: INTERACTIVE WORKBENCH ================= */}
          {activeTab === 'workbench' && (
            <div className="space-y-6">
              
              {/* Quick Scenario Preset Buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Quick Operational Presets
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Select to stress-test the model
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleApplyPreset('burst')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Underground Pipe Burst</span>
                  </button>

                  <button
                    onClick={() => handleApplyPreset('turbidity')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Turbidity & Silt Intrusion</span>
                  </button>

                  <button
                    onClick={() => handleApplyPreset('normal')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Optimal Supply Benchmark</span>
                  </button>

                  <button
                    onClick={() => handleApplyPreset('pump_fail')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Feeder Pump Outage</span>
                  </button>

                  <button
                    onClick={() => handleApplyPreset('throttling')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Gauge className="w-3.5 h-3.5" />
                    <span>Local Air-Lock / Throttling</span>
                  </button>
                </div>
              </div>

              {/* Sliders Grid: 3 Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* TIER 1: STORAGE TANK SENSORS */}
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <Droplets className="w-4 h-4" />
                      <span>Tier 1: Storage Tank</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Reservoir</span>
                  </div>

                  {/* Turbidity */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Turbidity (NTU):</span>
                      <span className={`font-bold ${tankTurbidity > 1.0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {tankTurbidity.toFixed(2)} NTU
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="12.0"
                      step="0.05"
                      value={tankTurbidity}
                      onChange={(e) => setTankTurbidity(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>0.1 (Clear)</span>
                      <span>Norm: &lt;1.0</span>
                      <span>12.0 (Muddy)</span>
                    </div>
                  </div>

                  {/* pH */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">pH Balance:</span>
                      <span className={`font-bold ${tankPh < 6.5 || tankPh > 8.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {tankPh.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="9.5"
                      step="0.05"
                      value={tankPh}
                      onChange={(e) => setTankPh(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>5.0 (Acidic)</span>
                      <span>Norm: 6.5 - 8.5</span>
                      <span>9.5 (Alkaline)</span>
                    </div>
                  </div>

                  {/* Conductivity */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Conductivity (µS/cm):</span>
                      <span className="font-bold text-slate-200">
                        {tankConductivity} µS/cm
                      </span>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="1100"
                      step="10"
                      value={tankConductivity}
                      onChange={(e) => setTankConductivity(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>150 (Pure)</span>
                      <span>Norm: 250 - 500</span>
                      <span>1100 (Mineral Spike)</span>
                    </div>
                  </div>
                </div>

                {/* TIER 2: UNDERGROUND TRANSMISSION PIPELINE */}
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4" />
                      <span>Tier 2: Pipeline</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Trunk Mains</span>
                  </div>

                  {/* Pipeline Pressure */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Line Pressure:</span>
                      <span className={`font-bold ${pipelinePressure < 1.6 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {pipelinePressure.toFixed(2)} bar
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="3.0"
                      step="0.02"
                      value={pipelinePressure}
                      onChange={(e) => setPipelinePressure(parseFloat(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>0.0 (Zero)</span>
                      <span>Nominal: 2.40 bar</span>
                      <span>3.0 (High)</span>
                    </div>
                  </div>

                  {/* Flow Rate */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Flow Rate (Lpm):</span>
                      <span className={`font-bold ${pipelineFlow > 500 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {pipelineFlow} L/min
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="650"
                      step="5"
                      value={pipelineFlow}
                      onChange={(e) => setPipelineFlow(parseInt(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>0 L/min</span>
                      <span>Nom: 420 L/min</span>
                      <span>650 L/min</span>
                    </div>
                  </div>

                  {/* Hydraulic Impedance Info */}
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] space-y-0.5 font-mono">
                    <div className="text-slate-400">Pipeline Pressure Drop (ΔP):</div>
                    <div className="text-sky-300 font-bold">
                      {(2.40 - pipelinePressure).toFixed(2)} bar
                    </div>
                  </div>
                </div>

                {/* TIER 3: CONSUMER TAP SENSOR */}
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4" />
                      <span>Tier 3: Consumer Tap</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Household FHTC</span>
                  </div>

                  {/* Tap Delivery Pressure */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Delivery Pressure:</span>
                      <span className={`font-bold ${tapPressure < 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {tapPressure.toFixed(2)} bar
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="2.0"
                      step="0.02"
                      value={tapPressure}
                      onChange={(e) => setTapPressure(parseFloat(e.target.value))}
                      className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>0.0 (Dry Tap)</span>
                      <span>Nominal: 1.30 bar</span>
                      <span>2.0 (High)</span>
                    </div>
                  </div>

                  {/* Gradient Ratio */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Pressure Ratio (Tap/Line):</span>
                      <span className="font-bold text-teal-300">
                        {(tapPressure / Math.max(0.01, pipelinePressure)).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Nominal delivery ratio is ~0.54. Values &lt; 0.20 indicate severe line fracture or starvation.
                    </div>
                  </div>
                </div>
              </div>

              {/* REAL-TIME XGBOOST INFERENCE RESULTS CARD */}
              {prediction && (
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                          XGBoost Diagnostic Output
                        </span>
                        {isInferencing && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                            Evaluating...
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span>{prediction.predictedClass}</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Confidence</div>
                        <div className="text-xl font-black text-cyan-400 font-mono">
                          {prediction.confidence}%
                        </div>
                      </div>

                      <div className="text-right pl-3 border-l border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Broken Pipe Prob</div>
                        <div className={`text-xl font-black font-mono ${prediction.brokenPipeProbability > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {prediction.brokenPipeProbability}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Explanation & Recommended Action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        Hydraulic ML Diagnosis
                      </span>
                      <p className="text-slate-400 leading-relaxed">
                        {prediction.explanation}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Engineering Action & Potability
                      </span>
                      <p className="text-slate-400 leading-relaxed">
                        {prediction.recommendedAction}
                      </p>
                      <div className="pt-1 flex items-center gap-2 text-[10px]">
                        <span className="text-slate-400">Safety Status:</span>
                        <span className={`font-bold px-2 py-0.5 rounded-full font-mono ${
                          prediction.waterSafety === 'Safe' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {prediction.waterSafety}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SHAP-Style Feature Attributions & Class Probabilities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    
                    {/* Multi-class probability distribution */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                        Softmax Class Probabilities
                      </span>
                      <div className="space-y-1.5">
                        {(prediction.probabilities || []).map((p: any) => (
                          <div key={p.className} className="space-y-0.5 text-[11px]">
                            <div className="flex justify-between">
                              <span className={`truncate max-w-[200px] ${p.className === prediction.predictedClass ? 'font-bold text-cyan-300' : 'text-slate-400'}`}>
                                {p.className}
                              </span>
                              <span className="font-mono text-slate-300">{p.percentage}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  p.className === prediction.predictedClass ? 'bg-cyan-400' : 'bg-slate-600'
                                }`}
                                style={{ width: `${p.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Feature Attributions */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                        Key Decision Drivers (Gini Gain Attribution)
                      </span>
                      <div className="space-y-2">
                        {(prediction.featureContributions || []).slice(0, 4).map((fc: any) => (
                          <div key={fc.feature} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] flex items-center justify-between">
                            <div className="min-w-0 pr-2">
                              <div className="font-mono font-bold text-slate-200 truncate">{fc.feature}</div>
                              <div className="text-[10px] text-slate-400 truncate">{fc.description}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-cyan-400 font-mono font-bold text-xs">{fc.impactPercentage}%</span>
                              <span className="text-[9px] text-slate-500 block">gain weight</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Report Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleReportFromDiagnosis}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
                    >
                      <Droplets className="w-4 h-4" />
                      <span>Pre-fill Citizen Complaint with this Diagnosis</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: MODEL ARCHITECTURE & METRICS ================= */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              
              {/* Architecture Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Model Family</span>
                  <span className="text-xs font-black text-white block mt-0.5">XGBoost / GBDT</span>
                  <span className="text-[9px] text-cyan-400 font-mono">Gradient Boosted Trees</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Val Accuracy</span>
                  <span className="text-xl font-black text-emerald-400 font-mono block mt-0.5">
                    {modelSummary.metrics.accuracy}%
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">Balanced Test Set</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Macro F1-Score</span>
                  <span className="text-xl font-black text-cyan-400 font-mono block mt-0.5">
                    {modelSummary.metrics.f1Score}%
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">Precision: {modelSummary.metrics.precision}%</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">ROC-AUC</span>
                  <span className="text-xl font-black text-indigo-400 font-mono block mt-0.5">
                    {modelSummary.metrics.rocAuc}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">Sub-millisecond inference</span>
                </div>
              </div>

              {/* Hyperparameters Grid */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Binary className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Tuned Hyperparameters & Regularization Grid
                    </h4>
                  </div>
                  <button
                    onClick={handleRetrain}
                    disabled={retraining}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
                    <span>{retraining ? 'Retraining...' : 'Trigger Online Retrain'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Number of Trees</span>
                    <span className="font-bold text-slate-200">{modelSummary.hyperparameters.nEstimators} Estimators</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Learning Rate (η)</span>
                    <span className="font-bold text-slate-200">{modelSummary.hyperparameters.learningRate} (Shrinkage)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Max Tree Depth</span>
                    <span className="font-bold text-slate-200">{modelSummary.hyperparameters.maxDepth} Levels</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">L2 Regularization (λ)</span>
                    <span className="font-bold text-slate-200">1.0 (Ridge Penalty)</span>
                  </div>
                </div>
              </div>

              {/* Confusion Matrix & Class Metrics */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Multi-Class Validation Metrics Table
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                        <th className="py-2 pr-3">Diagnostic Class</th>
                        <th className="py-2 px-2 text-center">Precision</th>
                        <th className="py-2 px-2 text-center">Recall</th>
                        <th className="py-2 px-2 text-center">F1-Score</th>
                        <th className="py-2 pl-2 text-right">Support</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {modelSummary.metrics.classMetrics.map((cm) => (
                        <tr key={cm.className} className="hover:bg-slate-900/60">
                          <td className="py-2 pr-3 text-slate-200 font-sans font-medium">{cm.className}</td>
                          <td className="py-2 px-2 text-center text-emerald-400">{cm.precision}%</td>
                          <td className="py-2 px-2 text-center text-cyan-400">{cm.recall}%</td>
                          <td className="py-2 px-2 text-center text-sky-300 font-bold">{cm.f1Score}%</td>
                          <td className="py-2 pl-2 text-right text-slate-400">{cm.support}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gini Feature Importance Ranking */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Feature Importance Ranking (Gini Gain)
                  </h4>
                </div>

                <div className="space-y-2">
                  {modelSummary.featureImportances.map((f, i) => (
                    <div key={f.feature} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-slate-900 text-slate-400 font-mono text-[10px] flex items-center justify-center shrink-0">
                            #{i + 1}
                          </span>
                          <span className="font-mono text-slate-200 font-bold">{f.feature}</span>
                          <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                            — {f.description}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-cyan-400">{f.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${f.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 3: PPT SLIDE DECK & DESCRIPTION ================= */}
          {activeTab === 'ppt' && (
            <div className="space-y-6">
              
              {/* Banner with Master Copy Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      Project Presentation Deck (Ready to Paste)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Structured machine learning slides covering algorithm selection, math formulation, telemetry features, and benchmark metrics.
                  </p>
                </div>

                <button
                  onClick={handleCopyAllSlides}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer shrink-0"
                >
                  {copiedAllDeck ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Copied Entire Deck!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy All Slides (Markdown)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Individual Slide Cards */}
              <div className="space-y-4">
                {(modelSummary.pptSlideSummary || []).map((slide, idx) => (
                  <div
                    key={slide.title}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-bold">
                          Slide #{idx + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-white">
                          {slide.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCopySlide(slide, idx)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                        title="Copy this slide"
                      >
                        {copiedSlideIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                            <span className="text-[11px] text-emerald-400 font-mono">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[11px] text-slate-400 font-mono">Copy Slide</span>
                          </>
                        )}
                      </button>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-300">
                      {slide.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
