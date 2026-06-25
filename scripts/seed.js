#!/usr/bin/env node
/**
 * Breezy seed script — populates all microservice databases with sample data.
 *
 * Prerequisites: all services must be running (pnpm dev OR docker compose up)
 * Usage:        node scripts/seed.js [--reset]
 *               --reset : drop all data before seeding (not implemented — re-run is idempotent)
 *
 * Service URLs are read from env vars (defaults match docker-compose.dev.yml local ports):
 *   IAM_URL        (default: http://localhost:4001)
 *   USERS_URL      (default: http://localhost:4002)
 *   POSTS_URL      (default: http://localhost:4003)
 *   MODERATION_URL (default: http://localhost:4005)
 */

const IAM_URL        = process.env.IAM_URL        || 'http://localhost:4001';
const USERS_URL      = process.env.USERS_URL      || 'http://localhost:4002';
const POSTS_URL      = process.env.POSTS_URL      || 'http://localhost:4003';
const MODERATION_URL = process.env.MODERATION_URL || 'http://localhost:4005';

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_USERS = [
  { username: 'admin',      password: 'Admin123!',      role: 'admin',     bio: 'Platform administrator' },
  { username: 'moderator1', password: 'Moderator123!',  role: 'moderator', bio: 'Content moderator — keeping Breezy clean 🛡️' },
  { username: 'alice',      password: 'Alice123!',      role: 'user',      bio: 'Tech enthusiast & coffee lover ☕ | TypeScript fan' },
  { username: 'bob',        password: 'Bob123!',        role: 'user',      bio: 'Photographer | Nature lover 📷' },
  { username: 'charlie',    password: 'Charlie123!',    role: 'user',      bio: 'Developer by day, gamer by night 🎮' },
  { username: 'diana',      password: 'Diana123!',      role: 'user',      bio: 'Digital nomad 🌍 — working from somewhere beautiful' },
  { username: 'eve',        password: 'Eve123!',        role: 'user',      bio: 'Data scientist | AI researcher 🧠' },
];

// Posts authored by username; index matters — comments and likes reference these indices.
const SEED_POSTS = [
  /* 0  */ { by: 'alice',   content: 'Just started learning Rust! The borrow checker is something else... 🦀 #programming #rust', tags: ['programming', 'rust'] },
  /* 1  */ { by: 'alice',   content: 'Morning coffee ritual ☕ Nothing beats a good espresso to start the day! #coffee #morning', tags: ['coffee', 'morning'] },
  /* 2  */ { by: 'bob',     content: 'Captured this amazing sunset yesterday 🌅 — shot on a mirrorless, minimal post-processing. #photography #nature', tags: ['photography', 'nature'] },
  /* 3  */ { by: 'bob',     content: 'Golden hour is pure magic ✨ #photography #goldenhour', tags: ['photography', 'goldenhour'] },
  /* 4  */ { by: 'charlie', content: 'Finally finished my side project! A CLI tool for managing dotfiles. Open-sourced it today 🎉 #opensource #devtools', tags: ['opensource', 'devtools'] },
  /* 5  */ { by: 'charlie', content: 'Hot take: tabs > spaces. Change my mind. #programming #debate', tags: ['programming', 'debate'] },
  /* 6  */ { by: 'diana',   content: 'Just landed in Tokyo! The city at night is absolutely incredible 🗼 #travel #japan #tokyo', tags: ['travel', 'japan', 'tokyo'] },
  /* 7  */ { by: 'diana',   content: 'Street food in Bangkok is on another level 🍜 — pad kra pao for breakfast, why not? #travel #thailand #foodie', tags: ['travel', 'thailand', 'foodie'] },
  /* 8  */ { by: 'eve',     content: 'Interesting paper on transformer architectures for time-series forecasting — attention mechanism works surprisingly well here 📊 #ai #datascience', tags: ['ai', 'datascience'] },
  /* 9  */ { by: 'eve',     content: 'TIL about UMAP for dimensionality reduction. Massively outperforms t-SNE on large datasets! #datascience #ml', tags: ['datascience', 'ml'] },
  /* 10 */ { by: 'alice',   content: 'Docker Compose is a lifesaver for local dev environments — one command and everything just works 🐳 #devops #docker', tags: ['devops', 'docker'] },
  /* 11 */ { by: 'charlie', content: 'VSCode extension recommendations? Currently using Vim keybindings + GitHub Copilot. What\'s in your setup? #vscode #productivity', tags: ['vscode', 'productivity'] },
  /* 12 */ { by: 'bob',     content: 'Experimenting with long-exposure night photography 📷 — 30 second shutter, f/8, ISO 200. #photography #nightphotography', tags: ['photography', 'nightphotography'] },
  /* 13 */ { by: 'diana',   content: 'Working remotely from Lisbon this month 🇵🇹 The weather is perfect, the coffee is great, the WiFi is fast. What more could you want? #digitalnomad #portugal', tags: ['digitalnomad', 'portugal'] },
  /* 14 */ { by: 'eve',     content: 'Python 3.12 performance improvements are significant — benchmarks showing up to 25% speedup in CPU-bound code! #python #performance', tags: ['python', 'performance'] },
];

