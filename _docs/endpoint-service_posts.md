# Endpoints Posts

> Service : Posts Service  
> Dernière mise à jour : 2026-06-23

---

Port par défaut : `4003` (env `PORT`)

---

## Posts

| Méthode | Chemin | Auth | Description |
|---------|--------|------|-------------|
| `GET` | `/posts` | `JWT` | Récupère tous les posts (hors commentaires), paginés |
| `GET` | `/posts/user/:userId` | `JWT` | Récupère tous les posts d'un utilisateur, paginés |
| `GET` | `/posts/:id` | `JWT` | Récupère un post par son ID |
| `GET` | `/posts/:id/comments` | `JWT` | Récupère les commentaires d'un post, paginés |
| `POST` | `/posts` | `JWT` | Crée un post ou un commentaire |
| `POST` | `/posts/by-authors` | `JWT` | Récupère les posts de plusieurs auteurs (utilisé par Feed) |
| `PUT` | `/posts/:id` | `JWT` + owner ou `moderator`/`admin` | Modifie le contenu d'un post |
| `PATCH` | `/posts/:id` | `JWT` + owner ou `moderator`/`admin` | Met à jour les champs partiels d'un post |
| `DELETE` | `/posts/:id` | `JWT` + owner ou `moderator`/`admin` | Supprime un post |

---

### GET `/posts`

Requiert : `Authorization: Bearer <token>`.

| Paramètre | Emplacement | Type | Requis | Défaut | Description |
|-----------|-------------|------|--------|--------|-------------|
| `page` | query | `number` | non | `1` | Numéro de page (min : 1) |
| `limit` | query | `number` | non | `10` | Nombre d'éléments par page (min : 1, max : 100) |

Réponse `200` : objet `PaginatedPostsDTO`

