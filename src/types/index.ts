// ============================================================
// SMART ANGANWADI - TYPE DEFINITIONS
// Complete type system for multi-role government platform
// ============================================================

// --- Auth & Roles ---
export type UserRole = 'worker' | 'supervisor' | 'admin' | 'official';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  district?: string;
  block?: string;
  awcId?: string;
}

// --- Language ---
export type Language = 'en' | 'od' | 'hi';

// --- Theme ---
export type ThemeMode = 'light' | 'dark';

// --- Learning ---
export type LearningDomain = 'language' | 'numeracy' | 'cognitive' | 'socio_emotional';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type SkillLevel = 'basic' | 'intermediate' | 'advanced';

// --- Nutrition ---
export type NutritionStatus = string;
export type RiskLevel = string;

// --- Sync ---
export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'error';

export type LearningPersona = string;

// --- Child Profile ---
export interface Child {
  id: string;
  name: string;
  ageMonths: number;
  gender: 'M' | 'F';
  parentName: string;
  village: string;
  nutritionStatus: NutritionStatus;
  learningScore: number;
  persona: LearningPersona;
  awcId: string;
  photo?: string;
  domainScores: {
    language: number;
    numeracy: number;
    cognitive: number;
    socio_emotional: number;
  };
  currentDifficulty: {
    language: DifficultyLevel;
    numeracy: DifficultyLevel;
    cognitive: DifficultyLevel;
    socio_emotional: DifficultyLevel;
  };
  attendanceRate: number;
  lastAttendanceDate: string;
  weightHistory: { date: string; weight: number }[];
  nutritionHistory: {
    date: string;
    weight: number;
    height: number;
    muac: number;
    status: NutritionStatus;
  }[];
  quizResults: QuizResult[];
  riskFlags: {
    learningRisk: RiskLevel;
    nutritionRisk: RiskLevel;
    combinedRisk: RiskLevel;
    flags: string[];
  };
  suggestedActivities: string[];
  nutritionAlert: string | null;
  migrationStatus?: string;
  growthTrajectory?: {
    expected: number;
    actual: number;
    trend: 'up' | 'down' | 'stable';
    message: string;
  };
}

// --- Quiz ---
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: DifficultyLevel;
  domain: LearningDomain;
}

export interface QuizResult {
  id: string;
  date: string;
  domain: LearningDomain;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  difficulty: DifficultyLevel;
  timeTaken: number; // seconds
}

// --- AWC (Anganwadi Centre) ---
export interface AWC {
  id: string;
  name: string;
  workerName: string;
  workerPhone: string;
  location: string;
  gpId: string;
  blockId: string;
  totalChildren: number;
  presentToday: number;
  criticalCases: number;
  status: 'Good' | 'Warning' | 'Critical';
  alerts: string[];
  avgLearningScore: number;
  nutritionBreakdown: {
    normal: number;
    mam: number;
    sam: number;
  };
  attendanceRate: number;
  lastSyncTime: string;
  syncStatus: SyncStatus;
}

// --- Block ---
export interface Block {
  id: string;
  name: string;
  districtId: string;
  totalAWCs: number;
  totalChildren: number;
  nutritionRiskPercent: number;
  avgLearningScore: number;
  performance: 'Good' | 'Average' | 'Poor';
}

// --- GP (Gram Panchayat) ---
export interface GP {
  id: string;
  name: string;
  blockId: string;
  awcCount: number;
}

// --- District KPIs ---
export interface DistrictKPI {
  totalAWCs: number;
  totalChildren: number;
  learningImprovement: number; // percentage
  malnutritionReduction: number; // percentage
  avgAttendance: number;
  activeAlerts: number;
}

// --- AI Insight ---
export interface AIInsight {
  id: string;
  type?: string;
  title: string;
  value?: string;
  change?: string;
  message?: string;
  status?: string;
  timestamp?: string;
  blockName?: string;
  awcName?: string;
  actionRequired?: boolean;
}

// --- Notification ---
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time?: string;
  timestamp?: string;
  read: boolean;
  severity?: string;
}

// --- Sync Queue ---
export interface SyncQueueItem {
  id: string;
  type: 'assessment' | 'attendance' | 'nutrition' | 'profile_update';
  data: unknown;
  timestamp: string;
  status: SyncStatus;
  retryCount: number;
}

// --- Learning Assessment ---
export interface LearningAssessment {
  id: string;
  childId: string;
  domain: LearningDomain;
  score: number;
  difficultyLevel: DifficultyLevel;
  timestamp: string;
  duration: number;
  correctAnswers: number;
  totalQuestions: number;
}

// --- Dashboard Indicator ---
export interface DashboardIndicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'green' | 'yellow' | 'red';
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  target: number;
}

// --- Smart Anganwadi Extensions ---
export type GrowthStatus = string;
export type ActivityCategory = string;
export type ActivityMode = string;
export type AssessmentResponse = string;
export type ProgressStatus = string;
export type MonthlyTheme = string;

export interface DailyActivity {
  id: string;
  title: string;
  category: ActivityCategory;
  instructions: string;
  childMode: string;
  mode: ActivityMode;
  durationMin: number;
  outcomeTags: string[];
  stars: number;
  completed?: boolean;
}

export interface QuickAssessmentRecord {
  id: string;
  childId: string;
  activityId: string;
  date: string;
  responses: {
    cognitive: AssessmentResponse;
    language: AssessmentResponse;
    physical: AssessmentResponse;
    social: AssessmentResponse;
    creativity: AssessmentResponse;
  };
  note: string;
  autoSaved: boolean;
}

export interface ParentNotification {
  id: string;
  type: 'meal' | 'attendance' | 'vaccination';
  title: string;
  message: string;
  date: string;
}

export interface WeeklyParentReport {
  id?: string;
  childId?: string;
  week: string;
  weekLabel?: string;
  theme: string;
  summary: string;
  learningHighlights: string[];
  skillsLearned?: string[];
  areasToImprove?: string[];
  attendance: string;
  suggestedHomeActivity: string;
  homeActivities?: string[];
  notifications?: ParentNotification[];
  progress?: {
    attendance: number;
    nutrition: number;
    learning: number;
  };
}

export interface MealLog {
  id: string;
  childId?: string;
  date: string;
  type?: string;
  mealType?: string;
  menu: string;
  nutritionalContent: string;
  status?: string;
  portionCount?: number;
  notes?: string;
}

export interface ChildDevelopmentInsight {
  id: string;
  childId?: string;
  title: string;
  detail: string;
  status?: string;
  domain?: string;
  severity?: string;
}

export interface ThemePlan {
  month?: string;
  theme: MonthlyTheme;
  objectives?: string[];
  week?: any;
  weeks?: any[];
  focus?: string;
  activities?: string[];
  resources?: string[];
}

export interface BadgeAward {
  id: string;
  childId: string;
  badgeId?: string;
  date?: string;
  title: string;
  description: string;
  icon?: string;
  earnedOn?: string;
}

export interface OfflineContentPack {
  id: string;
  name?: string;
  size?: string;
  theme?: MonthlyTheme;
  weekLabel?: string;
  downloaded: boolean;
  lastUpdated?: string;
  itemCount?: number;
}

// Legacy compat
export type Role = 'executive' | 'block_officer' | 'cdpo' | 'aww';
