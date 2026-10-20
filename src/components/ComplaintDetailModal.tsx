import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintStatus } from '../types';
import { ComplaintCategoryIcon } from './ComplaintCategoryIcon';
import { getComplaintSensorData, computeMLBrokenPipePrediction } from '../data/initialData';
import {
  X,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  Wrench,
  Navigation,
  FileText,
  MessageSquare,
  Check,
  AlertTriangle,
  Gauge,
  Layers,
  ShieldCheck,
  Radio
} from 'lucide-react';

export const ComplaintDetailModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedComplaint,
    setSelectedComplaint,
    rateOfficer,
    currentRole,
    setActiveTab,
    setSelectedMapPointId
  } = useApp();

  if (activeModal !== 'complaintDetail' || !selectedComplaint) {
    return null;
  }

  const c = selectedComplaint;

  // Officer rating state (for resolved complaints)
  const [ratingStars, setRatingStars] = useState<number>(c.officerRating?.stars || 5);
  const [ratingFeedback, setRatingFeedback] = useState<string>(
    c.officerRating?.feedback || 'Quick and helpful fix. Thank you!'
  );
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [ratingSavedMsg, setRatingSavedMsg] = useState(false);

  useEffect(() => {
    setRatingStars(c.officerRating?.stars || 5);
    setRatingFeedback(
      c.officerRating?.feedback || 'Quick and helpful fix. Thank you!'
    );
    setIsEditingRating(false);
    setRatingSavedMsg(false);
  }, [c.id, c.officerRating]);

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Assigned':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusText = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return 'Waiting for Officer';
      case 'Assigned':
        return 'Officer Assigned';
      case 'In Progress':
        return 'Fixing on Site';
      case 'Resolved':
        return 'Fixed & Resolved';
      case 'Rejected':
        return 'Closed';
      default:
        return status;
    }
  };

  const isEmergency = c.urgency === 'Emergency' || c.urgency === 'High';

  const handleClose = () => {
    setActiveModal(null);
    setSelectedComplaint(null);
  };

  const handleViewOnMap = () => {
    handleClose();
    if (c.id === 'AQUA-2026-1042' || c.category === 'Water Leakage' || c.category === 'Broken Pipe') {
      setSelectedMapPointId('pt_damaged_pipe_1');
    } else {
      setSelectedMapPointId(null);
    }
    setActiveTab('map');
  };

  const cleanDescription = (text: string) => {
    if (!text) return '';
    return text
      .replace(/^alert message:\s*it is identified by sensor\s*[-–—:]*\s*/gi, '')
      .replace(/it is identified by sensor\s*[-–—:]*\s*/gi, '')
      .replace(/municipal sensor alert\s*[-–—:]*\s*/gi, '')
      .replace(/sensor alert:\s*/gi, '')
      .replace(/^water leakage\s*[-–—:]*\s*/gi, '')
      .trim();
  };


  // Status Step Index
  const getStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return 1;
      case 'Assigned':
        return 2;
      case 'In Progress':
        return 3;
      case 'Resolved':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStepIndex(c.status);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100">
        {/* MODAL HEADER */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
              <span className="font-mono text-[10px] sm:text-xs font-bold text-cyan-800 bg-cyan-100/80 px-2 py-0.5 rounded-md sm:rounded-lg border border-cyan-200">
                {c.id}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                  c.status
                )}`}
              >
                {getStatusText(c.status)}
              </span>
              {isEmergency && (
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  {c.urgency}
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
              Complaint Details
            </h2>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close details"
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition shrink-0 ml-2 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          {/* 1. VISUAL STATUS PROGRESS TRACKER (SIMPLE LABELS, NO DATES) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2.5">
              Live Progress
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {[
                { step: 1, label: 'Reported', icon: FileText },
                { step: 2, label: 'Assigned', icon: Clock },
                { step: 3, label: 'Fixing', icon: Wrench },
                { step: 4, label: 'Resolved', icon: CheckCircle2 }
              ].map(({ step, label, icon: Icon }) => {
                const isPassed = currentStep >= step;
                const isCurrent = currentStep === step;
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-cyan-600 text-white ring-2 ring-cyan-400 shadow-xs'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-bold truncate max-w-full ${
                        isCurrent
                          ? 'text-cyan-800 font-extrabold'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. PROBLEM DETAILS (SIMPLE WORDS, DATE REMOVED) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-start gap-3">
              <ComplaintCategoryIcon category={c.category} size="md" glow />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-extrabold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-200">
                    {c.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {c.title}
                </h3>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Problem Description
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                {cleanDescription(c.description)}
              </p>
            </div>

            {/* Attached Photo if available */}
            {c.photoUrl && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Photo
                </span>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48">
                  <img
                    src={c.photoUrl}
                    alt="Problem attachment"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. AREA & LOCATION DETAILS */}
          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-900 block">
                    Area & Location
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {c.location}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={handleViewOnMap}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-100/70 text-sky-800 font-extrabold text-xs border border-sky-200 shadow-2xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-600" />
                <span>View on Map</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-sky-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Village</span>
                <span className="font-extrabold text-slate-800 block truncate mt-0.5">{c.village || c.ward}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-sky-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Grampanchayath</span>
                <span className="font-extrabold text-slate-800 block truncate mt-0.5">
                  {c.gramPanchayat || c.panchayat || 'Local Gram Panchayat'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-sky-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">District</span>
                <span className="font-extrabold text-slate-800 block truncate mt-0.5">{c.district || 'Bengaluru Rural'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-sky-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">State</span>
                <span className="font-extrabold text-slate-800 block truncate mt-0.5">{c.state || 'Karnataka'}</span>
              </div>
            </div>
          </div>



          {/* 4. ML BROKEN PIPE PREDICTION & 3-TIER SENSOR TELEMETRY */}
          {(() => {
            const sensorData = c.sensorData || getComplaintSensorData(c);
            const pipePressure = sensorData?.pipeline?.pressureBar ?? sensorData?.pressureBar ?? 2.40;
            const pipeFlow = sensorData?.pipeline?.flowRateLpm ?? sensorData?.flowRateLpm ?? 420;
            const tapPressure = sensorData?.tap?.pressureBar ?? sensorData?.tapPressureBar ?? 1.30;
            const tankPh = sensorData?.tank?.ph ?? sensorData?.ph ?? 7.25;
            const tankTurbidity = sensorData?.tank?.turbidityNTU ?? sensorData?.turbidityNTU ?? 0.75;
            const tankConductivity = sensorData?.tank?.conductivity ?? sensorData?.conductivity ?? 310;

            const mlPred = sensorData?.mlPrediction || computeMLBrokenPipePrediction(
              pipePressure,
              pipeFlow,
              tapPressure,
              { ph: tankPh, turbidityNTU: tankTurbidity, conductivity: tankConductivity }
            );

            const isBroken = mlPred.isBrokenPipePredicted;

            return (
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-600" />
                      <span>ML Sensor Diagnosis</span>
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      isBroken
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    }`}
                  >
                    {isBroken ? `Broken Pipe (${mlPred.brokenPipeProbability}%)` : `Intact (${mlPred.brokenPipeProbability}% Risk)`}
                  </span>
                </div>

                {/* Pressure Variation Banner */}
                <div
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    isBroken
                      ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>Pressure Variation (ΔP Analysis)</span>
                    <span className="text-[10px] font-mono">
                      Nominal: Pipeline 2.4 bar • Tap 1.3 bar
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/80 p-2 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] text-slate-500 block">Underground Pipeline</span>
                      <span className="font-extrabold text-slate-900">{pipePressure.toFixed(2)} bar</span>
                      <span className={`block font-bold text-[10px] ${mlPred.pipelinePressureDropBar >= 0.5 ? 'text-rose-600' : 'text-slate-600'}`}>
                        ΔP: -{mlPred.pipelinePressureDropBar.toFixed(2)} bar
                      </span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] text-slate-500 block">Consumer Tap Delivery</span>
                      <span className="font-extrabold text-slate-900">{tapPressure.toFixed(2)} bar</span>
                      <span className={`block font-bold text-[10px] ${mlPred.tapPressureDropBar >= 0.4 ? 'text-rose-600' : 'text-slate-600'}`}>
                        ΔP: -{mlPred.tapPressureDropBar.toFixed(2)} bar
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed italic pt-1">
                    "{mlPred.diagnosisReason}"
                  </p>
                </div>

                {/* 3 Project Sensor Tiers */}
                <div className="space-y-2 pt-1 text-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    All Project Sensor Tiers
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Tank pH</span>
                      <span className="font-extrabold font-mono text-slate-800">{tankPh.toFixed(2)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Tank Turbidity</span>
                      <span className="font-extrabold font-mono text-slate-800">{tankTurbidity.toFixed(2)} NTU</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Tank Conductivity</span>
                      <span className="font-extrabold font-mono text-slate-800">{tankConductivity} µS/cm</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-center">
                    <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100">
                      <span className="text-[9px] text-blue-600 font-bold block uppercase">Pipeline Flow</span>
                      <span className="font-extrabold font-mono text-slate-800">{pipeFlow} L/min</span>
                    </div>
                    <div className="p-2 rounded-xl bg-teal-50/50 border border-teal-100">
                      <span className="text-[9px] text-teal-600 font-bold block uppercase">Tap Pressure</span>
                      <span className="font-extrabold font-mono text-slate-800">{tapPressure.toFixed(2)} bar</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 5. ASSIGNED WATER OFFICER */}
          {c.assignedOfficerName && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50/80 via-white to-sky-50/60 border border-cyan-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
                  Assigned Water Officer
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>On Field Duty</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-500 text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
                    {c.assignedOfficerName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-sm text-slate-900 truncate">
                      {c.assignedOfficerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Municipal Water Engineer • Zone 9
                    </p>
                  </div>
                </div>

              </div>

              {/* Latest Officer Notes (if any) */}
              {c.officerNotes && c.officerNotes.length > 0 && (
                <div className="p-3 rounded-xl bg-white border border-cyan-100 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-cyan-600" />
                    <span>Officer Updates</span>
                  </span>
                  <div className="space-y-1">
                    {Array.from(new Set(c.officerNotes.filter(Boolean))).map((note, idx) => (
                      <p key={idx} className="text-slate-700 font-medium leading-relaxed italic bg-cyan-50/40 p-2 rounded-lg">
                        "{note}"
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. CITIZEN RATING (FOR RESOLVED COMPLAINTS - DATES REMOVED) */}
          {c.status === 'Resolved' && (
            currentRole === 'citizen' ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 to-yellow-50/70 border border-amber-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-amber-950">
                      Rate Officer Service
                    </h4>
                    <p className="text-[11px] text-amber-900/80">
                      How happy are you with the work?
                    </p>
                  </div>
                  {c.officerRating && !isEditingRating && (
                    <button
                      type="button"
                      onClick={() => setIsEditingRating(true)}
                      className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  )}
                </div>

                {c.officerRating && !isEditingRating ? (
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 space-y-1.5">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (c.officerRating?.stars || 5)
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-amber-950 ml-1.5">
                        {c.officerRating.stars} / 5 Stars
                      </span>
                    </div>
                    {c.officerRating.feedback && (
                      <p className="text-xs text-slate-700 italic">
                        "{c.officerRating.feedback}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingStars(star)}
                          className="p-1 hover:scale-110 transition active:scale-95 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= ratingStars
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-900 ml-1">
                        {ratingStars} of 5
                      </span>
                    </div>

                    <input
                      type="text"
                      value={ratingFeedback}
                      onChange={(e) => setRatingFeedback(e.target.value)}
                      placeholder="Short feedback (optional)..."
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-amber-500"
                    />

                    <div className="flex justify-end gap-2 pt-1">
                      {isEditingRating && (
                        <button
                          type="button"
                          onClick={() => setIsEditingRating(false)}
                          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          rateOfficer(
                            c.id,
                            ratingStars,
                            ratingFeedback.trim() || 'Problem fixed, thank you!'
                          );
                          setIsEditingRating(false);
                          setRatingSavedMsg(true);
                          setTimeout(() => setRatingSavedMsg(false), 2500);
                        }}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        Save Rating
                      </button>
                    </div>

                    {ratingSavedMsg && (
                      <div className="p-2 rounded-xl bg-emerald-100 text-[11px] text-emerald-800 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Thank you! Your feedback was saved.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Officer / Admin View: Read-Only Citizen Rating (No dates) */
              c.officerRating ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300/90 text-xs text-amber-950 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Citizen Rating: {c.officerRating.stars} / 5 Stars</span>
                    </span>
                  </div>
                  {c.officerRating.feedback && (
                    <p className="text-xs text-slate-700 italic">
                      "{c.officerRating.feedback}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <span>Waiting for citizen review</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Pending</span>
                </div>
              )
            )
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Complaint #{c.id}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition active:scale-[0.98] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