```json
{
  "data": [
    {
      "id": "string",
      "authorId": "string",
      "content": "string",
      "parentPostId": null,
      "tagsList": [],
      "mediaList": [],
      "mentionsList": [],
      "fl_banned": 0,
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

> Seuls les posts de premier niveau sont retournés (`parentPostId: null`).

---

### GET `/posts/:id`

Requiert : `Authorization: Bearer <token>`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du post |

Réponse `200` : objet `PostDTO`

---

### GET `/posts/user/:userId`

Requiert : `Authorization: Bearer <token>`.

| Paramètre | Emplacement | Type | Requis | Défaut | Description |
|-----------|-------------|------|--------|--------|-------------|
| `userId` | path | `string` | oui | — | ID de l'auteur |
| `page` | query | `number` | non | `1` | Numéro de page (min : 1) |
| `limit` | query | `number` | non | `10` | Nombre d'éléments par page (min : 1, max : 100) |

Réponse `200` : objet `PaginatedPostsDTO`

> Seuls les posts de premier niveau sont retournés (`parentPostId: null`).

---

### GET `/posts/:id/comments`

Requiert : `Authorization: Bearer <token>`.

| Paramètre | Emplacement | Type | Requis | Défaut | Description |
|-----------|-------------|------|--------|--------|-------------|
| `id` | path | `string` | oui | — | ID MongoDB du post parent |
| `page` | query | `number` | non | `1` | Numéro de page (min : 1) |
| `limit` | query | `number` | non | `10` | Nombre d'éléments par page (min : 1, max : 100) |

Réponse `200` : objet `PaginatedPostsDTO`

---

### POST `/posts`

Requiert : `Authorization: Bearer <token>`.

L'`authorId` est extrait automatiquement du token — il n'est pas à fournir dans le body.

Body JSON (`CreatePostDTO`) :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `content` | `string` | oui | Contenu textuel du post |
| `parentPostId` | `string \| null` | non | ID du post parent — si renseigné, crée un commentaire |
| `tagsList` | `string[]` | non | Liste de tags (défaut : `[]`) |
| `mediaList` | `string[]` | non | Liste d'URLs ou chemins médias (défaut : `[]`) |
| `mentionsList` | `string[]` | non | Liste d'IDs utilisateurs mentionnés (défaut : `[]`) |

Réponse `201` : objet `PostDTO`

---

### PUT `/posts/:id`

Requiert : `Authorization: Bearer <token>`. Seul l'auteur du post, un modérateur ou un administrateur peut modifier.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du post |

Body JSON (`UpdatePostDTO`) :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `content` | `string` | non | Nouveau contenu |
| `tagsList` | `string[]` | non | Nouvelle liste de tags |
| `mediaList` | `string[]` | non | Nouvelle liste de médias |
| `mentionsList` | `string[]` | non | Nouvelle liste de mentions |

Réponse `200` : objet `PostDTO` mis à jour

Erreur `403` si l'utilisateur n'est pas l'auteur et n'a pas le rôle requis.

---

### PATCH `/posts/:id`

Requiert : `Authorization: Bearer <token>`. Seul l'auteur du post, un modérateur ou un administrateur peut modifier.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du post |

Body JSON (tous les champs sont optionnels) :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `fl_banned` | `number` | non | `0` = actif, `1` = banni — mis à jour par le service modération |

Réponse `200` : objet `PostDTO` mis à jour

Erreur `403` si l'utilisateur n'est pas l'auteur et n'a pas le rôle requis.

Erreur `404` si le post n'existe pas.

> Utilisé par le service modération pour mettre à jour `fl_banned` lors d'un ban ou d'une révocation.

---

### DELETE `/posts/:id`

Requiert : `Authorization: Bearer <token>`. Seul l'auteur du post, un modérateur ou un administrateur peut supprimer.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du post |

Réponse `204` : aucun contenu

Erreur `403` si l'utilisateur n'est pas l'auteur et n'a pas le rôle requis.

Erreur `404` si le post n'existe pas.

---

### POST `/posts/by-authors`

Requiert : `Authorization: Bearer <token>`.

Récupère les posts de plusieurs auteurs avec pagination par curseur. Utilisé par le service Feed.

Body JSON :

| Champ | Type | Requis | Défaut | Description |
|-------|------|--------|--------|-------------|
| `authorIds` | `string[]` | oui | — | Liste des IDs d'auteurs |
| `limit` | `number` | non | `20` | Nombre de posts (min : 1, max : 100) |
| `cursor` | `string` | non | — | Date ISO 8601 — retourne les posts créés avant cette date |

Réponse `200` :

```json
{
  "posts": [
    {
      "id": "string",
      "authorId": "string",
      "content": "string",
      "parentPostId": null,
      "tagsList": [],
      "mediaList": [],
      "mentionsList": [],
      "fl_banned": 0,
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ],
  "nextCursor": "2024-01-01T00:00:00.000Z"
}
```

`nextCursor` est `null` s'il n'y a plus de résultats.

> Seuls les posts de premier niveau sont retournés (`parentPostId: null`). Triés par `createdAt` décroissant.

---

## Likes

| Méthode | Chemin | Auth | Description |
|---------|--------|------|-------------|
| `GET` | `/posts/:postId/likes/count` | `JWT` | Retourne le nombre de likes d'un post |
| `GET` | `/posts/:postId/likes` | `JWT` | Récupère les likes d'un post |
| `POST` | `/posts/:postId/likes` | `JWT` | Like un post |
| `DELETE` | `/posts/:postId/likes/:userId` | `JWT` + owner ou `moderator`/`admin` | Retire le like d'un utilisateur |

---

### GET `/posts/:postId/likes/count`

Requiert : `Authorization: Bearer <token>`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `postId` | path | `string` | oui | ID MongoDB du post |

Réponse `200` :

```json
{
  "postId": "string",
  "likeCount": 42
}
```

---

### GET `/posts/:postId/likes`

Requiert : `Authorization: Bearer <token>`.

| Paramètre | Emplacement | Type | Requis | Défaut | Description |
|-----------|-------------|------|--------|--------|-------------|
| `postId` | path | `string` | oui | — | ID MongoDB du post |
| `page` | query | `number` | non | `1` | Numéro de page (min : 1) |
| `limit` | query | `number` | non | `10` | Nombre d'éléments par page (min : 1, max : 100) |

Réponse `200` : objet `PaginatedLikesDTO`

```json
{
  "data": [
    {
      "id": "string",
      "postId": "string",
      "userId": "string",
      "createdAt": "Date"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

### POST `/posts/:postId/likes`

Requiert : `Authorization: Bearer <token>`.

Le `userId` est extrait automatiquement du token — il n'est pas à fournir dans le body.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `postId` | path | `string` | oui | ID MongoDB du post |

Réponse `201` : objet `LikeDTO`

Erreur `409` si l'utilisateur a déjà liké ce post.

---

### DELETE `/posts/:postId/likes/:userId`

Requiert : `Authorization: Bearer <token>`. Seul l'utilisateur concerné, un modérateur ou un administrateur peut retirer le like.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `postId` | path | `string` | oui | ID MongoDB du post |
| `userId` | path | `string` | oui | ID de l'utilisateur dont on retire le like |

Réponse `204` : aucun contenu

Erreur `403` si l'utilisateur n'est pas le propriétaire du like et n'a pas le rôle requis.
