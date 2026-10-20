import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ClipboardList, MapPin, MoreHorizontal } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    complaints,
    currentUser,
    currentRole,
    t,
    isReportingProblem
  } = useApp();

  // Calculate badge counts
  const activeComplaintsCount = currentRole === 'officer'
    ? complaints.filter((c) => c.assignedOfficerId === currentUser?.id && c.status !== 'Resolved').length
    : complaints.filter((c) => c.userId === currentUser?.id && c.status !== 'Resolved').length;

  interface NavItem {
    id: 'home' | 'complaints' | 'map' | 'more';
    label: string;
    icon: typeof Home;
    badge?: number;
  }

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: t.navHome,
      icon: Home
    },
    {
      id: 'complaints',
      label: currentRole === 'officer' ? 'Assigned Field Task' : t.navComplaints,
      icon: ClipboardList,
      badge: activeComplaintsCount > 0 ? activeComplaintsCount : undefined
    },
    {
      id: 'map',
      label: t.navMap,
      icon: MapPin
    },
    {
      id: 'more',
      label: t.navMore,
      icon: MoreHorizontal
    }
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none">
      <div className="max-w-md sm:max-w-3xl lg:max-w-4xl mx-auto grid grid-cols-4 px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !isReportingProblem && activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-cyan-800 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-tr from-cyan-600 to-sky-600 text-white shadow-sm shadow-cyan-600/30 scale-105'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] sm:text-[11px] mt-1 tracking-tight text-center leading-tight truncate max-w-[76px] sm:max-w-none ${isActive ? 'font-black text-cyan-800' : 'font-semibold text-slate-500'}`}>
                {item.label}
              </span>

              {/* Counter Badge */}
              {item.badge !== undefined && (
                <span className="absolute top-1 right-2 sm:right-6 min-w-[17px] h-[17px] px-1 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
