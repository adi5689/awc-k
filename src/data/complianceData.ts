import { mockAWCs } from './mockData';

export type TrainingProgress = {
  workerName: string;
  awcName: string;
  completion: number;
  quizScore: number;
  certificate: 'Issued' | 'Pending';
};

export const initialTrainingCurriculum = [
  { dayRange: 'Days 1-5', title: 'Tablet basics and Odia AWW dashboard use', offlineReady: true, quiz: 'Device readiness' },
  { dayRange: 'Days 6-10', title: 'Attendance, child registration, and absence follow-up', offlineReady: true, quiz: 'Daily service flow' },
  { dayRange: 'Days 11-15', title: 'POSHAN growth entry, WHO z-score review, and referral flags', offlineReady: true, quiz: 'Nutrition risk handling' },
  { dayRange: 'Days 16-20', title: 'Adaptive learning sessions, Arunima modules, and VR safety', offlineReady: true, quiz: 'Learning facilitation' },
  { dayRange: 'Days 21-25', title: 'Offline sync, conflict review, and help-desk escalation', offlineReady: true, quiz: 'Connectivity and sync' },
  { dayRange: 'Days 26-30', title: 'Reports, parent communication, and supervisor review prep', offlineReady: true, quiz: 'Reporting readiness' },
];

export const refresherEvents = [
  { quarter: 'Q1', date: '2026-07-15', topic: 'POSHAN and referral refresher', attendance: 'Scheduled', certificate: 'Pending' },
  { quarter: 'Q2', date: '2026-10-16', topic: 'Adaptive learning quality review', attendance: 'Scheduled', certificate: 'Pending' },
  { quarter: 'Q3', date: '2027-01-15', topic: 'Offline data quality and conflict review', attendance: 'Scheduled', certificate: 'Pending' },
  { quarter: 'Q4', date: '2027-04-16', topic: 'District reporting and ADP evidence', attendance: 'Scheduled', certificate: 'Pending' },
  { quarter: 'Q5', date: '2027-07-15', topic: 'VR safety and classroom facilitation', attendance: 'Scheduled', certificate: 'Pending' },
  { quarter: 'Q6', date: '2027-10-15', topic: 'Security, privacy, and audit discipline', attendance: 'Scheduled', certificate: 'Pending' },
  { quarter: 'Q7', date: '2028-01-14', topic: 'Nutrition-learning combined risk actions', attendance: 'Scheduled', certificate: 'Pending' },
  { quarter: 'Q8', date: '2028-04-14', topic: 'Final handover and support continuity', attendance: 'Scheduled', certificate: 'Pending' },
];

export const trainingProgress: TrainingProgress[] = mockAWCs.slice(0, 20).map((awc, index) => ({
  workerName: awc.workerName,
  awcName: awc.name,
  completion: Math.min(100, 64 + ((index * 7) % 37)),
  quizScore: Math.min(100, 68 + ((index * 5) % 31)),
  certificate: index % 5 === 0 ? 'Pending' : 'Issued',
}));

export const odiaHelpFaq = [
  {
    q: 'ଅଫଲାଇନରେ ଉପସ୍ଥିତି କେମିତି ସେଭ୍ ହେବ?',
    a: 'ଉପସ୍ଥିତି ଟ୍ୟାପ୍ କରିଲେ ରେକର୍ଡ୍ ସ୍ଥାନୀୟ ଡିଭାଇସରେ ସେଭ୍ ହୁଏ ଏବଂ ନେଟ୍ ଆସିଲେ ସିଙ୍କ୍ କ୍ୟୁକୁ ଯାଏ.',
  },
  {
    q: 'SAM/MAM ଫ୍ଲାଗ୍ ଆସିଲେ କଣ କରିବି?',
    a: 'ଶିଶୁଙ୍କ ପ୍ରୋଫାଇଲ୍ ଖୋଲନ୍ତୁ, ରିଫେରାଲ୍ ସ୍ଥିତି ଅପଡେଟ୍ କରନ୍ତୁ, ଏବଂ ପୋଷଣ ଫଲୋ-ଅପ୍ ଲେଖନ୍ତୁ.',
  },
  {
    q: 'VR ସେସନ୍ ଆରମ୍ଭ କରିବା ପୂର୍ବରୁ କଣ ଯାଞ୍ଚ କରିବି?',
    a: 'ମଡ୍ୟୁଲ୍ ଅଫଲାଇନ୍ କ୍ୟାଶ୍ ଅଛି କି, ଶିଶୁ-ସୁରକ୍ଷିତ ହେଡସେଟ୍ ଚାର୍ଜ୍ ଅଛି କି, ଏବଂ ସମୟ-ଲଗ୍ ଚାଲୁ ଅଛି କି ଦେଖନ୍ତୁ.',
  },
];

