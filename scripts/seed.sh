#!/usr/bin/env bash
set -euo pipefail

# ─── Config ───────────────────────────────────────────────────────────────────
IAM_URL="${IAM_URL:-http://localhost:4001}"
USERS_URL="${USERS_URL:-http://localhost:4002}"
POSTS_URL="${POSTS_URL:-http://localhost:4003}"
MODERATION_URL="${MODERATION_URL:-http://localhost:4005}"

# ─── Couleurs ─────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[0;33m'; RED='\033[0;31m'; RESET='\033[0m'
ok()   { echo -e "  ${GREEN}✅ $*${RESET}"; }
warn() { echo -e "  ${YELLOW}⚠️  $*${RESET}"; }
fail() { echo -e "${RED}❌ $*${RESET}"; exit 1; }

# ─── Helpers curl ─────────────────────────────────────────────────────────────

# Décode le payload d'un JWT (sans vérification de signature)
jwt_field() {
  local token=$1 field=$2
  local payload
  payload=$(echo "$token" | cut -d'.' -f2)
  # Padding base64url → base64
  case $(( ${#payload} % 4 )) in
    2) payload="${payload}==";;
    3) payload="${payload}=";;
  esac
  echo "$payload" | base64 -d 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)['$field'])"
}

# POST JSON, retourne le body. Stocke le code HTTP dans $HTTP_CODE.
post() {
  local url=$1 data=$2
  shift 2
  local headers=()
  for h in "$@"; do headers+=(-H "$h"); done
  RESPONSE=$(curl -s -w '\n%{http_code}' -X POST "$url" \
    -H 'Content-Type: application/json' \
    "${headers[@]+"${headers[@]}"}" \
    -d "$data")
  BODY=$(echo "$RESPONSE" | sed '$d')
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
}

# PATCH JSON, retourne le body. Stocke le code HTTP dans $HTTP_CODE.
patch() {
  local url=$1 data=$2
  shift 2
  local headers=()
  for h in "$@"; do headers+=(-H "$h"); done
  RESPONSE=$(curl -s -w '\n%{http_code}' -X PATCH "$url" \
    -H 'Content-Type: application/json' \
    "${headers[@]+"${headers[@]}"}" \
    -d "$data")
  BODY=$(echo "$RESPONSE" | sed '$d')
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
}

# Login : récupère le cookie token= depuis Set-Cookie
login() {
  local username=$1 password=$2
  RESPONSE=$(curl -s -D - -X POST "$IAM_URL/auth/login" \
    -H 'Content-Type: application/json' \
    -d "{\"username\":\"$username\",\"password\":\"$password\"}")
  TOKEN=$(echo "$RESPONSE" | grep -i 'set-cookie:' | grep -o 'token=[^;]*' | cut -d= -f2)
  if [[ -z "$TOKEN" ]]; then
    fail "Login échoué pour $username"
  fi
}

# ─── Vérification des services ────────────────────────────────────────────────
check_services() {
  echo "🔍 Vérification des services..."
  local ok=true

  for entry in "IAM|$IAM_URL/auth/health" \
               "Users|$USERS_URL/users/health" \
               "Posts|$POSTS_URL/posts/health" \
               "Moderation|$MODERATION_URL/reports/health"; do
    local name url code
    name=$(echo "$entry" | cut -d'|' -f1)
    url=$(echo "$entry" | cut -d'|' -f2)
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "$url" || echo "000")
    if [[ "$code" == "200" ]]; then
      ok "$name"
    elif [[ "$code" == "000" ]]; then
      warn "$name inaccessible ($url)"
      ok=false
    else
      warn "$name répond $code — on continue quand même"
    fi
  done

  if [[ "$ok" == false ]]; then
    fail "Un ou plusieurs services sont inaccessibles.\nLancer d'abord : pnpm dev"
  fi
}

# ─── Inscription ──────────────────────────────────────────────────────────────
register_user() {
  local username=$1 password=$2 role=$3
  post "$IAM_URL/auth/register" \
    "{\"username\":\"$username\",\"password\":\"$password\",\"role\":\"$role\"}"
  if [[ "$HTTP_CODE" == "201" ]]; then
    ok "créé  $username ($role)"
  elif [[ "$HTTP_CODE" == "409" ]]; then
    warn "déjà existant  $username"
  else
    fail "Inscription $username échouée ($HTTP_CODE): $BODY"
  fi
}

