export type OpsStatus = 'active' | 'pending' | 'warning' | 'critical' | 'inactive' | 'completed' | 'draft' | 'review';

export type CenterOpsRow = {
  id: string;
  name: string;
  district: string;
  block: string;
  panchayat: string;
  address: string;
  workerName: string;
  workerPhone: string;
  supervisorName: string;
  supervisorPhone: string;
  loginStatus: OpsStatus;
  lastActive: string;
  performanceScore: number;
  childrenTracked: number;
  pregnantWomenTracked: number;
  lactatingMothersTracked: number;
  samCases: number;
  mamCases: number;
  attendanceUpdates: string;
  learningCompletion: number;
  activityCompletion: number;
  nutritionRisk: 'Low' | 'Medium' | 'High';
  reportStatus: 'Submitted' | 'Pending' | 'Review';
  currentStatus: 'On Track' | 'Attention Needed' | 'Escalated';
};

export type OfficialRow = {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  district: string;
  block: string;
  accessLevel: string;
  loginStatus: OpsStatus;
  lastActive: string;
};

export type ModuleRow = {
  id: string;
  title: string;
  targetRole: 'Worker' | 'Supervisor' | 'Both';
  category: string;
  language: string;
  status: 'Published' | 'Draft' | 'Archived';
  completionRate: number;
  lastUpdated: string;
  duration: string;
  assessmentEnabled: boolean;
};

export type ActivityRow = {
  id: string;
  name: string;
  ageGroup: string;
  category: 'Nutrition' | 'Education' | 'Health';
  materials: string;
  status: 'Published' | 'Draft' | 'Review';
  lastUpdated: string;
  targetRole: 'Worker' | 'Supervisor' | 'Both';
};

export type UploadRow = {
  id: string;
  fileName: string;
  uploadedBy: string;
  uploadDate: string;
  monthYear: string;
  records: number;
  processingStatus: 'Validated' | 'Processing' | 'Failed' | 'Completed';
  predictionStatus: 'Queued' | 'Generated' | 'Needs Review';
};

export type PredictionRow = {
  id: string;
  uploadId: string;
  predictionDate: string;
  centersAnalyzed: number;
  highRiskCenters: number;
  mediumRiskCenters: number;
  lowRiskCenters: number;
  confidence: number;
  status: 'Completed' | 'Processing' | 'Review';
  district: string;
  block: string;
  center: string;
  month: string;
  riskLevel: 'High' | 'Medium' | 'Low';
};

export type LearningDetailRow = {
  centerName: string;
  workerName: string;
  supervisorName: string;
  modulesAssigned: number;
  modulesCompleted: number;
  completionPercentage: number;
  lastLearningActivity: string;
  assessmentScore: number;
  status: 'On Track' | 'Delayed' | 'Excellent';
};

export type ReportRow = {
  id: string;
  centerName: string;
  month: string;
  submittedBy: string;
  submissionDate: string;
  status: 'Submitted' | 'Pending' | 'Approved' | 'Review';
  nutritionSummary: string;
  learningSummary: string;
  activitySummary: string;
};

export type AlertDetailRow = {
  id: string;
  center: string;
  centerBlock: string;
  alertType: 'High Risk' | 'Pending Action' | 'Missed Update';
  issue: string;
  severity: 'High' | 'Medium' | 'Low';
  daysOpen: number;
  owner: string;
  recommendedAction: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  updated: string;
};

export type AuditLogRow = {
  id: string;
  action: string;
  performedBy: string;
  target: string;
  timestamp: string;
  category: 'User Management' | 'Content' | 'Data Upload' | 'Settings' | 'Report';
};

export type NotificationSetting = {
  id: string;
  event: string;
  channel: 'SMS' | 'Email' | 'App' | 'Both';
  enabled: boolean;
  recipients: string;
};

// ─── ADMIN SUMMARY CARDS ─────────────────────────────────────────────────────

export const adminSummaryCards = [
  { label: 'Total Centers', value: '186', trend: '+8 this quarter' },
  { label: 'Total Workers', value: '186', trend: '96% accounts active' },
  { label: 'Total Supervisors', value: '28', trend: '3 vacancies open' },
  { label: 'Total Officials', value: '14', trend: 'All districts covered' },
  { label: 'Total Children Tracked', value: '5,482', trend: '+142 this month' },
  { label: 'Pregnant Women Tracked', value: '812', trend: '91% monthly updated' },
  { label: 'Lactating Mothers Tracked', value: '637', trend: '87% monthly updated' },
  { label: 'Centers Requiring Attention', value: '19', trend: '7 high priority' },
];

