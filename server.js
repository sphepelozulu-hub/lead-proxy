const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}

  if(req.url==='/health'){
    res.writeHead(200,{'Content-Type':'application/json'});
    res.end(JSON.stringify({status:'ok'}));return;
  }

  if(req.url==='/submit' && req.method==='POST'){
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      try{
        const d=JSON.parse(body);
        const p=new URLSearchParams(d.params);
        const path='/integration?slice=670e7dfd0e9f6473807401&'+p.toString();
        console.log('Submitting to path:',path);
        const r=https.request({hostname:'returnxdigital.leadbyte.co.uk',path,method:'GET'},resp=>{
          let rb='';
          resp.on('data',c=>rb+=c);
          resp.on('end',()=>{
            console.log('Response:',rb);
            res.writeHead(200,{'Content-Type':'application/json'});
            try{
              const parsed=JSON.parse(rb);
              res.end(JSON.stringify(parsed));
            }catch(e){
              res.end(JSON.stringify({code:1,response:'OK',leadId:null}));
            }
          });
        });
        r.on('error',e=>{
          console.log('Error:',e.message);
          res.writeHead(500,{'Content-Type':'application/json'});
          res.end(JSON.stringify({code:-100,response:e.message}));
        });
        r.end();
      }catch(e){
        res.writeHead(400,{'Content-Type':'application/json'});
        res.end(JSON.stringify({code:-100,response:e.message}));
      }
    });
    return;
  }
  res.writeHead(404);res.end('not found');
}).listen(PORT,()=>console.log('Proxy running on port '+PORT));
