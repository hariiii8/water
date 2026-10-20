import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficerRatingsModal } from '../OfficerRatingsModal';
import { Complaint, ComplaintStatus } from '../../types';
import { getStatusTranslation } from '../../translations';
import { ComplaintCategoryIcon } from '../ComplaintCategoryIcon';
import {
  Wrench,
  CheckCircle2,
  AlertCircle,
  MapPin,
  X,
  CheckSquare,
  Star,
  Activity,
  Sparkles,
  Check,
  Radio,
  Navigation,
  ShieldCheck
} from 'lucide-react';

export const OfficerFieldTasksScreen: React.FC = () => {
  const {
    complaints,
    updateComplaintStatus,
    setSelectedComplaint,
    setActiveModal,
    setActiveTab: setActiveAppTab,
    setSelectedMapPointId,
    officerRatingSummary,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'SENSOR_ALERTS' | 'IN_PROGRESS' | 'ASSIGNED' | 'RESOLVED'>('ALL');
  const [updatingComplaint, setUpdatingComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [progressNote, setProgressNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  const [resolvedBanner, setResolvedBanner] = useState<string | null>(null);

  // All citizen complaints appear in assigned field tasks
  const assignedComplaints = complaints;

  const sensorAlertsCount = assignedComplaints.filter((c) => !!c.sensorData?.alertMessage).length;
  const pendingCount = assignedComplaints.filter(
    (c) => c.status === 'Assigned' || c.status === 'Submitted'
  ).length;
  const inProgressCount = assignedComplaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = assignedComplaints.filter((c) => c.status === 'Resolved').length;

  const filtered = assignedComplaints.filter((c) => {
    if (activeTab === 'SENSOR_ALERTS') return !!c.sensorData?.alertMessage;
    if (activeTab === 'ASSIGNED') return c.status === 'Assigned' || c.status === 'Submitted';
    if (activeTab === 'IN_PROGRESS') return c.status === 'In Progress';
    if (activeTab === 'RESOLVED') return c.status === 'Resolved';
    return true;
  });

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingComplaint) return;

    updateComplaintStatus(
      updatingComplaint.id,
      newStatus,
      progressNote.trim() || undefined
    );

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setUpdatingComplaint(null);
      setProgressNote('');
    }, 600);
  };

  // Step 1: Advance complaint to In Progress
  const handleMarkInProgress = (item: Complaint) => {
    updateComplaintStatus(
      item.id,
      'In Progress',
      'Work in progress on site.'
    );

    setResolvedBanner(`Task #${item.id} is now In Progress`);
    setTimeout(() => {
      setResolvedBanner(null);
    }, 3500);
  };

  // Step 2: Resolve Action for Officer Rajesh Kumar (after In Progress)
  const handleQuickResolve = (item: Complaint) => {
    updateComplaintStatus(
      item.id,
      'Resolved',
      'Problem resolved on site.'
    );

    setResolvedBanner(`Complaint #${item.id} marked as Resolved`);
    setTimeout(() => {
      setResolvedBanner(null);
    }, 3500);
  };

  // Quick note suggestions for officers
  const quickNotes = [
    'Checked the spot. Repair workers are fixing the broken pipe now.',
    'Main valve isolated to prevent water waste. Replacing pipe joint.',
    'Work finished. Valve reopened and normal water pressure restored.'
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* RESOLVED SUCCESS BANNER */}
      {resolvedBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white shadow-md flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold leading-tight">{resolvedBanner}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full shrink-0">
            Status Resolved
          </span>
        </div>
      )}

      {/* 5 FILTER TABS (All Tasks, Sensor Alerts, Need to Visit, Working on It, Fixed & Cleared) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-2.5 rounded-2xl transition-all whitespace-nowrap shadow-2xs flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>{t.officerAllTasks}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-white">
            {assignedComplaints.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('SENSOR_ALERTS')}
          className={`px-3.5 py-2.5 rounded-2xl transition-all whitespace-nowrap shadow-2xs flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'SENSOR_ALERTS'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-white text-cyan-800 border border-cyan-200 hover:bg-cyan-50'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-cyan-500" />
          <span>Sensor & ML Alerts</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500 text-white font-black">
            {sensorAlertsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ASSIGNED')}
          className={`px-3.5 py-2.5 rounded-2xl transition-all whitespace-nowrap shadow-2xs flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ASSIGNED'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <span>{t.officerNeedToVisit}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`px-3.5 py-2.5 rounded-2xl transition-all whitespace-nowrap shadow-2xs flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-white text-cyan-800 border border-cyan-200 hover:bg-cyan-50'
          }`}
        >
          <span>{t.officerWorkingOnIt}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500 text-slate-950">
            {inProgressCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('RESOLVED')}
          className={`px-3.5 py-2.5 rounded-2xl transition-all whitespace-nowrap shadow-2xs flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'RESOLVED'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <span>Fixed & Cleared</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-slate-950">
            {resolvedCount}
          </span>
        </button>
      </div>

      {/* FIELD TASK CARDS LIST */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-base text-slate-800">
              {t.officerAllCaughtUp}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {t.officerNoTasks}
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isResolved = item.status === 'Resolved';
            const isInProgress = item.status === 'In Progress';
            const isEmergency = item.urgency === 'Emergency';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-3xl bg-white border transition-all duration-200 shadow-sm hover:shadow-md space-y-3 ${
                  isEmergency
                    ? 'border-rose-300 ring-2 ring-rose-500/10'
                    : isResolved
                    ? 'border-emerald-200/80 bg-emerald-50/15'
                    : 'border-slate-200'
                }`}
              >
                {/* Header Row: ID, Category & Status Badge */}
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <ComplaintCategoryIcon category={item.category} size="md" glow />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-200 shrink-0">
                          {item.id}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                          {item.category}
                        </span>
                        {item.sensorData?.alertMessage && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 border border-cyan-300 flex items-center gap-1 shadow-2xs shrink-0">
                            <Radio className="w-3 h-3 text-cyan-600" />
                            Sensor Alert
                          </span>
                        )}
                      </div>

                      {/* Translated Status Badge */}
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs shrink-0 whitespace-nowrap ${
                          isResolved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : isInProgress
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-blue-50 text-blue-700 border-blue-300'
                        }`}
                      >
                        {getStatusTranslation(item.status, t)}
                      </span>
                    </div>

                    {/* Problem Title & Description */}
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* IoT Sensor Detection Telemetry if available */}
                {item.sensorData && (
                  <div className="p-2.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-xs text-cyan-950 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Activity className="w-4 h-4 text-cyan-600 shrink-0 animate-pulse" />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold block text-[10px] uppercase text-cyan-800">
                          Sensor Telemetry Alert
                        </span>
                        <p className="text-[11px] truncate text-cyan-900 font-medium">
                          {item.sensorData.alertMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Strip */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span className="truncate font-medium text-slate-800">
                    {item.location?.replace(/Flat 3B,?\s*Sri Krishna Apartments,?\s*/gi, '') || '14 Kutchery Road, Mylapore'} ({item.ward})
                  </span>
                </div>


                {/* Citizen Rating on Cleared Problem */}
                {isResolved && (
                  item.officerRating ? (
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300/90 text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                        <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-amber-950">
                            {t.officerCitizenRating}: {item.officerRating.stars}/5 Stars
                          </span>
                          {item.officerRating.ratedAt && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              {item.officerRating.ratedAt}
                            </span>
                          )}
                        </div>
                        {item.officerRating.feedback && (
                          <p className="text-xs text-slate-700 italic mt-0.5 font-medium">
                            "{item.officerRating.feedback}"
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Star className="w-3.5 h-3.5 text-slate-400" />
                        <span>Awaiting Citizen Rating & Review</span>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">Pending</span>
                    </div>
                  )
                )}

                {/* Action Buttons for Officer - Mobile Cramp-Free Layout */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                  {/* Secondary Actions (View Details & Map) - 2 Equal Columns on Mobile */}
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                    <button
                      onClick={() => {
                        setSelectedComplaint(item);
                        setActiveModal('complaintDetail');
                      }}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition text-center shadow-2xs active:scale-98 cursor-pointer whitespace-nowrap"
                    >
                      {t.viewDetails}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMapPointId(item.id);
                        setActiveAppTab('map');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Navigation className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                      <span>Map</span>
                    </button>
                  </div>

                  {/* Primary Officer Action - Full Width on Mobile, Zero Cramp or Text Wrap */}
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {!isInProgress && !isResolved ? (
                      <button
                        type="button"
                        onClick={() => handleMarkInProgress(item)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-sm shadow-amber-500/20 transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer whitespace-nowrap"
                      >
                        <Activity className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                        <span>⏳ In Progress</span>
                      </button>
                    ) : isInProgress ? (
                      <div className="w-full flex items-center gap-2 min-w-0">
                        <div className="py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-2xs shrink-0 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span>In Progress</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickResolve(item)}
                          className="flex-1 min-w-0 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer whitespace-nowrap"
                        >
                          <Wrench className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">👨‍🔧 Mark Resolved</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setUpdatingComplaint(item);
                          setNewStatus('Resolved');
                          setProgressNote('');
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>Add Note</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {updatingComplaint && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-100">
            {/* Close button */}
            <button
              onClick={() => setUpdatingComplaint(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-4 pr-6">
              <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                {updatingComplaint.id}
              </span>
              <h3 className="font-extrabold text-base text-slate-900 mt-1 leading-snug">
                {updatingComplaint.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                📍 {updatingComplaint.location}
              </p>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Update Work Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('In Progress')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      newStatus === 'In Progress'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>In Progress</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewStatus('Resolved')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      newStatus === 'Resolved'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fixed / Resolved</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Inspection Note / Work Done:
                </label>
                <textarea
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder="e.g., Replaced cracked pipe joint, reopened main valve, restored pressure to 2.4 bar..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 shadow-2xs resize-none"
                />

                <div className="flex flex-wrap gap-1 mt-1.5">
                  {quickNotes.map((note, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProgressNote(note)}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg transition text-left cursor-pointer truncate max-w-full"
                    >
                      + {note}
                    </button>
                  ))}
                </div>
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Work status updated successfully!</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpdatingComplaint(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
                >
                  Save Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RATINGS MODAL */}
      {showRatingsModal && (
        <OfficerRatingsModal isOpen={showRatingsModal} onClose={() => setShowRatingsModal(false)} />
      )}
    </div>
  );
};
