# Endpoints IAM

> Service : IAM Service  
> Dernière mise à jour : 2026-06-18

---

Port par défaut : `3001` (env `PORT`)

---

## Auth

| Méthode | Chemin | Auth | Description |
|---------|--------|------|-------------|
| `GET` | `/auth/health` | Non | Vérifie que le service est up |
| `GET` | `/auth/users` | Non | Retourne la liste de tous les comptes |
| `DELETE` | `/auth/users/:username` | Non | Supprime un compte et son profil associé |
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

### GET `/auth/users`

Aucun paramètre.

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

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `username` | path | `string` | oui | Nom d'utilisateur du compte à supprimer |

Réponse `200` :

```json
{ "message": "User deleted successfully" }
```

Erreur `404` si l'utilisateur n'existe pas.

> Déclenche un appel interne vers le service `users` pour supprimer le profil associé (`DELETE /users/username/:username`) avant de supprimer le compte IAM.

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

Erreur `400` si `role` n'est pas une valeur valide (`user`, `moderator`, `admin`) ou si la création du profil utilisateur échoue (l'inscription est alors annulée).

> La création d'un compte déclenche automatiquement un appel interne vers le service `users` pour créer le profil associé (`bio` et `avatar` à `null` par défaut). Si cet appel échoue, le compte IAM est supprimé et une erreur est retournée.

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
