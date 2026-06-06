import type { ChildNutritionBand, ManagedChild } from '../data/childMonitoringData';

export type GrowthZScoreResult = {
  ageMonths: number;
  waz: number;
  haz: number;
  whz: number;
  band: ChildNutritionBand;
  reason: string;
};

function monthsFromDob(dob: string) {
  const birth = new Date(dob);
  const now = new Date();
  if (Number.isNaN(birth.getTime())) return 48;
  return Math.max(0, (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth());
}

function roundZ(value: number) {
  return Number(value.toFixed(1));
}

function clampAge(months: number) {
  return Math.max(24, Math.min(60, months));
}

function expectedWeight(ageMonths: number, gender: ManagedChild['gender']) {
  const age = clampAge(ageMonths);
  const base = gender === 'Female' ? 9.9 : 10.2;
  return base + (age - 24) * 0.19;
}

function expectedHeight(ageMonths: number, gender: ManagedChild['gender']) {
  const age = clampAge(ageMonths);
  const base = gender === 'Female' ? 84.2 : 85.1;
  return base + (age - 24) * 0.74;
}

function expectedWeightForHeight(heightCm: number, gender: ManagedChild['gender']) {
  const base = gender === 'Female' ? 8.7 : 8.9;
  return base + Math.max(0, heightCm - 80) * 0.24;
}

export function calculateWhoZScores(
  child: ManagedChild,
  measurement: { weight: number; height: number; muac: number; edema?: boolean },
): GrowthZScoreResult {
  const ageMonths = monthsFromDob(child.dob);
  const weightMean = expectedWeight(ageMonths, child.gender);
  const heightMean = expectedHeight(ageMonths, child.gender);
  const whMean = expectedWeightForHeight(measurement.height, child.gender);

  const waz = roundZ((measurement.weight - weightMean) / 1.15);
  const haz = roundZ((measurement.height - heightMean) / 3.2);
  const whz = roundZ((measurement.weight - whMean) / 1.0);

  if (measurement.edema || measurement.muac < 11.5 || waz < -3 || haz < -3 || whz < -3) {
    return {
      ageMonths,
      waz,
      haz,
      whz,
      band: 'Severe',
      reason: measurement.edema ? 'Bilateral edema or severe z-score trigger' : 'SAM threshold reached',
    };
  }

  if (measurement.muac < 12.5 || waz < -2 || haz < -2 || whz < -2) {
    return {
      ageMonths,
      waz,
      haz,
      whz,
      band: 'Moderate',
      reason: 'MAM threshold reached',
    };
  }

  return {
    ageMonths,
    waz,
    haz,
    whz,
    band: 'Normal',
    reason: 'Within normal frontend reference band',
  };
}
