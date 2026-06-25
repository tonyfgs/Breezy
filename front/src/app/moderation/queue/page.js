'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Lock, Bell } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar from '../../../components/ui/Avatar';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { getAllReportsApi, updateReportApi, createSanctionApi } from '../../../lib/api/moderation.api';
import { getAllProfilesApi } from '../../../lib/api/users.api';
import { getPostRawApi } from '../../../lib/api/posts.api';

const REASON_FILTERS = ['all', 'spam', 'hors_sujet', 'harassment', 'inappropriate'];

const REASON_TAGS = {
  spam: 'tagSpam',
  hors_sujet: 'tagOffTopic',
  inappropriate: 'tagInappropriate',
  harassment: 'tagHarassment',
};

const FILTER_KEYS = {
  all: 'filterAll',
  spam: 'tagSpam',
  hors_sujet: 'tagOffTopic',
  harassment: 'tagHarassment',
  inappropriate: 'tagInappropriate',
};

function formatRelative(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.floor(h / 24)} j`;
}

export default function ModerationQueuePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    Promise.all([
      getAllReportsApi().catch(() => []),
      getAllProfilesApi().catch(() => []),
    ]).then(async ([rawReports, users]) => {
      const userById = Object.fromEntries(users.map(u => [u.id, u]));

      const postIds = [...new Set(rawReports.filter(r => r.targetType === 'post').map(r => r.targetId))];
      const posts = await Promise.all(postIds.map(id => getPostRawApi(id).catch(() => null)));
      const postById = Object.fromEntries(postIds.map((id, i) => [id, posts[i]]));

      const items = rawReports.map(r => {
        const reporter = userById[r.reporterId];
        let targetName, postContent, authorUsername;

        if (r.targetType === 'post') {
          const post = postById[r.targetId];
          const author = post ? userById[post.authorId] : null;
          authorUsername = author?.username ?? post?.authorId ?? r.targetId;
          targetName = authorUsername;
          postContent = post?.content ?? null;
        } else {
          const target = userById[r.targetId];
          targetName = target?.username ?? r.targetId;
          postContent = null;
          authorUsername = targetName;
        }

        return {
          id: r.id,
          targetId: r.targetId,
          targetType: r.targetType,
          targetName,
          authorUsername,
          postContent,
          reporter: reporter?.username ?? r.reporterId,
          cd_reason: r.reason,
          status: r.status,
          ts_relative: formatRelative(r.createdAt),
        };
      }).sort((a, b) => {
        const order = { pending: 0, reviewed: 1, dismissed: 2 };
        return (order[a.status] ?? 3) - (order[b.status] ?? 3);
      });

      setReports(items);
    });
  }, []);

  async function handleKeepReport(reportId) {
    await updateReportApi(reportId, { status: 'reviewed' }).catch(console.error);
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'reviewed' } : r));
  }

  async function handleReviewReport(reportId) {
    await updateReportApi(reportId, { status: 'reviewed' }).catch(console.error);
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'reviewed' } : r));
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
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'reviewed' } : r));
  }

  function getReasonLabel(cd_reason) {
    const tag = REASON_TAGS[cd_reason];
    return tag ? t(`moderation.${tag}`) : cd_reason;
  }

  const filtered = activeFilter === 'all'
    ? reports
    : reports.filter(r => r.cd_reason === activeFilter);

  return (
    <AppLayout noSidebar>
      <header className="moderation-header">
        <div className="moderation-header__left">
          <Link href="/moderation" className="moderation-back-btn" aria-label={t('common.back')}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="moderation-header__title">{t('moderation.queueTitle')}</h1>
            <p className="moderation-header__subtitle">{t('moderation.subtitle')}</p>
          </div>
        </div>
      </header>

      <div className="moderation-body">
        <div className="filter-tabs">
          {REASON_FILTERS.map(filter => (
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
          <p className="moderation-empty">{t('moderation.emptyQueue')}</p>
        ) : (
          <div className="report-queue report-queue--full">
            {filtered.map(item => (
              <div key={item.id} className={`report-item${item.status !== 'pending' ? ' report-item--resolved' : ''}`}>
                <div className="report-item__user-row">
                  <Avatar name={item.authorUsername} size="md" />
                  <div className="report-item__user-info">
                    <span className="report-item__name">@{item.authorUsername}</span>
                    <span className="report-item__time">
                      {t('moderation.reportedBy')} @{item.reporter} · {item.ts_relative}
                    </span>
                  </div>
                  <span className="report-tag report-tag--visible">
                    <Bell size={10} />
                    {getReasonLabel(item.cd_reason)}
                  </span>
                  <span className={`report-status report-status--${item.status}`}>
                    {t(`moderation.status_${item.status}`)}
                  </span>
                </div>

                {item.postContent && (
                  <p className="report-item__content">{item.postContent}</p>
                )}

                {item.status === 'pending' && (
                  <div className="report-item__actions">
                    <button className="report-action-btn report-action-btn--keep" onClick={() => handleKeepReport(item.id)}>
                      <Check size={14} strokeWidth={2.5} />
                      {t('moderation.actionKeep')}
                    </button>
                    <button className="report-action-btn report-action-btn--ban report-action-btn--always-visible" onClick={() => handleBanReport(item.id, item.targetId, item.targetType, item.cd_reason)}>
                      <Lock size={13} />
                      {t('moderation.actionBan')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
