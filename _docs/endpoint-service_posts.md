# Endpoints Posts

> Service : Posts Service  
> Dernière mise à jour : 2026-06-22

---

Port par défaut : `4003` (env `PORT`)

---

## Posts

| Méthode | Chemin | Description |
|---------|--------|-------------|
| `GET` | `/posts` | Récupère tous les posts (hors commentaires), paginés |
| `GET` | `/posts/user/:userId` | Récupère tous les posts d'un utilisateur, paginés |
| `GET` | `/posts/:id` | Récupère un post par son ID |
| `GET` | `/posts/:id/comments` | Récupère les commentaires d'un post, paginés |
| `POST` | `/posts` | Crée un post ou un commentaire |
| `POST` | `/posts/by-authors` | Récupère les posts de plusieurs auteurs, paginés par curseur |
| `PUT` | `/posts/:id` | Modifie le contenu d'un post |
| `PATCH` | `/posts/:id` | Met à jour les champs partiels d'un post |
| `DELETE` | `/posts/:id` | Supprime un post |

### GET `/posts`

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

> Seuls les posts de premier niveau sont retournés (`parentPostId: null`). Les commentaires sont exclus.

---

### GET `/posts/:id`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du post |

Réponse `200` : objet `PostDTO`

```json
{
  "id": "string",
  "authorId": "string",
  "content": "string",
  "parentPostId": "string | null",
  "tagsList": [],
  "mediaList": [],
  "mentionsList": [],
  "fl_banned": 0,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### GET `/posts/user/:userId`

| Paramètre | Emplacement | Type | Requis | Défaut | Description |
|-----------|-------------|------|--------|--------|-------------|
| `userId` | path | `string` | oui | — | ID de l'auteur |
| `page` | query | `number` | non | `1` | Numéro de page (min : 1) |
| `limit` | query | `number` | non | `10` | Nombre d'éléments par page (min : 1, max : 100) |

Réponse `200` : objet `PaginatedPostsDTO` (même format que `GET /posts`)

> Seuls les posts de premier niveau sont retournés (`parentPostId: null`). Les commentaires sont exclus.

---

### GET `/posts/:id/comments`

| Paramètre | Emplacement | Type | Requis | Défaut | Description |
|-----------|-------------|------|--------|--------|-------------|
| `id` | path | `string` | oui | — | ID MongoDB du post parent |
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
      "parentPostId": "string",
      "tagsList": [],
      "mediaList": [],
      "mentionsList": [],
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

---

### POST `/posts`

Body JSON (`CreatePostDTO`) :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `authorId` | `string` | oui | ID de l'auteur (référence externe vers le service users) |
| `content` | `string` | oui | Contenu textuel du post |
| `parentPostId` | `string \| null` | non | ID du post parent — si renseigné, crée un commentaire |
| `tagsList` | `string[]` | non | Liste de tags (défaut : `[]`) |
| `mediaList` | `string[]` | non | Liste d'URLs ou chemins médias (défaut : `[]`) |
| `mentionsList` | `string[]` | non | Liste d'IDs utilisateurs mentionnés (défaut : `[]`) |

Réponse `201` : objet `PostDTO`

---

### PUT `/posts/:id`

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

---

### PATCH `/posts/:id`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du post |

Body JSON (tous les champs sont optionnels) :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `fl_banned` | `number` | non | `0` = actif, `1` = banni — mis à jour par le service modération |

Réponse `200` : objet `PostDTO` mis à jour

Erreur `404` si le post n'existe pas.

> Utilisé par le service modération pour mettre à jour `fl_banned` lors d'un ban ou d'une révocation.

---

### DELETE `/posts/:id`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du post |

Réponse `204` : aucun contenu

Erreur `404` si le post n'existe pas.

---

### POST `/posts/by-authors`

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

| Méthode | Chemin | Description |
|---------|--------|-------------|
| `GET` | `/posts/:postId/likes/count` | Retourne le nombre de likes d'un post |
| `GET` | `/posts/:postId/likes` | Récupère les likes d'un post |
| `POST` | `/posts/:postId/likes` | Like un post |
| `DELETE` | `/posts/:postId/likes/:userId` | Retire le like d'un utilisateur |

### GET `/posts/:postId/likes/count`

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

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `postId` | path | `string` | oui | ID MongoDB du post |

Body JSON :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `userId` | `string` | oui | ID de l'utilisateur qui like |

Réponse `201` : objet `LikeDTO`

Erreur `409` si l'utilisateur a déjà liké ce post.

---

### DELETE `/posts/:postId/likes/:userId`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `postId` | path | `string` | oui | ID MongoDB du post |
| `userId` | path | `string` | oui | ID de l'utilisateur |

Réponse `204` : aucun contenu
