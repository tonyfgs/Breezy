'use client';

import { useRouter } from 'next/navigation';
import Avatar from '../ui/Avatar';

export default function UserRow({ user }) {
  const router = useRouter();

  return (
    <button
      className="user-row"
      onClick={() => router.push(`/profile/${user.nm_username}`)}
    >
      <Avatar name={user.nm_username} size="md" />
      <div className="user-row__info">
        <span className="user-row__name">@{user.nm_username}</span>
        {user.txt_bio && <span className="user-row__bio">{user.txt_bio}</span>}
      </div>
    </button>
  );
}
