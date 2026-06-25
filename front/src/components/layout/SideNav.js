'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Home, Search, User, Settings, PenLine, LogOut, Shield } from 'lucide-react';
import Avatar from '../ui/Avatar';
import CreatePostModal from '../modals/CreatePostModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const canModerate = ['moderator', 'admin'].includes(user?.role);

  const NAV_ITEMS = [
    { href: '/feed', icon: Home, label: t('nav.feed') },
    { href: '/search', icon: Search, label: t('nav.discover') },
    { href: '/profile/me', icon: User, label: t('nav.profile') },
    { href: '/settings', icon: Settings, label: t('nav.settings') },
    ...(canModerate ? [{ href: '/moderation', icon: Shield, label: t('nav.moderation') }] : []),
  ];

  function handleLogout() {
    logout();
    router.push('/login');
  }

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
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`side-nav__item${pathname === href || pathname.startsWith(href + '/') ? ' side-nav__item--active' : ''}`}
              >
                <Icon size={20} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="side-nav__create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <PenLine size={18} strokeWidth={2.5} />
          {t('nav.newPost')}
        </button>

        <div className="side-nav__user">
          <Link href={`/profile/${user?.username ?? 'me'}`} className="side-nav__user-link">
            <Avatar name={user?.username ?? ''} size="sm" />
            <div className="side-nav__user-info">
              <span className="side-nav__user-name">{user?.username ?? ''}</span>
              <span className="side-nav__user-handle">@{user?.username ?? ''}</span>
            </div>
          </Link>
          <button className="side-nav__logout-btn" onClick={handleLogout} aria-label={t('settings.logout')}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
