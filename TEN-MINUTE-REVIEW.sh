#!/usr/bin/env bash
#
# Public coherence checks for Agent Manifest.
#
# Nine checks, run against public surfaces only: the canonical site, the npm
# registry and raw.githubusercontent.com. It clones nothing, reads no local
# file of this ecosystem, needs no credentials, and writes nothing outside its
# own temporary directory, which it removes on exit.
#
#   curl -fsSL https://agent-manifest-spec.org/TEN-MINUTE-REVIEW.sh | bash
#
# or, to read it before running it, which is the better habit:
#
#   curl -fsSL https://agent-manifest-spec.org/TEN-MINUTE-REVIEW.sh -o review.sh
#   less review.sh && bash review.sh
#
# Requires: bash, curl, node, npm, and either sha256sum or shasum.
#
# Exit codes: 0 green, 1 a check failed, 2 a public surface was unreachable,
# 3 a required tool is missing.

set -u -o pipefail

BANNER='These public checks found no contradiction within their scope. The instrument
is extensible and does not replace an external review. It claims no absolute
coverage.'

SITE=https://agent-manifest-spec.org
RAW_SPEC=https://raw.githubusercontent.com/agent-manifest/agent-manifest/main
RAW_SPEC_TAG=https://raw.githubusercontent.com/agent-manifest/agent-manifest/v1.0
RAW_DATA=https://raw.githubusercontent.com/agent-manifest/agent-manifest-dataset/main
RAW_EX=https://raw.githubusercontent.com/agent-manifest/agent-manifest-client/main/examples

PASSED=0; FAILED=0; UNAVAILABLE=0
CURRENT=""

# ---------------------------------------------------------------- reporting --

start() { CURRENT="$1"; printf '\n%s\n' "$1"; }

pass()    { PASSED=$((PASSED+1));      printf '  PASS         %s\n' "$1"; }
note()    {                             printf '               %s\n' "$1"; }

# A failure is a contradiction between two public surfaces. It prints what it
# saw and how to see it again without this script.
fail() {
  FAILED=$((FAILED+1))
  printf '  FAIL         %s\n' "$1"
  shift
  for line in "$@"; do printf '               %s\n' "$line"; done
}

# Not reachable is not the same as not true, and neither is it a pass. A run
# with any UNAVAILABLE cannot be called green.
unavailable() {
  UNAVAILABLE=$((UNAVAILABLE+1))
  printf '  UNAVAILABLE  %s\n' "$1"
  shift
  for line in "$@"; do printf '               %s\n' "$line"; done
}

# ----------------------------------------------------------------- plumbing --

need() {
  command -v "$1" >/dev/null 2>&1 || { printf 'Missing required tool: %s\n' "$1" >&2; exit 3; }
}

need bash; need curl; need node; need npm
if command -v sha256sum >/dev/null 2>&1; then
  sha256() { sha256sum "$1" | cut -d' ' -f1; }
elif command -v shasum >/dev/null 2>&1; then
  sha256() { shasum -a 256 "$1" | cut -d' ' -f1; }
else
  printf 'Missing required tool: sha256sum or shasum\n' >&2; exit 3
fi

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
cd "$TMP" || exit 3

# get <url> <destination> — returns non-zero on any network or HTTP error, so
# the caller can report UNAVAILABLE instead of inventing a verdict.
get() { curl -fsSL --max-time 60 "$1" -o "$2"; }

