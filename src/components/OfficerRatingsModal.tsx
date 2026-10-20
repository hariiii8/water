import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, X, CheckCircle2, MessageSquare, Award, User, ShieldCheck } from 'lucide-react';

interface OfficerRatingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfficerRatingsModal: React.FC<OfficerRatingsModalProps> = ({ isOpen, onClose }) => {
  const { officerRatingSummary, currentUser, t } = useApp();

  if (!isOpen) return null;

  const total = officerRatingSummary.totalRatings;
  const avg = officerRatingSummary.formattedRating;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-tight">
                {t.officerCitizenRating || 'Citizen Rating'} & Performance
              </h3>
              <p className="text-xs text-amber-200/80 font-medium">
                Live satisfaction ratings submitted by verified citizens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4 text-slate-800">
          {/* Officer Score Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/80 shadow-2xs">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-xs">
                  <Star className="w-6 h-6 fill-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black text-slate-950">{avg}</span>
                    <span className="text-xs text-amber-800 font-bold">/ 5.0</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-extrabold ml-1">
                      {total} {total === 1 ? 'Rating' : 'Ratings'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Field Officer: <span className="font-bold text-slate-900">{currentUser?.name || 'Er. Rajesh Kumar'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-1 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Public Audit</span>
              </div>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="mt-3.5 pt-3 border-t border-amber-200/60 space-y-1.5 text-xs">
              {[5, 4, 3, 2, 1].map((s) => {
                const count = officerRatingSummary.breakdown[s as 1 | 2 | 3 | 4 | 5] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : s === 5 ? 100 : 0;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <span className="w-12 font-bold text-slate-600 shrink-0 text-[11px] flex items-center gap-0.5">
                      <span>{s}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-amber-200/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono font-semibold text-slate-500 text-[10px]">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Citizen Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-cyan-600" />
                <span>Citizen Reviews & Feedback</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Real-time Feedback
              </span>
            </div>

            {officerRatingSummary.reviews.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 space-y-1">
                <Star className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="font-bold text-xs text-slate-700">No citizen ratings recorded yet</p>
                <p className="text-[11px]">When citizens rate your cleared tasks, they will appear here instantly.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {officerRatingSummary.reviews.map((rev, idx) => (
                  <div
                    key={`${rev.complaintId}-${idx}`}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-amber-300 transition space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block leading-tight">
                            {rev.userName}
                          </span>
                          <span className="text-[10px] text-slate-400 block leading-tight">
                            {rev.ward}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <Star
                            key={st}
                            className={`w-3.5 h-3.5 ${
                              st <= rev.stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-black text-amber-950 ml-1">
                          {rev.stars}.0
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 font-medium leading-relaxed">
                      "{rev.feedback}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-medium">
                      <span>Problem: #{rev.complaintId} ({rev.complaintTitle})</span>
                      <span className="font-semibold text-slate-400">{rev.ratedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Ratings update instantly when citizen submits feedback.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-xs"
          >
            {t.close || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
