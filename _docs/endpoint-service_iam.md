# Endpoints IAM

> Service : IAM Service  
> Dernière mise à jour : 2026-06-25

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
| `POST` | `/auth/login` | Non | Authentifie, pose un cookie HttpOnly et retourne les infos utilisateur |
| `POST` | `/auth/logout` | Non | Efface le cookie d'authentification côté serveur |
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

Réponse `200` : pose un cookie `HttpOnly` + retourne les infos utilisateur (sans le token)

```json
{
  "iamId": "string",
  "profileId": "string",
  "username": "string",
  "role": "user"
}
```

Cookie posé sur la réponse (stocké côté client dans le cookie jar du navigateur) :

| Attribut | Valeur |
|----------|--------|
| Nom | `token` |
| `HttpOnly` | Oui — inaccessible depuis JavaScript |
| `SameSite` | `Lax` |
| `Secure` | `true` en production, `false` en dev |
| `Path` | `/` |
| `Max-Age` | 1 heure (aligné sur l'expiration du JWT) |

Le token JWT embarqué dans le cookie contient : `{ iamId, profileId, username, role }`. Il expire nativement après `1h` (configurable via `JWT_EXPIRES_IN`).

Erreur `401` si les credentials sont invalides.

> Au login, l'IAM appelle `GET /users/username/:username` (via `x-service-secret`) pour récupérer le `profileId` à inclure dans le token.

---

### POST `/auth/logout`

Aucun paramètre.

Efface le cookie `token` côté serveur en posant un `Set-Cookie` avec `Max-Age=0`.

Réponse `200` :

```json
{ "message": "Logged out" }
```

> Nécessaire car le cookie est `HttpOnly` — JavaScript ne peut pas le supprimer directement.

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

- Le cookie est stocké **côté client** (cookie jar du navigateur) — le serveur le pose via `Set-Cookie` mais ne le persiste nulle part
- Le token JWT expire après `1h` (configurable via `JWT_EXPIRES_IN`) ; le `Max-Age` du cookie est aligné sur cette durée
- Le logout est géré via `POST /auth/logout` qui envoie un `Set-Cookie` avec `Max-Age=0` pour effacer le cookie côté client
- Le `passwordHash` n'est jamais exposé dans les réponses
- nginx extrait le cookie `token` et l'injecte comme header `Authorization: Bearer <jwt>` sur les requêtes internes — les microservices reçoivent donc toujours un header `Authorization` classique
