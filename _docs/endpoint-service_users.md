# Endpoints Users

> Service : User Service  
> Dernière mise à jour : 2026-06-22

---

Port par défaut : `4002` (env `PORT`)

---

## Profils

| Méthode | Chemin | Description |
|---------|--------|-------------|
| `GET` | `/users/` | Récupère tous les profils |
| `GET` | `/users/:id` | Récupère un profil par son ID |
| `POST` | `/users/` | Crée un nouveau profil |
| `PATCH` | `/users/:id` | Met à jour les champs d'un profil |
| `DELETE` | `/users/:id` | Supprime un profil par son ID MongoDB |
| `DELETE` | `/users/username/:username` | Supprime un profil par son username (utilisé par le service IAM) |

### GET `/users/`

Aucun paramètre.

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

### GET `/users/:id`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du profil |

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

---

### POST `/users/`

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

Erreur `404` si le profil n'existe pas.

> Utilisé par le service modération pour mettre à jour `fl_banned` lors d'un ban ou d'une révocation.

---

### DELETE `/users/:id`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du profil |

Réponse `200` :

```json
{ "message": "Profile deleted successfully" }
```

Erreur `404` si le profil n'existe pas.

---

### DELETE `/users/username/:username`

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

## Follows

| Méthode | Chemin | Description |
|---------|--------|-------------|
| `POST` | `/follows/` | Crée une relation de follow |
| `GET` | `/follows/:id/following` | Récupère les IDs des utilisateurs suivis par `:id` |
| `GET` | `/follows/:id/followers` | Récupère les IDs des followers de `:id` |
| `DELETE` | `/follows/` | Supprime une relation de follow |

### POST `/follows/`

Body JSON :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `follwerId` | `string` | oui | ID MongoDB de l'utilisateur qui suit |
| `followingId` | `string` | oui | ID MongoDB de l'utilisateur suivi |

> **Typo dans le code source** : `follwerId` (un seul `o`) — à respecter tel quel dans les requêtes.

Réponse `201` : tableau des IDs suivis par `follwerId` après création

```json
["686abc...", "686def..."]
```

Erreur `400` si `follwerId` ou `followingId` est absent.

---

### GET `/follows/:id/following`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB de l'utilisateur |

Réponse `200` : tableau des IDs des utilisateurs suivis par `:id`

```json
["686abc...", "686def..."]
```

> Utilisé par le service Feed pour construire le fil d'actualité.

---

### GET `/follows/:id/followers`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB de l'utilisateur |

Réponse `200` : tableau des IDs des utilisateurs qui suivent `:id`

```json
["686abc...", "686def..."]
```

---

### DELETE `/follows/`

Body JSON :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `follwerId` | `string` | oui | ID MongoDB de l'utilisateur qui suit |
| `followingId` | `string` | oui | ID MongoDB de l'utilisateur à ne plus suivre |

Réponse `200` : tableau des IDs encore suivis par `follwerId` après suppression

```json
["686abc..."]
```

Erreur `400` si `follwerId` ou `followingId` est absent.
