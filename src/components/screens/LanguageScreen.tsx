import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import {
  ArrowRight,
  Globe,
  Leaf,
  Droplets,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const LanguageScreen: React.FC = () => {
  const {
    language,
    setLanguage,
    setCurrentScreen,
    currentUser,
    isLoggedIn,
    loginAsRole,
    liveTelemetry,
    isWsConnected,
    activeUsersCount
  } = useApp();

  const [isNavigating, setIsNavigating] = useState(false);

  const handleStart = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setCurrentScreen('login');
    }, 120);
  };

  const handleSelectLanguage = (langId: Language) => {
    setLanguage(langId);
  };

  const handleDirectLanguageStart = (langId: Language) => {
    setLanguage(langId);
    handleStart();
  };

  const languages: {
    id: Language;
    nativeLabel: string;
    englishLabel: string;
    sublabel: string;
  }[] = [
    {
      id: 'ta',
      nativeLabel: 'தமிழ்',
      englishLabel: 'Tamil',
      sublabel: 'தமிழில் தொடவும் மற்றும் பயன்படுத்தலாம்'
    },
    {
      id: 'en',
      nativeLabel: 'English',
      englishLabel: 'English',
      sublabel: 'Tap to explore and manage your water supply'
    },
    {
      id: 'hi',
      nativeLabel: 'हिन्दी',
      englishLabel: 'Hindi',
      sublabel: 'उपयोग करने एवं आगे बढ़ने के लिए टैप करें'
    }
  ];

  const getStartedLabel = {
    ta: 'தொடங்குங்கள்',
    en: 'Get Started',
    hi: 'शुरू करें'
  }[language] || 'Get Started';

  return (
    <div className="relative w-full min-h-screen sm:min-h-auto bg-slate-50 text-slate-800 p-3.5 sm:p-6 md:p-8 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">

      <div className="relative z-10 max-w-3xl mx-auto w-full space-y-6 sm:space-y-7">
        {/* 1. TOP BANNER CARD: CLEAN WATER. HEALTHY HOMES. (FULLY VISIBLE & NOT CUT) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg shadow-sky-900/10 border border-sky-200/80 aspect-[16/9] w-full flex flex-col justify-between text-white group bg-slate-900">
          {/* Clean Municipal Water Tower & Community Tap Banner - 100% visible and bright */}
          <img
            src="/images/clean_water_healthy_homes_banner.jpg"
            alt="Clean Water. Healthy Homes - Municipal water supply and community tap"
            className="absolute inset-0 w-full h-full object-cover object-center filter saturate-105 contrast-105 group-hover:scale-102 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />

          {/* Gentle Bottom-Only Vignette to keep upper 70% sky, water tower, and tap fully visible and bright */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/65 via-slate-950/15 to-transparent pointer-events-none" />

          {/* Top Row: Floating Pill Badges */}
          <div className="relative z-10 flex items-start justify-between gap-2 p-2.5 sm:p-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/55 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold border border-white/20 shadow-xs shrink-0">
              <Leaf className="w-3 h-3 text-emerald-400 fill-emerald-400/30" />
              <span className="italic tracking-wide hidden sm:inline">Save Water | Save Life</span>
              <span className="text-white/40 hidden sm:inline">·</span>
              <span className="text-cyan-300 font-mono text-[10px]">{activeUsersCount} online</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-sky-700 text-[10px] sm:text-xs font-bold shadow-md border border-white shrink-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isWsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span>Clean Water · {liveTelemetry.pressureBar} bar</span>
            </div>
          </div>

          {/* Bottom Card: Clean Water. Healthy Homes. in a sleek frosted glass pill */}
          <div className="relative z-10 mt-auto p-2.5 sm:p-4 flex flex-col items-start">
            <div className="bg-slate-950/65 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 border border-white/20 shadow-lg max-w-[88%] sm:max-w-md space-y-0.5">
              <h2 className="text-sm sm:text-xl md:text-2xl font-black tracking-tight leading-tight text-white drop-shadow-sm flex items-center gap-1.5 flex-wrap">
                <span>Clean Water.</span>
                <span className="text-cyan-300">Healthy Homes.</span>
              </h2>
              <p className="text-[10px] sm:text-xs text-sky-100 font-medium leading-tight">
                Track supply timings, report leaks, and check water quality.
              </p>
            </div>
          </div>
        </div>

        {/* 2. LOGO & BRAND SECTION */}
        <div className="text-center space-y-2 pt-1">
          {/* AquaCare Centered Brand Lockup */}
          <div className="inline-flex items-center justify-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-sky-400 shadow-md shadow-sky-500/15 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-xs">
                <Droplets className="w-5 h-5 fill-white stroke-[2.2]" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#008be3]">
              AquaCare
            </h1>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Easy Water Help for Your Home
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Track usage, detect leaks, and manage water smartly — for a healthier home and a sustainable future.
          </p>
        </div>

        {/* 3. 4 FEATURE CIRCLES (Matching Exact Mockup) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-1">
          {/* Feature 1: Track Water Usage */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#dcf2fe] text-[#0284c7] flex items-center justify-center shadow-xs mb-2 transition-transform hover:scale-105">
              <Droplets className="w-6 h-6 stroke-[2.2] fill-[#0284c7]/20" />
            </div>
            <span className="text-xs font-extrabold text-slate-800 leading-tight">
              Track<br />Water Usage
            </span>
          </div>

          {/* Feature 2: Detect Leaks */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#dcfce7] text-[#10b981] flex items-center justify-center shadow-xs mb-2 transition-transform hover:scale-105">
              <ShieldCheck className="w-6 h-6 stroke-[2.2] fill-[#10b981]/20" />
            </div>
            <span className="text-xs font-extrabold text-slate-800 leading-tight">
              Detect<br />Leaks
            </span>
          </div>

          {/* Feature 3: Manage Smartly */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#ede9fe] text-[#7c3aed] flex items-center justify-center shadow-xs mb-2 transition-transform hover:scale-105">
              <Cpu className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-xs font-extrabold text-slate-800 leading-tight">
              Manage<br />Smartly
            </span>
          </div>

          {/* Feature 4: Build a Sustainable Future */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#ccfbf1] text-[#0d9488] flex items-center justify-center shadow-xs mb-2 transition-transform hover:scale-105">
              <Leaf className="w-6 h-6 stroke-[2.2] fill-[#0d9488]/20" />
            </div>
            <span className="text-xs font-extrabold text-slate-800 leading-tight">
              Build a<br />Sustainable Future
            </span>
          </div>
        </div>

        {/* 4. CHOOSE YOUR LANGUAGE DIVIDER */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-sky-200/80 w-full" />
          <span className="bg-[#f4faff] px-4 text-[11px] font-black uppercase tracking-widest text-[#008be3] whitespace-nowrap">
            CHOOSE YOUR LANGUAGE
          </span>
          <div className="border-t border-sky-200/80 w-full" />
        </div>

        {/* 5. LANGUAGE CARDS: TAMIL, ENGLISH, HINDI (Exact Mockup Style) */}
        <div className="space-y-2.5 max-w-xl mx-auto w-full">
          {languages.map((item) => {
            const isSelected = language === item.id;
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectLanguage(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectLanguage(item.id);
                  }
                }}
                className={`relative w-full p-3 sm:p-3.5 rounded-full bg-white border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs ${
                  isSelected
                    ? 'border-[#008be3] ring-2 ring-[#008be3]/20 shadow-md shadow-sky-500/10'
                    : 'border-sky-200/80 hover:border-sky-300 hover:bg-white/80'
                }`}
              >
                {/* Left: Globe Icon & Labels */}
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-sky-100 text-[#008be3]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm sm:text-base text-slate-900 truncate">
                        {item.nativeLabel}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        ({item.englishLabel})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {item.sublabel}
                    </p>
                  </div>
                </div>

                {/* Right: Blue Arrow Action Circle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirectLanguageStart(item.id);
                  }}
                  title={`Start in ${item.englishLabel}`}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white transition-all shadow-xs active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-[#008be3] hover:bg-[#007acc] shadow-sm'
                      : 'bg-slate-300 hover:bg-[#008be3]'
                  }`}
                >
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            );
          })}
        </div>

        {/* PRIMARY "GET STARTED" BUTTON */}
        <div className="pt-2 max-w-xl mx-auto w-full">
          <button
            type="button"
            onClick={handleStart}
            disabled={isNavigating}
            className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-to-r from-[#008be3] via-sky-500 to-[#0284c7] hover:from-[#007bcc] hover:to-[#0275b0] text-white font-black text-sm sm:text-base shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] cursor-pointer group"
          >
            <span>{getStartedLabel}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
