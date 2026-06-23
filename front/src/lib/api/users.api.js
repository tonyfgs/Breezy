import { apiClient } from './client';

export function getAllProfilesApi() {
  return apiClient('/users/');
}

export function getProfileApi(id) {
  return apiClient(`/users/${id}`);
}

export async function getProfileByUsernameApi(username) {
  const profiles = await apiClient('/users/');
  return profiles.find(p => p.username === username) ?? null;
}

export function updateProfileApi(id, data) {
  return apiClient(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
