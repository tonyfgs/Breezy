'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, MoreHorizontal, Search, UserX, UserCheck, ExternalLink } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar from '../../../components/ui/Avatar';
import CreateUserModal from '../../../components/modals/CreateUserModal';
import { useLanguage } from '../../../context/LanguageContext';

// TODO: API - GET /api/moderation/members?status={filter}&search={query}&page={page}&limit=20
// { items: Member[], nb_total, nb_pages }
const MOCK_MEMBERS_INITIAL = [
  { nm_username: 'camille', nm_display: 'Camille Roche', cd_status: 'active', ts_joined: 'jan. 2024' },
  { nm_username: 'theom', nm_display: 'Théo Mercier', cd_status: 'active', ts_joined: 'fév. 2024' },
  { nm_username: 'promo92', nm_display: 'compte_promo_92', cd_status: 'suspended', ts_joined: 'mars 2024' },
  { nm_username: 'alex_b', nm_display: 'Alexandre Bonnet', cd_status: 'active', ts_joined: 'avr. 2024' },
  { nm_username: 'marie_l', nm_display: 'Marie Laurent', cd_status: 'active', ts_joined: 'avr. 2024' },
];

const STATUS_FILTERS = ['all', 'active', 'suspended'];

const FILTER_KEYS = {
  all: 'filterAll',
  active: 'filterActive',
  suspended: 'filterSuspended',
};

export default function ModerationMembersPage() {
  const { t } = useLanguage();
  const [members, setMembers] = useState(MOCK_MEMBERS_INITIAL);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  function handleToggleStatus(nm_username) {
    // TODO: API - PATCH /api/moderation/members/:nm_username { cd_status }
    setMembers(prev => prev.map(m =>
      m.nm_username === nm_username
        ? { ...m, cd_status: m.cd_status === 'active' ? 'suspended' : 'active' }
        : m
    ));
    setOpenMenuId(null);
  }

  const filtered = members.filter(member => {
    const matchesFilter = activeFilter === 'all' || member.cd_status === activeFilter;
    const matchesSearch = !searchQuery.trim()
      || member.nm_display.toLowerCase().includes(searchQuery.toLowerCase())
      || member.nm_username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AppLayout noSidebar>
      <header className="moderation-header">
        <div className="moderation-header__left">
          <Link href="/moderation" className="moderation-back-btn" aria-label={t('common.back')}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="moderation-header__title">{t('moderation.membersTitle')}</h1>
            <p className="moderation-header__subtitle">{t('moderation.subtitle')}</p>
          </div>
        </div>
        <div className="moderation-header__right">
          <button
            className="moderation-create-btn"
            onClick={() => setShowCreateUserModal(true)}
            aria-label={t('moderation.createUser')}
          >
            <UserPlus size={16} />
            <span className="moderation-create-btn__label">{t('moderation.createUser')}</span>
          </button>
        </div>
      </header>

      <div className="moderation-body">
        <div className="moderation-search">
          <span className="moderation-search__icon">
            <Search size={16} />
          </span>
          <input
            className="moderation-search__input"
            type="search"
            placeholder={t('moderation.searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {STATUS_FILTERS.map(filter => (
            <button
              key={filter}
              className={`filter-tab${activeFilter === filter ? ' filter-tab--active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {t(`moderation.${FILTER_KEYS[filter]}`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="moderation-empty">{t('moderation.emptyMembers')}</p>
        ) : (
          <div className="member-list">
            {filtered.map(member => (
              <div key={member.nm_username} className="member-row">
                <Avatar name={member.nm_display} size="md" />
                <div className="member-row__info">
                  <span className="member-row__name">{member.nm_display}</span>
                  <span className="member-row__handle">@{member.nm_username}</span>
                </div>
                <span className="member-row__joined">{member.ts_joined}</span>
                <span className={`member-status member-status--${member.cd_status}`}>
                  {member.cd_status === 'active'
                    ? t('moderation.statusActive')
                    : t('moderation.statusSuspended')}
                </span>
                <div className="member-actions">
                  <button
                    className="member-row__more"
                    aria-label={t('moderation.moreOptions')}
                    onClick={() => setOpenMenuId(openMenuId === member.nm_username ? null : member.nm_username)}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  {openMenuId === member.nm_username && (
                    <div className="member-menu">
                      <Link href={`/profile/${member.nm_username}`} className="member-menu__item">
                        <ExternalLink size={14} />
                        {t('moderation.viewProfile')}
                      </Link>
                      <div className="member-menu__divider" />
                      <button
                        className={`member-menu__item ${member.cd_status === 'active' ? 'member-menu__item--warn' : 'member-menu__item--success'}`}
                        onClick={() => handleToggleStatus(member.nm_username)}
                      >
                        {member.cd_status === 'active'
                          ? <><UserX size={14} />{t('moderation.suspendAccount')}</>
                          : <><UserCheck size={14} />{t('moderation.cancelSuspension')}</>}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {openMenuId && <div className="menu-backdrop" onClick={() => setOpenMenuId(null)} />}

      {showCreateUserModal && (
        <CreateUserModal onClose={() => setShowCreateUserModal(false)} />
      )}
    </AppLayout>
  );
}
