'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Home, Search, Bell, User, Settings, PenLine, MoreHorizontal, Shield } from 'lucide-react';
import Avatar from '../ui/Avatar';
import CreatePostModal from '../modals/CreatePostModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function SideNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const NAV_ITEMS = [
    { href: '/feed', icon: Home, label: t('nav.feed'), notifKey: false },
    { href: '/search', icon: Search, label: t('nav.discover') },
    { href: '/notifications', icon: Bell, label: t('nav.notifications'), notifKey: true },
    { href: '/profile/me', icon: User, label: t('nav.profile') },
    { href: '/settings', icon: Settings, label: t('nav.settings') },
    { href: '/moderation', icon: Shield, label: t('nav.moderation') },
  ];

  // TODO: API - GET /api/notifications/unread-count
  const hasNotifications = false;

  return (
    <>
      <nav className="side-nav">
        <Link href="/feed" className="side-nav__logo">
          <Image
            src="/breezy_logo-green_bg.png"
            alt="Breezy"
            width={32}
            height={32}
            className="side-nav__logo-icon"
          />
          Breezy
        </Link>

        <ul className="side-nav__list">
          {NAV_ITEMS.map(({ href, icon: Icon, label, notifKey, matchPrefix }) => {
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
                    {notifKey && hasNotifications && (
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
          {t('nav.newPost')}
        </button>

        <Link href={`/profile/${user?.username ?? 'me'}`} className="side-nav__user">
          <Avatar name={user?.username ?? ''} size="sm" />
          <div className="side-nav__user-info">
            <span className="side-nav__user-name">{user?.username ?? ''}</span>
            <span className="side-nav__user-handle">@{user?.username ?? ''}</span>
          </div>
          <button className="side-nav__user-more" aria-label={t('nav.moreOptions')} onClick={e => e.preventDefault()}>
            <MoreHorizontal size={18} />
          </button>
        </Link>
      </nav>

      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
