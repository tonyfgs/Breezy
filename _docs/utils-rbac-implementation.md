# RBAC — Documentation d'implémentation

## 1. Vue d'ensemble

Le système de contrôle d'accès par rôle (RBAC) de Breezy repose sur trois couches :

1. **Gateway nginx** — valide le JWT à chaque requête privée avant de la transmettre au service
2. **Middleware `authenticate`** — présent dans chaque service, décode le JWT et expose l'identité sur `req.user`
3. **Middleware `requireRole`** — restreint l'accès à certaines routes selon le rôle de l'utilisateur
4. **Logique d'ownership** — dans les controllers, vérifie que l'utilisateur agit sur ses propres ressources

---

## 2. Rôles

Définis dans [iam/src/domain/entities/Role.ts](../microservices/iam/src/domain/entities/Role.ts) :

| Valeur        | Description                         |
|---------------|-------------------------------------|
| `user`        | Utilisateur authentifié standard    |
| `moderator`   | Modérateur de contenu               |
| `admin`       | Administrateur avec tous les droits |

Le visiteur (non authentifié) n'a pas de rôle — ses accès sont gérés par nginx (routes publiques sans `auth_request`).

---

## 3. Contenu du token JWT

Généré par l'IAM à la connexion (`LoginUseCase`) :

```json
{
  "iamId":     "identifiant du compte dans la base IAM (PostgreSQL)",
  "profileId": "identifiant du profil dans le service users (MongoDB)",
  "username":  "nom d'utilisateur",
  "role":      "user | moderator | admin"
}
```

