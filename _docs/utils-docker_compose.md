# Docker Compose — Commandes utiles

> Dernière mise à jour : 2026-06-12

---

## Fichiers disponibles

| Fichier | Usage |
|---------|-------|
| `docker-compose.yml` | Stack complète en production |
| `docker-compose.dev.yml` | Stack complète en développement |
| `microservices/iam/docker-compose.yml` | PostgreSQL IAM seul (dev local) |

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
# Démarrer uniquement NGINX + IAM + sa base
docker compose -f docker-compose.dev.yml up api-gateway iam iam-db

# Démarrer uniquement le service IAM et sa base
docker compose -f docker-compose.dev.yml up iam iam-db
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

## Accès direct à la base IAM

```bash
# Connexion psql via le container
docker exec -it iam-postgres-1 psql -U postgres -d iam_db

# Lister les tables
\dt

# Quitter
\q
```

---

## Rebuild d'un seul service

```bash
docker compose -f docker-compose.dev.yml up --build iam
```
