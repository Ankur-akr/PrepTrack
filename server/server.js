const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Comma-separated list, set on Render. Example:
// https://preptrack.ankurrai.in,https://preptrack-c7d42.web.app,http://localhost:5173
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://preptrack.ankurrai.in')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.set('trust proxy', 1); // Render sits behind a proxy, so req.ip is the real client
app.use(
  cors({
    origin(origin, cb) {
      // No Origin header = health checks / curl. Otherwise must be on the allowlist.
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
  })
);
app.use(express.json({ limit: '10kb' }));

// Rate limit: 30 requests per minute per IP (in-memory)
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;
const hits = new Map();

function rateLimit(req, res, next) {
  const now = Date.now();
  const entry = hits.get(req.ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  hits.set(req.ip, entry);
  if (entry.count > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }
  next();
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now - entry.start > WINDOW_MS) hits.delete(ip);
  }
}, WINDOW_MS).unref();

// Only these operations are allowed. The client picks one by name and cannot send raw GraphQL.
const OPERATIONS = {
  recentAcSubmissions: {
    query: `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          id
          title
          titleSlug
          timestamp
        }
      }
    `,
    validate: (v) =>
      typeof v.username === 'string' &&
      /^[A-Za-z0-9_-]{1,39}$/.test(v.username) &&
      Number.isInteger(v.limit) &&
      v.limit > 0 &&
      v.limit <= 50,
  },
  questionMeta: {
    query: `
      query questionMeta($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          difficulty
          topicTags {
            name
          }
        }
      }
    `,
    validate: (v) => typeof v.titleSlug === 'string' && /^[a-z0-9-]{1,100}$/.test(v.titleSlug),
  },
};

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/leetcode', rateLimit, async (req, res) => {
  const { operation, variables } = req.body || {};
  const op = OPERATIONS[operation];

  if (!op || !variables || typeof variables !== 'object' || !op.validate(variables)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      { query: op.query, variables },
      {
        timeout: 10_000,
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://leetcode.com',
          // LeetCode may reject requests that don't look like a browser
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        },
      }
    );

    if (response.data.errors) {
      return res.status(502).json({ error: 'LeetCode returned an error for this request' });
    }
    return res.json({ data: response.data.data });
  } catch (error) {
    console.error('LeetCode request failed:', error.message);
    return res.status(502).json({ error: 'Could not reach LeetCode. Try again shortly.' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}. Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});
