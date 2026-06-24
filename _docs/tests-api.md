# Tests API — Breezy

Base URL : `http://localhost:4000`  
Toutes les requêtes protégées nécessitent : `Authorization: Bearer <token>`

---

## Ordre de test recommandé

1. Register deux comptes (user1, user2)
2. Login pour récupérer les tokens
3. user1 suit user2
4. user2 crée des posts
5. Vérifier le feed de user1
6. user1 like un post
7. user1 signale un post
8. Login en admin → traiter le signalement → créer une sanction

---

## 1. Auth

### POST /auth/register

Crée un compte utilisateur (auth + profil créés séparément — voir note).

**Body**
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

**201 Created**
```json
{
  "token": "<jwt>"
}
```

**409 Conflict** — username déjà pris
```json
{ "message": "Username already exists" }
```

**400 Bad Request** — champs manquants
```json
{ "message": "..." }
```

---

### POST /auth/login

**Body**
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**200 OK**
```json
{
  "token": "<jwt>"
}
```

Le token contient : `id`, `username`, `role`, `profileId`.

**401 Unauthorized**
```json
{ "message": "Invalid credentials" }
```

---

### GET /auth/health

Vérifie que le service IAM tourne.

**200 OK**
```json
{ "service": "auth", "status": "up" }
```

---

### GET /auth/users

`Authorization: Bearer <admin-token>`

**200 OK**
```json
[
  { "id": "...", "username": "alice", "email": "alice@example.com", "role": "user" }
]
```

**403 Forbidden** — non admin
```json
{ "message": "Forbidden" }
```

---

### DELETE /auth/users/:username

`Authorization: Bearer <admin-token>`

**200 OK**
```json
{ "message": "User deleted successfully" }
```

**404 Not Found**
```json
{ "message": "..." }
```

---

## 2. Profils utilisateurs

> Le service users gère les profils (données publiques). Distinct du compte auth.

### POST /users/