// Comments are replies — they reference a parent post by index in SEED_POSTS.
const SEED_COMMENTS = [
  { by: 'bob',     replyTo: 0,  content: 'Rust is amazing once it clicks! The borrow checker feels like a superpower after a while 💪' },
  { by: 'eve',     replyTo: 0,  content: 'I went through the same frustration. It does get better, promise 😄 — just wait until you write your first async Rust program' },
  { by: 'alice',   replyTo: 2,  content: 'Stunning shot! What camera body and lens are you using? 📸' },
  { by: 'diana',   replyTo: 2,  content: 'Absolutely gorgeous. Where was this taken?' },
  { by: 'alice',   replyTo: 4,  content: 'This sounds super useful! Is the repo on GitHub? Would love to try it.' },
  { by: 'eve',     replyTo: 5,  content: 'Spaces team represent — we will not surrender 😂' },
  { by: 'charlie', replyTo: 6,  content: 'Tokyo is incredible! Don\'t miss Shinjuku at night and Yanaka for the old-town vibes 🏮' },
  { by: 'alice',   replyTo: 8,  content: 'Great find! Do you have the arXiv link?' },
  { by: 'bob',     replyTo: 9,  content: 'I\'ve been meaning to try UMAP — does it preserve global structure better than t-SNE?' },
  { by: 'charlie', replyTo: 14, content: 'The JIT improvements are wild. Were you testing this with CPython or an alternative runtime?' },
];

// Who follows whom — by username.
const SEED_FOLLOWS = [
  { from: 'alice',      to: 'bob' },
  { from: 'alice',      to: 'charlie' },
  { from: 'alice',      to: 'eve' },
  { from: 'bob',        to: 'alice' },
  { from: 'bob',        to: 'diana' },
  { from: 'charlie',    to: 'alice' },
  { from: 'charlie',    to: 'eve' },
  { from: 'diana',      to: 'alice' },
  { from: 'diana',      to: 'bob' },
  { from: 'diana',      to: 'charlie' },
  { from: 'eve',        to: 'alice' },
  { from: 'eve',        to: 'diana' },
  { from: 'moderator1', to: 'alice' },
];

// Likes: { by: username, post: index in the final posts array (SEED_POSTS + SEED_COMMENTS merged) }
const SEED_LIKES = [
  { by: 'bob',      post: 0 },
  { by: 'charlie',  post: 0 },
  { by: 'eve',      post: 0 },
  { by: 'alice',    post: 2 },
  { by: 'diana',    post: 2 },
  { by: 'alice',    post: 4 },
  { by: 'diana',    post: 4 },
  { by: 'alice',    post: 6 },
  { by: 'charlie',  post: 6 },
  { by: 'alice',    post: 8 },
  { by: 'charlie',  post: 9 },
  { by: 'alice',    post: 14 },
  { by: 'bob',      post: 14 },
  { by: 'diana',    post: 10 },
  { by: 'charlie',  post: 13 },
];

