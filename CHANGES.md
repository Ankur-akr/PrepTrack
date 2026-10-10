# PrepTrack: fixes applied

## Why the manual add failed ("Missing or insufficient permissions")
Firestore rejects writes when rules don't allow them. Projects created in
Firebase "test mode" get rules that expire after 30 days and then deny
everything. The repo had no rules file, so the rules in use were whatever
was published in the console. `client/firestore.rules` now allows each
signed-in user to access only `users/{their uid}/...`. Deploy it with:

    cd client
    firebase deploy --only firestore:rules,hosting

## Sync
- Sync no longer depends on localhost. It uses `VITE_API_URL`.
  Copy `client/.env.example` to `client/.env.production` and set your Render URL before building.
- Real difficulty and topic are fetched from LeetCode for each new problem (previously always Medium / Other).
- Already-tracked problems are skipped with one read, not one query per problem.
- Existing problems you've edited are never overwritten.
- Error messages show the real cause instead of "is it running on port 5000?".

## Server (Render)
- Set `ALLOWED_ORIGINS=https://preptrack.ankurrai.in,https://preptrack-c7d42.web.app,http://localhost:5173`
- Set `NODE_VERSION=18` or newer. Root directory: `server`. Start: `node server.js`.
- Only two LeetCode operations are allowed. Raw GraphQL is rejected.
- Usernames and slugs are validated. Requests have a 10-second timeout.
- 30 requests per minute per IP.
- `GET /health` returns `{"ok":true}`.

## Revisions and insights
- "Mark as revised" now uses `markRevision`, so the revision count and last-revised date are recorded.
- The insight text now says "most-practiced topic", since it counts problems rather than measuring strength.

## Repo hygiene
- Root `.gitignore` covers node_modules, build output, Vite and Firebase caches, and env files.
- Removed `client/.vite` and `client/.firebase` (build caches). Run `git rm -r --cached` on them if they're tracked.

## Not yet done
- Server-side Firebase ID token verification (proxy still trusts anyone who can reach it, within the rate limit).
- Dashboard shows an empty state on any Firestore error (`getUserProblems` swallows errors). Surfacing them would hide the real cause of problems like the one above.
- Overdue revision tracking and README streak/insight features.
