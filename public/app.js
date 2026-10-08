const BOT_LINK="https://t.me/YOUR_BOT/YOUR_APP";
const tg=window.Telegram&&Telegram.WebApp;if(tg){tg.ready();tg.expand();tg.setHeaderColor&&tg.setHeaderColor("#0f0d2e");tg.setBackgroundColor&&tg.setBackgroundColor("#0f0d2e")}
const $=i=>document.getElementById(i),R=a=>a[Math.random()*a.length|0],S=a=>[...a].sort(()=>Math.random()-.5);
const C=["Қазақстан","Türkiye","Brasil","India","Россия","O‘zbekiston","USA","Deutschland","España","Other"];
let me={total:0,streak:0,wins:0,country:C[0]},mode="duel",G,tm,tab="p",last={players:[],countries:[]};
try{Object.assign(me,JSON.parse(localStorage.ld||"{}"))}catch{}
$("country").innerHTML=C.map(c=>`<option>${c}</option>`).join("");$("country").value=me.country;
const view=id=>["home","game","end"].forEach(x=>$(x).classList.toggle("hide",x!==id));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function paint(){$("sT").textContent=me.total;$("sS").textContent=me.streak||0;$("sW").textContent=me.wins||0;
 const l=me.total/200|0;$("lv").style.width=(me.total%200)/2+"%";$("lvt").textContent=`Деңгей ${l+1} · келесіге ${200-me.total%200} ұпай`;
 $("lb").innerHTML=tab==="p"?last.players.map((p,i)=>`<div class="row"><span>${i+1}. ${esc(p.name)} <span class="mut">${esc(p.country)}</span></span><b>${p.total}</b></div>`).join("")
 :last.countries.map((c,i)=>`<div class="row"><span>${i+1}. ${esc(c[0])}</span><b>${c[1]}</b></div>`).join("");
 if(!$("lb").innerHTML)$("lb").innerHTML='<div class="mut">Әзірге бос. Бірінші бол!</div>'}
async function sync(body){
 if(!tg||!tg.initData)return;
 try{const r=await fetch("/api/sync",{method:"POST",headers:{"x-init":tg.initData,"content-type":"application/json"},body:JSON.stringify({country:me.country,...body})});
  if(r.ok){const j=await r.json();Object.assign(me,j.me);last=j}}catch{}
 localStorage.ld=JSON.stringify(me);paint()}
function start(m){mode=m;me.country=$("country").value;const n=m==="duel"?5:10;
 G={i:0,a:0,b:0,ok:0,miss:[],acc:.55+Math.random()*.3,qs:S(WORDS).slice(0,n).map(w=>({w:w[0],t:w[1],o:S([w[1],...S(WORDS.filter(x=>x[0]!==w[0])).slice(0,3).map(x=>x[1])])}))};
 $("fn").textContent=m==="duel"?"🤖 "+R(["Aylin","Carlos","Aman","Mei","Ravi"]):"";$("b").textContent=m==="duel"?0:"";view("game");ask()}
function ask(){const q=G.qs[G.i];G.t0=Date.now();G.done=0;$("q").textContent=`${G.i+1}/${G.qs.length}`;
 $("w").textContent=q.w;$("a").textContent=G.a;if(mode==="duel")$("b").textContent=G.b;
 $("tug").style.width=mode==="duel"?(G.a+G.b?G.a/(G.a+G.b)*100:50)+"%":"100%";
 $("o").innerHTML="";q.o.forEach(t=>{const b=document.createElement("button");b.className="opt";b.textContent=t;b.onclick=()=>pick(t,b);$("o").appendChild(b)});
 const bar=$("tm");bar.style.transition="none";bar.style.width="100%";requestAnimationFrame(()=>requestAnimationFrame(()=>{bar.style.transition="width 10s linear";bar.style.width="0"}));
 clearTimeout(tm);tm=setTimeout(()=>pick(null),10000)}
function pick(t,btn){if(G.done)return;G.done=1;clearTimeout(tm);const q=G.qs[G.i],ok=t===q.t,s=(Date.now()-G.t0)/1e3;
 if(ok){G.a+=10+Math.max(0,10-s|0);G.ok++;tg&&tg.HapticFeedback&&tg.HapticFeedback.impactOccurred("light")}else{G.miss.push(q);tg&&tg.HapticFeedback&&tg.HapticFeedback.notificationOccurred("error")}
 if(mode==="duel"&&Math.random()<G.acc)G.b+=10+(Math.random()*8|0);
 btn&&btn.classList.add(ok?"ok":"bad");[...$("o").children].forEach(b=>{b.disabled=1;if(b.textContent===q.t)b.classList.add("ok")});
 $("a").textContent=G.a;if(mode==="duel"){$("b").textContent=G.b;$("tug").style.width=G.a/(G.a+G.b||1)*100+"%"}
 setTimeout(()=>{G.i++;G.i<G.qs.length?ask():finish()},1000)}
function finish(){const win=mode==="duel"?G.a>G.b:G.ok>=7,day=new Date().toISOString().slice(0,10);
 $("r").textContent=mode==="duel"?(win?"🏆 Жеңдің!":G.a===G.b?"🤝 Тең":"Ұтылдың"):`${G.ok}/${G.qs.length} дұрыс`;
 $("d").textContent=`+${G.a} ұпай`;
 $("miss").innerHTML=G.miss.length?'<h2 style="margin-top:14px">Қайталайтын сөздер</h2>'+G.miss.map(q=>`<div class="row"><b>${q.w}</b><span>${q.t}</span></div>`).join(""):"";
 me.total+=G.a;if(win)me.wins++;if(me.last!==day){me.streak=me.last===new Date(Date.now()-864e5).toISOString().slice(0,10)?(me.streak||0)+1:1;me.last=day}
 localStorage.ld=JSON.stringify(me);view("end");sync({played:1,score:G.a,win})}
$("duel").onclick=()=>start("duel");$("train").onclick=()=>start("train");$("again").onclick=()=>start(mode);
$("back").onclick=()=>{view("home");paint()};
$("tp").onclick=()=>{tab="p";$("tp").className="";$("tc").className="ghost";paint()};$("tc").onclick=()=>{tab="c";$("tc").className="";$("tp").className="ghost";paint()};
$("inv").onclick=()=>{const u=`https://t.me/share/url?url=${encodeURIComponent(BOT_LINK)}&text=${encodeURIComponent("Мені Language Duel-да жеңе аласың ба? 🏆 "+me.total+" ұпайым бар")}`;tg?tg.openTelegramLink(u):open(u)};
paint();sync({});