// Reports (reported by regular users; targetType: 'post' or 'user')
const SEED_REPORTS = [
  { by: 'alice',   targetType: 'post', postIndex: 5, reason: 'Incites unnecessary divisive debate' },
  { by: 'charlie', targetType: 'post', postIndex: 5, reason: 'Inflammatory content' },
];

// ─── API helpers ──────────────────────────────────────────────────────────────

async function api(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  return res;
}

function extractToken(res) {
  const cookie = res.headers.get('set-cookie') || '';
  const match = cookie.match(/(?:^|,\s*)token=([^;,]+)/);
  return match?.[1] ?? null;
}

function decodeJwt(token) {
  const payload = token.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64url').toString());
}

// ─── Seeding steps ────────────────────────────────────────────────────────────

async function registerUser(user) {
  const res = await api(`${IAM_URL}/auth/register`, {
    method: 'POST',
    body: { username: user.username, password: user.password, role: user.role },
  });
  if (res.status === 409) return 'exists';
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Register '${user.username}' failed ${res.status}: ${text}`);
  }
  return 'created';
}

async function loginUser(username, password) {
  const res = await api(`${IAM_URL}/auth/login`, {
    method: 'POST',
    body: { username, password },
  });
  if (!res.ok) throw new Error(`Login '${username}' failed: ${res.status}`);
  const token = extractToken(res);
  if (!token) throw new Error(`No token cookie in login response for '${username}'`);
  const payload = decodeJwt(token);
  return { token, profileId: payload.profileId, iamId: payload.iamId };
}

async function updateProfile(profileId, token, fields) {
  const res = await api(`${USERS_URL}/users/${profileId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: fields,
  });
  if (!res.ok) console.warn(`    ⚠️  Profile update for ${profileId} returned ${res.status}`);
}

async function createPost(token, body) {
  const res = await api(`${POSTS_URL}/posts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Post creation failed ${res.status}: ${text}`);
  }
  return res.json();
}

async function createFollow(token, followingId) {
  const res = await api(`${USERS_URL}/follows/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { followingId },
  });
  // 409 = already following — ignore
  if (!res.ok && res.status !== 409) {
    console.warn(`    ⚠️  Follow failed: ${res.status}`);
  }
}

async function likePost(token, postId) {
  const res = await api(`${POSTS_URL}/posts/${postId}/likes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: {},
  });
  // 409 = already liked — ignore
  if (!res.ok && res.status !== 409) {
    console.warn(`    ⚠️  Like failed for post ${postId}: ${res.status}`);
  }
}

async function createReport(token, body) {
  const res = await api(`${MODERATION_URL}/reports`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn(`    ⚠️  Report failed ${res.status}: ${text}`);
    return null;
  }
  return res.json();
}

// ─── Health check ─────────────────────────────────────────────────────────────

