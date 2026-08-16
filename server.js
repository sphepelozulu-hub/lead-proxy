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

  // ── HEALTH CHECK ────────────────────────────────────────────────────────
  if (req.url === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
      status: 'ok'
    }));

    return;
  }

  // ── LEADBYTE POST FUNCTION ─────────────────────────────────────────────
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

    const r = https.request(options, resp => {

      let rb = '';

      resp.on('data', c => {
        rb += c;
      });

      resp.on('end', () => {

        console.log('LeadByte Response:', rb);

        res.writeHead(200, {
          'Content-Type': 'application/json'
        });

        try {

          res.end(
            JSON.stringify(JSON.parse(rb))
          );

        } catch (e) {

          res.end(
            JSON.stringify({
              code: 1,
              response: 'OK',
              leadId: null
            })
          );

        }

      });

    });

    r.on('error', e => {

      console.error(
        'LeadByte request error:',
        e.message
      );

      res.writeHead(500, {
        'Content-Type': 'application/json'
      });

      res.end(
        JSON.stringify({
          code: -100,
          response: e.message
        })
      );

    });

    r.write(postData);
    r.end();
  }

  // ── OPT-IN DATE ─────────────────────────────────────────────────────────
  function getOptinDate() {

    const n = new Date();

    const dd = n.getDate()
      .toString()
      .padStart(2, '0');

    const mm = (n.getMonth() + 1)
      .toString()
      .padStart(2, '0');

    const hh = n.getHours()
      .toString()
      .padStart(2, '0');

    const mi = n.getMinutes()
      .toString()
      .padStart(2, '0');

    const ss = n.getSeconds()
      .toString()
      .padStart(2, '0');

    return (
      dd +
      '/' +
      mm +
      '/' +
      n.getFullYear() +
      ' ' +
      hh +
      ':' +
      mi +
      ':' +
      ss
    );
  }

  // ── READ REQUEST BODY ───────────────────────────────────────────────────
  function readBody(req, cb) {

    let b = '';

    req.on('data', c => {
      b += c;
    });

    req.on('end', () => {
      cb(b);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CARTRACK CAMERAS
  // ═══════════════════════════════════════════════════════════════════════

  if (
    req.url === '/submit-cartrack' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const d = JSON.parse(body);

        const incoming = d.params || {};

        const p = new URLSearchParams();

        // IMPORTANT:
        // These values are FORCED here.
        // This fixes LeadByte error -5:
        // "Campaign reference (campid) was not specified"

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

        if (incoming.email) {

          p.append(
            'email',
            incoming.email
          );

        }

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
          incoming.acceptterms !== undefined
            ? String(incoming.acceptterms)
            : 'true'
        );

        // CarTrack Cameras Offer ID
        p.append(
          'offer_id',
          '3046'
        );

        // Log the COMPLETE submission so we can see
        // exactly what is being sent to LeadByte.
        console.log(
          'CarTrack submission:',
          p.toString()
        );

        postToLeadbyte(
          p.toString(),
          res
        );

      } catch (e) {

        console.error(
          'CarTrack route error:',
          e.message
        );

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(
          JSON.stringify({
            code: -100,
            response: e.message
          })
        );

      }

    });

    return;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // FLEXICARE
  // ═══════════════════════════════════════════════════════════════════════

  if (
    req.url === '/submit' &&
    req.method === 'POST'
  ) {

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
          res
        );

      } catch (e) {

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(
          JSON.stringify({
            code: -100,
            response: e.message
          })
        );

      }

    });

    return;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LOANS
  // ═══════════════════════════════════════════════════════════════════════

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
          d.params?.netincome || '15000'
        );

        p.append(
          'offer_id',
          '397'
        );

        postToLeadbyte(
          p.toString(),
          res
        );

      } catch (e) {

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(
          JSON.stringify({
            code: -100,
            response: e.message
          })
        );

      }

    });

    return;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CAR INSURANCE
  // ═══════════════════════════════════════════════════════════════════════

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
          res
        );

      } catch (e) {

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(
          JSON.stringify({
            code: -100,
            response: e.message
          })
        );

      }

    });

    return;
  }

  // ── NOT FOUND ──────────────────────────────────────────────────────────
  res.writeHead(404);
  res.end('not found');

}).listen(
  PORT,
  () => console.log(
    'Proxy running on port ' + PORT
  )
);
