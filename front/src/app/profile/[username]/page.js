'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Settings } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar, { getColor } from '../../../components/ui/Avatar';
import PostCard from '../../../components/post/PostCard';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { useAppEvents } from '../../../context/AppEventsContext';
import { getProfileByUsernameApi } from '../../../lib/api/users.api';
import { followApi, unfollowApi, getFollowersApi, getFollowingApi } from '../../../lib/api/follows.api';
import { getPostsByUserApi } from '../../../lib/api/posts.api';

export default function ProfilePage({ params }) {
  const { username: rawUsername } = use(params);
  const router = useRouter();
  const { t, dateLocale } = useLanguage();
  const { user } = useAuth();
  const { ownPostsVersion, notifyFollowChanged } = useAppEvents();

  const username = rawUsername === 'me' ? user?.username : rawUsername;
  const isOwnProfile = username === user?.username;

  const [profile, setProfile] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    getProfileByUsernameApi(username)
      .then(async p => {
        if (!p) { setLoading(false); return; }
        setProfile(p);
        setProfileId(isOwnProfile ? user.profileId : p.id);

        const followQueryId = isOwnProfile ? user.profileId : p.id;
        const [followers, followingList, postsData] = await Promise.all([
          getFollowersApi(followQueryId).catch(() => []),
          getFollowingApi(followQueryId).catch(() => []),
          getPostsByUserApi(isOwnProfile ? user.profileId : p.id, 1, 20, p.username).catch(() => ({ posts: [] })),
        ]);

        setFollowersCount(Array.isArray(followers) ? followers.length : 0);
        setFollowingCount(Array.isArray(followingList) ? followingList.length : 0);
        setPosts(postsData.posts ?? []);

        if (!isOwnProfile && user) {
          const myFollowing = await getFollowingApi(user.profileId).catch(() => []);
          setFollowing(Array.isArray(myFollowing) && myFollowing.includes(p.id));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username, user]);

  const loadPosts = useCallback(() => {
    if (!profileId || !profile) return;
    getPostsByUserApi(profileId, 1, 20, profile.username)
      .then(data => setPosts(data.posts ?? []))
      .catch(console.error);
  }, [profileId, profile]);

  useEffect(() => {
    if (ownPostsVersion > 0 && isOwnProfile) loadPosts();
  }, [ownPostsVersion]);

  async function handleFollowToggle() {
    if (!user || !profile) return;
    const myId = user.profileId;
    if (following) {
      setFollowing(false);
      setFollowersCount(c => c - 1);
      await unfollowApi(myId, profile.id).catch(() => {
        setFollowing(true);
        setFollowersCount(c => c + 1);
      });
      notifyFollowChanged();
    } else {
      setFollowing(true);
      setFollowersCount(c => c + 1);
      await followApi(myId, profile.id).catch(() => {
        setFollowing(false);
        setFollowersCount(c => c - 1);
      });
      notifyFollowChanged();
    }
  }

  if (loading) {
    return <AppLayout><p className="feed-status">Chargement…</p></AppLayout>;
  }

  if (!profile) {
    return <AppLayout><p className="search-empty">{t('profile.notFound')}</p></AppLayout>;
  }

  return (
    <AppLayout>
      <header className="profile-page-header">
        <button className="profile-page-header__back" onClick={() => router.back()} aria-label={t('common.back')}>
          <ChevronLeft size={22} />
        </button>
        <span className="profile-page-header__username">@{profile.username}</span>
        {isOwnProfile && (
          <button className="profile-page-header__settings" onClick={() => router.push('/settings')} aria-label={t('profile.settingsLabel')}>
            <Settings size={20} />
          </button>
        )}
      </header>

      <div
        className="profile-banner"
        style={{ '--banner-color': getColor(profile.username) }}
      />

      <div className="profile-hero">
        <div className="profile-hero__top">
          <Avatar name={profile.username} size="lg" />
          {isOwnProfile ? (
            <button className="profile-hero__btn profile-hero__btn--edit" onClick={() => router.push('/settings')}>{t('profile.editProfile')}</button>
          ) : (
            <button
              className={`profile-hero__btn${following ? ' profile-hero__btn--following' : ''}`}
              onClick={handleFollowToggle}
            >
              {following ? t('profile.following') : t('profile.follow')}
            </button>
          )}
        </div>

        <div className="profile-hero__identity">
          <span className="profile-hero__name">{profile.username}</span>
          <span className="profile-hero__handle">@{profile.username}</span>
        </div>

        {profile.bio && (
          <p className="profile-hero__bio">{profile.bio}</p>
        )}

        <div className="profile-hero__stats">
          <span className="profile-hero__stat">
            <strong>{followingCount.toLocaleString(dateLocale)}</strong> {t('profile.followingCount')}
          </span>
          <span className="profile-hero__stat">
            <strong>{followersCount.toLocaleString(dateLocale)}</strong> {t('profile.followersCount')}
          </span>
        </div>
      </div>

      <div className="feed-list">
        {posts.map(post => (
          <PostCard key={post.sk_id} post={post} />
        ))}
      </div>
    </AppLayout>
  );
}
