# Docker Compose — Commandes utiles

> Dernière mise à jour : 2026-06-15

---

## Fichiers disponibles

| Fichier | Usage |
|---------|-------|
| `docker-compose.yml` | Stack complète en production |
| `docker-compose.dev.yml` | Stack complète en développement |
| `microservices/iam/docker-compose.yml` | PostgreSQL IAM seul (dev local sans compose global) |
| `microservices/users/docker-compose.yaml` | MongoDB Users seul (dev local sans compose global) |
| `microservices/posts/docker-compose.yaml` | MongoDB Posts seul (dev local sans compose global) |

## Services et bases de données

| Service | Port | Base de données | Service DB | Port DB (host) |
|---------|------|-----------------|------------|----------------|
| `api-gateway` | 4000 | — | — | — |
| `iam` | 4001 | PostgreSQL | `iam-db` | 5433 |
| `users` | 4002 | MongoDB | `users-db` | 27018 |
| `posts` | 4003 | MongoDB | `posts-db` | 27019 |
| `notifications` | 4004 | — | — | — |
| `test-private` | 4005 | — | — | — |
| `moderation` | 4006 | MongoDB | `moderation-db` | 27020 |

---

## Stack complète

```bash
# Démarrer tous les services (dev)
docker compose -f docker-compose.dev.yml up

# Démarrer en arrière-plan
docker compose -f docker-compose.dev.yml up -d

# Arrêter
docker compose -f docker-compose.dev.yml down

# Arrêter et supprimer les volumes
docker compose -f docker-compose.dev.yml down -v

# Rebuild les images avant démarrage
docker compose -f docker-compose.dev.yml up --build
```

---

## Services ciblés

```bash
# NGINX + IAM + sa base
docker compose -f docker-compose.dev.yml up api-gateway iam iam-db

# NGINX + IAM + Posts + leurs bases + test-private
docker compose -f docker-compose.dev.yml up -d api-gateway iam iam-db posts posts-db test-private

# Uniquement le service Posts et sa base
docker compose -f docker-compose.dev.yml up posts posts-db

# Uniquement le service IAM et sa base
docker compose -f docker-compose.dev.yml up iam iam-db

# Uniquement le service User et sa base
docker compose -f docker-compose.dev.yml up users users-db
```

---

## PostgreSQL IAM (dev local, sans docker-compose global)

```bash
# Depuis microservices/iam/
docker compose up -d        # Démarrer la base
docker compose down         # Arrêter
docker compose down -v      # Arrêter et supprimer les données
```

---

## Logs

```bash
# Logs de tous les services
docker compose -f docker-compose.dev.yml logs

# Logs d'un service en temps réel
docker compose -f docker-compose.dev.yml logs -f iam

# Logs NGINX
docker compose -f docker-compose.dev.yml logs -f api-gateway
```

---

## Rebuild d'un seul service

```bash
docker compose -f docker-compose.dev.yml up --build iam
```
