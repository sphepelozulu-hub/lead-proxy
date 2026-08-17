const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
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

function readBody(req, cb) {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    cb(body);
  });
}

function postToLeadbyte(postData, res, label) {
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
    let raw = '';

    response.on('data', chunk => {
      raw += chunk;
    });

    response.on('end', () => {
      console.log(`[${label}] LeadByte HTTP ${response.statusCode}`);
      console.log(`[${label}] LeadByte response: ${raw}`);

      try {
        sendJson(res, 200, JSON.parse(raw));
      } catch (e) {
        sendJson(res, 200, {
          code: -101,
          response: 'LeadByte returned a non-JSON response',
          raw: raw
        });
      }
    });
  });

  request.setTimeout(20000, () => {
    request.destroy(
      new Error('LeadByte request timed out after 20 seconds')
    );
  });

  request.on('error', err => {
    console.error(
      `[${label}] LeadByte request error: ${err.message}`
    );

    sendJson(res, 502, {
      code: -100,
      response: err.message
    });
  });

  request.write(postData);
  request.end();
}


http.createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }


  // ============================================================
  // HEALTH CHECK
  // ============================================================

  if (req.url === '/health') {

    sendJson(res, 200, {
      status: 'ok',
      service: 'lead-proxy',
      routes: [
        '/submit-1life',
        '/submit-cartrack',
        '/submit',
        '/submit-loans',
        '/submit-carinsurance'
      ]
    });

    return;
  }


  // ============================================================
  // 1LIFE LIFE COVER
  // ============================================================

  if (req.url === '/submit-1life' && req.method === 'POST') {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);
        const incoming = d.params || {};

        const firstname =
          String(incoming.firstname || '').trim();

        const lastname =
          String(incoming.lastname || '').trim();

        const phone1 =
          String(
            incoming.phone1 ||
            incoming.phone ||
            ''
          ).trim();

        const email =
          String(incoming.email || '').trim();

        const optinurl =
          String(incoming.optinurl || '').trim();

        const optindate =
          String(
            incoming.optindate ||
            getOptinDate()
          ).trim();

        const acceptterms =
          String(
            incoming.acceptterms === undefined
              ? 'true'
              : incoming.acceptterms
          ).trim();

        const incomebracket =
          String(
            incoming.incomebracket || ''
          ).trim();


        // --------------------------------------------------------
        // Check required fields
        // --------------------------------------------------------

        const missing = [];

        if (!firstname) {
          missing.push('firstname');
        }

        if (!lastname) {
          missing.push('lastname');
        }

        if (!phone1) {
          missing.push('phone1');
        }

        if (!email) {
          missing.push('email');
        }

        if (!optinurl) {
          missing.push('optinurl');
        }

        if (!optindate) {
          missing.push('optindate');
        }

        if (!acceptterms) {
          missing.push('acceptterms');
        }

        if (!incomebracket) {
          missing.push('incomebracket');
        }


        if (missing.length > 0) {

          console.error(
            '[1LIFE] Missing fields:',
            missing.join(', ')
          );

          sendJson(res, 400, {
            code: -102,
            response: 'Missing required 1Life fields',
            missing: missing
          });

          return;
        }


        // --------------------------------------------------------
        // Approved LeadByte income bracket values
        // --------------------------------------------------------

        const approvedBrackets = new Set([
          '0_To_3000',
          '3000_To_5000',
          '5000_To_10000',
          '10000_To_15000',
          '15000_To_20000',
          '20000_To_30000',
          '30000_To_40000',
          '40000_To_50000',
          '50000_To_60000',
          '60000_To_70000',
          '70000_To_80000',
          '80000_And_Above',
          'NotCurrentlyEmployed'
        ]);


        if (!approvedBrackets.has(incomebracket)) {

          console.error(
            '[1LIFE] Invalid incomebracket:',
            incomebracket
          );

          sendJson(res, 400, {
            code: -103,
            response: 'Invalid incomebracket',
            incomebracket: incomebracket
          });

          return;
        }


        // --------------------------------------------------------
        // Build LeadByte request
        // --------------------------------------------------------

        const p = new URLSearchParams();


        // FORCE 1Life campaign details
        p.append('campid', 'LIFE-COVER');
        p.append('sid', '25393');
        p.append('returnjson', 'yes');


        // Lead details
        p.append('firstname', firstname);
        p.append('lastname', lastname);
        p.append('phone1', phone1);
        p.append('email', email);


        // Consent / opt-in
        p.append('optinurl', optinurl);
        p.append('optindate', optindate);
        p.append('acceptterms', acceptterms);


        // Income
        p.append('incomebracket', incomebracket);


        // Offer
        p.append('offer_id', '2807');


        // --------------------------------------------------------
        // Optional fields
        // --------------------------------------------------------

        if (
          incoming.hiv_life_insurance !== undefined &&
          String(
            incoming.hiv_life_insurance
          ).trim() !== ''
        ) {

          p.append(
            'hiv_life_insurance',
            String(incoming.hiv_life_insurance)
          );

        }


        if (
          incoming.diabetes_life_insurance !== undefined &&
          String(
            incoming.diabetes_life_insurance
          ).trim() !== ''
        ) {

          p.append(
            'diabetes_life_insurance',
            String(incoming.diabetes_life_insurance)
          );

        }


        // --------------------------------------------------------
        // Logging
        // --------------------------------------------------------

        console.log(
          '[1LIFE] Submitting fields:'
        );

        console.log(
          '[1LIFE] campid=LIFE-COVER'
        );

        console.log(
          '[1LIFE] sid=25393'
        );

        console.log(
          '[1LIFE] offer_id=2807'
        );

        console.log(
          `[1LIFE] firstname=${firstname}`
        );

        console.log(
          `[1LIFE] lastname=${lastname}`
        );

        console.log(
          `[1LIFE] phone1=${phone1}`
        );

        console.log(
          `[1LIFE] email=${email}`
        );

        console.log(
          `[1LIFE] incomebracket=${incomebracket}`
        );

        console.log(
          `[1LIFE] optindate=${optindate}`
        );


        // Send to LeadByte
        postToLeadbyte(
          p.toString(),
          res,
          '1LIFE'
        );

      } catch (e) {

        console.error(
          '[1LIFE] Route error:',
          e.message
        );

        sendJson(res, 400, {
          code: -100,
          response: e.message
        });

      }

    });

    return;
  }


  // ============================================================
  // FLEXICARE
  // ============================================================

  if (req.url === '/submit' && req.method === 'POST') {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);
        const p = new URLSearchParams();

        p.append(
          'campid',
          'MEDICAL-WHITE-LABEL'
        );

        p.append(
          'sid',
          '25393'
        );

        p.append(
          'returnjson',
          'yes'
        );

        p.append(
          'firstname',
          d.params?.firstname || ''
        );

        p.append(
          'lastname',
          d.params?.lastname || ''
        );

        p.append(
          'phone1',
          d.params?.phone || ''
        );

        p.append(
          'email',
          d.params?.email || ''
        );

        p.append(
          'optinurl',
          d.params?.optinurl ||
          'http://tracking.affcoza.com/aff_c?offer_id=3066&aff_id=25393'
        );

        p.append(
          'optindate',
          getOptinDate()
        );

        p.append(
          'doi',
          'true'
        );

        p.append(
          'acceptterms',
          'true'
        );

        p.append(
          'age_range',
          '25 - 34'
        );

        p.append(
          'income_range',
          'R10 000 - R15 000'
        );

        p.append(
          'offer_id',
          '2514'
        );

        postToLeadbyte(
          p.toString(),
          res,
          'FLEXICARE'
        );

      } catch (e) {

        sendJson(res, 400, {
          code: -100,
          response: e.message
        });

      }

    });

    return;
  }


  // ============================================================
  // CARTRACK CAMERAS
  // ============================================================

  if (
    req.url === '/submit-cartrack' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);
        const incoming = d.params || {};

        const p = new URLSearchParams();

        p.append(
          'campid',
          'DASHCAMS'
        );

        p.append(
          'sid',
          '25393'
        );

        p.append(
          'returnjson',
          'yes'
        );

        p.append(
          'firstname',
          incoming.firstname || ''
        );

        p.append(
          'lastname',
          incoming.lastname || ''
        );

        p.append(
          'phone1',
          incoming.phone1 ||
          incoming.phone ||
          ''
        );

        p.append(
          'email',
          incoming.email || ''
        );

        p.append(
          'optinurl',
          incoming.optinurl ||
          'http://url.com'
        );

        p.append(
          'optindate',
          incoming.optindate ||
          getOptinDate()
        );

        p.append(
          'acceptterms',
          incoming.acceptterms ??
          'true'
        );

        p.append(
          'offer_id',
          '3046'
        );

        console.log(
          '[CARTRACK] Submitting:',
          p.toString()
        );

        postToLeadbyte(
          p.toString(),
          res,
          'CARTRACK'
        );

      } catch (e) {

        sendJson(res, 400, {
          code: -100,
          response: e.message
        });

      }

    });

    return;
  }


  // ============================================================
  // LOANS
  // ============================================================

  if (
    req.url === '/submit-loans' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);
        const p = new URLSearchParams();

        p.append(
          'campid',
          'KONGA'
        );

        p.append(
          'sid',
          '25393'
        );

        p.append(
          'returnjson',
          'yes'
        );

        p.append(
          'firstname',
          d.params?.firstname || ''
        );

        p.append(
          'lastname',
          d.params?.lastname || ''
        );

        p.append(
          'phone1',
          d.params?.phone || ''
        );

        p.append(
          'email',
          d.params?.email || ''
        );

        p.append(
          'optinurl',
          d.params?.optinurl ||
          'https://sites.google.com/view/quick-loans-sa/home'
        );

        p.append(
          'optindate',
          getOptinDate()
        );

        p.append(
          'acceptterms',
          'true'
        );

        p.append(
          'netincome',
          d.params?.netincome ||
          '15000'
        );

        p.append(
          'offer_id',
          '397'
        );

        postToLeadbyte(
          p.toString(),
          res,
          'LOANS'
        );

      } catch (e) {

        sendJson(res, 400, {
          code: -100,
          response: e.message
        });

      }

    });

    return;
  }


  // ============================================================
  // CAR INSURANCE
  // ============================================================

  if (
    req.url === '/submit-carinsurance' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);
        const p = new URLSearchParams();

        p.append(
          'campid',
          'CAR-INSURANCE'
        );

        p.append(
          'sid',
          '25393'
        );

        p.append(
          'returnjson',
          'yes'
        );

        p.append(
          'firstname',
          d.params?.firstname || ''
        );

        p.append(
          'lastname',
          d.params?.lastname || ''
        );

        p.append(
          'phone1',
          d.params?.phone || ''
        );

        if (d.params?.email) {

          p.append(
            'email',
            d.params.email
          );

        }

        p.append(
          'optinurl',
          d.params?.optinurl ||
          'https://sites.google.com/view/car-insurance-sa/home'
        );

        p.append(
          'optindate',
          getOptinDate()
        );

        p.append(
          'channel',
          'JMAff'
        );

        p.append(
          'product',
          'JMCar'
        );

        p.append(
          'leadsource',
          'JMAFFSite26748'
        );

        p.append(
          'affiliateshortcode',
          'JMAFFSite26748'
        );

        p.append(
          'doi',
          'true'
        );

        p.append(
          'acceptterms',
          'true'
        );

        p.append(
          'car_ownership',
          'yes'
        );

        p.append(
          'age_range',
          '25 - 34'
        );

        p.append(
          'income_range',
          'R10 000 - R15 000'
        );

        p.append(
          'offer_id',
          '377'
        );

        postToLeadbyte(
          p.toString(),
          res,
          'CAR-INSURANCE'
        );

      } catch (e) {

        sendJson(res, 400, {
          code: -100,
          response: e.message
        });

      }

    });

    return;
  }


  // ============================================================
  // 404
  // ============================================================

  res.writeHead(404);
  res.end('not found');

}).listen(
  PORT,
  () => {
    console.log(
      `Proxy running on port ${PORT}`
    );
  }
);
