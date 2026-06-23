import { apiClient } from './client';

export function followApi(followerId, followingId) {
  return apiClient('/follows/', {
    method: 'POST',
    body: JSON.stringify({ follwerId: followerId, followingId }),
  });
}

export function unfollowApi(followerId, followingId) {
  return apiClient('/follows/', {
    method: 'DELETE',
    body: JSON.stringify({ follwerId: followerId, followingId }),
  });
}

export function getFollowingApi(userId) {
  return apiClient(`/follows/${userId}/following`);
}

export function getFollowersApi(userId) {
  return apiClient(`/follows/${userId}/followers`);
}
