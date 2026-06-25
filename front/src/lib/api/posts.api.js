import { apiClient } from './client';
import { getAllProfilesApi } from './users.api';

function normalizePost(p, authorUsername = null) {
  return {
    sk_id: p.id,
    sk_authorId: p.authorId,
    txt_content: p.content,
    nb_likesCount: p.likeCount ?? 0,
    nb_commentsCount: p.commentCount ?? 0,
    fl_liked: false,
    ts_createdAt: p.createdAt,
    ts_updatedAt: p.updatedAt ?? p.createdAt,
    sk_parentPostId: p.parentPostId ?? null,
    author: {
      sk_id: p.authorId,
      nm_username: authorUsername ?? p.authorId,
      url_avatar: null,
    },
  };
}

export function createPostApi(authorId, content, parentPostId = null) {
  return apiClient('/posts/', {
    method: 'POST',
    body: JSON.stringify({ authorId, content, parentPostId }),
  });
}

export function getPostRawApi(id) {
  return apiClient(`/posts/${id}`);
}

export async function getPostApi(id) {
  const [p, allUsers] = await Promise.all([
    apiClient(`/posts/${id}`),
    getAllProfilesApi().catch(() => []),
  ]);
  const userMap = new Map(allUsers.map(u => [u.id, u.username]));
  return normalizePost(p, userMap.get(p.authorId) ?? null);
}

export async function getLikeStatusApi(postId, userId) {
  const data = await apiClient(`/posts/${postId}/likes/check/${userId}`);
  return data.liked === true;
}

export async function getPostsByUserApi(userId, page = 1, limit = 20, authorUsername = null) {
  const data = await apiClient(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  return {
    posts: (data.data ?? []).map(p => normalizePost(p, authorUsername)),
    total: data.total ?? 0,
    totalPages: data.totalPages ?? 1,
  };
}

export async function getPostCommentsApi(postId, page = 1, limit = 20) {
  const [data, allUsers] = await Promise.all([
    apiClient(`/posts/${postId}/comments?page=${page}&limit=${limit}`),
    getAllProfilesApi().catch(() => []),
  ]);
  const userMap = new Map(allUsers.map(u => [u.id, u.username]));
  return (data.data ?? []).map(p => normalizePost(p, userMap.get(p.authorId) ?? null));
}

export function updatePostApi(postId, data) {
  return apiClient(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePostApi(postId) {
  return apiClient(`/posts/${postId}`, {
    method: 'DELETE',
  });
}

export function likePostApi(postId, userId) {
  return apiClient(`/posts/${postId}/likes`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export function unlikePostApi(postId, userId) {
  return apiClient(`/posts/${postId}/likes/${userId}`, {
    method: 'DELETE',
  });
}
