import { apiClient } from './client';
import { getAllProfilesApi } from './users.api';
import { getLikeStatusApi } from './posts.api';

export async function getFeedApi(userId, { limit = 20, cursor } = {}) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set('cursor', cursor);

  const [data, allUsers] = await Promise.all([
    apiClient(`/feed/${userId}?${params}`),
    getAllProfilesApi().catch(() => []),
  ]);

  const userMap = new Map(allUsers.map(u => [u.id, u.username]));
  const posts = data.posts ?? [];

  const likedStatuses = await Promise.all(
    posts.map(p => getLikeStatusApi(p.id, String(userId)).catch(() => false))
  );

  return {
    posts: posts.map((p, i) => ({
      sk_id: p.id,
      sk_authorId: p.authorId,
      txt_content: p.content,
      nb_likesCount: p.likeCount ?? 0,
      nb_commentsCount: p.commentCount ?? 0,
      fl_liked: likedStatuses[i] ?? false,
      ts_createdAt: p.createdAt,
      ts_updatedAt: p.createdAt,
      sk_parentPostId: p.parentPostId ?? null,
      author: {
        sk_id: p.authorId,
        nm_username: userMap.get(p.authorId) ?? p.authorId,
        url_avatar: null,
      },
    })),
    nextCursor: data.nextCursor,
  };
}
