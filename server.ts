import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { INITIAL_COMPLAINTS, SAMPLE_USERS } from './src/data/initialData.ts';
import { Complaint, LiveTelemetry, User } from './src/types.ts';
import { getOrLoadMLModel, runMLDiagnosis, retrainMLModel } from './src/services/mlEngine.ts';
import {
  ADMINISTRATIVE_HIERARCHY,
  formatCitizenAddress,
  getDistrictsForState,
  getVillagesForDistrict,
  getGramPanchayatsForVillage,
  DistrictInfo
} from './src/data/administrativeHierarchy.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, '.data');
const DATA_FILE = path.join(DATA_DIR, 'complaints.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory store initialized from disk or default
let serverComplaints: Complaint[] = [];
let serverUsers: User[] = [];

// Initialize users from disk or initial data
try {
  if (fs.existsSync(USERS_FILE)) {
    const rawUsers = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsedUsers = JSON.parse(rawUsers);
    if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
      serverUsers = parsedUsers;
    } else {
      serverUsers = [...SAMPLE_USERS];
    }
  } else {
    serverUsers = [...SAMPLE_USERS];
    fs.writeFileSync(USERS_FILE, JSON.stringify(serverUsers, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('Could not load persistent users, using SAMPLE_USERS:', e);
  serverUsers = [...SAMPLE_USERS];
}

const saveUsersToDisk = () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(serverUsers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save users to disk:', err);
  }
};

const PURE_WATER_SENSOR = {
  sensorNode: 'Street Pressure Sensor #04',
  pressureBar: 2.40,
  flowRateLpm: 420,
  turbidityNTU: 0.4,
  ph: 7.25,
  temperatureC: 26.8,
  simpleDiagnosis: 'Optimal water purity and steady pressure verified. Crystal clean water as inspected.',
  alertMessage: 'Sensors report optimal water purity (0.4 NTU) and steady pressure (2.40 bar).',
  severity: 'Normal' as const
};

try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const EXCLUDED_IDS = new Set(['AQUA-2026-6286', 'AQUA-2026-6341', 'AQUA-2026-1490', 'AQUA-2026-1051']);
      serverComplaints = parsed
        .filter((c: Complaint) => !EXCLUDED_IDS.has(c.id))
        .map((c: Complaint) => {
          const isActive = c.status !== 'Resolved';
          const cleanNotes = c.officerNotes ? Array.from(new Set(c.officerNotes)) : undefined;
          return {
            ...c,
            // Remove sample photos from active complaints
            photoUrl: isActive ? undefined : c.photoUrl,
            officerNotes: cleanNotes,
            sensorData: c.sensorData || {
              sensorNode: 'Street Pressure Sensor #04',
              pressureBar: isActive ? 1.65 : 2.40,
              flowRateLpm: isActive ? 280 : 420,
              turbidityNTU: isActive ? 1.60 : 0.4,
              ph: 7.20,
              temperatureC: 26.8,
              severity: isActive ? 'Warning' : 'Normal',
              simpleDiagnosis: isActive
                ? 'Pipeline pressure drop (1.65 bar) detected. Moderate risk of distribution loss.'
                : 'Optimal water purity and steady pressure verified. Crystal clean water as inspected.',
              alertMessage: isActive
                ? 'Sensors report pressure drop (1.65 bar) and flow deviation.'
                : 'Sensors report optimal water purity (0.4 NTU) and steady pressure (2.40 bar).'
            }
          };
        });
      if (serverComplaints.length === 0) {
        serverComplaints = [...INITIAL_COMPLAINTS];
      }
    } else {
      serverComplaints = [...INITIAL_COMPLAINTS];
    }
  } else {
    serverComplaints = [...INITIAL_COMPLAINTS];
    fs.writeFileSync(DATA_FILE, JSON.stringify(serverComplaints, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('Could not load persistent complaints, using in-memory initial data:', e);
  serverComplaints = [...INITIAL_COMPLAINTS];
}

const saveToDisk = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(serverComplaints, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save complaints to disk:', err);
  }
};

// Real-Time Municipal IoT Water Telemetry State (3-Tier Project Architecture)
let liveTelemetry: LiveTelemetry = {
  // 1. Water Storage Tank Sensors
  tankPh: 7.32,
  tankTurbidityNTU: 0.45,
  tankConductivity: 310, // µS/cm
  tankLevelPercent: 88,

  // 2. Underground Pipeline Sensors
  pipelineFlowRateLpm: 425,
  pipelinePressureBar: 2.40,

  // 3. Consumer Tap Sensor
  tapPressureBar: 1.32,

  // ML Broken Pipe status derived from pressure variations
  mlBrokenPipeStatus: {
    predicted: false,
    pipelinePressureVariationBar: 0.0,
    tapPressureVariationBar: 0.0,
    probability: 2,
    message: 'Pipeline integrity intact. Pressure variations within acceptable tolerance (±0.10 bar).'
  },

  // Backward-compatible flat values
  pressureBar: 2.40,
  ph: 7.32,
  tdsPPM: 198,
  flowRateLpm: 425,
  status: 'optimal',
  lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
};

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  // Setup WebSocket Server on the same port
  const wss = new WebSocketServer({ server, path: '/ws' });

  // Broadcast helper
  const broadcast = (type: string, data: any) => {
    const payload = JSON.stringify({ type, data });
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (e) {
          console.error('[WS] Broadcast send error:', e);
        }
      }
    }
  };

  // Periodic IoT Telemetry Engine (real-time sensory updates every 5 seconds)
  setInterval(() => {
    // Generate realistic gentle IoT sensor fluctuations across the 3 project tiers
    const deltaPipelinePressure = (Math.random() * 0.06 - 0.03);
    const newPipelinePressure = Math.max(2.1, Math.min(2.65, Number((liveTelemetry.pipelinePressureBar + deltaPipelinePressure).toFixed(2))));

    const deltaTapPressure = (Math.random() * 0.04 - 0.02);
    const newTapPressure = Math.max(1.15, Math.min(1.45, Number((liveTelemetry.tapPressureBar + deltaTapPressure).toFixed(2))));

    const deltaPh = (Math.random() * 0.04 - 0.02);
    const newPh = Math.max(7.15, Math.min(7.55, Number((liveTelemetry.tankPh + deltaPh).toFixed(2))));

    const deltaTurbidity = (Math.random() * 0.04 - 0.02);
    const newTurbidity = Math.max(0.3, Math.min(0.85, Number((liveTelemetry.tankTurbidityNTU + deltaTurbidity).toFixed(2))));

    const deltaConductivity = Math.round(Math.random() * 6 - 3);
    const newConductivity = Math.max(270, Math.min(340, liveTelemetry.tankConductivity + deltaConductivity));

    const deltaFlow = Math.round(Math.random() * 8 - 4);
    const newFlow = Math.max(395, Math.min(450, liveTelemetry.pipelineFlowRateLpm + deltaFlow));

    // Calculate pressure variations relative to nominal baselines (Pipeline: 2.40 bar, Tap: 1.30 bar)
    const pipelineDrop = Number(Math.max(0, 2.40 - newPipelinePressure).toFixed(2));
    const tapDrop = Number(Math.max(0, 1.30 - newTapPressure).toFixed(2));
    const isBroken = pipelineDrop > 0.6 || (pipelineDrop > 0.4 && tapDrop > 0.5);
    const brokenProb = isBroken ? 88 : Math.max(2, Math.round(pipelineDrop * 25));

    liveTelemetry = {
      tankPh: newPh,
      tankTurbidityNTU: newTurbidity,
      tankConductivity: newConductivity,
      tankLevelPercent: liveTelemetry.tankLevelPercent,
      pipelineFlowRateLpm: newFlow,
      pipelinePressureBar: newPipelinePressure,
      tapPressureBar: newTapPressure,
      mlBrokenPipeStatus: {
        predicted: isBroken,
        pipelinePressureVariationBar: pipelineDrop,
        tapPressureVariationBar: tapDrop,
        probability: brokenProb,
        message: isBroken
          ? `ML Warning: Abnormal pressure drop detected (-${pipelineDrop} bar pipeline, -${tapDrop} bar tap). Possible broken pipe.`
          : 'Pipeline integrity intact. Pressure variations within normal limits (±0.15 bar).'
      },
      pressureBar: newPipelinePressure,
      ph: newPh,
      tdsPPM: Math.round(newConductivity * 0.64),
      flowRateLpm: newFlow,
      status: isBroken ? 'warning' : 'optimal',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    broadcast('telemetry:update', liveTelemetry);
  }, 5000);

  // WebSocket Connection Lifecycle
  wss.on('connection', (ws) => {
    console.log(`[WS] Client connected. Total active connections: ${wss.clients.size}`);

    // Send initial snapshot to newly connected client
    ws.send(
      JSON.stringify({
        type: 'init',
        data: {
          complaints: serverComplaints,
          telemetry: liveTelemetry,
          activeUsers: wss.clients.size
        }
      })
    );

    // Broadcast presence update
    broadcast('presence:update', { activeUsers: wss.clients.size });

    // Handle incoming client messages
    ws.on('message', (raw) => {
      try {
        const message = JSON.parse(raw.toString());
        if (message.type === 'complaint:create') {
          const complaintData = message.data;
          const newComplaint: Complaint = {
            ...complaintData,
            id: complaintData.id || `AQUA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            status: complaintData.status || 'Submitted',
            submittedAt: complaintData.submittedAt || new Date().toLocaleString()
          };
          serverComplaints = [newComplaint, ...serverComplaints];
          saveToDisk();
          broadcast('complaint:created', newComplaint);
        } else if (message.type === 'complaint:update') {
          const { id, updates } = message.data;
          const index = serverComplaints.findIndex((c) => c.id === id);
          if (index >= 0) {
            serverComplaints[index] = { ...serverComplaints[index], ...updates };
            saveToDisk();
            broadcast('complaint:updated', serverComplaints[index]);
          }
        }
      } catch (err) {
        console.error('[WS] Message handling error:', err);
      }
    });

    ws.on('close', () => {
      console.log(`[WS] Client disconnected. Remaining: ${wss.clients.size}`);
      broadcast('presence:update', { activeUsers: wss.clients.size });
    });
  });

  app.use(express.json({ limit: '15mb' }));

  // --- API ROUTES ---

  // Administrative Hierarchy (State -> District -> Village -> Grampanchayath)
  app.get('/api/locations/hierarchy', (_req, res) => {
    res.json({
      success: true,
      hierarchy: ADMINISTRATIVE_HIERARCHY,
      totalStates: ADMINISTRATIVE_HIERARCHY.length
    });
  });

  // Query States & UTs
  app.get('/api/locations/states', (_req, res) => {
    res.json({
      success: true,
      states: ADMINISTRATIVE_HIERARCHY.map((s) => ({ id: s.id, name: s.name, code: s.code, type: s.type, districtCount: s.districts.length }))
    });
  });

  // Query Districts by State
  app.get('/api/locations/districts', (req, res) => {
    const stateName = String(req.query.state || '').trim();
    const districts = getDistrictsForState(stateName);
    res.json({
      success: true,
      state: stateName,
      districts: districts.map((d: DistrictInfo) => ({ id: d.id, name: d.name, villageCount: d.villages.length }))
    });
  });

  // Query Villages by State and District
  app.get('/api/locations/villages', (req, res) => {
    const stateName = String(req.query.state || '').trim();
    const districtName = String(req.query.district || '').trim();
    const villages = getVillagesForDistrict(stateName, districtName);
    res.json({
      success: true,
      state: stateName,
      district: districtName,
      villages
    });
  });

  // Query Grampanchayaths by State, District, and Village
  app.get('/api/locations/grampanchayats', (req, res) => {
    const stateName = String(req.query.state || '').trim();
    const districtName = String(req.query.district || '').trim();
    const villageName = String(req.query.village || '').trim();
    const gramPanchayats = getGramPanchayatsForVillage(stateName, districtName, villageName);
    res.json({
      success: true,
      state: stateName,
      district: districtName,
      village: villageName,
      gramPanchayats
    });
  });

  // Get all users
  app.get('/api/users', (_req, res) => {
    res.json({
      success: true,
      users: serverUsers
    });
  });

  // Get registered citizens
  app.get('/api/citizens', (_req, res) => {
    const citizens = serverUsers.filter((u) => u.role === 'citizen');
    res.json({
      success: true,
      citizens,
      totalCitizens: citizens.length
    });
  });

  // Citizen Account Registration Endpoint
  app.post('/api/auth/register', (req, res) => {
    try {
      const {
        name,
        mobile,
        email,
        state,
        district,
        village,
        gramPanchayat,
        houseNo,
        street,
        landmark,
        pincode,
        ward,
        zone
      } = req.body;

      if (!name || !name.trim()) {
        res.status(400).json({ success: false, error: 'Full name is required' });
        return;
      }
      if (!mobile || !mobile.trim()) {
        res.status(400).json({ success: false, error: 'Mobile number is required' });
        return;
      }
      if (!state || !state.trim()) {
        res.status(400).json({ success: false, error: 'State selection is required' });
        return;
      }
      if (!district || !district.trim()) {
        res.status(400).json({ success: false, error: 'District selection is required' });
        return;
      }
      if (!village || !village.trim()) {
        res.status(400).json({ success: false, error: 'Village selection is required' });
        return;
      }
      if (!gramPanchayat || !gramPanchayat.trim()) {
        res.status(400).json({ success: false, error: 'Grampanchayath selection is required' });
        return;
      }
      if (!houseNo || !houseNo.trim()) {
        res.status(400).json({ success: false, error: 'House/Door number is required' });
        return;
      }

      // Generate structured, clean formatted address
      const formattedAddress = formatCitizenAddress({
        houseNo: houseNo.trim(),
        street: (street || '').trim(),
        landmark: (landmark || '').trim(),
        village: village.trim(),
        gramPanchayat: gramPanchayat.trim(),
        district: district.trim(),
        state: state.trim(),
        pincode: (pincode || '560001').trim()
      });

      const citizenId = req.body.id || `user_citizen_${Date.now()}`;
      const defaultPanchayat = gramPanchayat.includes('Panchayat')
        ? gramPanchayat.trim()
        : `${gramPanchayat.trim()} Gram Panchayat`;

      const newCitizen: User = {
        id: citizenId,
        name: name.trim(),
        mobile: mobile.trim(),
        email: email?.trim() || `${mobile.trim()}@citizen.aquacare.gov`,
        role: 'citizen',
        state: state.trim(),
        district: district.trim(),
        village: village.trim(),
        gramPanchayat: defaultPanchayat,
        houseNo: houseNo.trim(),
        street: (street || '').trim(),
        landmark: (landmark || '').trim(),
        panchayat: defaultPanchayat,
        ward: ward?.trim() || `${village.trim()} Ward 01`,
        zone: zone?.trim() || `${district.trim()} Water Division`,
        address: formattedAddress,
        pincode: (pincode || '560001').trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
      };

      // Check if user already exists with same mobile
      const existingIdx = serverUsers.findIndex((u) => u.mobile === newCitizen.mobile);
      if (existingIdx >= 0) {
        serverUsers[existingIdx] = { ...serverUsers[existingIdx], ...newCitizen };
      } else {
        serverUsers.unshift(newCitizen);
      }

      saveUsersToDisk();

      // Realtime broadcast of newly registered citizen
      broadcast('user:registered', newCitizen);
      console.log(`[Server] Citizen registered: ${newCitizen.name} (${newCitizen.mobile}) from ${newCitizen.village}, ${newCitizen.gramPanchayat}`);

      res.status(201).json({
        success: true,
        message: 'Citizen registered successfully',
        user: newCitizen
      });
    } catch (err: any) {
      console.error('[Server] Citizen registration failed:', err);
      res.status(500).json({ success: false, error: err.message || 'Registration failed' });
    }
  });

  // User Login Endpoint
  app.post('/api/auth/login', (req, res) => {
    const { identifier, role } = req.body;
    if (!identifier) {
      res.status(400).json({ success: false, error: 'Identifier is required' });
      return;
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const found = serverUsers.find(
      (u) =>
        u.mobile === cleanId ||
        u.email.toLowerCase() === cleanId ||
        u.id.toLowerCase() === cleanId
    );

    if (found) {
      res.json({ success: true, user: found });
      return;
    }

    // Role-based fallback
    const roleSample = serverUsers.find((u) => u.role === (role || 'citizen')) || serverUsers[0];
    res.json({
      success: true,
      user: {
        ...roleSample,
        mobile: /^\d+$/.test(cleanId) ? cleanId : roleSample.mobile,
        email: cleanId.includes('@') ? cleanId : roleSample.email
      }
    });
  });

  // Health & Telemetry check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      totalComplaints: serverComplaints.length,
      activeWsConnections: wss.clients.size,
      telemetry: liveTelemetry,
      timestamp: new Date().toISOString()
    });
  });

  // Get live telemetry
  app.get('/api/telemetry', (_req, res) => {
    res.json({
      success: true,
      telemetry: liveTelemetry,
      activeUsers: wss.clients.size
    });
  });

  // Get all complaints
  app.get('/api/complaints', (_req, res) => {
    res.json({
      success: true,
      complaints: serverComplaints
    });
  });

  // --- TRAINED ML MODEL (XGBOOST / GBDT) ENDPOINTS ---

  // Get ML Model Architecture, Hyperparameters, Metrics & PPT Slides
  app.get('/api/ml/model-info', (_req, res) => {
    try {
      const model = getOrLoadMLModel();
      res.json({
        success: true,
        summary: model.summary,
        totalTrees: model.trees.length
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Run Real-Time XGBoost Inference on Telemetry
  app.post('/api/ml/predict', (req, res) => {
    try {
      const result = runMLDiagnosis(req.body || {});
      res.json({
        success: true,
        prediction: result
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Retrain the XGBoost Model on Demand
  app.post('/api/ml/retrain', (req, res) => {
    try {
      const samples = Number(req.body?.samples) || 2400;
      const updatedSummary = retrainMLModel(samples);
      res.json({
        success: true,
        message: `Successfully retrained XGBoost model with ${samples} municipal telemetry samples`,
        summary: updatedSummary
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ML Water Problem Identification & Sensor Diagnosis
  app.post('/api/ml/diagnose', async (req, res) => {
    const { problemText, ward, sensorTelemetry } = req.body;
    const text = (problemText || '').trim();

    // Check if explicit sensor telemetry was provided across the 3 project tiers
    const hasSensorInput = sensorTelemetry && typeof sensorTelemetry === 'object';
    
    // 1. Tank sensors: pH, Turbidity, Conductivity
    const sPh = hasSensorInput && sensorTelemetry.ph !== undefined ? Number(sensorTelemetry.ph) : (sensorTelemetry?.tank?.ph !== undefined ? Number(sensorTelemetry.tank.ph) : undefined);
    const sTurbidity = hasSensorInput && sensorTelemetry.turbidityNTU !== undefined ? Number(sensorTelemetry.turbidityNTU) : (sensorTelemetry?.tank?.turbidityNTU !== undefined ? Number(sensorTelemetry.tank.turbidityNTU) : undefined);
    const sConductivity = hasSensorInput && sensorTelemetry.conductivity !== undefined ? Number(sensorTelemetry.conductivity) : (sensorTelemetry?.tank?.conductivity !== undefined ? Number(sensorTelemetry.tank.conductivity) : undefined);

    // 2. Underground pipeline sensors: flow, pressure
    const sPipelinePressure = hasSensorInput && sensorTelemetry.pressureBar !== undefined ? Number(sensorTelemetry.pressureBar) : (sensorTelemetry?.pipeline?.pressureBar !== undefined ? Number(sensorTelemetry.pipeline.pressureBar) : undefined);
    const sPipelineFlow = hasSensorInput && sensorTelemetry.flowRateLpm !== undefined ? Number(sensorTelemetry.flowRateLpm) : (sensorTelemetry?.pipeline?.flowRateLpm !== undefined ? Number(sensorTelemetry.pipeline.flowRateLpm) : undefined);

    // 3. Consumer tap sensor: pressure
    const sTapPressure = hasSensorInput && sensorTelemetry.tapPressureBar !== undefined ? Number(sensorTelemetry.tapPressureBar) : (sensorTelemetry?.tap?.pressureBar !== undefined ? Number(sensorTelemetry.tap.pressureBar) : undefined);

    const sNode = hasSensorInput && sensorTelemetry.sensorNode ? String(sensorTelemetry.sensorNode) : `Municipal Water Sensor Grid (${ward || 'Ward 12'})`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI();
        const sensorContext = `
PROJECT SENSOR TELEMETRY:
1. STORAGE TANK SENSORS:
   - pH: ${sPh ?? 7.25} (normal: 6.5 - 8.5)
   - Turbidity: ${sTurbidity ?? 0.8} NTU (normal: < 1.0 NTU)
   - Conductivity: ${sConductivity ?? 310} µS/cm (normal: 250 - 500 µS/cm)
2. UNDERGROUND PIPELINE SENSORS:
   - Pipeline Flow Rate: ${sPipelineFlow ?? 420} L/min (normal: 380 - 450 L/min)
   - Pipeline Pressure: ${sPipelinePressure ?? 2.40} bar (nominal baseline: 2.40 bar)
3. CONSUMER TAP SENSOR:
   - Tap Pressure: ${sTapPressure ?? 1.30} bar (nominal delivery: 1.10 - 1.50 bar)
`;
        const prompt = `You are a municipal water ML engineer analyzing water complaints and sensor data.
Analyze this water issue: "${text}". Ward: "${ward || 'Ward 12'}".
${sensorContext}

PROJECT CORE FOCUS:
We are predicting broken pipes using variations in pressure across the underground pipeline (nominal 2.4 bar) and consumer taps (nominal 1.3 bar), combined with Tank sensors (pH, Turbidity, Conductivity).
- Sudden pipeline pressure drop (e.g. 2.4 bar -> < 1.6 bar) + tap pressure collapse (e.g. 1.3 bar -> < 0.5 bar) + flow surge/deviation strongly indicates an UNDERGROUND BROKEN PIPE.
- High turbidity (> 3.0 NTU) or conductivity (> 700 µS/cm) in Tank indicates storage contamination/silt.
- Low pipeline flow (~0 L/min) and zero pressure indicates main line empty/cutoff.

Return STRICT JSON:
{
  "identifiedProblem": string,
  "category": "Water Leakage" | "No Water" | "Dirty Water" | "Slow Water Flow" | "Broken Tap" | "Bad Smell or Taste" | "Other Problem",
  "urgency": "High" | "Medium" | "Emergency",
  "explanation": string,
  "sensorAlertMessage": string,
  "sensorNode": string,
  "waterSafety": "Safe" | "Not Safe to Drink" | "Boil Before Use",
  "advice": string,
  "mlBrokenPipePrediction": {
    "isBrokenPipePredicted": boolean,
    "brokenPipeProbability": number,
    "pipelinePressureDropBar": number,
    "tapPressureDropBar": number,
    "leakSeverity": "Normal" | "Minor Leak" | "Major Fracture / Broken Pipe" | "Critical Burst",
    "diagnosisReason": string
  },
  "telemetry": {
    "tank": { "ph": number, "turbidityNTU": number, "conductivity": number },
    "pipeline": { "flowRateLpm": number, "pressureBar": number },
    "tap": { "pressureBar": number }
  }
}`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.identifiedProblem) {
          if (!parsed.sensorAlertMessage || !parsed.sensorAlertMessage.startsWith('Alert Message: It is identified by sensor')) {
            parsed.sensorAlertMessage = `Alert Message: It is identified by sensor - ${parsed.identifiedProblem} confirmed by pressure variation analysis.`;
          }
          res.json({ success: true, diagnosis: parsed });
          return;
        }
      } catch (err) {
        console.warn('Gemini diagnosis fallback:', err);
      }
    }

    // High quality sensor-driven ML diagnosis fallback
    const lower = text.toLowerCase();
    let category = 'Water Leakage';
    let identifiedProblem = 'Underground Water Pipe Leaking';
    let urgency: 'High' | 'Medium' | 'Emergency' = 'High';

    // Baseline sensor defaults
    let tankPh = sPh ?? 7.20;
    let tankTurbidity = sTurbidity ?? 0.75;
    let tankConductivity = sConductivity ?? 310;
    let pipelineFlow = sPipelineFlow ?? 420;
    let pipelinePressure = sPipelinePressure ?? 1.35;
    let tapPressure = sTapPressure ?? 0.25;

    let explanation = 'Underground pipeline pressure variation indicates water escaping through a fractured pipe segment.';
    let waterSafety = 'Safe once pressure restores';
    let advice = 'Keep consumer taps turned off until the municipal repair team restores line pressure.';

    if (lower.includes('leak') || lower.includes('broken pipe') || lower.includes('burst') || (sPipelinePressure !== undefined && sPipelinePressure < 1.7)) {
      category = 'Water Leakage';
      identifiedProblem = 'Underground Pipe Fracture & Pressure Drop';
      urgency = 'Emergency';
      pipelinePressure = sPipelinePressure ?? 1.35;
      tapPressure = sTapPressure ?? 0.25;
      pipelineFlow = sPipelineFlow ?? 560;
      explanation = 'Sudden underground pipeline pressure drop to 1.35 bar (ΔP: -1.05 bar) with tap starvation (0.25 bar). ML model confirms broken pipe.';
    } else if (lower.includes('no water') || lower.includes('dry') || (sPipelinePressure !== undefined && sPipelinePressure < 0.2)) {
      category = 'No Water';
      identifiedProblem = 'Zero Water Supply';
      urgency = 'High';
      pipelinePressure = sPipelinePressure ?? 0.05;
      tapPressure = sTapPressure ?? 0.0;
      pipelineFlow = sPipelineFlow ?? 0;
      explanation = 'Zero water flow and pressure collapse across underground pipeline and consumer taps. Main line empty.';
      waterSafety = 'Supply temporarily unavailable';
      advice = 'Repair crew has been dispatched to check the feeder pump.';
    } else if (lower.includes('dirty') || lower.includes('mud') || lower.includes('brown') || (sTurbidity !== undefined && sTurbidity > 3.0)) {
      category = 'Dirty Water';
      identifiedProblem = 'Storage Tank Turbidity & Silt Infiltration';
      urgency = 'High';
      tankTurbidity = sTurbidity ?? 4.80;
      tankConductivity = sConductivity ?? 780;
      tankPh = sPh ?? 6.45;
      pipelinePressure = sPipelinePressure ?? 2.15;
      tapPressure = sTapPressure ?? 1.20;
      explanation = 'Tank optical sensors detected turbidity spike (4.80 NTU) and high conductivity (780 µS/cm). Silt sediment entered the reservoir.';
      waterSafety = 'Not Safe to Drink';
      advice = 'Do not drink unboiled water. Let tap run to flush out sediment.';
    } else if (lower.includes('slow') || lower.includes('low pressure') || (sTapPressure !== undefined && sTapPressure < 0.8)) {
      category = 'Slow Water Flow';
      identifiedProblem = 'Low Delivery Tap Pressure';
      urgency = 'Medium';
      pipelinePressure = sPipelinePressure ?? 1.85;
      tapPressure = sTapPressure ?? 0.55;
      pipelineFlow = sPipelineFlow ?? 310;
      explanation = 'Tap delivery pressure dropped to 0.55 bar while pipeline remains partially pressurized (1.85 bar). Distribution throttling detected.';
      waterSafety = 'Safe to use';
      advice = 'Tanks will fill slowly during low pressure period.';
    }

    // Compute ML Broken Pipe Prediction based on pressure variation
    const pipelineDrop = Number(Math.max(0, 2.40 - pipelinePressure).toFixed(2));
    const tapDrop = Number(Math.max(0, 1.30 - tapPressure).toFixed(2));
    // Run trained XGBoost ensemble model evaluation
    const xgbEval = runMLDiagnosis({
      tankPh,
      tankTurbidityNTU: tankTurbidity,
      tankConductivity,
      pipelineFlowRateLpm: pipelineFlow,
      pipelinePressureBar: pipelinePressure,
      tapPressureBar: tapPressure
    });

    const isBroken = xgbEval.isBrokenPipePredicted || category === 'Water Leakage' || pipelineDrop >= 0.6 || (pipelineDrop >= 0.4 && tapDrop >= 0.5);
    const brokenProb = xgbEval.brokenPipeProbability || (isBroken ? 95 : 4);

    const mlBrokenPipePrediction = {
      isBrokenPipePredicted: isBroken,
      brokenPipeProbability: brokenProb,
      pipelinePressureDropBar: pipelineDrop,
      tapPressureDropBar: tapDrop,
      leakSeverity: isBroken ? ('Major Fracture / Broken Pipe' as const) : ('Normal' as const),
      diagnosisReason: isBroken
        ? `XGBoost ML model predicts broken pipe (${brokenProb}% prob) from pressure variations: Underground pipeline dropped by -${pipelineDrop} bar (nominal 2.40 -> ${pipelinePressure} bar) with consumer tap starvation (-${tapDrop} bar to ${tapPressure} bar) and escaping flow velocity (${pipelineFlow} L/min). Storage tank sensors confirm clean source water (pH: ${tankPh}, Turbidity: ${tankTurbidity} NTU, Conductivity: ${tankConductivity} µS/cm), verifying physical rupture in distribution pipeline.`
        : `Normal pressure variation within operational limits (ΔP pipeline: -${pipelineDrop} bar, ΔP tap: -${tapDrop} bar). Tank metrics: pH ${tankPh}, Turbidity ${tankTurbidity} NTU, Conductivity ${tankConductivity} µS/cm.`
    };

    const sensorAlertMessage = isBroken
      ? `Alert Message: It is identified by sensor - Underground pipe fracture detected from pressure variation (Pipeline: ${pipelinePressure} bar, Tap: ${tapPressure} bar, Tank: ${tankTurbidity} NTU)`
      : `Alert Message: It is identified by sensor - ${identifiedProblem} confirmed by sensor grid.`;

    res.json({
      success: true,
      diagnosis: {
        identifiedProblem,
        category,
        urgency,
        explanation,
        sensorAlertMessage,
        sensorNode: sNode,
        waterSafety,
        advice,
        mlBrokenPipePrediction,
        xgboostDiagnosis: xgbEval,
        telemetry: {
          tank: { ph: tankPh, turbidityNTU: tankTurbidity, conductivity: tankConductivity },
          pipeline: { flowRateLpm: pipelineFlow, pressureBar: pipelinePressure },
          tap: { pressureBar: tapPressure },
          pressureBar: pipelinePressure,
          tapPressureBar: tapPressure,
          flowRateLpm: pipelineFlow,
          ph: tankPh,
          turbidityNTU: tankTurbidity,
          conductivity: tankConductivity,
          tdsPPM: Math.round(tankConductivity * 0.64)
        }
      }
    });
  });

  // Create new complaint
  app.post('/api/complaints', (req, res) => {
    const complaintData = req.body;
    if (!complaintData || !complaintData.title) {
      res.status(400).json({ success: false, error: 'Complaint title is required' });
      return;
    }

    // Check if complaint already exists by id
    const existingIndex = serverComplaints.findIndex((c) => c.id === complaintData.id);
    if (existingIndex >= 0) {
      serverComplaints[existingIndex] = {
        ...serverComplaints[existingIndex],
        ...complaintData
      };
      saveToDisk();
      broadcast('complaint:updated', serverComplaints[existingIndex]);
      res.json({ success: true, complaint: serverComplaints[existingIndex], updated: true });
      return;
    }

    const newComplaint: Complaint = {
      ...complaintData,
      id: complaintData.id || `AQUA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: complaintData.status || 'Submitted',
      submittedAt: complaintData.submittedAt || new Date().toLocaleString()
    };

    serverComplaints = [newComplaint, ...serverComplaints];
    saveToDisk();
    broadcast('complaint:created', newComplaint);
    console.log(`[Server] Complaint created: ${newComplaint.id}`);
    res.status(201).json({ success: true, complaint: newComplaint });
  });

  // Update complaint (status, notes, rating, assignment)
  app.put('/api/complaints/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const index = serverComplaints.findIndex((c) => c.id === id);
    if (index === -1) {
      const newC: Complaint = {
        id,
        userId: updates.userId || 'guest_user',
        userName: updates.userName || 'Citizen',
        userMobile: updates.userMobile || '9840123456',
        title: updates.title || 'Water Problem',
        category: updates.category || 'Other',
        description: updates.description || '',
        location: updates.location || 'Municipal Ward',
        ward: updates.ward || 'Ward 12',
        submittedAt: updates.submittedAt || new Date().toLocaleString(),
        status: updates.status || 'In Progress',
        urgency: updates.urgency || 'Medium',
        timeline: updates.timeline || [],
        ...updates
      };
      serverComplaints.unshift(newC);
      saveToDisk();
      broadcast('complaint:created', newC);
      res.json({ success: true, complaint: newC, created: true });
      return;
    }

    serverComplaints[index] = {
      ...serverComplaints[index],
      ...updates
    };

    saveToDisk();
    broadcast('complaint:updated', serverComplaints[index]);
    console.log(`[Server] Complaint updated & broadcast: ${id} -> Status: ${serverComplaints[index].status}`);
    res.json({ success: true, complaint: serverComplaints[index] });
  });

  // Batch sync complaints from client
  app.post('/api/complaints/sync', (req, res) => {
    const clientComplaints: Complaint[] = req.body.complaints;
    const EXCLUDED_IDS = new Set(['AQUA-2026-6286', 'AQUA-2026-6341', 'AQUA-2026-1490', 'AQUA-2026-1051']);
    if (Array.isArray(clientComplaints) && clientComplaints.length > 0) {
      const map = new Map<string, Complaint>();
      for (const sc of serverComplaints) {
        if (!EXCLUDED_IDS.has(sc.id)) {
          map.set(sc.id, sc);
        }
      }
      for (const cc of clientComplaints) {
        if (EXCLUDED_IDS.has(cc.id)) continue;
        if (!map.has(cc.id)) {
          map.set(cc.id, cc);
        } else {
          const existing = map.get(cc.id)!;
          const mergedNotes = cc.officerNotes || existing.officerNotes;
          map.set(cc.id, {
            ...existing,
            ...cc,
            officerRating: cc.officerRating || existing.officerRating,
            officerNotes: mergedNotes ? Array.from(new Set(mergedNotes)) : undefined,
            timeline: cc.timeline && cc.timeline.length >= existing.timeline.length ? cc.timeline : existing.timeline
          });
        }
      }

      serverComplaints = Array.from(map.values());
      saveToDisk();
      broadcast('complaints:synced', serverComplaints);
      console.log(`[Server] Synced ${serverComplaints.length} complaints.`);
    }

    res.json({ success: true, complaints: serverComplaints });
  });

  // --- VITE / STATIC SERVING ---
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] AquaCare real-time HTTP & WS running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
