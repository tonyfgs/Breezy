# Endpoints Users

> Service : User Service  
> Dernière mise à jour : 2026-06-17

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
| `DELETE` | `/users/:id` | Supprime un profil |

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
| `bio` | `string` | non | Biographie (défaut : `""`) |
| `avatar` | `string` | non | URL de l'avatar (défaut : `""`) |

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

---

## Follows

Le `FollowController` et le `FollowRepository` sont vides. Aucun endpoint follow n'est disponible.

Méthodes prévues dans `IFollowRepository` :

| Méthode | Description |
|---------|-------------|
| `getFollowers(id)` | Récupère les abonnés d'un profil |
| `getFollowing(id)` | Récupère les abonnements d'un profil |
| `createFollow(followerId, followingId)` | Crée une relation d'abonnement |
| `deleteFollow(followerId, followingId)` | Supprime une relation d'abonnement |

---

## Problèmes notés

- `FollowRepository` : toutes les méthodes lèvent `"Method not implemented"`
- `FollowController` : fichier vide
