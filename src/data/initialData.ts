import { Complaint, User, WaterLocation, Announcement, NotificationItem, WaterQualityReport, ComplaintSensorData, MLBrokenPipePrediction } from '../types';

export const SAMPLE_USERS: User[] = [
  {
    id: 'user_citizen_1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    mobile: '9840123456',
    role: 'citizen',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    village: 'Arasinakunte',
    gramPanchayat: 'Arasinakunte Gram Panchayat',
    houseNo: 'No. 42/B',
    street: 'Old Temple Street',
    landmark: 'Near Gram Panchayat Office',
    panchayat: 'Arasinakunte Gram Panchayat',
    ward: 'Ward 03 - Arasinakunte',
    zone: 'Nelamangala Division',
    address: 'House/Door No. 42/B, Old Temple Street, Near Gram Panchayat Office, Village: Arasinakunte, Arasinakunte Gram Panchayat, District: Bengaluru Rural, Karnataka, PIN: 562123',
    pincode: '562123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'user_officer_1',
    name: 'Rajesh Kumar',
    email: 'rajesh.water@gov.in',
    mobile: '9876543210',
    role: 'officer',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    village: 'Nelamangala Sub-division',
    gramPanchayat: 'Nelamangala Taluk Water Division',
    houseNo: 'Govt Quarters B-4',
    street: 'Station Road',
    panchayat: 'Nelamangala Taluk Panchayat',
    ward: 'Nelamangala Rural Division',
    zone: 'Bengaluru Rural Zone',
    designation: 'Panchayat Water Engineering Officer',
    department: 'Rural Drinking Water & Sanitation Dept',
    address: 'Rural Water Supply Office, Station Road, Nelamangala, Bengaluru Rural, Karnataka - 562123',
    pincode: '562123',
    avatar: '/images/officer_avatar.jpg'
  },
  {
    id: 'user_admin_1',
    name: 'Dr. Meenakshi',
    email: 'admin.aquacare@gov.in',
    mobile: '9444011223',
    role: 'admin',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    village: 'Zilla Panchayat Campus',
    gramPanchayat: 'Zilla Panchayat Water Administration',
    houseNo: 'Room 204, Administrative Block',
    street: 'DC Office Complex',
    panchayat: 'Zilla Panchayat Water Administration',
    ward: 'Executive Directorate',
    zone: 'State Water Grid HQ',
    designation: 'Executive Engineer & Director',
    department: 'State Water Resources & Gram Panchayat Directorate',
    address: 'Executive Directorate, DC Complex, Bengaluru Rural, Karnataka - 562123',
    pincode: '562123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
  }
];

// Compute real-world relative dates based on current system date
const systemNow = new Date();
const getRelativeDate = (daysAgo: number): Date => new Date(systemNow.getTime() - daysAgo * 86400000);
const formatShortDate = (d: Date): string =>
  d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const TODAY_STR = formatShortDate(systemNow);
