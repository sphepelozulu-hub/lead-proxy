const http = require('http');
const https = https; // using native https

const PORT = process.env.PORT || 3000;

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
}

function readBody(req, cb) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => { cb(body); });
}

function getOptinDate() {
  const n = new Date();
  const dd = String(n.getDate()).padStart(2, '0');
  const mm = String(n.getMonth() + 1).padStart(2, '0');
  const hh = String(n.getHours()).padStart(2, '0');
  const mi = String(n.getMinutes()).padStart(2, '0');
  const ss = String(n.getSeconds()).padStart(2, '0');
  return `${dd}/${mm}/${n.getFullYear()} ${hh}:${mi}:${ss}`;
}

function generateSAID() {
  const yr = String(45 + Math.floor(Math.random() * 20)).padStart(2, '0');
  const mo = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  const dy = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
  const sq = String(Math.floor(Math.random() * 5000)).padStart(4, '0');
  const p = yr + mo + dy + sq + '08';
  let sum = 0;
  for (let i = 0; i < p.length; i++) {
    let d = parseInt(p[p.length - 1 - i], 10);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return p + ((10 - (sum % 10)) % 10);
}

function getIncoming(data) {
  if (data && data.params && typeof data.params === 'object') {
    return data.params;
  }
  return data || {};
}

// Standard LeadByte Poster (for 1Life, Cartrack, etc.)
function postToLeadbyte(postData, res) {
  const options = {
    hostname: 'returnxdigital.leadbyte.co.uk',
    path: '/api/submit.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = https.request(options, response => {
    let responseBody = '';
    response.on('data', chunk => { responseBody += chunk; });
    response.on('end', () => {
      let parsed;
      try {
        parsed = JSON.parse(responseBody);
      } catch (e) {
        parsed = {
          code: response.statusCode >= 200 && response.statusCode < 300 ? 0 : -1,
          response: responseBody
        };
      }
      sendJson(res, response.statusCode || 200, {
        ...parsed,
        leadbyte_http_status: response.statusCode,
        leadbyte_raw_response: responseBody
      });
    });
  });

  request.on('error', error => {
    sendJson(res, 502, { code: -100, response: error.message });
  });

  request.write(postData);
  request.end();
}

// Dedicated Slice Poster for Zolos Debt (Offer 2858)
function postToZolosSlice(postData, res) {
  const options = {
    hostname: 'returnxdigital.leadbyte.co.uk',
    path: '/integration?slice=6ac4cc3fbc7f2525965887&' + postData,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const request = https.request(options, response => {
    let responseBody = '';
    response.on('data', chunk => { responseBody += chunk; });
    response.on('end', () => {
      let parsed;
      try {
        parsed = JSON.parse(responseBody);
      } catch (e) {
        parsed = {
          code: response.statusCode >= 200 && response.statusCode < 300 ? 1 : -1,
          response: responseBody
        };
      }
      sendJson(res, response.statusCode || 200, {
        ...parsed,
        leadbyte_http_status: response.statusCode,
        leadbyte_raw_response: responseBody
      });
    });
  });

  request.on('error', error => {
    sendJson(res, 502, { code: -100, response: error.message });
  });

  request.end();
}


/*
=========================================================
SERVER
=========================================================
*/

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/health') {
    sendJson(res, 200, {
      status: 'ok',
      service: 'lead-proxy',
      routes: [
        '/submit',
        '/submit-cartrack',
        '/submit-1life',
        '/submit-loans',
        '/submit-carinsurance',
        '/submit-zolos-debt'
      ]
    });
    return;
  }

  // 1LIFE LIFE COVER
  if (req.url === '/submit-1life' && req.method === 'POST') {
    readBody(req, body => {
      try {
        const data = JSON.parse(body);
        const incoming = getIncoming(data);
        const p = new URLSearchParams();
        p.append('campid', 'LIFE-COVER');
        p.append('sid', '25393');
        p.append('returnjson', 'yes');
        p.append('offer_id', '2807');
        p.append('firstname', String(incoming.firstname || '').trim());
        p.append('lastname', String(incoming.lastname || '').trim());
        p.append('phone1', String(incoming.phone1 || incoming.phone || '').trim());
        p.append('email', String(incoming.email || '').trim());
        p.append('optinurl', String(incoming.optinurl || 'http://url.com').trim());
        p.append('optindate', String(incoming.optindate || getOptinDate()).trim());
        p.append('doi', incoming.doi !== undefined ? String(incoming.doi) : 'true');
        p.append('acceptterms', incoming.acceptterms !== undefined ? String(incoming.acceptterms) : 'true');
        if (incoming.incomebracket) p.append('incomebracket', String(incoming.incomebracket).trim());
        if (incoming.employed !== undefined) p.append('employed', String(incoming.employed));
        postToLeadbyte(p.toString(), res);
      } catch (error) {
        sendJson(res, 400, { code: -100, response: error.message });
      }
    });
    return;
  }

  // CARTRACK CAMERAS
  if (req.url === '/submit-cartrack' && req.method === 'POST') {
    readBody(req, body => {
      try {
        const data = JSON.parse(body);
        const incoming = getIncoming(data);
        const p = new URLSearchParams();
        p.append('campid', 'DASHCAMS');
        p.append('sid', '25393');
        p.append('returnjson', 'yes');
        p.append('First_Name', String(incoming.firstname || incoming.First_Name || '').trim());
        p.append('Last_Name', String(incoming.lastname || incoming.Last_Name || '').trim());
        const phone = String(incoming.phone1 || incoming.phone || incoming.CellNumber || '').trim();
        p.append('CellNumber', phone);
        p.append('Phone_1', phone);
        p.append('email', incoming.email || '');
        p.append('optinurl', incoming.optinurl || 'http://url.com');
        p.append('optindate', incoming.optindate || getOptinDate());
        p.append('acceptterms', 'true');
        p.append('offer_id', '3046');
        postToLeadbyte(p.toString(), res);
      } catch (error) {
        sendJson(res, 400, { code: -100, response: error.message });
      }
    });
    return;
  }

  // ZOLOS DEBT (OFFER 2858 SLICE INTEGRATION)
  if (req.url === '/submit-zolos-debt' && req.method === 'POST') {
    readBody(req, body => {
      try {
        const data = JSON.parse(body);
        const incoming = getIncoming(data);
        const p = new URLSearchParams();

        p.append('returnjson', 'yes');
        p.append('offer_id', '2858');
        p.append('firstname', String(incoming.firstname || '').trim());
        p.append('lastname', String(incoming.lastname || '').trim());
        p.append('phone1', String(incoming.phone1 || incoming.phone || '').trim());
        p.append('email', String(incoming.email || '').trim());
        p.append('optinurl', String(incoming.optinurl || 'https://zolosdebt.co.za').trim());
        p.append('optindate', String(incoming.optindate || getOptinDate()).trim());
        p.append('debt_greater_than_35_000', 'true');
        p.append('income_greater_than_10_000', 'true');
        p.append('underdebtreview', 'false');
        p.append('employment', 'true');

        postToZolosSlice(p.toString(), res);
      } catch (error) {
        sendJson(res, 400, { code: -100, response: error.message });
      }
    });
    return;
  }

  sendJson(res, 404, {
    code: 404,
    response: 'not found',
    path: req.url
  });

}).listen(PORT, () => {
  console.log(`Lead proxy running on port ${PORT}`);
});
