const http=require('http');const rows={};let down=false;
http.createServer((req,res)=>{
  const u=new URL(req.url,'http://x');const H={'Access-Control-Allow-Origin':'*','Content-Type':'application/json'};
  if(u.pathname==='/toggle'){down=!down;res.writeHead(200,H);return res.end(JSON.stringify({down}));}
  if(u.pathname==='/dump'){res.writeHead(200,H);return res.end(JSON.stringify(rows));}
  if(down){res.writeHead(500,H);return res.end('{}');}
  const cnt=id=>(rows[id]||[]).filter(r=>r.status==='new').length;
  if(req.method==='GET'){res.writeHead(200,H);const a=u.searchParams.get('action');
    return res.end(JSON.stringify(a==='ping'?{ok:true}:{ok:true,count:cnt(u.searchParams.get('eventId'))}));}
  let b='';req.on('data',d=>b+=d);req.on('end',()=>{const x=JSON.parse(b);const L=rows[x.eventId]=rows[x.eventId]||[];const r=x.record;
    res.writeHead(200,H);
    if(L.find(o=>o.id===r.id))return res.end(JSON.stringify({ok:true,status:'new',count:cnt(x.eventId)}));
    if(L.find(o=>o.phone===r.phone||o.email===r.email))return res.end(JSON.stringify({ok:false,duplicate:true,count:cnt(x.eventId)}));
    const st=x.capacity&&cnt(x.eventId)>=x.capacity?'waitlist':'new';L.push({...r,status:st});
    res.end(JSON.stringify({ok:true,status:st,count:cnt(x.eventId)}));});
}).listen(8787);