Chaque middleware `authenticate` extrait `profileId` dans `req.user.id` (sauf dans l'IAM qui utilise `iamId`).

---

## 4. Architecture de sécurité

```
Client (navigateur)
  │  Cookie HttpOnly: token=<jwt>
  ▼
[nginx — api-gateway :4000]
  │
  ├─ map $cookie_token → $auth_header = "Bearer <jwt>"
  │    (fallback sur $http_authorization si cookie absent)
  │
  ├─ /auth/*   ──→  proxy_set_header Authorization $auth_header
  │                 (pas d'auth_request — l'IAM gère l'auth par route)
  │
  └─ toutes les autres routes :
       auth_request → IAM /auth/validate  → 401 si token invalide
       proxy_set_header Authorization $auth_header
  ▼
[Microservice]
  │
  ├─ authenticate          extrait req.user depuis le JWT
  ├─ requireRole(...)      vérifie req.user.role
  └─ controller            vérifie l'ownership si nécessaire
```

> Le frontend n'envoie jamais de header `Authorization` manuellement. Le cookie est transmis automatiquement par le navigateur (`credentials: 'include'`), et nginx se charge de la traduction cookie → header.
>
> Exception : `/auth/` n'a pas de `auth_request` global car elle contient des routes publiques (login, register). nginx transmet quand même le header — l'IAM décide route par route de l'exiger ou non.

---

## 5. Middlewares

### authenticate

Fichier : `src/interfaces/middlewares/authMiddleware.ts` (présent dans chaque service)

- Lit le header `Authorization: Bearer <token>`
- Vérifie la signature JWT avec `JWT_SECRET`
- Attache `req.user = { id, username, role }` à la requête
- Retourne **401** si le token est absent, mal formé ou invalide

### requireRole(...roles)

Fichier : `src/interfaces/middlewares/roleMiddleware.ts` (présent dans chaque service)

- Vérifie que `req.user.role` est dans la liste des rôles autorisés
- Retourne **401** si `req.user` est absent
- Retourne **403** si le rôle est insuffisant, avec le message : `Forbidden - Insufficient role. Required: <roles>`

### requireProfileOwnershipOrAdmin

Fichier : [users/src/interfaces/middlewares/ownershipMiddleware.ts](../microservices/users/src/interfaces/middlewares/ownershipMiddleware.ts)

- Vérifie que `req.user.id === req.params.id` (l'utilisateur modifie son propre profil)
- Laisse passer les rôles `admin` et `moderator` sans vérification d'ID
- Retourne **403** sinon

### authenticateOrService

Fichier : [users/src/interfaces/middlewares/serviceMiddleware.ts](../microservices/users/src/interfaces/middlewares/serviceMiddleware.ts)

Utilisé sur les routes appelées par d'autres microservices (appels inter-services sans JWT).

- Si le header `x-service-secret` correspond à `SERVICE_SECRET` → laisse passer avec `role: admin`
- Sinon → délègue à `authenticate` (comportement JWT normal)

Contexte : l'IAM appelle le service users lors du login (pour récupérer le `profileId`) et du register (pour créer le profil). À ce moment, aucun JWT n'existe encore.

---

## 6. Matrice des permissions par route

### IAM (`/auth/`)

| Route | Méthode | Accès | Middleware |
|---|---|---|---|
| `/auth/register` | POST | Visiteur uniquement (403 si token valide présent) — rôle forcé à `user` | `rejectIfAuthenticated` |
| `/auth/login` | POST | Public | — |
| `/auth/logout` | POST | Public | — |
| `/auth/validate` | GET | Interne nginx | — |
| `/auth/health` | GET | Public | — |
| `/auth/users` | GET | `admin` | `authenticate`, `requireRole(['admin'])` |
| `/auth/users/:username` | DELETE | `admin` | `authenticate`, `requireRole(['admin'])` |
| `/auth/admin/users` | POST | `admin` | `authenticate`, `requireRole(['admin'])` |
| `/auth/bootstrap` | POST | `x-service-secret` + aucun admin existant | Vérification manuelle du secret + guard dans le handler |

### Users — Profils (`/users/`)

| Route | Méthode | Accès | Middleware |
|---|---|---|---|
| `/users/` | GET | Authentifié ou service interne | `authenticateOrService` |
| `/users/username/:username` | GET | Authentifié ou service interne | `authenticateOrService` |
| `/users/:id` | GET | Authentifié | `authenticate` |
| `/users/` | POST | Public (appelé par l'IAM au register) | — |
| `/users/:id` | PATCH | Owner, `moderator`, `admin` ou service interne | `authenticateOrService`, `requireProfileOwnershipOrAdmin` |
| `/users/username/:username` | DELETE | `moderator`, `admin` ou service interne | `authenticateOrService`, `requireRole(['admin','moderator'])` |
| `/users/:id` | DELETE | Owner, `moderator`, `admin` | `authenticate`, `requireProfileOwnershipOrAdmin` |

### Users — Follows (`/follows/`)

| Route | Méthode | Accès | Middleware |
|---|---|---|---|
| `/follows/` | POST | Authentifié | `authenticate` |
| `/follows/` | DELETE | Authentifié | `authenticate` |
| `/follows/:id/followers` | GET | Authentifié ou service interne | `authenticateOrService` |
| `/follows/:id/following` | GET | Authentifié ou service interne | `authenticateOrService` |

Note : `follwerId` est extrait de `req.user.id` (le token), non du body. Les utilisateurs avec `fl_banned: 1` sont exclus de `/follows/:id/following`.

### Posts (`/posts/`)

| Route | Méthode | Accès | Middleware / Logique |
|---|---|---|---|
| `/posts/` | GET | Authentifié | `authenticate` |
| `/posts/:id` | GET | Authentifié | `authenticate` |
| `/posts/user/:userId` | GET | Authentifié | `authenticate` |
| `/posts/:id/comments` | GET | Authentifié | `authenticate` |
| `/posts/stats` | GET | Authentifié ou service interne | `authenticateOrService` |
| `/posts/by-authors` | POST | Authentifié ou service interne | `authenticateOrService` |
| `/posts/` | POST | Authentifié | `authenticate` — `authorId` forcé depuis `req.user.id` |
| `/posts/:id` | PUT | Owner, `admin`, `moderator` | `authenticate` + ownership dans le controller |
| `/posts/:id` | PATCH | Owner, `admin`, `moderator` ou service interne | `authenticateOrService` + ownership dans le controller |
| `/posts/:id` | DELETE | Owner, `admin`, `moderator` | `authenticate` + ownership dans le controller |
| `/posts/:postId/likes` | GET | Authentifié | `authenticate` |
| `/posts/:postId/likes/count` | GET | Authentifié | `authenticate` |
| `/posts/:postId/likes` | POST | Authentifié | `authenticate` — `userId` forcé depuis `req.user.id` |
| `/posts/:postId/likes/:userId` | DELETE | Owner du like, `admin`, `moderator` | `authenticate` + ownership dans le controller |

### Feed (`/feed/`)

| Route | Méthode | Accès | Middleware / Logique |
|---|---|---|---|
| `/feed/:idUser` | GET | Owner du feed, `admin`, `moderator` | `authenticate` + vérification `req.user.id === idUser` dans le controller |

### Moderation — Stats & inter-services (`/moderation/`)

| Route | Méthode | Accès | Middleware |
|---|---|---|---|
| `/moderation/stats` | GET | `moderator`, `admin` | `authenticate`, `requireRole(['moderator','admin'])` |
| `/moderation/users/active` | POST | Service interne | `authenticateOrService` |

### Moderation — Reports (`/reports/`)

| Route | Méthode | Accès | Middleware |
|---|---|---|---|
| `/reports/` | POST | Authentifié | `authenticate` |
| `/reports/` | GET | `moderator`, `admin` | `authenticate`, `requireRole(['moderator','admin'])` |
| `/reports/:id` | GET | `moderator`, `admin` | `authenticate`, `requireRole(['moderator','admin'])` |
| `/reports/:id` | PATCH | `moderator`, `admin` | `authenticate`, `requireRole(['moderator','admin'])` |

### Moderation — Sanctions (`/sanctions/`)

| Route | Méthode | Accès | Middleware |
|---|---|---|---|
| `/sanctions/` | POST | `moderator`, `admin` | `authenticate`, `requireRole(['moderator','admin'])` |
| `/sanctions/` | GET | `moderator`, `admin` | `authenticate`, `requireRole(['moderator','admin'])` |
| `/sanctions/:id` | GET | `moderator`, `admin` | `authenticate`, `requireRole(['moderator','admin'])` |
| `/sanctions/:id` | DELETE | `moderator`, `admin` | `authenticate`, `requireRole(['moderator','admin'])` |

---

## 7. Messages d'erreur

| Code HTTP | Message | Cause |
|---|---|---|
| 401 | `Unauthorized - Missing or malformed token` | Header `Authorization` absent ou mal formé |
| 401 | `Unauthorized - Invalid or expired token` | Token invalide ou expiré |
| 401 | `Unauthorized - User not authenticated` | `req.user` absent lors du `requireRole` |
| 403 | `Forbidden - Insufficient role. Required: <roles>` | Rôle de l'utilisateur non autorisé |
| 403 | `Forbidden - You are not allowed to modify another user's profile` | Tentative de modification du profil d'un autre utilisateur |
| 403 | `Forbidden - Only the author can update/delete this post` | Tentative de modification/suppression d'un post dont on n'est pas l'auteur |
| 403 | `Forbidden - Cannot read feed of another user` | Tentative de lecture du feed d'un autre utilisateur |
| 403 | `Forbidden - Cannot unlike for another user` | Tentative de unlike au nom d'un autre utilisateur |

---

## 8. Communication inter-services

Tous les appels inter-services utilisent le header `x-service-secret` pour s'authentifier. La route réceptrice doit utiliser `authenticateOrService`.

| Appelant | Route appelée | Mécanisme | Raison |
|---|---|---|---|
| `iam` | `GET /users/username/:username` | `x-service-secret` | Récupérer le `profileId` au login |
| `iam` | `POST /users/` | Route publique | Créer le profil au register |
| `iam` | `DELETE /users/username/:username` | `x-service-secret` | Supprimer le profil à la suppression de compte |
| `moderation` | `GET /users/` | `x-service-secret` | Compter les membres pour les stats |
| `moderation` | `GET /posts/stats` | `x-service-secret` | Récupérer les stats de posts |
| `moderation` | `PATCH /users/:id` | `x-service-secret` | Mettre à jour `fl_banned` lors d'un ban/révocation |
| `moderation` | `PATCH /posts/:id` | `x-service-secret` | Mettre à jour `fl_banned` lors d'un ban/révocation |
| `feed` | `GET /follows/:id/following` | `x-service-secret` | Récupérer les auteurs à inclure dans le feed |
| `feed` | `POST /posts/by-authors` | `x-service-secret` | Récupérer les posts du feed |
| `feed` | `POST /moderation/users/active` | `x-service-secret` | Filtrer les auteurs bannis (double couche avec `FollowRepository`) |

Le secret est défini via la variable d'environnement `SERVICE_SECRET` (partagée entre tous les services dans `docker-compose`).

---

## 9. Variables d'environnement requises

| Service | Variable | Usage |
|---|---|---|
| `iam` | `JWT_SECRET` | Signature des tokens |
| `iam` | `SERVICE_SECRET` | Appels inter-services vers `users` |
| `iam` | `USERS_SERVICE_URL` | URL du service users (`http://users:4002`) |
| `users` | `JWT_SECRET` | Vérification des tokens |
| `users` | `SERVICE_SECRET` | Validation du header inter-services |
| `posts` | `JWT_SECRET` | Vérification des tokens |
| `posts` | `SERVICE_SECRET` | Validation du header inter-services |
| `feed` | `JWT_SECRET` | Vérification des tokens |
| `feed` | `SERVICE_SECRET` | Appels inter-services vers `users`, `posts` et `moderation` |
| `feed` | `BASE_URL_USERS` | URL du service users (`http://users:4002`) |
| `feed` | `BASE_URL_POSTS` | URL du service posts (`http://posts:4003`) |
| `feed` | `BASE_URL_MODERATION` | URL du service modération (`http://moderation:4005`) |
| `moderation` | `JWT_SECRET` | Vérification des tokens |
| `moderation` | `SERVICE_SECRET` | Appels inter-services + validation du header |
| `moderation` | `BASE_URL_USERS` | URL du service users (`http://users:4002`) |
| `moderation` | `BASE_URL_POSTS` | URL du service posts (`http://posts:4003`) |
