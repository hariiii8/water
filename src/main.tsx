import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testFirestoreConnection } from './lib/firebase.ts';

// Test Cloud Firestore connection on boot per Firebase skill guidelines
testFirestoreConnection();

// Pre-cache key application images into browser memory immediately
const PRELOAD_IMAGES = [
  '/images/clean_water_healthy_homes_banner.jpg',
  '/images/smart_water_supply_banner.jpg',
  '/images/waterfall_lake_banner_1791941224744.jpg',
  '/images/aerial_reservoir.jpg',
  '/images/aerial_water_map.jpg'
];

if (typeof window !== 'undefined') {
  PRELOAD_IMAGES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

createRoot(document.getElementById('root')!).render(<App />);
