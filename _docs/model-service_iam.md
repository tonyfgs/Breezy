# IAM

> Service : IAM Service  
> Base de données : PostgreSQL  
> Table : `users`  
> Dernière mise à jour : 2026-06-16

---

## Users

| Champ | Type Sequelize | Obligatoire | Valeur par défaut | Description |
|-------|---------------|-------------|-------------------|-------------|
| `id` | `INTEGER` | Oui (PK) | auto-increment | Identifiant unique |
| `username` | `STRING` | Oui | — | Nom d'utilisateur unique |
| `passwordHash` | `STRING` | Oui | — | Mot de passe hashé (bcrypt) |
| `role` | `ENUM('user', 'moderator', 'admin')` | Oui | `"user"` | Rôle de l'utilisateur |
| `createdAt` | `DATE` | Non | auto | Date de création (géré par Sequelize) |
| `updatedAt` | `DATE` | Non | auto | Date de dernière modification (géré par Sequelize) |

---

## Notes

- Le champ `passwordHash` n'est jamais retourné dans les DTOs
- Le champ `username` est contraint `UNIQUE` en base
- `role` est un type `ENUM` natif Postgres (pas de table de référence séparée) — valeurs admises : `user`, `moderator`, `admin`
- `timestamps: true` — Sequelize gère `createdAt` et `updatedAt` automatiquement
