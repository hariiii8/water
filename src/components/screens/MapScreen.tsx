import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import aerialMapImg from '../../assets/images/aerial_water_map_1791968963423.jpg';
import confetti from 'canvas-confetti';
import {
  Plus,
  Minus,
  Crosshair,
  Search,
  X,
  AlertTriangle,
  Phone,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Wrench,
  Bot,
  Radio,
  Check
} from 'lucide-react';

interface MapScreenProps {
  onReportAtLocation?: (locationName: string) => void;
}

export interface WatershedPoint {
  id: string;
  name: string;
  areaName: string; // Exact area name matching complaints
  ward: string;
  category: 'damaged_pipe' | 'sensor_alert';
  tag: string;
  pipeNum: number;
  x: number; // percentage on map
  y: number; // percentage on map
  badgeX: number; // callout badge percentage
  badgeY: number; // callout badge percentage
  severity: string;
  severityColor: string;
  exactAddress: string;
  pipeSpec: string;
  leakRate: string;
  pressureDrop: string;
  status: string;
  statusBadge: string;
  description: string;
  briefOverview: string;
  zone: string;
  operator: string;
  contact: string;
  relatedComplaintId?: string;
  sensorAlertMessage?: string;
  isCured?: boolean;
}

// 3 BASELINE BROKEN PIPE POINTS WITH EXACT COMPLAINT AREA NAMES: MYLAPORE, ALWARPET, MANDAVELI
export const BASE_WATERSHED_POINTS: WatershedPoint[] = [
  {
    id: 'pt_damaged_pipe_1',
    name: 'Broken Pipe 1 (Mylapore)',
    areaName: 'Mylapore',
    ward: 'Ward 12 - Mylapore',
    category: 'damaged_pipe',
    tag: 'Mylapore • Pipe 1',
    pipeNum: 1,
    x: 57,
    y: 59,
    badgeX: 57,
    badgeY: 59,
    severity: 'Big Leak',
    severityColor: 'bg-rose-500',
    exactAddress: 'East Mada Street & Kutchery Road, Mylapore',
    pipeSpec: 'Main Supply Pipeline (300mm)',
    leakRate: 'High pressure surface leak',
    pressureDrop: 'Pressure dropped to 0.38 bar',
    status: 'Workers Fixing It Now',
    statusBadge: 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold animate-pulse',
    description: 'Main pipeline fracture in Mylapore area (East Mada Street) detected by pressure sensor. Maintenance crew is actively on site replacing the cracked section.',
    briefOverview: 'Main pipeline fracture in Mylapore area on East Mada Street. Pressure dropped to 0.38 bar; maintenance crew is on site fixing it.',
    zone: 'Mylapore Area (Ward 12)',
    operator: 'Water Officer Rajesh Kumar',
    contact: '044-24991200',
    relatedComplaintId: 'AQUA-2026-1015'
  },
  {
    id: 'pt_damaged_pipe_2',
    name: 'Broken Pipe 2 (Alwarpet)',
    areaName: 'Alwarpet',
    ward: 'Ward 14 - Alwarpet',
    category: 'damaged_pipe',
    tag: 'Alwarpet • Pipe 2',
    pipeNum: 2,
    x: 43.5,
    y: 53,
    badgeX: 43.5,
    badgeY: 53,
    severity: 'Medium Leak',
    severityColor: 'bg-amber-400',
    exactAddress: '22 Alwarpet Street, Alwarpet',
    pipeSpec: 'Distribution Water Pipe (150mm)',
    leakRate: 'Underground joint seepage',
    pressureDrop: 'Sensor alert: 0.42 bar detected',
    status: 'Workers Coming Today',
    statusBadge: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    description: 'A cracked water pipe joint was detected under Alwarpet Street in Alwarpet area. Repair workers are scheduled to fix it today.',
    briefOverview: 'Underground joint crack in Alwarpet area (22 Alwarpet Street). Leak isolated; replacement crew scheduled to complete repair this afternoon.',
    zone: 'Alwarpet Area (Ward 14)',
    operator: 'Water Officer Anand',
    contact: '044-24935500',
    relatedComplaintId: 'AQUA-2026-1051'
  },
  {
    id: 'pt_damaged_pipe_3',
    name: 'Broken Pipe 3 (Mandaveli)',
    areaName: 'Mandaveli',
    ward: 'Ward 13 - Mandaveli',
    category: 'damaged_pipe',
    tag: 'Mandaveli • Pipe 3',
    pipeNum: 3,
    x: 35.5,
    y: 31,
    badgeX: 35.5,
    badgeY: 31,
    severity: 'Active Leak',
    severityColor: 'bg-rose-600',
    exactAddress: 'Near Pillar 42, 4th Main Road, Mandaveli',
    pipeSpec: 'River Crossing Water Pipe (200mm)',
    leakRate: 'Active water leak at bridge',
    pressureDrop: 'Rapid line loss detected',
    status: 'Workers Fixing It Now',
    statusBadge: 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold animate-pulse',
    description: 'A broken water pipe on Mandaveli 4th Main Road near Pillar 42 was detected by sensor. Repair workers are on the spot fixing it.',
    briefOverview: 'Active pipe fracture in Mandaveli area (Pillar 42, 4th Main Road). Main isolation valve closed to prevent water waste; repair team actively fixing it.',
    zone: 'Mandaveli Area (Ward 13)',
    operator: 'Water Officer Rajesh Kumar',
    contact: '044-24935566',
    relatedComplaintId: 'AQUA-2026-1042'
  }
];