// ─── CENTER ROWS ─────────────────────────────────────────────────────────────

export const centerRows: CenterOpsRow[] = [
  {
    id: 'AWC-1024',
    name: 'Padmapur Sector AWC',
    district: 'Kalahandi',
    block: 'Bhawanipatna',
    panchayat: 'Padmapur',
    address: 'Ward 4, Padmapur',
    workerName: 'Sunita Devi',
    workerPhone: '9876543210',
    supervisorName: 'Rajesh Kumar',
    supervisorPhone: '9876500111',
    loginStatus: 'active',
    lastActive: '2 hours ago',
    performanceScore: 91,
    childrenTracked: 42,
    pregnantWomenTracked: 7,
    lactatingMothersTracked: 6,
    samCases: 1,
    mamCases: 4,
    attendanceUpdates: '26/26 days',
    learningCompletion: 88,
    activityCompletion: 84,
    nutritionRisk: 'Low',
    reportStatus: 'Submitted',
    currentStatus: 'On Track',
  },
  {
    id: 'AWC-1058',
    name: 'Kanjiaguda Nutrition Centre',
    district: 'Kalahandi',
    block: 'Junagarh',
    panchayat: 'Kanjiaguda',
    address: 'Near PHC road',
    workerName: 'Geeta Kumari',
    workerPhone: '9876543222',
    supervisorName: 'Mohan Sahu',
    supervisorPhone: '9876500222',
    loginStatus: 'warning',
    lastActive: '1 day ago',
    performanceScore: 63,
    childrenTracked: 36,
    pregnantWomenTracked: 5,
    lactatingMothersTracked: 4,
    samCases: 3,
    mamCases: 6,
    attendanceUpdates: '21/26 days',
    learningCompletion: 61,
    activityCompletion: 58,
    nutritionRisk: 'High',
    reportStatus: 'Review',
    currentStatus: 'Attention Needed',
  },
  {
    id: 'AWC-1099',
    name: 'Thuamul Rampur AWC 3',
    district: 'Kalahandi',
    block: 'Thuamul Rampur',
    panchayat: 'Mendraguda',
    address: 'Hill access road',
    workerName: 'Basanti Sahu',
    workerPhone: '9876543333',
    supervisorName: 'Nandini Das',
    supervisorPhone: '9876500333',
    loginStatus: 'pending',
    lastActive: '3 days ago',
    performanceScore: 54,
    childrenTracked: 31,
    pregnantWomenTracked: 6,
    lactatingMothersTracked: 5,
    samCases: 4,
    mamCases: 8,
    attendanceUpdates: '18/26 days',
    learningCompletion: 49,
    activityCompletion: 46,
    nutritionRisk: 'High',
    reportStatus: 'Pending',
    currentStatus: 'Escalated',
  },
  {
    id: 'AWC-1110',
    name: 'Kesinga Ward AWC',
    district: 'Kalahandi',
    block: 'Kesinga',
    panchayat: 'Kesinga Ward 2',
    address: 'Station road',
    workerName: 'Mamata Patra',
    workerPhone: '9876543444',
    supervisorName: 'Arvind Nayak',
    supervisorPhone: '9876500444',
    loginStatus: 'active',
    lastActive: '35 minutes ago',
    performanceScore: 86,
    childrenTracked: 47,
    pregnantWomenTracked: 8,
    lactatingMothersTracked: 6,
    samCases: 0,
    mamCases: 3,
    attendanceUpdates: '25/26 days',
    learningCompletion: 81,
    activityCompletion: 79,
    nutritionRisk: 'Medium',
    reportStatus: 'Submitted',
    currentStatus: 'On Track',
  },
  {
    id: 'AWC-1138',
    name: 'Dharamgarh Tribal AWC',
    district: 'Kalahandi',
    block: 'Dharamgarh',
    panchayat: 'Dharamgarh',
    address: 'School campus',
    workerName: 'Laxmi Nayak',
    workerPhone: '9876543555',
    supervisorName: 'Sushil Rana',
    supervisorPhone: '9876500555',
    loginStatus: 'inactive',
    lastActive: '6 days ago',
    performanceScore: 58,
    childrenTracked: 34,
    pregnantWomenTracked: 4,
    lactatingMothersTracked: 5,
    samCases: 2,
    mamCases: 7,
    attendanceUpdates: '20/26 days',
    learningCompletion: 55,
    activityCompletion: 52,
    nutritionRisk: 'High',
    reportStatus: 'Review',
    currentStatus: 'Attention Needed',
  },
  {
    id: 'AWC-1152',
    name: 'Narla Integrated AWC',
    district: 'Kalahandi',
    block: 'Narla',
    panchayat: 'Narla Village',
    address: 'Gram Panchayat road',
    workerName: 'Priya Singh',
    workerPhone: '9876543666',
    supervisorName: 'Dinesh Patel',
    supervisorPhone: '9876500666',
    loginStatus: 'active',
    lastActive: '4 hours ago',
    performanceScore: 78,
    childrenTracked: 38,
    pregnantWomenTracked: 6,
    lactatingMothersTracked: 7,
    samCases: 1,
    mamCases: 5,
    attendanceUpdates: '24/26 days',
    learningCompletion: 74,
    activityCompletion: 71,
    nutritionRisk: 'Medium',
    reportStatus: 'Submitted',
    currentStatus: 'On Track',
  },
  {
    id: 'AWC-1179',
    name: 'Komna Block AWC 7',
    district: 'Nuapada',
    block: 'Komna',
    panchayat: 'Sinapali',
    address: 'Near primary school',
    workerName: 'Rina Majhi',
    workerPhone: '9876543777',
    supervisorName: 'Bishnu Nayak',
    supervisorPhone: '9876500777',
    loginStatus: 'active',
    lastActive: '1 hour ago',
    performanceScore: 82,
    childrenTracked: 44,
    pregnantWomenTracked: 9,
    lactatingMothersTracked: 8,
    samCases: 0,
    mamCases: 4,
    attendanceUpdates: '25/26 days',
    learningCompletion: 79,
    activityCompletion: 76,
    nutritionRisk: 'Low',
    reportStatus: 'Submitted',
    currentStatus: 'On Track',
  },
  {
    id: 'AWC-1203',
    name: 'Sinapali Hill AWC',
    district: 'Nuapada',
    block: 'Sinapali',
    panchayat: 'Sinapali GP',
    address: 'Community hall compound',
    workerName: 'Kamala Devi',
    workerPhone: '9876543888',
    supervisorName: 'Ravi Sharma',
    supervisorPhone: '9876500888',
    loginStatus: 'warning',
    lastActive: '2 days ago',
    performanceScore: 67,
    childrenTracked: 29,
    pregnantWomenTracked: 5,
    lactatingMothersTracked: 4,
    samCases: 2,
    mamCases: 5,
    attendanceUpdates: '22/26 days',
    learningCompletion: 63,
    activityCompletion: 60,
    nutritionRisk: 'Medium',
    reportStatus: 'Review',
    currentStatus: 'Attention Needed',
  },
];

