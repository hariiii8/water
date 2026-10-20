/**
 * Administrative Hierarchy for Smart Municipal Water Management
 * State -> District -> Village -> Grampanchayath
 * Powered by All-India Complete Administrative Master
 */

import {
  ALL_INDIAN_STATES_AND_UTS,
  getAllStates,
  getState,
  getDistricts,
  getVillages,
  getGramPanchayats,
  StateEntry,
  DistrictEntry,
  VillageEntry,
  GramPanchayatEntry
} from './indiaAdministrativeMaster.ts';

export type StateInfo = StateEntry;
export type DistrictInfo = DistrictEntry;
export type VillageInfo = VillageEntry;
export type GramPanchayatInfo = GramPanchayatEntry;

export interface CitizenAddressDetails {
  state: string;
  district: string;
  village: string;
  gramPanchayat: string;
  houseNo: string;
  street: string;
  landmark?: string;
  pincode: string;
  formattedAddress: string;
}

export const ADMINISTRATIVE_HIERARCHY: StateEntry[] = ALL_INDIAN_STATES_AND_UTS;

export function getStateByName(stateName: string): StateEntry | undefined {
  return getState(stateName);
}

export function getDistrictsForState(stateName: string): DistrictEntry[] {
  return getDistricts(stateName);
}

export function getVillagesForDistrict(stateName: string, districtName: string): VillageEntry[] {
  return getVillages(stateName, districtName);
}

export function getGramPanchayatsForVillage(stateName: string, districtName: string, villageName: string): GramPanchayatEntry[] {
  return getGramPanchayats(stateName, districtName, villageName);
}

export function formatCitizenAddress(details: {
  houseNo: string;
  street: string;
  landmark?: string;
  village: string;
  gramPanchayat: string;
  district: string;
  state: string;
  pincode: string;
}): string {
  const parts: string[] = [];
  if (details.houseNo && details.houseNo.trim()) {
    const rawNo = details.houseNo.trim();
    parts.push(rawNo.toLowerCase().startsWith('house') || rawNo.toLowerCase().startsWith('no') || rawNo.toLowerCase().startsWith('door') ? rawNo : `House/Door No. ${rawNo}`);
  }
  if (details.street && details.street.trim()) {
    parts.push(details.street.trim());
  }
  if (details.landmark && details.landmark.trim()) {
    const rawLm = details.landmark.trim();
    parts.push(rawLm.toLowerCase().startsWith('near') || rawLm.toLowerCase().startsWith('opp') ? rawLm : `Near ${rawLm}`);
  }
  if (details.village && details.village.trim()) {
    parts.push(`Village: ${details.village.trim()}`);
  }
  if (details.gramPanchayat && details.gramPanchayat.trim()) {
    const gpName = details.gramPanchayat.includes('Panchayat')
      ? details.gramPanchayat.trim()
      : `${details.gramPanchayat.trim()} Gram Panchayat`;
    parts.push(gpName);
  }
  if (details.district && details.district.trim()) {
    parts.push(`District: ${details.district.trim()}`);
  }
  if (details.state && details.state.trim()) {
    parts.push(details.state.trim());
  }
  if (details.pincode && details.pincode.trim()) {
    parts.push(`PIN: ${details.pincode.trim()}`);
  }

  return parts.join(', ');
}
