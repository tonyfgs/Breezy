# Endpoints Moderation

> Service : Moderation Service  
> Dernière mise à jour : 2026-06-23

---

Port par défaut : `4005` (env `PORT`)

---

## Signalements

| Méthode | Chemin | Auth | Description |
|---------|--------|------|-------------|
| `POST` | `/reports` | `JWT` | Créer un signalement |
| `GET` | `/reports` | `JWT` + `moderator`/`admin` | Lister les signalements |
| `GET` | `/reports/:id` | `JWT` + `moderator`/`admin` | Détail d'un signalement |
| `PATCH` | `/reports/:id` | `JWT` + `moderator`/`admin` | Mettre à jour le statut |

---

### POST `/reports`

Requiert : `Authorization: Bearer <token>`.

Body JSON :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `reporterId` | `string` | oui | ID de l'utilisateur qui signale |
| `targetId` | `string` | oui | ID du post ou utilisateur signalé |
| `targetType` | `string` | oui | `"post"` ou `"user"` |
| `reason` | `string` | oui | Raison du signalement |

Réponse `201` : objet `ReportDTO`

Erreur `500` en cas d'erreur serveur.

---

### GET `/reports`

Requiert : `Authorization: Bearer <token>` avec rôle `moderator` ou `admin`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `status` | query | `string` | non | Filtrer par statut : `"pending"`, `"reviewed"`, `"dismissed"` |
| `targetType` | query | `string` | non | Filtrer par type de cible : `"post"` ou `"user"` |

Réponse `200` : tableau de `ReportDTO`

---

### GET `/reports/:id`

Requiert : `Authorization: Bearer <token>` avec rôle `moderator` ou `admin`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du signalement |

Réponse `200` : objet `ReportDTO`

Erreur `404` si le signalement n'existe pas.

---

### PATCH `/reports/:id`

Requiert : `Authorization: Bearer <token>` avec rôle `moderator` ou `admin`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du signalement |

Body JSON :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `status` | `string` | oui | `"reviewed"` ou `"dismissed"` |
| `moderatorId` | `string` | oui | ID du modérateur qui traite le signalement |

Réponse `200` : objet `ReportDTO` mis à jour

Erreur `404` si le signalement n'existe pas.

---

## Sanctions

| Méthode | Chemin | Auth | Description |
|---------|--------|------|-------------|
| `POST` | `/sanctions` | `JWT` + `moderator`/`admin` | Créer une sanction |
| `GET` | `/sanctions` | `JWT` + `moderator`/`admin` | Lister les sanctions |
| `GET` | `/sanctions/:id` | `JWT` + `moderator`/`admin` | Détail d'une sanction |
| `DELETE` | `/sanctions/:id` | `JWT` + `moderator`/`admin` | Révoquer une sanction |

---

### POST `/sanctions`

Requiert : `Authorization: Bearer <token>` avec rôle `moderator` ou `admin`.

Body JSON :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `targetId` | `string` | oui | ID du post ou utilisateur sanctionné |
| `targetType` | `string` | oui | `"post"` ou `"user"` |
| `moderatorId` | `string` | oui | ID du modérateur |
| `reportId` | `string` | non | ID du signalement à l'origine de la sanction |
| `reason` | `string` | oui | Raison de la sanction |

Réponse `201` : objet `SanctionDTO`

Effet de bord : appelle `PATCH /users/:id` ou `PATCH /posts/:id` pour passer `fl_banned` à `1`.

Erreur `409` si une sanction active existe déjà pour cette cible.

Erreur `500` en cas d'erreur serveur (BanService inaccessible, etc.).

---

### GET `/sanctions`

Requiert : `Authorization: Bearer <token>` avec rôle `moderator` ou `admin`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `targetId` | query | `string` | non | Filtrer par cible |
| `targetType` | query | `string` | non | Filtrer par type : `"post"` ou `"user"` |
| `fl_active` | query | `number` | non | Filtrer par statut : `1` = actives, `0` = révoquées |

Réponse `200` : tableau de `SanctionDTO`

---

### GET `/sanctions/:id`

Requiert : `Authorization: Bearer <token>` avec rôle `moderator` ou `admin`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB de la sanction |

Réponse `200` : objet `SanctionDTO`

Erreur `404` si la sanction n'existe pas.

---

### DELETE `/sanctions/:id`

Requiert : `Authorization: Bearer <token>` avec rôle `moderator` ou `admin`.

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB de la sanction |

Réponse `200` : objet `SanctionDTO` mis à jour (`fl_active: 0`)

Effet de bord : appelle `PATCH /users/:id` ou `PATCH /posts/:id` pour remettre `fl_banned` à `0`.

Erreur `404` si la sanction n'existe pas.

Erreur `409` si la sanction est déjà révoquée.

---

## Endpoints implémentés dans les autres services

Ces endpoints ont été ajoutés lors de l'implémentation du service modération.

### Service Users — `PATCH /users/:id`

Voir [endpoint-service_users.md](endpoint-service_users.md). Accepte `fl_banned` dans le body.

### Service Posts — `PATCH /posts/:id`

Voir [endpoint-service_posts.md](endpoint-service_posts.md). Accepte `fl_banned` dans le body.