// ─── OFFICIAL ROWS ────────────────────────────────────────────────────────────

export const officialRows: OfficialRow[] = [
  {
    id: 'OFF-201',
    name: 'Dr. Anita Patel',
    designation: 'District Programme Officer',
    department: 'ICDS',
    phone: '9437001101',
    email: 'anita.patel@odisha.gov.in',
    district: 'Kalahandi',
    block: 'All Blocks',
    accessLevel: 'District Oversight',
    loginStatus: 'active',
    lastActive: '10 minutes ago',
  },
  {
    id: 'OFF-218',
    name: 'Sanjay Pradhan',
    designation: 'CDPO',
    department: 'Women & Child Development',
    phone: '9437001102',
    email: 'sanjay.pradhan@odisha.gov.in',
    district: 'Kalahandi',
    block: 'Bhawanipatna',
    accessLevel: 'Block Monitoring',
    loginStatus: 'active',
    lastActive: '1 hour ago',
  },
  {
    id: 'OFF-224',
    name: 'Ritika Mishra',
    designation: 'Monitoring Officer',
    department: 'Health & Nutrition',
    phone: '9437001103',
    email: 'ritika.mishra@odisha.gov.in',
    district: 'Kalahandi',
    block: 'Dharamgarh',
    accessLevel: 'Forecast Review',
    loginStatus: 'warning',
    lastActive: '2 days ago',
  },
  {
    id: 'OFF-233',
    name: 'Prabhat Naik',
    designation: 'Data Review Officer',
    department: 'District Data Cell',
    phone: '9437001104',
    email: 'prabhat.naik@odisha.gov.in',
    district: 'Nuapada',
    block: 'Komna',
    accessLevel: 'Reports Review',
    loginStatus: 'pending',
    lastActive: 'Never logged in',
  },
  {
    id: 'OFF-241',
    name: 'Surekha Tripathy',
    designation: 'Assistant Programme Officer',
    department: 'Social Welfare',
    phone: '9437001105',
    email: 'surekha.tripathy@odisha.gov.in',
    district: 'Nuapada',
    block: 'Sinapali',
    accessLevel: 'Block Monitoring',
    loginStatus: 'active',
    lastActive: '3 hours ago',
  },
  {
    id: 'OFF-256',
    name: 'Hemanta Rout',
    designation: 'Nutrition Officer',
    department: 'ICDS',
    phone: '9437001106',
    email: 'hemanta.rout@odisha.gov.in',
    district: 'Kalahandi',
    block: 'Junagarh',
    accessLevel: 'Forecast Review',
    loginStatus: 'inactive',
    lastActive: '8 days ago',
  },
];

