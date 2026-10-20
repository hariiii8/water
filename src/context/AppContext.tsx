import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  Language,
  UserRole,
  User,
  Complaint,
  WaterLocation,
  Announcement,
  NotificationItem,
  ComplaintStatus,
  ProblemCategory,
  LiveTelemetry,
  ComplaintSensorData
} from '../types';
import {
  SAMPLE_USERS,
  INITIAL_COMPLAINTS,
  INITIAL_LOCATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  getComplaintSensorData,
  computeMLBrokenPipePrediction
} from '../data/initialData';
import { translations, Translations } from '../translations';

export interface OfficerReviewItem {
  complaintId: string;
  complaintTitle: string;
  userName: string;
  ward: string;
  stars: number;
  feedback: string;
  ratedAt: string;
}

export interface OfficerRatingSummary {
  averageRating: number;
  formattedRating: string;
  totalRatings: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  reviews: OfficerReviewItem[];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentRole: UserRole;
  isLoggedIn: boolean;
  currentScreen: 'language' | 'login' | 'register' | 'main';
  setCurrentScreen: (screen: 'language' | 'login' | 'register' | 'main') => void;
  activeTab: 'home' | 'complaints' | 'map' | 'more';
  setActiveTab: (tab: 'home' | 'complaints' | 'map' | 'more') => void;
  complaints: Complaint[];
  locations: WaterLocation[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  loginAsRole: (role: UserRole, customCredentials?: { identifier?: string; password?: string; name?: string }) => boolean;
  registerCitizen: (citizenData: any) => boolean;
  updateUserProfile: (updates: Partial<User>) => void;
  logout: () => void;
  addComplaint: (data: Partial<Complaint>) => string;
  updateComplaintStatus: (id: string, newStatus: ComplaintStatus, note?: string, resolutionPhoto?: string) => void;
  updateComplaintMLDiagnosis: (complaintId: string, customData?: Partial<ComplaintSensorData>) => void;
  assignComplaintToOfficer: (complaintId: string, officerId: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishedAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  viewMode: 'mobile' | 'responsive';
  setViewMode: (mode: 'mobile' | 'responsive') => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  selectedComplaint: Complaint | null;
  setSelectedComplaint: (complaint: Complaint | null) => void;
  selectedMapPointId: string | null;
  setSelectedMapPointId: (id: string | null) => void;
  officersList: User[];
  rateOfficer: (complaintId: string, stars: number, feedback?: string) => void;
  officerRatingSummary: OfficerRatingSummary;
  isReportingProblem: boolean;
  setIsReportingProblem: (isReporting: boolean) => void;
  prefilledReportData: {
    category?: ProblemCategory;
    title?: string;
    description?: string;
    location?: string;
    ward?: string;
    urgency?: 'Low' | 'Medium' | 'High' | 'Emergency';
  } | null;
  setPrefilledReportData: (data: {
    category?: ProblemCategory;
    title?: string;
    description?: string;
    location?: string;
    ward?: string;
    urgency?: 'Low' | 'Medium' | 'High' | 'Emergency';
  } | null) => void;
  openReportWithDiagnosis: (data: {
    category?: ProblemCategory;
    title?: string;
    description?: string;
    location?: string;
    ward?: string;
    urgency?: 'Low' | 'Medium' | 'High' | 'Emergency';
  }) => void;
  liveTelemetry: LiveTelemetry;
  isWsConnected: boolean;
  activeUsersCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('aquacare_lang');
    return (saved as Language) || 'en';
  });