const YESTERDAY_STR = formatShortDate(getRelativeDate(1));
const TWO_DAYS_AGO_STR = formatShortDate(getRelativeDate(2));
const THREE_DAYS_AGO_STR = formatShortDate(getRelativeDate(3));

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'AQUA-2026-1042',
    userId: 'user_citizen_1',
    userName: 'Priya Sharma',
    userMobile: '9840123456',
    title: 'Water pipe is leaking on the road',
    category: 'Water Leakage',
    description: 'Clean drinking water is leaking from a broken pipe on the road. Water is wasting quickly. Please fix it soon.',
    location: 'Near Pillar 42, 4th Main Road, Mandaveli',
    panchayat: 'Mylapore Town Panchayat',
    ward: 'Ward 12 - Mylapore',
    coordinates: { lat: 13.0285, lng: 80.2612 },
    submittedAt: `${TODAY_STR}, 07:15 AM`,
    status: 'In Progress',
    urgency: 'Emergency',
    assignedOfficerId: 'user_officer_1',
    assignedOfficerName: 'Rajesh Kumar',
    sensorData: {
      sensorNode: 'Underground Pipeline Sensor Node #04 (Mandaveli)',
      // Tank sensors: pH, Turbidity, Conductivity
      tank: { ph: 7.20, turbidityNTU: 0.75, conductivity: 295 },
      // Underground pipeline sensors: flow, pressure
      pipeline: { flowRateLpm: 560, pressureBar: 1.35 },
      // Tap sensor: pressure
      tap: { pressureBar: 0.25 },
      pressureBar: 1.35,
      tapPressureBar: 0.25,
      flowRateLpm: 560,
      ph: 7.20,
      turbidityNTU: 0.75,
      conductivity: 295,
      tdsPPM: 190,
      temperatureC: 27.0,
      mlPrediction: {
        isBrokenPipePredicted: true,
        brokenPipeProbability: 95,
        pipelinePressureDropBar: 1.05,
        tapPressureDropBar: 1.05,
        leakSeverity: 'Major Fracture / Broken Pipe',
        diagnosisReason: 'Underground pipeline pressure dropped by 1.05 bar (nominal 2.40 -> 1.35 bar) with tap delivery starvation (0.25 bar) and surging flow (560 L/min). High probability of fractured underground pipe.'
      },
      simpleDiagnosis: 'ML model predicts 95% Broken Pipe Probability based on 1.05 bar pipeline pressure drop & 0.25 bar tap pressure starvation.',
      alertMessage: 'Sensors report: Underground pipe fracture detected from pressure variation (Pipeline: 1.35 bar, Tap: 0.25 bar).',
      severity: 'Critical',
      recordedAt: `${TODAY_STR}, 07:10 AM`
    },
    officerNotes: [
      'Checked the spot. Closed main valve to stop water waste.',
      'Workers arrived with new pipe parts. Fixing the leak now.'
    ],
    timeline: [
      {
        status: 'Submitted',
        timestamp: `${TODAY_STR}, 07:15 AM`,
        title: 'Problem Sent',
        description: 'Problem reported by Priya Sharma.',
        updatedBy: 'Citizen'
      },
      {
        status: 'Assigned',
        timestamp: `${TODAY_STR}, 08:00 AM`,
        title: 'Officer Assigned',
        description: 'Assigned to Water Officer Rajesh Kumar.',
        updatedBy: 'Manager'
      },
      {
        status: 'In Progress',
        timestamp: `${TODAY_STR}, 09:30 AM`,
        title: 'Fixing on Site',
        description: 'Workers are fixing the broken pipe on the road.',
        updatedBy: 'Rajesh Kumar'
      }
    ]
  },
  {
    id: 'AQUA-2026-1038',
    userId: 'user_citizen_1',
    userName: 'Priya Sharma',
    userMobile: '9840123456',
    title: 'Tap water is brown and dirty',
    category: 'Dirty Water',
    description: 'Tap water is muddy and brown today. It smells bad and cannot be used for drinking or cooking.',
    location: '14 Kutchery Road, Mylapore',
    panchayat: 'Mylapore Town Panchayat',
    ward: 'Ward 12 - Mylapore',
    coordinates: { lat: 13.0335, lng: 80.2675 },
    submittedAt: `${YESTERDAY_STR}, 08:30 AM`,
    status: 'Assigned',
    urgency: 'High',
    assignedOfficerId: 'user_officer_1',
    assignedOfficerName: 'Rajesh Kumar',
    assignedOfficerContact: '+91 98765 43210',
    sensorData: {
      sensorNode: 'Storage Tank & Purity Sensor #12 (Mylapore Reservoir)',
      // Tank sensors: pH, Turbidity, Conductivity
      tank: { ph: 6.45, turbidityNTU: 4.80, conductivity: 780 },
      // Underground pipeline sensors: flow, pressure
      pipeline: { flowRateLpm: 395, pressureBar: 2.15 },
      // Tap sensor: pressure
      tap: { pressureBar: 1.20 },
      pressureBar: 2.15,
      tapPressureBar: 1.20,
      flowRateLpm: 395,
      ph: 6.45,
      turbidityNTU: 4.80,
      conductivity: 780,
      tdsPPM: 500,
      temperatureC: 26.5,
      mlPrediction: {
        isBrokenPipePredicted: false,
        brokenPipeProbability: 12,
        pipelinePressureDropBar: 0.25,
        tapPressureDropBar: 0.10,
        leakSeverity: 'Normal',
        diagnosisReason: 'Storage Tank contamination detected: High turbidity (4.80 NTU) and conductivity (780 µS/cm). Underground pipeline pressure variation is minimal (0.25 bar).'
      },
      simpleDiagnosis: 'Elevated Tank turbidity (4.80 NTU) and conductivity (780 µS/cm). Silt sediment detected in storage reservoir.',
      alertMessage: 'Sensors report: Storage tank turbidity spike (4.80 NTU) and conductivity deviation (780 µS/cm).',
      severity: 'Warning',
      recordedAt: `${YESTERDAY_STR}, 08:25 AM`
    },
    officerNotes: [
      'Visiting today to collect a water sample for testing.'
    ],
    timeline: [
      {
        status: 'Submitted',
        timestamp: `${YESTERDAY_STR}, 08:30 AM`,
        title: 'Problem Sent',
        description: 'Dirty water reported.',
        updatedBy: 'Citizen'
      },
      {
        status: 'Assigned',
        timestamp: `${YESTERDAY_STR}, 11:15 AM`,
        title: 'Officer Assigned',
        description: 'Given to Officer Rajesh Kumar to test the line.',
        updatedBy: 'Manager'
      }
    ]
  },
  {
    id: 'AQUA-2026-1015',
    userId: 'user_citizen_1',
    userName: 'Priya Sharma',
    userMobile: '9840123456',
    title: 'No water in house taps',
    category: 'No Water',
    description: 'No water came from taps for 2 days. House storage tanks are completely empty.',
    location: 'East Mada Street, Mylapore',
    panchayat: 'Mylapore Town Panchayat',
    ward: 'Ward 12 - Mylapore',
    coordinates: { lat: 13.034, lng: 80.271 },
    submittedAt: `${THREE_DAYS_AGO_STR}, 09:00 AM`,
    status: 'Resolved',
    urgency: 'Low',
    assignedOfficerId: 'user_officer_1',
    assignedOfficerName: 'Rajesh Kumar',
    photoUrl: '/images/crystal_pure_water_1791899804764.jpg',
    officerRating: {
      stars: 5,
      feedback: 'Officer checked the water motor, fixed wiring quickly, and water is back.',
      ratedAt: TWO_DAYS_AGO_STR
    },
    sensorData: {
      sensorNode: 'Distribution Network Monitoring Hub (East Mada St)',
      // Tank sensors: pH, Turbidity, Conductivity
      tank: { ph: 7.30, turbidityNTU: 0.40, conductivity: 290 },
      // Underground pipeline sensors: flow, pressure
      pipeline: { flowRateLpm: 420, pressureBar: 2.40 },
      // Tap sensor: pressure
      tap: { pressureBar: 1.35 },
      pressureBar: 2.40,
      tapPressureBar: 1.35,
      flowRateLpm: 420,
      ph: 7.30,
      turbidityNTU: 0.40,
      conductivity: 290,
      tdsPPM: 185,
      temperatureC: 26.8,
      mlPrediction: {
        isBrokenPipePredicted: false,
        brokenPipeProbability: 2,
        pipelinePressureDropBar: 0.0,
        tapPressureDropBar: 0.0,
        leakSeverity: 'Normal',
        diagnosisReason: 'Nominal operational gradient: Pipeline at 2.40 bar, consumer tap at 1.35 bar, and pristine Tank purity (0.40 NTU).'
      },
      simpleDiagnosis: 'Water motor repaired. Optimal parameters across Tank, Pipeline, and Tap.',
      alertMessage: 'Sensors report optimal parameters (Tank: 0.40 NTU, Pipeline: 2.40 bar, Tap: 1.35 bar).',
      severity: 'Normal',
      recordedAt: `${TWO_DAYS_AGO_STR}, 08:45 AM`
    },
    officerNotes: [
      'Water motor switch was damaged.',
      'New switch fitted. Normal water supply restored.'
    ],
    timeline: [
      {
        status: 'Submitted',
        timestamp: `${THREE_DAYS_AGO_STR}, 09:00 AM`,
        title: 'Problem Sent',
        description: 'No water supply reported.',
        updatedBy: 'Citizen'
      },
      {
        status: 'Assigned',
        timestamp: `${THREE_DAYS_AGO_STR}, 10:00 AM`,
        title: 'Officer Assigned',
        description: 'Electrician team sent by Rajesh Kumar.',
        updatedBy: 'Manager'
      },
      {
        status: 'In Progress',
        timestamp: `${THREE_DAYS_AGO_STR}, 02:00 PM`,
        title: 'Fixing on Site',
        description: 'Repairing the water motor pump.',
        updatedBy: 'Rajesh Kumar'
      },
      {
        status: 'Resolved',
        timestamp: `${TWO_DAYS_AGO_STR}, 08:30 AM`,
        title: 'Problem Fixed',
        description: 'Water is flowing properly now. Problem resolved.',
        updatedBy: 'Rajesh Kumar'
      }
    ]
  }
];