# ─── Mise à jour du profil ────────────────────────────────────────────────────
update_profile() {
  local profile_id=$1 token=$2 bio=$3
  # Échappe les guillemets simples dans la bio
  bio="${bio//\'/\'}"
  patch "$USERS_URL/users/$profile_id" \
    "{\"bio\":\"$bio\"}" \
    "Authorization: Bearer $token"
  if [[ "$HTTP_CODE" != "200" ]]; then
    warn "Mise à jour profil $profile_id échouée ($HTTP_CODE)"
  fi
}

# ─── Création de post ─────────────────────────────────────────────────────────
create_post() {
  local token=$1 content=$2 tags=${3:-'[]'} parent=${4:-null}
  local data
  if [[ "$parent" == "null" ]]; then
    data="{\"content\":$(python3 -c "import json,sys; print(json.dumps(sys.argv[1]))" "$content"),\"tagsList\":$tags}"
  else
    data="{\"content\":$(python3 -c "import json,sys; print(json.dumps(sys.argv[1]))" "$content"),\"parentPostId\":\"$parent\"}"
  fi
  post "$POSTS_URL/posts" "$data" "Authorization: Bearer $token"
  if [[ "$HTTP_CODE" != "201" ]]; then
    fail "Création post échouée ($HTTP_CODE): $BODY"
  fi
  POST_ID=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
}

# ─── Follow ───────────────────────────────────────────────────────────────────
create_follow() {
  local token=$1 following_id=$2
  post "$USERS_URL/follows/" \
    "{\"followingId\":\"$following_id\"}" \
    "Authorization: Bearer $token"
  # 409 = déjà abonné, pas une erreur
  if [[ "$HTTP_CODE" != "201" && "$HTTP_CODE" != "409" ]]; then
    warn "Follow échoué ($HTTP_CODE)"
  fi
}

# ─── Like ─────────────────────────────────────────────────────────────────────
like_post() {
  local token=$1 post_id=$2
  post "$POSTS_URL/posts/$post_id/likes" '{}' "Authorization: Bearer $token"
  # 409 = déjà liké, pas une erreur
  if [[ "$HTTP_CODE" != "201" && "$HTTP_CODE" != "409" ]]; then
    warn "Like échoué sur $post_id ($HTTP_CODE)"
  fi
}

# ─── Report ───────────────────────────────────────────────────────────────────
create_report() {
  local token=$1 target_id=$2 target_type=$3 reason=$4
  post "$MODERATION_URL/reports" \
    "{\"targetId\":\"$target_id\",\"targetType\":\"$target_type\",\"reason\":\"$reason\"}" \
    "Authorization: Bearer $token"
  if [[ "$HTTP_CODE" != "201" ]]; then
    warn "Report échoué ($HTTP_CODE): $BODY"
  fi
}

# ─── Main ─────────────────────────────────────────────────────────────────────
echo "🌱 Breezy — script de seed"
echo ""
check_services

# ── 1. Inscription ────────────────────────────────────────────────────────────
echo ""
echo "📝 Inscription des utilisateurs..."
register_user admin      Admin123!     admin
register_user moderator1 Moderator123! moderator
register_user alice      Alice123!     user
register_user bob        Bob123!       user
register_user charlie    Charlie123!   user
register_user diana      Diana123!     user
register_user eve        Eve123!       user

# ── 2. Login & récupération des profileIds ────────────────────────────────────
echo ""
echo "🔑 Connexion..."

login admin Admin123!
TOKEN_ADMIN=$TOKEN
PID_ADMIN=$(jwt_field "$TOKEN_ADMIN" profileId)
ok "admin → $PID_ADMIN"

login moderator1 Moderator123!
TOKEN_MOD=$TOKEN
PID_MOD=$(jwt_field "$TOKEN_MOD" profileId)
ok "moderator1 → $PID_MOD"

login alice Alice123!
TOKEN_ALICE=$TOKEN
PID_ALICE=$(jwt_field "$TOKEN_ALICE" profileId)
ok "alice → $PID_ALICE"

login bob Bob123!
TOKEN_BOB=$TOKEN
PID_BOB=$(jwt_field "$TOKEN_BOB" profileId)
ok "bob → $PID_BOB"

login charlie Charlie123!
TOKEN_CHARLIE=$TOKEN
PID_CHARLIE=$(jwt_field "$TOKEN_CHARLIE" profileId)
ok "charlie → $PID_CHARLIE"

login diana Diana123!
TOKEN_DIANA=$TOKEN
PID_DIANA=$(jwt_field "$TOKEN_DIANA" profileId)
ok "diana → $PID_DIANA"

login eve Eve123!
TOKEN_EVE=$TOKEN
PID_EVE=$(jwt_field "$TOKEN_EVE" profileId)
ok "eve → $PID_EVE"

