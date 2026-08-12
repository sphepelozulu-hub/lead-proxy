const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // HEALTH CHECK
  // ─────────────────────────────────────────────────────────────

  if (req.url === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
      status: 'ok'
    }));

    return;
  }

  // ─────────────────────────────────────────────────────────────
  // SEND LEAD TO LEADBYTE
  // ─────────────────────────────────────────────────────────────

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

      response.on('data', chunk => {
        responseBody += chunk;
      });

      response.on('end', () => {

        console.log('LeadByte Response:', responseBody);

        res.writeHead(200, {
          'Content-Type': 'application/json'
        });

        try {
          res.end(JSON.stringify(JSON.parse(responseBody)));
        } catch (error) {
          res.end(JSON.stringify({
            code: -100,
            response: 'Invalid response from LeadByte',
            raw: responseBody
          }));
        }
      });
    });

    request.on('error', error => {

      console.error('LeadByte Error:', error);

      res.writeHead(500, {
        'Content-Type': 'application/json'
      });

      res.end(JSON.stringify({
        code: -100,
        response: error.message
      }));
    });

    request.write(postData);
    request.end();
  }

  // ─────────────────────────────────────────────────────────────
  // OPT-IN DATE
  // Format: dd/mm/yyyy hh:mm:ss
  // ─────────────────────────────────────────────────────────────

  function getOptinDate() {

    const now = new Date();

    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();

    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
  }

  // ─────────────────────────────────────────────────────────────
  // READ REQUEST BODY
  // ─────────────────────────────────────────────────────────────

  function readBody(req, callback) {

    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      callback(body);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FLEXICARE / MEDICAL WHITE LABEL
  // ─────────────────────────────────────────────────────────────

  if (req.url === '/submit' && req.method === 'POST') {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);

        const p = new URLSearchParams();

        p.append('campid', 'MEDICAL-WHITE-LABEL');
        p.append('sid', '25393');
        p.append('returnjson', 'yes');

        p.append('firstname', d.params?.firstname || '');
        p.append('lastname', d.params?.lastname || '');
        p.append('phone1', d.params?.phone || '');
        p.append('email', d.params?.email || '');

        p.append(
          'optinurl',
          d.params?.optinurl ||
          'http://tracking.affcoza.com/aff_c?offer_id=3066&aff_id=25393'
        );

        p.append('optindate', getOptinDate());
        p.append('doi', 'true');
        p.append('acceptterms', 'true');

        p.append('age_range', '25 - 34');
        p.append('income_range', 'R10 000 - R15 000');

        p.append('offer_id', '2514');

        postToLeadbyte(p.toString(), res);

      } catch (error) {

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          code: -100,
          response: error.message
        }));
      }
    });

    return;
  }

  // ─────────────────────────────────────────────────────────────
  // CARTRACK DASHCAMS
  // ─────────────────────────────────────────────────────────────

  if (req.url === '/submit-cartrack' && req.method === 'POST') {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);

        const p = new URLSearchParams();

        Object.entries(d.params || {}).forEach(([key, value]) => {
          p.append(key, value ?? '');
        });

        postToLeadbyte(p.toString(), res);

      } catch (error) {

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          code: -100,
          response: error.message
        }));
      }
    });

    return;
  }

  // ─────────────────────────────────────────────────────────────
  // LOANS
  // ─────────────────────────────────────────────────────────────

  if (req.url === '/submit-loans' && req.method === 'POST') {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);

        const p = new URLSearchParams();

        p.append('campid', 'KONGA');
        p.append('sid', '25393');
        p.append('returnjson', 'yes');

        p.append('firstname', d.params?.firstname || '');
        p.append('lastname', d.params?.lastname || '');
        p.append('phone1', d.params?.phone || '');
        p.append('email', d.params?.email || '');

        p.append(
          'optinurl',
          d.params?.optinurl ||
          'https://sites.google.com/view/quick-loans-sa/home'
        );

        p.append('optindate', getOptinDate());

        p.append(
          'idnumber',
          d.params?.idnumber || ''
        );

        p.append('underdebtreview', 'false');
        p.append('acceptterms', 'true');

        p.append(
          'netincome',
          d.params?.netincome || '15000'
        );

        p.append('offer_id', '397');

        postToLeadbyte(p.toString(), res);

      } catch (error) {

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          code: -100,
          response: error.message
        }));
      }
    });

    return;
  }

  // ─────────────────────────────────────────────────────────────
  // CAR INSURANCE
  // ─────────────────────────────────────────────────────────────

  if (
    req.url === '/submit-carinsurance' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);

        const p = new URLSearchParams();

        p.append('campid', 'CAR-INSURANCE');
        p.append('sid', '25393');
        p.append('returnjson', 'yes');

        p.append('firstname', d.params?.firstname || '');
        p.append('lastname', d.params?.lastname || '');
        p.append('phone1', d.params?.phone || '');

        if (d.params?.email) {
          p.append('email', d.params.email);
        }

        p.append(
          'optinurl',
          d.params?.optinurl ||
          'https://sites.google.com/view/car-insurance-sa/home'
        );

        p.append('optindate', getOptinDate());

        p.append('channel', 'JMAff');
        p.append('product', 'JMCar');
        p.append('leadsource', 'JMAFFSite26748');
        p.append('affiliateshortcode', 'JMAFFSite26748');

        p.append('doi', 'true');
        p.append('acceptterms', 'true');

        p.append('car_ownership', 'yes');
        p.append('age_range', '25 - 34');
        p.append('income_range', 'R10 000 - R15 000');

        p.append('offer_id', '377');

        postToLeadbyte(p.toString(), res);

      } catch (error) {

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          code: -100,
          response: error.message
        }));
      }
    });

    return;
  }

  // ─────────────────────────────────────────────────────────────
  // 1LIFE LIFE COVER
  // Campaign: LIFE-COVER
  // SID: 25393
  // Offer ID: 2807
  // ─────────────────────────────────────────────────────────────

  if (
    req.url === '/submit-1life' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);

        const p = new URLSearchParams();

        // Campaign identification
        p.append('campid', 'LIFE-COVER');
        p.append('sid', '25393');
        p.append('returnjson', 'yes');

        // Required personal details
        p.append(
          'email',
          d.params?.email || ''
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
          d.params?.phone ||
          d.params?.phone1 ||
          ''
        );

        // Opt-in information
        p.append(
          'optinurl',
          d.params?.optinurl ||
          'https://returnxdigital.leadbyte.co.uk/integration?slice=6a748c4e510b0901923052'
        );

        p.append(
          'optindate',
          d.params?.optindate ||
          getOptinDate()
        );

        // Optional income bracket
        if (d.params?.incomebracket) {
          p.append(
            'incomebracket',
            d.params.incomebracket
          );
        }

        // Optional HIV information
        if (
          d.params?.hiv_life_insurance !== undefined &&
          d.params?.hiv_life_insurance !== ''
        ) {
          p.append(
            'hiv_life_insurance',
            String(d.params.hiv_life_insurance)
          );
        }

        // Optional diabetes information
        if (
          d.params?.diabetes_life_insurance !== undefined &&
          d.params?.diabetes_life_insurance !== ''
        ) {
          p.append(
            'diabetes_life_insurance',
            String(d.params.diabetes_life_insurance)
          );
        }

        // Terms
        p.append(
          'acceptterms',
          d.params?.acceptterms !== undefined
            ? String(d.params.acceptterms)
            : 'true'
        );

        // IMPORTANT:
        // Integration information supplied for this campaign
        p.append('offer_id', '2807');

        console.log(
          'Sending 1Life lead to LeadByte:',
          p.toString()
        );

        postToLeadbyte(p.toString(), res);

      } catch (error) {

        console.error(
          '1Life submission error:',
          error
        );

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          code: -100,
          response: error.message
        }));
      }
    });

    return;
  }

  // ─────────────────────────────────────────────────────────────
  // UNKNOWN ROUTE
  // ─────────────────────────────────────────────────────────────

  res.writeHead(404, {
    'Content-Type': 'text/plain'
  });

  res.end('not found');

}).listen(PORT, () => {
  console.log(
    'Lead Proxy running on port ' + PORT
  );
});