export const INITIAL_LOCATIONS: WaterLocation[] = [
  {
    id: 'loc_1',
    name: 'Mylapore Big Water Tank',
    type: 'water_tank',
    address: 'Luz Church Road, Mylapore',
    ward: 'Ward 12',
    lat: 13.0368,
    lng: 80.2635,
    status: 'Operational',
    capacity: 'Big Tank (88% Full)',
    supplyTiming: 'Morning: 5:30 AM - 8:30 AM | Evening: 5:00 PM - 7:30 PM',
    testedTDS: 185,
    testedPH: 7.2,
    contactNumber: '044-24991234'
  },
  {
    id: 'loc_2',
    name: 'Kilpauk Main Water Pump Station',
    type: 'supply_point',
    address: 'EVR Periyar Road, Kilpauk',
    ward: 'Zone 5',
    lat: 13.0789,
    lng: 80.2412,
    status: 'Operational',
    capacity: 'Main City Pumping Center',
    supplyTiming: 'Working 24 Hours',
    testedTDS: 145,
    testedPH: 7.4,
    contactNumber: '044-26442000'
  },
  {
    id: 'loc_3',
    name: 'T. Nagar Water Truck Center',
    type: 'distribution_point',
    address: 'Venkatanarayana Road, T. Nagar',
    ward: 'Ward 15',
    lat: 13.0392,
    lng: 80.2341,
    status: 'Tanker Dispatched',
    capacity: '12 Water Trucks Ready',
    supplyTiming: '6:00 AM - 10:00 PM on call',
    testedTDS: 195,
    testedPH: 7.1,
    contactNumber: '044-24345678'
  },
  {
    id: 'loc_4',
    name: 'Mandaveli Leaking Pipe Spot',
    type: 'leakage',
    address: 'Near Pillar 42, 4th Main Road, Mandaveli',
    ward: 'Ward 12',
    lat: 13.0285,
    lng: 80.2612,
    status: 'Active Leak',
    capacity: 'Being fixed now (ID: AQUA-2026-1042)',
    supplyTiming: 'Will be fixed by 2:00 PM today',
    contactNumber: '044-24935566'
  },
  {
    id: 'loc_5',
    name: 'Adyar Free Drinking Water Tap (RO)',
    type: 'distribution_point',
    address: 'Gandhi Nagar, Adyar',
    ward: 'Ward 18',
    lat: 13.0078,
    lng: 80.2567,
    status: 'Operational',
    capacity: 'Clean Drinking Water Tap',
    supplyTiming: 'Open 24 Hours (Free for all)',
    testedTDS: 85,
    testedPH: 7.0,
    contactNumber: '1800-425-AQUA'
  },
  {
    id: 'loc_6',
    name: 'Royapettah Water Tower',
    type: 'water_tank',
    address: 'Whites Road, Royapettah',
    ward: 'Ward 11',
    lat: 13.0562,
    lng: 80.2604,
    status: 'Under Maintenance',
    capacity: 'Water Storage Tower',
    supplyTiming: 'Repair work in progress',
    testedTDS: 190,
    testedPH: 7.3,
    contactNumber: '044-28521199'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Drinking Water is Clean and Safe in All Areas',
    content: 'Tap water in all areas is tested clean and safe to drink. Morning and evening water supply is running on time as usual.',
    category: 'Quality Advisory',
    publishedAt: TODAY_STR,
    validUntil: formatShortDate(new Date(systemNow.getTime() + 14 * 86400000)),
    affectedWards: ['All Wards (1-200)'],
    severity: 'Info',
    author: 'City Water Board'
  },
  {
    id: 'ann_2',
    title: 'Pipe Repair Work Tonight on Luz Church Road',
    content: 'New water pipes are being joined tonight between 10:00 PM and 4:00 AM. In the morning, water speed may be slightly slow on upper floors.',
    category: 'Maintenance',
    publishedAt: YESTERDAY_STR,
    validUntil: formatShortDate(new Date(systemNow.getTime() + 3 * 86400000)),
    affectedWards: ['Ward 12', 'Ward 13'],
    severity: 'Warning',
    author: 'Area 9 Water Office'
  },
  {
    id: 'ann_3',
    title: 'Free Drinking Water Testing this Saturday',
    content: 'You can bring a small bottle of tap water from your home to your local ward office this Saturday between 9 AM and 1 PM for free cleanliness testing.',
    category: 'Quality Advisory',
    publishedAt: TWO_DAYS_AGO_STR,
    validUntil: formatShortDate(new Date(systemNow.getTime() + 6 * 86400000)),
    affectedWards: ['Zone 9', 'Zone 10'],
    severity: 'Info',
    author: 'Water Health Team'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_emergency_damaged_pipe',
    userId: 'all',
    title: '🚨 Emergency Alert: Major Pipeline Damage & Burst',
    message: 'CRITICAL DAMAGE: Severe underground pipeline burst on Sector 4 Main Road with extreme pressure drop (0.38 bar). Repair crew and field officer dispatched on emergency protocol.',
    type: 'water_alert',
    timestamp: 'Just now',
    read: false,
    relatedComplaintId: 'AQUA-2026-1042',
    priority: 'high'
  }
];