export const tribalAudioMaterials = [
  { language: 'Kondh', module: 'Daily attendance instruction', format: 'Audio', offlineReady: true },
  { language: 'Kondh', module: 'Handwashing and meal instruction', format: 'Audio', offlineReady: true },
  { language: 'Gondi', module: 'VR safety introduction', format: 'Audio', offlineReady: true },
  { language: 'Gondi', module: 'Parent counselling prompt', format: 'Audio', offlineReady: true },
];

export const systemMonitoringRows = mockAWCs.slice(0, 20).map((awc, index) => {
  const uptime = awc.syncStatus === 'error' ? 91 + (index % 3) : awc.syncStatus === 'pending' ? 95 + (index % 2) : 98 + (index % 2);
  return {
    awcId: awc.id,
    awcName: awc.name,
    deviceId: `TAB-KLD-${String(index + 1).padStart(3, '0')}`,
    simNumber: `SIM-707-${String(index + 1).padStart(3, '0')}`,
    mdmStatus: 'Enrolled',
    kioskMode: 'Enabled',
    uptime,
    syncStatus: awc.syncStatus,
    pendingRecords: awc.syncStatus === 'synced' ? 0 : awc.syncStatus === 'pending' ? 8 + index : 24 + index,
    lastSyncTime: awc.lastSyncTime,
    cachePack: index % 4 === 0 ? 'Needs refresh' : 'Ready',
    otaVersion: index % 6 === 0 ? 'Staged rollback available' : 'v1.4.2 active',
    deviceHealth: awc.syncStatus === 'error' ? 'Attention' : 'Healthy',
  };
});

export const adminEvidenceItems = [
  { area: 'Data at rest', evidence: 'AES-256 policy banner and encrypted local-store marker surfaced for every device', status: 'Frontend evidence ready' },
  { area: 'Data in transit', evidence: 'TLS 1.2+ API contract checklist exposed for deployment review', status: 'Frontend evidence ready' },
  { area: 'Immutable audit log', evidence: 'Append-only UI timeline for data changes, sync retries, OTA staging, and export actions', status: 'Frontend evidence ready' },
  { area: 'OTA update', evidence: 'Staged version, active version, rollback action, and release notes visible per AWC device', status: 'Frontend evidence ready' },
  { area: 'Support SLA', evidence: 'Kalahandi HQ on-site support and 2-year patch SLA tracked in admin console', status: 'Frontend evidence ready' },
];

export const integrationRows = [
  { name: 'POSHAN Abhiyaan export', mode: 'CSV/API-ready', frequency: 'On demand', status: 'Mapped' },
  { name: 'ICDS-CAS / Health referral push', mode: 'Referral CSV + email-ready handoff', frequency: 'High-risk event', status: 'Mapped' },
  { name: 'MDM enrollment', mode: 'Google/Microsoft MDM evidence fields', frequency: 'Device lifecycle', status: 'Mapped' },
  { name: 'CCTV console', mode: 'IP camera retention register', frequency: '30-day retention review', status: 'Tracked' },
  { name: 'Supervisor virtual visit', mode: 'Web camera / video call link status', frequency: 'As needed', status: 'Tracked' },
  { name: 'NITI Aayog ADP report', mode: 'Monthly and quarterly templates', frequency: 'Monthly/Quarterly', status: 'Mapped' },
];

export const smartPanelReadiness = [
  { item: '55-56 inch smart panel mirroring', method: 'HDMI/USB and wireless mirror instruction card', status: 'Ready' },
  { item: 'No separate app install', method: 'Tablet browser full-screen launch path', status: 'Ready' },
  { item: 'Offline content cache size', method: 'Learning pack size summary under 64GB tablet spec', status: 'Ready' },
  { item: 'Child-safe VR launcher', method: 'Tablet starts session and records time-on-task', status: 'Ready' },
];
