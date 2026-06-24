import { apiClient } from './client';

export function getAllProfilesApi() {
  return apiClient('/users/');
}

export function getProfileApi(id) {
  return apiClient(`/users/${id}`);
}

export function getProfileByUsernameApi(username) {
  return apiClient(`/users/username/${username}`);
}

export function updateProfileApi(id, data) {
  return apiClient(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
