const { onRequest } = require('firebase-functions/v2/https');

function stripMarkdown(text) {
  return (text || '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeRecord(item) {
  const r = item.record || item;
  const genres = (r.genres || []).map(function (g) { return g.genre || g; }).filter(Boolean);
  const cover = r.image && r.image.url
    ? (r.image.url.thumb || r.image.url.original || '')
    : '';
  let desc = stripMarkdown(r.description || '');
  if (desc.length > 280) desc = desc.slice(0, 277) + '…';
  const tags = [];
  if (r.type) tags.push(r.type);
  return {
    source: 'MangaUpdates',
    title: r.title || 'Untitled',
    cover: cover,
    genres: genres,
    tags: tags,
    apiStatus: r.type || '',
    status: '',
    statusLabel: r.type ? r.type : 'Unlisted',
    chapters: r.latest_chapter ? String(r.latest_chapter) : '',
    comment: desc,
    muUrl: r.url || ''
  };
}

exports.searchMangaUpdates = onRequest(
  { cors: true, region: 'us-central1', maxInstances: 10 },
  async function (req, res) {
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const q = String((req.query && req.query.q) || (req.body && req.body.q) || '').trim();
    if (q.length < 2) {
      res.status(400).json({ error: 'Query must be at least 2 characters' });
      return;
    }

    try {
      const muRes = await fetch('https://api.mangaupdates.com/v1/series/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          search: q,
          page: 1,
          perpage: 20,
          stype: 'title',
          orderby: 'score'
        })
      });

      if (!muRes.ok) {
        res.status(502).json({ error: 'MangaUpdates returned ' + muRes.status });
        return;
      }

      const data = await muRes.json();
      const results = (data.results || []).map(normalizeRecord);
      res.json({ total: data.total_hits || results.length, results: results });
    } catch (err) {
      res.status(502).json({ error: err.message || 'Proxy error' });
    }
  }
);
