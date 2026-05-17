const http = require('http');
const https = require('https');
const url = require('url');
const qs = require('querystring');
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  const parsed = url.parse(req.url, true);
  if (parsed.pathname === '/health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status: 'ok'})); return;
  }
  if (parsed.pathname === '/submit') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const params = new URLSearchParams(data.params);
        const targetUrl = data.url + '&' + params.toString();
        const options = {
          hostname: 'returnxdigital.leadbyte.co.uk',
          path: '/integration?' + params.toString() + '&slice=670e7dfd0e9f6473807401',
          method: 'GET'
        };
        if (data.campaign === 'cartrack') {
          options.path = '/api/submit.php';
          options.method = 'POST';
          options.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        }
        const preq = https.request(options, pres => {
          let rbody = '';
          pres.on('data', c => rbody += c);
          pres.on('end', () => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            try { res.end(rbody); } catch(e) { res.end(JSON.stringify({code:1,response:'OK'})); }
          });
        });
        preq.on('error', e => {
          res.writeHead(500, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({code: -100, response: e.message}));
        });
        if (options.method === 'POST') preq.write(params.toString());
        preq.end();
      } catch(e) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({code: -100, response: e.message}));
      }
    });
    return;
  }
  res.writeHead(404); res.end();
});
server.listen(PORT, () => console.log('Server running at http://localhost:' + PORT + '/'));