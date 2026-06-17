# Endpoints IAM

> Service : IAM Service  
> Dernière mise à jour : 2026-06-16

---

Port par défaut : `3001` (env `PORT`)

---

## Auth

| Méthode | Chemin | Auth | Description |
|---------|--------|------|-------------|
| `GET` | `/auth/health` | Non | Vérifie que le service est up |
| `POST` | `/auth/register` | Non | Crée un compte utilisateur |
| `POST` | `/auth/login` | Non | Authentifie et retourne un token JWT |
| `GET` | `/auth/validate` | Oui | Vérifie la validité d'un token JWT |

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

### POST `/auth/register`

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

Erreur `400` si `role` n'est pas une valeur valide (`user`, `moderator`, `admin`).

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

Erreur `401` si les credentials sont invalides.

---

### GET `/auth/validate`

Header requis :

| Header | Valeur |
|--------|--------|
| `Authorization` | `Bearer <token>` |

Réponse `200` :

```json
{
  "message": "Token is valid",
  "user": {
    "id": 1,
    "username": "string",
    "role": "user"
  }
}
```

Erreur `401` si le token est absent, invalide ou expiré.

---

## Notes

- Les tokens JWT expirent après `1h` (configurable via `JWT_EXPIRES_IN` dans le `.env`)
- Le logout est géré côté client (suppression du token en local)
- Le `passwordHash` n'est jamais exposé dans les réponses