// ─── MODULE ROWS ──────────────────────────────────────────────────────────────

export const moduleRows: ModuleRow[] = [
  { id: 'MOD-11', title: 'Growth Monitoring Basics', targetRole: 'Worker', category: 'Nutrition', language: 'Odia', status: 'Published', completionRate: 92, lastUpdated: '12 Jun 2026', duration: '18 min', assessmentEnabled: true },
  { id: 'MOD-14', title: 'Supervisor Visit Checklist', targetRole: 'Supervisor', category: 'Monitoring', language: 'English', status: 'Published', completionRate: 84, lastUpdated: '09 Jun 2026', duration: '14 min', assessmentEnabled: true },
  { id: 'MOD-18', title: 'THR Distribution Workflow', targetRole: 'Both', category: 'Operations', language: 'Odia', status: 'Draft', completionRate: 0, lastUpdated: '15 Jun 2026', duration: '10 min', assessmentEnabled: false },
  { id: 'MOD-21', title: 'Referral Escalation for SAM', targetRole: 'Both', category: 'Nutrition', language: 'Hindi', status: 'Published', completionRate: 67, lastUpdated: '05 Jun 2026', duration: '22 min', assessmentEnabled: true },
  { id: 'MOD-25', title: 'MUAC Measurement Technique', targetRole: 'Worker', category: 'Nutrition', language: 'Odia', status: 'Published', completionRate: 88, lastUpdated: '01 Jun 2026', duration: '12 min', assessmentEnabled: true },
  { id: 'MOD-28', title: 'Community Mobilisation Handbook', targetRole: 'Both', category: 'Community', language: 'English', status: 'Draft', completionRate: 0, lastUpdated: '14 Jun 2026', duration: '30 min', assessmentEnabled: false },
  { id: 'MOD-31', title: 'Immunisation Schedule Review', targetRole: 'Supervisor', category: 'Health', language: 'Hindi', status: 'Published', completionRate: 76, lastUpdated: '03 Jun 2026', duration: '16 min', assessmentEnabled: true },
];

// ─── ACTIVITY ROWS ────────────────────────────────────────────────────────────

export const activityRows: ActivityRow[] = [
  { id: 'ACT-31', name: 'Color Grain Sorting', ageGroup: '3-4 years', category: 'Education', materials: 'Millets, bowls, cards', status: 'Published', lastUpdated: '11 Jun 2026', targetRole: 'Worker' },
  { id: 'ACT-32', name: 'Healthy Plate Circle Time', ageGroup: '4-5 years', category: 'Nutrition', materials: 'Food cards, chart', status: 'Published', lastUpdated: '10 Jun 2026', targetRole: 'Both' },
  { id: 'ACT-33', name: 'Handwashing Relay', ageGroup: '5-6 years', category: 'Health', materials: 'Soap, mug, poster', status: 'Review', lastUpdated: '14 Jun 2026', targetRole: 'Worker' },
  { id: 'ACT-34', name: 'Kitchen Garden Observation', ageGroup: '4-6 years', category: 'Nutrition', materials: 'Plant labels, notebooks', status: 'Draft', lastUpdated: '15 Jun 2026', targetRole: 'Supervisor' },
  { id: 'ACT-35', name: 'Story Time — Food Groups', ageGroup: '3-5 years', category: 'Education', materials: 'Story cards, puppets', status: 'Published', lastUpdated: '08 Jun 2026', targetRole: 'Worker' },
  { id: 'ACT-36', name: 'Pulse Count Activity', ageGroup: '5-6 years', category: 'Health', materials: 'Chart paper, crayons', status: 'Published', lastUpdated: '06 Jun 2026', targetRole: 'Both' },
  { id: 'ACT-37', name: 'Mother Group Nutrition Demo', ageGroup: 'Adults', category: 'Nutrition', materials: 'Food samples, recipe cards', status: 'Draft', lastUpdated: '13 Jun 2026', targetRole: 'Supervisor' },
];

