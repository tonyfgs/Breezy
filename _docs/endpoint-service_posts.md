# Endpoints Posts

> Service : Posts Service  
> Dernière mise à jour : 2026-06-15

---

Port par défaut : `4003` (env `PORT`)

---

## Posts

| Méthode | Chemin | Description |
|---------|--------|-------------|
| `GET` | `/posts` | Récupère tous les posts (hors commentaires), paginés |
| `GET` | `/posts/:id` | Récupère un post par son ID |
| `GET` | `/posts/:id/comments` | Récupère les commentaires d'un post |
| `POST` | `/posts` | Crée un post ou un commentaire |
| `PUT` | `/posts/:id` | Modifie le contenu d'un post |
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
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### GET `/posts/:id/comments`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du post parent |

Réponse `200` : tableau de `PostDTO`

```json
[
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
]
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

### DELETE `/posts/:id`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du post |

Réponse `204` : aucun contenu

---

## Likes

| Méthode | Chemin | Description |
|---------|--------|-------------|
| `GET` | `/posts/:postId/likes` | Récupère les likes d'un post |
| `POST` | `/posts/:postId/likes` | Like un post |
| `DELETE` | `/posts/:postId/likes/:userId` | Retire le like d'un utilisateur |

### GET `/posts/:postId/likes`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `postId` | path | `string` | oui | ID MongoDB du post |

Réponse `200` : tableau de `LikeDTO`

```json
[
  {
    "id": "string",
    "postId": "string",
    "userId": "string",
    "createdAt": "Date"
  }
]
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