# ── 3. Mise à jour des bios ───────────────────────────────────────────────────
echo ""
echo "👤 Mise à jour des profils..."
update_profile "$PID_ADMIN"   "$TOKEN_ADMIN"   "Platform administrator"                         && ok "admin"
update_profile "$PID_MOD"     "$TOKEN_MOD"     "Content moderator — keeping Breezy clean"       && ok "moderator1"
update_profile "$PID_ALICE"   "$TOKEN_ALICE"   "Tech enthusiast & coffee lover | TypeScript fan" && ok "alice"
update_profile "$PID_BOB"     "$TOKEN_BOB"     "Photographer | Nature lover"                     && ok "bob"
update_profile "$PID_CHARLIE" "$TOKEN_CHARLIE" "Developer by day, gamer by night"               && ok "charlie"
update_profile "$PID_DIANA"   "$TOKEN_DIANA"   "Digital nomad — working from somewhere beautiful" && ok "diana"
update_profile "$PID_EVE"     "$TOKEN_EVE"     "Data scientist | AI researcher"                  && ok "eve"

# ── 4. Création des posts ─────────────────────────────────────────────────────
echo ""
echo "📮 Création des posts..."

create_post "$TOKEN_ALICE"   "Just started learning Rust! The borrow checker is something else 🦀 #programming #rust" '["programming","rust"]'
POST_0=$POST_ID; ok "[alice] post #0"

create_post "$TOKEN_ALICE"   "Morning coffee ritual ☕ Nothing beats a good espresso to start the day! #coffee" '["coffee","morning"]'
POST_1=$POST_ID; ok "[alice] post #1"

create_post "$TOKEN_BOB"     "Captured this amazing sunset yesterday 🌅 minimal post-processing. #photography #nature" '["photography","nature"]'
POST_2=$POST_ID; ok "[bob] post #2"

create_post "$TOKEN_BOB"     "Golden hour is pure magic ✨ #photography #goldenhour" '["photography","goldenhour"]'
POST_3=$POST_ID; ok "[bob] post #3"

create_post "$TOKEN_CHARLIE" "Finally finished my side project! A CLI tool for managing dotfiles. Open-sourced today 🎉 #opensource" '["opensource","devtools"]'
POST_4=$POST_ID; ok "[charlie] post #4"

create_post "$TOKEN_CHARLIE" "Hot take: tabs > spaces. Change my mind. #programming #debate" '["programming","debate"]'
POST_5=$POST_ID; ok "[charlie] post #5"

create_post "$TOKEN_DIANA"   "Just landed in Tokyo! The city at night is absolutely incredible 🗼 #travel #japan" '["travel","japan","tokyo"]'
POST_6=$POST_ID; ok "[diana] post #6"

create_post "$TOKEN_DIANA"   "Street food in Bangkok is on another level 🍜 pad kra pao for breakfast, why not? #travel #foodie" '["travel","thailand","foodie"]'
POST_7=$POST_ID; ok "[diana] post #7"

create_post "$TOKEN_EVE"     "Great paper on transformers for time-series forecasting — attention mechanism works surprisingly well here 📊 #ai #datascience" '["ai","datascience"]'
POST_8=$POST_ID; ok "[eve] post #8"

create_post "$TOKEN_EVE"     "TIL about UMAP for dimensionality reduction. Outperforms t-SNE on large datasets! #datascience #ml" '["datascience","ml"]'
POST_9=$POST_ID; ok "[eve] post #9"

create_post "$TOKEN_ALICE"   "Docker Compose is a lifesaver for local dev — one command and everything just works 🐳 #devops #docker" '["devops","docker"]'
POST_10=$POST_ID; ok "[alice] post #10"

create_post "$TOKEN_CHARLIE" "VSCode extension recommendations? Vim keybindings + Copilot here. What is in your setup? #vscode" '["vscode","productivity"]'
POST_11=$POST_ID; ok "[charlie] post #11"

create_post "$TOKEN_BOB"     "Experimenting with long-exposure night photography 📷 30s, f/8, ISO 200. #photography #night" '["photography","nightphotography"]'
POST_12=$POST_ID; ok "[bob] post #12"

create_post "$TOKEN_DIANA"   "Working remotely from Lisbon this month 🇵🇹 Perfect weather, great coffee, fast WiFi. #digitalnomad" '["digitalnomad","portugal"]'
POST_13=$POST_ID; ok "[diana] post #13"

create_post "$TOKEN_EVE"     "Python 3.12 perf improvements are significant — up to 25% speedup on CPU-bound code! #python #performance" '["python","performance"]'
POST_14=$POST_ID; ok "[eve] post #14"

