export type Language = 'en' | 'ta' | 'hi';

export type UserRole = 'citizen' | 'officer' | 'admin';

export type ComplaintStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';

export type ProblemCategory =
  | 'Water Leakage'
  | 'No Water'
  | 'Dirty Water'
  | 'Slow Water Flow'
  | 'Broken Pipe'
  | 'Broken Tap'
  | 'Bad Smell or Taste'
  | 'Other Problem'
  | 'No Water Supply'
  | 'Low Water Pressure'
  | 'Dirty / Discoloured Water'
  | 'Damaged Pipeline'
  | 'Damaged Water Tap'
  | 'Water Contamination Concern'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  state?: string;
  district?: string;
  village?: string;
  gramPanchayat?: string;
  houseNo?: string;
  street?: string;
  landmark?: string;
  panchayat?: string;
  ward: string;
  zone: string;
  address: string;
  pincode: string;
  avatar?: string;
  designation?: string;
  department?: string;
}

export interface TimelineEvent {
  status: ComplaintStatus;
  timestamp: string;
  title: string;
  description: string;
  updatedBy: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  title: string;
  category: ProblemCategory;
  description: string;
  location: string;
  state?: string;
  district?: string;
  village?: string;
  gramPanchayat?: string;
  houseNo?: string;
  panchayat?: string;
  ward: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  submittedAt: string;
  status: ComplaintStatus;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  photoUrl?: string;
  resolutionPhotoUrl?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedOfficerContact?: string;
  rejectionReason?: string;
  officerNotes?: string[];
  timeline: TimelineEvent[];
  sensorData?: ComplaintSensorData;
  officerRating?: {
    stars: number;
    feedback?: string;
    ratedAt: string;
  };
}

export interface TankSensors {
  ph: number;
  turbidityNTU: number;
  conductivity: number; // in µS/cm (normal: 250 - 500 µS/cm)
}

export interface PipelineSensors {
  flowRateLpm: number; // L/min (normal: 380 - 450 L/min)
  pressureBar: number; // bar (normal nominal: 2.20 - 2.60 bar)
}

export interface TapSensors {
  pressureBar: number; // bar at consumer tap (normal nominal: 1.10 - 1.50 bar)
}

export interface MLBrokenPipePrediction {
  isBrokenPipePredicted: boolean;
  brokenPipeProbability: number; // 0 to 100%
  pipelinePressureDropBar: number; // Drop relative to nominal 2.40 bar
  tapPressureDropBar: number; // Drop relative to nominal 1.30 bar
  leakSeverity: 'Normal' | 'Minor Leak' | 'Major Fracture / Broken Pipe' | 'Critical Burst';
  diagnosisReason: string;
}

export interface ComplaintSensorData {
  sensorNode: string;
  // Three dedicated project sensor tiers:
  tank?: TankSensors;
  pipeline?: PipelineSensors;
  tap?: TapSensors;
  mlPrediction?: MLBrokenPipePrediction;

  // Backward-compatible flat properties:
  pressureBar?: number;
  tapPressureBar?: number;
  flowRateLpm?: number;
  ph?: number;
  turbidityNTU?: number;
  conductivity?: number; // µS/cm
  tdsPPM?: number;
  temperatureC?: number;

  alertMessage: string;
  simpleDiagnosis?: string;
  severity: 'Warning' | 'Critical' | 'Abnormal' | 'Normal';
  recordedAt?: string;
}

export interface WaterLocation {
  id: string;
  name: string;
  type: 'supply_point' | 'water_tank' | 'distribution_point' | 'leakage' | 'pipeline';
  address: string;
  ward: string;
  lat: number;
  lng: number;
  status: 'Operational' | 'Under Maintenance' | 'Low Pressure' | 'Active Leak' | 'Tanker Dispatched';
  capacity?: string;
  supplyTiming?: string;
  testedTDS?: number;
  testedPH?: number;
  contactNumber?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Interruption' | 'Maintenance' | 'Quality Advisory' | 'New Pipeline';
  publishedAt: string;
  validUntil: string;
  affectedWards: string[];
  severity: 'Info' | 'Warning' | 'Critical';
  author: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'complaint_update' | 'water_alert' | 'general' | 'assigned_task' | 'officer_update';
  timestamp: string;
  read: boolean;
  relatedComplaintId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface WaterQualityReport {
  stationName: string;
  ward: string;
  testedAt: string;
  // Tank sensors
  ph: number;
  turbidityNTU: number;
  conductivity: number; // in µS/cm
  tdsPPM: number;
  // Pipeline & tap sensors
  pressureBar?: number;
  tapPressureBar?: number;
  flowRateLpm?: number;
  temperatureC?: number;
  overallRating: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  labOfficer: string;
  sensorStatus?: string;
}

export interface LiveTelemetry {
  // Tank sensors
  tankPh: number;
  tankTurbidityNTU: number;
  tankConductivity: number; // in µS/cm
  tankLevelPercent: number;

  // Underground pipeline sensors
  pipelineFlowRateLpm: number;
  pipelinePressureBar: number;

  // Consumer tap sensor
  tapPressureBar: number;

  // ML Broken Pipe status derived from pressure variation
  mlBrokenPipeStatus?: {
    predicted: boolean;
    pipelinePressureVariationBar: number;
    tapPressureVariationBar: number;
    probability: number;
    message: string;
  };

  // Backward-compatible properties
  pressureBar: number;
  ph: number;
  tdsPPM: number;
  flowRateLpm: number;

  status: 'optimal' | 'warning' | 'normal';
  lastUpdated: string;
}

export interface MLPPTSlide {
  title: string;
  category?: string;
  bullets: string[];
  keyFormulaOrMetric?: string;
  notes?: string;
}

export interface MLModelSummary {
  modelType: string;
  algorithm: string;
  version: string;
  trainedAt: string;
  totalTrainingSamples: number;
  totalValidationSamples: number;
  features: string[];
  classes: string[];
  hyperparameters: {
    nEstimators: number;
    learningRate: number;
    maxDepth: number;
    minChildWeight: number;
    regLambda: number;
    subsample: number;
    colsampleByTree: number;
  };
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    logLoss: number;
    confusionMatrix: number[][];
    classMetrics: {
      className: string;
      precision: number;
      recall: number;
      f1Score: number;
      support: number;
    }[];
  };
  featureImportances: {
    feature: string;
    importance: number;
    percentage: number;
    description: string;
  }[];
  pptSlideSummary: MLPPTSlide[];
}
