import { apiClient } from './client';

export function loginApi(handle, password) {
  return apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: handle, password }),
  });
}

export function registerApi(handle, password) {
  return apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username: handle, password }),
  });
}

export function logoutApi() {
  return apiClient('/auth/logout', { method: 'POST' });
}

export function createAdminUserApi(username, password, role) {
  return apiClient('/auth/admin/users', {
    method: 'POST',
    body: JSON.stringify({ username, password, role }),
  });
}
