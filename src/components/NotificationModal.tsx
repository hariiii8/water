import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, X, FileText, Radio, Clock, ChevronRight, AlertTriangle } from 'lucide-react';

export const NotificationModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedComplaint,
    complaints
  } = useApp();

  if (activeModal !== 'notifications') {
    return null;
  }

  const handleNotificationClick = (notifId: string, relatedComplaintId?: string) => {
    markNotificationRead(notifId);
    if (relatedComplaintId) {
      const target = complaints.find((c) => c.id === relatedComplaintId);
      if (target) {
        setSelectedComplaint(target);
        setActiveModal('complaintDetail');
      }
    }
  };

  const [filter, setFilter] = React.useState<'all' | 'emergency'>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'emergency') return notif.priority === 'high' || notif.type === 'water_alert';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative my-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                Notifications & Civic Alerts
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                Water alerts & Grievance updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-cyan-50 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Mark read</span>
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-5 pt-3 pb-1 flex items-center gap-2 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-cyan-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('emergency')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              filter === 'emergency'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            <span>Emergency Alerts</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-5 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-10">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No notifications in this view</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                You're completely up to date with civic water alerts.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const displayTitle = notif.title;
              const displayMessage = notif.message;
              const isEmergency =
                notif.priority === 'high' ||
                displayTitle.toLowerCase().includes('emergency') ||
                displayTitle.toLowerCase().includes('damage') ||
                displayTitle.toLowerCase().includes('burst');

              const isSensorAlert =
                notif.type === 'water_alert' ||
                displayTitle.toLowerCase().includes('sensor') ||
                displayMessage.toLowerCase().includes('sensor');

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.relatedComplaintId)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 group ${
                    isEmergency
                      ? 'bg-rose-50/70 border-2 border-rose-400 hover:border-rose-500 shadow-sm'
                      : notif.read
                      ? 'bg-white border-slate-200/80 hover:border-slate-300'
                      : 'bg-cyan-50/50 border-cyan-300/80 shadow-xs'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isEmergency
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : isSensorAlert
                        ? 'bg-cyan-100 text-cyan-700'
                        : notif.type === 'assigned_task'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {isEmergency ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                    ) : isSensorAlert ? (
                      <Radio className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className={`font-black text-xs sm:text-sm ${isEmergency ? 'text-rose-950' : 'text-slate-900'} truncate`}>
                          {displayTitle}
                        </h4>
                        {isEmergency ? (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                            Emergency Damage Alert
                          </span>
                        ) : isSensorAlert ? (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 shadow-2xs">
                            Water Alert
                          </span>
                        ) : null}
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className={`text-xs mt-1 leading-relaxed ${isEmergency ? 'text-rose-900 font-medium' : 'text-slate-600'}`}>
                      {displayMessage}
                    </p>

                    {notif.relatedComplaintId && (
                      <div className={`mt-2 flex items-center gap-1 text-[11px] font-bold ${isEmergency ? 'text-rose-700 font-black' : 'text-cyan-600'} group-hover:underline`}>
                        <span>View Damaged Pipeline Complaint #{notif.relatedComplaintId}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {!notif.read && (
                    <span className={`w-2.5 h-2.5 rounded-full ${isEmergency ? 'bg-rose-600 animate-ping' : 'bg-cyan-600'} shrink-0 mt-2`} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