// ─── UPLOAD ROWS ──────────────────────────────────────────────────────────────

export const uploadRows: UploadRow[] = [
  { id: 'UP-9001', fileName: 'poshan-june-2026.xlsx', uploadedBy: 'District Admin', uploadDate: '15 Jun 2026, 10:22 AM', monthYear: 'June 2026', records: 5482, processingStatus: 'Completed', predictionStatus: 'Generated' },
  { id: 'UP-8960', fileName: 'poshan-may-2026.xlsx', uploadedBy: 'District Admin', uploadDate: '16 May 2026, 09:10 AM', monthYear: 'May 2026', records: 5398, processingStatus: 'Completed', predictionStatus: 'Generated' },
  { id: 'UP-8914', fileName: 'poshan-april-2026.xlsx', uploadedBy: 'Admin Analyst', uploadDate: '15 Apr 2026, 03:40 PM', monthYear: 'April 2026', records: 5310, processingStatus: 'Validated', predictionStatus: 'Needs Review' },
];

export const poshanPreviewRows = [
  { center: 'AWC-1024', beneficiary: 'Child - Ananya Das', muac: '14.1 cm', weight: '11.2 kg', height: '88 cm', status: 'Normal' },
  { center: 'AWC-1024', beneficiary: 'Child - Ritu Sahu', muac: '11.3 cm', weight: '8.4 kg', height: '80 cm', status: 'SAM' },
  { center: 'AWC-1058', beneficiary: 'Child - Mohan Singh', muac: '12.8 cm', weight: '9.6 kg', height: '84 cm', status: 'MAM' },
  { center: 'AWC-1099', beneficiary: 'Child - Rekha Devi', muac: '13.5 cm', weight: '10.1 kg', height: '86 cm', status: 'Normal' },
  { center: 'AWC-1110', beneficiary: 'Child - Sonu Kumar', muac: '11.0 cm', weight: '8.0 kg', height: '79 cm', status: 'SAM' },
];

// ─── PREDICTION ROWS ──────────────────────────────────────────────────────────

export const predictionRows: PredictionRow[] = [
  { id: 'PB-6001', uploadId: 'UP-9001', predictionDate: '15 Jun 2026', centersAnalyzed: 186, highRiskCenters: 19, mediumRiskCenters: 44, lowRiskCenters: 123, confidence: 93, status: 'Completed', district: 'Kalahandi', block: 'Bhawanipatna', center: 'Padmapur Sector AWC', month: 'June 2026', riskLevel: 'Low' },
  { id: 'PB-6002', uploadId: 'UP-9001', predictionDate: '15 Jun 2026', centersAnalyzed: 186, highRiskCenters: 19, mediumRiskCenters: 44, lowRiskCenters: 123, confidence: 90, status: 'Completed', district: 'Kalahandi', block: 'Dharamgarh', center: 'Dharamgarh Tribal AWC', month: 'June 2026', riskLevel: 'High' },
  { id: 'PB-5950', uploadId: 'UP-8960', predictionDate: '16 May 2026', centersAnalyzed: 182, highRiskCenters: 22, mediumRiskCenters: 49, lowRiskCenters: 111, confidence: 91, status: 'Review', district: 'Kalahandi', block: 'Junagarh', center: 'Kanjiaguda Nutrition Centre', month: 'May 2026', riskLevel: 'High' },
  { id: 'PB-5892', uploadId: 'UP-8914', predictionDate: '15 Apr 2026', centersAnalyzed: 179, highRiskCenters: 24, mediumRiskCenters: 51, lowRiskCenters: 104, confidence: 88, status: 'Completed', district: 'Nuapada', block: 'Komna', center: 'Komna Central AWC', month: 'April 2026', riskLevel: 'Medium' },
];

// ─── LEARNING DETAIL ROWS ─────────────────────────────────────────────────────

