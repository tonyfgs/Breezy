# Endpoints IAM

> Service : IAM Service  
> Dernière mise à jour : 2026-06-23

---

Port par défaut : `4001` (env `PORT`)

---

## Auth

| Méthode | Chemin | Auth | Description |
|---------|--------|------|-------------|
| `GET` | `/auth/health` | Non | Vérifie que le service est up |
| `GET` | `/auth/users` | `JWT` + `admin` | Retourne la liste de tous les comptes |
| `DELETE` | `/auth/users/:username` | `JWT` + `admin` | Supprime un compte et son profil associé |
| `POST` | `/auth/register` | Visiteur uniquement | Crée un compte utilisateur (403 si déjà authentifié) |
| `POST` | `/auth/login` | Non | Authentifie et retourne un token JWT |
| `GET` | `/auth/validate` | Usage interne nginx | Vérifie la validité d'un token JWT |

---

### GET `/auth/health`

Aucun paramètre.

Réponse `200` :

```json
{
  "service": "auth",
  "status": "up"
}
```

---

### GET `/auth/users`

Requiert : `Authorization: Bearer <token>` avec rôle `admin`.

Réponse `200` : tableau de `UserDTO`

```json
[
  {
    "id": 1,
    "username": "string",
    "role": "user",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
]
```

---

### DELETE `/auth/users/:username`

Requiert : `Authorization: Bearer <token>` avec rôle `admin`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `username` | path | `string` | oui | Nom d'utilisateur du compte à supprimer |

Réponse `200` :

```json
{ "message": "User deleted successfully" }
```

Erreur `404` si l'utilisateur n'existe pas.

> Déclenche un appel interne vers le service `users` pour supprimer le profil associé (`DELETE /users/username/:username`) avant de supprimer le compte IAM. Cet appel utilise le header `x-service-secret` (pas de JWT).

---

### POST `/auth/register`

Retourne **403** si un token JWT valide est présent dans le header `Authorization`. Un utilisateur déjà connecté doit supprimer son token avant de pouvoir créer un nouveau compte.

Body JSON (`CreateUserDTO`) :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `username` | `string` | oui | Nom d'utilisateur unique |
| `password` | `string` | oui | Mot de passe en clair (hashé en base) |
| `role` | `'user' \| 'moderator' \| 'admin'` | non | Rôle (défaut : `"user"`) |

Réponse `201` : objet `UserDTO`

```json
{
  "id": 1,
  "username": "string",
  "role": "user",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Erreur `409` si le `username` est déjà pris.

Erreur `400` si `role` n'est pas une valeur valide ou si la création du profil échoue (l'inscription est alors annulée).

> La création d'un compte déclenche un appel interne vers `POST /users/` (route publique) pour créer le profil associé. Si cet appel échoue, le compte IAM est supprimé.

---

### POST `/auth/login`

Body JSON (`LoginDTO`) :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `username` | `string` | oui | Nom d'utilisateur |
| `password` | `string` | oui | Mot de passe en clair |

Réponse `200` : objet `TokenDTO`

```json
{
  "token": "eyJ..."
}
```

Le token JWT contient : `{ iamId, profileId, username, role }`.

Erreur `401` si les credentials sont invalides.

> Au login, l'IAM appelle `GET /users/username/:username` (via `x-service-secret`) pour récupérer le `profileId` à inclure dans le token.

---

### GET `/auth/validate`

Utilisé en interne par nginx (`auth_request`). Ne pas appeler directement.

Header requis :

| Header | Valeur |
|--------|--------|
| `Authorization` | `Bearer <token>` |

Réponse `200` :

```json
{
  "message": "Token is valid",
  "user": {
    "iamId": 1,
    "profileId": "string",
    "username": "string",
    "role": "user"
  }
}
```

Erreur `401` si le token est absent, invalide ou expiré.

---

## Notes

- Les tokens JWT expirent après `1h` (configurable via `JWT_EXPIRES_IN`)
- Le logout est géré côté client (suppression du token en local)
- Le `passwordHash` n'est jamais exposé dans les réponses