# ── 4b. Posts supplémentaires (volume pour test pagination / cursor) ──────────
echo ""
echo "📮 Posts supplémentaires (pagination)..."

# bob — photographie
create_post "$TOKEN_BOB" "Just got the new 50mm prime — the bokeh is insane 😍 #photography #gear" '["photography","gear"]'; ok "[bob] vol-1"
create_post "$TOKEN_BOB" "Rule of thirds is overrated. Sometimes dead center just works. #photography" '["photography"]'; ok "[bob] vol-2"
create_post "$TOKEN_BOB" "Shot an entire roll of film today. Analog revival is real 📷 #film #analog" '["photography","analog"]'; ok "[bob] vol-3"
create_post "$TOKEN_BOB" "The light this morning was perfect — woke up at 5am for this shot. Worth it. #goldenhour" '["photography","goldenhour"]'; ok "[bob] vol-4"
create_post "$TOKEN_BOB" "Macro photography tip: manual focus is your best friend 🔬 #macro #photography" '["photography","macro"]'; ok "[bob] vol-5"
create_post "$TOKEN_BOB" "Just got a drone. Aerial photography is a whole new world 🚁 #drone #photography" '["photography","drone"]'; ok "[bob] vol-6"
create_post "$TOKEN_BOB" "Processed 3000 RAW files this weekend. Lightroom is both a gift and a curse. #editing" '["photography","lightroom"]'; ok "[bob] vol-7"
create_post "$TOKEN_BOB" "Black and white photography forces you to think about light differently 🖤 #bnw" '["photography","bnw"]'; ok "[bob] vol-8"
create_post "$TOKEN_BOB" "Wildlife photography requires infinite patience. Waited 4 hours for this eagle shot. 🦅" '["photography","wildlife"]'; ok "[bob] vol-9"
create_post "$TOKEN_BOB" "Street photography in rain is incredible — reflections everywhere 🌧️ #street" '["photography","street"]'; ok "[bob] vol-10"
create_post "$TOKEN_BOB" "The Sony A7IV autofocus is legitimately magic. Never missed a shot. #gear" '["photography","gear"]'; ok "[bob] vol-11"
create_post "$TOKEN_BOB" "Printing your photos is underrated — they look completely different on paper. #print" '["photography"]'; ok "[bob] vol-12"
create_post "$TOKEN_BOB" "Portrait lighting: one key light + reflector is often all you need. #portrait" '["photography","portrait"]'; ok "[bob] vol-13"
create_post "$TOKEN_BOB" "Just discovered ND filters. Long exposure landscapes are now my obsession 🌊 #landscape" '["photography","landscape"]'; ok "[bob] vol-14"
create_post "$TOKEN_BOB" "Shooting in RAW vs JPEG — never going back to JPEG. Ever. #photography" '["photography"]'; ok "[bob] vol-15"
create_post "$TOKEN_BOB" "The 'decisive moment' Cartier-Bresson talked about — still the most important concept in photography." '["photography"]'; ok "[bob] vol-16"
create_post "$TOKEN_BOB" "Captured a double rainbow this morning. The timing was everything 🌈 #nature" '["photography","nature"]'; ok "[bob] vol-17"
create_post "$TOKEN_BOB" "Color grading makes or breaks a photo. Subtle is almost always better. #editing" '["photography","editing"]'; ok "[bob] vol-18"
create_post "$TOKEN_BOB" "Finished a month-long photo-a-day challenge. Highly recommend for improving consistency 📷" '["photography"]'; ok "[bob] vol-19"
create_post "$TOKEN_BOB" "Infrared photography is wild — green leaves turn white and skies go dark. Mind-bending. #infrared" '["photography","infrared"]'; ok "[bob] vol-20"
create_post "$TOKEN_BOB" "Fujifilm film simulations are genuinely impressive. Velvia mode 🎞️ #fujifilm" '["photography","fujifilm"]'; ok "[bob] vol-21"
create_post "$TOKEN_BOB" "Sometimes the best camera is the one you have with you — phone camera lately 📱 #mobilephoto" '["photography","mobile"]'; ok "[bob] vol-22"

