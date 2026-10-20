import React from 'react';
import { useApp } from '../context/AppContext';
import { Droplets, Clock, X, CheckCircle2, AlertTriangle, Phone, ShieldCheck, Truck } from 'lucide-react';

export const WaterSupplyModal: React.FC = () => {
  const { activeModal, setActiveModal, currentUser } = useApp();

  if (activeModal !== 'waterSupply') {
    return null;
  }

  const wardSchedules = [
    {
      ward: 'Ward 12 - Mylapore (Your Ward)',
      morning: '05:30 AM - 08:30 AM',
      evening: '05:00 PM - 07:30 PM',
      pressure: 'Standard Pressure (1.6 - 1.8 bar)',
      status: 'Normal Piped Supply',
      isCurrent: true
    },
    {
      ward: 'Ward 13 - Mandaveli',
      morning: '06:00 AM - 09:00 AM',
      evening: '05:30 PM - 08:00 PM',
      pressure: 'Low Pressure (Pipeline repair near Pillar 42)',
      status: 'Partial Outage - Tankers Standby',
      isCurrent: false
    },
    {
      ward: 'Ward 14 - Alwarpet',
      morning: '05:00 AM - 08:00 AM',
      evening: '04:30 PM - 07:00 PM',
      pressure: 'Standard Pressure (1.7 bar)',
      status: 'Normal Piped Supply',
      isCurrent: false
    },
    {
      ward: 'Ward 15 - T. Nagar',
      morning: '06:00 AM - 08:30 AM',
      evening: '05:00 PM - 07:30 PM',
      pressure: 'Standard Pressure (1.5 bar)',
      status: 'Normal Piped Supply',
      isCurrent: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5 fill-cyan-500/20" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                Daily Water Timetable & Network Status
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                Piped water timings, pipeline alerts, and sensor readings
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Live Pipeline & Water Sensor Status Bar (Replacing lakes) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-cyan-300">
                Live Water Network Summary
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                IoT Sensors Active
              </span>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 mt-2">
              <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-center">
                <span className="block text-[10px] text-rose-300 font-semibold truncate">Broken Pipes</span>
                <span className="block text-xs sm:text-sm font-black text-rose-400">2 Fixing</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-center">
                <span className="block text-[10px] text-amber-300 font-semibold truncate">Water Pressure</span>
                <span className="block text-xs sm:text-sm font-black text-amber-400">2 Low Zones</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center">
                <span className="block text-[10px] text-emerald-300 font-semibold truncate">Turbidity Less</span>
                <span className="block text-xs sm:text-sm font-black text-emerald-400">0.85 NTU Clean</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 mt-2.5 font-medium leading-relaxed">
              Main water lines are running with safe, clean water (low turbidity). Repair crews are working on the 2 broken pipes.
            </p>
          </div>

          {/* Ward Supply Timetable */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Water Timings by Area
            </h3>
            <div className="space-y-2.5">
              {wardSchedules.map((ws) => (
                <div
                  key={ws.ward}
                  className={`p-3.5 rounded-2xl border transition ${
                    ws.isCurrent
                      ? 'bg-cyan-50/70 border-cyan-300 ring-1 ring-cyan-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-slate-900">
                      {ws.ward}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ws.status.includes('Normal')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ws.status.includes('Normal') ? 'Normal Supply' : 'Repair Work Today'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Morning: <b>{ws.morning}</b></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Evening: <b>{ws.evening}</b></span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {ws.pressure.includes('Standard') ? 'Good water pressure' : 'Water flow is currently slow'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dial-A-Tanker Quick CTA */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950">
                Need a Water Tanker Truck?
              </h4>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                If your house tank is empty, call the toll-free water helpline 1800-425-AQUA to order a city water truck.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
