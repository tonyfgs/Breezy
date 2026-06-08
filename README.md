# Breezy

Réseau social architecturé en microservices.

## Prérequis

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 8
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Installation

```bash
pnpm install
```

## Commandes

Toutes les commandes suivantes s'exécutent à la racine du projet.

### Développement

| Commande | Description |
|---|---|
| `pnpm dev` | Lance tous les services via Docker Compose (hot reload) |
| `pnpm dev:build` | Rebuild les images Docker puis lance |
| `pnpm dev:local` | Lance tous les services localement sans Docker |
| `pnpm down` | Arrête et supprime les containers |

### Qualité

| Commande | Description |
|---|---|
| `pnpm test` | Lance les tests sur tous les services |
| `pnpm test:coverage` | Tests avec rapport de couverture |
| `pnpm lint` | Vérifie le code sur tous les services |
| `pnpm lint:fix` | Corrige automatiquement les erreurs de lint |

### Par service (depuis la racine)

```bash
pnpm --filter @breezy/iam test
pnpm --filter @breezy/posts lint
pnpm --filter @breezy/front dev
```

## Ports

| Service | URL |
|---|---|
| Front (Next.js) | http://localhost:3000 |
| API Gateway | http://localhost:4000 |
| IAM | http://localhost:4001 |
| Users | http://localhost:4002 |
| Posts | http://localhost:4003 |
| Notifications | http://localhost:4004 |

## Documentation API (Swagger)

| Service | URL |
|---|---|
| Vue agrégée (gateway) | http://localhost:4000/api-docs |
| IAM | http://localhost:4001/api-docs |
| Users | http://localhost:4002/api-docs |
| Posts | http://localhost:4003/api-docs |
| Notifications | http://localhost:4004/api-docs |

## Structure du repo

```
Breezy/
├── front/                          # Application Next.js (React)
│   └── src/app/                    # App Router Next.js
├── api-gateway/                    # Passerelle Express
│   └── src/
│       ├── app.js                  # Configuration Express + proxy
│       ├── proxy.js                # Règles de proxy vers les services
│       └── swagger.js              # Agrégation des specs OpenAPI
└── microservices/
    ├── iam/                        # Identity & Access Management (port 4001)
    ├── users/                      # Profils utilisateurs (port 4002)
    ├── posts/                      # Publications (port 4003)
    └── notifications/              # Notifications (port 4004)
```

Chaque microservice suit la même structure :

```
microservice/
├── src/
│   ├── controllers/                # Logique métier
│   ├── middlewares/                # Auth, validation, erreurs
│   ├── models/                     # Schémas de données
│   ├── resources/                  # Données statiques, constantes
│   ├── routes/                     # Définition des routes + annotations Swagger
│   ├── app.js                      # App Express (exportée pour les tests)
│   ├── index.js                    # Démarrage du serveur
│   └── swagger.js                  # Configuration swagger-jsdoc
├── .env.example                    # Variables d'environnement
├── Dockerfile                      # Image de production
├── Dockerfile.dev                  # Image de développement (nodemon)
└── jest.config.js
```

## Variables d'environnement

Chaque service dispose d'un `.env.example`. Avant le premier lancement en local :

```bash
cp api-gateway/.env.example api-gateway/.env
cp microservices/iam/.env.example microservices/iam/.env
cp microservices/users/.env.example microservices/users/.env
cp microservices/posts/.env.example microservices/posts/.env
cp microservices/notifications/.env.example microservices/notifications/.env
```
