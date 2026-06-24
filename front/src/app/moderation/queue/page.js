'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Lock, Bell } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar from '../../../components/ui/Avatar';
import { useLanguage } from '../../../context/LanguageContext';

// TODO: API - GET /api/moderation/queue?reason={filter}&page={page}&limit=20
// { items: ReportItem[], nb_total, nb_pages }
const MOCK_QUEUE = [
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
  {
    sk_id: 'r3',
    user: { nm_username: 'alex_b', nm_display: 'Alexandre Bonnet' },
    ts_relative: 'il y a 3 h',
    txt_content: 'Contenu signalé pour discours inapproprié envers un autre membre de la communauté.',
    cd_reason: 'harassment',
    nb_reports: 2,
  },
];

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

export default function ModerationQueuePage() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? MOCK_QUEUE
    : MOCK_QUEUE.filter(item => item.cd_reason === activeFilter);

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
              <div key={item.sk_id} className="report-item">
                <div className="report-item__user-row">
                  <Avatar name={item.user.nm_display} size="md" />
                  <div className="report-item__user-info">
                    <span className="report-item__name">{item.user.nm_display}</span>
                    <span className="report-item__time">{item.ts_relative}</span>
                  </div>
                  <span className="report-tag report-tag--visible">
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
                  <button className="report-action-btn report-action-btn--ban report-action-btn--always-visible">
                    <Lock size={13} />
                    {t('moderation.actionBan')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
