Models base de données
Authentification
id                         UUID                         PRIMARY KEY
txt_email             VARCHAR(255)        UNIQUE NOT NULL
txt_password      VARCHAR(255)        NOT NULL
fl_active              BOOLEAN                DEFAULT true
ts_createdAt       TIMESTAMP             DEFAULT NOW()
ts_updatedAt      TIMESTAMP             DEFAULT NOW()


User
// profiles
{ 
      sk_id: String,
      nm_username: String,
      txt_bio: String,
      url_avatar: String,
      fl_active: Boolean
      ts_createdAt: Date,
      ts_updatedAt: Date
}

// follows
{
      sk_followerId: String, 
      sk_followingId: String, 
      ts_createdAt: Date
} 


Post
// posts and comment
{
      sk_id:             ObjectId,
      sk_authorId:      String,
      txt_content:       String,
      sk_parentPostId: ObjectId|null,
      nb_likesCount:    Integer,
      sk_tagsList: ObjectId                               -- si une collection tags
      sk_media: ObjectId                                  -- si une collection media
      sk_mentionsList: ObsjectId                      -- id des user mention
      ts_createdAt:     Date,
      ts_updatedAt:     Date
}

// likes
{
      sk_postId:   ObjectId,
      sk_userId:   String,
      ts_createdAt: Date
}

Notification
{
      sk_id:        ObjectId,
      sk_userId:   String,
      cd_type:      String,   // "like" | "comment" | "follow" | "mention"
      sk_actorId:  String,
      sk_postId:   String|null,
      sk_mentionsList:  ObjectId
      fl_read:   Boolean,
      ts_createdAt: Date
}


Modération
// reports
{
      sk_id:           ObjectId,
      sk_reporterId:  String,      // qui signale
      sk_targetId:    String,       // post ou utilisateur signalé
      cd_targetType:  String,    // "post" | "user"
      txt_reason:      String,
      cd_status:       String,      // "pending" | "reviewed" | "dismissed"
      ts_createdAt:   Date,
      ts_updatedAt:   Date
}

// sanctions
{
      SK_id:              ObjectId,
      SK_user_id:         String,
      SK_moderator_id:    String,
      CD_type:            String,    // "suspension" | "ban"
      TXT_reason:         String,
      TS_expires_at:      Date|null, // null = ban permanent
      TS_created_at:      Date
}



Voir la partie Feed
