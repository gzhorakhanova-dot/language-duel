const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const T=process.env.BOT_TOKEN||'',P=process.env.PORT||3000,F=process.env.DATA_FILE||'data.json';
let D={};try{D=JSON.parse(fs.readFileSync(F))}catch{}
let dirty=false;setInterval(()=>{if(dirty){fs.writeFileSync(F,JSON.stringify(D));dirty=false}},3000);
function auth(s){try{const p=new URLSearchParams(s),h=p.get('hash');p.delete('hash');
 const c=[...p.entries()].sort(([a],[b])=>a<b?-1:1).map(([k,v])=>k+'='+v).join('\n');
 const k=crypto.createHmac('sha256','WebAppData').update(T).digest();
 if(crypto.createHmac('sha256',k).update(c).digest('hex')!==h)return null;
 if(Date.now()/1e3-Number(p.get('auth_date'))>86400)return null;
 return JSON.parse(p.get('user'))}catch{return null}}
const day=(o=0)=>new Date(Date.now()-o*864e5).toISOString().slice(0,10);
function top(){const pl=Object.values(D).sort((a,b)=>b.total-a.total).slice(0,10).map(({name,country,total})=>({name,country,total}));
 const c={};Object.values(D).forEach(u=>c[u.country]=(c[u.country]||0)+u.total);
 return{players:pl,countries:Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,10)}}
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript'};
http.createServer((req,res)=>{
 if(req.method==='POST'&&req.url==='/api/sync'){let b='';req.on('data',d=>{b+=d;if(b.length>1e4)req.destroy()});
  req.on('end',()=>{const u=auth(req.headers['x-init']||'');if(!u){res.writeHead(401);return res.end()}
   let q={};try{q=JSON.parse(b)}catch{}
   const id=String(u.id),r=D[id]||(D[id]={name:'',country:'Қазақстан',total:0,streak:0,last:'',games:0,wins:0,best:0});
   r.name=(u.first_name||'Player').slice(0,20);if(q.country)r.country=String(q.country).slice(0,20);
   const s=Math.max(0,Math.min(100,Number(q.score)||0));
   if(q.played){r.total+=s;r.games++;if(q.win)r.wins++;r.best=Math.max(r.best,s);
    const t=day();if(r.last!==t){r.streak=r.last===day(1)?r.streak+1:1;r.last=t}}
   dirty=true;res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify({me:r,...top()}))});return}
 const f=req.url==='/'||req.url.startsWith('/?')?'index.html':req.url.slice(1).split('?')[0];
 const fp=path.join(__dirname,'public',path.basename(f));
 fs.readFile(fp,(e,d)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(fp)]||'text/plain'});res.end(d)})
}).listen(P,()=>console.log('Language Duel on :'+P));
