const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}

  // Health check
  if(req.url==='/health'){
    res.writeHead(200,{'Content-Type':'application/json'});
    res.end(JSON.stringify({status:'ok'}));return;
  }

  // ── FLEXICARE ─────────────────────────────────────────────────────
  if(req.url==='/submit' && req.method==='POST'){
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      try{
        const d=JSON.parse(body);
        const now=new Date();
        const dd=now.getDate().toString().padStart(2,'0');
        const mm=(now.getMonth()+1).toString().padStart(2,'0');
        const yyyy=now.getFullYear();
        const hh=now.getHours().toString().padStart(2,'0');
        const mi=now.getMinutes().toString().padStart(2,'0');
        const ss=now.getSeconds().toString().padStart(2,'0');
        const optindate=`${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
        const p=new URLSearchParams();
        p.append('campid','MEDICAL-WHITE-LABEL');
        p.append('sid','25393');
        p.append('returnjson','yes');
        p.append('firstname',d.params.firstname||'');
        p.append('lastname',d.params.lastname||'');
        p.append('phone1',d.params.phone||'');
        p.append('email',d.params.email||'');
        p.append('optinurl',d.params.optinurl||'http://tracking.affcoza.com/aff_c?offer_id=3066&aff_id=25393');
        p.append('optindate',optindate);
        p.append('doi','true');
        p.append('acceptterms','true');
        p.append('age_range','25 - 34');
        p.append('income_range','R10 000 - R15 000');
        p.append('offer_id','2514');
        const postData=p.toString();
        const options={
          hostname:'returnxdigital.leadbyte.co.uk',
          path:'/api/submit.php',
          method:'POST',
          headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':Buffer.byteLength(postData)
          }
        };
        const r=https.request(options,resp=>{
          let rb='';
          resp.on('data',c=>rb+=c);
          resp.on('end',()=>{
            console.log('Flexicare response:',rb);
            res.writeHead(200,{'Content-Type':'application/json'});
            try{res.end(JSON.stringify(JSON.parse(rb)));}
            catch(e){res.end(JSON.stringify({code:1,response:'OK',leadId:null}));}
          });
        });
        r.on('error',e=>{
          console.log('Flexicare error:',e.message);
          res.writeHead(500,{'Content-Type':'application/json'});
          res.end(JSON.stringify({code:-100,response:e.message}));
        });
        r.write(postData);
        r.end();
      }catch(e){
        res.writeHead(400,{'Content-Type':'application/json'});
        res.end(JSON.stringify({code:-100,response:e.message}));
      }
    });
    return;
  }

  // ── CARTRACK ──────────────────────────────────────────────────────
  if(req.url==='/submit-cartrack' && req.method==='POST'){
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      try{
        const d=JSON.parse(body);
        const p=d.params;
        const postData=new URLSearchParams(p).toString();
        const options={
          hostname:'returnxdigital.leadbyte.co.uk',
          path:'/api/submit.php',
          method:'POST',
          headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':Buffer.byteLength(postData)
          }
        };
        const r=https.request(options,resp=>{
          let rb='';
          resp.on('data',c=>rb+=c);
          resp.on('end',()=>{
            console.log('CarTrack response:',rb);
            res.writeHead(200,{'Content-Type':'application/json'});
            try{res.end(JSON.stringify(JSON.parse(rb)));}
            catch(e){res.end(JSON.stringify({code:1,response:'OK',leadId:null}));}
          });
        });
        r.on('error',e=>{
          console.log('CarTrack error:',e.message);
          res.writeHead(500,{'Content-Type':'application/json'});
          res.end(JSON.stringify({code:-100,response:e.message}));
        });
        r.write(postData);
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