export const WATER_QUALITY_DATA: WaterQualityReport = {
  stationName: 'IoT Water Sensor Hub & Testing Lab, Zone 9',
  ward: 'Ward 12 - Mylapore (Sensor Node #04)',
  testedAt: `Live Telemetry • ${TODAY_STR} (Updated just now)`,
  // Tank sensors
  ph: 7.24,
  turbidityNTU: 0.85,
  conductivity: 310,
  tdsPPM: 182,
  // Underground pipeline sensors
  pressureBar: 2.38,
  flowRateLpm: 420,
  // Consumer tap sensor
  tapPressureBar: 1.30,
  temperatureC: 24.6,
  sensorStatus: 'All Tank, Pipeline & Tap Sensors Online & Calibrated',
  overallRating: 'Excellent',
  labOfficer: 'Dr. S. Gayathri (Water Health Officer)'
};

export const MUNICIPAL_WARDS = [
  'Ward 11 - Royapettah',
  'Ward 12 - Mylapore',
  'Ward 13 - Mandaveli',
  'Ward 14 - Alwarpet',
  'Ward 15 - T. Nagar',
  'Ward 16 - Nungambakkam',
  'Ward 17 - Saidapet',
  'Ward 18 - Adyar',
  'Ward 19 - Guindy',
  'Ward 20 - Thiruvanmiyur'
];