async function checkServices() {
  const services = [
    { name: 'IAM',        url: `${IAM_URL}/auth/health` },
    { name: 'Users',      url: `${USERS_URL}/users/health` },
    { name: 'Posts',      url: `${POSTS_URL}/posts/health` },
    { name: 'Moderation', url: `${MODERATION_URL}/reports/health` },
  ];

  let allUp = true;
  for (const svc of services) {
    try {
      const res = await fetch(svc.url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        console.log(`  ✅ ${svc.name}`);
      } else {
        console.log(`  ⚠️  ${svc.name} responded ${res.status} — continuing anyway`);
      }
    } catch {
      console.warn(`  ❌ ${svc.name} unreachable at ${svc.url}`);
      allUp = false;
    }
  }
  return allUp;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Breezy seed script\n');

  console.log('🔍 Checking services...');
  const up = await checkServices();
  if (!up) {
    console.error('\n❌ One or more services are unreachable. Start them first:');
    console.error('   pnpm dev   or   docker compose -f docker-compose.dev.yml up');
    process.exit(1);
  }

  // ── 1. Register users ──────────────────────────────────────────────────────
  console.log('\n📝 Registering users...');
  for (const user of SEED_USERS) {
    const result = await registerUser(user);
    console.log(`  ${result === 'exists' ? '⚠️  already exists' : '✅ created'}  ${user.username} (${user.role})`);
  }

  // ── 2. Login & collect sessions ────────────────────────────────────────────
  console.log('\n🔑 Logging in...');
  const sessions = {}; // username → { token, profileId, iamId }
  for (const user of SEED_USERS) {
    const session = await loginUser(user.username, user.password);
    sessions[user.username] = session;
    console.log(`  ✅ ${user.username} → profileId: ${session.profileId}`);
  }

  // ── 3. Update bios ─────────────────────────────────────────────────────────
  console.log('\n👤 Updating profiles...');
  for (const user of SEED_USERS) {
    if (!user.bio) continue;
    const { token, profileId } = sessions[user.username];
    await updateProfile(profileId, token, { bio: user.bio });
    console.log(`  ✅ ${user.username}`);
  }

  // ── 4. Create posts ────────────────────────────────────────────────────────
  console.log('\n📮 Creating posts...');
  const allPosts = []; // preserves index alignment with SEED_POSTS + SEED_COMMENTS
  for (const post of SEED_POSTS) {
    const { token } = sessions[post.by];
    const created = await createPost(token, {
      content: post.content,
      tagsList: post.tags ?? [],
    });
    allPosts.push(created);
    console.log(`  ✅ [${post.by}] ${post.content.substring(0, 60)}…`);
  }

  // ── 5. Create comments (replies) ───────────────────────────────────────────
  console.log('\n💬 Creating comments...');
  for (const comment of SEED_COMMENTS) {
    const { token } = sessions[comment.by];
    const parentPost = allPosts[comment.replyTo];
    if (!parentPost) {
      console.warn(`  ⚠️  Parent post at index ${comment.replyTo} not found — skipping`);
      continue;
    }
    const created = await createPost(token, {
      content: comment.content,
      parentPostId: parentPost.id,
    });
    allPosts.push(created);
    console.log(`  ✅ [${comment.by}] replied to post #${comment.replyTo}`);
  }

  // ── 6. Create follows ──────────────────────────────────────────────────────
  console.log('\n👥 Creating follows...');
  for (const follow of SEED_FOLLOWS) {
    const { token } = sessions[follow.from];
    const { profileId } = sessions[follow.to];
    await createFollow(token, profileId);
    console.log(`  ✅ ${follow.from} → ${follow.to}`);
  }

  // ── 7. Create likes ────────────────────────────────────────────────────────
  console.log('\n❤️  Creating likes...');
  for (const like of SEED_LIKES) {
    const { token } = sessions[like.by];
    const post = allPosts[like.post];
    if (!post) {
      console.warn(`  ⚠️  Post at index ${like.post} not found — skipping`);
      continue;
    }
    await likePost(token, post.id);
    console.log(`  ✅ ${like.by} liked post #${like.post}`);
  }

  // ── 8. Create reports ──────────────────────────────────────────────────────
  console.log('\n🚩 Creating reports...');
  for (const report of SEED_REPORTS) {
    const { token } = sessions[report.by];
    let targetId;
    if (report.targetType === 'post') {
      const post = allPosts[report.postIndex];
      if (!post) { console.warn(`  ⚠️  Post #${report.postIndex} not found`); continue; }
      targetId = post.id;
    } else {
      targetId = sessions[report.targetUsername]?.profileId;
      if (!targetId) { console.warn(`  ⚠️  User ${report.targetUsername} session not found`); continue; }
    }
    await createReport(token, { targetId, targetType: report.targetType, reason: report.reason });
    console.log(`  ✅ ${report.by} reported ${report.targetType} (${targetId})`);
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────');
  console.log('✅ Seed completed!\n');
  console.log(`  Users      : ${SEED_USERS.length}`);
  console.log(`  Posts      : ${SEED_POSTS.length}`);
  console.log(`  Comments   : ${SEED_COMMENTS.length}`);
  console.log(`  Follows    : ${SEED_FOLLOWS.length}`);
  console.log(`  Likes      : ${SEED_LIKES.length}`);
  console.log(`  Reports    : ${SEED_REPORTS.length}`);
  console.log('\nCredentials:');
  for (const u of SEED_USERS) {
    console.log(`  ${u.role.padEnd(10)} ${u.username.padEnd(12)} / ${u.password}`);
  }
}

main().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
