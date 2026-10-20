import React, { useState, useId } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ADMINISTRATIVE_HIERARCHY,
  getDistrictsForState,
  getVillagesForDistrict,
  getGramPanchayatsForVillage,
  formatCitizenAddress
} from '../../data/administrativeHierarchy';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import {
  Droplets,
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  Home,
  Check,
  Sparkles,
  Cloud,
  ChevronDown
} from 'lucide-react';

export const RegisterScreen: React.FC = () => {
  const { setCurrentScreen, registerCitizen, t } = useApp();

  const stateSelectId = useId();
  const districtSelectId = useId();
  const villageSelectId = useId();
  const gpSelectId = useId();

  // Basic Account Credentials
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Cascading Address Dropdowns: State -> District -> Village -> Grampanchayath
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState('Bengaluru Rural');
  const [districtSearch, setDistrictSearch] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('Arasinakunte');
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState('Arasinakunte Gram Panchayat');

  // Custom text fallback if "+ Other" is picked
  const [isCustomVillage, setIsCustomVillage] = useState(false);
  const [customVillageText, setCustomVillageText] = useState('');
  const [isCustomGP, setIsCustomGP] = useState(false);
  const [customGPText, setCustomGPText] = useState('');

  // Detailed Text Inputs
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('562123');

  // Terms and Status
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Derived options based on cascade
  const availableDistricts = getDistrictsForState(selectedState);
  const filteredDistricts = districtSearch.trim()
    ? availableDistricts.filter((d) => d.name.toLowerCase().includes(districtSearch.toLowerCase().trim()))
    : availableDistricts;

  const availableVillages = getVillagesForDistrict(selectedState, selectedDistrict);
  const availableGPs = getGramPanchayatsForVillage(
    selectedState,
    selectedDistrict,
    isCustomVillage ? '' : selectedVillage
  );

  // Handle State Change
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    setDistrictSearch('');
    const districts = getDistrictsForState(newState);
    if (districts.length > 0) {
      const firstDistrict = districts[0].name;
      setSelectedDistrict(firstDistrict);

      const villages = getVillagesForDistrict(newState, firstDistrict);
      if (villages.length > 0) {
        const firstVillage = villages[0];
        setSelectedVillage(firstVillage.name);
        setIsCustomVillage(false);
        if (firstVillage.defaultPincode) setPincode(firstVillage.defaultPincode);

        if (firstVillage.gramPanchayats.length > 0) {
          setSelectedGramPanchayat(firstVillage.gramPanchayats[0].name);
          setIsCustomGP(false);
        } else {
          setSelectedGramPanchayat('');
        }
      } else {
        setSelectedVillage('');
        setSelectedGramPanchayat('');
      }
    } else {
      setSelectedDistrict('');
      setSelectedVillage('');
      setSelectedGramPanchayat('');
    }
  };

  // Handle District Change
  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    const villages = getVillagesForDistrict(selectedState, newDistrict);
    if (villages.length > 0) {
      const firstVillage = villages[0];
      setSelectedVillage(firstVillage.name);
      setIsCustomVillage(false);
      if (firstVillage.defaultPincode) setPincode(firstVillage.defaultPincode);

      if (firstVillage.gramPanchayats.length > 0) {
        setSelectedGramPanchayat(firstVillage.gramPanchayats[0].name);
        setIsCustomGP(false);
      } else {
        setSelectedGramPanchayat('');
      }
    } else {
      setSelectedVillage('');
      setSelectedGramPanchayat('');
    }
  };

  // Handle Village Change
  const handleVillageChange = (val: string) => {
    if (val === '__custom__') {
      setIsCustomVillage(true);
      setSelectedVillage('__custom__');
      setIsCustomGP(true);
      setSelectedGramPanchayat('__custom__');
      return;
    }

    setIsCustomVillage(false);
    setSelectedVillage(val);
    const matched = availableVillages.find((v) => v.name === val);
    if (matched?.defaultPincode) {
      setPincode(matched.defaultPincode);
    }
    if (matched && matched.gramPanchayats.length > 0) {
      setSelectedGramPanchayat(matched.gramPanchayats[0].name);
      setIsCustomGP(false);
    } else {
      setSelectedGramPanchayat('');
    }
  };

  // Handle Gram Panchayat Change
  const handleGPChange = (val: string) => {
    if (val === '__custom__') {
      setIsCustomGP(true);
      setSelectedGramPanchayat('__custom__');
      return;
    }
    setIsCustomGP(false);
    setSelectedGramPanchayat(val);
  };

  // Compute final effective names
  const effectiveVillage = isCustomVillage ? customVillageText.trim() : selectedVillage;
  const effectiveGP = isCustomGP ? customGPText.trim() : selectedGramPanchayat;

  // Live formatted address preview
  const liveAddressPreview = formatCitizenAddress({
    houseNo: houseNo || '___',
    street: street || '___',
    landmark: landmark,
    village: effectiveVillage || '___',
    gramPanchayat: effectiveGP || '___',
    district: selectedDistrict || '___',
    state: selectedState || '___',
    pincode: pincode || '______'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!mobileNumber.trim() || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (!selectedState) {
      setErrorMessage('Please select your State.');
      return;
    }
    if (!selectedDistrict) {
      setErrorMessage('Please select your District.');
      return;
    }
    if (!effectiveVillage) {
      setErrorMessage('Please select or specify your Village.');
      return;
    }
    if (!effectiveGP) {
      setErrorMessage('Please select or specify your Grampanchayath.');
      return;
    }
    if (!houseNo.trim()) {
      setErrorMessage('Please enter your House / Door / Flat number.');
      return;
    }
    if (!street.trim()) {
      setErrorMessage('Please enter your Street / Road name.');
      return;
    }
    if (!pincode.trim() || pincode.trim().length < 6) {
      setErrorMessage('Please provide a valid 6-digit Pincode.');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('You must agree to the civic terms & conditions.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalGP = effectiveGP.includes('Panchayat')
        ? effectiveGP
        : `${effectiveGP} Gram Panchayat`;

      const formattedFinalAddress = formatCitizenAddress({
        houseNo: houseNo.trim(),
        street: street.trim(),
        landmark: landmark.trim(),
        village: effectiveVillage,
        gramPanchayat: finalGP,
        district: selectedDistrict,
        state: selectedState,
        pincode: pincode.trim()
      });

      const citizenId = `user_citizen_${Date.now()}`;
      const citizenPayload = {
        id: citizenId,
        name: fullName.trim(),
        mobile: cleanPhone,
        email: emailAddress.trim() || `${cleanPhone}@citizen.aquacare.gov`,
        state: selectedState,
        district: selectedDistrict,
        village: effectiveVillage,
        gramPanchayat: finalGP,
        houseNo: houseNo.trim(),
        street: street.trim(),
        landmark: landmark.trim(),
        panchayat: finalGP,
        ward: `${effectiveVillage} Ward 01`,
        zone: `${selectedDistrict} Division`,
        address: formattedFinalAddress,
        pincode: pincode.trim(),
        role: 'citizen' as const
      };

      // 1. Persist to Cloud Database (Firestore)
      try {
        const userDocRef = doc(db, 'users', citizenId);
        await setDoc(userDocRef, {
          ...citizenPayload,
          createdAt: new Date().toISOString()
        });
        console.log('[Register] Citizen successfully persisted to Cloud Database (Firestore)');
      } catch (firestoreErr) {
        console.warn('[Register] Firestore cloud sync warning (falling back to backend API):', firestoreErr);
      }

      // 2. Persist to Backend API Server
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(citizenPayload)
        });
        if (!res.ok) {
          console.warn('[Register] Server endpoint returned non-200, continuing with local state');
        }
      } catch (apiErr) {
        console.warn('[Register] Backend API network error:', apiErr);
      }

      // 3. Register citizen in React Context
      const registered = registerCitizen(citizenPayload);

      if (registered) {
        setRegistrationSuccess(true);
      } else {
        setErrorMessage('Registration could not be completed. Please check your data.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error('[Register] Unexpected registration error:', err);
      setErrorMessage(err.message || 'An error occurred during account creation.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50/50 text-slate-900 p-3 sm:p-6 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full">
        {/* Top Back bar */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={() => setCurrentScreen('login')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-[#0284c7] text-xs font-bold border border-sky-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Back to Login</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
            <Cloud className="w-3 h-3 text-emerald-600" />
            <span>Cloud Database Ready</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#eaf7fd] border-2 border-[#38bdf8] p-0.5 shadow-sm mb-2">
            <Droplets className="w-7 h-7 text-[#0284c7] fill-[#0284c7]/20 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Citizen Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Create an account with your official Grampanchayath and village address
          </p>
        </div>

        {/* Success Banner */}
        {registrationSuccess && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
            <div>
              <p className="font-bold text-sm">Account Created Successfully!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Connecting you to your local Grampanchayath water dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm"
        >
          {/* SECTION 1: CITIZEN PERSONAL DETAILS */}
          <div>
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-100">
              <div className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center text-[#0284c7]">
                <User className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                1. Citizen Personal Details
              </h2>
            </div>

            <div className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Gowda / Priya Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs"
                  />
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="9845012345"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="citizen@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CASCADING ADMINISTRATIVE ADDRESS (State -> District -> Village -> Grampanchayath) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  2. Administrative Address (Dropdown Hierarchy)
                </h2>
              </div>
              <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                Cascading Selection
              </span>
            </div>

            {/* Stepper indication */}
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 bg-slate-50 p-2 rounded-xl mb-3 border border-slate-200/80">
              <span className={`flex items-center gap-1 ${selectedState ? 'text-sky-700' : ''}`}>
                <span className="w-4 h-4 rounded-full bg-sky-200 text-sky-800 text-[10px] flex items-center justify-center">1</span>
                State
              </span>
              <span className="text-slate-300">→</span>
              <span className={`flex items-center gap-1 ${selectedDistrict ? 'text-sky-700' : ''}`}>
                <span className="w-4 h-4 rounded-full bg-sky-200 text-sky-800 text-[10px] flex items-center justify-center">2</span>
                District
              </span>
              <span className="text-slate-300">→</span>
              <span className={`flex items-center gap-1 ${selectedVillage ? 'text-sky-700' : ''}`}>
                <span className="w-4 h-4 rounded-full bg-sky-200 text-sky-800 text-[10px] flex items-center justify-center">3</span>
                Village
              </span>
              <span className="text-slate-300">→</span>
              <span className={`flex items-center gap-1 ${selectedGramPanchayat ? 'text-sky-700' : ''}`}>
                <span className="w-4 h-4 rounded-full bg-sky-200 text-sky-800 text-[10px] flex items-center justify-center">4</span>
                Grampanchayath
              </span>
            </div>

            <div className="space-y-3">
              {/* Row 1: State & District Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. STATE DROPDOWN */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={stateSelectId} className="block text-xs font-bold text-slate-700">
                      State / UT (Dropdown) *
                    </label>
                    <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                      36 States & UTs
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      id={stateSelectId}
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs cursor-pointer"
                    >
                      {ADMINISTRATIVE_HIERARCHY.map((st) => (
                        <option key={st.id} value={st.name}>
                          {st.name} ({st.districts.length} Districts)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 2. DISTRICT DROPDOWN */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={districtSelectId} className="block text-xs font-bold text-slate-700">
                      District ({availableDistricts.length} in {selectedState}) *
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      All {availableDistricts.length} Districts
                    </span>
                  </div>

                  {/* Fast filter for states with many districts like Tamil Nadu (38) or Karnataka (31) */}
                  {availableDistricts.length > 6 && (
                    <div className="mb-1.5">
                      <input
                        type="text"
                        value={districtSearch}
                        onChange={(e) => setDistrictSearch(e.target.value)}
                        placeholder={`Filter ${availableDistricts.length} districts (e.g. Coimbatore, Salem...)`}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <select
                      id={districtSelectId}
                      value={selectedDistrict}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs cursor-pointer"
                    >
                      {filteredDistricts.length === 0 ? (
                        <option value="">No district matching "{districtSearch}"</option>
                      ) : (
                        filteredDistricts.map((dst) => (
                          <option key={dst.id} value={dst.name}>
                            {dst.name}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Village & Grampanchayath Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 3. VILLAGE DROPDOWN */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={villageSelectId} className="block text-xs font-bold text-slate-700">
                      Village (Dropdown) *
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Step 3 of 4</span>
                  </div>
                  <div className="relative">
                    <select
                      id={villageSelectId}
                      value={selectedVillage}
                      onChange={(e) => handleVillageChange(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs cursor-pointer"
                    >
                      {availableVillages.map((vlg) => (
                        <option key={vlg.id} value={vlg.name}>
                          {vlg.name}
                        </option>
                      ))}
                      <option value="__custom__">+ Other Village (Type manually)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  {/* Custom Village Text input if "+ Other" is picked */}
                  {isCustomVillage && (
                    <div className="mt-2 animate-fadeIn">
                      <input
                        type="text"
                        required
                        value={customVillageText}
                        onChange={(e) => setCustomVillageText(e.target.value)}
                        placeholder="Enter your village name"
                        className="w-full px-3 py-2 bg-amber-50/60 border border-amber-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 shadow-2xs"
                      />
                    </div>
                  )}
                </div>

                {/* 4. GRAMPANCHAYATH DROPDOWN */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={gpSelectId} className="block text-xs font-bold text-slate-700">
                      Grampanchayath (Dropdown) *
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Step 4 of 4</span>
                  </div>
                  <div className="relative">
                    <select
                      id={gpSelectId}
                      value={selectedGramPanchayat}
                      onChange={(e) => handleGPChange(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs cursor-pointer"
                    >
                      {availableGPs.map((gp) => (
                        <option key={gp.id} value={gp.name}>
                          {gp.name}
                        </option>
                      ))}
                      <option value="__custom__">+ Other Grampanchayath (Type manually)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  {/* Custom Grampanchayath Text input if "+ Other" is picked */}
                  {isCustomGP && (
                    <div className="mt-2 animate-fadeIn">
                      <input
                        type="text"
                        required
                        value={customGPText}
                        onChange={(e) => setCustomGPText(e.target.value)}
                        placeholder="Enter your Grampanchayath name"
                        className="w-full px-3 py-2 bg-amber-50/60 border border-amber-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 shadow-2xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: RESIDENTIAL HOUSE NO & REST IN TEXT */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-100">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Home className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                3. House Number & Rest of Address (Text Inputs)
              </h2>
            </div>

            <div className="space-y-3">
              {/* House No / Door No */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  House No. / Flat No. / Door No. / Building Name *
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    placeholder="e.g. No. 42/B, Sai Krupa Nilaya, 1st Floor"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs"
                  />
                </div>
              </div>

              {/* Street & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street / Road / Cross *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Old Temple Main Road"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Water Tank / School"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pincode (Postal Code) *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="562123"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* REAL-TIME GENERATED ADDRESS PREVIEW BADGE */}
          <div className="p-3.5 bg-sky-50/70 border border-sky-200/90 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-black text-sky-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Live Generated Official Civic Address
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Auto-Formatted
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-2.5 rounded-xl border border-sky-100">
              {liveAddressPreview}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-sky-200 text-sky-800">
                State: {selectedState}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-sky-200 text-sky-800">
                District: {selectedDistrict}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-sky-200 text-sky-800">
                Village: {effectiveVillage || 'Not selected'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-sky-200 text-sky-800">
                Grampanchayath: {effectiveGP || 'Not selected'}
              </span>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 bg-white"
              />
              <span>
                I certify that the provided residential address, Village, and Grampanchayath details are accurate for municipal water supply management and tracking.
              </span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#008be3] hover:bg-[#007bcc] disabled:opacity-50 text-white font-black text-sm shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving to Cloud Database...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                Complete Registration & Connect
              </span>
            )}
          </button>
        </form>

        {/* Back to login */}
        <div className="mt-4 text-center pb-6">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => setCurrentScreen('login')}
              className="font-bold text-[#008be3] hover:text-[#007bcc] underline underline-offset-2 ml-1 cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
