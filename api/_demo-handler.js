const ACTIVE_ENDPOINTS = {
  'system/health': {
    name: 'BIVA System Health',
    object: 'health_check',
    allowedMethods: ['GET'],
    description: 'Synthetic BIVA Bank health endpoint used by uptime checks and WAF demos.'
  },
  'accounts/search': {
    name: 'BIVA Account & Product Search',
    object: 'account_product_search',
    allowedMethods: ['GET', 'POST'],
    description: 'Active banking search endpoint for accounts, products, cards and loans.'
  },
  'products/search': {
    name: 'BIVA Product Search Legacy Alias',
    object: 'product_search',
    allowedMethods: ['GET', 'POST'],
    description: 'Legacy alias for active banking product search.'
  },
  'auth/login': {
    name: 'BIVA Authentication Login',
    object: 'auth_attempt',
    allowedMethods: ['POST', 'GET'],
    description: 'Demo login endpoint. It never authenticates real users.'
  },
  'payments/transfer': {
    name: 'BIVA Payments Transfer',
    object: 'transfer_attempt',
    allowedMethods: ['POST', 'GET'],
    description: 'Active banking transfer endpoint for demo transaction flows.'
  },
  'cart/checkout': {
    name: 'BIVA Checkout Legacy Alias',
    object: 'checkout_attempt',
    allowedMethods: ['POST', 'GET'],
    description: 'Legacy checkout endpoint kept for existing demo flows.'
  },
  'users/profile': {
    name: 'BIVA Customer Profile',
    object: 'profile_update',
    allowedMethods: ['POST', 'PATCH', 'GET'],
    description: 'Profile update endpoint for local demo users.'
  },
  'statements/download': {
    name: 'BIVA Statement Download',
    object: 'statement_download',
    allowedMethods: ['GET', 'POST'],
    description: 'Demo banking statement endpoint. It never reads server files.'
  },
  'files/download': {
    name: 'BIVA File Download Legacy Alias',
    object: 'file_download',
    allowedMethods: ['GET', 'POST'],
    description: 'Legacy demo file endpoint. It never reads server files.'
  },
  'reports/export': {
    name: 'BIVA Reports Export',
    object: 'report_export',
    allowedMethods: ['GET', 'POST'],
    description: 'Demo report export endpoint. It never executes shell commands.'
  },
  'webhooks/register': {
    name: 'BIVA Webhook Registration',
    object: 'webhook_registration',
    allowedMethods: ['GET', 'POST'],
    description: 'Demo webhook registration endpoint. It never performs callbacks.'
  },
  'admin/lookup': {
    name: 'BIVA Admin Lookup',
    object: 'admin_lookup',
    allowedMethods: ['GET', 'POST'],
    description: 'Demo admin lookup endpoint used for WAAP SQLi and API abuse tests.'
  },
  'recon/probe': {
    name: 'BIVA Recon Probe',
    object: 'recon_probe',
    allowedMethods: ['GET'],
    description: 'Demo endpoint that accepts requested paths as inert data only.'
  },
  'support/ticket': {
    name: 'BIVA Support Ticket',
    object: 'support_ticket',
    allowedMethods: ['GET', 'POST'],
    description: 'Demo support ticket endpoint used for reflected input tests.'
  },
  'waf-lab': {
    name: 'Legacy WAF Lab',
    object: 'waf_lab',
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    description: 'Legacy generic endpoint kept for backwards compatibility.'
  }
};

