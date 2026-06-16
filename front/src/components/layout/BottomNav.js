'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, Search, PenLine, Bell, User } from 'lucide-react';
import CreatePostModal from '../modals/CreatePostModal';
import { useLanguage } from '../../context/LanguageContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // TODO: API - GET /api/notifications/unread-count
  const hasNotifications = false;

  return (
    <>
      <nav className="bottom-nav">
        <ul className="bottom-nav__list">
          <li>
            <Link href="/feed" className={`bottom-nav__item${pathname === '/feed' ? ' bottom-nav__item--active' : ''}`} aria-label={t('nav.home')}>
              <Home size={22} />
            </Link>
          </li>
          <li>
            <Link href="/search" className={`bottom-nav__item${pathname === '/search' ? ' bottom-nav__item--active' : ''}`} aria-label={t('nav.search')}>
              <Search size={22} />
            </Link>
          </li>
          <li>
            <button className="bottom-nav__create-btn" onClick={() => setShowCreateModal(true)} aria-label={t('nav.createPost')}>
              <PenLine size={20} strokeWidth={2.5} />
            </button>
          </li>
          <li className="bottom-nav__notif-wrapper">
            <Link href="/notifications" className={`bottom-nav__item${pathname === '/notifications' ? ' bottom-nav__item--active' : ''}`} aria-label={t('nav.notifications')}>
              <Bell size={22} />
            </Link>
            {hasNotifications && <span className="bottom-nav__notif-dot" />}
          </li>
          <li>
            <Link href="/profile/me" className={`bottom-nav__item${pathname.startsWith('/profile') ? ' bottom-nav__item--active' : ''}`} aria-label={t('nav.myProfile')}>
              <User size={22} />
            </Link>
          </li>
        </ul>
      </nav>
      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
