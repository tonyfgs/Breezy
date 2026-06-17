# Models Users

> Service : User Service  
> Base de données : MongoDB  
> Collection : `follows`, `profiles`
> Dernière mise à jour : 2026-06-17

---

## Follows

| Champ | Type Mongoose | Obligatoire | Valeur par défaut | Description |
|---|---|---|---|---|
| `follwerId` | `String` | Oui | — | Identifiant de l'utilisateur qui suit |
| `followingId` | `String` | Oui | — | Identifiant de l'utilisateur suivi |
| `createdAt` | `Date` | Non | `Date.now` | Date de création de la relation |

## Profiles

| Champ | Type Mongoose | Obligatoire | Valeur par défaut | Description |
|---|---|---|---|---|
| `username` | `String` | Oui | — | Nom d'utilisateur unique sur la plateforme |
| `bio` | `String` | Non | `''` | Courte biographie publique |
| `avatar` | `String` | Non | `''` | URL de l'image de profil |
| `createdAt` | `Date` | Non | `Date.now` | Date de création du profil |
| `updatedAt` | `Date` | Non | `Date.now` | Date de dernière modification |
| `fl_banned` | `Number` | Non | `0` | Statut de bannissement : `0` = actif, `1` = banni (mis à jour par le service modération) |

---

## Notes

- **Typo critique** : le champ `follwerId` est mal orthographié dans le code source (manque le `o` de `follower`).
- **Contrainte pk** : le champ `username`doit être unique car c'est l'identifiant de connexion