export const learningDetailRows: LearningDetailRow[] = [
  { centerName: 'Padmapur Sector AWC', workerName: 'Sunita Devi', supervisorName: 'Rajesh Kumar', modulesAssigned: 12, modulesCompleted: 11, completionPercentage: 92, lastLearningActivity: 'Growth Monitoring Basics', assessmentScore: 88, status: 'Excellent' },
  { centerName: 'Kanjiaguda Nutrition Centre', workerName: 'Geeta Kumari', supervisorName: 'Mohan Sahu', modulesAssigned: 12, modulesCompleted: 7, completionPercentage: 58, lastLearningActivity: 'THR Distribution Workflow', assessmentScore: 64, status: 'Delayed' },
  { centerName: 'Kesinga Ward AWC', workerName: 'Mamata Patra', supervisorName: 'Arvind Nayak', modulesAssigned: 12, modulesCompleted: 10, completionPercentage: 83, lastLearningActivity: 'Supervisor Visit Checklist', assessmentScore: 81, status: 'On Track' },
  { centerName: 'Narla Integrated AWC', workerName: 'Priya Singh', supervisorName: 'Dinesh Patel', modulesAssigned: 12, modulesCompleted: 9, completionPercentage: 75, lastLearningActivity: 'MUAC Measurement Technique', assessmentScore: 79, status: 'On Track' },
  { centerName: 'Komna Block AWC 7', workerName: 'Rina Majhi', supervisorName: 'Bishnu Nayak', modulesAssigned: 12, modulesCompleted: 8, completionPercentage: 67, lastLearningActivity: 'Referral Escalation for SAM', assessmentScore: 72, status: 'On Track' },
];

// ─── REPORT ROWS ──────────────────────────────────────────────────────────────

export const reportRows: ReportRow[] = [
  { id: 'RPT-4201', centerName: 'Padmapur Sector AWC', month: 'June 2026', submittedBy: 'Sunita Devi', submissionDate: '14 Jun 2026', status: 'Approved', nutritionSummary: '1 SAM, 4 MAM, 91% growth updates', learningSummary: '88% module completion', activitySummary: '21 activities completed' },
  { id: 'RPT-4202', centerName: 'Kanjiaguda Nutrition Centre', month: 'June 2026', submittedBy: 'Geeta Kumari', submissionDate: '13 Jun 2026', status: 'Review', nutritionSummary: '3 SAM, 6 MAM, low MUAC trend', learningSummary: '58% module completion', activitySummary: '14 activities completed' },
  { id: 'RPT-4203', centerName: 'Thuamul Rampur AWC 3', month: 'June 2026', submittedBy: 'Basanti Sahu', submissionDate: '-', status: 'Pending', nutritionSummary: 'Awaiting report', learningSummary: '49% completion', activitySummary: 'Pending update' },
  { id: 'RPT-4204', centerName: 'Kesinga Ward AWC', month: 'June 2026', submittedBy: 'Mamata Patra', submissionDate: '12 Jun 2026', status: 'Approved', nutritionSummary: '0 SAM, 3 MAM, 86% growth updates', learningSummary: '81% module completion', activitySummary: '19 activities completed' },
  { id: 'RPT-4205', centerName: 'Narla Integrated AWC', month: 'June 2026', submittedBy: 'Priya Singh', submissionDate: '15 Jun 2026', status: 'Submitted', nutritionSummary: '1 SAM, 5 MAM, 82% growth updates', learningSummary: '74% module completion', activitySummary: '17 activities completed' },
  { id: 'RPT-4206', centerName: 'Dharamgarh Tribal AWC', month: 'June 2026', submittedBy: 'Laxmi Nayak', submissionDate: '11 Jun 2026', status: 'Review', nutritionSummary: '2 SAM, 7 MAM, attendance gap noted', learningSummary: '55% module completion', activitySummary: '13 activities completed' },
];

// ─── ALERT DETAIL ROWS ────────────────────────────────────────────────────────

