'use client';

import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import NotifItem from '../../components/notifications/NotifItem';

// TODO: API - GET /notifications
const MOCK_NOTIFICATIONS = [
  {
    sk_id: 'notif_001',
    cd_type: 'like',
    actor: { sk_id: 'user_002', nm_username: 'theom' },
    sk_postId: 'post_001',
    fl_read: false,
    ts_createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    sk_id: 'notif_002',
    cd_type: 'comment',
    actor: { sk_id: 'user_003', nm_username: 'ines.b' },
    sk_postId: 'post_001',
    fl_read: false,
    ts_createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    sk_id: 'notif_003',
    cd_type: 'follow',
    actor: { sk_id: 'user_004', nm_username: 'maxg' },
    sk_postId: null,
    fl_read: true,
    ts_createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    sk_id: 'notif_004',
    cd_type: 'mention',
    actor: { sk_id: 'user_002', nm_username: 'theom' },
    sk_postId: 'post_002',
    fl_read: true,
    ts_createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const hasUnread = notifications.some(n => !n.fl_read);

  function handleReadAll() {
    // TODO: API - PATCH /notifications/read-all
    setNotifications(prev => prev.map(n => ({ ...n, fl_read: true })));
  }

  return (
    <AppLayout>
      <header className="page-header">
        <h1 className="page-header__title">Notifications</h1>
        {hasUnread && (
          <button className="page-header__action" onClick={handleReadAll}>
            Tout lire
          </button>
        )}
      </header>

      <div className="notif-list">
        {notifications.map(notif => (
          <NotifItem key={notif.sk_id} notif={notif} />
        ))}
      </div>
    </AppLayout>
  );
}