# charlie — développement
create_post "$TOKEN_CHARLIE" "Just refactored 500 lines of spaghetti code into clean functions. So satisfying. #cleancode" '["programming","cleancode"]'; ok "[charlie] vol-1"
create_post "$TOKEN_CHARLIE" "TypeScript strict mode — scary at first, lifesaving later. Enable it. #typescript" '["typescript","programming"]'; ok "[charlie] vol-2"
create_post "$TOKEN_CHARLIE" "Why does every project end up with its own custom CSS framework 🤦 #webdev" '["webdev"]'; ok "[charlie] vol-3"
create_post "$TOKEN_CHARLIE" "Deployed to production on Friday. Living dangerously. #devops" '["devops","programming"]'; ok "[charlie] vol-4"
create_post "$TOKEN_CHARLIE" "Code reviews are how you level up. Both giving AND receiving. #softwareengineering" '["softwareengineering"]'; ok "[charlie] vol-5"
create_post "$TOKEN_CHARLIE" "Finally understood closures properly. Only took 3 years 😅 #javascript" '["javascript","programming"]'; ok "[charlie] vol-6"
create_post "$TOKEN_CHARLIE" "Hot take: README files should be as important as the code itself. #documentation" '["programming","documentation"]'; ok "[charlie] vol-7"
create_post "$TOKEN_CHARLIE" "Found a bug I introduced 6 months ago. Left a comment blaming a different me. #gitblame" '["programming"]'; ok "[charlie] vol-8"
create_post "$TOKEN_CHARLIE" "Pair programming session turned 2 hours of stuck into 20 minutes. Never underestimate it." '["programming","agile"]'; ok "[charlie] vol-9"
create_post "$TOKEN_CHARLIE" "The satisfaction of deleting more code than you write is unmatched. #refactoring" '["programming","refactoring"]'; ok "[charlie] vol-10"
create_post "$TOKEN_CHARLIE" "Kubernetes is just Docker Compose but you need a PhD to understand it 😅 #devops" '["devops","kubernetes"]'; ok "[charlie] vol-11"
create_post "$TOKEN_CHARLIE" "Spent 3 hours debugging. Problem: missing semicolon. Classic. #programming" '["programming"]'; ok "[charlie] vol-12"
create_post "$TOKEN_CHARLIE" "Just discovered tree-shaking. Why didn't anyone tell me about this earlier? #webpack #performance" '["webdev","performance"]'; ok "[charlie] vol-13"
create_post "$TOKEN_CHARLIE" "The moment your unit tests catch a real bug in production code — worth every minute writing them 🎯" '["testing","programming"]'; ok "[charlie] vol-14"
create_post "$TOKEN_CHARLIE" "Linux on the desktop for 3 years now. The learning curve was steep. Worth it. #linux" '["linux","programming"]'; ok "[charlie] vol-15"
create_post "$TOKEN_CHARLIE" "Just shipped my first open source library. 12 stars on GitHub, feeling famous ⭐ #opensource" '["opensource"]'; ok "[charlie] vol-16"
create_post "$TOKEN_CHARLIE" "The compiler is always right. You are wrong. Accept it. #programming #types" '["programming"]'; ok "[charlie] vol-17"
create_post "$TOKEN_CHARLIE" "Performance profiling: spent an hour optimizing the hot path — shaved off 3ms. Worth it. #performance" '["programming","performance"]'; ok "[charlie] vol-18"
create_post "$TOKEN_CHARLIE" "Monorepo vs polyrepo debate again. I have opinions but I am too tired to argue. #architecture" '["programming","architecture"]'; ok "[charlie] vol-19"
create_post "$TOKEN_CHARLIE" "SQL JOIN vs ORM — having this debate with myself for the third project in a row 😂 #backend" '["backend","programming"]'; ok "[charlie] vol-20"
create_post "$TOKEN_CHARLIE" "ESLint saving my code from itself daily ⚡ Mandatory in every project now. #javascript" '["javascript","tooling"]'; ok "[charlie] vol-21"
create_post "$TOKEN_CHARLIE" "Dark mode in your IDE is self-care, not a preference. #programming #unpopularopinion" '["programming"]'; ok "[charlie] vol-22"

