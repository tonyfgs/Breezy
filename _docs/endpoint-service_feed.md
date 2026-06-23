# Endpoints Feed

> Service : Feed Service  
> Dernière mise à jour : 2026-06-23

---

Port par défaut : `4004` (env `PORT`)

---

## Feed

| Méthode | Chemin | Auth | Description |
|---------|--------|------|-------------|
| `GET` | `/feed/:idUser` | `JWT` + owner ou `moderator`/`admin` | Récupère le fil d'actualité paginé d'un utilisateur |

---

### GET `/feed/:idUser`

Requiert : `Authorization: Bearer <token>`.

Un utilisateur ne peut accéder qu'à son propre fil (`idUser` doit correspondre à son `profileId`). Les modérateurs et administrateurs peuvent accéder au fil de n'importe quel utilisateur.

Retourne les posts des utilisateurs suivis par `:idUser`, triés par date décroissante.

**Flux interne :**
1. Récupère la liste des utilisateurs suivis via le service Users (`GET /follows/:idUser/following`)
2. Filtre les comptes actifs via le service Moderation (mock actuellement — retourne tout)
3. Récupère les posts via le service Posts (`POST /posts/by-authors`)
4. Trie les posts par date de création décroissante

| Paramètre | Emplacement | Type | Requis | Défaut | Contraintes | Description |
|-----------|-------------|------|--------|--------|-------------|-------------|
| `idUser` | path | `string` | oui | — | — | ID MongoDB de l'utilisateur |
| `limit` | query | `number` | non | `20` | min : 1, max : 100 | Nombre de posts à retourner |
| `cursor` | query | `string` | non | — | date ISO 8601 | Curseur de pagination — valeur `nextCursor` de la réponse précédente |

Réponse `200` : objet `FeedDto`

```json
{
  "posts": [
    {
      "id": "string",
      "authorId": "string",
      "content": "string",
      "likeCount": 0,
      "createdAt": "Date"
    }
  ],
  "nextCursor": "2024-01-01T00:00:00.000Z"
}
```

`nextCursor` est absent si la dernière page est atteinte.

Erreur `403` si l'utilisateur tente d'accéder au fil d'un autre utilisateur sans les droits requis.

> **Pagination cursor-based :** passer `nextCursor` comme paramètre `cursor` à la prochaine requête pour récupérer la page suivante.

---

## Dépendances inter-services

| Service | Endpoint appelé | Usage |
|---------|----------------|-------|
| Users (`4002`) | `GET /follows/:id/following` | Récupère les IDs des utilisateurs suivis |
| Posts (`4003`) | `POST /posts/by-authors` | Récupère les posts des utilisateurs suivis |
| Moderation (`4005`) | `POST /moderation/users/active` | Filtre les utilisateurs bannis (mock actif) |
