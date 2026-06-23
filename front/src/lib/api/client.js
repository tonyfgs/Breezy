import { getToken, removeToken } from '../token';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const method = options.method ?? 'GET';
  console.log(`[api] ${method} ${path}`);

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error(`[api] ${method} ${path} → ${res.status}`, body);
    if (res.status === 401) {
      removeToken();
      window.location.replace('/login');
      return;
    }
    throw new ApiError(res.status, body.message ?? res.statusText);
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  console.log(`[api] ${method} ${path} → ${res.status}`, data);
  return data;
}