export const alertDetailRows: AlertDetailRow[] = [
  {
    id: 'ALT-001',
    center: 'Dharamgarh Tribal AWC',
    centerBlock: 'Dharamgarh',
    alertType: 'High Risk',
    issue: 'High SAM forecast with declining MUAC trend for 3 consecutive weeks',
    severity: 'High',
    daysOpen: 6,
    owner: 'Block Officer',
    recommendedAction: 'Schedule immediate supervisor visit and refer SAM cases to NRC',
    status: 'Open',
    updated: '15 Jun 2026',
  },
  {
    id: 'ALT-002',
    center: 'Thuamul Rampur AWC 3',
    centerBlock: 'Thuamul Rampur',
    alertType: 'Pending Action',
    issue: 'Monthly report pending — attendance below 70% for second consecutive month',
    severity: 'High',
    daysOpen: 3,
    owner: 'Supervisor',
    recommendedAction: 'Contact worker immediately and complete report before cycle close',
    status: 'In Progress',
    updated: '14 Jun 2026',
  },
  {
    id: 'ALT-003',
    center: 'Kanjiaguda Nutrition Centre',
    centerBlock: 'Junagarh',
    alertType: 'High Risk',
    issue: 'Learning completion slipped below 60% — SAM risk compounded by training gap',
    severity: 'Medium',
    daysOpen: 4,
    owner: 'Training Cell',
    recommendedAction: 'Assign refresher modules and verify SAM escalation training',
    status: 'Open',
    updated: '13 Jun 2026',
  },
  {
    id: 'ALT-004',
    center: 'Kesinga Ward AWC',
    centerBlock: 'Kesinga',
    alertType: 'Missed Update',
    issue: 'Forecast confidence dipped below 80% due to missing MUAC values in upload',
    severity: 'Medium',
    daysOpen: 2,
    owner: 'Data Officer',
    recommendedAction: 'Request corrected MUAC measurements from field worker',
    status: 'In Progress',
    updated: '12 Jun 2026',
  },
  {
    id: 'ALT-005',
    center: 'Sinapali Hill AWC',
    centerBlock: 'Sinapali',
    alertType: 'Missed Update',
    issue: 'No sync event recorded in last 48 hours — offline status unconfirmed',
    severity: 'Medium',
    daysOpen: 2,
    owner: 'Block Officer',
    recommendedAction: 'Verify mobile connectivity and prompt worker to sync',
    status: 'Open',
    updated: '14 Jun 2026',
  },
  {
    id: 'ALT-006',
    center: 'Narla Integrated AWC',
    centerBlock: 'Narla',
    alertType: 'Pending Action',
    issue: 'Supervisor visit overdue — last recorded visit was 18 days ago',
    severity: 'Low',
    daysOpen: 8,
    owner: 'Supervisor',
    recommendedAction: 'Schedule visit this week and log observation register',
    status: 'In Progress',
    updated: '10 Jun 2026',
  },
];

// ─── AUDIT LOG ROWS ───────────────────────────────────────────────────────────

export const auditLogRows: AuditLogRow[] = [
  { id: 'AUD-1041', action: 'Generated login credentials for AWC-1152', performedBy: 'System Admin', target: 'Narla Integrated AWC', timestamp: '15 Jun 2026, 11:04 AM', category: 'User Management' },
  { id: 'AUD-1040', action: 'Published module MOD-25 (MUAC Measurement Technique)', performedBy: 'Content Manager', target: 'MOD-25', timestamp: '14 Jun 2026, 03:30 PM', category: 'Content' },
  { id: 'AUD-1039', action: 'Uploaded Poshan Tracker data for June 2026', performedBy: 'District Admin', target: 'UP-9001', timestamp: '15 Jun 2026, 10:22 AM', category: 'Data Upload' },
  { id: 'AUD-1038', action: 'Reset password for OFF-224 (Ritika Mishra)', performedBy: 'System Admin', target: 'OFF-224', timestamp: '13 Jun 2026, 09:15 AM', category: 'User Management' },
  { id: 'AUD-1037', action: 'Changed upload validation mode to Strict', performedBy: 'System Admin', target: 'Platform Settings', timestamp: '12 Jun 2026, 04:00 PM', category: 'Settings' },
  { id: 'AUD-1036', action: 'Approved monthly report RPT-4201', performedBy: 'Dr. Anita Patel', target: 'RPT-4201', timestamp: '14 Jun 2026, 02:10 PM', category: 'Report' },
];

// ─── NOTIFICATION SETTINGS ────────────────────────────────────────────────────

export const notificationSettings: NotificationSetting[] = [
  { id: 'NOT-01', event: 'High risk alert generated for a center', channel: 'Both', enabled: true, recipients: 'All Officials + Admin' },
  { id: 'NOT-02', event: 'Monthly report pending after cycle close', channel: 'SMS', enabled: true, recipients: 'Assigned Supervisor + Block Officer' },
  { id: 'NOT-03', event: 'New Poshan Tracker upload completed', channel: 'Email', enabled: true, recipients: 'Admin + Data Analyst' },
  { id: 'NOT-04', event: 'AI prediction batch generated', channel: 'App', enabled: true, recipients: 'All Officials' },
  { id: 'NOT-05', event: 'Login credential created for center/official', channel: 'SMS', enabled: true, recipients: 'Account Holder' },
  { id: 'NOT-06', event: 'Learning module published or updated', channel: 'App', enabled: false, recipients: 'All Workers + Supervisors' },
];

// ─── MISC DATA ────────────────────────────────────────────────────────────────

export const recentActivities = [
  'Generated 12 new center logins for Bhawanipatna block',
  'Published updated SAM referral module in Odia',
  'Re-ran predictions for April 2026 upload after validation fixes',
  'Flagged 7 centers for missed monthly reports',
];

