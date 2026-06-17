# Models Moderation

> Service : Moderation Service  
> Base de données : MongoDB  
> Collections : `reports`, `sanctions`  
> Dernière mise à jour : 2026-06-17

---

## Reports

| Champ | Type Mongoose | Obligatoire | Valeur par défaut | Description |
|---|---|---|---|---|
| `reporterId` | `String` | Oui | — | Identifiant de l'utilisateur qui signale |
| `targetId` | `String` | Oui | — | Identifiant du post ou de l'utilisateur signalé |
| `targetType` | `String` | Oui | — | Type de cible : `"post"` ou `"user"` |
| `reason` | `String` | Oui | — | Raison du signalement |
| `status` | `String` | Non | `"pending"` | Statut : `"pending"`, `"reviewed"`, `"dismissed"` |
| `moderatorId` | `String` | Non | `null` | Identifiant du modérateur ayant traité le signalement |
| `createdAt` | `Date` | Non | `Date.now` | Date de création |
| `updatedAt` | `Date` | Non | `Date.now` | Date de dernière modification |

## Sanctions

| Champ | Type Mongoose | Obligatoire | Valeur par défaut | Description |
|---|---|---|---|---|
| `targetId` | `String` | Oui | — | Identifiant du post ou de l'utilisateur sanctionné |
| `targetType` | `String` | Oui | — | Type de cible : `"post"` ou `"user"` |
| `moderatorId` | `String` | Oui | — | Identifiant du modérateur ayant appliqué la sanction |
| `reportId` | `String` | Non | `null` | Identifiant du signalement à l'origine de la sanction |
| `type` | `String` | Non | `null` | Type de sanction : `"ban"` (évolution future possible) |
| `reason` | `String` | Oui | — | Raison de la sanction |
| `fl_active` | `Number` | Non | `1` | Statut de la sanction : `1` = active, `0` = révoquée |
| `createdAt` | `Date` | Non | `Date.now` | Date de création |

---

## Champs ajoutés dans d'autres services

### Service Users — collection `profiles`

| Champ | Type Mongoose | Obligatoire | Valeur par défaut | Description |
|---|---|---|---|---|
| `fl_banned` | `Number` | Non | `0` | Statut de bannissement : `0` = actif, `1` = banni |

### Service Posts — collection `posts`

| Champ | Type Mongoose | Obligatoire | Valeur par défaut | Description |
|---|---|---|---|---|
| `fl_banned` | `Number` | Non | `0` | Statut de bannissement : `0` = actif, `1` = banni |

---

## Notes

- Une sanction sans `reportId` est possible (sanction appliquée directement sans signalement préalable).
- Lors d'une sanction, le service de modération met à jour `fl_banned` dans le service cible (`PATCH /users/:id` ou `PATCH /posts/:id`).
- La révocation d'une sanction (`fl_active = 0`) doit également remettre `fl_banned = 0` dans le service cible.
