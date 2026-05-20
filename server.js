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

  function postToLeadbyte(postData, res){
    const options={
      hostname:'returnxdigital.leadbyte.co.uk',
      path:'/api/submit.php',
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded','Content-Length':Buffer.byteLength(postData)}
    };
    const r=https.request(options,resp=>{
      let rb='';
      resp.on('data',c=>rb+=c);
      resp.on('end',()=>{
        console.log('Response:',rb);
        res.writeHead(200,{'Content-Type':'application/json'});
        try{res.end(JSON.stringify(JSON.parse(rb)));}
        catch(e){res.end(JSON.stringify({code:1,response:'OK',leadId:null}));}
      });
    });
    r.on('error',e=>{
      res.writeHead(500,{'Content-Type':'application/json'});
      res.end(JSON.stringify({code:-100,response:e.message}));
    });
    r.write(postData);r.end();
  }

  function getOptinDate(){
    const now=new Date();
    const dd=now.getDate().toString().padStart(2,'0');
    const mm=(now.getMonth()+1).toString().padStart(2,'0');
    const yyyy=now.getFullYear();
    const hh=now.getHours().toString().padStart(2,'0');
    const mi=now.getMinutes().toString().padStart(2,'0');
    const ss=now.getSeconds().toString().padStart(2,'0');
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
  }

  // Generate valid SA ID number
  function generateSAID(){
    const year=String(45+Math.floor(Math.random()*20)).padStart(2,'0'); // age 25-55
    const month=String(1+Math.floor(Math.random()*12)).padStart(2,'0');
    const day=String(1+Math.floor(Math.random()*28)).padStart(2,'0');
    const seq=String(Math.floor(Math.random()*5000)).padStart(4,'0');
    const partial=`${year}${month}${day}${seq}08`;
    // Luhn checksum
    let sum=0;
    for(let i=0;i<partial.length;i++){
      let d=parseInt(partial[partial.length-1-i]);
      if(i%2===1){d*=2;if(d>9)d-=9;}
      sum+=d;
    }
    const check=(10-(sum%10))%10;
    return partial+check;
  }

  function readBody(req, cb){
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',()=>cb(body));
  }

  // ── FLEXICARE ─────────────────────────────────────────────
  if(req.url==='/submit' && req.method==='POST'){
    readBody(req, body=>{
      try{
        const d=JSON.parse(body);
        const p=new URLSearchParams();
        p.append('campid','MEDICAL-WHITE-LABEL');
        p.append('sid','25393');
        p.append('returnjson','yes');
        p.append('firstname',d.params.firstname||'');
        p.append('lastname',d.params.lastname||'');
        p.append('phone1',d.params.phone||'');
        p.append('email',d.params.email||'');
        p.append('optinurl',d.params.optinurl||'http://tracking.affcoza.com/aff_c?offer_id=3066&aff_id=25393');
        p.append('optindate',getOptinDate());
        p.append('doi','true');
        p.append('acceptterms','true');
        p.append('age_range','25 - 34');
        p.append('income_range','R10 000 - R15 000');
        p.append('offer_id','2514');
        postToLeadbyte(p.toString(), res);
      }catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({code:-100,response:e.message}));}
    });
    return;
  }

  // ── CARTRACK ──────────────────────────────────────────────
  if(req.url==='/submit-cartrack' && req.method==='POST'){
    readBody(req, body=>{
      try{
        const d=JSON.parse(body);
        const p=new URLSearchParams(d.params);
        postToLeadbyte(p.toString(), res);
      }catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({code:-100,response:e.message}));}
    });
    return;
  }

  // ── LOANS ─────────────────────────────────────────────────
  if(req.url==='/submit-loans' && req.method==='POST'){
    readBody(req, body=>{
      try{
        const d=JSON.parse(body);
        const p=new URLSearchParams();
        p.append('campid','KONGA');
        p.append('sid','25393');
        p.append('returnjson','yes');
        p.append('firstname',d.params.firstname||'');
        p.append('lastname',d.params.lastname||'');
        p.append('phone1',d.params.phone||'');
        p.append('email',d.params.email||'');
        p.append('optinurl',d.params.optinurl||'https://sites.google.com/view/quick-loans-sa/home');
        p.append('optindate',getOptinDate());
        p.append('idnumber',d.params.idnumber||generateSAID());
        p.append('underdebtreview','false');
        p.append('acceptterms','true');
        p.append('netincome',d.params.netincome||'15000');
        p.append('offer_id','397');
        postToLeadbyte(p.toString(), res);
      }catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({code:-100,response:e.message}));}
    });
    return;
  }

  res.writeHead(404);res.end('not found');
}).listen(PORT,()=>console.log('Proxy running on port '+PORT));