Crée un profil (appelé automatiquement à l'inscription, peut aussi être appelé manuellement).

**Body**
```json
{
  "username": "alice",
  "bio": "Hello !",
  "avatar": null
}
```

**201 Created**
```json
{
  "id": "<profileId>",
  "username": "alice",
  "bio": "Hello !",
  "avatar": null,
  "fl_banned": 0,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**400 Bad Request** — profil déjà existant
```json
{ "message": "Profile already exists" }
```

---

### GET /users/

`Authorization: Bearer <token>`

**200 OK**
```json
[
  {
    "id": "<profileId>",
    "username": "alice",
    "bio": "Hello !",
    "avatar": null,
    "fl_banned": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### GET /users/:id

`Authorization: Bearer <token>`

**200 OK** — retourne un ProfileDTO
```json
{
  "id": "<profileId>",
  "username": "alice",
  "bio": "Hello !",
  "avatar": null,
  "fl_banned": 0,
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### GET /users/username/:username

`Authorization: Bearer <token>`

Même réponse que GET /users/:id.

**404 Not Found**
```json
{ "message": "..." }
```

---

### PATCH /users/:id

`Authorization: Bearer <token>` (owner ou admin/moderator)

**Body** (tous les champs optionnels)
```json
{
  "bio": "Nouvelle bio",
  "avatar": "https://..."
}
```

**200 OK** — retourne le profil mis à jour

**403 Forbidden** — pas le propriétaire
```json
{ "message": "Forbidden" }
```

---

### DELETE /users/:id

`Authorization: Bearer <token>` (owner ou admin/moderator)

**200 OK**
```json
{ "message": "Profile deleted successfully" }
```

**404 Not Found**
```json
{ "message": "..." }
```

---

### DELETE /users/username/:username

`Authorization: Bearer <admin-ou-moderator-token>`

**200 OK**
```json
{ "message": "Profile deleted successfully" }
```

---

## 3. Follows

### POST /follows/

`Authorization: Bearer <token>`

Le `followerId` est extrait automatiquement du token.

**Body**
```json
{
  "followingId": "<profileId-de-user2>"
}
```

**201 Created**
```json
{
  "id": "...",
  "followerId": "<profileId-user1>",
  "followingId": "<profileId-user2>",
  "createdAt": "..."
}
```

**400 Bad Request** — followingId manquant
```json
{ "message": "followingId is required" }
```

---

### DELETE /follows/

`Authorization: Bearer <token>`

**Body**
```json
{
  "followingId": "<profileId-de-user2>"
}
```

**200 OK**
```json
{ ... }
```

---

### GET /follows/:id/followers

`Authorization: Bearer <token>`

`:id` = profileId de l'utilisateur cible.

**200 OK**
```json
[
  { "id": "...", "followerId": "...", "followingId": "...", "createdAt": "..." }
]
```

---

### GET /follows/:id/following

`Authorization: Bearer <token>`

**200 OK** — même structure que /followers

---

## 4. Posts

### POST /posts/

`Authorization: Bearer <token>`

Le `authorId` est injecté automatiquement depuis le token.

**Body**
```json
{
  "content": "Mon premier post !"
}
```

**201 Created**
```json
{
  "id": "<postId>",
  "authorId": "<profileId>",
  "content": "Mon premier post !",
  "likeCount": 0,
  "commentCount": 0,
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### GET /posts/

`Authorization: Bearer <token>`

**Query params** (optionnels)
- `page` (défaut: 1)
- `limit` (défaut: 10, max: 100)

**200 OK**
```json
{
  "posts": [ { ... } ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

---

### GET /posts/:id

`Authorization: Bearer <token>`

**200 OK** — retourne un post

**404 Not Found**
```json
{ "message": "..." }
```

---

### GET /posts/user/:userId

`Authorization: Bearer <token>`

**Query params** : `page`, `limit`

**200 OK** — même structure que GET /posts/

---

### GET /posts/:id/comments

`Authorization: Bearer <token>`

**Query params** : `page`, `limit`

**200 OK**
```json
{
  "comments": [ { ... } ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

---

### PUT /posts/:id

`Authorization: Bearer <token>` (auteur, admin ou moderator)

**Body**
```json
{
  "content": "Contenu mis à jour"
}
```

**200 OK** — retourne le post mis à jour

**403 Forbidden**
```json
{ "message": "Forbidden - Only the author can update this post" }
```

**404 Not Found**
```json
{ "message": "..." }
```

---

### PATCH /posts/:id

Identique à PUT mais partiel.

---

### DELETE /posts/:id

`Authorization: Bearer <token>` (auteur, admin ou moderator)

**204 No Content**

**403 Forbidden**
```json
{ "message": "Forbidden - Only the author can delete this post" }
```

---

### POST /posts/by-authors

`Authorization: Bearer <token>`

Récupère les posts d'une liste d'auteurs (utilisé en interne par le feed).

**Body**
```json
{
  "authorIds": ["<profileId1>", "<profileId2>"],
  "limit": 20,
  "cursor": null
}
```

**200 OK**
```json
{
  "posts": [ { ... } ],
  "nextCursor": "<isoDate-ou-null>"
}
```

---

## 5. Likes

### POST /posts/:postId/likes

`Authorization: Bearer <token>`

Le `userId` est injecté depuis le token.

**201 Created**
```json
{
  "id": "...",
  "postId": "<postId>",
  "userId": "<profileId>",
  "createdAt": "..."
}
```

**409 Conflict** — déjà liké
```json
{ "message": "Already liked" }
```

---

### DELETE /posts/:postId/likes/:userId

`Authorization: Bearer <token>` (soi-même, admin ou moderator)

**204 No Content**

**403 Forbidden**
```json
{ "message": "Forbidden - Cannot unlike for another user" }
```

---

### GET /posts/:postId/likes

**Query params** : `page`, `limit`

**200 OK**
```json
{
  "likes": [ { "id": "...", "postId": "...", "userId": "..." } ],
  "total": 3
}
```

---

### GET /posts/:postId/likes/count

**200 OK**
```json
{ "count": 5 }
```

---

### GET /posts/:postId/likes/check/:userId

**200 OK**
```json
{ "liked": true }
```

---

## 6. Feed

### GET /feed/:idUser

`Authorization: Bearer <token>`

`:idUser` doit correspondre au `profileId` du token, sauf pour admin/moderator.

**Query params** (optionnels)
- `limit` (défaut: 20, max: 100)
- `cursor` (date ISO pour la pagination)

**200 OK**
```json
{
  "posts": [
    {
      "id": "<postId>",
      "authorId": "<profileId>",
      "content": "...",
      "likeCount": 3,
      "commentCount": 1,
      "createdAt": "..."
    }
  ],
  "nextCursor": "<isoDate-ou-undefined>"
}
```

**403 Forbidden** — lecture du feed d'un autre utilisateur
```json
{ "message": "Forbidden - Cannot read feed of another user" }
```

---

## 7. Reports (Modération)

### POST /reports/

`Authorization: Bearer <token>` (tout utilisateur connecté)

**Body**
```json
{
  "targetId": "<postId-ou-profileId>",
  "targetType": "post",
  "reason": "Contenu inapproprié"
}
```

`targetType` : `"post"` ou `"user"`

**201 Created**
```json
{
  "id": "...",
  "reporterId": "<profileId>",
  "targetId": "...",
  "targetType": "post",
  "reason": "Contenu inapproprié",
  "status": "pending",
  "createdAt": "..."
}
```

---

### GET /reports/

`Authorization: Bearer <moderator-ou-admin-token>`

**Query params** (optionnels)
- `status` : `"pending"` | `"resolved"` | `"dismissed"`
- `targetType` : `"post"` | `"user"`

**200 OK**
```json
[ { "id": "...", "reporterId": "...", "targetId": "...", "status": "pending", ... } ]
```

**403 Forbidden** — rôle insuffisant

---

### GET /reports/:id

`Authorization: Bearer <moderator-ou-admin-token>`

**200 OK** — retourne un report

**404 Not Found**
```json
{ "message": "..." }
```

---

### PATCH /reports/:id

`Authorization: Bearer <moderator-ou-admin-token>`

**Body**
```json
{
  "status": "resolved"
}
```

**200 OK** — retourne le report mis à jour

---

## 8. Sanctions (Modération)

### POST /sanctions/

`Authorization: Bearer <moderator-ou-admin-token>`

**Body**
```json
{
  "targetId": "<profileId>",
  "targetType": "user",
  "reason": "Violation répétée des règles",
  "type": "ban"
}
```

**201 Created**
```json
{
  "id": "...",
  "targetId": "...",
  "targetType": "user",
  "reason": "...",
  "type": "ban",
  "fl_active": 1,
  "createdAt": "..."
}
```

**409 Conflict** — sanction active déjà existante
```json
{ "message": "Active sanction already exists for this target" }
```

---

### GET /sanctions/

`Authorization: Bearer <moderator-ou-admin-token>`

**Query params** (optionnels)
- `targetId`
- `targetType` : `"user"` | `"post"`
- `fl_active` : `1` (actives) | `0` (révoquées)

**200 OK**
```json
[ { "id": "...", "targetId": "...", "fl_active": 1, ... } ]
```

---

### GET /sanctions/:id

`Authorization: Bearer <moderator-ou-admin-token>`

**200 OK** — retourne une sanction

**404 Not Found**

---

### DELETE /sanctions/:id

`Authorization: Bearer <moderator-ou-admin-token>`

Révoque la sanction (ne la supprime pas).

**200 OK** — retourne la sanction révoquée (`fl_active: 0`)

**409 Conflict** — déjà révoquée
```json
{ "message": "Sanction is already revoked" }
```

**404 Not Found**