export const PROBLEM_CATEGORIES = [
  'Water Leakage',
  'No Water',
  'Dirty Water',
  'Slow Water Flow',
  'Broken Pipe',
  'Broken Tap',
  'Bad Smell or Taste',
  'Other Problem'
] as const;

export const SAMPLE_PROBLEM_IMAGES = [
  {
    name: 'Broken / Leaking Pipe',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Dirty Tap Water',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Broken Street Tap',
    url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'No Water / Dry Tap',
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800'
  }
];

export function computeMLBrokenPipePrediction(
  pipelinePressureBar: number,
  pipelineFlowRateLpm: number,
  tapPressureBar: number,
  tankSensorsInput?: number | { ph?: number; turbidityNTU?: number; conductivity?: number }
): MLBrokenPipePrediction {
  const nominalPipeline = 2.40;
  const nominalTap = 1.30;
  const pipelineDrop = Number(Math.max(0, nominalPipeline - pipelinePressureBar).toFixed(2));
  const tapDrop = Number(Math.max(0, nominalTap - tapPressureBar).toFixed(2));

  const tankPh = typeof tankSensorsInput === 'object' ? tankSensorsInput?.ph ?? 7.20 : 7.20;
  const tankTurbidity = typeof tankSensorsInput === 'object' ? tankSensorsInput?.turbidityNTU ?? 0.75 : (typeof tankSensorsInput === 'number' ? tankSensorsInput : 0.75);
  const tankConductivity = typeof tankSensorsInput === 'object' ? tankSensorsInput?.conductivity ?? 300 : 300;

  let probability = 0;
  let severity: MLBrokenPipePrediction['leakSeverity'] = 'Normal';
  let isBroken = false;
  let reason = 'Optimal pipeline integrity. Pressure variations within acceptable tolerance (±0.15 bar).';

  // Major pipe rupture / burst: severe drop in pipeline pressure & tap starvation
  if (pipelinePressureBar < 0.9 || (pipelineDrop >= 0.85 && tapDrop >= 0.7)) {
    probability = 96;
    isBroken = true;
    severity = 'Critical Burst';
    reason = `Critical underground pipe burst detected: Severe pipeline pressure drop (-${pipelineDrop.toFixed(2)} bar to ${pipelinePressureBar.toFixed(2)} bar) and severe consumer tap starvation (-${tapDrop.toFixed(2)} bar to ${tapPressureBar.toFixed(2)} bar). Flow velocity (${pipelineFlowRateLpm} L/min) confirms high volumetric loss. Tank water intact (pH ${tankPh}, Turbidity ${tankTurbidity} NTU, Conductivity ${tankConductivity} µS/cm).`;
  } else if (pipelineDrop >= 0.50 || (pipelineDrop >= 0.35 && tapDrop >= 0.40)) {
    probability = 88;
    isBroken = true;
    severity = 'Major Fracture / Broken Pipe';
    reason = `Major underground pipe fracture predicted from pressure variation: Pipeline pressure dropped by -${pipelineDrop.toFixed(2)} bar (to ${pipelinePressureBar.toFixed(2)} bar) accompanied by consumer tap pressure drop of -${tapDrop.toFixed(2)} bar (to ${tapPressureBar.toFixed(2)} bar). Flow rate at ${pipelineFlowRateLpm} L/min indicates active escaping water. Storage tank parameters (pH: ${tankPh}, Turbidity: ${tankTurbidity} NTU, Conductivity: ${tankConductivity} µS/cm) confirm source is intact.`;
  } else if (pipelineDrop >= 0.25 || tapDrop >= 0.30) {
    probability = 64;
    isBroken = true;
    severity = 'Minor Leak';
    reason = `Sub-surface pipe leakage detected: Pipeline pressure variation (-${pipelineDrop.toFixed(2)} bar) with gradual delivery tap pressure loss (-${tapDrop.toFixed(2)} bar). Early-stage pipe fracture predicted by ML pressure variation model. Tank readings: pH ${tankPh}, Turbidity ${tankTurbidity} NTU, Conductivity ${tankConductivity} µS/cm.`;
  } else if (tankTurbidity > 3.0 || tankConductivity > 650) {
    probability = 8;
    isBroken = false;
    severity = 'Normal';
    reason = `Storage Tank water quality anomaly detected: Elevated Turbidity (${tankTurbidity} NTU) and Conductivity (${tankConductivity} µS/cm). Underground pipeline and tap pressure variations remain within normal limits (ΔP: -${pipelineDrop.toFixed(2)} bar), indicating contamination rather than broken pipe.`;
  } else {
    probability = 3;
    isBroken = false;
    severity = 'Normal';
    reason = `Nominal operating pressure gradient: Underground pipeline at ${pipelinePressureBar.toFixed(2)} bar (ΔP: -${pipelineDrop.toFixed(2)} bar), consumer tap delivery at ${tapPressureBar.toFixed(2)} bar (ΔP: -${tapDrop.toFixed(2)} bar). Tank parameters (pH ${tankPh}, Turbidity ${tankTurbidity} NTU, Conductivity ${tankConductivity} µS/cm) normal. No pipe fracture detected.`;
  }

  return {
    isBrokenPipePredicted: isBroken,
    brokenPipeProbability: probability,
    pipelinePressureDropBar: pipelineDrop,
    tapPressureDropBar: tapDrop,
    leakSeverity: severity,
    diagnosisReason: reason
  };
}

