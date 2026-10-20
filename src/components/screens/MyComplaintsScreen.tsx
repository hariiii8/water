import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintStatus, ProblemCategory } from '../../types';
import { ComplaintCategoryIcon } from '../ComplaintCategoryIcon';
import { getComplaintSensorData, getMLConditionLevel, getMLConditionStyles, computeMLBrokenPipePrediction } from '../../data/initialData';
import {
  FileText,
  Search,
  PlusCircle,
  ChevronRight,
  Bot,
  Zap,
  Droplets,
  Thermometer,
  Activity,
  CheckCircle2,
  Send,
  Navigation,
  MapPin,
  Sparkles,
  Gauge,
  RefreshCw,
  Check,
  PhoneCall,
  Clock,
  Filter,
  Archive,
  Radio,
  AlertTriangle,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface MyComplaintsScreenProps {
  onNewComplaint: (category?: ProblemCategory) => void;
}

export const MyComplaintsScreen: React.FC<MyComplaintsScreenProps> = ({ onNewComplaint }) => {
  const {
    currentUser,
    currentRole,
    complaints,
    setSelectedComplaint,
    setActiveModal,
    addComplaint,
    updateComplaintStatus,
    updateComplaintMLDiagnosis,
    setActiveTab,
    setSelectedMapPointId,
    liveTelemetry,
    t
  } = useApp();

  // TWO SEPARATE PARTS IN COMPLAINTS:
  // 1) 'complaints' = My Complaints (Citizen only sees their own reported problems & status)
  // 2) 'ml_diagnosis' = Live Sensors & ML Diagnosis (3 tiers: Tank, Pipeline, Tap + Broken pipe prediction)
  const [activePart, setActivePart] = useState<'complaints' | 'ml_diagnosis'>('complaints');

  // Search & Filter state for Citizen Complaints
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Submitted' | 'In Progress' | 'Resolved_Archive'>('ALL');
  const [showResolvedArchive, setShowResolvedArchive] = useState(false);

  // Source for telemetry: 'municipal' (real-time municipal grid) or specific complaint ID belonging to this user
  const [sensorSource, setSensorSource] = useState<'municipal' | string>('municipal');
  // Selected complaint in the complaint selection selector box for ML Sensor Diagnosis tab
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('municipal');
  const [isUpdatingTabML, setIsUpdatingTabML] = useState(false);
  const [alertSuccessBanner, setAlertSuccessBanner] = useState<string | null>(null);

  // STRICT CITIZEN PRIVACY: Citizens only see complaints they submitted themselves!
  const visibleComplaints = complaints.filter((c) => {
    if (currentRole === 'officer') {
      return c.assignedOfficerId === currentUser?.id;
    }
    if (currentRole === 'admin') {
      return true;
    }
    // Strict privacy: only this citizen's own complaints
    const isOwner =
      (currentUser?.id && c.userId === currentUser.id) ||
      (currentUser?.mobile && c.userMobile === currentUser.mobile) ||
      (currentUser?.name && c.userName && c.userName.toLowerCase() === currentUser.name.toLowerCase());
    return Boolean(isOwner);
  });

  // Active complaints for this citizen (when resolved, moved to resolved history)
  const activeComplaintsList = visibleComplaints.filter(
    (c) => c.status !== 'Resolved' && c.status !== 'Rejected'
  );
  const resolvedComplaintsList = visibleComplaints.filter((c) => c.status === 'Resolved');

  // Active complaints for ML Sensor Diagnosis (strictly only this citizen's active complaints)
  const activeMLComplaints = visibleComplaints.filter(
    (c) => c.status !== 'Resolved' && c.status !== 'Rejected'
  );

  // Filter citizen complaints
  const filteredComplaints = (statusFilter === 'Resolved_Archive' || showResolvedArchive ? resolvedComplaintsList : activeComplaintsList).filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (statusFilter === 'Submitted') return c.status === 'Submitted' || c.status === 'Assigned';
    if (statusFilter === 'In Progress') return c.status === 'In Progress';
    return true;
  });

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
        return 'Resolved';
      case 'Rejected':
        return 'Closed';
      default:
        return status;
    }
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

  // Selected complaint in ML tab (only active complaints of this user allowed, or null for municipal live stream)
  const activeTabComplaint: Complaint | null =
    sensorSource !== 'municipal'
      ? (activeMLComplaints.find((c) => c.id === sensorSource) ||
         activeMLComplaints.find((c) => c.id === selectedComplaintId) ||
         null)
      : null;

  // Real-time sensor readings: Either Live Municipal Grid or selected personal complaint telemetry
  const activeTabSensorData = React.useMemo(() => {
    if (!activeTabComplaint || sensorSource === 'municipal') {
      const tank = {
        ph: liveTelemetry.tankPh,
        turbidityNTU: liveTelemetry.tankTurbidityNTU,
        conductivity: liveTelemetry.tankConductivity
      };
      const pipeline = {
        flowRateLpm: liveTelemetry.pipelineFlowRateLpm,
        pressureBar: liveTelemetry.pipelinePressureBar
      };
      const tap = {
        pressureBar: liveTelemetry.tapPressureBar
      };
      const mlPrediction = computeMLBrokenPipePrediction(
        pipeline.pressureBar,
        pipeline.flowRateLpm,
        tap.pressureBar,
        tank
      );
      return {
        sensorNode: 'Ward 12 Municipal Grid Telemetry (Live Stream)',
        tank,
        pipeline,
        tap,
        pressureBar: pipeline.pressureBar,
        tapPressureBar: tap.pressureBar,
        flowRateLpm: pipeline.flowRateLpm,
        ph: tank.ph,
        turbidityNTU: tank.turbidityNTU,
        conductivity: tank.conductivity,
        mlPrediction,
        simpleDiagnosis: mlPrediction.diagnosisReason,
        alertMessage: mlPrediction.diagnosisReason,
        severity: (mlPrediction.isBrokenPipePredicted ? 'Critical' : 'Normal') as any,
        recordedAt: 'Live Real-Time Stream'
      };
    }
    return activeTabComplaint.sensorData || getComplaintSensorData(activeTabComplaint);
  }, [sensorSource, activeTabComplaint, liveTelemetry]);

  const activeConditionLevel = React.useMemo(() => {
    return getMLConditionLevel(activeTabSensorData, activeTabComplaint?.urgency || 'Low', activeTabComplaint?.status || 'Submitted');
  }, [activeTabSensorData, activeTabComplaint]);

  const activeConditionStyles = getMLConditionStyles(activeConditionLevel);

  // 1-Tap Resolve Action: Marks complaint resolved and moves to history
  const handleQuickResolve = (complaintId: string) => {
    updateComplaintStatus(
      complaintId,
      'Resolved',
      'Resolved: Pipeline repaired on site, optimal pure water flow restored.'
    );

    setAlertSuccessBanner(
      `✅ Complaint #${complaintId} marked resolved.`
    );

    // If currently selected in ML diagnosis was resolved, pick the next active one or municipal
    const remaining = activeMLComplaints.filter((c) => c.id !== complaintId);
    if (remaining.length > 0) {
      setSelectedComplaintId(remaining[0].id);
      setSensorSource(remaining[0].id);
    } else {
      setSelectedComplaintId('municipal');
      setSensorSource('municipal');
    }

    setTimeout(() => {
      setAlertSuccessBanner(null);
    }, 4500);
  };

  // Live "Update to ML" on selected complaint or municipal grid
  const handleUpdateSelectedComplaintML = () => {
    setIsUpdatingTabML(true);
    setTimeout(() => {
      if (activeTabComplaint) {
        const target = complaints.find((c) => c.id === activeTabComplaint.id);
        if (target) {
          const tank = { ph: 7.25, turbidityNTU: 0.40, conductivity: 295 };
          const pipeline = { flowRateLpm: 420, pressureBar: 2.40 };
          const tap = { pressureBar: 1.30 };
          const mlPrediction = computeMLBrokenPipePrediction(pipeline.pressureBar, pipeline.flowRateLpm, tap.pressureBar, tank);
          const newDiagnosis = 'ML Model confirms pipeline integrity: Variations in pressure within nominal tolerance (ΔP: 0.00 bar). Storage tank purity optimal across pH, Turbidity, and Conductivity.';

          updateComplaintMLDiagnosis(target.id, {
            tank,
            pipeline,
            tap,
            pressureBar: pipeline.pressureBar,
            tapPressureBar: tap.pressureBar,
            flowRateLpm: pipeline.flowRateLpm,
            turbidityNTU: tank.turbidityNTU,
            ph: tank.ph,
            conductivity: tank.conductivity,
            temperatureC: 26.8,
            mlPrediction,
            simpleDiagnosis: newDiagnosis,
            alertMessage: newDiagnosis,
            severity: 'Normal'
          });
        }
        setAlertSuccessBanner(`Updated to ML! Sensor readings refreshed for #${activeTabComplaint.id}.`);
      } else {
        setAlertSuccessBanner(`Live Municipal Telemetry Stream synchronized in real-time.`);
      }

      setIsUpdatingTabML(false);
      setTimeout(() => setAlertSuccessBanner(null), 3500);
    }, 450);
  };

  // Dispatch Alert to Officer Rajesh Kumar from ML Sensor Part
  const handleSendSensorAlert = () => {
    if (!activeTabComplaint || !activeTabSensorData) return;

    if (activeTabComplaint.urgency === 'Emergency' && activeTabComplaint.sensorData?.alertMessage) {
      setAlertSuccessBanner(`Officer Rajesh Kumar has already been alerted for #${activeTabComplaint.id}.`);
      setTimeout(() => {
        setAlertSuccessBanner(null);
      }, 3500);
      return;
    }

    const alertMessage = `Sensors report: ${activeTabSensorData.simpleDiagnosis || activeTabSensorData.alertMessage}`;

    updateComplaintMLDiagnosis(activeTabComplaint.id, {
      ...activeTabSensorData,
      alertMessage,
      severity: 'Warning'
    });

    updateComplaintStatus(
      activeTabComplaint.id,
      activeTabComplaint.status === 'Submitted' ? 'Assigned' : activeTabComplaint.status,
      `Emergency alert dispatched to Officer Rajesh Kumar.`
    );

    setAlertSuccessBanner(`Sensor dispatch sent to Officer Rajesh Kumar for #${activeTabComplaint.id}!`);
    setTimeout(() => {
      setAlertSuccessBanner(null);
    }, 4000);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* ============================================================== */}
      {/* 🌟 2-WAY PARTS SWITCHER: CITIZEN vs LIVE SENSORS & ML */}
      {/* ============================================================== */}
      <div className="p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-1.5">
        {/* PART 1: MY COMPLAINTS */}
        <button
          type="button"
          onClick={() => setActivePart('complaints')}
          className={`flex-1 py-2.5 px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activePart === 'complaints'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">My Complaints</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
              activePart === 'complaints' ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {activeComplaintsList.length}
          </span>
        </button>

        {/* PART 2: LIVE SENSORS & ML HEALTH */}
        <button
          type="button"
          onClick={() => setActivePart('ml_diagnosis')}
          className={`flex-1 py-2.5 px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activePart === 'ml_diagnosis'
              ? 'bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Live Sensors & ML</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
              activePart === 'ml_diagnosis' ? 'bg-cyan-400 text-slate-900' : 'bg-cyan-100 text-cyan-800'
            }`}
          >
            Live
          </span>
        </button>
      </div>

      {/* RESOLUTION SUCCESS BANNER */}
      {alertSuccessBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white shadow-md flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold leading-tight">{alertSuccessBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertSuccessBanner(null)}
            className="text-[10px] font-black uppercase tracking-wider bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg shrink-0 cursor-pointer transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 📋 PART 1: CITIZEN COMPLAINTS                                  */}
      {/* ACTIVE GRIEVANCES (RESOLVED COMPLAINTS MOVE TO HISTORY)        */}
      {/* ============================================================== */}
      {activePart === 'complaints' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* HEADER ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {currentRole === 'officer'
                    ? t.officerFieldTasks || 'Assigned Complaints'
                    : 'Citizen Complaints'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-cyan-100 text-cyan-800 border border-cyan-200">
                  {filteredComplaints.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Active municipal grievances. When a problem is resolved, it is automatically moved to history.
              </p>
            </div>

            {currentRole === 'citizen' && (
              <button
                onClick={() => onNewComplaint()}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition active:scale-95 shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Problem</span>
              </button>
            )}
          </div>

          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by title, keyword, or ward..."
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 shadow-2xs"
            />
          </div>

          {/* STATUS QUICK FILTERS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setShowResolvedArchive(false);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'ALL' && !showResolvedArchive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Active Grievances ({activeComplaintsList.length})
            </button>
            <button
              onClick={() => {
                setStatusFilter('Submitted');
                setShowResolvedArchive(false);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'Submitted'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              Waiting for Officer
            </button>
            <button
              onClick={() => {
                setStatusFilter('In Progress');
                setShowResolvedArchive(false);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'In Progress'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              Fixing on Site
            </button>
            <button
              onClick={() => {
                setStatusFilter('Resolved_Archive');
                setShowResolvedArchive(true);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'Resolved_Archive' || showResolvedArchive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Resolved History ({resolvedComplaintsList.length})</span>
            </button>
          </div>

          {/* ACTIVE COMPLAINTS LIST */}
          {filteredComplaints.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 my-4 shadow-sm space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">
                  {showResolvedArchive ? 'No resolved records found' : 'All complaints resolved!'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {searchQuery
                    ? 'No problem matches your search query.'
                    : showResolvedArchive
                    ? 'No resolved history available yet.'
                    : 'You have no pending complaints. When problems are resolved, they are moved to history.'}
                </p>
              </div>
              <button
                onClick={() => onNewComplaint()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-sm hover:bg-cyan-700 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report a Water Problem</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.map((complaint) => {
                const isResolved = complaint.status === 'Resolved';

                return (
                  <div
                    key={complaint.id}
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setActiveModal('complaintDetail');
                    }}
                    className={`group p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border transition-all duration-200 hover:shadow-md hover:border-cyan-400 cursor-pointer ${
                      isResolved
                        ? 'border-emerald-200 bg-emerald-50/10'
                        : 'border-slate-200/90'
                    }`}
                  >
                    {/* Top Row: Category Icon, ID, Category & Status Badge */}
                    <div className="flex items-start gap-2.5 sm:gap-3.5 mb-2 sm:mb-2.5">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComplaint(complaint);
                          setActiveModal('complaintDetail');
                        }}
                        className="cursor-pointer group-hover:scale-105 transition-transform shrink-0"
                        title="Tap to view complaint details"
                      >
                        <ComplaintCategoryIcon category={complaint.category} size="md" glow />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[10px] sm:text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                              {complaint.id}
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-slate-700">
                              {complaint.category}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                              complaint.status
                            )}`}
                          >
                            {getStatusText(complaint.status)}
                          </span>
                        </div>

                        {/* Problem Title */}
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-cyan-800 transition-colors truncate">
                          {complaint.title}
                        </h3>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal mb-2 sm:mb-2.5 line-clamp-2">
                      {cleanDescription(complaint.description)}
                    </p>

                    {/* Citizen Complaint Status Progress Tracker */}
                    <div className="my-2 p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100/90 space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-extrabold">
                        <span className={complaint.status === 'Submitted' ? 'text-blue-700 font-black' : 'text-slate-400'}>
                          1. Logged
                        </span>
                        <span className={complaint.status === 'Assigned' ? 'text-purple-700 font-black' : 'text-slate-400'}>
                          2. Assigned
                        </span>
                        <span className={complaint.status === 'In Progress' ? 'text-amber-700 font-black' : 'text-slate-400'}>
                          3. Fixing on Site
                        </span>
                        <span className={complaint.status === 'Resolved' ? 'text-emerald-700 font-black' : 'text-slate-400'}>
                          4. Resolved
                        </span>
                      </div>
                      <div className="w-full bg-slate-200/90 h-1.5 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-500 ${
                            complaint.status === 'Resolved'
                              ? 'w-full bg-emerald-500'
                              : complaint.status === 'In Progress'
                              ? 'w-3/4 bg-amber-500'
                              : complaint.status === 'Assigned'
                              ? 'w-1/2 bg-purple-500'
                              : 'w-1/4 bg-blue-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Card Footer: Action Buttons with full-width on mobile */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2.5 border-t border-slate-100 gap-2 flex-wrap sm:flex-nowrap">
                      <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                        Officer: <b className="text-slate-700">{complaint.assignedOfficerName || 'Rajesh Kumar'}</b>
                      </span>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedComplaint(complaint);
                            setActiveModal('complaintDetail');
                          }}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-md shadow-cyan-600/30 hover:shadow-lg ring-2 ring-cyan-400/40 hover:ring-cyan-300 transition-all active:scale-95 cursor-pointer shrink-0"
                        >
                          <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>View Status Details</span>
                          <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 🤖 PART 3: ML SENSOR DIAGNOSIS                                 */}
      {/* 5 SENSORS ONLY: pH, Turbidity, Flow, Pressure, Temperature     */}
      {/* (CURED COMPLAINTS ARE REMOVED FROM ML SENSOR DIAGNOSIS!)       */}
      {/* ============================================================== */}
      {activePart === 'ml_diagnosis' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* TOP BANNER */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white shadow-lg space-y-2 border border-cyan-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center font-black text-sm shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  ML Sensor Diagnosis
                </h3>
                <p className="text-xs text-cyan-200 font-medium">
                  Active pipeline telemetry: pH, Turbidity, Flow, Pressure and Temperature
                </p>
              </div>
            </div>
          </div>

          {/* SENSOR TELEMETRY SOURCE SELECTOR BAR */}
          <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 block">
                  Live Sensor Readings & ML Diagnosis
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500">
                  {sensorSource === 'municipal'
                    ? 'Displaying real-time municipal telemetry across Tank, Pipeline & Tap'
                    : `Displaying node telemetry for your complaint #${selectedComplaintId}`}
                </span>
              </div>

              {/* SYNC TO ML BUTTON */}
              <button
                type="button"
                onClick={handleUpdateSelectedComplaintML}
                disabled={isUpdatingTabML}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-[11px] sm:text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-60 shrink-0"
              >
                <RefreshCw className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${isUpdatingTabML ? 'animate-spin' : ''}`} />
                <span>{isUpdatingTabML ? 'Syncing...' : 'Sync Live'}</span>
              </button>
            </div>

            {/* Source selector buttons: Municipal Grid (Live) + Only THIS user's active complaints */}
            <div className="flex sm:grid sm:grid-cols-3 gap-2 overflow-x-auto pb-1 scrollbar-none">
              {/* Option 1: Live Municipal Supply Grid (Always available to citizens & officers) */}
              <button
                type="button"
                onClick={() => {
                  setSensorSource('municipal');
                  setSelectedComplaintId('municipal');
                }}
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between shrink-0 min-w-[200px] sm:min-w-0 flex-1 ${
                  sensorSource === 'municipal'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20 ring-2 ring-cyan-500/50'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-cyan-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className={`font-mono text-[10px] sm:text-[11px] font-bold ${sensorSource === 'municipal' ? 'text-cyan-300' : 'text-slate-500'}`}>
                    MUNICIPAL GRID
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500 text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                </div>
                <span className={`font-extrabold text-xs block truncate leading-snug ${sensorSource === 'municipal' ? 'text-white' : 'text-slate-900'}`}>
                  Ward 12 Feeder & Reservoir
                </span>
                <span className={`text-[10px] mt-1 block truncate font-medium ${sensorSource === 'municipal' ? 'text-slate-300' : 'text-slate-500'}`}>
                  📍 Municipal Water Network · 2.40 Bar
                </span>
              </button>

              {/* Option 2+: Only THIS Citizen's active complaints (Strict privacy, other users' complaints never shown!) */}
              {activeMLComplaints.map((c) => {
                const isSelected = sensorSource === c.id;
                const itemML = c.sensorData || getComplaintSensorData(c);
                const itemCondLevel = getMLConditionLevel(itemML, c.urgency, c.status);
                const itemCondStyles = getMLConditionStyles(itemCondLevel);

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSensorSource(c.id);
                      setSelectedComplaintId(c.id);
                    }}
                    className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between shrink-0 min-w-[200px] sm:min-w-0 flex-1 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20 ring-2 ring-cyan-500/50'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-cyan-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <span className={`font-mono text-[10px] sm:text-[11px] font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`}>
                        {c.id}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isSelected
                            ? itemCondLevel === 'Very Danger'
                              ? 'bg-rose-500 text-white'
                              : 'bg-amber-400 text-slate-950 font-black'
                            : itemCondStyles.pillBadgeClass
                        }`}
                      >
                        {itemCondStyles.tagText}
                      </span>
                    </div>
                    <span className={`font-extrabold text-xs block truncate leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {c.title}
                    </span>
                    <span className={`text-[10px] mt-1 block truncate font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      📍 {c.location}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

              {/* ML DIAGNOSIS RESULT BOX FOR SELECTED COMPLAINT */}
              <div className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl text-xs sm:text-[13px] text-slate-800 space-y-3 sm:space-y-3.5 shadow-2xs ${activeConditionStyles.resultBoxBorder}`}>
                <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-700 shrink-0" />
                    <span className="font-black uppercase tracking-wider text-[10px] sm:text-[11px] text-slate-900">
                      ML Diagnosis Result
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase font-black tracking-wider ${activeConditionStyles.pillBadgeClass}`}>
                      {activeConditionStyles.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                      {activeTabComplaint ? `#${activeTabComplaint.id}` : 'Live Line'}
                    </span>

                    {activeTabComplaint && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedComplaint(activeTabComplaint);
                          setActiveModal('complaintDetail');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white shadow-xs ring-1 ring-cyan-400/50 hover:ring-cyan-300 transition-all active:scale-95 cursor-pointer"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3 stroke-[3]" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
                      <span>Sensor Network Analysis</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {activeTabSensorData?.sensorNode || 'Street Sensor'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-relaxed">
                    {activeTabSensorData?.simpleDiagnosis || activeTabSensorData?.alertMessage || 'Sensors checked and line operating.'}
                  </p>
                </div>

                {/* 1. ML BROKEN PIPE PREDICTION & PRESSURE VARIATION ENGINE */}
                {(() => {
                  const pipePressure = activeTabSensorData?.pipeline?.pressureBar ?? activeTabSensorData?.pressureBar ?? 2.40;
                  const pipeFlow = activeTabSensorData?.pipeline?.flowRateLpm ?? activeTabSensorData?.flowRateLpm ?? 420;
                  const tapPressure = activeTabSensorData?.tap?.pressureBar ?? activeTabSensorData?.tapPressureBar ?? 1.30;
                  const tankPh = activeTabSensorData?.tank?.ph ?? activeTabSensorData?.ph ?? 7.25;
                  const tankTurbidity = activeTabSensorData?.tank?.turbidityNTU ?? activeTabSensorData?.turbidityNTU ?? 0.75;
                  const tankConductivity = activeTabSensorData?.tank?.conductivity ?? activeTabSensorData?.conductivity ?? 310;

                  const mlPred = activeTabSensorData?.mlPrediction || computeMLBrokenPipePrediction(
                    pipePressure,
                    pipeFlow,
                    tapPressure,
                    { ph: tankPh, turbidityNTU: tankTurbidity, conductivity: tankConductivity }
                  );

                  const isBroken = mlPred.isBrokenPipePredicted;
                  const pipeDropPct = Math.min(100, Math.round((mlPred.pipelinePressureDropBar / 2.40) * 100));
                  const tapDropPct = Math.min(100, Math.round((mlPred.tapPressureDropBar / 1.30) * 100));

                  return (
                    <div className="pt-1 space-y-3 sm:space-y-4">
                      {/* HERO ML PREDICTION BANNER */}
                      <div
                        className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 relative overflow-hidden shadow-sm ${
                          isBroken
                            ? 'bg-gradient-to-br from-rose-50 via-white to-red-50/80 border-rose-300 ring-1 ring-rose-500/20'
                            : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50/80 border-emerald-300 ring-1 ring-emerald-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5 flex-wrap">
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <div
                              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                                isBroken
                                  ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-rose-600/30'
                                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-600/30'
                              }`}
                            >
                              {isBroken ? (
                                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3] animate-pulse" />
                              ) : (
                                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${
                                    isBroken
                                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  }`}
                                >
                                  {isBroken ? '🔴 Broken Pipe Predicted' : '🟢 Pipeline Intact'}
                                </span>
                                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                                  ML Confidence: {mlPred.brokenPipeProbability}%
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-base font-black text-slate-900 mt-0.5 leading-snug">
                                {isBroken
                                  ? 'Underground Pipe Fracture Identified via Pressure Variation'
                                  : 'Normal Pressure Dynamics & Safe Water Gradients'}
                              </h4>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider border ${
                                isBroken
                                  ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              }`}
                            >
                              {mlPred.leakSeverity}
                            </span>
                          </div>
                        </div>

                        {/* PRESSURE VARIATION (ΔP) COMPARISON PANEL - 2 EQUAL COLUMNS ON ALL SCREENS */}
                        <div className="mt-3 p-3 rounded-xl sm:rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs space-y-2.5">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Gauge className="w-3.5 h-3.5 text-cyan-600" />
                              <span>Pressure Variation (ΔP Analysis)</span>
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">
                              Nominal: Line 2.4 bar • Tap 1.3 bar
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {/* Underground Pipeline Pressure Variation */}
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-600 truncate">
                                  Underground Line
                                </span>
                                <span
                                  className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                    mlPred.pipelinePressureDropBar >= 0.5
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  ΔP -{mlPred.pipelinePressureDropBar.toFixed(2)}b
                                </span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="text-base sm:text-xl font-black font-mono text-slate-900">
                                  {pipePressure.toFixed(2)} <span className="text-[10px] sm:text-xs text-slate-500 font-sans">bar</span>
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
                                  Drop {pipeDropPct}%
                                </span>
                              </div>
                              {/* Gauge bar */}
                              <div className="w-full bg-slate-200 h-1.5 sm:h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    pipePressure < 1.7
                                      ? 'bg-gradient-to-r from-rose-500 to-red-600'
                                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(10, (pipePressure / 2.8) * 100))}%` }}
                                />
                              </div>
                            </div>

                            {/* Consumer Tap Pressure Variation */}
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-600 truncate">
                                  Consumer Tap
                                </span>
                                <span
                                  className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                    mlPred.tapPressureDropBar >= 0.4
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  ΔP -{mlPred.tapPressureDropBar.toFixed(2)}b
                                </span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="text-base sm:text-xl font-black font-mono text-slate-900">
                                  {tapPressure.toFixed(2)} <span className="text-[10px] sm:text-xs text-slate-500 font-sans">bar</span>
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
                                  Drop {tapDropPct}%
                                </span>
                              </div>
                              {/* Gauge bar */}
                              <div className="w-full bg-slate-200 h-1.5 sm:h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    tapPressure < 0.5
                                      ? 'bg-gradient-to-r from-rose-500 to-red-600'
                                      : 'bg-gradient-to-r from-emerald-500 to-sky-500'
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(10, (tapPressure / 1.6) * 100))}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* ML Reasoning Sentence */}
                          <div className="pt-1 border-t border-slate-100">
                            <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-relaxed italic">
                              💡 {mlPred.diagnosisReason}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 2. THE 3 DEDICATED PROJECT SENSOR TIERS (UN-CRAMPED 3-COLUMN & 2-COLUMN GRID) */}
                      <div className="space-y-2.5 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-cyan-600" />
                            <span>Project Sensors Telemetry (3 Tiers)</span>
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                            IoT Telemetry Active
                          </span>
                        </div>

                        {/* TIER 1: TANK SENSORS (pH, Turbidity, Conductivity) - 3 Balanced Columns on Mobile */}
                        <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-cyan-600" />
                              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                                🛢️ Storage Tank Sensors
                              </span>
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500">
                              pH • Turbidity • Conductivity
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                            {/* Tank Sensor 1: pH */}
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between text-center sm:text-left">
                              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-500 block truncate">pH</span>
                              <div className="my-0.5 flex items-baseline justify-center sm:justify-start gap-1">
                                <span className="text-base sm:text-xl font-black font-mono text-slate-900">{tankPh.toFixed(2)}</span>
                                <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">pH</span>
                              </div>
                              <span
                                className={`text-[8px] sm:text-[9px] font-black px-1 py-0.5 rounded block truncate ${
                                  tankPh < 6.5 || tankPh > 8.5
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {tankPh < 6.5 || tankPh > 8.5 ? 'Abnormal' : 'Balanced'}
                              </span>
                            </div>

                            {/* Tank Sensor 2: Turbidity */}
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between text-center sm:text-left">
                              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-500 block truncate">Turbidity</span>
                              <div className="my-0.5 flex items-baseline justify-center sm:justify-start gap-1">
                                <span className="text-base sm:text-xl font-black font-mono text-slate-900">{tankTurbidity.toFixed(2)}</span>
                                <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">NTU</span>
                              </div>
                              <span
                                className={`text-[8px] sm:text-[9px] font-black px-1 py-0.5 rounded block truncate ${
                                  tankTurbidity > 1.0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {tankTurbidity > 1.0 ? 'Elevated' : 'Clear'}
                              </span>
                            </div>

                            {/* Tank Sensor 3: Conductivity */}
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between text-center sm:text-left">
                              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-500 block truncate">Conductivity</span>
                              <div className="my-0.5 flex items-baseline justify-center sm:justify-start gap-0.5">
                                <span className="text-base sm:text-xl font-black font-mono text-slate-900">{tankConductivity}</span>
                                <span className="text-[8px] text-slate-400 font-sans hidden sm:inline">µS</span>
                              </div>
                              <span
                                className={`text-[8px] sm:text-[9px] font-black px-1 py-0.5 rounded block truncate ${
                                  tankConductivity > 550 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {tankConductivity > 550 ? 'High Ions' : 'Normal'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* TIER 2: UNDERGROUND PIPELINE SENSORS (Flow, Pressure) - 2 Columns on Mobile */}
                        <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-600" />
                              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                                🌐 Underground Pipeline Sensors
                              </span>
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500">
                              Pressure & Flow Rate
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                            {/* Pipeline Sensor 1: Pressure */}
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-50/40 border border-blue-200/70 flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-600 truncate">Pressure</span>
                                <span
                                  className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded ${
                                    pipePressure < 1.7
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  {pipePressure < 1.7 ? 'Drop' : 'Nominal'}
                                </span>
                              </div>
                              <div className="my-0.5 flex items-baseline gap-1">
                                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">{pipePressure.toFixed(2)}</span>
                                <span className="text-[10px] sm:text-xs text-slate-500 font-sans font-bold">bar</span>
                              </div>
                              <span className="text-[8px] sm:text-[9px] text-slate-500 truncate">
                                Nominal: 2.40 bar
                              </span>
                            </div>

                            {/* Pipeline Sensor 2: Flow */}
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-50/40 border border-blue-200/70 flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-600 truncate">Flow Rate</span>
                                <span
                                  className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded ${
                                    pipeFlow > 480
                                      ? 'bg-rose-100 text-rose-700'
                                      : pipeFlow < 200
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  {pipeFlow > 480 ? 'Surge' : 'Steady'}
                                </span>
                              </div>
                              <div className="my-0.5 flex items-baseline gap-1">
                                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">{pipeFlow}</span>
                                <span className="text-[10px] sm:text-xs text-slate-500 font-sans font-bold">L/m</span>
                              </div>
                              <span className="text-[8px] sm:text-[9px] text-slate-500 truncate">
                                Nominal: 380–450
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* TIER 3: TAP SENSOR (Pressure) */}
                        <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-teal-600" />
                              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                                🚰 Consumer Tap Sensor
                              </span>
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500">
                              Delivery Pressure
                            </span>
                          </div>

                          <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-teal-50/40 border border-teal-200/70 flex items-center justify-between gap-2 sm:gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-600">
                                  Delivery Pressure
                                </span>
                                <span
                                  className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded ${
                                    tapPressure < 0.6
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  {tapPressure < 0.6 ? 'Starvation / Low' : 'Adequate'}
                                </span>
                              </div>
                              <span className="text-[9px] sm:text-[10px] text-slate-500 block mt-0.5 truncate">
                                Nominal: 1.30 bar • ΔP -{mlPred.tapPressureDropBar.toFixed(2)} bar
                              </span>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="flex items-baseline justify-end gap-1">
                                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">{tapPressure.toFixed(2)}</span>
                                <span className="text-[10px] sm:text-xs text-slate-500 font-sans font-bold">bar</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* ACTION BUTTONS & SENSOR LOCATION BAR */}
              <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/90 space-y-2.5 sm:space-y-3">
                {/* Address Row */}
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Sensor Network Location
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 block truncate">
                      {activeTabComplaint?.location || 'Field Pipeline Network'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons Row - Mobile Touch Friendly */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full pt-1 border-t border-slate-200/60">
                  {/* View Details Action */}
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTabComplaint) {
                        setSelectedComplaint(activeTabComplaint);
                        setActiveModal('complaintDetail');
                      }
                    }}
                    className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md shadow-cyan-600/30 hover:shadow-lg ring-2 ring-cyan-400/50 hover:ring-cyan-300 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMapPointId(activeTabComplaint?.id === 'AQUA-2026-1042' ? 'pt_damaged_pipe_1' : null);
                        setActiveTab('map');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                      <span>View on Map</span>
                    </button>

                    {/* Dispatch Alert to Officer */}
                    <button
                      type="button"
                      onClick={handleSendSensorAlert}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                      title="Send direct alert notification to field officer"
                    >
                      <Send className="w-3 h-3 text-cyan-400" />
                      <span>Dispatch Alert</span>
                    </button>
                  </div>
                </div>
              </div>
        </div>
      )}
    </div>
  );
};
