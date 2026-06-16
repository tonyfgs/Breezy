# Endpoints Users

> Service : User Service  
> Dernière mise à jour : 2026-06-12

---

Port par défaut : `3000` (env `PORT`)

---

## Profils

| Méthode | Chemin | Description |
|---------|--------|-------------|
| `GET` | `/users/` | Récupère tous les profils |
| `GET` | `/users/:id` | Récupère un profil par son ID |
| `POST` | `/users/` | Crée un nouveau profil |

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

Erreur `409` si le `username` est déjà pris.

---

## Endpoints non exposés (implémentation incomplète)

Les routes suivantes ont un use case et/ou un controller défini mais **ne sont pas enregistrées** dans le router :

| Méthode | Chemin | État |
|---------|--------|------|
| `PATCH` | `/users/:id` | Use case défini, repository non implémenté |
| `DELETE` | `/users/:id` | Use case défini, repository non implémenté |

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

- `PATCH /users/:id` et `DELETE /users/:id` : use cases existent mais repository lève `"Not implemented"`
- `FollowRepository` : toutes les méthodes lèvent `"Method not implemented"`
- `FollowController` : fichier vide
