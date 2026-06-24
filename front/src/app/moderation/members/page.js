'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, MoreHorizontal, Search, UserX, UserCheck, ExternalLink } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar from '../../../components/ui/Avatar';
import CreateUserModal from '../../../components/modals/CreateUserModal';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { getAllSanctionsApi, revokeSanctionApi, createSanctionApi } from '../../../lib/api/moderation.api';
import { getAllProfilesApi } from '../../../lib/api/users.api';

const STATUS_FILTERS = ['all', 'active', 'suspended'];

const FILTER_KEYS = {
  all: 'filterAll',
  active: 'filterActive',
  suspended: 'filterSuspended',
};

function formatJoined(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

export default function ModerationMembersPage() {
  const { t } = useLanguage();
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  useEffect(() => {
    Promise.all([
      getAllProfilesApi().catch(() => []),
      getAllSanctionsApi().catch(() => []),
    ]).then(([users, sanctions]) => {
      const activeSanctionByUser = {};
      for (const s of sanctions) {
        if (s.targetType === 'user' && s.fl_active === 1) {
          activeSanctionByUser[s.targetId] = s.id;
        }
      }

      const list = users.map(u => ({
        profileId: u.id,
        nm_username: u.username,
        nm_display: u.username,
        cd_status: activeSanctionByUser[u.id] ? 'suspended' : 'active',
        sanctionId: activeSanctionByUser[u.id] ?? null,
        ts_joined: formatJoined(u.createdAt),
      }));
      setMembers(list);
    });
  }, []);

  async function handleToggleStatus(profileId) {
    const member = members.find(m => m.profileId === profileId);
    if (!member) return;

    if (member.cd_status === 'suspended' && member.sanctionId) {
      await revokeSanctionApi(member.sanctionId).catch(console.error);
      setMembers(prev => prev.map(m =>
        m.profileId === profileId ? { ...m, cd_status: 'active', sanctionId: null } : m
      ));
    } else {
      const sanction = await createSanctionApi({
        targetId: profileId,
        targetType: 'user',
        moderatorId: currentUser?.profileId,
        reason: 'suspension manuelle',
        type: 'ban',
      }).catch(console.error);
      if (sanction) {
        setMembers(prev => prev.map(m =>
          m.profileId === profileId ? { ...m, cd_status: 'suspended', sanctionId: sanction.id } : m
        ));
      }
    }
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
              <div key={member.profileId} className="member-row">
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
                    onClick={() => setOpenMenuId(openMenuId === member.profileId ? null : member.profileId)}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  {openMenuId === member.profileId && (
                    <div className="member-menu">
                      <Link href={`/profile/${member.nm_username}`} className="member-menu__item">
                        <ExternalLink size={14} />
                        {t('moderation.viewProfile')}
                      </Link>
                      <div className="member-menu__divider" />
                      <button
                        className={`member-menu__item ${member.cd_status === 'active' ? 'member-menu__item--warn' : 'member-menu__item--success'}`}
                        onClick={() => handleToggleStatus(member.profileId)}
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
