'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Home, Search, Bell, User, Settings, PenLine, MoreHorizontal } from 'lucide-react';
import Avatar from '../ui/Avatar';
import CreatePostModal from '../modals/CreatePostModal';

const MOCK_CURRENT_USER = {
  nm_username: 'camille',
  displayName: 'Camille Roche',
};

const NAV_ITEMS = [
  { href: '/feed', icon: Home, label: 'Feed' },
  { href: '/search', icon: Search, label: 'Découvrir' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/profile/me', icon: User, label: 'Profil' },
  { href: '/settings', icon: Settings, label: 'Réglages' },
];

export default function SideNav() {
  const pathname = usePathname();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // TODO: API - GET /api/notifications/unread-count
  const hasNotifications = false;

  return (
    <>
      <nav className="side-nav">
        <div className="side-nav__logo">
          <Image
            src="/breezy_logo-green_bg.png"
            alt="Breezy"
            width={32}
            height={32}
            className="side-nav__logo-icon"
          />
          Breezy
        </div>

        <ul className="side-nav__list">
          {NAV_ITEMS.map(({ href, icon: Icon, label, matchPrefix }) => {
            const isActive = matchPrefix
              ? pathname.startsWith(matchPrefix)
              : pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`side-nav__item${isActive ? ' side-nav__item--active' : ''}`}
                >
                  <div className="side-nav__icon-wrapper">
                    <Icon size={20} />
                    {label === 'Notifications' && hasNotifications && (
                      <span className="side-nav__notif-dot" />
                    )}
                  </div>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          className="side-nav__create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <PenLine size={18} strokeWidth={2.5} />
          Nouvelle brise
        </button>

        <Link href="/profile/me" className="side-nav__user">
          <Avatar name={MOCK_CURRENT_USER.displayName} size="sm" />
          <div className="side-nav__user-info">
            <span className="side-nav__user-name">{MOCK_CURRENT_USER.displayName}</span>
            <span className="side-nav__user-handle">@{MOCK_CURRENT_USER.nm_username}</span>
          </div>
          <button className="side-nav__user-more" aria-label="Plus d'options" onClick={e => e.preventDefault()}>
            <MoreHorizontal size={18} />
          </button>
        </Link>
      </nav>

      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