export function getComplaintSensorData(c: Complaint): ComplaintSensorData {
  if (c.sensorData && c.sensorData.tank && c.sensorData.pipeline && c.sensorData.tap) {
    return c.sensorData;
  }

  if (c.status === 'Resolved') {
    const pipeline = { flowRateLpm: 420, pressureBar: 2.40 };
    const tap = { pressureBar: 1.35 };
    const tank = { ph: 7.25, turbidityNTU: 0.40, conductivity: 290 };
    const mlPrediction = computeMLBrokenPipePrediction(pipeline.pressureBar, pipeline.flowRateLpm, tap.pressureBar, tank);

    return {
      sensorNode: 'Distribution Network Monitoring Hub (East Mada St)',
      tank,
      pipeline,
      tap,
      pressureBar: pipeline.pressureBar,
      tapPressureBar: tap.pressureBar,
      flowRateLpm: pipeline.flowRateLpm,
      ph: tank.ph,
      turbidityNTU: tank.turbidityNTU,
      conductivity: tank.conductivity,
      tdsPPM: 185,
      temperatureC: 26.8,
      mlPrediction,
      simpleDiagnosis: 'Optimal water purity and steady pressure verified. Normal operating parameters across Tank, Pipeline, and Tap.',
      alertMessage: 'Sensors report optimal parameters (Tank: 0.40 NTU, Pipeline: 2.40 bar, Tap: 1.35 bar).',
      severity: 'Normal'
    };
  }

  // Active complaints: broken pipe / leakage
  if (
    c.category === 'Water Leakage' ||
    c.category === 'Broken Pipe' ||
    c.category === 'Damaged Pipeline' ||
    c.title.toLowerCase().includes('leak') ||
    c.title.toLowerCase().includes('pipe')
  ) {
    const pipeline = { flowRateLpm: 560, pressureBar: 1.35 };
    const tap = { pressureBar: 0.25 };
    const tank = { ph: 7.20, turbidityNTU: 0.75, conductivity: 295 };
    const mlPrediction = computeMLBrokenPipePrediction(pipeline.pressureBar, pipeline.flowRateLpm, tap.pressureBar, tank);

    return {
      sensorNode: 'Underground Pipeline Sensor Node #04 (Mandaveli)',
      tank,
      pipeline,
      tap,
      pressureBar: pipeline.pressureBar,
      tapPressureBar: tap.pressureBar,
      flowRateLpm: pipeline.flowRateLpm,
      ph: tank.ph,
      turbidityNTU: tank.turbidityNTU,
      conductivity: tank.conductivity,
      tdsPPM: 190,
      temperatureC: 27.0,
      mlPrediction,
      simpleDiagnosis: `ML Model predicts ${mlPrediction.brokenPipeProbability}% Broken Pipe Probability based on ${mlPrediction.pipelinePressureDropBar.toFixed(2)} bar pipeline pressure variation & ${tap.pressureBar.toFixed(2)} bar tap delivery starvation.`,
      alertMessage: `Sensors report: Underground pipe fracture detected from pressure variation (Pipeline: ${pipeline.pressureBar} bar, Tap: ${tap.pressureBar} bar).`,
      severity: 'Critical'
    };
  }

  // Active complaints: dirty water / contamination
  if (
    c.category === 'Dirty Water' ||
    c.category === 'Water Contamination Concern' ||
    c.category === 'Bad Smell or Taste' ||
    c.title.toLowerCase().includes('dirty') ||
    c.title.toLowerCase().includes('brown')
  ) {
    const pipeline = { flowRateLpm: 395, pressureBar: 2.15 };
    const tap = { pressureBar: 1.20 };
    const tank = { ph: 6.45, turbidityNTU: 4.80, conductivity: 780 };
    const mlPrediction = computeMLBrokenPipePrediction(pipeline.pressureBar, pipeline.flowRateLpm, tap.pressureBar, tank);

    return {
      sensorNode: 'Storage Tank & Purity Sensor #12 (Mylapore Reservoir)',
      tank,
      pipeline,
      tap,
      pressureBar: pipeline.pressureBar,
      tapPressureBar: tap.pressureBar,
      flowRateLpm: pipeline.flowRateLpm,
      ph: tank.ph,
      turbidityNTU: tank.turbidityNTU,
      conductivity: tank.conductivity,
      tdsPPM: 500,
      temperatureC: 26.5,
      mlPrediction,
      simpleDiagnosis: `Elevated Tank turbidity (${tank.turbidityNTU.toFixed(2)} NTU) and conductivity (${tank.conductivity} µS/cm) detected. Water quality contamination in reservoir.`,
      alertMessage: `Sensors report: Storage tank turbidity spike (${tank.turbidityNTU.toFixed(2)} NTU) and conductivity deviation (${tank.conductivity} µS/cm).`,
      severity: 'Warning'
    };
  }

  // General active complaint fallback (subnormal pressure/flow)
  const pipeline = { flowRateLpm: 310, pressureBar: 1.65 };
  const tap = { pressureBar: 0.70 };
  const tank = { ph: 7.15, turbidityNTU: 1.20, conductivity: 340 };
  const mlPrediction = computeMLBrokenPipePrediction(pipeline.pressureBar, pipeline.flowRateLpm, tap.pressureBar, tank);

  return {
    sensorNode: 'Underground Pipeline Sensor Node #04 (Sector 12)',
    tank,
    pipeline,
    tap,
    pressureBar: pipeline.pressureBar,
    tapPressureBar: tap.pressureBar,
    flowRateLpm: pipeline.flowRateLpm,
    ph: tank.ph,
    turbidityNTU: tank.turbidityNTU,
    conductivity: tank.conductivity,
    tdsPPM: 215,
    temperatureC: 26.8,
    mlPrediction,
    simpleDiagnosis: `Pipeline pressure drop (${pipeline.pressureBar.toFixed(2)} bar) detected. Moderate risk of distribution pressure loss.`,
    alertMessage: `Sensors report pipeline pressure drop (${pipeline.pressureBar.toFixed(2)} bar) and tap delivery at ${tap.pressureBar.toFixed(2)} bar.`,
    severity: 'Warning'
  };
}