# json <file> <python expression over `d`> — prints the value, empty on error.
json() { python3 -c "
import json,sys
try:
    d=json.load(open(sys.argv[1]))
    print($2)
except Exception:
    pass
" "$1" 2>/dev/null; }

printf '%s\n\n' "$BANNER"
printf 'node %s, npm %s, %s\n' "$(node -v)" "$(npm -v)" "$(uname -s)"
printf 'working in %s\n' "$TMP"

STARTED=$(date +%s)

# --------------------------------------------------- 1. announced versions --

start '1. Announced versions match npm'

# The canonical site announces a current version for the CLI only. Silence is
# not a contradiction, so a package with no announced version is reported as
# such rather than quietly counted as agreeing.
if get "$SITE/docs/cli/" cli.html; then
  ANNOUNCED=$(grep -oE 'releases/tag/v[0-9]+\.[0-9]+\.[0-9]+' cli.html | head -1 | sed 's|.*/v||')
  LATEST=$(npm view @agent-manifest/cli dist-tags.latest 2>/dev/null)
  if [ -z "$LATEST" ]; then
    unavailable "npm did not answer for @agent-manifest/cli" \
      "npm view @agent-manifest/cli dist-tags.latest"
  elif [ "$ANNOUNCED" = "$LATEST" ]; then
    pass "@agent-manifest/cli: $SITE/docs/cli/ says $ANNOUNCED, npm latest is $LATEST"
  else
    fail "@agent-manifest/cli: the site announces $ANNOUNCED, npm latest is $LATEST" \
      "curl -s $SITE/docs/cli/ | grep releases/tag" \
      "npm view @agent-manifest/cli dist-tags.latest"
  fi
else
  unavailable "$SITE/docs/cli/ unreachable" "curl -fsSL $SITE/docs/cli/"
fi

for PKG in client schema; do
  LATEST=$(npm view "@agent-manifest/$PKG" dist-tags.latest 2>/dev/null)
  if [ -z "$LATEST" ]; then
    unavailable "npm did not answer for @agent-manifest/$PKG" \
      "npm view @agent-manifest/$PKG dist-tags.latest"
  else
    note "@agent-manifest/$PKG: npm latest is $LATEST; the site announces no current version for it, so there is nothing to contradict"
  fi
done

# ------------------------------------------------------- 2. schema identity --

start '2. The published schema is one file in three places'

OK=yes
get "$SITE/spec/v1.0/schema.json" s_site.json  || OK=no
get "$RAW_SPEC/spec/v1.0/schema.json" s_raw.json || OK=no
TARBALL=$(npm view @agent-manifest/schema dist.tarball 2>/dev/null)
if [ -n "$TARBALL" ] && get "$TARBALL" schema.tgz; then
  tar -xzOf schema.tgz package/v1.0/schema.json > s_npm.json 2>/dev/null || OK=no
else
  OK=no
fi

if [ "$OK" != yes ]; then
  unavailable "could not fetch all three copies of the schema" \
    "$SITE/spec/v1.0/schema.json" "$RAW_SPEC/spec/v1.0/schema.json" "npm view @agent-manifest/schema dist.tarball"
else
  A=$(sha256 s_site.json); B=$(sha256 s_raw.json); C=$(sha256 s_npm.json)
  if [ "$A" = "$B" ] && [ "$B" = "$C" ]; then
    pass "site, GitHub raw and the @agent-manifest/schema tarball agree: $A"
  else
    fail "the three published copies of the schema are not the same bytes" \
      "site   $A" "raw    $B" "npm    $C" \
      "curl -s $SITE/spec/v1.0/schema.json | shasum -a 256"
  fi
fi

# ------------------------------------------ 3. canonical manifest vs dataset --

start "3. The project's own manifest says the same thing in both places"

if get "$SITE/.well-known/agent-manifest.json" canon.json \
   && get "$RAW_DATA/registry.json" registry.json; then
  MURL=$(json registry.json "[e['manifest_url'] for e in d['index'] if e['agent_id']=='agent-manifest'][0]")
  if [ -z "$MURL" ] || ! get "$MURL" ds.json; then
    unavailable "the dataset entry for agent-manifest could not be resolved" \
      "curl -s $RAW_DATA/registry.json"
  else
    DIFF=$(python3 -c "
import json,sys
a=json.load(open('canon.json')); b=json.load(open('ds.json'))
def flat(o,p=''):
    r={}
    if isinstance(o,dict):
        for k,v in o.items(): r.update(flat(v,f'{p}.{k}' if p else k))
    elif isinstance(o,list):
        for i,v in enumerate(o): r.update(flat(v,f'{p}[{i}]'))
    else: r[p]=o
    return r
fa,fb=flat(a),flat(b)
out=[f'{k}: site={fa.get(k)!r} dataset={fb.get(k)!r}' for k in sorted(set(fa)|set(fb)) if fa.get(k)!=fb.get(k)]
print('\n'.join(out))
" 2>/dev/null)
    if [ -z "$DIFF" ]; then
      pass "$SITE/.well-known/agent-manifest.json and the dataset copy are semantically identical"
    else
      fail "the two published copies of this project's manifest disagree" \
        $DIFF "curl -s $SITE/.well-known/agent-manifest.json" "curl -s $MURL"
    fi
  fi
else
  unavailable "the canonical manifest or the registry index was unreachable" \
    "$SITE/.well-known/agent-manifest.json" "$RAW_DATA/registry.json"
fi

# ------------------------------------------- 4. no claim the project denies --

start '4. The manifest claims nothing the project says it does not do'

# GOVERNANCE.md: "This repository does not enforce governance, ownership, or
# authority." A declaration asserting authority over a standard, or the power to
# execute, score or enforce, would contradict that in the project's own words.
if [ -f canon.json ]; then
  HITS=$(python3 -c "
import json,re
d=json.load(open('canon.json'))
DENIED=['authority','enforce','enforcement','governance','certif','score','scoring',
        'validate','validation','attest','accredit','the standard']

hits=[]

# primary_code and capabilities are claim slots by construction: whatever is
# written there is asserted, so a denied term appearing at all is a claim.
for field,value in [('purpose.primary_code', d.get('purpose',{}).get('primary_code',''))] + \
                   [(f'capabilities[{i}]', c) for i,c in enumerate(d.get('capabilities') or [])]:
    low=str(value).lower()
    for w in DENIED:
        if w in low: hits.append(f'{field}={value!r} contains {w!r}')

# The description is prose, and this project's prose denies these powers rather
# than claiming them. Clauses that are denials are dropped before looking, so
# that 'does not execute, validate, score, or enforce' is read as the denial it
# is instead of as four claims.
desc=str(d.get('purpose',{}).get('description',''))
for clause in re.split(r'[.;]', desc):
    if re.search(r'\b(does not|do not|is not|are not|never|no )\b', clause, re.I):
        continue
    low=clause.lower()
    for w in DENIED:
        if w in low: hits.append(f'purpose.description asserts {w!r} in: {clause.strip()!r}')

print('\n'.join(hits))
" 2>/dev/null)
  if [ -z "$HITS" ]; then
    pass "purpose and capabilities carry no claim of authority, enforcement, scoring or certification"
  else
    fail "the manifest asserts something the project's governance denies" \
      "$HITS" \
      "curl -s $SITE/.well-known/agent-manifest.json" \
      "curl -s $SITE/GOVERNANCE.html"
  fi
else
  unavailable "the canonical manifest was not fetched, so nothing was read" \
    "$SITE/.well-known/agent-manifest.json"
fi

# ------------------------------------------------------ 5. every index entry --

start '5. Every manifest_url resolves and declares the agent_id claimed for it'

if [ -f registry.json ]; then
  COUNT=$(json registry.json "len(d['index'])")
  BAD=0; SEEN=0; GONE=0
  for i in $(seq 0 $((COUNT-1))); do
    ID=$(json registry.json "d['index'][$i]['agent_id']")
    URL=$(json registry.json "d['index'][$i]['manifest_url']")
    CODE=$(curl -s -o "m$i.json" -w '%{http_code}' --max-time 60 "$URL")
    if [ "$CODE" != 200 ]; then
      if [ "$CODE" = 000 ]; then
        GONE=$((GONE+1))
        note "$ID: no answer from $URL"
      else
        BAD=$((BAD+1))
        fail "$ID: manifest_url returned HTTP $CODE" "curl -I $URL"
      fi
      continue
    fi
    DECLARED=$(json "m$i.json" "d.get('agent_id')")
    if [ "$DECLARED" = "$ID" ]; then
      SEEN=$((SEEN+1))
    else
      BAD=$((BAD+1))
      fail "index says $ID but the document declares ${DECLARED:-<none>}" "curl -s $URL"
    fi
  done
  if [ "$GONE" -gt 0 ]; then
    unavailable "$GONE of $COUNT manifest_url values could not be reached"
  elif [ "$BAD" -eq 0 ]; then
    pass "$SEEN of $COUNT entries: HTTP 200 and the declared agent_id matches the index"
  fi
else
  unavailable "the registry index was not fetched" "$RAW_DATA/registry.json"
fi

# ------------------------------------------------- 6. licences as stated --

start '6. Each artefact named in STEWARDSHIP.md carries the licence declared there'

# STEWARDSHIP.md section 5 names the artefacts and their licences. This checks
# what a third party can see: the SPDX identifier GitHub reports for a
# repository, and the licence field npm reports for a package.
check_repo_licence() {
  REPO=$1; WANT=$2
  GOT=$(curl -fsSL --max-time 60 "https://api.github.com/repos/agent-manifest/$REPO" 2>/dev/null \
        | python3 -c "import json,sys; print((json.load(sys.stdin).get('license') or {}).get('spdx_id') or 'NOASSERTION')" 2>/dev/null)
  if [ -z "$GOT" ]; then
    unavailable "GitHub did not answer for $REPO" "https://api.github.com/repos/agent-manifest/$REPO"
  elif [ "$GOT" = "$WANT" ]; then
    pass "$REPO: $GOT, as STEWARDSHIP.md declares"
  else
    fail "$REPO: STEWARDSHIP.md declares $WANT, GitHub reports $GOT" \
      "curl -s https://api.github.com/repos/agent-manifest/$REPO | grep spdx_id" \
      "curl -s $SITE/STEWARDSHIP.html"
  fi
}

check_pkg_licence() {
  PKG=$1; WANT=$2
  GOT=$(npm view "@agent-manifest/$PKG" license 2>/dev/null)
  if [ -z "$GOT" ]; then
    unavailable "npm did not answer for @agent-manifest/$PKG" "npm view @agent-manifest/$PKG license"
  elif [ "$GOT" = "$WANT" ]; then
    pass "@agent-manifest/$PKG: $GOT, as STEWARDSHIP.md declares"
  else
    fail "@agent-manifest/$PKG: STEWARDSHIP.md declares $WANT, npm reports $GOT" \
      "npm view @agent-manifest/$PKG license" "curl -s $SITE/STEWARDSHIP.html"
  fi
}

check_repo_licence agent-manifest            CC-BY-4.0   # specification and reference documentation
check_repo_licence agent-manifest-ambassador CC-BY-4.0   # the manifest generator
check_repo_licence agent-manifest-diplomat   MIT         # the registration gateway
check_repo_licence agent-manifest-registry   MIT         # the registry documentation
check_repo_licence agent-manifest-dataset    CC0-1.0     # the public dataset
check_pkg_licence  schema                    CC0-1.0
check_pkg_licence  client                    Apache-2.0
check_pkg_licence  cli                       Apache-2.0

# ------------------------------------------------------ 7. the consume page --

start '7. The snippet on /docs/consume/ does what the page says'

npm init -y >/dev/null 2>&1
npm pkg set type=module >/dev/null 2>&1
if npm install @agent-manifest/client --no-audit --no-fund >/dev/null 2>&1; then
  cat > consume.mjs <<'JS'
import { discoverRegistry, resolve } from '@agent-manifest/client/net';
import { parse } from '@agent-manifest/client';

// The page's main snippet, unchanged.
const registry = await discoverRegistry('agent-manifest-spec.org');
const result = await resolve('the-diplomat', { registryUrl: registry.registryUrl });
const manifest = result.resolutions[0].document;
if (typeof manifest.autonomy.level !== 'number') throw new Error('autonomy.level is not a number');
if (!Array.isArray(manifest.forbidden_actions)) throw new Error('forbidden_actions is not an array');

// "Passing a bare name with no registry returns a result whose absence.reason
// is no-registry-declared."
const bare = await resolve('the-diplomat');
if (bare.absence?.reason !== 'no-registry-declared')
  throw new Error(`absence.reason was ${bare.absence?.reason}, not no-registry-declared`);

// "parse() returns { document, form }, not the document."
const { document, form } = parse('{"manifest_version":"1.0"}');
if (!document || !form) throw new Error('parse() did not return { document, form }');

console.log(`ok autonomy.level=${manifest.autonomy.level} forbidden_actions=${manifest.forbidden_actions.length}`);
JS
  if OUT=$(node consume.mjs 2>&1); then
    pass "resolve() in two calls, absence.reason and parse() all behave as documented — $OUT"
  else
    fail "the documented snippet did not behave as the page describes" \
      "$OUT" "$SITE/docs/consume/"
  fi
else
  unavailable "@agent-manifest/client could not be installed from npm" \
    "npm install @agent-manifest/client"
fi

# ------------------------------------------------------- 8. the A/B examples --

start '8. The four reference examples still produce their two behaviours'

EX_OK=yes
for D in 1-ci-gate 2-gateway 3-mcp-self-restriction 4-runtime-isolation; do
  mkdir -p "$D"
done
for F in 1-ci-gate/gate.mjs 1-ci-gate/manifest-a.json 1-ci-gate/manifest-b.json \
         2-gateway/gateway.mjs 2-gateway/manifest-a.json 2-gateway/manifest-b.json \
         3-mcp-self-restriction/server.mjs 3-mcp-self-restriction/manifest-a.json 3-mcp-self-restriction/manifest-b.json \
         4-runtime-isolation/runtime.mjs 4-runtime-isolation/task.mjs \
         4-runtime-isolation/manifest-a.json 4-runtime-isolation/manifest-b.json; do
  get "$RAW_EX/$F" "$F" || EX_OK=no
done

if [ "$EX_OK" != yes ] || [ ! -d node_modules/@agent-manifest/client ]; then
  unavailable "the examples or the client package could not be fetched" "$RAW_EX/"
else
  # 1 — a CI run passes or fails on autonomy.level.
  node 1-ci-gate/gate.mjs 1-ci-gate/manifest-a.json >/dev/null 2>&1; A=$?
  node 1-ci-gate/gate.mjs 1-ci-gate/manifest-b.json >/dev/null 2>&1; B=$?
  if [ "$A" -eq 0 ] && [ "$B" -eq 1 ]; then
    pass "1-ci-gate: manifest A exits 0, manifest B exits 1"
  else
    fail "1-ci-gate: expected exit 0 then 1, got $A then $B" \
      "node 1-ci-gate/gate.mjs 1-ci-gate/manifest-a.json ; echo \$?"
  fi

  # 2 — a call is refused or forwarded on forbidden_actions.
  OUT=$(node 2-gateway/gateway.mjs 2>&1)
  if printf '%s' "$OUT" | grep -q 'HTTP 403' && printf '%s' "$OUT" | grep -q 'HTTP 200' \
     && printf '%s' "$OUT" | grep -q 'upstream_reached=false' \
     && printf '%s' "$OUT" | grep -q 'upstream_reached=true'; then
    pass "2-gateway: 403 with the upstream untouched, then 200 with it reached"
  else
    fail "2-gateway: the two behaviours were not both observed" "$OUT" \
      "node 2-gateway/gateway.mjs"
  fi

  # 3 — which tools are advertised, and whether the call runs.
  OUT=$(node 3-mcp-self-restriction/server.mjs 2>&1)
  if printf '%s' "$OUT" | grep -q 'advertised=1' && printf '%s' "$OUT" | grep -q 'executed=false' \
     && printf '%s' "$OUT" | grep -q 'advertised=2' && printf '%s' "$OUT" | grep -q 'executed=true'; then
    pass "3-mcp-self-restriction: 1 tool and no execution, then 2 tools and execution"
  else
    fail "3-mcp-self-restriction: the two behaviours were not both observed" "$OUT" \
      "node 3-mcp-self-restriction/server.mjs"
  fi

  # 4 — which isolation the job runs under. Needs the Node permission model.
  OUT=$(node 4-runtime-isolation/runtime.mjs 2>&1)
  if printf '%s' "$OUT" | grep -q 'ALLOWED' && printf '%s' "$OUT" | grep -q 'ERR_ACCESS_DENIED'; then
    pass "4-runtime-isolation: disk read allowed, then denied"
  else
    fail "4-runtime-isolation: the two behaviours were not both observed" "$OUT" \
      "node 4-runtime-isolation/runtime.mjs" \
      "needs --permission on Node 23 or later, --experimental-permission on Node 22"
  fi
fi

# ----------------------------------------------------- 9. the frozen schema --

start '9. The frozen schema is the same on main, on the v1.0 tag and in SOURCE.json'

M=''; T=''; S=''
get "$RAW_SPEC/spec/v1.0/schema.json"     m.json && M=$(sha256 m.json)
get "$RAW_SPEC_TAG/spec/v1.0/schema.json" t.json && T=$(sha256 t.json)
if [ -f schema.tgz ]; then
  tar -xzOf schema.tgz package/SOURCE.json > src.json 2>/dev/null && S=$(json src.json "d['sha256']")
fi

if [ -z "$M" ] || [ -z "$T" ] || [ -z "$S" ]; then
  unavailable "one of the three sources for the schema checksum was unreachable" \
    "$RAW_SPEC/spec/v1.0/schema.json" "$RAW_SPEC_TAG/spec/v1.0/schema.json" \
    "npm view @agent-manifest/schema dist.tarball"
elif [ "$M" = "$T" ] && [ "$T" = "$S" ]; then
  pass "main, tag v1.0 and SOURCE.json all record $M"
else
  fail "v1.0 is frozen, but the three records of its checksum differ" \
    "main        $M" "tag v1.0    $T" "SOURCE.json $S" \
    "curl -s $RAW_SPEC_TAG/spec/v1.0/schema.json | shasum -a 256"
fi

# ---------------------------------------------------------------- verdict --

ELAPSED=$(( $(date +%s) - STARTED ))

printf '\n%s\n' '----------------------------------------------------------------------'
printf '%d passed, %d failed, %d unavailable, in %ds\n' "$PASSED" "$FAILED" "$UNAVAILABLE" "$ELAPSED"

if [ "$FAILED" -gt 0 ]; then
  printf '\nFALLA — a public surface contradicts another. See the FAIL lines above.\n'
  exit 1
elif [ "$UNAVAILABLE" -gt 0 ]; then
  printf '\nINDISPONIBLE — a surface could not be read, so nothing is claimed about it.\n'
  printf 'This is not a pass. Run it again when the network or the host is back.\n'
  exit 2
else
  printf '\nVERDE — the nine checks agree.\n'
  printf '%s\n' "$BANNER"
  exit 0
fi
