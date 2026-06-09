'use client';

import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';
import Avatar from '../ui/Avatar';

const ICONS = { like: Heart, comment: MessageCircle, follow: UserPlus, mention: AtSign };
const TEXTS = {
  like: 'a aimé ton post',
  comment: 'a commenté ton post',
  follow: 'te suit maintenant',
  mention: "t'a mentionné",
};

function formatRelativeTime(isoString) {
  const diffSeconds = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} h`;
  return `${Math.floor(diffSeconds / 86400)} j`;
}

function getTarget(notif) {
  if (notif.cd_type === 'follow') return `/profile/${notif.actor.nm_username}`;
  return `/post/${notif.sk_postId}`;
}

export default function NotifItem({ notif }) {
  const router = useRouter();
  const Icon = ICONS[notif.cd_type];

  return (
    <button
      className={`notif-item${notif.fl_read ? '' : ' notif-item--unread'}`}
      onClick={() => router.push(getTarget(notif))}
    >
      <div className="notif-item__avatar-wrap">
        <Avatar name={notif.actor.nm_username} size="sm" />
        <span className="notif-item__icon-badge">
          <Icon size={10} />
        </span>
      </div>
      <p className="notif-item__text">
        <strong>@{notif.actor.nm_username}</strong> {TEXTS[notif.cd_type]}
      </p>
      <span className="notif-item__time">{formatRelativeTime(notif.ts_createdAt)}</span>
    </button>
  );
}
