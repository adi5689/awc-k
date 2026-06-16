// ============================================================
// APP - Root component with multi-role routing
// Routes: Login → Worker/Supervisor/Admin dashboards
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';

// Worker pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerChildren } from './pages/worker/WorkerChildren';
import { ChildProfile } from './pages/worker/ChildProfile';
import { StudentObservationRegister } from './pages/worker/StudentObservationRegister';
import { ChildProgressTracking } from './pages/worker/ChildProgressTracking';
import { AIAssistedDashboard } from './pages/worker/AIAssistedDashboard';
import { GreenBoardPage } from './pages/worker/GreenBoardPage';
import { WorkerAlerts } from './pages/worker/WorkerAlerts';
import { WorkerInsights } from './pages/worker/WorkerInsights';
import { Immunization } from './pages/worker/Immunization';
import { Attendance } from './pages/worker/Attendance';
import { Reports } from './pages/worker/Reports';
import { OfflineSync } from './pages/worker/OfflineSync';
import { PoshanTrackerUpload } from './pages/worker/PoshanTrackerUpload';
import { WorkerNutritionForecast } from './pages/worker/WorkerNutritionForecast';
import { Development } from './pages/worker/Development';
import { GrowthMonitoring } from './pages/worker/GrowthMonitoring';
import { Health } from './pages/worker/Health';
import { HealthNutrition } from './pages/worker/HealthNutrition';
import { Nutrition } from './pages/worker/Nutrition';
import { ParentEngagement } from './pages/worker/ParentEngagement';
import { PredictiveRisk } from './pages/worker/PredictiveRisk';
import { LearningSession } from './pages/worker/LearningSession';
import { AdaptiveLearning } from './pages/worker/AdaptiveLearning';
import { WorkerAdaptiveLearning } from './pages/worker/WorkerAdaptiveLearning';

// Supervisor pages
import { SupervisorDashboard } from './pages/supervisor/SupervisorDashboard';
import { SupervisorDirectory } from './pages/supervisor/SupervisorDirectory';
import { AWCDetail } from './pages/supervisor/AWCDetail';
import { SupervisorAttendance } from './pages/supervisor/SupervisorAttendance';
import { SupervisorNutrition } from './pages/supervisor/SupervisorNutrition';
import { SupervisorLearning } from './pages/supervisor/SupervisorLearning';
import { SupervisorImmunization } from './pages/supervisor/SupervisorImmunization';
import { SupervisorReports } from './pages/supervisor/SupervisorReports';
import { SupervisorAIAssistedDashboard } from './pages/supervisor/SupervisorAIAssistedDashboard';
import { SupervisorPredictiveRisk } from './pages/supervisor/SupervisorPredictiveRisk';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCenterUserManagement } from './pages/admin/AdminCenterUserManagement';
import { AdminOfficialsManagement } from './pages/admin/AdminOfficialsManagement';
import { AdminLearningModules } from './pages/admin/AdminLearningModules';
import { AdminActivities } from './pages/admin/AdminActivities';
import { AdminPoshanUploads } from './pages/admin/AdminPoshanUploads';
import { AdminPredictions } from './pages/admin/AdminPredictions';
import { AdminCenterPerformance } from './pages/admin/AdminCenterPerformance';
import { AdminCenterProfile } from './pages/admin/AdminCenterProfile';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

// Officials pages
import { OfficialsDashboard } from './pages/officials/OfficialsDashboard';
import { OfficialsCentersOverview } from './pages/officials/OfficialsCentersOverview';
import { OfficialsNutritionForecast } from './pages/officials/OfficialsNutritionForecast';
import { OfficialsForecastDetail } from './pages/officials/OfficialsForecastDetail';
import { OfficialsLearningDetails } from './pages/officials/OfficialsLearningDetails';
import { OfficialsCenterDetails } from './pages/officials/OfficialsCenterDetails';
import { OfficialsMonthlyReports } from './pages/officials/OfficialsMonthlyReports';
import { OfficialsReportDetail } from './pages/officials/OfficialsReportDetail';
import { OfficialsAlerts } from './pages/officials/OfficialsAlerts';
import { OfficialsProfile } from './pages/officials/OfficialsProfile';
import { TrainingKnowledgeBase } from './pages/shared/TrainingKnowledgeBase';

