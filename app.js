/* Grindstone static coach library. No accounts, trackers, or build dependencies. */
(() => {
"use strict";
const D=window.GRINDSTONE, main=document.getElementById("main");
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const arr=v=>Array.isArray(v)?v:[v].filter(Boolean);
const ext=(url,label,cls="")=>'<a class="'+cls+'" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+label+' <span aria-hidden="true">↗</span></a>';
const byId=Object.fromEntries([...D.moves,...D.games].map(x=>[x.id,x]));
let saved=new Set();try{saved=new Set(JSON.parse(localStorage.getItem("grindstone-saved")||"[]"));}catch{}
let toastTimer;
const tierClass=t=>String(t).toLowerCase();
const badge=(s,c="")=>'<span class="badge '+c+'">'+esc(s)+'</span>';
const saveButton=id=>'<button class="save-button" data-save="'+id+'" aria-label="'+(saved.has(id)?'Unsave ':'Save ')+esc(byId[id]?.name||id)+'" aria-pressed="'+saved.has(id)+'">'+(saved.has(id)?'★':'☆')+'</button>';
const linked=s=>esc(s).replace(/\b([PBA]\d{2}|G\d{2})\b/g,id=>byId[id]?'<a class="inline-id" href="#'+(id[0]==="G"?"game":"move")+'/'+id+'" title="'+esc(byId[id].name)+'">'+id+'</a>':id);
const section=(title,body,cls="")=>'<section class="panel '+cls+'"><h2>'+title+'</h2>'+body+'</section>';
const p=s=>'<p>'+linked(s)+'</p>';
const pageTitle=(eyebrow,title,copy)=>'<div class="page-title"><p class="eyebrow">'+eyebrow+'</p><h1>'+title+'</h1><p>'+copy+'</p></div>';
function note(text){return '<div class="note">'+text+'</div>';}
function route(){const raw=location.hash.slice(1)||"home", parts=raw.split("?");return {path:parts[0],params:new URLSearchParams(parts[1]||"")};}
function videoFor(id){return D.videos[id];}
function videoPanel(id){
 const record=videoFor(id),v=record?.video; const yt=v&&/youtube\.com|youtu\.be/.test(v.url);
 if(!v)return section("Demonstration",'<p class="small-copy">'+esc(record?.note||'This activity needs a coach-led demonstration. No suitable public clip was verified. Use the complete written rules and demonstrate the selected version before play.')+'</p>',"video-card");
 return section("Watch the movement",badge(v.format==="short"||v.format==="shorts"?"YouTube Short":(yt?"YouTube video":"Video lesson"),v.format.includes("short")?"shorts":"")+'<h3>'+esc(v.title)+'</h3><p>'+esc(v.channel||"Original publisher")+'</p>'+ext(v.url,yt?"Watch on YouTube":"Watch demonstration","button")+'<p style="margin-top:15px"><strong>'+esc(v.match==="exact"?"Matching technique":v.match==="component"?"Component demonstration":"Related demonstration")+'</strong><br>'+esc(v.note||"Use the written card to confirm this version.")+'</p><details><summary>Video check details</summary><div class="detail-body fine">'+esc(v.verified_by||"Source link and publisher metadata checked; not a frame-by-frame review.")+'</div></details>',"video-card");
}
function usaPanel(id){
 const links=videoFor(id)?.usa_wrestling||[];
 return links.length?section("USA Wrestling",'<ul class="link-list">'+links.map(x=>'<li>'+ext(x.url,esc(x.title))+'</li>').join("")+'</ul><p class="fine">Official reference material. This Grindstone guide may use a simpler progression or a different side.</p>'):"";
}
function moveCard(m){
 const v=videoFor(m.id)?.video;
 return '<article class="card">'+saveButton(m.id)+'<div class="badges">'+badge(m.tier,tierClass(m.tier))+'<span class="id">'+m.id+'</span></div><h3><a href="#move/'+m.id+'">'+esc(m.name)+'</a></h3><p>'+esc(m.purpose)+'</p><div class="card-bottom"><span>'+esc(m.category)+'</span><a class="card-link" href="#move/'+m.id+'">Teach it →</a></div>'+(v&&v.format.includes("short")?'<div style="margin-top:12px">'+badge("Short available","shorts")+'</div>':"")+'</article>';
}
function gameCard(g){
 return '<article class="card">'+saveButton(g.id)+'<div class="badges">'+badge(g.ages.includes("Pup")?"Pup / all ages":g.ages,g.ages.includes("Pup")?"pup":"")+'<span class="id">'+g.id+'</span></div><h3><a href="#game/'+g.id+'">'+esc(g.name)+'</a></h3><p>'+esc(g.format)+'</p><div class="card-bottom"><span>'+esc(g.minutes)+' minutes</span><a class="card-link" href="#game/'+g.id+'">Run the game →</a></div></article>';
}
function practiceCard(x){
 return '<article class="card"><div class="badges">'+badge("Ages "+x.age_group)+'<span class="id">PRACTICE '+String(x.number).padStart(2,"0")+'</span></div><h3><a href="#practice/'+x.age_group+'/'+x.number+'">'+esc(x.title)+'</a></h3><p>'+esc(x.focus)+'</p><div class="card-bottom"><span>'+x.duration+' minutes</span><a class="card-link" href="#practice/'+x.age_group+'/'+x.number+'">Open plan →</a></div></article>';
}
function home(){
 return '<section class="hero"><div><p class="eyebrow">THE GRINDSTONE COACH LIBRARY</p><h1>Show up ready.<br>Coach with purpose.</h1><p>Your practices, teaching cues, demonstrations, and games. Together in one place, ready for the mat.</p><div class="buttons"><a class="button light" href="#practices">Find a practice <span aria-hidden="true">→</span></a><a class="button outline" href="#moves">Explore the moves</a></div></div><div class="mat-art" aria-hidden="true"><img src="assets/grindstone-logo.png" alt=""><span class="mat-line"></span></div></section><div class="stats"><div class="stat"><strong>90</strong><span>ready-to-run practices</span></div><div class="stat"><strong>72</strong><span>move guides</span></div><div class="stat"><strong>'+D.games.length+'</strong><span>practice-ending games</span></div><div class="stat"><strong>3</strong><span>age groups</span></div></div><div class="section-head"><div><p class="eyebrow">START WITH YOUR GROUP</p><h2>A place for every stage.</h2></div></div><div class="grid">'+[
 ["4-6","Discover & play","Movement, confidence, personal space, and a first welcome to wrestling.","pup","35"],
 ["7-10","Build the foundations","Simple connected skills, cooperative partners, and plenty of useful practice.","","60"],
 ["11-14","Connect & choose","Refine the basics, read a reaction, and choose the next action.","advanced","75"]
 ].map(([age,title,copy,cl,dur])=>'<article class="card pathway '+cl+'"><p class="eyebrow">AGES</p><div class="age">'+age.replace("-","–")+'</div><h3>'+title+'</h3><p>'+copy+'</p><div class="card-bottom"><span>30 plans · '+dur+' minutes</span><a href="#practices?age='+age+'" class="card-link">View plans →</a></div></article>').join("")+'</div>'+note('<strong>Age organizes the practice. Readiness guides the move.</strong> Pup, Beginner, and Advanced are teaching tiers. Check each move’s prerequisites before adding speed, contact, or resistance.')+'<div class="section-head"><div><p class="eyebrow">ON THE MAT</p><h2>Find what you need next.</h2></div></div><div class="grid two"><article class="card"><span class="eyebrow">MOVES & DEMONSTRATIONS</span><h3>One cue. One useful correction.</h3><p>Step-by-step instruction, the words to say, and a demonstration link. Search by name, skill, or the move ID in your binder.</p><a class="card-link" href="#moves">Open the move library →</a></article><article class="card"><span class="eyebrow">FINISH TOGETHER</span><h3>End practice with a game.</h3><p>Choose by group and time. Every game includes setup, rules, equipment, variations, and the boundaries to coach.</p><a class="card-link" href="#games">Find an end-of-practice game →</a></article></div><div class="section-head"><h2>Still like a binder?</h2><a href="#downloads">All downloads →</a></div>'+note('<strong>The complete print library is here too.</strong> The original binder is 208 pages / 104 sheets. Add the <a href="downloads/team-games.pdf" target="_blank" rel="noopener">eight-page extra games addendum ↗</a> after page 208 for 108 sheets total. Print Letter, double-sided, flip on the long edge, at 100%. <a href="downloads/coaching-binder.pdf" target="_blank" rel="noopener">Open the binder ↗</a>');
}
function filters(kind,params){
 const q=params.get("q")||"",age=params.get("age")||"",tier=params.get("tier")||"";
 return '<form class="filters" id="filter-form" role="search"><div class="field search"><label for="search">Search '+kind+'</label><input id="search" type="search" name="q" value="'+esc(q)+'" placeholder="'+(kind==="moves"?"Name, move ID, position, or coaching cue…":kind==="games"?"Name, game ID, or equipment…":"Theme, practice number, or move ID…")+'"></div>'+
 (kind==="moves"?'<div class="field"><label for="tier">Teaching tier</label><select id="tier" name="tier"><option value="">All tiers</option>'+["Pup","Beginner","Advanced"].map(t=>'<option '+(tier===t?"selected ":"")+'value="'+t+'">'+t+'</option>').join("")+'</select></div><div class="field"><label for="video">Video format</label><select id="video" name="video"><option value="">All demonstrations</option><option value="shorts" '+(params.get("video")==="shorts"?"selected":"")+'>YouTube Shorts</option></select></div>':
 '<div class="field"><label for="age">Age group</label><select id="age" name="age"><option value="">All groups</option>'+["4-6","7-10","11-14"].map(a=>'<option value="'+a+'" '+(age===a?"selected":"")+'>Ages '+a+'</option>').join("")+'</select></div>'+
 (kind==="games"?'<div class="field"><label for="minutes">Time available</label><select id="minutes" name="minutes"><option value="">Any length</option><option value="4" '+(params.get("minutes")==="4"?"selected":"")+'>Up to 4 minutes</option><option value="5" '+(params.get("minutes")==="5"?"selected":"")+'>Up to 5 minutes</option><option value="6" '+(params.get("minutes")==="6"?"selected":"")+'>Up to 6 minutes</option></select></div>':""))+'<button class="button outline" type="reset">Reset</button></form>';
}
function listing(kind,params){
 let title,copy;
 if(kind==="moves"){title="The move library.";copy="Clear steps, words that work, and demonstrations for every teaching tier. Search the move IDs printed in your binder.";}
 if(kind==="games"){title="Finish on a good note.";copy="Thirty original Grindstone games plus seven additions: two team favorites and five coaching adaptations, with the setup and rules ready to go. Related video demonstrations show a component or similar activity; the written game remains the guide.";}
 if(kind==="practices"){title="Your next practice, ready.";copy="Thirty complete plans for each age group. Choose a session, check the prerequisites, and open the linked moves as you coach.";}
 return pageTitle("COACH LIBRARY",title,copy)+filters(kind,params)+'<p id="result-count" class="result-count" role="status" aria-live="polite"></p><div id="results" class="grid"></div>';
}
function updateResults(kind,params){
 let list=kind==="moves"?D.moves:kind==="games"?D.games:D.practices;
 const q=(params.get("q")||"").toLowerCase().trim(),age=params.get("age"),tier=params.get("tier");
 list=list.filter(x=>{
 if(q&&!JSON.stringify({...x,old_name:D.research[x.id]?.original_name}).toLowerCase().includes(q))return false;
 if(tier&&x.tier!==tier)return false;
 if(age&&kind==="practices"&&x.age_group!==age)return false;
 if(age&&kind==="games"&&!(x.age_groups?x.age_groups.includes(age):((age==="4-6"&&x.id<="G10")||(age==="7-10"&&x.id<="G20")||(age==="11-14"))))return false;
 if(params.get("video")==="shorts"&&!videoFor(x.id)?.video?.format?.includes("short"))return false;
 if(params.get("minutes")&&Number(x.minutes)>Number(params.get("minutes")))return false;
 return true;
 });
 document.getElementById("results").innerHTML=list.length?list.map(kind==="moves"?moveCard:kind==="games"?gameCard:practiceCard).join(""):'<div class="empty"><h2>No matches yet.</h2><p>Try a shorter search or choose another filter.</p><button type="button" class="button outline" data-clear>Clear filters</button></div>';
 document.getElementById("result-count").textContent=list.length+" "+kind+(q?" matching “"+params.get("q")+"”":"")+" · "+(kind==="moves"?"Choose by readiness, then check the specific variation.":kind==="games"?"Everyone stays involved.":"All timings include transitions and rest.");
}
function researchPanel(m){
 const r=D.research[m.id];if(!r)return "";
 const labels={technical_assessment:"Technical assessment",selected_variant:"Selected version",mechanics:"Mechanics",teaching_progression:"Teaching progression",mistakes_and_fixes:"Mistakes and fixes",readiness_and_rules:"Readiness and rules",key_changes:"What changed",source_limits:"Evidence limits"};
 return section("Research & sources",'<details><summary>Read the move-specific research</summary><div class="detail-body">'+Object.entries(labels).filter(([k])=>r.research[k]).map(([k,label])=>'<div class="research-section"><h3>'+label+'</h3>'+(Array.isArray(r.research[k])?'<ul>'+r.research[k].map(s=>'<li>'+linked(s)+'</li>').join("")+'</ul>':p(r.research[k]))+'</div>').join("")+'</div></details><details><summary>Sources ('+r.sources.length+')</summary><ol class="source-list detail-body">'+r.sources.map(s=>'<li>'+ext(s.url,esc(s.title))+'<small>'+esc(s.publisher||"")+' · Checked '+esc(s.accessed||"September 2026")+'</small><small>'+esc(s.inspected||"")+'</small>'+(s.limitations?'<small><strong>Scope:</strong> '+esc(s.limitations)+'</small>':"")+'</li>').join("")+'</ol></details>');
}
function detailHeader(type,id,name,description,badges){
 return '<a class="back" href="#'+type+'">← All '+type+'</a><div class="detail-heading"><div><div class="badges">'+badges+'<span class="id">'+id+'</span></div><h1>'+esc(name)+'</h1><p>'+esc(description)+'</p></div><div class="detail-actions"><button class="button outline" data-print>Print guide</button>'+(videoFor(id)?.video?ext(videoFor(id).video.url,videoFor(id).video.format.includes("short")?"Watch Short":"Watch video","button"):"") +saveButton(id)+'</div></div>';
}
function moveDetail(id){
 const m=byId[id];if(!m||!D.moves.includes(m))return notFound();
 const prerequisites=[...new Set((m.prerequisite.match(/\b[PBA]\d{2}\b/g)||[]))];
 return detailHeader("moves",id,m.name,m.purpose,badge(m.tier,tierClass(m.tier))+badge(m.category))+'<div class="detail-layout"><div>'+section("Before you teach",p(m.prerequisite)+(prerequisites.length?'<div class="chip-links">'+prerequisites.map(i=>'<a href="#move/'+i+'">'+i+' · '+esc(byId[i]?.name||"Open move")+'</a>').join("")+'</div>':""))+section("Teach it step by step",'<ol class="steps">'+m.steps.map(s=>'<li>'+linked(s)+'</li>').join("")+'</ol>')+section("Spot it. Fix it.",'<div class="correction"><div><div class="meta-title">Common mistake</div>'+p(m.error)+'</div><div><div class="meta-title">Try this correction</div>'+p(m.fix)+'</div></div>')+section("Put it into practice",p(m.drill))+section("Coaching boundaries",p(m.boundary))+researchPanel(m)+'</div><aside class="detail-sidebar">'+section("Say this",m.cues.map(s=>'<p class="cue">“'+esc(s)+'”</p>').join(""),"cue-panel")+videoPanel(id)+usaPanel(id)+section("Keep it handy",'<p class="small-copy">Move '+id+' · reference page '+D.move_pages[id]+'.</p><a href="downloads/moves-reference.pdf#page='+D.move_pages[id]+'" target="_blank" rel="noopener">Open the printed move card ↗</a><div class="buttons"><a class="button outline small" href="#practices?q='+id+'">Practices using '+id+'</a></div>')+'</aside></div>';
}
function gameDetail(id){
 const g=byId[id];if(!g||!D.games.includes(g))return notFound();
 const printPage=g.print_page||D.game_pages[id],printPath=g.print_path||"downloads/practice-games.pdf";
 const printCopy=g.binder_page?"Addendum page "+printPage+" · binder page "+g.binder_page:"games reference page "+printPage;
 const provenance=g.team_favorite?'<strong>'+esc(g.origin_label||'Team favorite')+'.</strong> '+esc(g.provenance):'<strong>Original Grindstone game.</strong> Any linked video demonstrates a related activity or movement, not these exact rules. Keep the written setup, contact limits, and participation format.';
 const sources=g.sources?section("Sources & variations",'<ul class="link-list">'+g.sources.map(s=>'<li>'+ext(s.url,esc(s.title))+'<p class="fine">'+esc(s.note)+'</p></li>').join("")+'</ul>'):"";
 return detailHeader("games",id,g.name,g.format,badge(g.ages)+badge((g.team_favorite?"Suggested ":"")+g.minutes+" minutes"))+'<div class="detail-layout"><div>'+section("Set up",'<div class="meta-title">Equipment</div>'+p(g.equipment)+p(g.setup))+section("How to play",p(g.play)+(g.steps?'<ol class="steps">'+g.steps.map(s=>'<li>'+linked(s)+'</li>').join("")+'</ol>':""))+section(g.team_favorite?"Suggested adaptations":"Change it up",p(g.variation))+section("Coach watch",p(g.boundary))+note(provenance)+sources+'</div><aside class="detail-sidebar">'+(g.cues?section("Say this",g.cues.map(s=>'<p class="cue">'+esc(s)+'</p>').join(""),"cue-panel"):"")+videoPanel(id)+usaPanel(id)+section("Print & go",'<p class="small-copy">Game '+id+' · '+printCopy+'.</p><a href="'+printPath+'#page='+printPage+'" target="_blank" rel="noopener">Open the printed game ↗</a>')+'</aside></div>';
}
function practiceDetail(age,num){
 const x=D.practices.find(x=>x.age_group===age&&x.number===Number(num));if(!x)return notFound();
 const ids=[...new Set(JSON.stringify(x).match(/\b[PBA]\d{2}\b/g)||[])].filter(id=>byId[id]);
 let elapsed=0;
 return '<a class="back" href="#practices?age='+age+'">← Ages '+age+' practices</a><div class="detail-heading"><div><div class="badges">'+badge("Ages "+age)+badge(x.duration+" minutes")+'<span class="id">PRACTICE '+String(x.number).padStart(2,"0")+'</span></div><h1>'+esc(x.title)+'</h1><p>'+esc(x.focus)+'</p></div><div class="detail-actions"><button class="button outline" data-print>Print plan</button></div></div><div class="detail-layout"><div>'+section("Get ready",'<div class="meta-title">Set up</div>'+p(x.setup)+'<div class="meta-title">Check first</div>'+p(x.check))+section("Run the practice",x.blocks.map(b=>{let start=elapsed;elapsed+=b.minutes;return '<div class="practice-block"><div class="practice-time">'+start+'–'+elapsed+' MIN · '+b.minutes+' MINUTES</div><h3>'+esc(b.name)+'</h3>'+p(b.instructions)+'</div>';}).join(""))+section("Adapt the challenge",'<div class="meta-title">Make it easier</div>'+p(x.easier)+'<div class="meta-title">Add a challenge</div>'+p(x.harder))+section("Watch & reflect",'<div class="meta-title">Coaching boundaries</div>'+p(x.safety)+'<div class="meta-title">Notice success</div>'+p(x.success)+'<div class="meta-title">Ask the athletes</div>'+p(x.question))+'</div><aside>'+section("Moves in this practice",ids.length?'<ul class="link-list">'+ids.map(id=>'<li><a href="#move/'+id+'">'+id+' · '+esc(byId[id].name)+'</a></li>').join("")+'</ul>':'<p class="small-copy">This session focuses on group routines and movement play. Follow the full activity instructions.</p>')+section("Choose a finish",'<p class="small-copy">Need an alternative ending? Choose a familiar game that fits the group and today’s space.</p><a class="button outline" href="#games?age='+age+'">Browse games</a>')+section("Print this age group",'<a href="downloads/practices-'+age+'.pdf#page='+(x.number+4)+'" target="_blank" rel="noopener">Open the 30-practice book ↗</a><p class="fine" style="margin-top:12px">Print Letter, double-sided, flip on the long edge, at 100%.</p>')+'</aside></div>';
}
function coaching(){
 return pageTitle("THE COACH’S CORNER","Build the whole program.","Practice design, engagement, readiness, parent communication, and club operations. Use the full research and editable planning tools alongside the move library.")+'<div class="grid two">'+D.guides.map(g=>'<article class="card"><p class="eyebrow">'+esc(g.label)+'</p><h3>'+esc(g.title)+'</h3><p>'+esc(g.description)+'</p><a class="card-link" href="#guide/'+g.id+'">Read the guide →</a></article>').join("")+'</div>'+section("Official USA Wrestling resources",'<ul class="link-list">'+D.resources.map(r=>'<li>'+ext(r.url,esc(r.title))+'<p class="fine">'+esc(r.description)+'</p></li>').join("")+'</ul>')+note('<strong>How to read the video links.</strong> We prioritize genuine YouTube Shorts when a suitable demonstration is available. Some cards use a fuller lesson, a component demonstration, or a related variation. The note beside each video explains the fit. Titles, source links, and available publisher metadata were checked; this is not a claim that every clip received a fresh frame-by-frame review. Original research, selected variants, and evidence limits remain on each move page.')+note('<strong>Before practice:</strong> confirm the group’s readiness, space, pairings, stop signal, and applicable club/event requirements. The program blueprint preserves its September 2026 source dates; use the linked official pages to check current requirements.');
}
function guide(id){
 const g=D.guides.find(x=>x.id===id);if(!g)return notFound();
 return '<a class="back" href="#coaching">← Coaching resources</a><div class="guide-layout"><aside class="toc"><p class="eyebrow">IN THIS GUIDE</p>'+g.toc.map(h=>'<a href="#guide/'+id+'" data-scroll="'+h.id+'">'+esc(h.title)+'</a>').join("")+'</aside><article class="prose">'+g.html+'</article></div>';
}
function downloads(){
 return pageTitle("TAKE IT WITH YOU","The complete print library.","Download the preserved original binder and archive, then add the separate eight-page extra games addendum: an index and seven ready-to-run game cards.")+note('<strong>Binder print setup:</strong> Letter · 100% scale · double-sided · flip on long edge. The 208-page binder is 104 sheets with alternating binding margins. Append the extra games addendum after page 208 as pages 209-216 (108 sheets total). The original binder, index, and ZIP do not include this addendum. The separate research report stays digital.')+'<div class="grid">'+D.downloads.map(d=>'<article class="card download-card"><div class="badges">'+badge(d.type||"PDF")+(d.pages?'<span class="id">'+d.pages+' PAGES</span>':"")+'</div><h3>'+esc(d.title)+'</h3><p>'+esc(d.description)+'</p><a class="button outline" href="'+esc(d.path)+'" '+(d.type==="ZIP"?"download":'target="_blank" rel="noopener"')+'>Open '+(d.type||"PDF")+' ↗</a></article>').join("")+'</div>';
}
function savedPage(){
 const moves=D.moves.filter(x=>saved.has(x.id)),games=D.games.filter(x=>saved.has(x.id));
 return pageTitle("YOUR MAT-SIDE LIST","Saved for next time.","Tap the star on any move or game to keep it here. This list stays in this browser on this device.")+(moves.length||games.length?(moves.length?'<div class="section-head"><h2>Moves</h2></div><div class="grid">'+moves.map(moveCard).join("")+'</div>':"")+(games.length?'<div class="section-head"><h2>Games</h2></div><div class="grid">'+games.map(gameCard).join("")+'</div>':""):'<div class="empty"><h2>Start with a favorite.</h2><p>Save a move or game with the star button, then come back here before practice.</p><a class="button" href="#moves">Explore moves</a></div>');
}
function notFound(){return pageTitle("COACH LIBRARY","That page isn’t in the playbook.","Use the library navigation to find a move, game, or practice.")+'<a class="button" href="#home">Back to the library</a>';}
function render(){
 const {path,params}=route(),parts=path.split("/");
 let html;
 if(path==="home")html=home();
 else if(["moves","games","practices"].includes(path))html=listing(path,params);
 else if(parts[0]==="move")html=moveDetail(parts[1]);
 else if(parts[0]==="game")html=gameDetail(parts[1]);
 else if(parts[0]==="practice")html=practiceDetail(parts[1],parts[2]);
 else if(path==="coaching")html=coaching();
 else if(parts[0]==="guide")html=guide(parts[1]);
 else if(path==="downloads")html=downloads();
 else if(path==="saved")html=savedPage();
 else html=notFound();
 main.innerHTML=html;
 document.querySelectorAll(".site-header nav a").forEach(a=>{const active=a.getAttribute("href")==="#"+({move:"moves",game:"games",practice:"practices",guide:"coaching"}[parts[0]]||parts[0]);a.classList.toggle("active",active);active?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current");});
 document.getElementById("saved-count").textContent=saved.size;
 if(["moves","games","practices"].includes(path)){updateResults(path,params);const form=document.getElementById("filter-form");form.addEventListener("submit",e=>e.preventDefault());const update=()=>{const next=new URLSearchParams();new FormData(form).forEach((v,k)=>{if(v)next.set(k,v);});history.replaceState(null,"","#"+path+(next.size?"?"+next:""));updateResults(path,next);};form.addEventListener("input",update);form.addEventListener("change",update);form.addEventListener("reset",()=>setTimeout(()=>{form.querySelectorAll("input,select").forEach(el=>el.value="");update();},0));}
 document.title=(main.querySelector("h1")?.textContent||"Coach Library")+" | Grindstone Wrestling";
 window.scrollTo({top:0,behavior:"instant"});
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-save]");if(b){const id=b.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem("grindstone-saved",JSON.stringify([...saved]));}catch{}b.setAttribute("aria-pressed",saved.has(id));b.setAttribute("aria-label",(saved.has(id)?"Unsave ":"Save ")+(byId[id]?.name||id));b.textContent=saved.has(id)?"★":"☆";document.getElementById("saved-count").textContent=saved.size;const t=document.getElementById("toast");t.textContent=saved.has(id)?"Saved for next time":"Removed from saved";t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1800);if(route().path==="saved")render();}
 if(e.target.closest("[data-print]"))window.print();
 if(e.target.closest("[data-clear]"))document.getElementById("filter-form")?.reset();
 const scroll=e.target.closest("[data-scroll]");if(scroll){e.preventDefault();document.getElementById(scroll.dataset.scroll)?.scrollIntoView({behavior:"smooth"});}
});
window.addEventListener("hashchange",render);render();
})();