import { apiClient } from './client';

export function createReportApi(reporterId, targetId, targetType, reason) {
  return apiClient('/reports/', {
    method: 'POST',
    body: JSON.stringify({ reporterId, targetId, targetType, reason }),
  });
}