module.exports = async function demoHandler(req, res, explicitPath) {
  const startedAt = Date.now();

  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-F5-Demo-Lab', 'biva-bank-real-api-waap-lab');
  res.setHeader('X-BIVA-Bank-Demo', 'active-api');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const routeKey = normalizeRoute(explicitPath || getPathFromReq(req));
  const endpoint = ACTIVE_ENDPOINTS[routeKey] || ACTIVE_ENDPOINTS['waf-lab'];
  const body = normalizeBody(req.body !== undefined ? req.body : await readRawBody(req));
  const query = req.query || {};
  const scenario = detectScenario(query, body, req.url || '', routeKey);
  const classification = classifyScenario(scenario);
  const methodAllowed = endpoint.allowedMethods.includes(req.method);

  if (!methodAllowed) {
    return res.status(405).json({
      ok: false,
      app: 'BIVA Bank',
      error: 'method_not_allowed',
      endpoint: '/' + routeKey,
      allowedMethods: endpoint.allowedMethods
    });
  }

  return res.status(200).json({
    ok: true,
    app: 'BIVA Bank Digital Banking Demo',
    lab: 'F5 Distributed Cloud WAAP / WAF Attack Lab',
    endpoint: '/api/' + routeKey,
    endpointName: endpoint.name,
    endpointDescription: endpoint.description,
    object: endpoint.object,
    activeEndpoint: true,
    domainFlow: 'demoshop.f5latam.app',
    safety: 'Payloads are received as inert demo data. No command, callback, file read, SQL query, transfer, authentication, or banking operation is executed.',
    method: req.method,
    url: req.url,
    contentType: (req.headers && req.headers['content-type']) || null,
    scenario,
    expectedWaapDetection: classification.expectedWaapDetection,
    severity: classification.severity,
    recommendedWaapAction: classification.recommendedWaapAction,
    query,
    bodyPreview: previewBody(body),
    demoResponse: buildDemoResponse(routeKey, scenario, query, body),
    receivedAt: new Date().toISOString(),
    processingMs: Date.now() - startedAt
  });
};

function getPathFromReq(req) {
  const qSlug = req.query && req.query.slug;
  if (Array.isArray(qSlug)) return qSlug.join('/');
  if (typeof qSlug === 'string') return qSlug;
  const qPath = req.query && req.query.path;
  if (Array.isArray(qPath)) return qPath.join('/');
  if (typeof qPath === 'string') return qPath;
  const raw = (req.url || '').split('?')[0].replace(/^\/api\//, '').replace(/^\//, '');
  return raw || 'waf-lab';
}

function normalizeRoute(path) {
  return String(path || 'waf-lab')
    .replace(/^\/api\//, '')
    .replace(/^\//, '')
    .replace(/\/+$/g, '') || 'waf-lab';
}

function readRawBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 8192) req.destroy();
    });
    req.on('end', () => resolve(data));
    req.on('error', () => resolve(''));
  });
}

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === 'object') return body;
  if (typeof body === 'string') {
    const trimmed = body.trim();
    if (!trimmed) return {};
    try { return JSON.parse(trimmed); } catch (_) {}
    try {
      const params = new URLSearchParams(trimmed);
      const out = {};
      for (const [k, v] of params.entries()) out[k] = v;
      return Object.keys(out).length ? out : { raw: trimmed.slice(0, 2048) };
    } catch (_) {
      return { raw: trimmed.slice(0, 2048) };
    }
  }
  return { type: typeof body };
}

function previewBody(body) {
  try { return JSON.stringify(body).slice(0, 1400); }
  catch (_) { return '[unserializable body]'; }
}

function flattenForDetection(query, body, url, routeKey) {
  const fragments = [routeKey, url || ''];
  try { fragments.push(JSON.stringify(query || {})); } catch (_) {}
  try { fragments.push(JSON.stringify(body || {})); } catch (_) {}
  return safeDecode(fragments.join(' ')).toLowerCase();
}

function safeDecode(input) {
  let out = String(input || '');
  for (let i = 0; i < 2; i++) {
    try { out = decodeURIComponent(out); } catch (_) { break; }
  }
  return out;
}

