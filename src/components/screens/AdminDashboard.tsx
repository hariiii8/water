import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, User, Announcement } from '../../types';
import { SAMPLE_USERS, MUNICIPAL_WARDS } from '../../data/initialData';
import { ComplaintCategoryIcon } from '../ComplaintCategoryIcon';
import {
  ShieldCheck,
  Users,
  Wrench,
  Radio,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  PlusCircle,
  X,
  Droplets,
  Building,
  UserPlus,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    complaints,
    announcements,
    addAnnouncement,
    assignComplaintToOfficer,
    officersList,
    locations
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ASSIGNMENT' | 'ANNOUNCEMENTS' | 'USERS' | 'WATER_POINTS'>('ASSIGNMENT');
  const [selectedComplaintToAssign, setSelectedComplaintToAssign] = useState<Complaint | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState(officersList[0]?.id || 'user_officer_1');
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(SAMPLE_USERS);

  React.useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          setRegisteredUsers(data.users);
        }
      })
      .catch(() => {
        // fallback
      });
  }, []);

  // Announcement modal state
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<'Interruption' | 'Maintenance' | 'Quality Advisory' | 'New Pipeline'>('Maintenance');
  const [annSeverity, setAnnSeverity] = useState<'Info' | 'Warning' | 'Critical'>('Warning');
  const [annWard, setAnnWard] = useState('All Wards (1-200)');

  // Metrics
  const totalComplaints = complaints.length;
  const pendingTriage = complaints.filter((c) => c.status === 'Submitted' || !c.assignedOfficerId).length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaintToAssign) return;
    assignComplaintToOfficer(selectedComplaintToAssign.id, selectedOfficerId);
    setSelectedComplaintToAssign(null);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      category: annCategory,
      severity: annSeverity,
      affectedWards: [annWard],
      validUntil: 'End of Month',
      author: currentUser?.name || 'Chief Administrator'
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnouncementModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Administrator Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-white">
                  {currentUser?.name || 'Dr. Meenakshi'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                  Manager
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentUser?.designation || 'Water Department Manager'}
              </p>
              <p className="text-[11px] text-indigo-300/80 font-medium">
                {currentUser?.department || 'City Water Office'}
              </p>
            </div>
          </div>
        </div>

        {/* 6 Comprehensive System Metrics */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Total</span>
            <span className="block text-sm font-extrabold text-white">{totalComplaints}</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Need Officer</span>
            <span className="block text-sm font-extrabold text-rose-400">{pendingTriage}</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Working on It</span>
            <span className="block text-sm font-extrabold text-amber-400">{inProgress}</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Fixed</span>
            <span className="block text-sm font-extrabold text-emerald-400">{resolved}</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Officers</span>
            <span className="block text-sm font-extrabold text-cyan-400">12 Wards</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl">
            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Turbidity</span>
            <span className="block text-sm font-extrabold text-teal-400">0.85 NTU</span>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('ASSIGNMENT')}
          className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'ASSIGNMENT'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Assign Officers ({pendingTriage})
        </button>
        <button
          onClick={() => setActiveTab('ANNOUNCEMENTS')}
          className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'ANNOUNCEMENTS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Water News ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'USERS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Users & Officers
        </button>
        <button
          onClick={() => setActiveTab('WATER_POINTS')}
          className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'WATER_POINTS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Water Tanks & Pumps
        </button>
      </div>

      {/* 1. ASSIGNMENT DESK */}
      {activeTab === 'ASSIGNMENT' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">
              Complaints Needing an Officer
            </span>
            <span className="text-[11px] text-slate-500">
              Pick an officer to go check the problem
            </span>
          </div>

          {complaints.filter((c) => c.status !== 'Resolved').map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <ComplaintCategoryIcon category={c.category} size="md" glow />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {c.id}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600">
                      {c.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-50 text-amber-700">
                      {c.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{c.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    📍 {c.location} ({c.ward}) • Citizen: {c.userName} ({c.userMobile})
                  </p>
                  {c.assignedOfficerName && (
                    <p className="text-[11px] text-indigo-600 font-semibold mt-1">
                      Assigned: {c.assignedOfficerName}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedComplaintToAssign(c)}
                className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>{c.assignedOfficerName ? 'Reassign' : 'Assign Officer'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 2. ANNOUNCEMENTS MANAGER */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Official Public Water Alerts
            </span>
            <button
              onClick={() => setAnnouncementModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Broadcast New Alert</span>
            </button>
          </div>

          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                  {ann.category}
                </span>
                <span className="text-[10px] text-slate-400">
                  {ann.publishedAt}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{ann.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Wards: {ann.affectedWards.join(', ')}</span>
                <span>Author: {ann.author}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. USER DIRECTORY */}
      {activeTab === 'USERS' && (
        <div className="space-y-3">
          <div className="px-1 text-xs font-bold text-slate-700">
            Registered Application Accounts
          </div>
          {registeredUsers.map((u) => (
            <div
              key={u.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-3">
                <img
                  src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                  alt={u.name}
                  className="w-10 h-10 rounded-xl object-cover border shrink-0 mt-0.5 sm:mt-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-slate-900">{u.name}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
                      {u.role}
                    </span>
                    {u.state && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                        {u.state}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {u.mobile} {u.email ? `• ${u.email}` : ''}
                  </p>
                  {u.address && (
                    <p className="text-[10px] text-slate-600 font-medium mt-1 line-clamp-1">
                      🏠 {u.address}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {u.district && (
                      <span className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                        District: {u.district}
                      </span>
                    )}
                    {u.village && (
                      <span className="text-[9px] font-medium bg-cyan-50 text-cyan-800 px-1.5 py-0.2 rounded border border-cyan-100">
                        Village: {u.village}
                      </span>
                    )}
                    {u.gramPanchayat && (
                      <span className="text-[9px] font-medium bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-100">
                        GP: {u.gramPanchayat}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. WATER POINTS MANAGER */}
      {activeTab === 'WATER_POINTS' && (
        <div className="space-y-3">
          <div className="px-1 text-xs font-bold text-slate-700">
            Metropolitan Infrastructure Monitoring
          </div>
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{loc.name}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {loc.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{loc.address}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{loc.capacity} • {loc.supplyTiming}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ASSIGN OFFICER MODAL */}
      {selectedComplaintToAssign && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedComplaintToAssign(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Give Problem to Officer
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Problem #{selectedComplaintToAssign.id}: {selectedComplaintToAssign.title}
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pick an Officer
                </label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
                >
                  {officersList.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.designation} - {off.ward})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900">
                A message will be sent to the officer to visit and inspect the problem.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaintToAssign(null)}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Assign Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setAnnouncementModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Broadcast Public Water Alert
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Push notification to all registered citizens across selected wards.
            </p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alert Title *
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Scheduled Pipe Interconnection Maintenance"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alert Details / Instructions *
                </label>
                <textarea
                  required
                  rows={3}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Explain affected wards, supply timings, and citizen instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  >
                    <option value="Interruption">Supply Interruption</option>
                    <option value="Maintenance">Maintenance Advisory</option>
                    <option value="Quality Advisory">Quality Advisory</option>
                    <option value="New Pipeline">New Pipeline Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={annSeverity}
                    onChange={(e) => setAnnSeverity(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  >
                    <option value="Info">Info (Standard)</option>
                    <option value="Warning">Warning (Important)</option>
                    <option value="Critical">Critical (Emergency)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAnnouncementModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
