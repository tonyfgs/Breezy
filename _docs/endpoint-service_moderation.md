# Endpoints Moderation

> Service : Moderation Service  
> Dernière mise à jour : 2026-06-17

---

Port par défaut : `4006` (env `PORT`)

---

## Signalements

| Méthode | Chemin | Accès | Description |
|---------|--------|-------|-------------|
| `POST` | `/reports` | Utilisateur | Créer un signalement |
| `GET` | `/reports` | Modérateur | Lister les signalements |
| `GET` | `/reports/:id` | Modérateur | Détail d'un signalement |
| `PATCH` | `/reports/:id` | Modérateur | Mettre à jour le statut |

### POST `/reports`

Body JSON :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `reporterId` | `string` | oui | ID de l'utilisateur qui signale |
| `targetId` | `string` | oui | ID du post ou utilisateur signalé |
| `targetType` | `string` | oui | `"post"` ou `"user"` |
| `reason` | `string` | oui | Raison du signalement |

Réponse `201` : objet `ReportDTO`

Erreur `400` si `targetType` invalide.

---

### GET `/reports`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `status` | query | `string` | non | Filtrer par statut : `"pending"`, `"reviewed"`, `"dismissed"` |
| `targetType` | query | `string` | non | Filtrer par type de cible : `"post"` ou `"user"` |

Réponse `200` : tableau de `ReportDTO`

---

### GET `/reports/:id`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB du signalement |

Réponse `200` : objet `ReportDTO`

Erreur `404` si le signalement n'existe pas.

---

### PATCH `/reports/:id`

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

| Méthode | Chemin | Accès | Description |
|---------|--------|-------|-------------|
| `POST` | `/sanctions` | Modérateur | Créer une sanction |
| `GET` | `/sanctions` | Modérateur | Lister les sanctions |
| `GET` | `/sanctions/:id` | Modérateur | Détail d'une sanction |
| `DELETE` | `/sanctions/:id` | Modérateur | Révoquer une sanction |

### POST `/sanctions`

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

Erreur `400` si `targetType` invalide.  
Erreur `409` si une sanction active existe déjà pour cette cible.

---

### GET `/sanctions`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `targetId` | query | `string` | non | Filtrer par cible |
| `targetType` | query | `string` | non | Filtrer par type : `"post"` ou `"user"` |
| `fl_active` | query | `number` | non | Filtrer par statut : `1` = actives, `0` = révoquées |

Réponse `200` : tableau de `SanctionDTO`

---

### GET `/sanctions/:id`

| Paramètre | Emplacement | Type | Requis | Description |
|-----------|-------------|------|--------|-------------|
| `id` | path | `string` | oui | ID MongoDB de la sanction |

Réponse `200` : objet `SanctionDTO`

Erreur `404` si la sanction n'existe pas.

---

### DELETE `/sanctions/:id`

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

---

## Notes d'implémentation

- Tous les handlers du controller ont un try/catch — une erreur retourne `404` ou `500` sans crasher le service.
- Le `BanService` lève une erreur si le service cible répond avec un statut non-ok, ce qui fait remonter un `500` au client.
- Authentification : non implémentée — le champ `moderatorId` est transmis directement dans le body pour l'instant.