export const MapScreen: React.FC<MapScreenProps> = ({ onReportAtLocation }) => {
  const {
    t,
    selectedMapPointId,
    complaints,
    updateComplaintStatus,
    currentRole,
    currentUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [mapFilter, setMapFilter] = useState<'all' | 'sensor_alerts' | 'pipes'>('all');
  const [resolveBanner, setResolveBanner] = useState<string | null>(null);

  // Dynamically merge base points with real-time complaints state & ML sensor alerts
  const allMapPoints = useMemo<WatershedPoint[]>(() => {
    // 1. Start with base points synced with complaint resolution status
    const updatedBase: WatershedPoint[] = BASE_WATERSHED_POINTS.map((pt) => {
      const match = complaints.find(
        (c) => c.id === pt.relatedComplaintId || c.location.toLowerCase().includes(pt.areaName.toLowerCase())
      );
      if (match) {
        const isResolved = match.status === 'Resolved';
        return {
          ...pt,
          status: isResolved ? '✅ Problem Resolved by Officer' : match.status === 'In Progress' ? 'Workers Fixing It Now' : 'Officer Dispatched',
          statusBadge: isResolved
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
            : pt.statusBadge,
          severity: isResolved ? 'Resolved' : pt.severity,
          severityColor: isResolved ? 'bg-emerald-500' : pt.severityColor,
          isCured: isResolved,
          relatedComplaintId: match.id,
          sensorAlertMessage: match.sensorData?.alertMessage
        };
      }
      return pt;
    });

    // 2. Add any complaints that have sensorData not already covered by base points
    const EXCLUDED_MAP_COMPLAINT_IDS = new Set(['AQUA-2026-6286', 'AQUA-2026-6341', 'AQUA-2026-1490', 'AQUA-2026-1051']);
    const additionalSensorPoints: WatershedPoint[] = [];
    complaints.forEach((c, idx) => {
      if (EXCLUDED_MAP_COMPLAINT_IDS.has(c.id)) return;
      if (!c.sensorData?.alertMessage) return;

      // Citizen privacy: Citizens only see municipal infrastructure or their own submitted complaint
      if (currentRole === 'citizen') {
        const isMyComplaint =
          (currentUser?.id && c.userId === currentUser.id) ||
          (currentUser?.mobile && c.userMobile === currentUser.mobile);
        if (!isMyComplaint) return;
      }

      const alreadyCovered = updatedBase.some(
        (b) => b.relatedComplaintId === c.id || (b.areaName.toLowerCase() === 'mylapore' && c.ward.includes('12'))
      );
      if (alreadyCovered) return;

      const isResolved = c.status === 'Resolved';
      // Compute reasonable coordinates on water network canvas based on ward
      let x = 48;
      let y = 65;
      if (c.ward.includes('13') || c.location.toLowerCase().includes('mandaveli')) {
        x = 35.5;
        y = 31;
      } else if (c.ward.includes('14') || c.location.toLowerCase().includes('alwarpet')) {
        x = 43.5;
        y = 53;
      } else if (c.ward.includes('12') || c.location.toLowerCase().includes('mylapore')) {
        x = 62;
        y = 46;
      } else if (c.ward.includes('15') || c.location.toLowerCase().includes('south')) {
        x = 48;
        y = 65;
      }

      additionalSensorPoints.push({
        id: c.id,
        name: c.title,
        areaName: c.ward.split('-')[1]?.trim() || c.ward,
        ward: c.ward,
        category: 'sensor_alert',
        tag: `Sensor Node • #${idx + 4}`,
        pipeNum: idx + 4,
        x,
        y,
        badgeX: x,
        badgeY: y,
        severity: isResolved ? 'Resolved' : c.urgency === 'Emergency' ? 'Critical' : 'High',
        severityColor: isResolved ? 'bg-emerald-500' : c.urgency === 'Emergency' ? 'bg-rose-600' : 'bg-amber-400',
        exactAddress: c.location,
        pipeSpec: c.sensorData.sensorNode || 'Distribution Water Pipeline (200mm)',
        leakRate: isResolved ? 'Water flow normalized to 2.40 bar' : 'Sensor anomaly detected',
        pressureDrop: c.sensorData.pressureBar ? `Pressure: ${c.sensorData.pressureBar} bar` : 'Telemetry alert active',
        status: isResolved ? '✅ Resolved by Officer' : c.status === 'In Progress' ? 'Officer Fixing on Site' : 'Dispatched to Officer',
        statusBadge: isResolved
          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
          : 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold animate-pulse',
        description: c.description,
        briefOverview: c.sensorData.alertMessage,
        zone: c.ward,
        operator: c.assignedOfficerName || 'Water Officer Rajesh Kumar',
        contact: c.assignedOfficerContact || '044-24991200',
        relatedComplaintId: c.id,
        sensorAlertMessage: c.sensorData.alertMessage,
        isCured: isResolved
      });
    });

    return [...updatedBase, ...additionalSensorPoints];
  }, [complaints]);

  const initialPoint = selectedMapPointId
    ? allMapPoints.find((p) => p.id === selectedMapPointId || p.relatedComplaintId === selectedMapPointId) || null
    : null;

  const [selectedPoint, setSelectedPoint] = useState<WatershedPoint | null>(initialPoint);

  // Smooth Pan & Zoom
  const [zoomLevel, setZoomLevel] = useState(initialPoint ? 1.15 : 1.0);
  const [panOffset, setPanOffset] = useState(() => (
    initialPoint
      ? { x: -((initialPoint.x - 50) * 2), y: -((initialPoint.y - 50) * 2) }
      : { x: 0, y: 0 }
  ));
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  useEffect(() => {
    if (selectedMapPointId) {
      const pt = allMapPoints.find((p) => p.id === selectedMapPointId || p.relatedComplaintId === selectedMapPointId);
      if (pt) {
        setSelectedPoint(pt);
        setZoomLevel(1.15);
        setPanOffset({
          x: -((pt.x - 50) * 2),
          y: -((pt.y - 50) * 2)
        });
      }
    }
  }, [selectedMapPointId, allMapPoints]);

  // Keep selected point synced with complaints state updates
  useEffect(() => {
    if (selectedPoint) {
      const updated = allMapPoints.find((p) => p.id === selectedPoint.id);
      if (updated) {
        setSelectedPoint(updated);
      }
    }
  }, [allMapPoints]);

  // Filter points based on search & domain
  const filteredPoints = allMapPoints.filter((p) => {
    if (mapFilter === 'sensor_alerts' && !p.sensorAlertMessage) return false;
    if (mapFilter === 'pipes' && p.category !== 'damaged_pipe') return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.areaName.toLowerCase().includes(q) ||
      p.ward.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q) ||
      p.exactAddress.toLowerCase().includes(q) ||
      p.zone.toLowerCase().includes(q)
    );
  });

  // Pan Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: panOffset.x,
      startY: panOffset.y
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const limit = 180 * zoomLevel;
    const nextX = Math.max(-limit, Math.min(limit, dragStartRef.current.startX + dx));
    const nextY = Math.max(-limit, Math.min(limit, dragStartRef.current.startY + dy));
    setPanOffset({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    dragStartRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((z) => Math.min(Number((z + 0.25).toFixed(2)), 2.2));
  };

  const handleZoomOut = () => {
    setZoomLevel((z) => Math.max(Number((z - 0.25).toFixed(2)), 0.95));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleSelectPoint = (pt: WatershedPoint) => {
    setSelectedPoint(pt);
    const targetX = -((pt.x - 50) * 2.0);
    const targetY = -((pt.y - 50) * 2.0);
    setPanOffset({ x: targetX, y: targetY });
  };

  // Direct "Officer Mark Resolved" on Map
  // Direct "Officer Mark Resolved" on Map
  const handleOfficerResolveFromMap = (pt: WatershedPoint) => {
    if (!pt.relatedComplaintId) return;

    updateComplaintStatus(
      pt.relatedComplaintId,
      'Resolved',
      `Officer Rajesh Kumar resolved problem on site at ${pt.areaName}: Pipeline repaired, normal water flow restored to 2.40 bar.`
    );

    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.55 }
      });
    } catch {
      // ignore
    }

    setResolveBanner(`✅ Resolved! ${pt.name} resolved on site. Water pressure normalized to 2.4 bar.`);
    setTimeout(() => {
      setResolveBanner(null);
    }, 4500);
  };

  const activeAlertsCount = allMapPoints.filter((p) => !p.isCured).length;

  return (
    <div className="space-y-3 pb-24">
      {/* HEADER & COMPACT AREA SELECTOR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {t.waterServiceMap}
            </h2>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                activeAlertsCount > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {activeAlertsCount > 0 ? `${activeAlertsCount} Active Anomalies` : 'All Resolved & Normal'}
            </span>
            <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
              Live IoT & ML Sync
            </span>
          </div>
        </div>

        {/* QUICK AREA BUTTONS */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-0.5">
          {allMapPoints.slice(0, 4).map((pt) => {
            const isSelected = selectedPoint?.id === pt.id;
            const isCured = pt.isCured;

            return (
              <button
                key={pt.id}
                onClick={() => handleSelectPoint(pt)}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 border shadow-2xs cursor-pointer ${
                  isSelected
                    ? isCured
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : isCured ? 'text-emerald-600' : 'text-rose-600'}`} />
                <span>{pt.areaName}</span>
                {isCured && <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESOLUTION NOTIFICATION BANNER */}
      {resolveBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white shadow-md flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold leading-tight">{resolveBanner}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full shrink-0">
            Map Updated
          </span>
        </div>
      )}

      {/* SEARCH BAR & FILTER TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search area (e.g. Mylapore, Alwarpet, Mandaveli)..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 p-0.5 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setMapFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              mapFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({allMapPoints.length})
          </button>
          <button
            type="button"
            onClick={() => setMapFilter('sensor_alerts')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              mapFilter === 'sensor_alerts' ? 'bg-cyan-600 text-white' : 'text-cyan-800 hover:text-cyan-900'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>ML Sensor Alerts</span>
          </button>
        </div>
      </div>

      {/* SATELLITE WATER MAP CONTAINER */}
      <div
        className="relative w-full h-[340px] sm:h-[430px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/60 shadow-xl bg-slate-950 select-none cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Subtle Map Depth Vignette */}
        <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]" />

        {/* TRANSFORMED CANVAS (PAN + ZOOM) */}
        <div
          className="absolute inset-0 transition-transform duration-75 origin-center will-change-transform"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
          }}
        >
          {/* SATELLITE BASE IMAGE */}
          <img
            src={aerialMapImg || '/images/aerial_water_map.jpg'}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/aerial_water_map.jpg';
            }}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            alt="Water Network Map"
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />

          {/* SVG WATER PIPELINE & LEAK GLOW BEACONS */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="pipelineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#00e5ff" floodOpacity="0.8" />
              </filter>
              <filter id="leakRedGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#f43f5e" floodOpacity="0.9" />
              </filter>
              <filter id="leakAmberGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#fbbf24" floodOpacity="0.9" />
              </filter>
              <filter id="curedGreenGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#10b981" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Glowing Water Pipeline Line */}
            <path
              d="M 87 37 Q 78 41 66 35 T 43 26 Q 35 28 35.5 31 Q 38 43 43.5 53 Q 50 56 57 59"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#pipelineGlow)"
            />

            {/* Dotted Flow Line */}
            <path
              d="M 87 37 Q 78 41 66 35 T 43 26 Q 35 28 35.5 31 Q 38 43 43.5 53 Q 50 56 57 59"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.0"
              strokeDasharray="2 3"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>

          {/* 📍 CLEAN, BEAUTIFUL MAP PINS (PRECISELY AT EACH POINT) */}
          {filteredPoints.map((pt) => {
            const isSelected = selectedPoint?.id === pt.id;
            const isCured = pt.isCured;
            const isRed = !isCured && (pt.severity.toLowerCase().includes('big') || pt.severity.toLowerCase().includes('active') || pt.severity.toLowerCase().includes('critical'));

            return (
              <div
                key={pt.id}
                className="absolute transform -translate-x-1/2 -translate-y-full z-30 pointer-events-auto cursor-pointer transition-transform duration-200"
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                onClick={() => handleSelectPoint(pt)}
              >
                {/* Compact, Sleek Pin Capsule */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md transition-all shadow-md ${
                    isSelected
                      ? isCured
                        ? 'bg-slate-950 text-white border-2 border-emerald-400 ring-2 ring-emerald-400/40 -translate-y-0.5 scale-105 shadow-emerald-950/80'
                        : 'bg-slate-950 text-white border-2 border-rose-400 ring-2 ring-rose-400/40 -translate-y-0.5 scale-105 shadow-rose-950/80'
                      : isCured
                      ? 'bg-slate-950/90 text-emerald-200 border border-emerald-500/50 hover:scale-105 shadow-black/50'
                      : 'bg-slate-950/85 hover:bg-slate-950 text-slate-100 border border-white/20 hover:border-white/50 hover:scale-105 shadow-black/50'
                  }`}
                >
                  {/* Status Indicator Dot */}
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isCured
                        ? 'bg-emerald-400'
                        : isRed
                        ? 'bg-rose-500 animate-pulse'
                        : 'bg-amber-400'
                    }`}
                  />
                  {/* Clean, readable Area & Pipe text */}
                  <span className="text-[11px] font-bold tracking-tight text-white whitespace-nowrap">
                    {pt.areaName}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {isCured ? 'Resolved' : `#${pt.pipeNum}`}
                  </span>
                </div>

                {/* Direct Arrow Needle to the Point */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] ${
                      isSelected
                        ? isCured
                          ? 'border-t-emerald-400'
                          : 'border-t-rose-400'
                        : 'border-t-slate-900'
                    }`}
                  />
                  {/* Pulsing Beacon directly at the exact point */}
                  <div className="relative w-2.5 h-2.5 -mt-0.5 flex items-center justify-center">
                    <span
                      className={`absolute w-full h-full rounded-full opacity-75 ${
                        isCured ? 'bg-emerald-400' : isRed ? 'bg-rose-400 animate-ping' : 'bg-amber-400 animate-ping'
                      }`}
                    />
                    <span
                      className={`relative w-2 h-2 rounded-full border border-white shadow-xs ${
                        isCured ? 'bg-emerald-500' : isRed ? 'bg-rose-600' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM-LEFT: MINIMAL SCALE BAR */}
        <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white shadow-lg">
            <div className="flex items-center">
              <span className="h-2 w-0.5 bg-white/90" />
              <span className="w-8 sm:w-12 h-0.5 bg-white/90" />
              <span className="h-2 w-0.5 bg-white/90" />
            </div>
            <span className="text-[10px] font-medium text-slate-200">200 m</span>
          </div>
        </div>

        {/* BOTTOM-RIGHT: COMPACT ZOOM & RECENTER CONTROLS */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex flex-col gap-1">
          <div className="flex flex-col rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 shadow-xl overflow-hidden divide-y divide-white/10 text-white">
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 sm:p-2 hover:text-cyan-400 hover:bg-white/10 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 sm:p-2 hover:text-cyan-400 hover:bg-white/10 transition active:scale-95 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleResetView}
              title="Center Map"
              className="p-1.5 sm:p-2 hover:text-cyan-400 hover:bg-white/10 transition active:scale-95 cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* SELECTED LEAK DETAIL CARD WITH "OFFICER CURE" ACTION */}
      {selectedPoint && (
        <div
          className={`p-3.5 sm:p-4 rounded-2xl bg-white border shadow-sm space-y-3 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            selectedPoint.isCured ? 'border-emerald-300 ring-1 ring-emerald-500/20' : 'border-rose-200'
          }`}
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
                  selectedPoint.isCured
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}
              >
                {selectedPoint.isCured ? (
                  <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 stroke-[2]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    {selectedPoint.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                    {selectedPoint.areaName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedPoint.statusBadge}`}>
                    {selectedPoint.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  📍 {selectedPoint.exactAddress} • {selectedPoint.ward}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPoint(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0 cursor-pointer"
              title="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sensor Alert Message if present */}
          {selectedPoint.sensorAlertMessage && (
            <div className="p-2.5 rounded-xl bg-cyan-50/80 border border-cyan-200 text-xs text-cyan-950 font-medium flex items-start gap-1.5 leading-relaxed">
              <Radio className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
              <span>{selectedPoint.sensorAlertMessage}</span>
            </div>
          )}

          {/* Summary */}
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
            {selectedPoint.briefOverview}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Area</span>
              <span className="font-bold text-cyan-800 block mt-0.5">{selectedPoint.areaName}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ward</span>
              <span className="font-semibold text-slate-800 block truncate mt-0.5">{selectedPoint.ward}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Severity</span>
              <span className={`font-bold block mt-0.5 ${selectedPoint.isCured ? 'text-emerald-700' : 'text-rose-700'}`}>
                {selectedPoint.severity}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Flow / Pressure</span>
              <span className="font-semibold text-slate-700 block truncate mt-0.5">{selectedPoint.pressureDrop}</span>
            </div>
          </div>

          {/* Action Row: Officer Cure Button (Enabled ONLY for Officer) */}
          {currentRole === 'officer' && !selectedPoint.isCured && selectedPoint.relatedComplaintId && (
            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleOfficerResolveFromMap(selectedPoint)}
                className="w-full sm:w-auto py-2 px-4 rounded-xl text-white font-extrabold text-xs shadow-sm bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>👨‍🔧 Officer Mark Resolved</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* OVERVIEW LIST OF BROKEN PIPES & SENSOR NODES */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-100">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                Water Network Locations & Sensor Alerts
              </h3>
              <p className="text-[11px] text-slate-500">
                Tap any location card to center and inspect on satellite map
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {allMapPoints.length} Monitored Points
          </span>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {allMapPoints.map((pt) => {
            const isSelected = selectedPoint?.id === pt.id;
            const isCured = pt.isCured;

            return (
              <div
                key={pt.id}
                onClick={() => handleSelectPoint(pt)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? isCured
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/15 shadow-xs'
                      : 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/15 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <MapPin className={`w-3 h-3 ${isCured ? 'text-emerald-600' : 'text-rose-600'}`} />
                      <span>{pt.areaName}</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                        isCured
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {pt.severity}
                    </span>
                  </div>

                  <h4 className="text-[11px] font-semibold text-slate-700 truncate">
                    {pt.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    📍 {pt.exactAddress}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className={`font-semibold ${isCured ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {pt.status}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-cyan-700 hover:text-cyan-800">
                    <span>View Pin</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
