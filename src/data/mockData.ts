// ============================================================
// SMART ANGANWADI - MOCK DATA
// Realistic Indian names and data for demo purposes
// ============================================================

import type {
  Child, AWC, Block, AIInsight, Notification, QuizQuestion,
  DistrictKPI, User, DailyActivity, QuickAssessmentRecord,
  WeeklyParentReport, MealLog, ChildDevelopmentInsight,
  ThemePlan, BadgeAward, OfflineContentPack, MonthlyTheme
} from '../types';

// ---- USERS for Login ----
export const mockUsers: Record<string, User> = {
  worker: {
    id: 'u1',
    name: 'Sunita Devi',
    role: 'worker',
    avatar: '',
    district: 'Kalahandi',
    block: 'Bhawanipatna',
    awcId: 'awc1',
  },
  supervisor: {
    id: 'u2',
    name: 'Rajesh Kumar',
    role: 'supervisor',
    avatar: '',
    district: 'Kalahandi',
    block: 'Bhawanipatna',
  },
  admin: {
    id: 'u3',
    name: 'Dr. Anita Patel',
    role: 'admin',
    avatar: '',
    district: 'Kalahandi',
  },
};

// ---- BLOCKS for Supervisor & Admin ----
export const mockBlocks: Block[] = [
  { id: 'b1', name: 'Bhawanipatna', districtId: 'd1', totalAWCs: 24, totalChildren: 720, nutritionRiskPercent: 12, avgLearningScore: 68, performance: 'Good' },
  { id: 'b2', name: 'Junagarh', districtId: 'd1', totalAWCs: 18, totalChildren: 540, nutritionRiskPercent: 22, avgLearningScore: 55, performance: 'Average' },
  { id: 'b3', name: 'Kesinga', districtId: 'd1', totalAWCs: 30, totalChildren: 900, nutritionRiskPercent: 8, avgLearningScore: 74, performance: 'Good' },
  { id: 'b4', name: 'Dharamgarh', districtId: 'd1', totalAWCs: 15, totalChildren: 450, nutritionRiskPercent: 35, avgLearningScore: 42, performance: 'Poor' },
  { id: 'b5', name: 'Lanjigarh', districtId: 'd1', totalAWCs: 20, totalChildren: 600, nutritionRiskPercent: 18, avgLearningScore: 61, performance: 'Average' },
  { id: 'b6', name: 'Narla', districtId: 'd1', totalAWCs: 22, totalChildren: 660, nutritionRiskPercent: 10, avgLearningScore: 72, performance: 'Good' },
  { id: 'b7', name: 'Karlamunda', districtId: 'd1', totalAWCs: 12, totalChildren: 360, nutritionRiskPercent: 28, avgLearningScore: 48, performance: 'Poor' },
  { id: 'b8', name: 'Thuamul Rampur', districtId: 'd1', totalAWCs: 16, totalChildren: 480, nutritionRiskPercent: 15, avgLearningScore: 65, performance: 'Average' },
];

