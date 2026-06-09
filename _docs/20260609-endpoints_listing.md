End-points API
Auth endpoints
POST   /auth/register        -- création de compte
POST   /auth/login           -- connexion, retourne JWT
POST   /auth/logout          -- invalidation du token
POST   /auth/refresh         -- renouvellement du JWT


User endpoints
GET    /users/:id            -- profil public d'un utilisateur
PATCH  /users/:id            -- modifier son profil (bio, avatar)
DELETE /users/:id            -- supprimer son compte

GET    /users/:id/followers  -- liste des followers
GET    /users/:id/following  -- liste des abonnements
POST   /users/:id/follow     -- suivre un utilisateur
DELETE /users/:id/follow     -- ne plus suivre


Post endpoints
-- Posts
POST   /posts                -- créer un post
GET    /posts/:id            -- récupérer un post
PATCH  /posts/:id            -- modifier un post
DELETE /posts/:id            -- supprimer un post
GET    /users/:id/posts      -- tous les posts d'un utilisateur

-- Commentaires
GET    /posts/:id/comments         -- récupérer les commentaires d'un post
POST   /posts/:id/comments         -- commenter un post
GET    /posts/:id/comments/:cid    -- récupérer un commentaire
DELETE /posts/:id/comments/:cid    -- supprimer un commentaire

-- Likes
POST   /posts/:id/likes      -- liker un post
DELETE /posts/:id/likes      -- unliker un post

-- Tags
GET    /tags                 -- liste des tags
GET    /tags/:name/posts     -- posts associés à un tag


Notifications endpoints
GET    /notifications              -- toutes les notifications
GET    /notifications/unread       -- notifications non lues
PATCH  /notifications/:id/read     -- marquer comme lue
PATCH  /notifications/read-all     -- tout marquer comme lu
DELETE /notifications/:id          -- supprimer une notification



Moderations endpoints
-- Signalements
POST   /reports                    -- signaler un post ou utilisateur
GET    /reports                    -- liste des signalements (modérateur)
GET    /reports/:id                -- détail d'un signalement
PATCH  /reports/:id                -- changer le statut (reviewed, dismissed)

-- Sanctions
POST   /sanctions                  -- suspendre ou bannir un utilisateur
GET    /sanctions/:userId          -- historique des sanctions d'un utilisateur
DELETE /sanctions/:id              -- lever une sanction



Voir la partie feed

