import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ProblemCategory } from '../../types';
import {
  MUNICIPAL_WARDS,
  PROBLEM_CATEGORIES
} from '../../data/initialData';
import {
  ComplaintCategoryIcon
} from '../ComplaintCategoryIcon';
import { getLocalizedPresets, LocalizedPresetProblem } from '../../translations';
import {
  Droplets,
  MapPin,
  CheckCircle2,
  X,
  FileCheck,
  ArrowRight,
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  FileText,
  AlertCircle,
  Check
} from 'lucide-react';

interface ReportProblemScreenProps {
  initialCategory?: ProblemCategory;
  initialTitle?: string;
  initialDescription?: string;
  initialLocation?: string;
  initialWard?: string;
  initialUrgency?: 'Low' | 'Medium' | 'High' | 'Emergency';
  onCancel: () => void;
  onSuccessView: (complaintId: string) => void;
}

export const ReportProblemScreen: React.FC<ReportProblemScreenProps> = ({
  initialCategory,
  initialTitle,
  initialDescription,
  initialLocation,
  initialWard,
  initialUrgency,
  onCancel,
  onSuccessView
}) => {
  const { currentUser, addComplaint, t, language } = useApp();

  // Simple Form State
  const [category, setCategory] = useState<ProblemCategory>(initialCategory || 'Water Leakage');
  const [title, setTitle] = useState(initialTitle || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [address, setAddress] = useState(initialLocation || currentUser?.address || '');
  const [ward, setWard] = useState(initialWard || currentUser?.ward || MUNICIPAL_WARDS[1]);
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>(initialUrgency || 'High');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Quick Preset Selection
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<ProblemCategory | null>(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    if (initialTitle) setTitle(initialTitle);
    if (initialDescription) setDescription(initialDescription);
    if (initialLocation) setAddress(initialLocation);
    if (initialWard) setWard(initialWard);
    if (initialUrgency) setUrgency(initialUrgency);
  }, [initialCategory, initialTitle, initialDescription, initialLocation, initialWard, initialUrgency]);

  // Voice Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const presets = getLocalizedPresets(language);

  // Pick Quick Problem Preset
  const handlePickProblem = (preset: LocalizedPresetProblem) => {
    setCategory(preset.category as ProblemCategory);
    setTitle(preset.title);
    setDescription(preset.description);
    setUrgency(preset.urgency);
    setSelectedPresetCategory(preset.category as ProblemCategory);
    setFormError('');
  };

  // Clear Form
  const handleClearForm = () => {
    setTitle('');
    setDescription('');
    setSelectedPresetCategory(null);
    setFormError('');
  };

  // Voice Recording Toggle
  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Sample voice note fallback if speech recognition unavailable in iframe
      handleSampleVoiceNote();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      if (language === 'ta') {
        recognition.lang = 'ta-IN';
      } else if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      setIsListening(true);
      setVoiceFeedback('Listening... Speak about the water problem clearly.');

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const spoken = finalTranscript || interimTranscript;
        if (spoken) {
          setVoiceFeedback(`Heard: "${spoken}"`);
          setDescription((prev) => (prev ? `${prev} ${spoken}` : spoken));

          const lower = spoken.toLowerCase();
          if (lower.includes('leak') || lower.includes('broken pipe')) {
            setCategory('Water Leakage');
            if (!title) setTitle('Water pipe leaking on street');
          } else if (lower.includes('no water') || lower.includes('dry')) {
            setCategory('No Water');
            if (!title) setTitle('No water supply from tap');
          } else if (lower.includes('dirty') || lower.includes('mud')) {
            setCategory('Dirty Water');
            if (!title) setTitle('Muddy or dirty tap water');
          } else if (lower.includes('slow') || lower.includes('pressure')) {
            setCategory('Slow Water Flow');
            if (!title) setTitle('Low water pressure in taps');
          } else if (lower.includes('smell') || lower.includes('taste')) {
            setCategory('Bad Smell or Taste');
            if (!title) setTitle('Bad odor in tap water');
          } else if (!title) {
            setTitle(spoken.slice(0, 45));
          }
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceFeedback('Microphone ended. You can also type or use quick presets.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      handleSampleVoiceNote();
    }
  };

  const handleSampleVoiceNote = () => {
    const sampleText =
      language === 'ta'
        ? 'மெயின் ரோட்டில் தண்ணீர் குழாய் உடைந்து வீணாக ஓடுகிறது. உடனடியாக சரிசெய்யவும்.'
        : language === 'hi'
        ? 'मेन रोड पर पानी का पाइप टूट गया है और पानी बह रहा है। कृपया ठीक करें।'
        : 'Water pipe is broken on the main street with drinking water leaking. Please fix soon.';

    setDescription((prev) => (prev ? `${prev}\n${sampleText}` : sampleText));
    if (!title) setTitle('Water pipe leaking on street');
    setCategory('Water Leakage');
    setUrgency('High');
    setVoiceFeedback('Voice note added to problem description!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a headline or title for the problem.');
      return;
    }
    if (!description.trim() || description.length < 5) {
      setFormError('Please provide a brief description of the water problem.');
      return;
    }
    if (!address.trim()) {
      setFormError('Please enter your street location or landmark.');
      return;
    }

    const newId = addComplaint({
      title: title.trim(),
      category,
      description: description.trim(),
      location: address.trim(),
      state: currentUser?.state,
      district: currentUser?.district,
      village: currentUser?.village,
      gramPanchayat: currentUser?.gramPanchayat,
      houseNo: currentUser?.houseNo,
      panchayat: currentUser?.gramPanchayat || currentUser?.panchayat,
      ward: currentUser?.village && currentUser?.gramPanchayat
        ? `${currentUser.village} · ${currentUser.gramPanchayat}`
        : ward,
      urgency,
      assignedOfficerId: 'user_officer_1',
      assignedOfficerName: 'Rajesh Kumar',
      assignedOfficerContact: '+91 98765 43210'
    });

    // Confetti removed per user instructions - normal alert only
    setSubmittedId(newId);
  };

  // NORMAL DIGNIFIED POP ALERT MESSAGE: COMPLAINT SUBMITTED SUCCESSFULLY
  if (submittedId) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 max-w-md mx-auto my-3 shadow-lg animate-in fade-in duration-150">
        {/* Simple, Clean Success Banner */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-6 h-6 stroke-[2.4]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-black text-emerald-950 leading-tight">
              Complaint Submitted Successfully
            </h3>
            <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
              Registered with Local Water Department
            </p>
          </div>
        </div>

        {/* Clear Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <span className="text-xs text-slate-500 font-semibold">Complaint Token No:</span>
            <span className="font-mono text-sm font-black text-cyan-900 bg-cyan-100/80 px-2.5 py-0.5 rounded-lg border border-cyan-200">
              {submittedId}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
            <span className="text-slate-500">Problem:</span>
            <span className="font-bold text-slate-900 truncate max-w-[200px] text-right">{title}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
            <span className="text-slate-500">Category:</span>
            <span className="font-bold text-slate-800">{category}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
            <span className="text-slate-500">Location:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[190px] text-right">{address}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Assigned Lineman:</span>
            <span className="font-bold text-cyan-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Rajesh Kumar (+91 98765 43210)</span>
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center my-4">
          The local water lineman has been alerted and will inspect the site today.
        </p>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onSuccessView(submittedId)}
            className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-sm transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>Track My Complaint</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // SIMPLE, SPACIOUS REPORT FORM (UNCRAMPED & MOBILE-FIRST)
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-3.5 sm:p-7 max-w-xl mx-auto mb-6 space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* 1. CLEAN HEADER (SPACIOUS & MODERN) */}
      <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-slate-100 gap-2 sm:gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-cyan-600/20 shrink-0">
            <Droplets className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
              Report a Water Problem
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium leading-relaxed truncate">
              Describe the problem to dispatch municipal water repair workers
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0 cursor-pointer"
          aria-label="Cancel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {formError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl sm:rounded-2xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-semibold leading-relaxed">{formError}</span>
        </div>
      )}

      {/* 2. QUICK PROBLEM PRESETS (2-COLUMN GRID ON MOBILE TO AVOID ENDLESS SCROLLING) */}
      <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50/80 border border-slate-200/90 space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
              Quick Select Problem
            </span>
          </div>

          {selectedPresetCategory && (
            <button
              type="button"
              onClick={handleClearForm}
              className="text-[10px] sm:text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-white px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-rose-200 shadow-2xs flex items-center gap-1 cursor-pointer transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
          Tap any common water issue below to quickly fill details:
        </p>

        {/* 6 Clean Issue Cards in a Compact 2-Column Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-0.5">
          {presets.map((preset) => {
            const isSelected = selectedPresetCategory === preset.category;
            return (
              <button
                key={preset.category}
                type="button"
                onClick={() => handlePickProblem(preset)}
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 sm:gap-2.5 ${
                  isSelected
                    ? 'border-cyan-500 bg-white shadow-sm ring-2 ring-cyan-500/30'
                    : 'border-slate-200 bg-white hover:border-cyan-300 shadow-2xs'
                }`}
              >
                <div className="shrink-0">
                  <ComplaintCategoryIcon category={preset.category} size="sm" glow={isSelected} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-[11px] sm:text-xs text-slate-900 block truncate">
                    {preset.shortLabel}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 block truncate mt-0.5">
                    {preset.tagline}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. OPTIONAL VOICE INPUT STRIP (CLEAN & SIMPLE) */}
      <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 transition-all ${
              isListening ? 'bg-rose-500 animate-pulse' : 'bg-cyan-600'
            }`}
          >
            <Mic className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-xs text-slate-900 block">
              Prefer speaking?
            </span>
            <span className="text-[11px] text-slate-500 block">
              {isListening ? 'Listening now... Speak your problem' : 'Tap speak to describe by voice in Tamil, Hindi, or English'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleVoice}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-white border border-cyan-300 text-cyan-800 hover:bg-cyan-100/60 shadow-2xs'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-cyan-600" />
              <span>Voice Speak</span>
            </>
          )}
        </button>
      </div>

      {voiceFeedback && (
        <p className="text-xs text-cyan-800 font-medium px-1 leading-relaxed">
          {voiceFeedback}
        </p>
      )}

      {/* 4. SIMPLE APPLICATION FORM FIELDS (SPACIOUS & UN-CRAMPED) */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Category Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-800 block">
            Problem Category *
          </label>
          <div className="flex items-center gap-2.5">
            <div className="shrink-0">
              <ComplaintCategoryIcon category={category} size="md" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProblemCategory)}
              className="flex-1 min-w-0 px-3.5 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              {PROBLEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-800 block">
            Problem Headline / Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Broken pipe leaking drinking water on street"
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        {/* Problem Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800 block">
              Problem Description *
            </label>
            <span className="text-[10px] text-slate-400 font-medium">
              {description.length > 0 ? `${description.length} chars` : 'Min 5 characters'}
            </span>
          </div>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened, where the leak/problem is, and how severe it is..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 leading-relaxed min-h-[96px]"
          />
        </div>

        {/* Ward & Urgency in a Clean 2-Column Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 block">
              Municipal Ward *
            </label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              {MUNICIPAL_WARDS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 block">
              Urgency Level
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="Low">Low (Can wait 2-3 days)</option>
              <option value="Medium">Medium (Check soon)</option>
              <option value="High">High (Need help today)</option>
              <option value="Emergency">Emergency (Heavy water waste)</option>
            </select>
          </div>
        </div>

        {/* Street Location Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-800 block">
            Street Location / Landmark *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-600 pointer-events-none" />
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Near Pillar 42, 4th Main Road, Mandaveli"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        {/* Form Action Buttons (Comfortable & High Touch Target) */}
        <div className="pt-4 flex flex-col-reverse sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto sm:px-6 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-md shadow-cyan-600/25 flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
          >
            <span>Submit Water Problem Report</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </form>
    </div>
  );
};