  const [currentScreen, setCurrentScreen] = useState<'language' | 'login' | 'register' | 'main'>(() => {
    const savedLoggedIn = localStorage.getItem('aquacare_logged_in');
    const savedUser = localStorage.getItem('aquacare_user');
    if (savedLoggedIn === 'true' && savedUser) {
      return 'main';
    }
    // Always start on the front welcome / language screen
    return 'language';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aquacare_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && u.address && (u.address.includes('Sri Krishna') || u.address.includes('Flat 3B'))) {
          u.address = '14 Kutchery Road, Mylapore';
          localStorage.setItem('aquacare_user', JSON.stringify(u));
        }
        return u;
      } catch {
        return SAMPLE_USERS[0];
      }
    }
    return SAMPLE_USERS[0];
  });

  const [activeTab, setActiveTabState] = useState<'home' | 'complaints' | 'map' | 'more'>('home');
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');
  const [isReportingProblem, setIsReportingProblem] = useState(false);
  const [prefilledReportData, setPrefilledReportData] = useState<{
    category?: ProblemCategory;
    title?: string;
    description?: string;
    location?: string;
    ward?: string;
    urgency?: 'Low' | 'Medium' | 'High' | 'Emergency';
  } | null>(null);

  const cleanLocationString = (loc?: string) => {
    if (!loc) return '14 Kutchery Road, Mylapore';
    if (loc.includes('Sri Krishna') || loc.includes('Flat 3B')) {
      return '14 Kutchery Road, Mylapore';
    }
    return loc;
  };

  const EXCLUDED_COMPLAINT_IDS = useMemo(() => new Set(['AQUA-2026-6286', 'AQUA-2026-6341', 'AQUA-2026-1490', 'AQUA-2026-1051']), []);

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('aquacare_v2_complaints');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed
            .filter((item: any) => !['AQUA-2026-6286', 'AQUA-2026-6341', 'AQUA-2026-1490', 'AQUA-2026-1051'].includes(item.id))
            .map((item: any) => {
              const matching = INITIAL_COMPLAINTS.find((c) => c.id === item.id);
              const isActive = (item.status || matching?.status) !== 'Resolved';
              const cleanLoc = cleanLocationString(item.location || matching?.location);
              const rawNotes = item.officerNotes || matching?.officerNotes;
              const cleanNotes = Array.isArray(rawNotes)
                ? Array.from(new Set(
                    rawNotes.map((n: string) =>
                      typeof n === 'string'
                        ? n.replace(/Flat 3B,?\s*Sri Krishna Apartments,?\s*/gi, '').trim()
                        : n
                    ).filter(Boolean)
                  ))
                : undefined;

              if (matching) {
                return {
                  ...matching,
                  location: cleanLoc,
                  status: item.status || matching.status,
                  officerRating: item.officerRating || matching.officerRating,
                  officerNotes: cleanNotes || matching.officerNotes,
                  photoUrl: isActive ? undefined : (matching.photoUrl || item.photoUrl),
                  sensorData: matching.sensorData || item.sensorData
                };
              }
              const { resolutionPhotoUrl, ...rest } = item;
              const cItem = rest as Complaint;
              return {
                ...cItem,
                location: cleanLoc,
                officerNotes: cleanNotes,
                photoUrl: isActive ? undefined : cItem.photoUrl,
                sensorData: cItem.sensorData
              };
            });

          if (filtered.length > 0) return filtered;
        }
      } catch {
        return INITIAL_COMPLAINTS;
      }
    }
    return INITIAL_COMPLAINTS;
  });

  const [locations, setLocations] = useState<WaterLocation[]>(() => {
    const saved = localStorage.getItem('aquacare_v2_locations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_LOCATIONS;
      }
    }
    return INITIAL_LOCATIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('aquacare_v2_announcements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: Announcement) => {
            const matchingAnn = INITIAL_ANNOUNCEMENTS.find((ia) => ia.id === item.id);
            if (matchingAnn) {
              return { ...item, publishedAt: matchingAnn.publishedAt, validUntil: matchingAnn.validUntil };
            }
            return item;
          });
        }
        return INITIAL_ANNOUNCEMENTS;
      } catch {
        return INITIAL_ANNOUNCEMENTS;
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      localStorage.removeItem('aquacare_v2_notifications');
      const saved = localStorage.getItem('aquacare_v3_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Strictly only high emergency alerts
          const emergencyOnly = parsed.filter(
            (n) => n.priority === 'high' || n.type === 'water_alert'
          );
          if (emergencyOnly.length > 0) return emergencyOnly;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedMapPointId, setSelectedMapPointId] = useState<string | null>('pt_damaged_pipe_1');

  // Real-Time WebSocket & Telemetry State (3-Tier Project Architecture)
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [activeUsersCount, setActiveUsersCount] = useState(1);
  const [liveTelemetry, setLiveTelemetry] = useState<LiveTelemetry>({
    tankPh: 7.32,
    tankTurbidityNTU: 0.45,
    tankConductivity: 310,
    tankLevelPercent: 88,
    pipelineFlowRateLpm: 425,
    pipelinePressureBar: 2.40,
    tapPressureBar: 1.32,
    mlBrokenPipeStatus: {
      predicted: false,
      pipelinePressureVariationBar: 0.0,
      tapPressureVariationBar: 0.0,
      probability: 2,
      message: 'Pipeline integrity intact. Pressure variations within acceptable tolerance (±0.10 bar).'
    },
    pressureBar: 2.40,
    ph: 7.32,
    tdsPPM: 198,
    flowRateLpm: 425,
    status: 'optimal',
    lastUpdated: 'Live'
  });
  const wsRef = useRef<WebSocket | null>(null);

  // Authoritative WebSocket Connection
  useEffect(() => {
    let isMounted = true;
    let socket: WebSocket | null = null;
    let reconnectTimeout: any = null;

    const connectWs = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws`;

        socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (!isMounted) return;
          setIsWsConnected(true);
          console.log('[WS] Connected to real-time municipal server');
        };

        socket.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const payload = JSON.parse(event.data);
            const { type, data } = payload;

            if (type === 'init') {
              if (Array.isArray(data.complaints) && data.complaints.length > 0) {
                const cleaned = data.complaints
                  .filter((c: Complaint) => !['AQUA-2026-6286', 'AQUA-2026-6341', 'AQUA-2026-1490', 'AQUA-2026-1051'].includes(c.id))
                  .map((c: Complaint) => {
                    const isActive = c.status !== 'Resolved';
                    const rawNotes = c.officerNotes;
                    const cleanNotes = Array.isArray(rawNotes)
                      ? Array.from(new Set(rawNotes.map((n) => typeof n === 'string' ? n.trim() : n).filter(Boolean)))
                      : undefined;
                    return {
                      ...c,
                      location: cleanLocationString(c.location),
                      photoUrl: isActive ? undefined : c.photoUrl,
                      officerNotes: cleanNotes
                    };
                  });
                if (cleaned.length > 0) {
                  setComplaints(cleaned);
                  localStorage.setItem('aquacare_v2_complaints', JSON.stringify(cleaned));
                }
              }
              if (data.telemetry) {
                setLiveTelemetry(data.telemetry);
              }
              if (typeof data.activeUsers === 'number') {
                setActiveUsersCount(data.activeUsers);
              }
            } else if (type === 'complaint:created') {
              if (['AQUA-2026-6286', 'AQUA-2026-6341', 'AQUA-2026-1490', 'AQUA-2026-1051'].includes(data.id)) return;
              setComplaints((prev) => {
                if (prev.some((c) => c.id === data.id)) return prev;
                const cleanData = { ...data, location: cleanLocationString(data.location) };
                return [cleanData, ...prev];
              });
            } else if (type === 'complaint:updated') {
              const cleanData = { ...data, location: cleanLocationString(data.location) };
              setComplaints((prev) =>
                prev.map((c) => (c.id === data.id ? { ...c, ...cleanData } : c))
              );
              setSelectedComplaint((curr) =>
                curr && curr.id === data.id ? { ...curr, ...cleanData } : curr
              );
            } else if (type === 'telemetry:update') {
              setLiveTelemetry(data);
            } else if (type === 'presence:update') {
              if (typeof data.activeUsers === 'number') {
                setActiveUsersCount(data.activeUsers);
              }
            } else if (type === 'complaints:synced') {
              if (Array.isArray(data) && data.length > 0) {
                const cleaned = data
                  .filter((c: Complaint) => !['AQUA-2026-6286', 'AQUA-2026-6341', 'AQUA-2026-1490', 'AQUA-2026-1051'].includes(c.id))
                  .map((c: Complaint) => {
                    const isActive = c.status !== 'Resolved';
                    const rawNotes = c.officerNotes;
                    const cleanNotes = Array.isArray(rawNotes)
                      ? Array.from(new Set(rawNotes.map((n) => typeof n === 'string' ? n.trim() : n).filter(Boolean)))
                      : undefined;
                    return {
                      ...c,
                      location: cleanLocationString(c.location),
                      photoUrl: isActive ? undefined : c.photoUrl,
                      officerNotes: cleanNotes
                    };
                  });
                if (cleaned.length > 0) {
                  setComplaints(cleaned);
                  localStorage.setItem('aquacare_v2_complaints', JSON.stringify(cleaned));
                }
              }
            }
          } catch (e) {
            console.error('[WS] Message handling error:', e);
          }
        };

        socket.onclose = () => {
          if (!isMounted) return;
          setIsWsConnected(false);
          reconnectTimeout = setTimeout(connectWs, 3000);
        };

        socket.onerror = () => {
          socket?.close();
        };
      } catch (e) {
        console.warn('[WS] Connection attempt failed:', e);
        reconnectTimeout = setTimeout(connectWs, 3000);
      }
    };

    connectWs();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimeout);
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const setActiveTab = (tab: 'home' | 'complaints' | 'map' | 'more') => {
    setIsReportingProblem(false);
    setActiveModal(null);
    setSelectedComplaint(null);
    setActiveTabState(tab);
  };

  const openReportWithDiagnosis = (data: {
    category?: ProblemCategory;
    title?: string;
    description?: string;
    location?: string;
    ward?: string;
    urgency?: 'Low' | 'Medium' | 'High' | 'Emergency';
  }) => {
    setActiveModal(null);
    setSelectedComplaint(null);
    setPrefilledReportData(data);
    setIsReportingProblem(true);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('aquacare_v2_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Initial and periodic sync with backend server
  useEffect(() => {
    const syncWithServer = async () => {
      try {
        const res = await fetch('/api/complaints/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ complaints })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.complaints) && data.complaints.length > 0) {
            setComplaints(data.complaints);
            localStorage.setItem('aquacare_v2_complaints', JSON.stringify(data.complaints));
          }
        }
      } catch (e) {
        console.warn('Backend sync failed or server offline:', e);
      }
    };

    syncWithServer();
  }, []);

  useEffect(() => {
    localStorage.setItem('aquacare_v2_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('aquacare_v2_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('aquacare_v3_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aquacare_lang', lang);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser((prev) => {
      const base = prev || SAMPLE_USERS[0];
      const updated: User = { ...base, ...updates };
      localStorage.setItem('aquacare_user', JSON.stringify(updated));

      // Synchronize complaints so that complaints submitted by this user immediately reflect the updated name, mobile, address, and ward
      setComplaints((currentComplaints) => {
        const synced = currentComplaints.map((c) => {
          if (c.userId === updated.id || c.userId === 'user_citizen_1' || c.userId === 'guest_user') {
            return {
              ...c,
              userName: updated.name || c.userName,
              userMobile: updated.mobile || c.userMobile,
              ward: updated.ward || c.ward,
              panchayat: updated.panchayat || c.panchayat,
              location: updated.address || c.location
            };
          }
          return c;
        });
        localStorage.setItem('aquacare_v2_complaints', JSON.stringify(synced));
        return synced;
      });

      return updated;
    });
  };

  const loginAsRole = (
    role: UserRole,
    customCredentials?: { identifier?: string; password?: string; name?: string }
  ) => {
    let matchedUser: User | undefined;

    if (customCredentials?.identifier) {
      matchedUser = SAMPLE_USERS.find(
        (u) =>
          u.role === role &&
          (u.email.toLowerCase() === customCredentials.identifier?.toLowerCase() ||
            u.mobile === customCredentials.identifier)
      );
    }

    if (!matchedUser) {
      const sample = SAMPLE_USERS.find((u) => u.role === role) || SAMPLE_USERS[0];
      const isEmail = customCredentials?.identifier?.includes('@');
      const isPhone = customCredentials?.identifier && /^\d+$/.test(customCredentials.identifier);
      const customName =
        customCredentials?.name?.trim() ||
        (!isEmail && !isPhone && customCredentials?.identifier?.trim()
          ? customCredentials.identifier.trim()
          : (currentUser?.name || sample.name));

      matchedUser = {
        ...sample,
        id: currentUser?.id || `user_${role}_1`,
        name: customName,
        role: role,
        mobile: isPhone ? customCredentials!.identifier! : (currentUser?.mobile || sample.mobile),
        email: isEmail ? customCredentials!.identifier! : (currentUser?.email || sample.email),
        ward: currentUser?.ward || sample.ward,
        panchayat: currentUser?.panchayat || sample.panchayat,
        address: currentUser?.address || sample.address
      };
    } else if (customCredentials?.name?.trim()) {
      matchedUser = {
        ...matchedUser,
        name: customCredentials.name.trim()
      };
    }

    if (matchedUser) {
      setCurrentUser(matchedUser);
      localStorage.setItem('aquacare_user', JSON.stringify(matchedUser));
      localStorage.setItem('aquacare_logged_in', 'true');
      localStorage.setItem('aquacare_lang_selected', 'true');

      // Sync complaints with this user name and details
      const u = matchedUser;
      setComplaints((currentComplaints) => {
        const synced = currentComplaints.map((c) => {
          if (c.userId === u.id || c.userId === 'user_citizen_1' || c.userId === 'guest_user') {
            return {
              ...c,
              userName: u.name,
              userMobile: u.mobile || c.userMobile,
              ward: u.ward || c.ward,
              panchayat: u.panchayat || c.panchayat,
              location: u.address || c.location
            };
          }
          return c;
        });
        localStorage.setItem('aquacare_v2_complaints', JSON.stringify(synced));
        return synced;
      });

      setCurrentScreen('main');
      setActiveTab('home');
      return true;
    }
    return false;
  };

  const registerCitizen = (citizenData: any) => {
    const citizenId = citizenData.id || `user_citizen_${Date.now()}`;
    const newUser: User = {
      ...citizenData,
      id: citizenId,
      role: 'citizen',
      avatar: citizenData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    };

    setCurrentUser(newUser);
    localStorage.setItem('aquacare_user', JSON.stringify(newUser));
    localStorage.setItem('aquacare_logged_in', 'true');
    localStorage.setItem('aquacare_lang_selected', 'true');

    // Add welcoming civic notification
    const welcomeNotif: NotificationItem = {
      id: `notif_welcome_${Date.now()}`,
      userId: newUser.id,
      title: `Welcome to AquaCare, ${newUser.name}!`,
      message: `Your account is registered under ${newUser.gramPanchayat || newUser.village || 'your local Grampanchayath'} (${newUser.district || ''}, ${newUser.state || ''}). Tap to explore your water supply schedule.`,
      type: 'general',
      timestamp: 'Just now',
      read: false,
      priority: 'low'
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    // Sync complaints with newly registered citizen name & place
    setComplaints((currentComplaints) => {
      const synced = currentComplaints.map((c) => {
        if (c.userId === newUser.id || c.userId === 'user_citizen_1' || c.userId === 'guest_user') {
          return {
            ...c,
            userName: newUser.name,
            userMobile: newUser.mobile || c.userMobile,
            state: newUser.state || c.state,
            district: newUser.district || c.district,
            village: newUser.village || c.village,
            gramPanchayat: newUser.gramPanchayat || c.gramPanchayat,
            ward: newUser.ward || c.ward,
            panchayat: newUser.panchayat || c.panchayat,
            location: newUser.address || c.location
          };
        }
        return c;
      });
      localStorage.setItem('aquacare_v2_complaints', JSON.stringify(synced));
      return synced;
    });

    setCurrentScreen('main');
    setActiveTab('home');
    return true;
  };

  const logout = () => {
    setCurrentUser(SAMPLE_USERS[0]);
    localStorage.removeItem('aquacare_user');
    localStorage.removeItem('aquacare_logged_in');
    localStorage.removeItem('aquacare_lang_selected');
    setCurrentScreen('language');
    setActiveTab('home');
  };

  const addComplaint = (data: Partial<Complaint>): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `AQUA-2026-${randomNum}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newComplaint: Complaint = {
      id: newId,
      userId: currentUser?.id || 'guest_user',
      userName: currentUser?.name || 'Citizen User',
      userMobile: currentUser?.mobile || '9840123456',
      title: data.title || 'Reported Water Problem',
      category: data.category || 'Other',
      description: data.description || '',
      location: data.location || (currentUser?.address || 'Municipal Ward'),
      panchayat: data.panchayat || currentUser?.panchayat || 'Mylapore Town Panchayat',
      ward: data.ward || (currentUser?.ward || 'Ward 12 - Mylapore'),
      coordinates: data.coordinates || { lat: 13.033, lng: 80.265 },
      submittedAt: formattedDate,
      status: 'Submitted',
      urgency: data.urgency || 'Medium',
      assignedOfficerId: 'user_officer_1',
      assignedOfficerName: 'Rajesh Kumar',
      assignedOfficerContact: '+91 98765 43210',
      photoUrl: data.photoUrl,
      sensorData: data.sensorData || getComplaintSensorData({
        category: data.category || 'Other',
        title: data.title || '',
        submittedAt: formattedDate
      } as any),
      timeline: [
        {
          status: 'Submitted',
          timestamp: formattedDate,
          title: 'Complaint Registered',
          description: `Complaint logged via AquaCare portal by ${currentUser?.name || 'Citizen'}.`,
          updatedBy: 'Citizen'
        }
      ]
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Send to backend server
    fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComplaint)
    }).catch((err) => console.warn('Server update error for new complaint:', err));

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'complaint:create', data: newComplaint }));
    }

    // Dispatch notifications to both Officer Rajesh Kumar and Citizen
    const officerNotif: NotificationItem = {
      id: `notif_officer_${Date.now()}`,
      userId: 'user_officer_1',
      title: `Water Alert Dispatched #${newId}`,
      message: data.description || data.sensorData?.alertMessage || `Alert for ${data.category || 'Water Supply'} at ${data.location || 'site area'}.`,
      type: 'water_alert',
      timestamp: 'Just now',
      read: false,
      relatedComplaintId: newId,
      priority: 'high'
    };

    const citizenNotif: NotificationItem = {
      id: `notif_citizen_${Date.now()}`,
      userId: currentUser?.id || 'guest',
      title: `Complaint Logged #${newId}`,
      message: data.description || `Your complaint for ${data.category || 'water supply'} was dispatched to Officer Rajesh Kumar.`,
      type: 'complaint_update',
      timestamp: 'Just now',
      read: false,
      relatedComplaintId: newId,
      priority: 'high'
    };

    setNotifications((prev) => [officerNotif, citizenNotif, ...prev]);

    return newId;
  };

  const updateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus,
    note?: string,
    resolutionPhoto?: string
  ) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    setComplaints((prev) => {
      const next = prev.map((c) => {
        if (c.id !== id) return c;

        const notes = c.officerNotes ? [...c.officerNotes] : [];
        if (note && !notes.includes(note)) {
          notes.push(note);
        }

        const lastTimeline = c.timeline?.[c.timeline.length - 1];
        const isDuplicateTimeline =
          lastTimeline &&
          lastTimeline.status === newStatus &&
          lastTimeline.description === (note || `Status updated to ${newStatus}.`);

        const updatedTimeline = isDuplicateTimeline
          ? c.timeline
          : [
              ...c.timeline,
              {
                status: newStatus,
                timestamp: formattedDate,
                title: `Status: ${newStatus}`,
                description: note || `Status updated to ${newStatus}.`,
                updatedBy: currentUser?.name || 'Officer'
              }
            ];

        const updatedItem = {
          ...c,
          status: newStatus,
          resolutionPhotoUrl: resolutionPhoto || c.resolutionPhotoUrl,
          officerNotes: notes,
          timeline: updatedTimeline
        };

        // Send update to backend server
        fetch(`/api/complaints/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem)
        }).catch((err) => console.warn('Server update error for complaint status:', err));

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'complaint:update', data: { id, updates: updatedItem } }));
        }

        return updatedItem;
      });

      try {
        localStorage.setItem('aquacare_v2_complaints', JSON.stringify(next));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      return next;
    });
  };

  const updateComplaintMLDiagnosis = (complaintId: string, customData?: Partial<ComplaintSensorData>) => {
    let updatedTarget: Complaint | undefined;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const currentData = c.sensorData || getComplaintSensorData(c);

        const newPipelinePressure = customData?.pipeline?.pressureBar !== undefined
          ? customData.pipeline.pressureBar
          : customData?.pressureBar !== undefined
          ? customData.pressureBar
          : currentData.pipeline?.pressureBar || 2.40;

        const newPipelineFlow = customData?.pipeline?.flowRateLpm !== undefined
          ? customData.pipeline.flowRateLpm
          : customData?.flowRateLpm !== undefined
          ? customData.flowRateLpm
          : currentData.pipeline?.flowRateLpm || 420;

        const newTapPressure = customData?.tap?.pressureBar !== undefined
          ? customData.tap.pressureBar
          : customData?.tapPressureBar !== undefined
          ? customData.tapPressureBar
          : currentData.tap?.pressureBar || 1.30;

        const newTankPh = customData?.tank?.ph !== undefined
          ? customData.tank.ph
          : customData?.ph !== undefined
          ? customData.ph
          : currentData.tank?.ph || 7.25;

        const newTankTurbidity = customData?.tank?.turbidityNTU !== undefined
          ? customData.tank.turbidityNTU
          : customData?.turbidityNTU !== undefined
          ? customData.turbidityNTU
          : currentData.tank?.turbidityNTU || 0.40;

        const newTankConductivity = customData?.tank?.conductivity !== undefined
          ? customData.tank.conductivity
          : customData?.conductivity !== undefined
          ? customData.conductivity
          : currentData.tank?.conductivity || 310;

        const tank = { ph: newTankPh, turbidityNTU: newTankTurbidity, conductivity: newTankConductivity };
        const pipeline = { flowRateLpm: newPipelineFlow, pressureBar: newPipelinePressure };
        const tap = { pressureBar: newTapPressure };

        const mlPrediction = customData?.mlPrediction || computeMLBrokenPipePrediction(
          pipeline.pressureBar,
          pipeline.flowRateLpm,
          tap.pressureBar,
          tank.turbidityNTU
        );

        const sensorData: ComplaintSensorData = {
          ...currentData,
          ...customData,
          sensorNode: customData?.sensorNode || currentData.sensorNode,
          tank,
          pipeline,
          tap,
          mlPrediction,
          pressureBar: pipeline.pressureBar,
          tapPressureBar: tap.pressureBar,
          flowRateLpm: pipeline.flowRateLpm,
          ph: tank.ph,
          turbidityNTU: tank.turbidityNTU,
          conductivity: tank.conductivity,
          tdsPPM: Math.round(tank.conductivity * 0.64),
          temperatureC: customData?.temperatureC !== undefined ? customData.temperatureC : 26.8,
          simpleDiagnosis: customData?.simpleDiagnosis || mlPrediction.diagnosisReason,
          alertMessage: customData?.alertMessage || (mlPrediction.isBrokenPipePredicted
            ? `Underground pipe fracture predicted: Pressure variation ΔP -${mlPrediction.pipelinePressureDropBar.toFixed(2)} bar detected.`
            : 'Optimal pressure and water purity standards verified by ML model.'),
          severity: customData?.severity || (mlPrediction.isBrokenPipePredicted ? 'Critical' : 'Normal')
        };

        updatedTarget = {
          ...c,
          sensorData
        };
        return updatedTarget;
      })
    );

    if (updatedTarget) {
      if (selectedComplaint && selectedComplaint.id === complaintId) {
        setSelectedComplaint(updatedTarget);
      }
      fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTarget)
      }).catch((err) => console.warn('Server update error for ML diagnosis update:', err));

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'complaint:update', data: { id: complaintId, updates: updatedTarget } }));
      }
    }
  };

  const assignComplaintToOfficer = (complaintId: string, officerId: string) => {
    const officer = SAMPLE_USERS.find((u) => u.id === officerId) || SAMPLE_USERS[1];
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    let assignedTarget: Complaint | undefined;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        assignedTarget = {
          ...c,
          status: 'Assigned',
          assignedOfficerId: officer.id,
          assignedOfficerName: officer.name,
          assignedOfficerContact: officer.mobile,
          timeline: [
            ...c.timeline,
            {
              status: 'Assigned',
              timestamp: formattedDate,
              title: `Assigned to ${officer.name}`,
              description: `Duty assigned by Admin. Contact: ${officer.mobile}`,
              updatedBy: currentUser?.name || 'Administrator'
            }
          ]
        };
        return assignedTarget;
      })
    );

    // Send assignment to backend server
    if (assignedTarget) {
      fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignedTarget)
      }).catch((err) => console.warn('Server update error for complaint assignment:', err));
    }

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: officer.id,
      title: 'New Task Assigned',
      message: `Complaint #${complaintId} has been allocated to you for field inspection.`,
      type: 'assigned_task',
      timestamp: 'Just now',
      read: false,
      relatedComplaintId: complaintId
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const addAnnouncement = (newAnn: Omit<Announcement, 'id' | 'publishedAt'>) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    const created: Announcement = {
      ...newAnn,
      id: `ann_${Date.now()}`,
      publishedAt: formattedDate
    };
    setAnnouncements((prev) => [created, ...prev]);

    // Push broadcast notification
    const broadcastNotif: NotificationItem = {
      id: `notif_broadcast_${Date.now()}`,
      userId: 'all',
      title: created.title,
      message: created.content,
      type: 'water_alert',
      timestamp: 'Just now',
      read: false
    };
    setNotifications((prev) => [broadcastNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const officerRatingSummary = useMemo<OfficerRatingSummary>(() => {
    const rated = complaints.filter(
      (c) => c.officerRating && typeof c.officerRating.stars === 'number' && c.officerRating.stars > 0
    );

    const breakdown: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    const reviews: OfficerReviewItem[] = rated.map((c) => {
      const stars = Math.min(5, Math.max(1, Math.round(c.officerRating!.stars))) as 1 | 2 | 3 | 4 | 5;
      breakdown[stars] = (breakdown[stars] || 0) + 1;
      sum += c.officerRating!.stars;
      return {
        complaintId: c.id,
        complaintTitle: c.title,
        userName: c.userName || 'Citizen',
        ward: c.ward || 'Zone 9',
        stars: c.officerRating!.stars,
        feedback: c.officerRating!.feedback || 'Problem inspected and cleared on site.',
        ratedAt: c.officerRating!.ratedAt || 'Recently'
      };
    });

    const averageRating = rated.length > 0 ? Number((sum / rated.length).toFixed(1)) : 5.0;
    const formattedRating = rated.length > 0 ? (sum / rated.length).toFixed(1) : '5.0';

    return {
      averageRating,
      formattedRating,
      totalRatings: rated.length,
      breakdown,
      reviews
    };
  }, [complaints]);

  const rateOfficer = (complaintId: string, stars: number, feedback?: string) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    let ratedTarget: Complaint | undefined;

    setComplaints((prev) => {
      const updated = prev.map((c) => {
        if (c.id === complaintId) {
          ratedTarget = {
            ...c,
            officerRating: {
              stars,
              feedback,
              ratedAt: today
            }
          };
          return ratedTarget;
        }
        return c;
      });
      localStorage.setItem('aquacare_v2_complaints', JSON.stringify(updated));
      return updated;
    });

    // Notify officer of newly submitted citizen rating
    const ratingNotif: NotificationItem = {
      id: `notif_rate_${Date.now()}`,
      userId: 'user_officer_1',
      title: `Citizen Rating Received: ${stars} Stars ⭐`,
      message: `${feedback ? `"${feedback}"` : 'New citizen feedback submitted'} for #${complaintId}`,
      timestamp: 'Just now',
      read: false,
      type: 'officer_update',
      priority: 'low'
    };
    setNotifications((prev) => [ratingNotif, ...prev]);

    if (ratedTarget) {
      fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officerRating: {
            stars,
            feedback,
            ratedAt: today
          }
        })
      }).catch((err) => console.warn('Server update error for officer rating:', err));
    }

    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint({
        ...selectedComplaint,
        officerRating: {
          stars,
          feedback,
          ratedAt: today
        }
      });
    }
  };

  const officersList = SAMPLE_USERS.filter((u) => u.role === 'officer');
  const currentRole = currentUser?.role || 'citizen';
  const isLoggedIn = !!currentUser;
  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentUser,
        setCurrentUser,
        currentRole,
        isLoggedIn,
        currentScreen,
        setCurrentScreen,
        activeTab,
        setActiveTab,
        complaints,
        locations,
        announcements,
        notifications,
        loginAsRole,
        registerCitizen,
        updateUserProfile,
        logout,
        addComplaint,
        updateComplaintStatus,
        updateComplaintMLDiagnosis,
        assignComplaintToOfficer,
        addAnnouncement,
        markNotificationRead,
        markAllNotificationsRead,
        viewMode,
        setViewMode,
        activeModal,
        setActiveModal,
        selectedComplaint,
        setSelectedComplaint,
        selectedMapPointId,
        setSelectedMapPointId,
        officersList,
        rateOfficer,
        officerRatingSummary,
        isReportingProblem,
        setIsReportingProblem,
        prefilledReportData,
        setPrefilledReportData,
        openReportWithDiagnosis,
        liveTelemetry,
        isWsConnected,
        activeUsersCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
