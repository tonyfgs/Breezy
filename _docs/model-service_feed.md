# Models Feed

> Service : Feed Service  
> Base de données : aucune — service d'agrégation pur  
> Dernière mise à jour : 2026-06-22

---

Le service Feed n'a pas de base de données propre. Il agrège des données provenant des services Posts et Users. Les types ci-dessous décrivent les structures échangées en interne et exposées via l'API.

---

## Entités de domaine

### PostEntity

Représente un post tel que reçu du service Posts.

| Champ | Type TypeScript | Description |
|-------|----------------|-------------|
| `id` | `string` | ID du post (MongoDB ObjectId du service Posts) |
| `authorId` | `string` | ID de l'auteur (MongoDB ObjectId du service Users) |
| `content` | `string` | Contenu textuel du post |
| `likeCount` | `number` | Nombre de likes — peut être `0` si non fourni par le service Posts |
| `createdAt` | `Date` | Date de création |
| `updatedAt` | `Date` | Date de dernière modification |

### FeedEntity

Représente un fil d'actualité paginé.

| Champ | Type TypeScript | Description |
|-------|----------------|-------------|
| `posts` | `PostEntity[]` | Liste de posts triés par date décroissante |
| `nextCursor` | `string \| undefined` | Curseur pour la page suivante (date ISO 8601 du dernier post retourné) |

---

## DTOs (réponse API)

### PostDTO

Sous-ensemble de `PostEntity` exposé dans la réponse du feed. `updatedAt` n'est pas inclus.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `string` | ID du post |
| `authorId` | `string` | ID de l'auteur |
| `content` | `string` | Contenu textuel |
| `likeCount` | `number` | Nombre de likes |
| `createdAt` | `Date` | Date de création |

### FeedDto

| Champ | Type | Description |
|-------|------|-------------|
| `posts` | `PostDTO[]` | Posts du fil d'actualité |
| `nextCursor` | `string \| undefined` | Curseur de pagination — absent si dernière page |

---

## Notes

- `likeCount` est un champ attendu dans la réponse du service Posts (`POST /posts/by-authors`) mais n'est pas dans le modèle Posts actuel — il sera `0` tant que le service Posts ne le fournit pas.
- Le service Moderation est mocké (`MockModerationGateway`) : tous les utilisateurs sont considérés actifs et tous les posts sont autorisés.