function detectScenario(query, body, url, routeKey) {
  const direct = String((query && query.scenario) || (body && body.scenario) || '').toLowerCase();
  if (direct) return direct.slice(0, 64);
  const s = flattenForDetection(query, body, url, routeKey);
  if (/union\s+select|or\s+'?1'?\s*=\s*'?1|drop\s+table|select\s+.*from/.test(s)) return 'sqli';
  if (/<script|onerror\s*=|onload\s*=|<svg|<img/.test(s)) return 'xss';
  if (/\.\.\/|\.\.\\|etc\/passwd|win\.ini|etc\/shadow/.test(s)) return 'traversal';
  if (/;\s*(cat|whoami|id)|&&\s*(id|whoami)|\|\s*(cat|id)|`/.test(s)) return 'cmdi';
  if (/169\.254\.169\.254|localhost|127\.0\.0\.1|metadata/.test(s)) return 'ssrf';
  if (/\.env|\.git\/config|wp-login\.php|admin\//.test(s)) return 'recon';
  if (/credit_card|ssn|isadmin|mass_update|"amount"\s*:\s*-|amount=-/.test(s)) return 'api_abuse';
  return 'benign';
}

function classifyScenario(scenario) {
  const map = {
    sqli: { severity: 'high', expectedWaapDetection: 'SQL Injection / Attack Type: Injection', recommendedWaapAction: 'Block and log' },
    xss: { severity: 'high', expectedWaapDetection: 'Cross-Site Scripting / Script Injection', recommendedWaapAction: 'Block and log' },
    traversal: { severity: 'high', expectedWaapDetection: 'Path Traversal / Local File Inclusion', recommendedWaapAction: 'Block and alert' },
    cmdi: { severity: 'high', expectedWaapDetection: 'OS Command Injection', recommendedWaapAction: 'Block and alert' },
    ssrf: { severity: 'medium', expectedWaapDetection: 'SSRF / Metadata Service Probe', recommendedWaapAction: 'Block or alert depending on policy stage' },
    recon: { severity: 'medium', expectedWaapDetection: 'Scanner / Sensitive File or Path Access', recommendedWaapAction: 'Alert, rate-limit, or block' },
    api_abuse: { severity: 'medium', expectedWaapDetection: 'API schema violation / sensitive field exposure', recommendedWaapAction: 'Alert, enforce API schema, and log' },
    benign: { severity: 'info', expectedWaapDetection: 'Allowed application traffic', recommendedWaapAction: 'Allow and observe' }
  };
  return map[scenario] || map.benign;
}

function buildDemoResponse(routeKey, scenario, query, body) {
  const amount = Number(body.amount || query.amount || 12400);
  const base = { route: '/api/' + routeKey, scenario, simulated: true, institution: 'BIVA Bank' };
  switch (routeKey) {
    case 'system/health':
      return { ...base, status: 'healthy', services: ['digital-banking', 'payments', 'api-security'], latencyMs: 37 };
    case 'accounts/search':
    case 'products/search':
      return { ...base, total: 3, products: ['BIVA Checking Account', 'BIVA Platinum Credit Card', 'BIVA Investment Portfolio'] };
    case 'auth/login':
      return { ...base, authenticated: scenario === 'benign', tokenIssued: false, user: body.username || query.username || 'biva.demo.user' };
    case 'payments/transfer':
    case 'cart/checkout':
      return { ...base, transferId: 'trf_demo_' + Date.now().toString(36), approved: amount > 0 && scenario === 'benign', amount, executedTransfer: false };
    case 'users/profile':
      return { ...base, updated: scenario === 'benign', userId: body.userId || query.userId || 'usr_demo' };
    case 'statements/download':
    case 'files/download':
      return { ...base, statement: query.file || body.file || body.download || 'statement-demo.pdf', downloaded: false, reason: 'demo only - no filesystem access' };
    case 'reports/export':
      return { ...base, reportId: 'rep_demo', status: 'queued', executedCommand: false };
    case 'webhooks/register':
      return { ...base, webhookRegistered: scenario === 'benign', callbackExecuted: false };
    case 'admin/lookup':
      return { ...base, records: [], queryExecuted: false, privilegedAction: false };
    case 'recon/probe':
      return { ...base, requestedPath: query.target_path || query.path || body.target_path || body.path || '/', exists: false };
    case 'support/ticket':
      return { ...base, ticketId: 'case_demo_' + Date.now().toString(36), stored: false };
    default:
      return base;
  }
}

module.exports.ACTIVE_ENDPOINTS = ACTIVE_ENDPOINTS;