export const recentUploads = [
  'June 2026 Poshan tracker uploaded with 5,482 records',
  'May 2026 upload archived and prediction batch locked',
  'April 2026 upload needs 14 row corrections before closeout',
];

export const alertRows = [
  { center: 'Dharamgarh Tribal AWC', issue: 'High SAM forecast and 6-day sync gap', severity: 'High', owner: 'Block Officer', updated: '15 Jun 2026' },
  { center: 'Thuamul Rampur AWC 3', issue: 'Monthly report pending and attendance below 70%', severity: 'High', owner: 'Supervisor', updated: '14 Jun 2026' },
  { center: 'Kanjiaguda Nutrition Centre', issue: 'Learning completion slipped below 60%', severity: 'Medium', owner: 'Training Cell', updated: '13 Jun 2026' },
  { center: 'Kesinga Ward AWC', issue: 'Forecast confidence dipped due to missing MUAC values', severity: 'Medium', owner: 'Data Officer', updated: '12 Jun 2026' },
];

export const chartSeries = {
  performanceTrend: [
    { month: 'Jan', score: 68, attention: 28 },
    { month: 'Feb', score: 70, attention: 26 },
    { month: 'Mar', score: 72, attention: 24 },
    { month: 'Apr', score: 74, attention: 23 },
    { month: 'May', score: 76, attention: 21 },
    { month: 'Jun', score: 79, attention: 19 },
  ],
  nutritionRiskDistribution: [
    { name: 'Low Risk', value: 123 },
    { name: 'Medium Risk', value: 44 },
    { name: 'High Risk', value: 19 },
  ],
  uploadHistory: [
    { month: 'Jan', uploads: 1, records: 4980 },
    { month: 'Feb', uploads: 1, records: 5075 },
    { month: 'Mar', uploads: 1, records: 5212 },
    { month: 'Apr', uploads: 1, records: 5310 },
    { month: 'May', uploads: 1, records: 5398 },
    { month: 'Jun', uploads: 1, records: 5482 },
  ],
  learningCompletionOverview: [
    { name: 'Worker', completion: 84 },
    { name: 'Supervisor', completion: 76 },
    { name: 'Both Roles', completion: 69 },
  ],
  forecastTrend: [
    { month: 'Jan', high: 28, medium: 52, low: 96 },
    { month: 'Feb', high: 26, medium: 49, low: 102 },
    { month: 'Mar', high: 24, medium: 47, low: 108 },
    { month: 'Apr', high: 24, medium: 51, low: 104 },
    { month: 'May', high: 22, medium: 49, low: 111 },
    { month: 'Jun', high: 19, medium: 44, low: 123 },
  ],
  reportSubmissionTrend: [
    { month: 'Jan', submitted: 162, pending: 18 },
    { month: 'Feb', submitted: 168, pending: 15 },
    { month: 'Mar', submitted: 171, pending: 12 },
    { month: 'Apr', submitted: 173, pending: 11 },
    { month: 'May', submitted: 176, pending: 9 },
    { month: 'Jun', submitted: 178, pending: 8 },
  ],
};

export const officialDashboardCards = [
  { label: 'Total Centers Assigned', value: '54', detail: 'Across 3 monitored blocks' },
  { label: 'Active Centers', value: '48', detail: 'Synced in last 72 hours' },
  { label: 'Centers Needing Attention', value: '9', detail: 'Operational or nutrition issues' },
  { label: 'High Risk Forecast Centers', value: '7', detail: 'Immediate follow-up recommended' },
  { label: 'Monthly Reports Submitted', value: '51', detail: 'June 2026 reporting cycle' },
  { label: 'Pending Reports', value: '3', detail: 'Two due in Thuamul Rampur' },
  { label: 'Learning Completion Rate', value: '78%', detail: 'Worker + supervisor combined' },
  { label: 'Recent Alerts', value: '14', detail: '5 unresolved since last week' },
];

export const officialProfile = {
  name: 'Dr. Anita Patel',
  designation: 'District Programme Officer',
  district: 'Kalahandi',
  block: 'All Blocks',
  department: 'ICDS',
  email: 'anita.patel@odisha.gov.in',
  phone: '9437001101',
  access: 'District monitoring + report approval',
  centersMonitored: 54,
  reportsReviewed: 48,
  alertsResolved: 21,
  lastLogin: '16 Jun 2026, 09:30 AM',
  joinedDate: 'March 2024',
};