export type MLConditionLevel = 'Very Danger' | 'Moderate' | 'Low';

export function getMLConditionLevel(
  sensorData?: ComplaintSensorData | null,
  urgency?: string,
  status?: string
): MLConditionLevel {
  // If resolved, always Low condition
  if (status === 'Resolved') {
    return 'Low';
  }

  if (!sensorData) {
    if (urgency === 'Emergency') return 'Very Danger';
    return 'Moderate';
  }

  // 1. High Risk / Very Danger condition - for severe emergencies, extreme pressure loss, or critical hazards
  if (
    urgency === 'Emergency' ||
    sensorData.severity === 'Critical' ||
    (sensorData.pressureBar !== undefined && sensorData.pressureBar < 0.8) ||
    (sensorData.turbidityNTU !== undefined && sensorData.turbidityNTU >= 6.5) ||
    (sensorData.ph !== undefined && (sensorData.ph < 5.8 || sensorData.ph > 9.2))
  ) {
    return 'Very Danger';
  }

  // 2. Moderate Risk condition - for active complaints, warning levels, subnormal pressure, turbidity, or standard active problems
  // As requested: in active complaints for ML diagnosis, show Moderate Risk, not Low only!
  return 'Moderate';
}

export function getMLConditionStyles(level: MLConditionLevel) {
  switch (level) {
    case 'Very Danger':
      return {
        level: 'Very Danger' as const,
        label: 'High Risk',
        borderClass: 'border-2 border-rose-500',
        modalCardBorder: 'border-2 border-rose-500 shadow-xl shadow-rose-950/40',
        resultBoxBorder: 'border-2 border-rose-500 bg-rose-50/90 text-slate-900 shadow-sm shadow-rose-500/10',
        innerBoxBorder: 'border border-rose-200 bg-white/95',
        modalVerdictBox: 'border-2 border-rose-500 bg-rose-950/50',
        badgeClass: 'bg-rose-950/80 text-rose-200 border-2 border-rose-500 shadow-sm font-black',
        pillBadgeClass: 'bg-rose-50 text-rose-800 border-2 border-rose-500 font-black',
        selectorCardBorder: 'border-2 border-rose-400 bg-rose-50/60',
        dotClass: 'bg-rose-500',
        dotPingClass: 'bg-rose-400',
        textClass: 'text-rose-700 font-extrabold',
        tagText: 'High Risk'
      };
    case 'Moderate':
      return {
        level: 'Moderate' as const,
        label: 'Moderate Risk',
        borderClass: 'border-2 border-amber-500',
        modalCardBorder: 'border-2 border-amber-500 shadow-xl shadow-amber-950/40',
        resultBoxBorder: 'border-2 border-amber-500 bg-amber-50/90 text-slate-900 shadow-sm shadow-amber-500/10',
        innerBoxBorder: 'border border-amber-200 bg-white/95',
        modalVerdictBox: 'border-2 border-amber-500 bg-amber-950/50',
        badgeClass: 'bg-amber-950/80 text-amber-200 border-2 border-amber-500 shadow-sm font-black',
        pillBadgeClass: 'bg-amber-50 text-amber-900 border-2 border-amber-500 font-black',
        selectorCardBorder: 'border-2 border-amber-400 bg-amber-50/60',
        dotClass: 'bg-amber-500',
        dotPingClass: 'bg-amber-400',
        textClass: 'text-amber-700 font-extrabold',
        tagText: 'Moderate Risk'
      };
    case 'Low':
    default:
      return {
        level: 'Low' as const,
        label: 'Low Risk',
        borderClass: 'border-2 border-emerald-500',
        modalCardBorder: 'border-2 border-emerald-500 shadow-xl shadow-emerald-950/40',
        resultBoxBorder: 'border-2 border-emerald-500 bg-emerald-50/90 text-slate-900 shadow-sm shadow-emerald-500/10',
        innerBoxBorder: 'border border-emerald-200 bg-white/95',
        modalVerdictBox: 'border-2 border-emerald-500 bg-emerald-950/50',
        badgeClass: 'bg-emerald-950/80 text-emerald-200 border-2 border-emerald-500 shadow-sm font-black',
        pillBadgeClass: 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 font-black',
        selectorCardBorder: 'border-2 border-emerald-400 bg-emerald-50/60',
        dotClass: 'bg-emerald-500',
        dotPingClass: 'bg-emerald-400',
        textClass: 'text-emerald-700 font-extrabold',
        tagText: 'Low Risk'
      };
  }
}

