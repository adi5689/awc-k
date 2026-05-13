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
import { AdaptiveLearning } from './pages/worker/AdaptiveLearning';
import { WorkerAdaptiveLearning } from './pages/worker/WorkerAdaptiveLearning';
import { LearningSession } from './pages/worker/LearningSession';
import { ChildProgressTracking } from './pages/worker/ChildProgressTracking';
import { AIAssistedDashboard } from './pages/worker/AIAssistedDashboard';
import { PredictiveRisk } from './pages/worker/PredictiveRisk';
import { GreenBoardPage } from './pages/worker/GreenBoardPage';
import { WorkerAlerts } from './pages/worker/WorkerAlerts';
import { WorkerInsights } from './pages/worker/WorkerInsights';
import { Nutrition } from './pages/worker/Nutrition';
import { Immunization } from './pages/worker/Immunization';
import { Attendance } from './pages/worker/Attendance';
import { Reports } from './pages/worker/Reports';
import { OfflineSync } from './pages/worker/OfflineSync';

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
import { AdminHeatmap } from './pages/admin/AdminHeatmap';
import { AdminInsights } from './pages/admin/AdminInsights';
import { AdminReports } from './pages/admin/AdminReports';

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
        <Route path="progress-tracking" element={<ChildProgressTracking />} />
        <Route path="nutrition" element={<Nutrition />} />
        <Route path="predictive-risk" element={<PredictiveRisk />} />
        <Route path="immunization" element={<Immunization />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="reports" element={<Reports />} />
        <Route path="learning" element={<AdaptiveLearning />} />
        <Route path="learning-session" element={<LearningSession />} />
        <Route path="adaptive-learning" element={<WorkerAdaptiveLearning />} />
        <Route path="board" element={<GreenBoardPage />} />
        <Route path="alerts" element={<WorkerAlerts />} />
        <Route path="ai-dashboard" element={<AIAssistedDashboard />} />
        <Route path="insights" element={<WorkerInsights />} />
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
        <Route path="predictive-risk" element={<SupervisorPredictiveRisk />} />
        <Route path="learning" element={<SupervisorLearning />} />
        <Route path="ai-dashboard" element={<SupervisorAIAssistedDashboard />} />
        <Route path="immunization" element={<SupervisorImmunization />} />
        <Route path="reports" element={<SupervisorReports />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AppLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="heatmap" element={<AdminHeatmap />} />
        <Route path="insights" element={<AdminInsights />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Default: redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