# eve — data science / IA
create_post "$TOKEN_EVE" "Fine-tuning a small LLM on domain-specific data — the results are surprisingly good 🤖 #llm #ai" '["ai","llm"]'; ok "[eve] vol-1"
create_post "$TOKEN_EVE" "Gradient descent visualization finally made it click for me 📉 #ml #deeplearning" '["ml","deeplearning"]'; ok "[eve] vol-2"
create_post "$TOKEN_EVE" "RAG pipelines are the bridge between LLMs and real-world data. Fascinating architecture. #rag #ai" '["ai","rag"]'; ok "[eve] vol-3"
create_post "$TOKEN_EVE" "Data cleaning: 80% of the job that nobody talks about enough. #datascience" '["datascience"]'; ok "[eve] vol-4"
create_post "$TOKEN_EVE" "K-fold cross-validation should be non-negotiable for serious model evaluation. #ml #validation" '["ml","datascience"]'; ok "[eve] vol-5"
create_post "$TOKEN_EVE" "Just re-read the AlphaFold paper. Still blows my mind what it achieves with proteins 🔬 #biology #ai" '["ai","biology"]'; ok "[eve] vol-6"
create_post "$TOKEN_EVE" "Feature engineering > model selection in most practical problems. Unpopular opinion? #datascience" '["datascience","ml"]'; ok "[eve] vol-7"
create_post "$TOKEN_EVE" "Polars vs Pandas: Polars performance on large datasets is no joke. Making the switch. #python" '["python","datascience"]'; ok "[eve] vol-8"
create_post "$TOKEN_EVE" "Explainable AI isn't optional when lives depend on the model output. #xai #ethics" '["ai","ethics"]'; ok "[eve] vol-9"
create_post "$TOKEN_EVE" "The bias-variance tradeoff is the single most important concept in ML. Period. #ml" '["ml","datascience"]'; ok "[eve] vol-10"
create_post "$TOKEN_EVE" "Just set up MLflow for experiment tracking. Reproducibility is finally real in my workflow 🎉 #mlflow" '["ml","mlops"]'; ok "[eve] vol-11"
create_post "$TOKEN_EVE" "Vector databases are having a moment — Faiss, Pinecone, Weaviate. Picking one is tough. #vectordb" '["ai","vectordb"]'; ok "[eve] vol-12"
create_post "$TOKEN_EVE" "Python type hints in data pipelines make collaboration 100x easier. Not optional anymore. #python" '["python","datascience"]'; ok "[eve] vol-13"
create_post "$TOKEN_EVE" "Jupyter notebooks: great for exploration, terrible for production. This is not controversial. #python" '["python","datascience"]'; ok "[eve] vol-14"
create_post "$TOKEN_EVE" "Data drift detection in production models is still an unsolved problem in practice. #mlops" '["mlops","datascience"]'; ok "[eve] vol-15"
create_post "$TOKEN_EVE" "Bayesian optimization for hyperparameter tuning — why is this not the default everywhere? #ml" '["ml","optimization"]'; ok "[eve] vol-16"
create_post "$TOKEN_EVE" "Synthetic data generation is becoming a legit tool for low-data regimes 📊 #datascience #ai" '["datascience","ai"]'; ok "[eve] vol-17"
create_post "$TOKEN_EVE" "Confusion matrices should be the first thing you look at, not accuracy. Always. #ml #metrics" '["ml","metrics"]'; ok "[eve] vol-18"
create_post "$TOKEN_EVE" "Just discovered DuckDB. SQL on local files with DataFrame-like performance? Yes please 🦆 #sql" '["sql","datascience"]'; ok "[eve] vol-19"
create_post "$TOKEN_EVE" "The curse of dimensionality should be taught in every intro ML course. #ml #teaching" '["ml","datascience"]'; ok "[eve] vol-20"
create_post "$TOKEN_EVE" "Model monitoring in production: trust but verify. Always verify. #mlops" '["mlops","ai"]'; ok "[eve] vol-21"
create_post "$TOKEN_EVE" "Attention is all you need — still probably the most impactful paper title in ML history. #transformers" '["ai","transformers"]'; ok "[eve] vol-22"

# diana — nomade digital / voyage
create_post "$TOKEN_DIANA" "Bali next week, then Singapore, then... I have no idea. That is the point 🌏 #travel" '["travel","digitalnomad"]'; ok "[diana] vol-1"
create_post "$TOKEN_DIANA" "Best productivity hack as a nomad: find a café with good wifi and bad food so you stay focused 😂" '["digitalnomad","productivity"]'; ok "[diana] vol-2"
create_post "$TOKEN_DIANA" "Three months in Southeast Asia and I still haven't figured out how to pack light 🧳 #travel" '["travel"]'; ok "[diana] vol-3"
create_post "$TOKEN_DIANA" "Working across 4 timezones this week. My sleep schedule is a suggestion at this point. #remotework" '["remotework","digitalnomad"]'; ok "[diana] vol-4"
create_post "$TOKEN_DIANA" "Accidentally learned basic Thai by ordering food every day for 2 months. Immersion works 🍜 #thailand" '["travel","thailand"]'; ok "[diana] vol-5"
create_post "$TOKEN_DIANA" "Coworking spaces vary wildly in quality. Berlin has the best ones so far. #coworking #travel" '["coworking","travel"]'; ok "[diana] vol-6"
create_post "$TOKEN_DIANA" "Spending a whole month in one city instead of hopping around — underrated approach. #slowtravel" '["travel","slowtravel"]'; ok "[diana] vol-7"
create_post "$TOKEN_DIANA" "The loneliness of solo travel hits differently than expected. Also the freedom. #solotravel" '["travel","solotravel"]'; ok "[diana] vol-8"
create_post "$TOKEN_DIANA" "Found a hidden waterfall in the Philippines that wasn't on any map 💦 #philippines #adventure" '["travel","adventure"]'; ok "[diana] vol-9"
create_post "$TOKEN_DIANA" "Remote work pro tip: timezone differences are a feature. Deep work happens when everyone else is asleep 🌙" '["remotework","productivity"]'; ok "[diana] vol-10"

