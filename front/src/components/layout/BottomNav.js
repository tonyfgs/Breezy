'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, Search, PenLine, User, Shield } from 'lucide-react';
import CreatePostModal from '../modals/CreatePostModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const canModerate = ['moderator', 'admin'].includes(user?.role);

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
          {canModerate && (
            <li>
              <Link href="/moderation" className={`bottom-nav__item${pathname.startsWith('/moderation') ? ' bottom-nav__item--active' : ''}`} aria-label={t('nav.moderation')}>
                <Shield size={22} />
              </Link>
            </li>
          )}
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
