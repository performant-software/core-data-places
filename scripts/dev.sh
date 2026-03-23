#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITES_FILE="$SCRIPT_DIR/sites.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${CYAN}[info]${NC} $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $*"; }
error() { echo -e "${RED}[error]${NC} $*" >&2; }
success() { echo -e "${GREEN}[ok]${NC} $*"; }

usage() {
  cat <<EOF
Usage: scripts/dev.sh <site> [options]

Switch to a CDP site and start the dev server.

Options:
  --no-match     Skip checking out the site's deployed CDP version
  --skip-clean   Skip content/cache cleanup (faster restart for same site)
  --list         Show available site names
  --init         Generate scripts/sites.json from your Netlify account
  -h, --help     Show this help

Examples:
  scripts/dev.sh --init             # First-time setup: generate sites.json
  scripts/dev.sh atlas              # Match deployed version, switch, and start
  scripts/dev.sh uss --no-match     # Skip version matching, just switch and start
  scripts/dev.sh atlas --skip-clean # Restart Atlas without re-cloning content
  npm run dev -- atlas              # Same thing via npm
EOF
}

init_sites() {
  info "Querying Netlify for CDP sites..."
  local json
  json=$(npx netlify sites:list --json 2>/dev/null)

  if [ -z "$json" ]; then
    error "Failed to fetch sites. Make sure you're logged in (netlify login)."
    exit 1
  fi

  node -e "
    const sites = JSON.parse(process.argv[1]);
    const cdpSites = sites.filter(s =>
      s.build_settings?.repo_url === 'https://github.com/performant-software/core-data-places'
    );

    if (cdpSites.length === 0) {
      console.error('No CDP sites found in your Netlify account.');
      process.exit(1);
    }

    const registry = {};
    for (const s of cdpSites.sort((a, b) => a.name.localeCompare(b.name))) {
      registry[s.name] = s.id;
    }

    const fs = require('fs');
    fs.writeFileSync('$SITES_FILE', JSON.stringify(registry, null, 2) + '\n');
    console.log('Wrote $SITES_FILE with ' + cdpSites.length + ' sites:');
    for (const [name, id] of Object.entries(registry)) {
      console.log('  ' + name + '  ' + id);
    }
    console.log('');
    console.log('Tip: edit the file to use shorter names (e.g. \"uss\" instead of \"universities-studying-slavery\").');
  " "$json"
}

list_sites() {
  echo -e "${BOLD}Available sites:${NC}"
  # Parse JSON keys without jq dependency
  node -e "
    const sites = JSON.parse(require('fs').readFileSync('$SITES_FILE', 'utf8'));
    const maxLen = Math.max(...Object.keys(sites).map(k => k.length));
    for (const [name, id] of Object.entries(sites)) {
      console.log('  ' + name.padEnd(maxLen + 2) + id);
    }
  "
}

resolve_site_id() {
  local name="$1"
  node -e "
    const sites = JSON.parse(require('fs').readFileSync('$SITES_FILE', 'utf8'));
    if (sites['$name']) {
      process.stdout.write(sites['$name']);
    } else {
      process.exit(1);
    }
  " 2>/dev/null
}

kill_stale_ports() {
  for port in 4321 9000; do
    local pids
    pids=$(lsof -ti:"$port" 2>/dev/null || true)
    if [ -n "$pids" ]; then
      warn "Killing stale processes on port $port"
      echo "$pids" | xargs kill -9 2>/dev/null || true
    fi
  done
}

check_node_version() {
  local required_major
  if [ -f .node-version ]; then
    required_major=$(cat .node-version | head -1 | sed 's/^v//' | cut -d. -f1)
  else
    required_major=$(node -e "
      const pkg = JSON.parse(require('fs').readFileSync('package.json', 'utf8'));
      const engines = pkg.engines?.node || '';
      const match = engines.match(/(\d+)/);
      if (match) process.stdout.write(match[1]);
    " 2>/dev/null)
  fi

  if [ -z "$required_major" ]; then
    return 0
  fi

  local current_major
  current_major=$(node -v 2>/dev/null | sed 's/^v//' | cut -d. -f1)

  if [ "$current_major" != "$required_major" ]; then
    warn "Node $current_major active, but project requires Node $required_major"
    if command -v nvm &>/dev/null || [ -s "$HOME/.nvm/nvm.sh" ]; then
      info "Switching via nvm..."
      export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
      # shellcheck source=/dev/null
      [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
      nvm use "$required_major" 2>/dev/null || nvm install "$required_major"
      success "Now using Node $(node -v)"
    else
      error "nvm not found. Install Node $required_major manually."
      exit 1
    fi
  else
    success "Node $(node -v) matches project requirement"
  fi
}

match_deployed_version() {
  local site_id="$1"
  info "Fetching deployed version for site $site_id..."

  local deploy_info
  deploy_info=$(npx netlify api getSite --data "{\"site_id\": \"$site_id\"}" 2>/dev/null \
    | node -e "
      let data = '';
      process.stdin.on('data', d => data += d);
      process.stdin.on('end', () => {
        const site = JSON.parse(data);
        const deploy = site.published_deploy || {};
        console.log(JSON.stringify({
          commit: deploy.commit_ref || '',
          branch: deploy.branch || '',
          created: deploy.created_at || ''
        }));
      });
    ")

  local commit branch created
  commit=$(echo "$deploy_info" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).commit))")
  branch=$(echo "$deploy_info" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).branch))")
  created=$(echo "$deploy_info" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).created))")

  if [ -z "$commit" ]; then
    warn "Could not determine deployed commit. Continuing on current branch."
    return 0
  fi

  info "Deployed: commit ${commit:0:8} on branch $branch ($created)"

  # Check for uncommitted changes
  if ! git diff --quiet HEAD 2>/dev/null || ! git diff --cached --quiet HEAD 2>/dev/null; then
    error "Working tree has uncommitted changes. Commit or stash before using --match."
    exit 1
  fi

  # Check out the exact deployed commit
  local tag
  tag=$(git tag --sort=-v:refname --merged "$commit" 2>/dev/null | head -1 || true)
  if [ -n "$tag" ]; then
    info "Nearest version tag: $tag"
  fi

  info "Checking out deployed commit ${commit:0:8}..."
  git checkout "$commit"

  success "Matched deployed version"
}