export default function App() {
  return (
    <Routes>
      {/* Public: Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Worker Routes */}
      <Route path="/worker" element={<AppLayout />}>
        <Route index element={<WorkerDashboard />} />
        <Route path="child/:childId" element={<ChildProfile />} />
        <Route path="children" element={<WorkerChildren />} />
        <Route path="student-observations" element={<StudentObservationRegister />} />
        <Route path="progress-tracking" element={<ChildProgressTracking />} />
        <Route path="immunization" element={<Immunization />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="reports" element={<Reports />} />
        <Route path="nutrition-forecast" element={<WorkerNutritionForecast />} />
        <Route path="development" element={<Development />} />
        <Route path="growth-monitoring" element={<GrowthMonitoring />} />
        <Route path="health" element={<Health />} />
        <Route path="health-nutrition" element={<HealthNutrition />} />
        <Route path="nutrition" element={<Nutrition />} />
        <Route path="parent-engagement" element={<ParentEngagement />} />
        <Route path="predictive-risk" element={<PredictiveRisk />} />
        <Route path="learning-session-live" element={<LearningSession />} />
        <Route path="adaptive-learning-lab" element={<AdaptiveLearning />} />
        <Route path="worker-adaptive-learning" element={<WorkerAdaptiveLearning />} />
        <Route path="poshan-tracker-upload" element={<PoshanTrackerUpload />} />
        <Route path="poshan-upload" element={<Navigate to="/worker/nutrition-forecast" replace />} />
        <Route path="learning" element={<Navigate to="/worker/student-observations" replace />} />
        <Route path="learning-session" element={<Navigate to="/worker/student-observations" replace />} />
        <Route path="adaptive-learning" element={<Navigate to="/worker/student-observations" replace />} />
        <Route path="board" element={<GreenBoardPage />} />
        <Route path="alerts" element={<WorkerAlerts />} />
        <Route path="ai-dashboard" element={<AIAssistedDashboard />} />
        <Route path="insights" element={<WorkerInsights />} />
        <Route path="training" element={<TrainingKnowledgeBase />} />
        <Route path="offline-sync" element={<OfflineSync />} />
      </Route>

      {/* Supervisor Routes */}
      <Route path="/supervisor" element={<AppLayout />}>
        <Route index element={<SupervisorDashboard />} />
        <Route path="awc-list" element={<SupervisorDirectory />} />
        <Route path="awc/:awcId" element={<AWCDetail />} />
        <Route path="child/:childId" element={<ChildProfile />} />
        <Route path="attendance" element={<SupervisorAttendance />} />
        <Route path="nutrition" element={<SupervisorNutrition />} />
        <Route path="poshan-upload" element={<PoshanTrackerUpload />} />
        <Route path="predictive-risk" element={<SupervisorPredictiveRisk />} />
        <Route path="learning" element={<SupervisorLearning />} />
        <Route path="ai-dashboard" element={<SupervisorAIAssistedDashboard />} />
        <Route path="immunization" element={<SupervisorImmunization />} />
        <Route path="reports" element={<SupervisorReports />} />
        <Route path="training" element={<TrainingKnowledgeBase />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AppLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="centers-users" element={<AdminCenterUserManagement />} />
        <Route path="officials-management" element={<AdminOfficialsManagement />} />
        <Route path="learning-modules" element={<AdminLearningModules />} />
        <Route path="activities" element={<AdminActivities />} />
        <Route path="poshan-uploads" element={<AdminPoshanUploads />} />
        <Route path="ai-predictions" element={<AdminPredictions />} />
        <Route path="center-performance" element={<AdminCenterPerformance />} />
        <Route path="center-performance/:centerId" element={<AdminCenterProfile />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="poshan-upload" element={<Navigate to="/admin/poshan-uploads" replace />} />
        <Route path="training" element={<TrainingKnowledgeBase />} />
        <Route path="heatmap" element={<Navigate to="/admin/center-performance" replace />} />
        <Route path="insights" element={<Navigate to="/admin/ai-predictions" replace />} />
        <Route path="system-monitoring" element={<Navigate to="/admin/settings" replace />} />
        <Route path="integrations" element={<Navigate to="/admin/settings" replace />} />
      </Route>

      {/* Officials Routes */}
      <Route path="/officials" element={<AppLayout />}>
        <Route index element={<OfficialsDashboard />} />
        <Route path="centers" element={<OfficialsCentersOverview />} />
        <Route path="nutrition-forecast" element={<OfficialsNutritionForecast />} />
        <Route path="forecast/:forecastId" element={<OfficialsForecastDetail />} />
        <Route path="learning-details" element={<OfficialsLearningDetails />} />
        <Route path="center/:centerId" element={<OfficialsCenterDetails />} />
        <Route path="reports" element={<OfficialsMonthlyReports />} />
        <Route path="reports/:reportId" element={<OfficialsReportDetail />} />
        <Route path="alerts" element={<OfficialsAlerts />} />
        <Route path="profile" element={<OfficialsProfile />} />
      </Route>

      {/* Default: redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
