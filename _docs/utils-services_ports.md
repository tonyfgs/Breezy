# Ports des services

> Dernière mise à jour : 2026-06-17

---

## Services applicatifs

| Service | Port (host) | Port (conteneur) | Stack |
|---------|-------------|-------------------|-------|
| `front` | 3000 | 3000 | Next.js |
| `api-gateway` | 4000 | 80 | NGINX |
| `iam` | 4001 | 4001 | Express |
| `users` | 4002 | 4002 | Express |
| `posts` | 4003 | 4003 | Express |
| `moderation` | 4005 | 4005 | Express |

---

## Bases de données

| Base de données | Service associé | Port (host, stack complète) | Port (host, standalone) |
|------------------|------------------|------------------------------|---------------------------|
| `iam-db` (PostgreSQL) | `iam` | non exposé (réseau Docker interne uniquement) | `5433` (`microservices/iam/docker-compose.yml`) |
| `users-db` (MongoDB) | `users` | `27018` | `27017` (`microservices/users/docker-compose.yaml`) |
| `posts-db` (MongoDB) | `posts` | `27019` | `27017` (`microservices/posts/docker-compose.yaml`) |
| `moderation-db` (MongoDB) | `moderation` | `27020` | — |
