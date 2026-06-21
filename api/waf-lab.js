module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const startedAt = Date.now();
  const response = {
    ok: true,
    lab: 'F5 Distributed Cloud WAAP / WAF Attack Lab',
    note: 'Demo endpoint only. The request is intentionally not executed against any backend system.',
    method: req.method,
    url: req.url,
    query: req.query || {},
    bodyType: typeof req.body,
    receivedAt: new Date().toISOString(),
    processingMs: Date.now() - startedAt
  };

  return res.status(200).json(response);
};