# alice — tech / web dev
create_post "$TOKEN_ALICE" "Finished migrating a legacy Express app to NestJS. The DI system is chef's kiss 🍳 #nodejs" '["nodejs","typescript"]'; ok "[alice] vol-1"
create_post "$TOKEN_ALICE" "The gap between senior and principal engineer is mostly about systems thinking. #career" '["career","softwareengineering"]'; ok "[alice] vol-2"
create_post "$TOKEN_ALICE" "Just started using Zod for runtime validation. Should have done this years ago. #typescript" '["typescript","webdev"]'; ok "[alice] vol-3"
create_post "$TOKEN_ALICE" "npm audit: 3 critical, 47 high vulnerabilities. Just another Tuesday. #nodejs #security" '["nodejs","security"]'; ok "[alice] vol-4"
create_post "$TOKEN_ALICE" "Learning Go this month. The simplicity is refreshing after TypeScript. #golang" '["golang","programming"]'; ok "[alice] vol-5"
create_post "$TOKEN_ALICE" "Hot coffee at 6am while reading docs — this is what they don't show you in tech YouTube 😅 #devlife" '["devlife","coffee"]'; ok "[alice] vol-6"
create_post "$TOKEN_ALICE" "Just realized all my temporary workarounds are now 2 years old. They are the architecture now. #tech debt" '["programming","techdebt"]'; ok "[alice] vol-7"
create_post "$TOKEN_ALICE" "The best documentation is code that doesn't need documentation. #cleancode" '["programming","cleancode"]'; ok "[alice] vol-8"
create_post "$TOKEN_ALICE" "Conference talk submitted. Terrified. Excited. Mostly terrified. 🎤 #devrel #publicspeaking" '["devrel","career"]'; ok "[alice] vol-9"
create_post "$TOKEN_ALICE" "Web Components in 2026 — actually pretty good now. Browser support is solid 🌐 #webdev" '["webdev","frontend"]'; ok "[alice] vol-10"

# ── 5. Commentaires (réponses) ────────────────────────────────────────────────
echo ""
echo "💬 Création des commentaires..."

create_post "$TOKEN_BOB"     "Rust is amazing once it clicks! The borrow checker feels like a superpower 💪" '[]' "$POST_0"
ok "[bob] → réponse à #0"

create_post "$TOKEN_EVE"     "I went through the same frustration. It does get better, promise 😄" '[]' "$POST_0"
ok "[eve] → réponse à #0"

create_post "$TOKEN_ALICE"   "Stunning shot! What camera body and lens are you using? 📸" '[]' "$POST_2"
ok "[alice] → réponse à #2"

create_post "$TOKEN_DIANA"   "Absolutely gorgeous. Where was this taken?" '[]' "$POST_2"
ok "[diana] → réponse à #2"

create_post "$TOKEN_ALICE"   "This sounds super useful! Is the repo on GitHub?" '[]' "$POST_4"
ok "[alice] → réponse à #4"

create_post "$TOKEN_EVE"     "Spaces team represent — we will not surrender 😂" '[]' "$POST_5"
ok "[eve] → réponse à #5"

create_post "$TOKEN_CHARLIE" "Tokyo is incredible! Do not miss Shinjuku at night and Yanaka for the old-town vibes 🏮" '[]' "$POST_6"
ok "[charlie] → réponse à #6"

create_post "$TOKEN_ALICE"   "Great find! Do you have the arXiv link?" '[]' "$POST_8"
ok "[alice] → réponse à #8"

create_post "$TOKEN_BOB"     "Does UMAP preserve global structure better than t-SNE?" '[]' "$POST_9"
ok "[bob] → réponse à #9"

create_post "$TOKEN_CHARLIE" "The JIT improvements are wild. Were you testing with CPython or an alternative?" '[]' "$POST_14"
ok "[charlie] → réponse à #14"

