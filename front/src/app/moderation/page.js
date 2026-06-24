'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Check, UserPlus, MoreHorizontal, Bell, UserX, UserCheck, ExternalLink } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Avatar from '../../components/ui/Avatar';
import CreateUserModal from '../../components/modals/CreateUserModal';
import { useLanguage } from '../../context/LanguageContext';

// TODO: API - GET /api/moderation/stats
// {
//   nb_active_members, pct_members_weekly_growth,
//   nb_posts_per_day, nb_posts_delta_vs_yesterday,
//   nb_pending_reports, nb_priority_reports,
//   pct_healthy_content, cd_healthy_trend: 'up'|'down'|'stable'
// }
const MOCK_STATS = [
  { value: '14,2k', labelKey: 'statMembersLabel', trend: '+3,1% cette semaine', cd_trend: 'up' },
  { value: '2 870', labelKey: 'statPostsLabel', trend: '+148 vs hier', cd_trend: 'up' },
  { value: '7', labelKey: 'statReportsLabel', trend: '2 prioritaires', cd_trend: 'warn' },
  { value: '99,2%', labelKey: 'statHealthyLabel', trendKey: 'statStable', cd_trend: 'neutral', fl_desktop_only: true },
];

// TODO: API - GET /api/moderation/queue?limit=2
const MOCK_REPORT_QUEUE = [
  {
    sk_id: 'r1',
    user: { nm_username: 'promo92', nm_display: 'compte_promo_92' },
    ts_relative: 'il y a 12 min',
    txt_content: 'Gagne 500€/jour depuis chez toi !!! Clique sur le lien dans ma bio pour rejoindre le groupe privé →',
    cd_reason: 'spam',
    nb_reports: 3,
  },
  {
    sk_id: 'r2',
    user: { nm_username: 'theom', nm_display: 'Théo Mercier' },
    ts_relative: 'il y a 1 h',
    txt_content: 'Réponse jugée agressive par un membre. À relire dans le contexte du fil avant décision.',
    cd_reason: 'hors_sujet',
    nb_reports: 1,
  },
];

const MOCK_FLAGGED_MEMBERS_INITIAL = [
  { nm_username: 'camille', nm_display: 'Camille Roche', cd_status: 'active' },
  { nm_username: 'theom', nm_display: 'Théo Mercier', cd_status: 'active' },
  { nm_username: 'promo92', nm_display: 'compte_promo_92', cd_status: 'suspended' },
];

const REASON_TAGS = {
  spam: 'tagSpam',
  hors_sujet: 'tagOffTopic',
  inappropriate: 'tagInappropriate',
  harassment: 'tagHarassment',
};

export default function ModerationPage() {
  const { t } = useLanguage();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [members, setMembers] = useState(MOCK_FLAGGED_MEMBERS_INITIAL);
  const [openMenuId, setOpenMenuId] = useState(null);

  function handleToggleStatus(nm_username) {
    // TODO: API - PATCH /api/moderation/members/:nm_username { cd_status }
    setMembers(prev => prev.map(m =>
      m.nm_username === nm_username
        ? { ...m, cd_status: m.cd_status === 'active' ? 'suspended' : 'active' }
        : m
    ));
    setOpenMenuId(null);
  }

  function getReasonLabel(cd_reason, nb_reports) {
    const tag = REASON_TAGS[cd_reason];
    const label = tag ? t(`moderation.${tag}`) : cd_reason;
    const count = nb_reports === 1
      ? t('moderation.reportCount', { count: nb_reports })
      : t('moderation.reportCountPlural', { count: nb_reports });
    return `${label} · ${count}`;
  }

  return (
    <AppLayout noSidebar>
      <header className="moderation-header">
        <div className="moderation-header__left">
          <div>
            <h1 className="moderation-header__title">{t('moderation.title')}</h1>
            <p className="moderation-header__subtitle">{t('moderation.subtitle')}</p>
          </div>
        </div>
        <div className="moderation-header__right">
          <span className="moderation-role-badge">
            <Lock size={11} />
            {t('moderation.moderatorRole')}
          </span>
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
        <div className="moderation-stats">
          {MOCK_STATS.map(stat => (
            <div
              key={stat.labelKey}
              className={`stat-card${stat.fl_desktop_only ? ' stat-card--desktop-only' : ''}`}
            >
              <span className={`stat-card__value${stat.cd_trend === 'warn' ? ' stat-card__value--warn' : ''}`}>
                {stat.value}
              </span>
              <span className="stat-card__label">{t(`moderation.${stat.labelKey}`)}</span>
              <span className={`stat-card__trend stat-card__trend--${stat.cd_trend}`}>
                {stat.trendKey ? t(`moderation.${stat.trendKey}`) : stat.trend}
              </span>
            </div>
          ))}
        </div>

        <section>
          <div className="moderation-section__header">
            <h2 className="moderation-section__title">{t('moderation.queueTitle')}</h2>
            <Link href="/moderation/queue" className="moderation-section__action">
              {t('moderation.history')}
            </Link>
          </div>
          <div className="report-queue">
            {MOCK_REPORT_QUEUE.map(item => (
              <div key={item.sk_id} className="report-item">
                <div className="report-item__user-row">
                  <Avatar name={item.user.nm_display} size="md" />
                  <div className="report-item__user-info">
                    <span className="report-item__name">{item.user.nm_display}</span>
                    <span className="report-item__time">{item.ts_relative}</span>
                  </div>
                  <span className="report-tag">
                    <Bell size={10} />
                    {getReasonLabel(item.cd_reason, item.nb_reports)}
                  </span>
                </div>

                <p className="report-item__content">{item.txt_content}</p>

                <div className="report-item__actions">
                  <button className="report-action-btn report-action-btn--keep">
                    <Check size={14} strokeWidth={2.5} />
                    {t('moderation.actionKeep')}
                  </button>
                  <button className="report-action-btn report-action-btn--hide">
                    {t('moderation.actionHide')}
                  </button>
                  <button className="report-action-btn report-action-btn--ban">
                    <Lock size={13} />
                    {t('moderation.actionBan')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="moderation-section__header">
            <h2 className="moderation-section__title">{t('moderation.membersTitle')}</h2>
            <Link href="/moderation/members" className="moderation-section__action">
              {t('moderation.allMembers')}
            </Link>
          </div>
          <div className="member-list">
            {members.map(member => (
              <div key={member.nm_username} className="member-row">
                <Avatar name={member.nm_display} size="md" />
                <div className="member-row__info">
                  <span className="member-row__name">{member.nm_display}</span>
                  <span className="member-row__handle">@{member.nm_username}</span>
                </div>
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
        </section>
      </div>

      {openMenuId && <div className="menu-backdrop" onClick={() => setOpenMenuId(null)} />}

      {showCreateUserModal && (
        <CreateUserModal onClose={() => setShowCreateUserModal(false)} />
      )}
    </AppLayout>
  );
}
