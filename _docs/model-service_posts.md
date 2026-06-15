# Models Posts

> Service : Posts Service  
> Base de données : MongoDB  
> Collections : `posts`, `likes`  
> Dernière mise à jour : 2026-06-15

---

## Posts

Stocke à la fois les posts de premier niveau et les commentaires. Un document avec `parentPostId: null` est un post ; avec un `parentPostId` renseigné, c'est un commentaire.

| Champ | Type Mongoose | Obligatoire | Valeur par défaut | Description |
|---|---|---|---|---|
| `authorId` | `String` | Oui | — | ID externe de l'auteur (référence vers le service users) |
| `content` | `String` | Oui | — | Contenu textuel du post ou commentaire |
| `parentPostId` | `ObjectId` | Non | `null` | ID du post parent — `null` = post, renseigné = commentaire |
| `tagsList` | `[String]` | Non | `[]` | Liste de tags (feature anticipée, non implémentée) |
| `mediaList` | `[String]` | Non | `[]` | Liste d'URLs ou chemins médias (feature anticipée, non implémentée) |
| `mentionsList` | `[String]` | Non | `[]` | IDs des utilisateurs mentionnés (référence externe vers le service users) |
| `createdAt` | `Date` | Non | `Date.now` | Date de création |
| `updatedAt` | `Date` | Non | `Date.now` | Date de dernière modification |

---

## Likes

Un like associe un utilisateur à un post. La combinaison `(postId, userId)` est unique.

| Champ | Type Mongoose | Obligatoire | Valeur par défaut | Description |
|---|---|---|---|---|
| `postId` | `ObjectId` | Oui | — | ID du post liké (référence vers la collection `posts`) |
| `userId` | `String` | Oui | — | ID externe de l'utilisateur (référence vers le service users) |
| `createdAt` | `Date` | Non | `Date.now` | Date du like |

Index unique : `{ postId, userId }` — empêche un double like.

---

## Notes

- `nb_likesCount` n'est pas stocké en base : c'est un champ calculé, obtenu via un `countDocuments` sur la collection `likes`.
- `tagsList` et `mediaList` sont présents dans le schéma pour anticiper des features futures mais restent à `[]` par défaut.
- `authorId` et `mentionsList` sont des strings (IDs externes) et non des `ObjectId` MongoDB, car les utilisateurs vivent dans un service séparé.
