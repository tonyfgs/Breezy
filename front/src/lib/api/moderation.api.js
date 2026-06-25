import { apiClient } from './client';

export function getModerationStatsApi() {
  return apiClient('/moderation/stats');
}

export function getPendingReportsApi() {
  return apiClient('/reports/?status=pending');
}

export function updateReportApi(id, data) {
  return apiClient(`/reports/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function getActiveSanctionsApi(targetType) {
  return apiClient(`/sanctions/?targetType=${targetType}&fl_active=1`);
}

export function revokeSanctionApi(id) {
  return apiClient(`/sanctions/${id}`, { method: 'DELETE' });
}

export function createSanctionApi(data) {
  return apiClient('/sanctions/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getAllReportsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiClient(`/reports/${query ? '?' + query : ''}`);
}

export function getAllSanctionsApi() {
  return apiClient('/sanctions/');
}

export function createReportApi(reporterId, targetId, targetType, reason) {
  return apiClient('/reports/', {
    method: 'POST',
    body: JSON.stringify({ reporterId, targetId, targetType, reason }),
  });
}
