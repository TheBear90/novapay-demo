module.exports = async (req, res) => {
  const startedAt = Date.now();

  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, X-NovaPay-WAF-Lab, X-Attack-Scenario, X-Traffic-Source, X-NovaPay-Demo');
  res.setHeader('X-F5-Demo-Lab', 'novapay-waf-attack-lab');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const query = req.query || {};
  const rawBody = req.body !== undefined ? req.body : await readRawBody(req);
  const body = normalizeBody(rawBody);
  const scenario = String(
    query.scenario ||
    body.scenario ||
    req.headers['x-attack-scenario'] ||
    'benign'
  ).slice(0, 64);

  const classification = classifyScenario(scenario);

  const response = {
    ok: true,
    lab: 'F5 Distributed Cloud WAAP / WAF Attack Lab',
    domainFlow: 'demoshop.f5latam.app',
    note: 'Demo endpoint only. Payloads are reflected as metadata and are never executed against any backend system.',
    method: req.method,
    url: req.url,
    contentType: req.headers['content-type'] || null,
    scenario,
    expectedWaapDetection: classification.expectedWaapDetection,
    severity: classification.severity,
    recommendedWaapAction: classification.recommendedWaapAction,
    query,
    bodyPreview: previewBody(body),
    receivedAt: new Date().toISOString(),
    processingMs: Date.now() - startedAt
  };

  return res.status(200).json(response);
};


function readRawBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; if (data.length > 2048) req.destroy(); });
    req.on('end', () => resolve(data));
    req.on('error', () => resolve(''));
  });
}

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === 'object') return body;
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch (_) { return { raw: body.slice(0, 512) }; }
  }
  return { type: typeof body };
}

function previewBody(body) {
  try {
    return JSON.stringify(body).slice(0, 700);
  } catch (_) {
    return '[unserializable body]';
  }
}

function classifyScenario(scenario) {
  const map = {
    sqli: {
      severity: 'high',
      expectedWaapDetection: 'SQL Injection / Attack Type: Injection',
      recommendedWaapAction: 'Block and log'
    },
    xss: {
      severity: 'high',
      expectedWaapDetection: 'Cross-Site Scripting / Script Injection',
      recommendedWaapAction: 'Block and log'
    },
    traversal: {
      severity: 'high',
      expectedWaapDetection: 'Path Traversal / Local File Inclusion',
      recommendedWaapAction: 'Block and alert'
    },
    cmdi: {
      severity: 'high',
      expectedWaapDetection: 'OS Command Injection',
      recommendedWaapAction: 'Block and alert'
    },
    ssrf: {
      severity: 'medium',
      expectedWaapDetection: 'SSRF / Metadata Service Probe',
      recommendedWaapAction: 'Block or alert depending on policy stage'
    },
    recon: {
      severity: 'medium',
      expectedWaapDetection: 'Scanner / Sensitive Path Access',
      recommendedWaapAction: 'Alert, rate-limit, or block'
    },
    api_abuse: {
      severity: 'medium',
      expectedWaapDetection: 'API schema violation / sensitive field exposure',
      recommendedWaapAction: 'Alert, enforce API schema, and log'
    },
    benign: {
      severity: 'info',
      expectedWaapDetection: 'Allowed application traffic',
      recommendedWaapAction: 'Allow and observe'
    }
  };
  return map[scenario] || map.benign;
}
