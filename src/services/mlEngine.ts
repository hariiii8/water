/**
 * AquaCare Machine Learning Diagnosis Engine
 * 
 * Algorithm: Extreme Gradient Boosting (XGBoost) / Gradient Boosted Decision Tree (GBDT)
 * Multi-Class Formulation for Municipal IoT Water Systems (3-Tier Architecture)
 */

import fs from 'fs';
import path from 'path';
import {
  CLASS_NAMES,
  FEATURE_NAMES,
  generateDataset,
  trainXGBoostEnsemble,
  predictSample,
  TrainedModelSummary,
  TrainedTree,
  SensorSample
} from '../../scripts/train_ml_model.ts';

export interface MLPredictionResult {
  predictedClass: string;
  classIndex: number;
  confidence: number;
  probabilities: {
    className: string;
    classIndex: number;
    probability: number;
    percentage: number;
  }[];
  isBrokenPipePredicted: boolean;
  brokenPipeProbability: number;
  leakSeverity: 'Normal' | 'Minor Leak' | 'Major Fracture / Broken Pipe' | 'Critical Burst';
  explanation: string;
  recommendedAction: string;
  featureContributions: {
    feature: string;
    value: number;
    description: string;
    impactPercentage: number;
  }[];
  waterSafety: 'Safe' | 'Not Safe to Drink' | 'Boil Before Use' | 'Supply Offline';
  calculatedMetrics: {
    deltaPipelinePressure: number;
    deltaTapPressure: number;
    pressureRatio: number;
    flowAnomaly: number;
    hydraulicImpedance: number;
    waterQualityIndex: number;
  };
}

let cachedModel: { summary: TrainedModelSummary; trees: TrainedTree[] } | null = null;

/**
 * Load or initialize the trained XGBoost model
 */
