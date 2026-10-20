import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficerRatingsModal } from '../OfficerRatingsModal';
import {
  User,
  LogOut,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
  X,
  Edit2,
  Gauge,
  CloudRain,
  Truck,
  TestTube,
  Star,
  Calculator,
  Sparkles,
  Calendar,
  UserCheck
} from 'lucide-react';

export const MoreScreen: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    updateUserProfile,
    currentRole,
    complaints,
    rateOfficer,
    officerRatingSummary,
    logout,
    t
  } = useApp();

  // Modals state
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [meterModalOpen, setMeterModalOpen] = useState(false);
  const [rainwaterModalOpen, setRainwaterModalOpen] = useState(false);
  const [tankerModalOpen, setTankerModalOpen] = useState(false);
  const [testKitModalOpen, setTestKitModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [officerRatingsModalOpen, setOfficerRatingsModalOpen] = useState(false);

  // Edit profile states
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editMobile, setEditMobile] = useState(currentUser?.mobile || '');
  const [editAddress, setEditAddress] = useState(currentUser?.address || '');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Meter Reading State
  const [currentReading, setCurrentReading] = useState(1482.4);
  const [inputReading, setInputReading] = useState('1492.0');
  const [meterSavedSuccess, setMeterSavedSuccess] = useState(false);

  // Rainwater Calculator State
  const [roofArea, setRoofArea] = useState(1200);
  const [auditRequested, setAuditRequested] = useState(false);

  // Priority Tanker State
  const [tankerCapacity, setTankerCapacity] = useState<'3000L' | '6000L' | '9000L'>('6000L');
  const [tankerBookedSuccess, setTankerBookedSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Free Kit State
  const [kitRequested, setKitRequested] = useState(false);

  // Officer Rating State (For problem checked & cleared by officer)
  const resolvedComplaints = complaints.filter(
    (c) => c.status === 'Resolved' || c.timeline?.some((t) => t.status === 'Resolved')
  );
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(
    resolvedComplaints[0]?.id || 'AQUA-2026-1015'
  );

  const activeResolvedComplaint =
    resolvedComplaints.find((c) => c.id === selectedComplaintId) || resolvedComplaints[0];

  const [officerStars, setOfficerStars] = useState<number>(
    activeResolvedComplaint?.officerRating?.stars || 5
  );
  const [officerFeedback, setOfficerFeedback] = useState<string>(
    activeResolvedComplaint?.officerRating?.feedback ||
      'Officer inspected the site promptly, verified the pipeline, and cleared the problem cleanly.'
  );
  const [officerRatingSubmitted, setOfficerRatingSubmitted] = useState(false);

  const handleSelectComplaintForRating = (id: string) => {
    setSelectedComplaintId(id);
    const found = resolvedComplaints.find((c) => c.id === id);
    if (found?.officerRating) {
      setOfficerStars(found.officerRating.stars);
      setOfficerFeedback(found.officerRating.feedback || '');
    } else {
      setOfficerStars(5);
      setOfficerFeedback('Officer inspected the site promptly, verified the pipeline, and cleared the problem cleanly.');
    }
    setOfficerRatingSubmitted(false);
  };

  const handleOfficerRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResolvedComplaint) return;
    rateOfficer(activeResolvedComplaint.id, officerStars, officerFeedback.trim());
    setOfficerRatingSubmitted(true);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateUserProfile({
        name: editName,
        mobile: editMobile,
        address: editAddress
      });
      setProfileSaveSuccess(true);
      setTimeout(() => {
        setProfileSaveSuccess(false);
        setProfileEditOpen(false);
      }, 1200);
    }
  };

  const handleSaveMeter = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputReading);
    if (!isNaN(val) && val >= currentReading) {
      setCurrentReading(val);
      setMeterSavedSuccess(true);
      setTimeout(() => {
        setMeterSavedSuccess(false);
        setMeterModalOpen(false);
      }, 1400);
    }
  };

  const handleBookTanker = () => {
    const randomId = 'TNK-2026-' + Math.floor(1000 + Math.random() * 9000);
    setBookingId(randomId);
    setTankerBookedSuccess(true);
    setTimeout(() => {
      setTankerBookedSuccess(false);
      setTankerModalOpen(false);
    }, 2500);
  };

  const estimatedLiters = Math.round(roofArea * 62.5); // approximate annual liters saved based on Chennai avg rainfall

  return (
    <div className="space-y-4 pb-24">
      {/* 1. USER MINI PROFILE CARD (KEPT) */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white border border-slate-700/80 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-extrabold text-lg">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white truncate">
                {currentUser?.name || 'Citizen User'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                {currentUser?.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate mt-0.5">
              {currentUser?.mobile} • {currentUser?.email}
            </p>
            <p className="text-[11px] text-cyan-300/90 font-medium truncate mt-0.5">
              📍 {currentUser?.village && currentUser?.gramPanchayat
                ? `${currentUser.village}, ${currentUser.gramPanchayat} (${currentUser.district || ''}, ${currentUser.state || ''})`
                : (currentUser?.ward || 'Ward 12 - Mylapore')}
            </p>
          </div>
          <button
            onClick={() => setProfileEditOpen(true)}
            title="Edit Profile"
            className="p-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold"
          >
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
      </div>

      {/* 2. REPLACED CONTENT: FRESH CIVIC CITIZEN UTILITIES */}
      <div className="space-y-2.5">
        {/* A. MY PROFILE CARD (KEPT) */}
        <button
          onClick={() => setProfileEditOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-xs transition flex items-center justify-between text-left group gap-2"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block font-bold text-sm text-slate-800 truncate">
                {t.myProfile}
              </span>
              <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                Update residential address, contact number & ward
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0 ml-1" />
        </button>

        {/* B. WATER METER & MONTHLY USAGE TRACKER (NEW) */}
        <button
          onClick={() => setMeterModalOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-xs transition flex items-center justify-between text-left group gap-2"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Gauge className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-sm text-slate-800">
                  Water Meter & Consumption
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  Slab Tier 1
                </span>
              </div>
              <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                Current reading: {currentReading} kL • 74% subsidized quota used
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0 ml-1" />
        </button>

        {/* C. RAINWATER HARVESTING & SUBSIDY CALCULATOR (NEW) */}
        <button
          onClick={() => setRainwaterModalOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-xs transition flex items-center justify-between text-left group gap-2"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CloudRain className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-sm text-slate-800">
                  Rainwater Harvesting & Subsidy
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 shrink-0">
                  50% Rebate
                </span>
              </div>
              <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                Rooftop savings calculator & government subsidy audit
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0 ml-1" />
        </button>

        {/* D. WATER TANKER BOOKING */}
        <button
          onClick={() => setTankerModalOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-xs transition flex items-center justify-between text-left group gap-2"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-sm text-slate-800">
                  Order Water Tanker
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 shrink-0">
                  Delivery
                </span>
              </div>
              <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                Order 3,000L or 6,000L water tanker for your home
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0 ml-1" />
        </button>

        {/* E. HOME WATER QUALITY TESTING KIT */}
        <button
          onClick={() => setTestKitModalOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-xs transition flex items-center justify-between text-left group gap-2"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <TestTube className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-sm text-slate-800">
                  Free Water Testing Kit
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  Free
                </span>
              </div>
              <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                Get testing strips delivered to check your water at home
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0 ml-1" />
        </button>

        {/* F. OFFICER SERVICE RATING (ONLY IN CITIZEN ROLE) */}
        {currentRole === 'citizen' && (
          <button
            onClick={() => {
              setOfficerRatingSubmitted(false);
              setRatingModalOpen(true);
            }}
            className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition flex items-center justify-between text-left group gap-2"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-800">
                    {t.rateWaterOfficer}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    {t.officerFixed}
                  </span>
                </div>
                <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                  {t.rateWaterOfficerDesc}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0 ml-1" />
          </button>
        )}

        {/* G. LOGOUT BUTTON */}
        <button
          onClick={() => setLogoutConfirmOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 hover:bg-rose-100/90 transition flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm text-rose-700">
                {t.logout}
              </span>
              <span className="block text-[11px] text-rose-500">
                Sign out and return to login
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-600 transition-colors" />
        </button>
      </div>

      {/* 24/7 HELPLINE FOOTER */}
      <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-center">
        <div className="flex items-center justify-center gap-2 text-cyan-800 font-extrabold text-sm mb-1">
          <PhoneCall className="w-4 h-4 text-cyan-600" />
          <span>24/7 Municipal Water Helpline: 1800-425-AQUA</span>
        </div>
        <p className="text-[11px] text-cyan-700">
          Municipal Water Board • Citizen Help Desk
        </p>
      </div>

      {/* ----------------- MODALS ----------------- */}

      {/* 1. EDIT PROFILE MODAL (KEPT) */}
      {profileEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setProfileEditOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Edit Citizen Profile
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Keep your contact and address up to date for ward water alerts.
            </p>

            {profileSaveSuccess && (
              <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Profile successfully updated!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Municipal Ward</label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.ward || 'Ward 12 - Mylapore'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProfileEditOpen(false)}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. METER READING SUBMISSION MODAL (NEW) */}
      {meterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setMeterModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Household Water Meter
                </h3>
                <p className="text-[11px] text-slate-500">
                  Consumer No: MET-CHE-89420 • Ward 12
                </p>
              </div>
            </div>

            {meterSavedSuccess && (
              <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>New meter reading logged! Estimated bill: ₹135.00</span>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Last Verified Reading:</span>
                <span className="font-bold text-slate-800">{currentReading} kL</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Monthly Subsidized Quota:</span>
                <span className="font-bold text-emerald-700">25.0 kL (18.5 kL used)</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-[74%] h-full bg-teal-500 rounded-full" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Tier 1 Rate: ₹7.00/kL</span>
                <span>Tier 2 Threshold: &gt; 25.0 kL</span>
              </div>
            </div>

            <form onSubmit={handleSaveMeter} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter Current Dial Numbers (kL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={currentReading}
                  required
                  value={inputReading}
                  onChange={(e) => setInputReading(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-mono"
                  placeholder="e.g. 1492.0"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Must be equal to or higher than {currentReading} kL
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMeterModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Save Meter Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. RAINWATER HARVESTING CALCULATOR MODAL (NEW) */}
      {rainwaterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setRainwaterModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Rainwater Harvesting Scheme
                </h3>
                <p className="text-[11px] text-slate-500">
                  Government 50% Subsidy & Tax Rebate
                </p>
              </div>
            </div>

            {auditRequested && (
              <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>RWH Audit request submitted! An engineer will visit your address this week.</span>
              </div>
            )}

            <div className="space-y-3 my-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Rooftop Area (Square Feet):</span>
                  <span className="text-blue-600">{roofArea} sq. ft</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="4000"
                  step="50"
                  value={roofArea}
                  onChange={(e) => setRoofArea(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 text-center">
                <span className="text-[11px] text-blue-700 font-semibold uppercase block">
                  Estimated Rainwater Harvestable:
                </span>
                <span className="text-2xl font-black text-blue-900 block my-1">
                  {estimatedLiters.toLocaleString()} Liters / Year
                </span>
                <p className="text-[11px] text-blue-700">
                  Can provide up to <b>{Math.round(estimatedLiters / 135)} days</b> of domestic water for a family of 4.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div>• <b>50% Subsidy:</b> Up to ₹25,000 for percolation pit construction.</div>
                <div>• <b>Property Tax Rebate:</b> 5% rebate every year once RWH is certified.</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRainwaterModalOpen(false)}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setAuditRequested(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Request Free RWH Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRIORITY TANKER SOS MODAL (NEW) */}
      {tankerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setTankerModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Priority Water Tanker Booking
                </h3>
                <p className="text-[11px] text-slate-500">
                  Fast municipal delivery to your household sump
                </p>
              </div>
            </div>

            {tankerBookedSuccess && (
              <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>
                  Booking Confirmed! Code: <b>{bookingId}</b>. Tanker is en route (ETA ~45 mins).
                </span>
              </div>
            )}

            <div className="space-y-3 my-3">
              <label className="block text-xs font-bold text-slate-700">
                Select Tanker Capacity:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['3000L', '6000L', '9000L'] as const).map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setTankerCapacity(cap)}
                    className={`py-3 px-2 rounded-2xl border text-center transition ${
                      tankerCapacity === cap
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'
                    }`}
                  >
                    <span className="block text-sm">{cap}</span>
                    <span className="block text-[10px] opacity-80 mt-0.5">
                      {cap === '3000L' ? '₹450' : cap === '6000L' ? '₹750' : '₹1,050'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Delivery Address:</span>
                  <span className="font-bold text-slate-800">{currentUser?.address || 'Mylapore'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact Mobile:</span>
                  <span className="font-bold text-slate-800">{currentUser?.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Arrival:</span>
                  <span className="font-bold text-amber-700">Within 45 - 60 Minutes</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTankerModalOpen(false)}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBookTanker}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow"
              >
                Confirm Tanker Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TESTING KIT REQUEST MODAL (NEW) */}
      {testKitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setTestKitModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TestTube className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Free Water Quality Testing Strips
                </h3>
                <p className="text-[11px] text-slate-500">
                  Ward 12 Municipal Health Initiative
                </p>
              </div>
            </div>

            {kitRequested ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-2 my-3">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Free Test Kit Dispatched!</span>
                </div>
                <p className="leading-relaxed">
                  Your 5-in-1 test strip packet (pH, Chlorine, Hardness, Lead, Iron) will be delivered to <b>{currentUser?.address || 'your registered address'}</b> within 2 business days.
                </p>
              </div>
            ) : (
              <div className="space-y-3 my-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  As part of the municipal water safety program, every citizen can receive a free home testing strip packet to verify their drinking water purity.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div>• <b>Tests for:</b> Residual Chlorine, pH balance, Hardness, Dissolved Iron.</div>
                  <div>• <b>Result time:</b> 60 seconds instant color match chart.</div>
                  <div>• <b>Cost:</b> 100% Free (Provided by City Water Board).</div>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTestKitModalOpen(false)}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                Close
              </button>
              {!kitRequested && (
                <button
                  type="button"
                  onClick={() => setKitRequested(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Send Free Kit to My Address
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. OFFICER SERVICE RATING MODAL */}
      {ratingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setRatingModalOpen(false);
                setOfficerRatingSubmitted(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Rate Water Officer
                </h3>
                <p className="text-[11px] text-slate-500">
                  Feedback for problems checked & cleared by field officers
                </p>
              </div>
            </div>

            {officerRatingSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-2 my-3 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <span className="block font-bold text-sm">Rating Submitted Successfully!</span>
                <p className="text-emerald-700 leading-relaxed">
                  Thank you! Your <b>{officerStars}-star</b> rating for{' '}
                  <b>{activeResolvedComplaint?.assignedOfficerName || 'the Water Officer'}</b> has been saved for complaint #{activeResolvedComplaint?.id}.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRatingModalOpen(false);
                      setOfficerRatingSubmitted(false);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : resolvedComplaints.length === 0 ? (
              <div className="p-5 text-center bg-slate-50 rounded-2xl border border-slate-200 my-3 space-y-2">
                <UserCheck className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-sm text-slate-800">No Problems Cleared Yet</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  When a field water officer visits, checks, and clears a water complaint, you will be able to submit your rating and feedback for the officer here.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setRatingModalOpen(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOfficerRatingSubmit} className="space-y-3.5 my-2">
                {/* Select complaint if multiple cleared complaints */}
                {resolvedComplaints.length > 1 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Choose Cleared Problem:
                    </label>
                    <select
                      value={selectedComplaintId}
                      onChange={(e) => handleSelectComplaintForRating(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                    >
                      {resolvedComplaints.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.id} - {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Officer inspection detail card */}
                {activeResolvedComplaint && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-sky-50/40 to-slate-50 border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs">
                          {activeResolvedComplaint.assignedOfficerName?.charAt(0) || 'O'}
                        </div>
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 block">
                            {activeResolvedComplaint.assignedOfficerName || 'Rajesh Kumar'}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Field Officer • {activeResolvedComplaint.ward}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Problem Cleared</span>
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-amber-200/50 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800">Problem: </span>
                      <span>{activeResolvedComplaint.title}</span>
                    </div>

                    {activeResolvedComplaint.officerNotes && activeResolvedComplaint.officerNotes.length > 0 && (
                      <div className="p-2 rounded-xl bg-white/80 border border-amber-100 text-[11px] text-amber-900 italic">
                        "{activeResolvedComplaint.officerNotes[activeResolvedComplaint.officerNotes.length - 1]}"
                      </div>
                    )}
                  </div>
                )}

                {/* If already rated banner */}
                {activeResolvedComplaint?.officerRating && (
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Previously Rated: </span>
                      <span className="text-amber-600 font-extrabold">
                        {activeResolvedComplaint.officerRating.stars} ★
                      </span>
                      <span className="text-[10px] text-purple-700 ml-1.5">
                        ({activeResolvedComplaint.officerRating.ratedAt})
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-600 font-medium">Update below</span>
                  </div>
                )}

                {/* Star rating selector */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                    <span>Rate Officer's Service:</span>
                    <span className="text-amber-600 font-extrabold">
                      {officerStars === 5
                        ? '⭐⭐⭐⭐⭐ 5 Stars (Excellent)'
                        : officerStars === 4
                        ? '⭐⭐⭐⭐ 4 Stars (Very Good)'
                        : officerStars === 3
                        ? '⭐⭐⭐ 3 Stars (Good)'
                        : officerStars === 2
                        ? '⭐⭐ 2 Stars (Fair)'
                        : '⭐ 1 Star (Needs Improvement)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setOfficerStars(star)}
                        className={`p-2 rounded-xl transition ${
                          star <= officerStars
                            ? 'text-amber-400 hover:scale-110'
                            : 'text-slate-300 hover:text-slate-400'
                        }`}
                      >
                        <Star className="w-7 h-7 fill-current stroke-amber-500" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Citizen Feedback / Comments:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={officerFeedback}
                    onChange={(e) => setOfficerFeedback(e.target.value)}
                    placeholder="e.g. Officer checked the spot on time and cleared the problem cleanly."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRatingModalOpen(false)}
                    className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow"
                  >
                    Submit Officer Rating
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. LOGOUT CONFIRMATION DIALOG (KEPT) */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 mb-1">
              Log Out of AquaCare?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {t.logoutConfirm} You will need to log back in to submit complaints or track work orders.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogoutConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setLogoutConfirmOpen(false);
                  logout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