// ---- AWCs for Supervisor view ----
export const mockAWCs: AWC[] = [
  {
    id: 'awc1', name: 'AWC Padmapur-1', workerName: 'Sunita Devi', workerPhone: '9876543210',
    location: 'Padmapur Village', gpId: 'gp1', blockId: 'b1',
    totalChildren: 35, presentToday: 32, criticalCases: 1,
    status: 'Good', alerts: [],
    avgLearningScore: 72, nutritionBreakdown: { normal: 30, mam: 4, sam: 1 },
    attendanceRate: 91, lastSyncTime: new Date(Date.now() - 300000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc2', name: 'AWC Kanjiaguda-2', workerName: 'Geeta Kumari', workerPhone: '9876543211',
    location: 'Kanjiaguda Village', gpId: 'gp1', blockId: 'b1',
    totalChildren: 28, presentToday: 14, criticalCases: 4,
    status: 'Critical', alerts: ['Low attendance', 'High SAM cases', 'Device offline 3 days'],
    avgLearningScore: 45, nutritionBreakdown: { normal: 18, mam: 6, sam: 4 },
    attendanceRate: 50, lastSyncTime: new Date(Date.now() - 86400000 * 3).toISOString(),
    syncStatus: 'error'
  },
  {
    id: 'awc3', name: 'AWC Berhampur-3', workerName: 'Radha Sharma', workerPhone: '9876543212',
    location: 'Berhampur Ward-3', gpId: 'gp2', blockId: 'b1',
    totalChildren: 42, presentToday: 40, criticalCases: 0,
    status: 'Good', alerts: [],
    avgLearningScore: 82, nutritionBreakdown: { normal: 40, mam: 2, sam: 0 },
    attendanceRate: 95, lastSyncTime: new Date(Date.now() - 60000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc4', name: 'AWC Gopalpur-4', workerName: 'Priya Singh', workerPhone: '9876543213',
    location: 'Gopalpur Village', gpId: 'gp3', blockId: 'b1',
    totalChildren: 30, presentToday: 25, criticalCases: 2,
    status: 'Warning', alerts: ['2 children nutrition risk'],
    avgLearningScore: 58, nutritionBreakdown: { normal: 24, mam: 4, sam: 2 },
    attendanceRate: 83, lastSyncTime: new Date(Date.now() - 1800000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc5', name: 'AWC Hinjili-5', workerName: 'Mamata Patra', workerPhone: '9876543214',
    location: 'Hinjili Town', gpId: 'gp2', blockId: 'b1',
    totalChildren: 38, presentToday: 35, criticalCases: 1,
    status: 'Good', alerts: [],
    avgLearningScore: 75, nutritionBreakdown: { normal: 33, mam: 4, sam: 1 },
    attendanceRate: 92, lastSyncTime: new Date(Date.now() - 120000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc6', name: 'AWC Sorada-6', workerName: 'Laxmi Nayak', workerPhone: '9876543215',
    location: 'Sorada Village', gpId: 'gp3', blockId: 'b1',
    totalChildren: 25, presentToday: 18, criticalCases: 3,
    status: 'Warning', alerts: ['3 children at nutrition risk', 'Low attendance trend'],
    avgLearningScore: 52, nutritionBreakdown: { normal: 18, mam: 4, sam: 3 },
    attendanceRate: 72, lastSyncTime: new Date(Date.now() - 7200000).toISOString(),
    syncStatus: 'pending'
  },
  {
    id: 'awc7', name: 'AWC Rambha-7', workerName: 'Kalyani Behera', workerPhone: '9876543216',
    location: 'Rambha Village', gpId: 'gp4', blockId: 'b1',
    totalChildren: 31, presentToday: 29, criticalCases: 0,
    status: 'Good', alerts: [],
    avgLearningScore: 78, nutritionBreakdown: { normal: 28, mam: 3, sam: 0 },
    attendanceRate: 94, lastSyncTime: new Date(Date.now() - 420000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc8', name: 'AWC Bhawanipatna-8', workerName: 'Basanti Sahu', workerPhone: '9876543217',
    location: 'Bhawanipatna Ward-8', gpId: 'gp4', blockId: 'b1',
    totalChildren: 36, presentToday: 24, criticalCases: 2,
    status: 'Warning', alerts: ['Attendance below target', '2 immunization follow-ups due'],
    avgLearningScore: 61, nutritionBreakdown: { normal: 29, mam: 5, sam: 2 },
    attendanceRate: 67, lastSyncTime: new Date(Date.now() - 10800000).toISOString(),
    syncStatus: 'pending'
  },
  {
    id: 'awc9', name: 'AWC Narendrapur-9', workerName: 'Mina Pradhan', workerPhone: '9876543218',
    location: 'Narendrapur Village', gpId: 'gp5', blockId: 'b1',
    totalChildren: 27, presentToday: 26, criticalCases: 0,
    status: 'Good', alerts: [],
    avgLearningScore: 84, nutritionBreakdown: { normal: 26, mam: 1, sam: 0 },
    attendanceRate: 96, lastSyncTime: new Date(Date.now() - 90000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc10', name: 'AWC Purunabandha-10', workerName: 'Sabitri Nayak', workerPhone: '9876543219',
    location: 'Purunabandha Village', gpId: 'gp5', blockId: 'b1',
    totalChildren: 33, presentToday: 19, criticalCases: 5,
    status: 'Critical', alerts: ['High SAM cases', 'THR distribution gap', 'Device offline 2 days'],
    avgLearningScore: 48, nutritionBreakdown: { normal: 22, mam: 6, sam: 5 },
    attendanceRate: 58, lastSyncTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    syncStatus: 'error'
  },
  {
    id: 'awc11', name: 'AWC Keshapur-11', workerName: 'Anjali Das', workerPhone: '9876543220',
    location: 'Keshapur Village', gpId: 'gp6', blockId: 'b1',
    totalChildren: 29, presentToday: 25, criticalCases: 1,
    status: 'Good', alerts: [],
    avgLearningScore: 69, nutritionBreakdown: { normal: 25, mam: 3, sam: 1 },
    attendanceRate: 86, lastSyncTime: new Date(Date.now() - 180000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc12', name: 'AWC Jagannathpur-12', workerName: 'Bimala Panda', workerPhone: '9876543221',
    location: 'Jagannathpur Village', gpId: 'gp6', blockId: 'b1',
    totalChildren: 41, presentToday: 31, criticalCases: 2,
    status: 'Warning', alerts: ['Learning score below block target'],
    avgLearningScore: 56, nutritionBreakdown: { normal: 34, mam: 5, sam: 2 },
    attendanceRate: 76, lastSyncTime: new Date(Date.now() - 5400000).toISOString(),
    syncStatus: 'pending'
  },
  {
    id: 'awc13', name: 'AWC Palur-13', workerName: 'Saraswati Rout', workerPhone: '9876543222',
    location: 'Palur Village', gpId: 'gp7', blockId: 'b1',
    totalChildren: 24, presentToday: 23, criticalCases: 0,
    status: 'Good', alerts: [],
    avgLearningScore: 80, nutritionBreakdown: { normal: 23, mam: 1, sam: 0 },
    attendanceRate: 96, lastSyncTime: new Date(Date.now() - 240000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc14', name: 'AWC Rangeilunda-14', workerName: 'Tilottama Jena', workerPhone: '9876543223',
    location: 'Rangeilunda Village', gpId: 'gp7', blockId: 'b1',
    totalChildren: 37, presentToday: 27, criticalCases: 3,
    status: 'Warning', alerts: ['3 children at nutrition risk', 'MDD counselling needed'],
    avgLearningScore: 63, nutritionBreakdown: { normal: 28, mam: 6, sam: 3 },
    attendanceRate: 73, lastSyncTime: new Date(Date.now() - 3600000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc15', name: 'AWC Lanjipalli-15', workerName: 'Nirmala Patnaik', workerPhone: '9876543224',
    location: 'Lanjipalli Ward-15', gpId: 'gp8', blockId: 'b1',
    totalChildren: 44, presentToday: 39, criticalCases: 1,
    status: 'Good', alerts: [],
    avgLearningScore: 74, nutritionBreakdown: { normal: 39, mam: 4, sam: 1 },
    attendanceRate: 89, lastSyncTime: new Date(Date.now() - 660000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc16', name: 'AWC Khalikote-16', workerName: 'Rekha Gouda', workerPhone: '9876543225',
    location: 'Khalikote Village', gpId: 'gp8', blockId: 'b1',
    totalChildren: 32, presentToday: 16, criticalCases: 4,
    status: 'Critical', alerts: ['Attendance crisis', 'SAM verification pending', 'Supervisor visit overdue'],
    avgLearningScore: 42, nutritionBreakdown: { normal: 21, mam: 7, sam: 4 },
    attendanceRate: 50, lastSyncTime: new Date(Date.now() - 86400000 * 4).toISOString(),
    syncStatus: 'error'
  },
  {
    id: 'awc17', name: 'AWC Chamakhandi-17', workerName: 'Gouri Mishra', workerPhone: '9876543226',
    location: 'Chamakhandi Village', gpId: 'gp9', blockId: 'b1',
    totalChildren: 26, presentToday: 22, criticalCases: 1,
    status: 'Good', alerts: [],
    avgLearningScore: 71, nutritionBreakdown: { normal: 23, mam: 2, sam: 1 },
    attendanceRate: 85, lastSyncTime: new Date(Date.now() - 300000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc18', name: 'AWC Nuagaon-18', workerName: 'Puspalata Bisoyi', workerPhone: '9876543227',
    location: 'Nuagaon Village', gpId: 'gp9', blockId: 'b1',
    totalChildren: 34, presentToday: 28, criticalCases: 2,
    status: 'Warning', alerts: ['Immunization overdue list growing'],
    avgLearningScore: 66, nutritionBreakdown: { normal: 28, mam: 4, sam: 2 },
    attendanceRate: 82, lastSyncTime: new Date(Date.now() - 14400000).toISOString(),
    syncStatus: 'pending'
  },
  {
    id: 'awc19', name: 'AWC Aryapalli-19', workerName: 'Padma Kumari', workerPhone: '9876543228',
    location: 'Aryapalli Village', gpId: 'gp10', blockId: 'b1',
    totalChildren: 30, presentToday: 28, criticalCases: 0,
    status: 'Good', alerts: [],
    avgLearningScore: 77, nutritionBreakdown: { normal: 28, mam: 2, sam: 0 },
    attendanceRate: 93, lastSyncTime: new Date(Date.now() - 120000).toISOString(),
    syncStatus: 'synced'
  },
  {
    id: 'awc20', name: 'AWC Chikiti-20', workerName: 'Malati Swain', workerPhone: '9876543229',
    location: 'Chikiti Village', gpId: 'gp10', blockId: 'b1',
    totalChildren: 39, presentToday: 26, criticalCases: 3,
    status: 'Warning', alerts: ['Low attendance trend', 'THR records pending'],
    avgLearningScore: 59, nutritionBreakdown: { normal: 30, mam: 6, sam: 3 },
    attendanceRate: 67, lastSyncTime: new Date(Date.now() - 21600000).toISOString(),
    syncStatus: 'pending'
  },
];

// ---- Generate weight history ----
function generateWeightHistory(baseWeight: number, months: number = 12): { date: string; weight: number }[] {
  const history: { date: string; weight: number }[] = [];
  for (let i = months; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    history.push({
      date: date.toISOString().split('T')[0],
      weight: Math.round((baseWeight + (months - i) * 0.15 + (Math.random() - 0.3) * 0.5) * 10) / 10,
    });
  }
  return history;
}

// ---- Generate nutrition history ----
function generateNutritionHistory(status: string, months: number = 6) {
  const history: { date: string; weight: number; height: number; muac: number; status: 'Normal' | 'MAM' | 'SAM' }[] = [];
  let weight = status === 'SAM' ? 8.5 : status === 'MAM' ? 10 : 13;
  let muac = status === 'SAM' ? 105 : status === 'MAM' ? 118 : 135;
  let height = 82;

  for (let i = months; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    weight += Math.random() * 0.3;
    muac += Math.random() * 2 - 0.5;
    height += 0.8;

    let s: 'Normal' | 'MAM' | 'SAM' = 'Normal';
    if (muac < 115) s = 'SAM';
    else if (muac < 125) s = 'MAM';

    history.push({
      date: date.toISOString().split('T')[0],
      weight: Math.round(weight * 10) / 10,
      height: Math.round(height * 10) / 10,
      muac: Math.round(muac),
      status: s,
    });
  }
  return history;
}

// ---- AI Activity Suggestions by score ----
function getSuggestedActivities(score: number): string[] {
  if (score < 40) return [
    'Colour identification games',
    'Simple shape sorting',
    'Story listening sessions',
    'Finger painting activity',
    'Basic counting with beads',
  ];
  if (score <= 70) return [
    'Pattern recognition puzzles',
    'Simple word building',
    'Number matching (1-20)',
    'Drawing & colouring exercises',
    'Group singing & rhymes',
  ];
  return [
    'Story creation exercises',
    'Advanced number operations',
    'Critical thinking puzzles',
    'Leadership role-play',
    'Peer tutoring sessions',
  ];
}

// ---- AI Nutrition Alert ----
function getNutritionAlert(status: string): string | null {
  if (status === 'status.sam' || status === 'SAM') return 'insights.sam_critical_alert';
  if (status === 'status.mam' || status === 'MAM') return 'insights.mam_warning_alert';
  return null;
}

// ---- Quiz Questions Pool ----
export const quizQuestions: QuizQuestion[] = [
  // Easy (Difficulty 1-2)
  { id: 'q1', question: 'What colour is a banana?', options: ['Red', 'Yellow', 'Blue', 'Green'], correctAnswer: 1, difficulty: 1, domain: 'cognitive' },
  { id: 'q2', question: 'How many legs does a cat have?', options: ['2', '4', '6', '8'], correctAnswer: 1, difficulty: 1, domain: 'numeracy' },
  { id: 'q3', question: 'Which animal says "Moo"?', options: ['Dog', 'Cat', 'Cow', 'Bird'], correctAnswer: 2, difficulty: 1, domain: 'language' },
  { id: 'q4', question: 'Show me the circle', options: ['⬜', '🔺', '⭐', '⭕'], correctAnswer: 3, difficulty: 1, domain: 'cognitive' },
  { id: 'q5', question: 'What comes after 2?', options: ['1', '3', '4', '5'], correctAnswer: 1, difficulty: 1, domain: 'numeracy' },

  // Moderate (Difficulty 3)
  { id: 'q6', question: 'Which is bigger: elephant or ant?', options: ['Ant', 'Elephant', 'Same', 'Cannot say'], correctAnswer: 1, difficulty: 3, domain: 'cognitive' },
  { id: 'q7', question: '5 + 3 = ?', options: ['6', '7', '8', '9'], correctAnswer: 2, difficulty: 3, domain: 'numeracy' },
  { id: 'q8', question: 'Complete: The sun rises in the ___', options: ['West', 'North', 'East', 'South'], correctAnswer: 2, difficulty: 3, domain: 'language' },
  { id: 'q9', question: 'How many days in a week?', options: ['5', '6', '7', '8'], correctAnswer: 2, difficulty: 3, domain: 'numeracy' },
  { id: 'q10', question: 'Which season comes after summer?', options: ['Winter', 'Monsoon', 'Spring', 'Autumn'], correctAnswer: 1, difficulty: 3, domain: 'cognitive' },

  // Advanced (Difficulty 4-5)
  { id: 'q11', question: 'What is 12 - 7?', options: ['4', '5', '6', '3'], correctAnswer: 1, difficulty: 4, domain: 'numeracy' },
  { id: 'q12', question: 'Which word rhymes with "cat"?', options: ['Dog', 'Bat', 'Cup', 'Red'], correctAnswer: 1, difficulty: 4, domain: 'language' },
  { id: 'q13', question: 'If you mix red and yellow, you get?', options: ['Green', 'Purple', 'Orange', 'Blue'], correctAnswer: 2, difficulty: 4, domain: 'cognitive' },
  { id: 'q14', question: 'Arrange: 9, 3, 7, 1 in order', options: ['1,3,7,9', '9,7,3,1', '3,1,9,7', '7,9,1,3'], correctAnswer: 0, difficulty: 5, domain: 'numeracy' },
  { id: 'q15', question: 'Complete the pattern: AB, CD, EF, __', options: ['GH', 'FG', 'HI', 'EF'], correctAnswer: 0, difficulty: 5, domain: 'cognitive' },
];

// ---- CHILDREN (Worker view) ----
export const mockChildren: Child[] = [
  {
    id: 'c1', name: 'Aarav Sahoo', ageMonths: 48, gender: 'M',
    parentName: 'Ramesh Sahoo', village: 'Padmapur',
    nutritionStatus: 'status.normal', learningScore: 92, persona: 'data.persona.fast_learner', awcId: 'awc1',
    domainScores: { language: 85, numeracy: 78, cognitive: 84, socio_emotional: 81 },
    currentDifficulty: { language: 4, numeracy: 3, cognitive: 4, socio_emotional: 4 },
    attendanceRate: 94, lastAttendanceDate: new Date().toISOString().split('T')[0],
    weightHistory: generateWeightHistory(14), nutritionHistory: generateNutritionHistory('Normal'),
    quizResults: [
      { id: 'qr1', date: '2026-03-28', domain: 'language', score: 80, totalQuestions: 10, correctAnswers: 8, difficulty: 4, timeTaken: 420 },
      { id: 'qr2', date: '2026-03-25', domain: 'numeracy', score: 70, totalQuestions: 10, correctAnswers: 7, difficulty: 3, timeTaken: 380 },
      { id: 'qr3', date: '2026-03-20', domain: 'cognitive', score: 90, totalQuestions: 10, correctAnswers: 9, difficulty: 4, timeTaken: 300 },
    ],
    riskFlags: { learningRisk: 'Low', nutritionRisk: 'Low', combinedRisk: 'Low', flags: [] },
    suggestedActivities: getSuggestedActivities(82),
    nutritionAlert: getNutritionAlert('status.normal'),
  },
  {
    id: 'c2', name: 'Diya Mohanty', ageMonths: 36, gender: 'F',
    parentName: 'Sushma Mohanty', village: 'Padmapur',
    nutritionStatus: 'status.mam', learningScore: 78, persona: 'data.persona.visual_learner', awcId: 'awc1',
    domainScores: { language: 75, numeracy: 68, cognitive: 72, socio_emotional: 69 },
    currentDifficulty: { language: 3, numeracy: 3, cognitive: 3, socio_emotional: 3 },
    attendanceRate: 88, lastAttendanceDate: new Date().toISOString().split('T')[0],
    weightHistory: generateWeightHistory(12), nutritionHistory: generateNutritionHistory('MAM'),
    quizResults: [
      { id: 'qr4', date: '2026-03-29', domain: 'language', score: 70, totalQuestions: 10, correctAnswers: 7, difficulty: 3, timeTaken: 450 },
      { id: 'qr5', date: '2026-03-22', domain: 'numeracy', score: 60, totalQuestions: 10, correctAnswers: 6, difficulty: 3, timeTaken: 500 },
    ],
    riskFlags: { learningRisk: 'Low', nutritionRisk: 'Medium', combinedRisk: 'Medium', flags: ['status.underweight'] },
    suggestedActivities: getSuggestedActivities(78),
    nutritionAlert: getNutritionAlert('status.mam'),
  },
  {
    id: 'c3', name: 'Ishan Mohanty', ageMonths: 54, gender: 'M',
    parentName: 'Biswanath Pradhan', village: 'Kanjiaguda',
    nutritionStatus: 'status.sam', learningScore: 35, persona: 'data.persona.curious_explorer', awcId: 'awc1',
    domainScores: { language: 32, numeracy: 30, cognitive: 38, socio_emotional: 40 },
    currentDifficulty: { language: 1, numeracy: 1, cognitive: 1, socio_emotional: 1 },
    attendanceRate: 65, lastAttendanceDate: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    weightHistory: generateWeightHistory(8.5), nutritionHistory: generateNutritionHistory('SAM'),
    quizResults: [
      { id: 'qr6', date: '2026-03-15', domain: 'language', score: 30, totalQuestions: 10, correctAnswers: 3, difficulty: 1, timeTaken: 600 },
    ],
    riskFlags: { learningRisk: 'High', nutritionRisk: 'High', combinedRisk: 'High', flags: ['status.low_attendance', 'status.stunted'] },
    suggestedActivities: getSuggestedActivities(35),
    nutritionAlert: getNutritionAlert('status.sam'),
    growthTrajectory: {
      expected: 15,
      actual: 8.5,
      trend: 'down',
      message: 'Trajectory falling. Critical intervention required to prevent further cognitive delay.'
    }
  },
  {
    id: 'c4', name: 'Meera Behera', ageMonths: 30, gender: 'F',
    parentName: 'Jyoti Behera', village: 'Padmapur',
    nutritionStatus: 'status.normal', learningScore: 85, persona: 'data.persona.social_butterfly', awcId: 'awc1',
    domainScores: { language: 58, numeracy: 50, cognitive: 55, socio_emotional: 57 },
    currentDifficulty: { language: 2, numeracy: 2, cognitive: 2, socio_emotional: 2 },
    attendanceRate: 91, lastAttendanceDate: new Date().toISOString().split('T')[0],
    weightHistory: generateWeightHistory(10), nutritionHistory: generateNutritionHistory('Normal'),
    quizResults: [
      { id: 'qr7', date: '2026-03-27', domain: 'cognitive', score: 50, totalQuestions: 10, correctAnswers: 5, difficulty: 2, timeTaken: 480 },
      { id: 'qr8', date: '2026-03-20', domain: 'language', score: 60, totalQuestions: 10, correctAnswers: 6, difficulty: 2, timeTaken: 440 },
    ],
    riskFlags: { learningRisk: 'Low', nutritionRisk: 'Low', combinedRisk: 'Low', flags: [] },
    suggestedActivities: getSuggestedActivities(85),
    nutritionAlert: getNutritionAlert('status.normal'),
  },
  {
    id: 'c5', name: 'Sayan Rout', ageMonths: 48, gender: 'M',
    parentName: 'Suresh Das', village: 'Padmapur',
    nutritionStatus: 'status.normal', learningScore: 71, persona: 'data.persona.creative_thinker', awcId: 'awc1',
    domainScores: { language: 95, numeracy: 88, cognitive: 93, socio_emotional: 92 },
    currentDifficulty: { language: 5, numeracy: 4, cognitive: 5, socio_emotional: 5 },
    attendanceRate: 82, lastAttendanceDate: new Date().toISOString().split('T')[0],
    weightHistory: generateWeightHistory(16), nutritionHistory: generateNutritionHistory('Normal'),
    quizResults: [
      { id: 'qr9', date: '2024-04-01', domain: 'language', score: 100, totalQuestions: 10, correctAnswers: 10, difficulty: 5, timeTaken: 250 },
      { id: 'qr10', date: '2024-03-28', domain: 'numeracy', score: 90, totalQuestions: 10, correctAnswers: 9, difficulty: 4, timeTaken: 280 },
    ],
    riskFlags: { learningRisk: 'Low', nutritionRisk: 'Low', combinedRisk: 'Low', flags: [] },
    suggestedActivities: getSuggestedActivities(71),
    nutritionAlert: getNutritionAlert('status.normal'),
  },
  {
      id: 'c6', name: 'Ananya Mishra', ageMonths: 42, gender: 'F',
      parentName: 'Deepak Mishra', village: 'Padmapur',
      nutritionStatus: 'status.normal', learningScore: 65, persona: 'data.persona.visual_learner', awcId: 'awc1',
      domainScores: { language: 70, numeracy: 60, cognitive: 65, socio_emotional: 65 },
      currentDifficulty: { language: 3, numeracy: 2, cognitive: 3, socio_emotional: 3 },
      attendanceRate: 85, lastAttendanceDate: new Date().toISOString().split('T')[0],
      weightHistory: generateWeightHistory(13), nutritionHistory: generateNutritionHistory('Normal'),
      quizResults: [
        { id: 'qr12', date: '2026-03-30', domain: 'language', score: 70, totalQuestions: 10, correctAnswers: 7, difficulty: 3, timeTaken: 400 },
      ],
      riskFlags: { learningRisk: 'Low', nutritionRisk: 'Low', combinedRisk: 'Low', flags: [] },
      suggestedActivities: getSuggestedActivities(65),
      nutritionAlert: getNutritionAlert('status.normal'),
  },
  {
    id: 'c7', name: 'Ishaan Nayak', ageMonths: 24, gender: 'M',
    parentName: 'Manoj Nayak', village: 'Padmapur',
    nutritionStatus: 'status.mam', learningScore: 48, persona: 'data.persona.needs_support', awcId: 'awc1',
    domainScores: { language: 50, numeracy: 44, cognitive: 48, socio_emotional: 50 },
    currentDifficulty: { language: 2, numeracy: 1, cognitive: 2, socio_emotional: 2 },
    attendanceRate: 72, lastAttendanceDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    weightHistory: generateWeightHistory(9.5), nutritionHistory: generateNutritionHistory('MAM'),
    quizResults: [
      { id: 'qr13', date: '2026-03-26', domain: 'numeracy', score: 40, totalQuestions: 10, correctAnswers: 4, difficulty: 1, timeTaken: 550 },
    ],
    riskFlags: { learningRisk: 'Medium', nutritionRisk: 'Medium', combinedRisk: 'Medium', flags: ['status.underweight'] },
    suggestedActivities: getSuggestedActivities(48),
    nutritionAlert: getNutritionAlert('status.mam'),
  },
  {
    id: 'c8', name: 'Pooja Swain', ageMonths: 45, gender: 'F',
    parentName: 'Lakshmi Swain', village: 'Padmapur',
    nutritionStatus: 'status.normal', learningScore: 78, persona: 'data.persona.fast_learner', awcId: 'awc1',
    domainScores: { language: 80, numeracy: 75, cognitive: 78, socio_emotional: 79 },
    currentDifficulty: { language: 4, numeracy: 3, cognitive: 3, socio_emotional: 4 },
    attendanceRate: 92, lastAttendanceDate: new Date().toISOString().split('T')[0],
    weightHistory: generateWeightHistory(14.5), nutritionHistory: generateNutritionHistory('Normal'),
    quizResults: [
      { id: 'qr14', date: '2026-04-02', domain: 'language', score: 80, totalQuestions: 10, correctAnswers: 8, difficulty: 4, timeTaken: 350 },
      { id: 'qr15', date: '2026-03-29', domain: 'cognitive', score: 80, totalQuestions: 10, correctAnswers: 8, difficulty: 3, timeTaken: 370 },
    ],
    riskFlags: { learningRisk: 'Low', nutritionRisk: 'Low', combinedRisk: 'Low', flags: [] },
    suggestedActivities: getSuggestedActivities(78),
    nutritionAlert: getNutritionAlert('status.normal'),
  },
];

// ---- DISTRICT KPIs ----
export const districtKPIs: DistrictKPI = {
  totalAWCs: 157,
  totalChildren: 4710,
  learningImprovement: 14.2,
  malnutritionReduction: 8.7,
  avgAttendance: 84,
  activeAlerts: 23,
};

// ---- AI INSIGHTS ----
export const mockAIInsights: AIInsight[] = [
  { id: '1', title: 'data.insight.avg_attendance', value: '84%', change: '+2.4%', status: 'good' },
  { id: '2', title: 'data.insight.malnutrition_level', value: '12.5%', change: '-1.2%', status: 'good' },
  { id: '3', title: 'data.insight.learning_scores', value: '68/100', change: '+5.1%', status: 'average' },
  { id: '4', title: 'data.insight.sync_status', value: '98%', change: '+0.5%', status: 'good' },
];

// Preserve older imports used across the app while the data naming settles.
export const mockInsights = mockAIInsights;

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'data.notification.growth_audit.title',
    message: 'data.notification.growth_audit.msg',
    time: 'status.hr_ago', // Simplified for demo, technically needs count
    type: 'action',
    read: false,
  },
  {
    id: '2',
    title: 'data.notification.policy_update.title',
    message: 'data.notification.policy_update.msg',
    time: 'status.hr_ago',
    type: 'info',
    read: true,
  },
  {
    id: '3',
    title: 'status.warning',
    message: "Rohan Pradhan's attendance has dropped below 60%. Please contact parents.",
    time: 'status.day_ago',
    type: 'warning',
    read: false,
  },
];

export const monthlyThemes: Record<MonthlyTheme, { title: string; subtitle: string; icon: string }> = {
  'data.theme.family': { title: 'data.theme.family.title', subtitle: 'data.theme.family.subtitle', icon: '🏠' },
  'data.theme.animals': { title: 'data.theme.animals.title', subtitle: 'data.theme.animals.subtitle', icon: '🐾' },
  'data.theme.nature': { title: 'data.theme.nature.title', subtitle: 'data.theme.nature.subtitle', icon: '🌿' },
};

export const learningJourneyByTheme: Record<MonthlyTheme, DailyActivity[]> = {
  'data.theme.family': [
    { id: 'act1', title: 'data.activity.match.title', category: 'domain.cognitive', instructions: 'data.activity.match.instructions', childMode: 'Drag family members to the correct number basket.', mode: 'drag_drop', durationMin: 12, outcomeTags: ['common.tag.counting', 'common.tag.matching', 'common.tag.focus'], stars: 2, completed: true },
    { id: 'act2', title: 'data.activity.story.title', category: 'domain.language', instructions: 'data.activity.story.instructions', childMode: 'Tap the speaker and repeat simple lines about home.', mode: 'audio', durationMin: 10, outcomeTags: ['common.tag.listening', 'common.tag.speaking', 'common.tag.vocabulary'], stars: 3 },
    { id: 'act3', title: 'data.activity.physical.title', category: 'domain.physical', instructions: 'data.activity.physical.instructions', childMode: 'Follow the timer and balance for 5 seconds on each stop.', mode: 'timer', durationMin: 8, outcomeTags: ['common.tag.balance', 'common.tag.coordination', 'common.tag.confidence'], stars: 2 },
    { id: 'act4', title: 'data.activity.draw.title', category: 'domain.creativity', instructions: 'data.activity.draw.instructions', childMode: 'Draw on the canvas and tell one thing each person likes.', mode: 'canvas', durationMin: 15, outcomeTags: ['common.tag.expression', 'common.tag.fine_motor', 'common.tag.identity'], stars: 4 },
    { id: 'act5', title: 'data.activity.nutrition.title', category: 'domain.nutrition', instructions: 'data.activity.nutrition.instructions', childMode: 'Move food cards into healthy and sometimes baskets.', mode: 'sorting', durationMin: 9, outcomeTags: ['common.tag.food_awareness', 'common.tag.decision_making'], stars: 2 },
  ],
  'data.theme.animals': [
    { id: 'act6', title: 'Animals', category: 'Cognitive', instructions: 'Arrange animal figurines and ask children to group them by number.', childMode: 'Drag animals to the matching leaf with the right number.', mode: 'drag_drop', durationMin: 12, outcomeTags: ['Counting', 'Classification'], stars: 3 },
  ],
  'data.theme.nature': [
    { id: 'act7', title: 'Nature', category: 'Physical', instructions: 'Take a small nature walk and ask children to pick 3 different leaves.', childMode: 'Take a photo of your leaf and describe its colour.', mode: 'canvas', durationMin: 20, outcomeTags: ['Observation', 'Sensory'], stars: 4 },
  ],
};

// ── Teaching Modules (teacher-ready lesson plans) ──
export interface TeachingModule {
  id: string;
  title: string;
  objective: string;
  materials: string[];
  duration: number;
  steps: string[];
  childTasks: string[];
  domain: string;
}

export const teachingModulesByTheme: Record<MonthlyTheme, TeachingModule[]> = {
  'data.theme.family': [
    {
      id: 'tm1', title: 'My Home & People', objective: 'Children identify family members and describe their roles.',
      materials: ['Family flashcards', 'Chart paper', 'Crayons'],
      duration: 25, domain: 'domain.language',
      steps: ['Show family flashcards and name each member', 'Ask children to share who lives in their home', 'Guide them to draw their family on chart paper'],
      childTasks: ['Name 3 family members', 'Draw a family picture', 'Tell one thing a parent does'],
    },
    {
      id: 'tm2', title: 'Counting in My Family', objective: 'Children count family members and objects at home.',
      materials: ['Number tiles', 'Counting beads', 'Worksheet'],
      duration: 20, domain: 'domain.cognitive',
      steps: ['Ask how many people live at home', 'Use beads to represent family members', 'Practice counting 1-10 with tiles'],
      childTasks: ['Count to 5 independently', 'Match number tile to bead group', 'Fill in counting worksheet'],
    },
  ],
  'data.theme.animals': [
    {
      id: 'tm3', title: 'Animals Around Us', objective: 'Children name domestic and wild animals.',
      materials: ['Animal picture cards', 'Sound clips', 'Clay'],
      duration: 25, domain: 'domain.language',
      steps: ['Show animal cards, ask children to name them', 'Play animal sounds and guess', 'Make clay animals'],
      childTasks: ['Name 5 animals', 'Mimic 3 animal sounds', 'Shape one animal from clay'],
    },
  ],
  'data.theme.nature': [
    {
      id: 'tm4', title: 'Trees & Leaves', objective: 'Children observe and describe parts of a tree.',
      materials: ['Real leaves', 'Magnifying glass', 'Drawing paper'],
      duration: 20, domain: 'domain.cognitive',
      steps: ['Go outside, observe a tree together', 'Collect different leaves', 'Compare shapes and sizes'],
      childTasks: ['Collect 3 different leaves', 'Name parts of a tree', 'Draw a leaf and color it'],
    },
  ],
};

// ── 3D Shape Studio items ──
export interface ShapeStudioItem {
  id: string;
  shape: string;
  icon: string;
  concept: string;
  realWorldExample: string;
  miniTask: string;
  domain: string;
}

export const shapeStudioByTheme: Record<MonthlyTheme, ShapeStudioItem[]> = {
  'data.theme.family': [
    { id: 'ss1', shape: 'Cube', icon: '🧊', concept: 'A cube has 6 flat faces, 12 edges, and 8 corners.', realWorldExample: 'Dice, sugar cube, building block', miniTask: 'Find 3 cube-shaped objects in the classroom.', domain: 'domain.cognitive' },
    { id: 'ss2', shape: 'Sphere', icon: '🏐', concept: 'A sphere is round with no edges or corners.', realWorldExample: 'Ball, orange, globe', miniTask: 'Roll a ball and describe its movement.', domain: 'domain.physical' },
    { id: 'ss3', shape: 'Cylinder', icon: '🥫', concept: 'A cylinder has 2 flat circles and 1 curved surface.', realWorldExample: 'Tin can, glass, pipe', miniTask: 'Stack 3 cylindrical objects.', domain: 'domain.cognitive' },
  ],
  'data.theme.animals': [
    { id: 'ss4', shape: 'Cone', icon: '🍦', concept: 'A cone has 1 flat circle and 1 pointed tip.', realWorldExample: 'Ice cream cone, party hat', miniTask: 'Make a cone from paper.', domain: 'domain.creativity' },
  ],
  'data.theme.nature': [
    { id: 'ss5', shape: 'Pyramid', icon: '🔺', concept: 'A pyramid has a flat base and triangular sides that meet at a point.', realWorldExample: 'Tent, roof of a hut', miniTask: 'Build a pyramid with clay.', domain: 'domain.creativity' },
  ],
};

// ── Storytelling Video Shelf ──
export interface StoryVideo {
  id: string;
  title: string;
  languageSupport: string[];
  durationMin: number;
  goals: string[];
  prompts: string[];
  thumbnail: string;
  domain: string;
}

export const storyVideosByTheme: Record<MonthlyTheme, StoryVideo[]> = {
  'data.theme.family': [
    { id: 'sv1', title: 'Aarav\'s Big Family', languageSupport: ['Odia', 'Hindi', 'English'], durationMin: 6, goals: ['Identify family roles', 'Express feelings about home'], prompts: ['Who takes care of you at home?', 'What do you do with your family on Sundays?'], thumbnail: '🏠', domain: 'domain.language' },
    { id: 'sv2', title: 'Grandmother\'s Kitchen', languageSupport: ['Odia', 'Hindi'], durationMin: 8, goals: ['Learn food names', 'Understand kitchen safety'], prompts: ['What does your grandmother cook?', 'Which foods make you strong?'], thumbnail: '🍳', domain: 'domain.nutrition' },
  ],
  'data.theme.animals': [
    { id: 'sv3', title: 'The Clever Crow', languageSupport: ['Odia', 'Hindi', 'English'], durationMin: 5, goals: ['Problem-solving', 'Sequencing events'], prompts: ['How did the crow get water?', 'What would you do differently?'], thumbnail: '🐦', domain: 'domain.cognitive' },
  ],
  'data.theme.nature': [
    { id: 'sv4', title: 'Rain & Rainbow', languageSupport: ['Odia', 'English'], durationMin: 7, goals: ['Observe weather changes', 'Name colors of the rainbow'], prompts: ['What happens after rain?', 'Can you name all seven colors?'], thumbnail: '🌈', domain: 'domain.language' },
  ],
};

const todayIso = new Date().toISOString().split('T')[0];

export const quickAssessments: QuickAssessmentRecord[] = [
  {
    id: 'qa1',
    childId: 'c1',
    activityId: 'act1',
    date: todayIso,
    responses: { cognitive: 'common.yes', language: 'common.yes', physical: 'common.needs_help', social: 'common.yes', creativity: 'common.yes' },
    note: 'Completed the count-and-match task confidently and asked for a second round.',
    autoSaved: true,
  },
  {
    id: 'qa2',
    childId: 'c3',
    activityId: 'act2',
    date: todayIso,
    responses: { cognitive: 'common.needs_help', language: 'common.no', physical: 'common.yes', social: 'common.needs_help', creativity: 'common.needs_help' },
    note: 'Needed repeated prompts during storytelling; responded better with one-to-one support.',
    autoSaved: true,
  },
];

export const mockWeeklyParentReports: Record<string, WeeklyParentReport[]> = {
  c1: [
    {
      week: 'data.report.week_label',
      theme: 'data.theme.family',
      summary: "data.report.summary_c1",
      learningHighlights: ['data.report.highlight.roles', 'data.report.highlight.counting', 'data.report.highlight.motor'],
      attendance: '5/6',
      suggestedHomeActivity: 'data.report.suggested_home',
    }
  ]
};

export const mockMealLogs: MealLog[] = [
  { id: 'm1', date: todayIso, type: 'Breakfast', menu: 'data.meal.suji_upma', nutritionalContent: 'high_energy', portionCount: 32 },
  { id: 'm2', date: todayIso, type: 'Lunch', menu: 'data.meal.rice_dalma', nutritionalContent: 'high_protein', portionCount: 34 },
];

export const childDevelopmentInsights: Record<string, ChildDevelopmentInsight[]> = {
  c1: [
    {
      id: 'insight1',
      title: 'data.insight.on_track.title',
      detail: 'data.insight.on_track.detail',
      domain: 'domain.language',
      severity: 'good'
    }
  ],
  c3: [
    {
      id: 'insight2',
      title: 'data.insight.intervention.title',
      detail: 'data.insight.intervention.detail',
      domain: 'domain.nutrition',
      severity: 'critical'
    }
  ]
};

export const mockThemePlans: ThemePlan[] = [
  {
    month: 'April 2026',
    theme: 'data.theme.family',
    objectives: ['Identify family members', 'Express emotions', 'Basic counting'],
    weeks: [
      { week: 1, focus: 'My House' },
      { week: 2, focus: 'Family Members' },
      { week: 3, focus: 'Helping at Home' },
      { week: 4, focus: 'Family Traditions' }
    ],
    resources: ['Family flashcards', 'Audio stories', 'Crayons']
  }
];

export const mockPredictions = [
  { childId: 'c1', currentNutritionStatus: 'Normal', predictedNutritionStatus: 'Normal', predictionConfidence: 94, daysToPrediction: 30, riskFactors: ['Stable weight'] },
  { childId: 'c2', currentNutritionStatus: 'MAM', predictedNutritionStatus: 'Normal', predictionConfidence: 78, daysToPrediction: 45, riskFactors: ['Improved intake'] },
  { childId: 'c3', currentNutritionStatus: 'SAM', predictedNutritionStatus: 'MAM', predictionConfidence: 65, daysToPrediction: 60, riskFactors: ['High recovery rate'] },
];

export const mockBadgeAwards: BadgeAward[] = [
  { id: 'b1', childId: 'c1', badgeId: 'star_helper', date: todayIso, title: 'data.badge.star_helper.title', description: 'data.badge.star_helper.description', icon: '🌟' }
];

export const offlineContentPacks: OfflineContentPack[] = [
  { id: 'p1', name: 'April Content Pack', size: '12MB', downloaded: true, lastUpdated: '2026-04-01' },
  { id: 'p2', name: 'May Video Lessons', size: '45MB', downloaded: false },
];
