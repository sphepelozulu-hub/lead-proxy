const http = require('http');
const https = require('https');

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

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    cb(body);
  });
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

      if (d > 9) {
        d -= 9;
      }
    }

    sum += d;
  }

  return p + ((10 - (sum % 10)) % 10);
}

/*
 * Accept both:
 *
 * {
 *   params: {
 *      firstname: "...",
 *      ...
 *   }
 * }
 *
 * and:
 *
 * {
 *   firstname: "...",
 *   ...
 * }
 */
function getIncoming(data) {
  if (
    data &&
    data.params &&
    typeof data.params === 'object'
  ) {
    return data.params;
  }

  return data || {};
}


/*
 * SEND DATA TO LEADBYTE
 *
 * IMPORTANT:
 * We return the actual LeadByte response.
 * This means the dashboard can see the real rejection reason.
 */
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

      console.log(
        'LeadByte HTTP status:',
        response.statusCode
      );

      console.log(
        'LeadByte response:',
        responseBody
      );

      let parsed;

      try {
        parsed = JSON.parse(responseBody);
      } catch (e) {

        parsed = {
          code:
            response.statusCode >= 200 &&
            response.statusCode < 300
              ? 0
              : -1,

          response: responseBody
        };
      }

      sendJson(res, response.statusCode || 200, {

        ...parsed,

        leadbyte_http_status:
          response.statusCode,

        leadbyte_raw_response:
          responseBody

      });

    });

  });

  request.on('error', error => {

    console.error(
      'LeadByte request error:',
      error.message
    );

    sendJson(res, 502, {

      code: -100,

      response: error.message

    });

  });

  request.write(postData);

  request.end();
}


/*
=========================================================
SERVER
=========================================================
*/