# ── 6. Follows ────────────────────────────────────────────────────────────────
echo ""
echo "👥 Création des follows..."

create_follow "$TOKEN_ALICE"   "$PID_BOB";     ok "alice → bob"
create_follow "$TOKEN_ALICE"   "$PID_CHARLIE"; ok "alice → charlie"
create_follow "$TOKEN_ALICE"   "$PID_EVE";     ok "alice → eve"
create_follow "$TOKEN_BOB"     "$PID_ALICE";   ok "bob → alice"
create_follow "$TOKEN_BOB"     "$PID_DIANA";   ok "bob → diana"
create_follow "$TOKEN_CHARLIE" "$PID_ALICE";   ok "charlie → alice"
create_follow "$TOKEN_CHARLIE" "$PID_EVE";     ok "charlie → eve"
create_follow "$TOKEN_DIANA"   "$PID_ALICE";   ok "diana → alice"
create_follow "$TOKEN_DIANA"   "$PID_BOB";     ok "diana → bob"
create_follow "$TOKEN_DIANA"   "$PID_CHARLIE"; ok "diana → charlie"
create_follow "$TOKEN_EVE"     "$PID_ALICE";   ok "eve → alice"
create_follow "$TOKEN_EVE"     "$PID_DIANA";   ok "eve → diana"
create_follow "$TOKEN_MOD"     "$PID_ALICE";   ok "moderator1 → alice"

# ── 7. Likes ──────────────────────────────────────────────────────────────────
echo ""
echo "❤️  Création des likes..."

like_post "$TOKEN_BOB"     "$POST_0";  ok "bob liked #0"
like_post "$TOKEN_CHARLIE" "$POST_0";  ok "charlie liked #0"
like_post "$TOKEN_EVE"     "$POST_0";  ok "eve liked #0"
like_post "$TOKEN_ALICE"   "$POST_2";  ok "alice liked #2"
like_post "$TOKEN_DIANA"   "$POST_2";  ok "diana liked #2"
like_post "$TOKEN_ALICE"   "$POST_4";  ok "alice liked #4"
like_post "$TOKEN_DIANA"   "$POST_4";  ok "diana liked #4"
like_post "$TOKEN_ALICE"   "$POST_6";  ok "alice liked #6"
like_post "$TOKEN_CHARLIE" "$POST_6";  ok "charlie liked #6"
like_post "$TOKEN_ALICE"   "$POST_8";  ok "alice liked #8"
like_post "$TOKEN_CHARLIE" "$POST_9";  ok "charlie liked #9"
like_post "$TOKEN_ALICE"   "$POST_14"; ok "alice liked #14"
like_post "$TOKEN_BOB"     "$POST_14"; ok "bob liked #14"
like_post "$TOKEN_DIANA"   "$POST_10"; ok "diana liked #10"
like_post "$TOKEN_CHARLIE" "$POST_13"; ok "charlie liked #13"

# ── 8. Reports ────────────────────────────────────────────────────────────────
echo ""
echo "🚩 Création des reports..."

create_report "$TOKEN_ALICE"   "$POST_5" post "Incites unnecessary divisive debate"; ok "alice a reporté post #5"
create_report "$TOKEN_CHARLIE" "$POST_5" post "Inflammatory content";                ok "charlie a reporté post #5"

# ── Résumé ────────────────────────────────────────────────────────────────────
echo ""
echo "─────────────────────────────────────────"
echo -e "${GREEN}✅ Seed terminé !${RESET}"
echo ""
echo "  Utilisateurs : 7   (1 admin, 1 modérateur, 5 users)"
echo "  Posts        : 101  (15 initiaux + 86 de volume)"
echo "  Commentaires : 10"
echo "  Follows      : 13"
echo "  Likes        : 15"
echo "  Reports      : 2"
echo "  → Feed alice (suit bob/charlie/eve) : ~66 posts = 3+ pages de cursor"
echo ""
echo "Identifiants :"
printf "  %-12s %-14s %s\n" "admin"      "admin"      "Admin123!"
printf "  %-12s %-14s %s\n" "moderator"  "moderator1" "Moderator123!"
printf "  %-12s %-14s %s\n" "user"       "alice"      "Alice123!"
printf "  %-12s %-14s %s\n" "user"       "bob"        "Bob123!"
printf "  %-12s %-14s %s\n" "user"       "charlie"    "Charlie123!"
printf "  %-12s %-14s %s\n" "user"       "diana"      "Diana123!"
printf "  %-12s %-14s %s\n" "user"       "eve"        "Eve123!"
