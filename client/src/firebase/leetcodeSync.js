import { collection, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

const API_URL = import.meta.env.VITE_API_URL;

async function callProxy(operation, variables) {
  if (!API_URL) {
    throw new Error('Sync server is not configured. Set VITE_API_URL and rebuild.');
  }

  const res = await fetch(`${API_URL}/api/leetcode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation, variables }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Sync server responded with ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

/**
 * Syncs the user's recent LeetCode accepted submissions into Firestore.
 * - Skips problems already tracked (matched by doc id or by title).
 * - Fetches real difficulty and topic for each new problem.
 * - Never overwrites problems the user has already edited.
 */
export async function syncLeetCodeSubmissions(userId, handle) {
  const result = await callProxy('recentAcSubmissions', { username: handle, limit: 15 });
  const submissions = result?.recentAcSubmissionList || [];

  if (submissions.length === 0) {
    return { added: 0, skipped: 0, message: 'No recent accepted submissions found.' };
  }

  // One read for the whole collection instead of one query per problem
  const problemsRef = collection(db, 'users', userId, 'problems');
  const existing = await getDocs(problemsRef);
  const existingIds = new Set(existing.docs.map((d) => d.id));
  const existingTitles = new Set(
    existing.docs.map((d) => `${d.data().platform}|${(d.data().title || '').toLowerCase()}`)
  );

  let added = 0;
  let skipped = 0;
  let metaFallbacks = 0;

  for (const sub of submissions) {
    const docId = `leetcode_${sub.titleSlug}`;
    const titleKey = `LeetCode|${sub.title.toLowerCase()}`;

    if (existingIds.has(docId) || existingTitles.has(titleKey)) {
      skipped += 1;
      continue;
    }

    // Real difficulty and topic. Falls back to defaults if this one lookup fails.
    let difficulty = 'Medium';
    let topic = 'Other';
    try {
      const meta = await callProxy('questionMeta', { titleSlug: sub.titleSlug });
      if (meta?.question) {
        difficulty = meta.question.difficulty || difficulty;
        topic = meta.question.topicTags?.[0]?.name || topic;
      } else {
        metaFallbacks += 1;
      }
    } catch {
      metaFallbacks += 1;
    }

    await setDoc(doc(db, 'users', userId, 'problems', docId), {
      title: sub.title,
      platform: 'LeetCode',
      difficulty,
      topic,
      status: 'Solved',
      url: `https://leetcode.com/problems/${sub.titleSlug}/`,
      source: 'leetcode-sync',
      submittedAt: Number(sub.timestamp) * 1000,
      isFavourite: false,
      createdAt: serverTimestamp(),
      lastRevised: serverTimestamp(),
      revisionCount: 0,
    });

    existingIds.add(docId);
    existingTitles.add(titleKey);
    added += 1;
  }

  const fallbackNote =
    metaFallbacks > 0 ? ` ${metaFallbacks} problem(s) used default difficulty/topic. You can edit them.` : '';

  return {
    added,
    skipped,
    message: `Synced successfully! Added ${added} new problems (${skipped} already tracked).${fallbackNote}`,
  };
}