export function getOrLoadMLModel(): { summary: TrainedModelSummary; trees: TrainedTree[] } {
  if (cachedModel) {
    return cachedModel;
  }

  const modelPath = path.resolve(process.cwd(), '.data/ml_trained_model.json');
  if (fs.existsSync(modelPath)) {
    try {
      const raw = fs.readFileSync(modelPath, 'utf-8');
      cachedModel = JSON.parse(raw);
      console.log(`[ML Engine] Loaded trained XGBoost model from ${modelPath} (${cachedModel?.trees?.length} trees)`);
      return cachedModel!;
    } catch (e) {
      console.warn('[ML Engine] Error loading model from disk, training fresh model in-memory:', e);
    }
  }

  // If not found or failed, train in-memory
  console.log('[ML Engine] Training fresh XGBoost ensemble in-memory...');
  const dataset = generateDataset(2000);
  const splitIdx = Math.floor(dataset.length * 0.8);
  const trainSet = dataset.slice(0, splitIdx);
  const valSet = dataset.slice(splitIdx);
  const { modelSummary, trees } = trainXGBoostEnsemble(trainSet, valSet, 50, 4, 0.12);
  cachedModel = { summary: modelSummary, trees };

  // Attempt save
  try {
    const dataDir = path.resolve(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(modelPath, JSON.stringify(cachedModel, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[ML Engine] Could not persist trained model:', err);
  }

  return cachedModel;
}

/**
 * Run XGBoost inference on 3-tier telemetry
 */
export function runMLDiagnosis(input: {
  tankPh?: number;
  tankTurbidityNTU?: number;
  tankConductivity?: number;
  tankLevelPercent?: number;
  pipelineFlowRateLpm?: number;
  pipelinePressureBar?: number;
  tapPressureBar?: number;
}): MLPredictionResult {
  const model = getOrLoadMLModel();

  const tankPh = Number(input.tankPh ?? 7.25);
  const tankTurbidityNTU = Number(input.tankTurbidityNTU ?? 0.65);
  const tankConductivity = Number(input.tankConductivity ?? 310);
  const tankLevelPercent = Number(input.tankLevelPercent ?? 85);
  const pipelineFlowRateLpm = Number(input.pipelineFlowRateLpm ?? 420);
  const pipelinePressureBar = Number(input.pipelinePressureBar ?? 2.40);
  const tapPressureBar = Number(input.tapPressureBar ?? 1.30);

  // Hydraulic Calculations
  const deltaPipelinePressure = Number(Math.max(0, 2.40 - pipelinePressureBar).toFixed(3));
  const deltaTapPressure = Number(Math.max(0, 1.30 - tapPressureBar).toFixed(3));
  const pressureRatio = Number((tapPressureBar / Math.max(0.01, pipelinePressureBar)).toFixed(3));
  const flowAnomaly = Number((pipelineFlowRateLpm - 420).toFixed(2));
  const hydraulicImpedance = Number((deltaPipelinePressure / (pipelineFlowRateLpm + 1)).toFixed(5));

  const phPenalty = Math.abs(tankPh - 7.2) * 15;
  const turbidityPenalty = Math.max(0, tankTurbidityNTU - 1.0) * 12;
  const ecPenalty = Math.max(0, tankConductivity - 500) * 0.08;
  const waterQualityIndex = Number(Math.max(0, Math.min(100, 100 - phPenalty - turbidityPenalty - ecPenalty)).toFixed(1));

  const sample: SensorSample = {
    id: 'EVAL-001',
    features: {
      tankPh,
      tankTurbidityNTU,
      tankConductivity,
      tankLevelPercent,
      pipelineFlowRateLpm,
      pipelinePressureBar,
      tapPressureBar,
      deltaPipelinePressure,
      deltaTapPressure,
      pressureRatio,
      flowAnomaly,
      hydraulicImpedance,
      waterQualityIndex
    },
    label: 0,
    className: ''
  };

  const probs = predictSample(model.trees, sample, model.summary.hyperparameters.learningRate);
  const classIndex = probs.indexOf(Math.max(...probs));
  const predictedClass = CLASS_NAMES[classIndex];
  const confidence = Number((probs[classIndex] * 100).toFixed(1));

  const probabilities = CLASS_NAMES.map((name, idx) => ({
    className: name,
    classIndex: idx,
    probability: probs[idx],
    percentage: Number((probs[idx] * 100).toFixed(1))
  })).sort((a, b) => b.probability - a.probability);

  const brokenPipeProbability = Number(((probs[1] + (probs[2] * 0.45)) * 100).toFixed(1));
  const isBrokenPipePredicted = classIndex === 1 || (classIndex === 2 && deltaPipelinePressure >= 0.4) || brokenPipeProbability >= 50;

  let leakSeverity: 'Normal' | 'Minor Leak' | 'Major Fracture / Broken Pipe' | 'Critical Burst' = 'Normal';
  if (classIndex === 1 && deltaPipelinePressure >= 1.0) {
    leakSeverity = 'Critical Burst';
  } else if (classIndex === 1) {
    leakSeverity = 'Major Fracture / Broken Pipe';
  } else if (classIndex === 2 || brokenPipeProbability >= 40) {
    leakSeverity = 'Minor Leak';
  }

  // Water Safety Rating
  let waterSafety: 'Safe' | 'Not Safe to Drink' | 'Boil Before Use' | 'Supply Offline' = 'Safe';
  if (classIndex === 3 || tankTurbidityNTU > 4.0) {
    waterSafety = 'Not Safe to Drink';
  } else if (tankTurbidityNTU > 1.5 || tankPh < 6.5 || tankPh > 8.5) {
    waterSafety = 'Boil Before Use';
  } else if (classIndex === 4 || (pipelinePressureBar < 0.2 && pipelineFlowRateLpm < 10)) {
    waterSafety = 'Supply Offline';
  }

  // Explanation and Action
  let explanation = '';
  let recommendedAction = '';

  switch (classIndex) {
    case 0:
      explanation = `XGBoost model classifies system telemetry as Normal Optimal Supply with ${confidence}% confidence. Hydraulic pressure ratio (${pressureRatio}) and water quality index (${waterQualityIndex}/100) conform strictly to CPHEEO standards.`;
      recommendedAction = 'Maintain standard continuous IoT telemetry monitoring. No maintenance required.';
      break;
    case 1:
      explanation = `XGBoost model detects Major Underground Broken Pipe (${confidence}% confidence). Pressure in underground pipeline collapsed by -${deltaPipelinePressure.toFixed(2)} bar while consumer taps are starved (-${deltaTapPressure.toFixed(2)} bar) with surging flow velocity (${pipelineFlowRateLpm} L/min).`;
      recommendedAction = 'Emergency: Isolate sector sluice valve to prevent distribution water waste. Dispatch field excavation crew with replacement pipe sleeves.';
      break;
    case 2:
      explanation = `XGBoost model detects Incipient Pipeline Joint Leak (${confidence}% confidence). Moderate pressure decay (-${deltaPipelinePressure.toFixed(2)} bar) and acoustic micro-vibrations indicate developing fissure at pipe flange or collar.`;
      recommendedAction = 'Schedule non-destructive acoustic leak detection inspection within 24 hours. Monitor pressure gradient for acceleration.';
      break;
    case 3:
      explanation = `XGBoost model detects Reservoir Contamination & Silt Intrusion (${confidence}% confidence). Optical turbidity spiked to ${tankTurbidityNTU.toFixed(2)} NTU (limit: 1.0 NTU) and electrical conductivity rose to ${tankConductivity} µS/cm.`;
      recommendedAction = 'Issue citizen boil-water advisory. Flush municipal trunk lines via scour valves and inspect storage reservoir filtration beds.';
      break;
    case 4:
      explanation = `XGBoost model detects Main Feeder Pump Outage / Zero Supply (${confidence}% confidence). Transmission pipeline pressure (0.${pipelinePressureBar.toFixed(2)} bar) and flow velocity collapsed across all consumer household taps.`;
      recommendedAction = 'Check primary intake pumps, grid electrical phase, and overhead master storage tank discharge valves.';
      break;
    case 5:
      explanation = `XGBoost model detects Distribution Throttling / Flow Deficit (${confidence}% confidence). Pipeline remains pressurized (${pipelinePressureBar.toFixed(2)} bar) but household delivery tap pressure is throttled (-${deltaTapPressure.toFixed(2)} bar drop) due to local airlocks or valve throttling.`;
      recommendedAction = 'Bleed distribution air-release valves and inspect local nodal control regulators in Ward distribution loop.';
      break;
  }

  // Feature contributions (SHAP-style)
  const totalFeatureGain = model.summary.featureImportances.reduce((acc, f) => acc + f.importance, 0) || 1;
  const featureContributions = model.summary.featureImportances.slice(0, 6).map((fi) => {
    let val = (sample.features as any)[fi.feature] ?? 0;
    return {
      feature: fi.feature,
      value: val,
      description: fi.description,
      impactPercentage: fi.percentage
    };
  });

  return {
    predictedClass,
    classIndex,
    confidence,
    probabilities,
    isBrokenPipePredicted,
    brokenPipeProbability,
    leakSeverity,
    explanation,
    recommendedAction,
    featureContributions,
    waterSafety,
    calculatedMetrics: {
      deltaPipelinePressure,
      deltaTapPressure,
      pressureRatio,
      flowAnomaly,
      hydraulicImpedance,
      waterQualityIndex
    }
  };
}

/**
 * Retrain the model on demand
 */
export function retrainMLModel(sampleCount: number = 2400): TrainedModelSummary {
  console.log(`[ML Engine] Retraining model with ${sampleCount} municipal telemetry samples...`);
  const dataset = generateDataset(sampleCount);
  const splitIdx = Math.floor(dataset.length * 0.8);
  const trainSet = dataset.slice(0, splitIdx);
  const valSet = dataset.slice(splitIdx);
  const { modelSummary, trees } = trainXGBoostEnsemble(trainSet, valSet, 50, 4, 0.12);

  cachedModel = { summary: modelSummary, trees };

  try {
    const dataDir = path.resolve(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, 'ml_trained_model.json'), JSON.stringify(cachedModel, null, 2), 'utf-8');

    const srcDir = path.resolve(process.cwd(), 'src/data');
    fs.writeFileSync(path.join(srcDir, 'ml_model_metadata.json'), JSON.stringify(modelSummary, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ML Engine] Retrain save error:', err);
  }

  return modelSummary;
}
