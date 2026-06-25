# Endpoints Users

> Service : User Service  
> Dernière mise à jour : 2026-06-25

---

Port par défaut : `4002` (env `PORT`)

---

## Profils

| Méthode | Chemin | Auth | Description |
|---------|--------|------|-------------|
| `GET` | `/users/` | `JWT` ou service interne | Récupère tous les profils |
| `GET` | `/users/username/:username` | `JWT` ou service interne | Récupère un profil par son username |
| `GET` | `/users/:id` | `JWT` | Récupère un profil par son ID |
| `POST` | `/users/` | Non | Crée un nouveau profil (appelé par l'IAM au register) |
| `PATCH` | `/users/:id` | `JWT` ou service interne + owner/`moderator`/`admin` | Met à jour les champs d'un profil |
| `DELETE` | `/users/username/:username` | `JWT`/service interne + `moderator`/`admin` | Supprime un profil par son username |
| `DELETE` | `/users/:id` | `JWT` + owner ou `moderator`/`admin` | Supprime un profil par son ID |

---

### GET `/users/`

Requiert : `Authorization: Bearer <token>` ou header `x-service-secret` (appel inter-service depuis le service modération).

Réponse `200` : tableau de `ProfileDTO`

```json
[
  {
    "id": "string",
    "username": "string",
    "bio": "string",
    "avatar": "string",
    "fl_banned": 0,
    "createdAt": "Date",
    "updatedAt": "Date"
  }
]
```

---

### GET `/users/username/:username`

Requiert : `Authorization: Bearer <token>` ou header `x-service-secret` (appel inter-service depuis l'IAM).

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `username` | path | `string` | oui | Nom d'utilisateur |

Réponse `200` : objet `ProfileDTO`

```json
{
  "id": "string",
  "username": "string",
  "bio": "string",
  "avatar": "string",
  "fl_banned": 0,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Erreur `404` si le profil n'existe pas.

---

### GET `/users/:id`

Requiert : `Authorization: Bearer <token>`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du profil |

Réponse `200` : objet `ProfileDTO`

---

### POST `/users/`

Route publique — appelée uniquement par le service IAM lors d'un register.

Body JSON (`CreateProfileDTO`) :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `username` | `string` | oui | Nom d'utilisateur unique |
| `bio` | `string \| null` | non | Biographie (défaut : `null`) |
| `avatar` | `string \| null` | non | URL de l'avatar (défaut : `null`) |

Réponse `201` : objet `ProfileDTO`

Erreur `400` si le `username` est déjà pris.

---

### PATCH `/users/:id`

Requiert : `Authorization: Bearer <token>` ou header `x-service-secret`. Seul le propriétaire du profil, un modérateur, un administrateur ou un service interne peut modifier.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du profil |

Body JSON (tous les champs sont optionnels) :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `bio` | `string` | non | Nouvelle biographie |
| `avatar` | `string` | non | Nouvelle URL d'avatar |
| `fl_banned` | `number` | non | `0` = actif, `1` = banni — mis à jour par le service modération |

Réponse `200` : objet `ProfileDTO` mis à jour

Erreur `403` si l'utilisateur n'est pas propriétaire du profil et n'a pas le rôle requis.

Erreur `404` si le profil n'existe pas.

> Utilisé par le service modération pour mettre à jour `fl_banned` lors d'un ban ou d'une révocation.

---

### DELETE `/users/username/:username`

Requiert : `Authorization: Bearer <token>` avec rôle `moderator` ou `admin`, ou header `x-service-secret` (appel inter-service depuis l'IAM).

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `username` | path | `string` | oui | Nom d'utilisateur du profil |

Réponse `200` :

```json
{ "message": "Profile deleted successfully" }
```

Erreur `404` si le profil n'existe pas.

> Utilisé par le service IAM lors de la suppression d'un compte (`DELETE /auth/users/:username`).

---

### DELETE `/users/:id`

Requiert : `Authorization: Bearer <token>`. Seul le propriétaire du profil, un modérateur ou un administrateur peut supprimer.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du profil |

Réponse `200` :

```json
{ "message": "Profile deleted successfully" }
```

Erreur `403` si l'utilisateur n'est pas propriétaire du profil et n'a pas le rôle requis.

Erreur `404` si le profil n'existe pas.

---

## Follows

| Méthode | Chemin | Auth | Description |
|---------|--------|------|-------------|
| `POST` | `/follows/` | `JWT` | Crée une relation de follow |
| `GET` | `/follows/:id/following` | `JWT` ou service interne | Récupère les IDs des utilisateurs suivis par `:id` (bannis exclus) |
| `GET` | `/follows/:id/followers` | `JWT` ou service interne | Récupère les IDs des followers de `:id` |
| `DELETE` | `/follows/` | `JWT` | Supprime une relation de follow |

---

### POST `/follows/`

Requiert : `Authorization: Bearer <token>`.

Le `follwerId` est extrait automatiquement du token — il n'est pas à fournir dans le body.

Body JSON :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `followingId` | `string` | oui | ID MongoDB de l'utilisateur à suivre |

Réponse `201` : tableau des IDs suivis par l'utilisateur authentifié après création

```json
["686abc...", "686def..."]
```

Erreur `400` si `followingId` est absent.

---

### GET `/follows/:id/following`

Requiert : `Authorization: Bearer <token>`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB de l'utilisateur |

Réponse `200` : tableau des IDs des utilisateurs suivis par `:id`

```json
["686abc...", "686def..."]
```

> Utilisé par le service Feed pour construire le fil d'actualité. Les utilisateurs avec `fl_banned: 1` sont automatiquement exclus du résultat.

---

### GET `/follows/:id/followers`

Requiert : `Authorization: Bearer <token>`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB de l'utilisateur |

Réponse `200` : tableau des IDs des utilisateurs qui suivent `:id`

```json
["686abc...", "686def..."]
```

---

### DELETE `/follows/`

Requiert : `Authorization: Bearer <token>`.

Le `follwerId` est extrait automatiquement du token — il n'est pas à fournir dans le body.

Body JSON :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `followingId` | `string` | oui | ID MongoDB de l'utilisateur à ne plus suivre |

Réponse `200` : tableau des IDs encore suivis par l'utilisateur authentifié après suppression

```json
["686abc..."]
```

Erreur `400` si `followingId` est absent.
