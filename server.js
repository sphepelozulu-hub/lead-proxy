const http = require('http');
const https = require('https');
const url = require('url');
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  if(req.url==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({status:'ok'}));return;}
  if(req.url.startsWith('/submit') && req.method==='POST'){
    let body='';
    req.on('data',chunk=>body+=chunk);
    req.on('end',()=>{
      try{
        const data=JSON.parse(body);
        const p=new URLSearchParams(data.params);
        const path='/integration?slice=670e7dfd0e9f6473807401&'+p.toString();
        const options={hostname:'returnxdigital.leadbyte.co.uk',path,method:'GET'};
        const preq=https.request(options,pres=>{
          let rb='';
          pres.on('data',c=>rb+=c);
          pres.on('end',()=>{res.writeHead(200,{'Content-Type':'application/json'});res.end(rb||JSON.stringify({code:1,response:'OK'}));});
        });
        preq.on('error',e=>{res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({code:-100,response:e.message}));});
        preq.end();
      }catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({code:-100,response:e.message}));}
    });
    return;
  }
  res.writeHead(404);res.end();
});
server.listen(PORT,()=>console.log('Server running on port '+PORT));
