'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Check, UserPlus, MoreHorizontal, Bell, UserCheck, ExternalLink } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Avatar from '../../components/ui/Avatar';
import CreateUserModal from '../../components/modals/CreateUserModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  getModerationStatsApi,
  getPendingReportsApi,
  updateReportApi,
  getActiveSanctionsApi,
  revokeSanctionApi,
  createSanctionApi,
} from '../../lib/api/moderation.api';
import { getAllProfilesApi } from '../../lib/api/users.api';
import { getPostRawApi } from '../../lib/api/posts.api';

const REASON_TAGS = {
  spam: 'tagSpam',
  hors_sujet: 'tagOffTopic',
  inappropriate: 'tagInappropriate',
  harassment: 'tagHarassment',
};

function formatRelative(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.floor(h / 24)} j`;
}

export default function ModerationPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [stats, setStats] = useState(null);
  const [reportQueue, setReportQueue] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    Promise.all([
      getModerationStatsApi().catch(() => null),
      getPendingReportsApi().catch(() => []),
      getActiveSanctionsApi('user').catch(() => []),
      getAllProfilesApi().catch(() => []),
    ]).then(async ([statsData, reports, sanctions, users]) => {
      setStats(statsData);

      const userById = Object.fromEntries(users.map(u => [u.id, u]));

      const postIds = [...new Set(reports.filter(r => r.targetType === 'post').map(r => r.targetId))];
      const posts = await Promise.all(postIds.map(id => getPostRawApi(id).catch(() => null)));
      const postById = Object.fromEntries(postIds.map((id, i) => [id, posts[i]]));

      const grouped = {};
      for (const r of reports) {
        if (!grouped[r.targetId]) grouped[r.targetId] = { report: r, count: 0 };
        grouped[r.targetId].count++;
      }
      const queue = Object.values(grouped)
        .sort((a, b) => b.count - a.count)
        .slice(0, 2)
        .map(({ report: r, count }) => {
          let authorUsername, postContent;
          if (r.targetType === 'post') {
            const post = postById[r.targetId];
            const author = post ? userById[post.authorId] : null;
            authorUsername = author?.username ?? post?.authorId ?? r.targetId;
            postContent = post?.content ?? null;
          } else {
            authorUsername = userById[r.targetId]?.username ?? r.targetId;
            postContent = null;
          }
          const reporter = userById[r.reporterId];
          return {
            id: r.id,
            targetId: r.targetId,
            targetType: r.targetType,
            authorUsername,
            postContent,
            reporter: reporter?.username ?? r.reporterId,
            ts_relative: formatRelative(r.createdAt),
            cd_reason: r.reason,
            nb_reports: count,
          };
        });
      setReportQueue(queue);

      const memberList = sanctions.map(s => ({
        sanctionId: s.id,
        nm_username: userById[s.targetId]?.username ?? s.targetId,
        nm_display: userById[s.targetId]?.username ?? s.targetId,
        cd_status: 'suspended',
      }));
      setMembers(memberList);
    });
  }, []);

  async function handleKeepReport(reportId) {
    await updateReportApi(reportId, { status: 'reviewed' }).catch(console.error);
    setReportQueue(prev => prev.filter(r => r.id !== reportId));
  }

  async function handleBanReport(reportId, targetId, targetType, reason) {
    await createSanctionApi({
      targetId,
      targetType,
      moderatorId: user?.profileId,
      reason,
      reportId,
      type: 'ban',
    }).catch(err => { if (err?.status !== 409) throw err; });
    await updateReportApi(reportId, { status: 'reviewed' }).catch(console.error);
    setReportQueue(prev => prev.filter(r => r.id !== reportId));
  }

  async function handleRevokeSanction(sanctionId) {
    await revokeSanctionApi(sanctionId).catch(console.error);
    setMembers(prev => prev.filter(m => m.sanctionId !== sanctionId));
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
            {user?.role ?? t('moderation.moderatorRole')}
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
          <div className="stat-card">
            <span className="stat-card__value">{stats?.nb_active_members ?? '—'}</span>
            <span className="stat-card__label">{t('moderation.statMembersLabel')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{stats?.nb_posts_per_day ?? '—'}</span>
            <span className="stat-card__label">{t('moderation.statPostsLabel')}</span>
          </div>
          <div className="stat-card">
            <span className={`stat-card__value${stats?.nb_pending_reports > 0 ? ' stat-card__value--warn' : ''}`}>
              {stats?.nb_pending_reports ?? '—'}
            </span>
            <span className="stat-card__label">{t('moderation.statReportsLabel')}</span>
          </div>
          <div className="stat-card stat-card--desktop-only">
            <span className="stat-card__value">{stats ? `${stats.pct_healthy_content}%` : '—'}</span>
            <span className="stat-card__label">{t('moderation.statHealthyLabel')}</span>
          </div>
        </div>

        <section>
          <div className="moderation-section__header">
            <h2 className="moderation-section__title">{t('moderation.queueTitle')}</h2>
            <Link href="/moderation/queue" className="moderation-section__action">
              {t('moderation.history')}
            </Link>
          </div>
          <div className="report-queue">
            {reportQueue.map(item => (
              <div key={item.id} className="report-item">
                <div className="report-item__user-row">
                  <Avatar name={item.authorUsername} size="md" />
                  <div className="report-item__user-info">
                    <span className="report-item__name">@{item.authorUsername}</span>
                    <span className="report-item__time">
                      {t('moderation.reportedBy')} @{item.reporter} · {item.ts_relative}
                    </span>
                  </div>
                  <span className="report-tag">
                    <Bell size={10} />
                    {getReasonLabel(item.cd_reason, item.nb_reports)}
                  </span>
                </div>

                {item.postContent && (
                  <p className="report-item__content">{item.postContent}</p>
                )}

                <div className="report-item__actions">
                  <button className="report-action-btn report-action-btn--keep" onClick={() => handleKeepReport(item.id)}>
                    <Check size={14} strokeWidth={2.5} />
                    {t('moderation.actionKeep')}
                  </button>
                  <button className="report-action-btn report-action-btn--ban" onClick={() => handleBanReport(item.id, item.targetId, item.targetType, item.cd_reason)}>
                    <Lock size={13} />
                    {t('moderation.actionBan')}
                  </button>
                </div>
              </div>
            ))}
            {reportQueue.length === 0 && (
              <p className="moderation-empty">{t('moderation.noReports')}</p>
            )}
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
                        className="member-menu__item member-menu__item--success"
                        onClick={() => handleRevokeSanction(member.sanctionId)}
                      >
                        <UserCheck size={14} />
                        {t('moderation.cancelSuspension')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <p className="moderation-empty">{t('moderation.noMembers')}</p>
            )}
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
