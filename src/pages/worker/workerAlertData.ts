import { mockAWCs, mockChildren, mockUsers } from '../../data/mockData';

export type WorkerAlert = {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning';
  category: 'care' | 'attendance' | 'operations';
  childName?: string;
  metric?: string;
  recommendedAction: string;
};

export function getWorkerContext() {
  const currentWorker = mockUsers.worker;
  const currentAWC = mockAWCs.find((awc) => awc.id === currentWorker.awcId) ?? mockAWCs[0];
  const centerChildren = mockChildren.filter((child) => child.awcId === currentAWC.id);

  return { currentWorker, currentAWC, centerChildren };
}

export function getWorkerAlerts(): WorkerAlert[] {
  const { currentAWC, centerChildren } = getWorkerContext();

  const criticalCareAlerts = centerChildren
    .filter(
      (child) =>
        child.nutritionStatus === 'status.sam' || child.riskFlags.combinedRisk === 'High'
    )
    .map((child) => ({
      id: `care-${child.id}`,
      title: `${child.name} needs urgent follow-up`,
      description: `${child.name} is flagged for high priority review and should be checked today.`,
      severity: 'critical' as const,
      category: 'care' as const,
      childName: child.name,
      metric: 'High combined risk',
      recommendedAction: 'Review the child profile and arrange referral support if needed.',
    }));

  const attendanceAlerts = centerChildren
    .filter((child) => child.attendanceRate < 75)
    .map((child) => ({
      id: `attendance-${child.id}`,
      title: `${child.name} has low attendance`,
      description: `${child.name}'s attendance is ${child.attendanceRate}%. Please follow up with the family.`,
      severity: 'warning' as const,
      category: 'attendance' as const,
      childName: child.name,
      metric: `${child.attendanceRate}% attendance`,
      recommendedAction: 'Call the family and plan a home follow-up.',
    }));

  const operationalAlerts = currentAWC.alerts.map((alert, index) => ({
    id: `awc-${index}`,
    title: alert,
    description: `Centre-level alert for ${currentAWC.name}.`,
    severity: 'critical' as const,
    category: 'operations' as const,
    metric: currentAWC.syncStatus === 'error' ? 'Sync blocked' : 'Centre escalation',
    recommendedAction: 'Review centre operations and escalate to supervisor if needed.',
  }));

  return [...criticalCareAlerts, ...attendanceAlerts, ...operationalAlerts];
}