http.createServer((req, res) => {

  res.setHeader(
    'Access-Control-Allow-Origin',
    '*'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );


  /*
  OPTIONS / CORS
  */

  if (req.method === 'OPTIONS') {

    res.writeHead(204);

    res.end();

    return;
  }


  /*
  HEALTH CHECK
  */

  if (req.url === '/health') {

    sendJson(res, 200, {

      status: 'ok',

      service: 'lead-proxy',

      routes: [
        '/submit',
        '/submit-cartrack',
        '/submit-1life',
        '/submit-loans',
        '/submit-carinsurance'
      ]

    });

    return;
  }


  /*
  =======================================================
  FLEXICARE
  =======================================================
  */

  if (
    req.url === '/submit' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const data = JSON.parse(body);

        const incoming = getIncoming(data);

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
          incoming.firstname || ''
        );

        p.append(
          'lastname',
          incoming.lastname || ''
        );

        p.append(
          'phone1',
          incoming.phone ||
          incoming.phone1 ||
          ''
        );

        p.append(
          'email',
          incoming.email || ''
        );

        p.append(
          'optinurl',
          incoming.optinurl ||
          'http://tracking.affcoza.com/aff_c?offer_id=3066&aff_id=25393'
        );

        p.append(
          'optindate',
          incoming.optindate ||
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

      } catch (error) {

        sendJson(res, 400, {

          code: -100,

          response: error.message

        });

      }

    });

    return;
  }


  /*
  =======================================================
  CARTRACK CAMERAS
  OFFER 3046
  =======================================================
  */

  if (
    req.url === '/submit-cartrack' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const data = JSON.parse(body);

        const incoming = getIncoming(data);

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

        const firstName =
          String(
            incoming.firstname ||
            incoming.First_Name ||
            ''
          ).trim();

        const lastName =
          String(
            incoming.lastname ||
            incoming.Last_Name ||
            ''
          ).trim();

        const phone =
          String(
            incoming.phone1 ||
            incoming.phone ||
            incoming.CellNumber ||
            ''
          ).trim();

        p.append(
          'First_Name',
          firstName
        );

        p.append(
          'Last_Name',
          lastName
        );

        p.append(
          'CellNumber',
          phone
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
          incoming.acceptterms !== undefined
            ? String(incoming.acceptterms)
            : 'true'
        );

        p.append(
          'offer_id',
          '3046'
        );

        console.log(
          'CarTrack submission:',
          Object.fromEntries(p)
        );

        postToLeadbyte(
          p.toString(),
          res
        );

      } catch (error) {

        console.error(
          'CarTrack error:',
          error.message
        );

        sendJson(res, 400, {

          code: -100,

          response: error.message

        });

      }

    });

    return;
  }


  /*
  =======================================================
  1LIFE LIFE COVER
  OFFER 2807
  SID 25393
  CAMPAIGN LIFE-COVER
  =======================================================
  */

  if (
    req.url === '/submit-1life' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const data = JSON.parse(body);

        const incoming = getIncoming(data);

        const p = new URLSearchParams();


        /*
        FIXED CAMPAIGN SETTINGS
        */

        p.append(
          'campid',
          'LIFE-COVER'
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
          'offer_id',
          '2807'
        );


        /*
        BASIC LEAD INFORMATION
        */

        p.append(
          'firstname',
          String(
            incoming.firstname || ''
          ).trim()
        );

        p.append(
          'lastname',
          String(
            incoming.lastname || ''
          ).trim()
        );

        p.append(
          'phone1',
          String(
            incoming.phone1 ||
            incoming.phone ||
            ''
          ).trim()
        );

        p.append(
          'email',
          String(
            incoming.email || ''
          ).trim()
        );


        /*
        OPT-IN
        */

        p.append(
          'optinurl',
          String(
            incoming.optinurl ||
            'http://url.com'
          ).trim()
        );

        p.append(
          'optindate',
          String(
            incoming.optindate ||
            getOptinDate()
          ).trim()
        );

        p.append(
          'doi',
          incoming.doi !== undefined
            ? String(incoming.doi)
            : 'true'
        );


        /*
        ACCEPT TERMS
        */

        p.append(
          'acceptterms',
          incoming.acceptterms !== undefined
            ? String(incoming.acceptterms)
            : 'true'
        );


        /*
        INCOME BRACKET
        */

        if (
          incoming.incomebracket
        ) {

          p.append(
            'incomebracket',
            String(
              incoming.incomebracket
            ).trim()
          );

        }


        /*
        OPTIONAL 1LIFE QUESTIONS
        */

        if (
          incoming.hiv_life_insurance !== undefined
        ) {

          p.append(
            'hiv_life_insurance',
            String(
              incoming.hiv_life_insurance
            )
          );

        }


        if (
          incoming.diabetes_life_insurance !== undefined
        ) {

          p.append(
            'diabetes_life_insurance',
            String(
              incoming.diabetes_life_insurance
            )
          );

        }


        /*
        EMPLOYMENT / CITIZENSHIP
        ONLY SEND IF ACTUALLY PROVIDED
        */

        if (
          incoming.employed !== undefined
        ) {

          p.append(
            'employed',
            String(
              incoming.employed
            )
          );

        }


        if (
          incoming.citizen !== undefined
        ) {

          p.append(
            'citizen',
            String(
              incoming.citizen
            )
          );

        }


        if (
          incoming.sa_citizen !== undefined
        ) {

          p.append(
            'sa_citizen',
            String(
              incoming.sa_citizen
            )
          );

        }


        /*
        LOG THE EXACT PAYLOAD
        */

        console.log(
          '================================'
        );

        console.log(
          '1LIFE SUBMISSION'
        );

        console.log(
          Object.fromEntries(p)
        );

        console.log(
          '================================'
        );


        /*
        SEND TO LEADBYTE
        */

        postToLeadbyte(
          p.toString(),
          res
        );


      } catch (error) {

        console.error(
          '1Life route error:',
          error.message
        );

        sendJson(res, 400, {

          code: -100,

          response: error.message

        });

      }

    });

    return;
  }


  /*
  =======================================================
  LOANS
  =======================================================
  */

  if (
    req.url === '/submit-loans' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const data = JSON.parse(body);

        const incoming =
          getIncoming(data);

        const p =
          new URLSearchParams();

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
          incoming.firstname || ''
        );

        p.append(
          'lastname',
          incoming.lastname || ''
        );

        p.append(
          'phone1',
          incoming.phone ||
          incoming.phone1 ||
          ''
        );

        p.append(
          'email',
          incoming.email || ''
        );

        p.append(
          'optinurl',
          incoming.optinurl ||
          'https://sites.google.com/view/quick-loans-sa/home'
        );

        p.append(
          'optindate',
          incoming.optindate ||
          getOptinDate()
        );

        p.append(
          'idnumber',
          incoming.idnumber ||
          generateSAID()
        );

        p.append(
          'underdebtreview',
          'false'
        );

        p.append(
          'acceptterms',
          'true'
        );

        p.append(
          'netincome',
          incoming.netincome ||
          '15000'
        );

        p.append(
          'offer_id',
          '397'
        );

        postToLeadbyte(
          p.toString(),
          res
        );

      } catch (error) {

        sendJson(res, 400, {

          code: -100,

          response: error.message

        });

      }

    });

    return;
  }


  /*
  =======================================================
  CAR INSURANCE
  =======================================================
  */

  if (
    req.url === '/submit-carinsurance' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const data = JSON.parse(body);

        const incoming =
          getIncoming(data);

        const p =
          new URLSearchParams();

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
          incoming.firstname || ''
        );

        p.append(
          'lastname',
          incoming.lastname || ''
        );

        p.append(
          'phone1',
          incoming.phone ||
          incoming.phone1 ||
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
          'https://sites.google.com/view/car-insurance-sa/home'
        );

        p.append(
          'optindate',
          incoming.optindate ||
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

      } catch (error) {

        sendJson(res, 400, {

          code: -100,

          response: error.message

        });

      }

    });

    return;
  }


  /*
  =======================================================
  UNKNOWN ROUTE
  =======================================================
  */

  sendJson(res, 404, {

    code: 404,

    response: 'not found',

    path: req.url

  });

}).listen(PORT, () => {

  console.log(
    `Lead proxy running on port ${PORT}`
  );

});