clean_generated() {
  info "Cleaning generated content..."
  rm -rf content/ .tina/
  rm -f src/i18n/userDefinedFields.json src/i18n/search.json
  rm -rf src/components/custom/project/
  success "Cleaned content/, .tina/, and generated files"
}

# --- Main ---

SITE=""
MATCH=true
SKIP_CLEAN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --init)
      init_sites
      exit 0
      ;;
    --list)
      list_sites
      exit 0
      ;;
    --no-match)
      MATCH=false
      shift
      ;;
    --skip-clean)
      SKIP_CLEAN=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    -*)
      error "Unknown option: $1"
      usage
      exit 1
      ;;
    *)
      SITE="$1"
      shift
      ;;
  esac
done

# Interactive site selection if no site given
if [ -z "$SITE" ]; then
  echo -e "${BOLD}Select a site:${NC}"
  mapfile -t site_names < <(node -e "
    const sites = JSON.parse(require('fs').readFileSync('$SITES_FILE', 'utf8'));
    Object.keys(sites).forEach(k => console.log(k));
  ")

  select site_choice in "${site_names[@]}"; do
    if [ -n "$site_choice" ]; then
      SITE="$site_choice"
      break
    fi
  done
fi

# Ensure sites.json exists
if [ ! -f "$SITES_FILE" ]; then
  error "$SITES_FILE not found."
  echo "Run 'scripts/dev.sh --init' to generate it from your Netlify account." >&2
  exit 1
fi

# Resolve site name to ID
SITE_ID=$(resolve_site_id "$SITE" || true)
if [ -z "$SITE_ID" ]; then
  error "Unknown site: $SITE"
  echo ""
  list_sites
  exit 1
fi

echo ""
info "Starting dev workflow for ${BOLD}$SITE${NC} ($SITE_ID)"
echo ""

# Step 1: Match deployed version (optional)
if [ "$MATCH" = true ]; then
  match_deployed_version "$SITE_ID"
  echo ""
fi

# Step 2: Check Node version
check_node_version
echo ""

# Step 3: Link Netlify site (unlink first to ensure switch works)
info "Linking to Netlify site..."
npx netlify unlink 2>/dev/null || true
npx netlify link --id "$SITE_ID"
success "Linked to $SITE"
echo ""

# Step 4: Clean generated content
if [ "$SKIP_CLEAN" = false ]; then
  clean_generated
  echo ""
fi

# Step 5: Kill stale processes
kill_stale_ports
echo ""

# Step 6: Clear env vars that conflict with Netlify site settings
# These may be set from a previous netlify dev session, .env sourcing, etc.
# Unsetting them lets netlify dev inject the linked site's values.
SITE_MANAGED_VARS=(
  CONFIG_URL CONFIG_FILE
  GITHUB_OWNER GITHUB_REPO GITHUB_BRANCH GITHUB_PERSONAL_ACCESS_TOKEN
  MONGODB_URI MONGODB_NAME MONGODB_COLLECTION_NAME
  TINA_PUBLIC_IS_LOCAL
)
for var in "${SITE_MANAGED_VARS[@]}"; do
  unset "$var"
done
info "Cleared site-managed env vars from process environment"

# Step 7: Move .env aside so Netlify site env vars take priority
ENV_BACKED_UP=false
if [ -f .env ]; then
  warn "Moving .env to .env.bak (Netlify site vars take priority)"
  mv .env .env.bak
  ENV_BACKED_UP=true
fi

restore_env() {
  if [ "$ENV_BACKED_UP" = true ] && [ -f .env.bak ]; then
    mv .env.bak .env
    info "Restored .env from .env.bak"
  fi
}
trap restore_env EXIT

# Step 8: Pre-build with Netlify env vars (before netlify dev timeout kicks in)
info "Running pre-build with Netlify env vars..."
npx netlify dev:exec node scripts/build.mjs
success "Pre-build complete"
echo ""

# Step 9: Start dev server (skip build.mjs, already done)
export USE_CONTENT_CACHE=true
info "Starting dev server (USE_CONTENT_CACHE=true)..."
echo ""
npx netlify dev
