/* Grindstone static coach library. No accounts, trackers, or build dependencies. */
(() => {
"use strict";
const T=window.GRINDSTONE_TAGS, D=window.GRINDSTONE, V=window.GRINDSTONE_VIDEO_ADDITIONS||{entries:[],categories:[]}, I=window.GRINDSTONE_KYLE_INSTRUCTION||{entries:{}}, C=window.GRINDSTONE_COACHES||{profiles:[],supporters:[]}, S=window.GRINDSTONE_SPONSORS||{sponsors:[]}, K=window.GRINDSTONE_KYLE||{categories:[],entries:[]}, F=window.GRINDSTONE_FAMILY||{pages:[],faq:[],downloads:[]}, main=document.getElementById("main");
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const arr=v=>Array.isArray(v)?v:[v].filter(Boolean);
const ext=(url,label,cls="")=>'<a class="'+cls+'" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+label+' <span aria-hidden="true">↗</span></a>';
const byId=Object.fromEntries([...D.moves,...D.games].map(x=>[x.id,x]));
const practiceSaveId=x=>"practice:"+x.age_group+":"+x.number;
const saveRecords=Object.fromEntries([
 ...D.moves.map(x=>[x.id,{name:x.name}]),...D.games.map(x=>[x.id,{name:x.name}]),
 ...D.practices.map(x=>[practiceSaveId(x),{name:x.title+", ages "+x.age_group+", practice "+x.number}]),
 ...(K.entries||[]).map(x=>["kyle:"+x.id,{name:x.name}]),
 ...(V.entries||[]).map(x=>["facebook:"+x.id,{name:x.title}])
]);
let saved=new Set(),storageAvailable=true;
try{const ids=JSON.parse(localStorage.getItem("grindstone-saved")||"[]");saved=new Set((Array.isArray(ids)?ids:[]).filter(id=>Object.hasOwn(saveRecords,id)));}catch{storageAvailable=false;}
let toastTimer;
const tierClass=t=>String(t).toLowerCase();
const badge=(s,c="")=>'<span class="badge '+c+'">'+esc(s)+'</span>';
const saveButton=id=>'<button type="button" class="save-button" data-save="'+esc(id)+'" aria-label="'+(saved.has(id)?'Unsave ':'Save ')+esc(saveRecords[id]?.name||id)+'" aria-pressed="'+saved.has(id)+'">'+(saved.has(id)?'★':'☆')+'</button>';
const filterBadges=entry=>(entry.unassigned_filters||[]).map(label=>badge(label+" not assigned","unassigned")).join("");
function updateSavedCount(){const count=document.getElementById("saved-count");count.textContent=saved.size;document.querySelector(".saved-nav")?.setAttribute("aria-label","Saved items, "+saved.size);}
const linked=s=>esc(s).replace(/\b([PBA]\d{2}|G\d{2})\b/g,id=>byId[id]?'<a class="inline-id" href="#'+(id[0]==="G"?"game":"move")+'/'+id+'" title="'+esc(byId[id].name)+'">'+id+'</a>':id);
const section=(title,body,cls="")=>'<section class="panel '+cls+'"><h2>'+title+'</h2>'+body+'</section>';
const p=s=>'<p>'+linked(s)+'</p>';
const pageTitle=(eyebrow,title,copy)=>'<div class="page-title"><p class="eyebrow">'+eyebrow+'</p><h1>'+title+'</h1><p>'+copy+'</p></div>';
function note(text){return '<div class="note">'+text+'</div>';}
function route(){const raw=location.hash.slice(1)||"home", parts=raw.split("?");return {path:parts[0],params:new URLSearchParams(parts[1]||"")};}

// One browsing taxonomy across written, Kyle and Facebook entries.
function categoryFor(entry){
 const id=T.entries[entry.id]||entry.category;
 return T.categories.find(c=>c.id===id);
}
function categoryTag(entry){
 const c=categoryFor(entry);if(!c)return "";
 const href=c.id==="games"?"#games":"#moves?category="+encodeURIComponent(c.id);
 return '<a class="badge category-tag" href="'+href+'" aria-label="Browse '+esc(c.label)+'">'+esc(c.label)+'</a>';
}
function categoryOptions(selected,entries){
 return T.categories.filter(c=>entries.some(e=>categoryFor(e)?.id===c.id)).map(c=>'<option value="'+c.id+'" '+(selected===c.id?'selected':'')+'>'+esc(c.label)+'</option>').join("");
}
function kyleBrowseCategories(){return T.categories.filter(c=>(K.entries||[]).some(e=>categoryFor(e)?.id===c.id));}

function videoFor(id){return D.videos[id];}
function videoPanel(id){
 const record=videoFor(id),v=record?.video; const yt=v&&/youtube\.com|youtu\.be/.test(v.url);
 if(!v)return section("Demonstration",'<p class="small-copy">'+esc(record?.note||'This activity needs a coach-led demonstration. No suitable public clip was verified. Use the complete written rules and demonstrate the selected version before play.')+'</p>',"video-card");
 return section("Watch the movement",badge(v.format==="short"||v.format==="shorts"?"YouTube Short":(yt?"YouTube video":"Video lesson"),v.format.includes("short")?"shorts":"")+'<h3>'+esc(v.title)+'</h3><p>'+esc(v.channel||"Original publisher")+'</p>'+ext(v.url,yt?"Watch on YouTube":"Watch demonstration","button")+'<p style="margin-top:15px"><strong>'+esc(v.match==="exact"?"Matching technique":v.match==="component"?"Component demonstration":"Related demonstration")+'</strong><br>'+esc(v.note||"Use the written card to confirm this version.")+'</p><details><summary>Video check details</summary><div class="detail-body fine">'+esc(v.verified_by||"Source link and publisher metadata checked; not a frame-by-frame review.")+'</div></details>',"video-card");
}
function variationsFor(id){return (V.entries||[]).filter(v=>v.guide_ids.includes(id));}
function variationSearch(id){return variationsFor(id).map(v=>[v.title,v.publisher,v.relationship,...v.keywords].join(" ")).join(" ");}
function variationLabels(id){
 const items=variationsFor(id);
 return items.length?'<p class="variation-labels"><strong>Related Facebook clips:</strong> '+items.map(v=>'<a href="#moves/videos/'+esc(v.id)+'">'+esc(v.title)+'</a>').join(' · ')+'</p>':"";
}
function variationCategory(id){return T.categories.find(c=>c.id===id)?.label||id;}
function practiceVideoEntries(kind){return (V.entries||[]).filter(v=>!kind||(v.kind||(v.category==="games"?"game":"move"))===kind);}
function variationCard(v,showGuides=false,detail=false){
 const guides=(v.guide_ids||[]).filter(id=>byId[id]);
 const adaptation=v.steps?.length?'<details class="practice-adaptation"'+(detail?' open':'')+'><summary>Coaching steps, cues & age adaptations</summary><div class="detail-body"><p class="fine">'+esc(V.adaptation_note)+'</p><h4>Try this progression</h4><ol class="steps">'+v.steps.map(s=>'<li>'+linked(s)+'</li>').join("")+'</ol><h4>Say this</h4><ul>'+(v.cues||[]).map(s=>'<li>'+esc(s)+'</li>').join("")+'</ul><h4>Adapt for your group</h4><dl class="practice-video-ages">'+Object.entries(v.age_adaptations||{}).map(([age,copy])=>'<div><dt>Ages '+esc(age)+'</dt><dd>'+linked(copy)+'</dd></div>').join("")+'</dl><h4>Coaching boundaries</h4>'+p(v.boundaries)+'</div></details>':'';
 return '<article class="practice-video-card" id="variation-'+esc(v.id)+'">'+saveButton("facebook:"+v.id)+'<div class="badges">'+categoryTag(v)+badge('Facebook clip')+'</div>'+(detail?'':'<h3><a href="#moves/videos/'+esc(v.id)+'">'+esc(v.title)+'</a></h3>')+'<p class="practice-video-publisher">'+esc(v.publisher)+'</p><p>'+esc(v.description||v.observed)+'</p>'+ext(v.url,"Watch this clip on Facebook","button")+(v.focus?.length?'<h4>Coaching focus</h4><ul>'+v.focus.map(s=>'<li>'+linked(s)+'</li>').join('')+'</ul>':'')+adaptation+(!v.steps?.length?'<p class="fine">Video reference. A complete written walkthrough has not yet been verified for this clip.</p>':'')+'<details class="practice-evidence"><summary>Source & review notes</summary><div class="detail-body"><p>'+esc(v.verification)+'</p>'+(v.original_url?ext(v.original_url,'Original link you shared'):'')+'</div></details>'+(showGuides&&guides.length?'<div class="practice-guide-links"><p class="meta-title">Related written guides</p><p>'+esc(v.relationship||'Use these guides for related foundations.')+'</p><div class="chip-links">'+guides.map(id=>'<a href="#'+(id.startsWith("G")?"game":"move")+'/'+id+'">'+id+' · '+esc(byId[id].name)+'</a>').join("")+'</div></div>':"")+'</article>';
}
function practiceVideoDetail(id){
 const v=(V.entries||[]).find(x=>x.id===id);if(!v)return notFound();
 return '<a class="back" href="#moves/videos">← All Facebook clips</a>'+pageTitle('FACEBOOK COLLECTION',esc(v.title),esc(variationCategory(v.category)))+'<div class="practice-video-results">'+variationCard(v,true,true)+'</div>';
}
function practiceVideoLibraryCard(v){
 return '<article class="card">'+saveButton("facebook:"+v.id)+'<div class="badges">'+badge('Facebook clip')+categoryTag(v)+filterBadges(v)+'</div><h3><a href="#moves/videos/'+esc(v.id)+'">'+esc(v.title)+'</a></h3><p>'+esc(v.description||v.observed)+'</p><p class="fine">'+esc(v.publisher)+'</p><div class="buttons"><a class="button outline small" href="#moves/videos/'+esc(v.id)+'">Open drill →</a>'+ext(v.url,'Watch on Facebook','card-link')+'</div></article>';
}
function practiceVariations(id){
 const items=variationsFor(id);if(!items.length)return "";
 return section("Related Facebook drills",'<p>Each clip has its own page and original video link.</p>'+items.map(v=>variationCard(v)).join("")+'<a class="card-link" href="#moves/videos">All Facebook clips →</a>',"practice-variations");
}
function practiceVideoLink(kind){
 return kind==="practices"?"":'<div class="practice-video-link"><p>Explore the Facebook clips shared with the club: drills, games, technique and conditioning.</p><a class="card-link" href="#moves/videos'+(kind==="games"?'?kind=game':'')+'">Facebook collection →</a></div>';
}
function practiceVideoList(params){
 const q=params.get("q")||"",category=params.get("category")||"",kind=params.get("kind")||"";
 return '<a class="back" href="#'+(kind==="game"?"games":"moves")+'">← '+(kind==="game"?"All games":"All moves")+'</a>'+pageTitle("COACH LIBRARY","Facebook collection.",(V.entries||[]).length+' distinct clips shared with Grindstone. Open a drill for its description and coaching notes, or watch the original Facebook clip directly. Repeat submissions appear once.')+'<form id="variation-form" class="filters" role="search"><div class="field search"><label for="variation-search">Search Facebook clips</label><input id="variation-search" name="q" type="search" value="'+esc(q)+'" placeholder="Drill, publisher, guide ID, or keyword…"></div><div class="field"><label for="variation-category">Category</label><select id="variation-category" name="category"><option value="">All categories</option>'+categoryOptions(category,V.entries||[])+'</select></div><div class="field"><label for="variation-kind">Type</label><select id="variation-kind" name="kind"><option value="">Moves & games</option><option value="move" '+(kind==="move"?"selected":"")+'>Moves & drills</option><option value="game" '+(kind==="game"?"selected":"")+'>Games</option></select></div><button class="button outline" type="reset">Reset</button></form><p id="variation-count" class="result-count" role="status" aria-live="polite"></p><div id="variation-results" class="practice-video-results"></div>';
}
function updatePracticeVideos(params){
 const q=(params.get("q")||"").trim().toLowerCase(),category=params.get("category"),kind=params.get("kind");
 const entries=practiceVideoEntries(kind).filter(v=>(!category||v.category===category)&&(!q||[v.id,v.title,v.publisher,v.description,v.relationship,variationCategory(v.category),...(v.keywords||[]),...(v.guide_ids||[]).map(id=>id+" "+(byId[id]?.name||""))].join(" ").toLowerCase().includes(q)));
 document.getElementById("variation-results").innerHTML=entries.length?entries.map(v=>variationCard(v,true)).join(""):'<div class="empty"><h2>No matching clips.</h2><p>Try another keyword or clear a filter.</p><button type="button" class="button outline" data-variation-clear>Clear filters</button></div>';
 document.getElementById("variation-count").textContent=entries.length+(entries.length===1?" Facebook clip":" Facebook clips")+(q?" matching “"+params.get("q")+"”":"");
}
function usaPanel(id){
 const links=videoFor(id)?.usa_wrestling||[];
 return links.length?section("USA Wrestling",'<ul class="link-list">'+links.map(x=>'<li>'+ext(x.url,esc(x.title))+'</li>').join("")+'</ul><p class="fine">Official reference material. This Grindstone guide may use a simpler progression or a different side.</p>'):"";
}
function moveCard(m){
 const v=videoFor(m.id)?.video;
 return '<article class="card">'+saveButton(m.id)+'<div class="badges">'+badge(m.tier,tierClass(m.tier))+badge("Written guide")+filterBadges(m)+'<span class="id">'+m.id+'</span></div><h3><a href="#move/'+m.id+'">'+esc(m.name)+'</a></h3><p>'+esc(m.purpose)+'</p>'+variationLabels(m.id)+'<div class="card-bottom">'+categoryTag(m)+'<a class="card-link" href="#move/'+m.id+'">Teach it →</a></div>'+(v&&v.format.includes("short")?'<div style="margin-top:12px">'+badge("Short available","shorts")+'</div>':"")+'</article>';
}
function gameCard(g){
 return '<article class="card">'+saveButton(g.id)+'<div class="badges">'+badge(g.ages.includes("Pup")?"Pup / all ages":g.ages,g.ages.includes("Pup")?"pup":"")+badge("Written guide")+filterBadges(g)+'<span class="id">'+g.id+'</span></div><h3><a href="#game/'+g.id+'">'+esc(g.name)+'</a></h3><p>'+esc(g.format)+'</p>'+variationLabels(g.id)+'<div class="card-bottom"><span>'+esc(g.minutes)+' minutes</span><a class="card-link" href="#game/'+g.id+'">Run the game →</a></div></article>';
}
function practiceCard(x){
 return '<article class="card">'+saveButton(practiceSaveId(x))+'<div class="badges">'+badge("Ages "+x.age_group)+'<span class="id">PRACTICE '+String(x.number).padStart(2,"0")+'</span></div><h3><a href="#practice/'+x.age_group+'/'+x.number+'">'+esc(x.title)+'</a></h3><p>'+esc(x.focus)+'</p><div class="card-bottom"><span>'+x.duration+' minutes</span><a class="card-link" href="#practice/'+x.age_group+'/'+x.number+'">Open plan →</a></div></article>';
}
function home(){
 return '<section class="hero"><div><p class="eyebrow">THE GRINDSTONE COACH LIBRARY</p><h1>Show up ready.<br>Coach with purpose.</h1><p>Your practices, teaching cues, demonstrations, and games. Together in one place, ready for the mat.</p><div class="buttons"><a class="button light" href="#practices">Find a practice <span aria-hidden="true">→</span></a><a class="button outline" href="#moves">Explore the moves</a></div></div><div class="mat-art" aria-hidden="true"><img src="assets/grindstone-logo.png" alt=""><span class="mat-line"></span></div></section><div class="stats"><div class="stat"><strong>'+D.practices.length+'</strong><span>ready-to-run practices</span></div><div class="stat"><strong>'+(D.moves.length+kyleEntries("move").length)+'</strong><span>written & video move guides</span></div><div class="stat"><strong>'+(D.games.length+kyleEntries("game").length)+'</strong><span>games & video guides</span></div><div class="stat"><strong>3</strong><span>age groups</span></div></div>'+kyleFeature()+familyHomeFeature()+'<div class="section-head"><div><p class="eyebrow">START WITH YOUR GROUP</p><h2>A place for every stage.</h2></div></div><div class="grid">'+[
 ["4-6","Discover & play","Movement, confidence, personal space, and a first welcome to wrestling.","pup","35"],
 ["7-10","Build the foundations","Simple connected skills, cooperative partners, and plenty of useful practice.","","60"],
 ["11-14","Connect & choose","Refine the basics, read a reaction, and choose the next action.","advanced","75"]
 ].map(([age,title,copy,cl,dur])=>'<article class="card pathway '+cl+'"><p class="eyebrow">AGES</p><div class="age">'+age.replace("-","–")+'</div><h3>'+title+'</h3><p>'+copy+'</p><div class="card-bottom"><span>30 plans · '+dur+' minutes</span><a href="#practices?age='+age+'" class="card-link">View plans →</a></div></article>').join("")+'</div>'+note('<strong>Age organizes the practice. Readiness guides the move.</strong> Pup, Beginner, and Advanced are teaching tiers. Check each move’s prerequisites before adding speed, contact, or resistance.')+'<div class="section-head"><div><p class="eyebrow">ON THE MAT</p><h2>Find what you need next.</h2></div></div><div class="grid two"><article class="card"><span class="eyebrow">MOVES & DEMONSTRATIONS</span><h3>One cue. One useful correction.</h3><p>Step-by-step instruction, the words to say, and a demonstration link. Search by name, skill, or the move ID in your binder.</p><a class="card-link" href="#moves">Open the move library →</a></article><article class="card"><span class="eyebrow">FINISH TOGETHER</span><h3>End practice with a game.</h3><p>Choose a written game by group and time, with setup, rules, and coaching boundaries. Explore additional game videos from Coach Kyle.</p><a class="card-link" href="#games">Find an end-of-practice game →</a></article></div><div class="section-head"><h2>Still like a binder?</h2><a href="#downloads">All downloads →</a></div>'+note('<strong>The complete print library is here too.</strong> The original binder is 208 pages / 104 sheets. Add the <a href="downloads/team-games.pdf" target="_blank" rel="noopener">eight-page extra games addendum ↗</a> after page 208 for 108 sheets total. Print Letter, double-sided, flip on the long edge, at 100%. <a href="downloads/coaching-binder.pdf" target="_blank" rel="noopener">Open the binder ↗</a>')+sponsorHomeFeature();
}


function instructionFor(id){return I.entries?.[id];}
function instructionSourceLink(source){
 const url=String(source.url||""),title=esc(source.title||"Source");
 if(url.startsWith("#"))return '<a href="'+esc(url)+'">'+title+'</a>';
 return /^https?:\/\//i.test(url)?ext(url,title):title;
}
function kyleGuideLabel(entry){return instructionFor(entry.id)?"Written + video guide":kyleKind(entry)==="game"?"Game video guide":"Move video guide";}
function kyleInstruction(entry){
 const guide=instructionFor(entry.id);if(!guide)return {nav:"",verification:"",body:""};
 const path="#moves/kyle/"+entry.id,items=[],add=(key,title,body,cls="")=>{if(body)items.push({key,title,body,cls});};
 const text=value=>arr(value).map(item=>'<p>'+linked(item)+'</p>').join("");
 add("ready","Before you teach",(guide.purpose?'<div class="meta-title">Purpose</div>'+text(guide.purpose):"")+(guide.readiness?'<div class="meta-title">Readiness</div>'+text(guide.readiness):""));
 add("setup","Set up",text(guide.setup));
 add("steps",kyleKind(entry)==="game"?"How to play":"Teach it step by step",(guide.steps||[]).length?'<ol class="steps">'+guide.steps.map(step=>'<li>'+linked(step)+'</li>').join("")+'</ol>':"");
 add("cues","Say this",(guide.cues||[]).length?guide.cues.map(cue=>'<p class="cue">“'+esc(cue)+'”</p>').join(""):"","cue-panel");
 add("corrections","Spot it. Fix it.",(guide.mistakes||[]).map(mistake=>'<div class="correction"><div><div class="meta-title">Common mistake</div>'+text(mistake.problem)+'</div><div><div class="meta-title">Try this correction</div>'+text(mistake.correction)+'</div></div>').join(""));
 const drill=guide.drill;
 if(drill)add("drill","Put it into practice",(drill.name?'<h3>'+esc(drill.name)+'</h3>':"")+(drill.setup?'<div class="meta-title">Set up the drill</div>'+text(drill.setup):"")+(drill.rounds?'<div class="meta-title">Rounds & progression</div>'+text(drill.rounds):"")+(drill.goal?'<div class="meta-title">Look for success</div>'+text(drill.goal):""));
 add("ages","Adapt for your group",(guide.age_adaptations||[]).length?'<dl class="kyle-age-adaptations">'+guide.age_adaptations.map(group=>'<div><dt>'+esc(group.group)+'</dt><dd>'+linked(group.text)+'</dd></div>').join("")+'</dl>':"");
 add("safety","Coaching boundaries",(guide.safety||[]).length?'<ul class="kyle-boundaries">'+guide.safety.map(item=>'<li>'+linked(item)+'</li>').join("")+'</ul>':"");
 add("sources","Instruction sources",(guide.sources||[]).length?'<ul class="link-list">'+guide.sources.map(source=>'<li>'+instructionSourceLink(source)+'</li>').join("")+'</ul>':"");
 return {
  nav:'<nav class="kyle-section-nav" aria-label="Guide sections">'+items.map(item=>'<a href="'+path+'" data-scroll="kyle-'+entry.id+'-'+item.key+'">'+item.title+'</a>').join("")+'</nav>',
  verification:'<div class="kyle-verification"><p><strong>About these instructions.</strong> '+esc(guide.verification||"Use this written coaching progression alongside the original video and the linked sources.")+'</p>'+(I.checked?'<p class="fine">Instruction review: '+esc(I.checked)+'.</p>':"")+'</div>',
  body:items.map(item=>'<section class="panel kyle-instruction-section '+item.cls+'" id="kyle-'+entry.id+'-'+item.key+'" tabindex="-1"><h2>'+item.title+'</h2>'+item.body+'</section>').join("")
 };
}
function kyleSource(entry){
 const v=entry.video||{};
 return section("Video & source",'<p><strong>'+esc(v.channel||"YouTube")+'</strong></p><details><summary>Original title and source check</summary><div class="detail-body"><dl class="kyle-source"><dt>Publisher’s title</dt><dd>'+esc(v.title||entry.name)+'</dd><dt>Label supplied for this collection</dt><dd>'+esc(entry.user_label||entry.name)+'</dd><dt>Verification</dt><dd>'+esc(v.verified_by||"No source-check details supplied.")+'</dd>'+(K.checked?'<dt>Checked</dt><dd>'+esc(K.checked)+'</dd>':"")+'</dl>'+(v.status==="unverified"?'<p class="fine">Source check pending.</p>':"")+ext(v.url,"Open the original video")+'</div></details>');
}

function kyleKind(entry){return entry.kind||(entry.id==="K01"?"game":"move");}
function kyleEntries(kind){return (K.entries||[]).filter(e=>kyleKind(e)===kind);}
function kyleCategory(id){return (K.categories||[]).find(c=>c.id===id);}
function kyleFeature(){
 return '<section class="kyle-callout"><div><p class="eyebrow">IN THE MOVE LIBRARY · COACH KYLE’S VIDEOS</p><h2>'+esc(K.title||"Coach Kyle’s Corner of Excellence")+'</h2><p>'+esc(K.description||"Coaching favorites, organized by position and purpose. Find a video, choose a focus, and connect it to the written move guides.")+'</p></div><a class="button light" href="#moves/kyle">Explore the collection →</a></section>';
}
function kyleImage(entry,detail=false){
 const v=entry.video||{},href=detail?v.url:"#moves/kyle/"+entry.id;
 const alt=(v.channel||"YouTube")+" — "+(v.title||entry.name);
 return '<a class="kyle-thumbnail'+(!v.thumbnail?" is-fallback":"")+'" href="'+esc(href)+'" '+(detail?'target="_blank" rel="noopener noreferrer" aria-label="Watch '+esc(entry.name)+' on YouTube"':'aria-label="Open the video guide for '+esc(entry.name)+'"')+'>'+
 (v.thumbnail?'<img data-kyle-image src="'+esc(v.thumbnail)+'" alt="'+esc(alt)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="480" height="270">':"")+
 '<span class="kyle-fallback"><img src="assets/grindstone-logo.png" alt="" width="72" height="72"><span>Video preview unavailable</span></span><span class="kyle-play" aria-hidden="true">▶</span><span class="kyle-image-label">'+(detail?"Watch on YouTube":"Open video guide")+'</span></a>';
}
function kyleCard(entry){
 const v=entry.video||{};
 return '<article class="card kyle-card">'+saveButton("kyle:"+entry.id)+kyleImage(entry)+'<div class="kyle-card-body"><div class="badges">'+filterBadges(entry)+badge(kyleGuideLabel(entry),"video-guide")+categoryTag(entry)+badge(v.format==="shorts"?"YouTube Short":"YouTube video",v.format==="shorts"?"shorts":"")+(entry.featured?badge("★ Coach’s pick","pup"):"")+'</div><h3><a href="#moves/kyle/'+entry.id+'">'+esc(entry.name)+'</a></h3><p class="kyle-publisher">'+esc(v.channel||"YouTube")+'</p><p>'+esc(entry.description)+'</p>'+(v.status==="unverified"?'<p class="fine">Source check pending.</p>':"")+'<div class="kyle-card-links">'+ext(v.url,v.format==="shorts"?"Watch Short":"Watch video","button small")+'<a class="card-link" href="#moves/kyle/'+entry.id+'">'+(instructionFor(entry.id)?"Teach it →":"Guide & related moves →")+'</a></div></div></article>';
}
function kyleList(params){
 const entries=K.entries||[],tag=params.get("tag")||"",picks=entries.filter(x=>x.featured),shorts=entries.filter(x=>x.video?.format==="shorts").length;
 return '<a class="back" href="#moves">← All moves</a>'+pageTitle("COACH KYLE’S VIDEO COLLECTION",esc(K.title||"Coach Kyle’s Corner of Excellence"),esc(K.description||"Find a coaching video by position, skill, or focus."))+
 '<div class="kyle-summary"><span>'+entries.length+' videos</span><span>'+shorts+' Shorts</span><span>'+(entries.length-shorts)+' full-length videos</span>'+(entries.some(entry=>instructionFor(entry.id))?'<span>'+entries.filter(entry=>instructionFor(entry.id)).length+' written coaching guides</span>':"")+'</div><div class="buttons"><a class="button outline" href="#about/kyle">About Coach Kyle →</a><a class="card-link" href="#moves?type=video">Move videos in the library</a><a class="card-link" href="#games?type=video">Game videos in the library</a></div>'+
 (picks.length?'<section class="kyle-featured"><div><p class="eyebrow">START WITH A FAVORITE</p><h2>Coach Kyle’s picks</h2></div><div class="chip-links">'+picks.map(e=>'<a href="#moves/kyle/'+e.id+'"><span aria-hidden="true">★ </span>'+esc(e.name)+'</a>').join("")+'</div></section>':"")+
 '<form class="filters kyle-filters" id="kyle-form" role="search"><div class="field search"><label for="kyle-search">Search Coach Kyle’s videos</label><input id="kyle-search" name="q" type="search" value="'+esc(params.get("q")||"")+'" placeholder="Name, position, publisher, or coaching focus…" aria-controls="kyle-results"></div><div class="field"><label for="kyle-kind">Video type</label><select id="kyle-kind" name="kind"><option value="">All videos</option><option value="move" '+(params.get("kind")==="move"?"selected":"")+'>Move videos</option><option value="game" '+(params.get("kind")==="game"?"selected":"")+'>Game videos</option></select></div><input type="hidden" name="tag" id="kyle-category" value="'+esc(tag)+'"><input type="hidden" name="category" id="kyle-legacy-category" value="'+esc(params.get("category")||"")+'"><label class="kyle-pick-filter" for="kyle-featured"><input id="kyle-featured" type="checkbox" name="featured" value="1" '+(params.get("featured")==="1"?"checked":"")+'> Coach Kyle’s picks only</label><button class="button outline" type="reset">Clear all</button></form>'+
 (params.get("category")?'<p class="fine" id="kyle-legacy-note">Saved collection filter: '+esc(kyleCategory(params.get("category"))?.label||params.get("category"))+'. Choose a category below or Clear all to browse the shared categories.</p>':'')+
 '<nav class="kyle-categories" aria-label="Video categories"><button type="button" data-kyle-category="" aria-pressed="'+(!tag&&!params.get("category"))+'">All categories <span>'+entries.length+'</span></button>'+kyleBrowseCategories().map(c=>'<button type="button" data-kyle-category="'+esc(c.id)+'" aria-pressed="'+(tag===c.id)+'">'+esc(c.label)+' <span>'+entries.filter(e=>categoryFor(e)?.id===c.id).length+'</span></button>').join("")+'</nav>'+
 '<p id="kyle-count" class="result-count" role="status" aria-live="polite"></p><div id="kyle-results"></div>';
}
function updateKyle(params){
 const q=(params.get("q")||"").trim().toLowerCase(),tag=params.get("tag"),category=params.get("category"),featured=params.get("featured")==="1",kind=params.get("kind");
 const entries=(K.entries||[]).filter(e=>(!kind||kyleKind(e)===kind)&&(!category||e.category===category)&&(!tag||categoryFor(e)?.id===tag)&&(!featured||e.featured)&&(!q||[e.id,e.name,e.user_label,e.description,e.category,kyleCategory(e.category)?.label,categoryFor(e)?.label,...(e.focus||[]),...(e.related_moves||[]),e.video?.title,e.video?.channel,JSON.stringify(instructionFor(e.id)||{})].join(" ").toLowerCase().includes(q)));
 document.getElementById("kyle-count").textContent=entries.length+" of "+(K.entries||[]).length+" videos"+(kind?" · "+(kind==="game"?"Game videos":"Move videos"):"")+(category?" · "+(kyleCategory(category)?.label||category):"")+(tag?" · "+(T.categories.find(c=>c.id===tag)?.label||tag):"")+(featured?" · Coach Kyle’s picks":"")+(q?" matching “"+params.get("q")+"”":"");
 document.querySelectorAll("[data-kyle-category]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.kyleCategory===(tag||"")&&!category));
 const legacyNote=document.getElementById("kyle-legacy-note");if(legacyNote)legacyNote.hidden=!category;
 document.getElementById("kyle-results").innerHTML=entries.length?kyleBrowseCategories().map(c=>{
  const group=entries.filter(e=>categoryFor(e)?.id===c.id);if(!group.length)return "";
  return '<section class="kyle-category-group" aria-labelledby="kyle-group-'+c.id+'"><div class="section-head"><div><p class="eyebrow">'+group.length+' '+(group.length===1?"VIDEO":"VIDEOS")+'</p><h2 id="kyle-group-'+c.id+'">'+esc(c.label)+'</h2><p>'+esc(c.description||"")+'</p></div></div><div class="grid">'+group.map(kyleCard).join("")+'</div></section>';
 }).join(""):'<div class="empty"><h2>No videos match these filters.</h2><p>Try another skill or clear the filters to see the whole collection.</p><button type="button" class="button outline" data-kyle-clear>Show all videos</button></div>';
}
function about(){
 const club=K.about;if(!club)return notFound();
 const coach=K.coach;
 return pageTitle("ABOUT GRINDSTONE",esc(club.title||"About us"),esc(club.intro||""))+
 '<div class="prose about-story">'+(club.paragraphs||[]).map(text=>'<p>'+esc(text)+'</p>').join("")+'</div>'+
 ((club.values||[]).length?'<div class="section-head"><h2>What guides the club</h2></div><div class="grid">'+club.values.map(value=>'<article class="card"><h3>'+esc(value.title)+'</h3><p>'+esc(value.text)+'</p></article>').join("")+'</div>':"")+
 '<section class="kyle-callout"><div><p class="eyebrow">THE PEOPLE IN YOUR CORNER</p><h2>Our coaches</h2><p>'+esc(C.intro||"Meet the people who work with Grindstone’s young wrestlers.")+'</p></div><a class="button light" href="#about/coaches">Meet the coaching team →</a></section>'+
 ((club.sources||[]).length?section("From the official club website",'<ul class="link-list">'+club.sources.map(source=>'<li>'+ext(source.url,esc(source.title))+'</li>').join("")+'</ul>'):"");
}
function coachInitials(name){return String(name||"").replace(/^Coach\s+/i,"").trim().split(/\s+/).map(word=>word[0]||"").slice(0,2).join("").toUpperCase();}
function coachCard(coach,href){
 const photo=coach.photo,portrait='<div class="coach-photo-frame coach-card-portrait'+(photo?.src?"":" is-fallback")+'">'+(photo?.src?'<img data-coach-image src="'+esc(photo.src)+'" alt="'+esc(photo.alt||"Portrait of "+coach.name)+'" loading="lazy" decoding="async">':"")+'<span class="coach-monogram" aria-hidden="true">'+esc(coachInitials(coach.name))+'</span></div>';
 return '<article class="card team-coach-card">'+portrait+'<p class="eyebrow">'+esc(coach.role||"Grindstone coach")+'</p><h2><a href="'+esc(href)+'">'+esc(coach.name)+'</a></h2><p>'+esc(coach.summary||"")+'</p><a class="card-link" href="'+esc(href)+'">Meet '+esc(String(coach.name||"the coach").replace(/^Coach\s+/i,"").split(/\s+/)[0])+' →</a></article>';
}
function coachDirectory(){
 const profiles=C.profiles||[],supporters=C.supporters||[],kyle=K.coach;
 return '<a class="back" href="#about">← About Grindstone</a>'+pageTitle("THE PEOPLE IN YOUR CORNER","Our coaches",esc(C.intro||"Meet the people who work with Grindstone’s young wrestlers."))+
 '<div class="grid coach-directory">'+(kyle?coachCard({name:kyle.name,role:kyle.role,summary:kyle.intro,photo:kyle.gallery?.[0]},"#about/kyle"):"")+profiles.map(coach=>coachCard(coach,"#about/coach/"+coach.id)).join("")+'</div>'+
 (supporters.length?'<section class="coach-supporters"><div class="section-head"><div><p class="eyebrow">BEHIND THE PROGRAM</p><h2>People who help make it happen</h2></div></div><div class="grid two">'+supporters.map(person=>'<article class="card"><h3>'+esc(person.name)+'</h3>'+(person.role?'<p class="eyebrow">'+esc(person.role)+'</p>':"")+(person.summary?'<p>'+esc(person.summary)+'</p>':"")+(person.paragraphs||[]).map(text=>'<p>'+esc(text)+'</p>').join("")+((person.sources||[]).length?'<ul class="link-list">'+person.sources.map(source=>'<li>'+ext(source.url,esc(source.title))+'</li>').join("")+'</ul>':"")+'</article>').join("")+'</div></section>':"");
}
function coachProfile(id){
 const coach=(C.profiles||[]).find(person=>person.id===id);if(!coach)return notFound();
 const photo=coach.photo,highlights=coach.highlights||[],historicalPhotos=coach.gallery||[],hasAside=photo||historicalPhotos.length||highlights.length;
 const historicalGallery=historicalPhotos.length?'<section class="coach-gallery" aria-label="'+esc(coach.gallery_label||"Wrestling photos")+'"><h2>'+esc(coach.gallery_title||"From the wrestling archives")+'</h2>'+historicalPhotos.map(item=>'<figure class="coach-photo"><div class="coach-photo-frame profile"><img data-coach-image src="'+esc(item.src)+'" alt="'+esc(item.alt||coach.name)+'" loading="lazy" decoding="async"><div class="coach-photo-fallback"><span>Historical photo unavailable</span></div></div><figcaption><p>'+esc(item.caption||"")+'</p>'+(item.source_url?ext(item.source_url,esc(item.source_label||"Original source"),"photo-credit"):"")+'</figcaption></figure>').join("")+'</section>':"";
 const gallery=photo?'<figure class="coach-photo"><div class="coach-photo-frame profile"><img data-coach-image src="'+esc(photo.src)+'" alt="'+esc(photo.alt||coach.name)+'" loading="lazy" decoding="async"><div class="coach-photo-fallback"><span class="coach-monogram" aria-hidden="true">'+esc(coachInitials(coach.name))+'</span><span>Photo unavailable</span></div></div>'+((photo.caption||photo.source_url)?'<figcaption>'+(photo.caption?'<p>'+esc(photo.caption)+'</p>':"")+(photo.source_url?ext(photo.source_url,esc(photo.source_label||"Photo source"),"photo-credit"):"")+'</figcaption>':"")+'</figure>':"";
 return '<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#about">About us</a> <span aria-hidden="true">/</span> <a href="#about/coaches">Our coaches</a></nav>'+
 '<div class="detail-heading"><div>'+pageTitle("MEET THE COACH",esc(coach.name),esc(coach.role||""))+'</div><div class="detail-actions"><button class="button outline" data-print>Print this page</button></div></div>'+
 '<div class="coach-profile-layout'+(hasAside?"":" no-aside")+'"><article class="prose coach-bio">'+(coach.summary?'<p class="coach-intro">'+esc(coach.summary)+'</p>':"")+(coach.paragraphs||[]).map(text=>'<p>'+esc(text)+'</p>').join("")+
 ((coach.sources||[]).length?'<h2>Learn more</h2><ul class="link-list">'+coach.sources.map(source=>'<li>'+ext(source.url,esc(source.title))+'</li>').join("")+'</ul>':"")+
 '<div class="buttons"><a class="button outline" href="#about/coaches">Meet the whole coaching team →</a></div></article>'+
 (hasAside?'<aside class="coach-profile-aside" aria-label="More about '+esc(coach.name)+'">'+gallery+historicalGallery+(highlights.length?'<section class="panel"><h2>At a glance</h2><dl class="coach-milestones">'+highlights.map(item=>'<div><dt>'+esc(item.label)+'</dt><dd>'+esc(item.text)+'</dd></div>').join("")+'</dl></section>':"")+'</aside>':"")+'</div>';
}
function kyleBio(){
 const coach=K.coach;if(!coach)return notFound();
 const gallery=(coach.gallery||[]).map(photo=>'<figure class="coach-photo"><div class="coach-photo-frame '+esc(photo.view||"portrait")+'"><img src="'+esc(photo.src)+'" alt="'+esc(photo.alt)+'" loading="lazy" decoding="async"></div><figcaption><p>'+esc(photo.caption)+'</p>'+(photo.source_url?ext(photo.source_url,esc(photo.source_label||"Original source"),"photo-credit"):"")+'</figcaption></figure>').join("");
 return '<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#about">About us</a> <span aria-hidden="true">/</span> <a href="#about/coaches">Our coaches</a></nav>'+pageTitle("MEET THE COACH",esc(coach.name||"Coach Kyle"),esc(coach.role||""))+
 '<div class="coach-bio-layout"><article class="prose coach-bio"><p class="coach-intro">'+esc(coach.intro||"")+'</p>'+(coach.paragraphs||[]).map(text=>'<p>'+esc(text)+'</p>').join("")+
 ((coach.milestones||[]).length?'<h2>On the mat and in the corner</h2><dl class="coach-milestones">'+coach.milestones.map(m=>'<div><dt>'+esc(m.label)+'</dt><dd>'+esc(m.text)+'</dd></div>').join("")+'</dl>':"")+
 ((coach.sources||[]).length?'<h2>Sources & photo credits</h2><ul class="link-list">'+coach.sources.map(s=>'<li>'+ext(s.url,esc(s.title))+'</li>').join("")+'</ul>':"")+
 '<div class="buttons"><a class="button" href="#moves/kyle">Explore Coach Kyle’s videos →</a></div></article><aside class="coach-gallery" aria-label="Photos from Coach Kyle’s wrestling years">'+gallery+'</aside></div>';
}
function kyleDetail(id){
 const entries=K.entries||[],index=entries.findIndex(e=>e.id===id);if(index<0)return notFound();
 const entry=entries[index],v=entry.video||{},category=categoryFor(entry),related=(entry.related_moves||[]).filter(x=>D.moves.some(m=>m.id===x)),previous=entries[index-1],next=entries[index+1],hasGuide=!!instructionFor(id),instruction=kyleInstruction(entry);
 const relatedPanel=section("Related move guides",related.length?'<ul class="link-list">'+related.map(move=>'<li><a href="#move/'+move+'">'+move+' · '+esc(byId[move].name)+'</a></li>').join("")+'</ul><p class="fine">Read each guide’s prerequisites and selected variation before teaching.</p>':'<p class="small-copy">Use the move library to choose a guide that fits your athletes’ readiness.</p><a class="card-link" href="#moves">Browse move guides →</a>');
 const morePanel=section("Keep exploring",'<p class="small-copy">'+esc(category?.description||"Browse the rest of Coach Kyle’s video collection.")+'</p><a class="card-link" href="#moves/kyle?tag='+esc(category?.id||"")+'">More '+esc(category?.label||"videos")+' →</a><div class="buttons"><a class="button outline" href="#moves/kyle?featured=1">Coach Kyle’s picks</a></div>');
 const focus=(entry.focus||[]).length?section("Teaching focus",'<ul class="kyle-focus">'+entry.focus.map(cue=>'<li>'+linked(cue)+'</li>').join("")+'</ul>'):"";
 return '<a class="back" href="#moves/kyle">← Coach Kyle’s collection</a><div class="detail-heading"><div><div class="badges">'+badge(kyleGuideLabel(entry),"video-guide")+categoryTag(entry)+badge(v.format==="shorts"?"YouTube Short":"YouTube video",v.format==="shorts"?"shorts":"")+(entry.featured?badge("★ Coach’s pick","pup"):"")+'<span class="id">'+esc(entry.id)+'</span></div><h1>'+esc(entry.name)+'</h1><p>'+esc(entry.description)+'</p></div><div class="detail-actions">'+(hasGuide?'<button class="button outline" data-print>Print guide</button>':"")+ext(v.url,v.format==="shorts"?"Watch Short":"Watch on YouTube","button")+saveButton("kyle:"+entry.id)+'</div></div>'+
 (entry.note?note(esc(entry.note)):"")+instruction.verification+instruction.nav+
 '<div class="detail-layout kyle-detail'+(hasGuide?' kyle-instruction-layout':"")+'"><div>'+(hasGuide?instruction.body:kyleImage(entry,true)+focus+kyleSource(entry))+'</div><aside>'+(hasGuide?kyleImage(entry,true)+kyleSource(entry):"")+relatedPanel+morePanel+'</aside></div>'+
 '<nav class="kyle-pager" aria-label="Video collection navigation">'+(previous?'<a href="#moves/kyle/'+previous.id+'"><small>← PREVIOUS GUIDE</small><strong>'+esc(previous.name)+'</strong></a>':'<span></span>')+'<a class="kyle-pager-all" href="#moves/kyle">All '+entries.length+' guides</a>'+(next?'<a href="#moves/kyle/'+next.id+'"><small>NEXT GUIDE →</small><strong>'+esc(next.name)+'</strong></a>':'<span></span>')+'</nav>';
}

function sponsorHomeFeature(){
 return '<section class="sponsor-home"><div><p class="eyebrow">OUR COMMUNITY</p><h2>Our sponsors</h2><p>Celebrating the businesses and organizations that support Grindstone Wrestling.</p></div><a class="button outline" href="#sponsors">Visit our sponsors →</a></section>';
}
function sponsors(){
 const entries=S.sponsors||[];
 return pageTitle("OUR COMMUNITY","Our sponsors","Celebrating the businesses and organizations that support Grindstone Wrestling.")+(entries.length?'<div class="grid sponsor-grid">'+entries.map(s=>'<article class="card sponsor-card"><div class="sponsor-logo'+(!s.logo?" is-fallback":"")+'">'+(s.logo?'<img data-sponsor-image src="'+esc(s.logo)+'" alt="'+esc(s.name)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">':"")+'<span class="sponsor-logo-fallback">'+esc(s.name)+'</span></div><h2>'+esc(s.name)+'</h2>'+(s.description?'<p>'+esc(s.description)+'</p>':"")+(s.url?ext(s.url,"Visit "+esc(s.name),"card-link"):"")+'</article>').join("")+'</div>':'<section class="panel sponsor-empty"><img src="assets/grindstone-logo.png" alt="" width="96" height="96"><h2>Our supporter list is coming soon.</h2></section>');
}

function familyGuide(){return (F.downloads||[]).find(d=>d.id==="family-guide")||(F.downloads||[]).find(d=>d.group==="families"&&d.type==="PDF");}
function familyGuideLink(label="Open the family guide (PDF)",cls="button"){
 const guide=familyGuide();
 return guide?ext(guide.path,esc(label),cls):'<a class="'+cls+'" href="#downloads?group=families">Family print resources</a>';
}
function familyCard(id,label,description,linkLabel){
 const article=(F.pages||[]).find(x=>x.id===id);
 return '<article class="card family-card"><p class="eyebrow">'+esc(label)+'</p><h3><a href="#family/'+id+'">'+esc(article?.title||label)+'</a></h3><p>'+esc(article?.description||description)+'</p><a class="card-link" href="#family/'+id+'">'+esc(linkLabel||"Read the guide")+' →</a></article>';
}
function volunteerFeature(){
 return '<section class="family-callout"><div><p class="eyebrow">THERE IS A WAY TO HELP</p><h2>'+esc(F.volunteer?.title||"Help the team run smoothly.")+'</h2><p>'+esc(F.volunteer?.description||"Find a volunteer role that fits your time, experience, and comfort level.")+'</p></div><a class="button" href="#volunteer">Ways to volunteer →</a></section>';
}
function familyHomeFeature(){
 return '<section class="family-callout home-family"><div><p class="eyebrow">FOR PARENTS & CAREGIVERS</p><h2>New to wrestling? Start together.</h2><p>Find first-day answers, meet-day checklists, match basics, and ways to support your athlete.</p></div><a class="button" href="#families">Visit the Families hub →</a></section>';
}
function families(){
 return pageTitle("GRINDSTONE FAMILIES","You belong here.",esc(F.intro||"A practical starting point for parents and caregivers: what to expect, how to prepare, and how to support your young wrestler."))+
 '<section class="family-welcome"><div><p class="eyebrow">START HERE</p><h2>Your family guide, ready to keep.</h2><p>Keep the printable guide handy, then use the questions and meet-day checklist below when you need a quick answer.</p><div class="buttons">'+familyGuideLink()+'<a class="button outline" href="#downloads?group=families">All family downloads</a></div></div><div class="family-start"><p class="meta-title">A simple first visit</p><ol><li>Read the frequently asked questions.</li><li>Confirm your group’s details with the club.</li><li>Use the meet-day guide before an event.</li></ol></div></section>'+
 '<div class="section-head"><h2>Start with your next question.</h2></div><div class="grid two"><article class="card family-card"><p class="eyebrow">QUICK ANSWERS</p><h3><a href="#family/faq">Questions families ask</a></h3><p>Search '+(F.faq||[]).length+' answers about getting started, practices, matches, and supporting your athlete.</p><a class="card-link" href="#family/faq">Browse the family FAQ →</a></article>'+familyCard("meet-day","MEET DAY","Prepare for the day, find your way around, and know what comes next.","Open the meet-day checklist")+'</div>'+
 '<div class="section-head"><h2>Understand the season.</h2></div><div class="grid">'+familyCard("match-basics","WATCHING A MATCH","Learn the basics so the action is easier to follow.")+familyCard("expectations","PRACTICE & TEAM LIFE","Know what to expect from the team and how families can help.")+familyCard("health","READY TO PARTICIPATE","Find practical health and safety guidance for families.")+'</div>'+volunteerFeature();
}
function familyFaq(params){
 return '<a class="back" href="#families">← Families hub</a>'+pageTitle("FAMILY FAQ","Questions families ask.","Search for a topic, then open any question to read the answer.")+
 '<form class="filters faq-filters" id="faq-form" role="search"><div class="field search"><label for="faq-search">Search family questions</label><input id="faq-search" name="q" type="search" value="'+esc(params.get("q")||"")+'" placeholder="Try practice, equipment, scoring, or meet day…" aria-describedby="faq-help"></div><button class="button outline" type="reset">Clear search</button></form>'+
 '<p id="faq-help" class="fine">Answers reflect the family guide. Confirm current group and event details with the club.</p><div class="faq-tools"><p id="faq-count" class="result-count" role="status" aria-live="polite"></p><div class="buttons"><button class="button outline small" type="button" data-faq-toggle="open">Expand all</button><button class="button outline small" type="button" data-faq-toggle="closed">Collapse all</button></div></div><div id="faq-results" class="faq-list"></div><div class="buttons">'+familyGuideLink()+'<a class="button outline" href="#family/meet-day">Meet-day guide</a></div>';
}
function updateFaq(params){
 const q=(params.get("q")||"").trim().toLowerCase();
 const entries=(F.faq||[]).map((x,i)=>({...x,index:i})).filter(x=>!q||(x.question+" "+String(x.answer).replace(/<[^>]*>/g," ")).toLowerCase().includes(q));
 document.getElementById("faq-count").textContent=entries.length+" of "+(F.faq||[]).length+" questions"+(q?" matching “"+params.get("q")+"”":"");
 document.getElementById("faq-results").innerHTML=entries.length?entries.map(x=>'<details class="faq-item" id="faq-'+(x.index+1)+'"'+(q?" open":"")+'><summary>'+esc(x.question)+'</summary><div class="faq-answer">'+x.answer+'</div></details>').join(""):'<div class="empty"><h2>No answers match that search.</h2><p>Try a shorter phrase or clear the search to see every question.</p><button type="button" class="button outline" data-faq-clear>Show all questions</button></div>';
 document.querySelectorAll("[data-faq-toggle]").forEach(b=>b.disabled=!entries.length);
}
function familyArticle(id){
 const article=(F.pages||[]).find(x=>x.id===id);if(!article)return notFound();
 return authoredArticle(article,"FAMILY GUIDE","#families","Families hub","family/"+id);
}
function authoredArticle(article,eyebrow,backHref,backLabel,routePath){
 const slug=routePath.replace(/\//g,"-");
 const sections=article.sections||[];
 const sources=article.sources?.length?'<section class="family-sources" id="'+slug+'-sources"><h2>Sources & further reading</h2><ul class="link-list">'+article.sources.map(s=>'<li>'+ext(s.url,esc(s.title))+'</li>').join("")+'</ul></section>':"";
 return '<a class="back" href="'+backHref+'">← '+backLabel+'</a><div class="detail-heading"><div>'+pageTitle(eyebrow,esc(article.title),esc(article.description||""))+'</div><div class="detail-actions"><button class="button outline" data-print>Print this page</button></div></div><div class="guide-layout family-article"><aside class="toc"><p class="eyebrow">ON THIS PAGE</p>'+sections.map((s,i)=>'<a href="#'+routePath+'" data-scroll="'+slug+'-'+i+'">'+esc(s.title)+'</a>').join("")+(sources?'<a href="#'+routePath+'" data-scroll="'+slug+'-sources">Sources & further reading</a>':"")+'<div class="family-toc-links"><a href="#family/faq">Family FAQ →</a><a href="#family/meet-day">Meet-day guide →</a><a href="#volunteer">Ways to volunteer →</a><a href="#downloads?group=families">Family print resources →</a></div></aside><article class="prose">'+sections.map((s,i)=>'<section id="'+slug+'-'+i+'" tabindex="-1"><h2>'+esc(s.title)+'</h2>'+s.html+'</section>').join("")+sources+(F.reviewed?'<p class="fine family-reviewed">Family material reviewed '+esc(F.reviewed)+'. Confirm current club and event details before relying on dates or requirements.</p>':"")+'</article></div>';
}
function volunteer(){
 return F.volunteer?authoredArticle(F.volunteer,"HELP THE TEAM","#families","Families hub","volunteer")+section("Resources for coaches and presenters",'<p>Use the presentation and editable materials when welcoming families or preparing helpers.</p><div class="buttons"><a class="button outline" href="#downloads?group=presenters">Presenter resources</a><a class="button outline" href="#coaching">Coaching resources</a></div>'):notFound();
}
function downloadCard(d){
 const type=String(d.type||"PDF").toUpperCase(),labels={PDF:"PDF document",PPTX:"PowerPoint slides",DOCX:"Word document",MD:"Markdown text",ZIP:"ZIP archive"};
 const label=labels[type]||type;
 return '<article class="card download-card"><div class="badges">'+badge(label)+(d.pages?'<span class="id">'+d.pages+' PAGES</span>':"")+'</div><h3>'+esc(d.title)+'</h3><p>'+esc(d.description)+'</p><a class="button outline" href="'+esc(d.path)+'" '+(type==="PDF"?'target="_blank" rel="noopener"':"download")+">"+(type==="PDF"?"Open PDF ↗":"Download "+(type==="PPTX"?"PowerPoint":type==="DOCX"?"Word document":type==="MD"?"Markdown":type==="ZIP"?"ZIP":esc(type)))+'</a></article>';
}

function filters(kind,params){
 const q=params.get("q")||"",age=params.get("age")||"",tier=params.get("tier")||"",mixed=kind!=="practices";
 return '<form class="filters" id="filter-form" role="search"'+(mixed?' aria-describedby="library-filter-help"':'')+'><div class="field search"><label for="search">Search '+kind+'</label><input id="search" type="search" name="q" value="'+esc(q)+'" placeholder="'+(kind==="moves"?"Name, move ID, position, or coaching cue…":kind==="games"?"Name, game ID, equipment, or video…":"Theme, practice number, or move ID…")+'"></div>'+
 (mixed?'<div class="field guide-type-field"><label for="guide-type">Collection</label><select id="guide-type" name="type"><option value="">All collections</option><option value="written" '+(params.get("type")==="written"?"selected":"")+'>Original written guides</option><option value="video" '+(params.get("type")==="video"?"selected":"")+'>Coach Kyle’s collection</option><option value="facebook" '+(params.get("type")==="facebook"?"selected":"")+'>Facebook clips</option></select></div>':"")+
 (kind==="moves"?'<div class="field category-field"><label for="move-category">Category</label><select id="move-category" name="category"><option value="">All categories</option>'+categoryOptions(params.get("category"),[...D.moves,...kyleEntries("move"),...practiceVideoEntries("move")])+'</select></div><div class="field"><label for="tier">Teaching tier</label><select id="tier" name="tier"><option value="">All tiers</option>'+["Pup","Beginner","Advanced"].map(t=>'<option '+(tier===t?"selected ":"")+'value="'+t+'">'+t+'</option>').join("")+'</select></div><div class="field"><label for="video">Video format</label><select id="video" name="video"><option value="">All demonstrations</option><option value="shorts" '+(params.get("video")==="shorts"?"selected":"")+'>YouTube Shorts</option></select></div>':
 '<div class="field"><label for="age">'+"Age group"+'</label><select id="age" name="age"><option value="">All groups</option>'+["4-6","7-10","11-14"].map(a=>'<option value="'+a+'" '+(age===a?"selected":"")+'>Ages '+a+'</option>').join("")+'</select></div>'+
 (kind==="games"?'<div class="field"><label for="minutes">Game time</label><select id="minutes" name="minutes"><option value="">Any length</option><option value="4" '+(params.get("minutes")==="4"?"selected":"")+'>Up to 4 minutes</option><option value="5" '+(params.get("minutes")==="5"?"selected":"")+'>Up to 5 minutes</option><option value="6" '+(params.get("minutes")==="6"?"selected":"")+'>Up to 6 minutes</option></select></div>':""))+'<button class="button outline" type="reset">Reset</button>'+(mixed?'<label class="unassigned-filter" for="include-unassigned"><input id="include-unassigned" type="checkbox" '+(params.get("unassigned")!=="0"?'checked':'')+'> Include entries without an assigned '+(kind==="moves"?'tier':'age or time')+'</label>':'')+'</form>'+
 (mixed?'<p id="library-filter-help" class="fine library-filter-help">'+(kind==="moves"?'Categories work across all three collections. Entries without a tier are included by default and labeled when a tier filter is active. Uncheck the option above to show only entries with a matching assigned tier. An unassigned tier is not a readiness recommendation.':'Age and time filters use assigned guide information. Entries missing that information are included by default and labeled when a filter is active. Uncheck the option above for strict matching. Check each unassigned entry’s setup and adaptations before choosing it.')+'</p>':"");
}
function listing(kind,params){
 let title,copy;
 if(kind==="moves"){title="The move library.";copy=D.moves.length+" original written move guides and "+kyleEntries("move").length+" guides from Coach Kyle’s video collection, plus "+practiceVideoEntries("move").length+" distinct Facebook clips, searchable together. Find teaching steps, cues and prerequisites, then use the linked demonstration to support your instruction.";}
 if(kind==="games"){title="Finish on a good note.";copy=D.games.length+" original written games, plus "+kyleEntries("game").length+" guide from Coach Kyle’s collection and "+practiceVideoEntries("game").length+" Facebook game clips. Check the setup, rules and suggested adaptations before choosing a game for your group.";}
 if(kind==="practices"){title="Your next practice, ready.";copy="Thirty complete plans for each age group. Choose a session, check the prerequisites, and open the linked moves as you coach.";}
 const collection=kind==="moves"?'<section class="library-collection"><div><p class="eyebrow">WITHIN THE MOVE LIBRARY</p><h2>Coach Kyle’s Corner of Excellence</h2><p>Browse his video collection by position, skill, or favorite.</p></div><a class="button outline" href="#moves/kyle">Visit the Corner →</a></section>':kind==="games"?'<div class="library-collection"><div><p class="eyebrow">FROM COACH KYLE’S CORNER</p><h2>Games in the video collection</h2><p>Explore the game videos alongside the full written game library below.</p></div><a class="button outline" href="#moves/kyle?kind=game">Browse game videos →</a></div>':"";
 return pageTitle("COACH LIBRARY",title,copy)+collection+practiceVideoLink(kind)+filters(kind,params)+'<p id="result-count" class="result-count" role="status" aria-live="polite"></p><div id="results" class="grid"></div>';
}
function filterMetadata(entry,kind){
 const isWritten=entry.guide_type==="written";
 let ages=Array.isArray(entry.age_groups)?entry.age_groups:null;
 // Preserve the original written-game age mapping; do not infer a video's age from its source.
 if(kind==="games"&&ages===null&&isWritten&&byId[entry.id])ages=[...(entry.id<="G10"?["4-6"]:[]),...(entry.id<="G20"?["7-10"]:[]),"11-14"];
 const minutes=entry.minutes!==undefined&&entry.minutes!==null&&String(entry.minutes).trim()!==""?Number(entry.minutes):NaN;
 return {tier:entry.tier||null,ages,minutes:Number.isFinite(minutes)?minutes:null};
}
function libraryResults(kind,params){
 const mixed=kind!=="practices",written=kind==="moves"?D.moves:kind==="games"?D.games:D.practices;
 let list=mixed?[...written.map(x=>({...x,guide_type:"written"})),...kyleEntries(kind==="games"?"game":"move").map(x=>({...x,guide_type:"video"})),...practiceVideoEntries(kind==="games"?"game":"move").map(x=>({...x,guide_type:"video",source_collection:"facebook"}))]:written;
 const q=(params.get("q")||"").toLowerCase().trim(),age=params.get("age"),tier=params.get("tier"),type=params.get("type"),includeUnassigned=params.get("unassigned")!=="0";
 return list.filter(x=>{
  const isVideo=x.guide_type==="video",metadata=filterMetadata(x,kind),missing=[];
  if(kind==="moves"&&params.get("category")&&categoryFor(x)?.id!==params.get("category"))return false;
  if(q&&!JSON.stringify({...x,shared_category:categoryFor(x)?.label,old_name:D.research[x.id]?.original_name,category_label:x.source_collection==="facebook"?variationCategory(x.category):isVideo?kyleCategory(x.category)?.label:"",instruction:isVideo?instructionFor(x.id):undefined,practice_variations:isVideo?undefined:variationSearch(x.id)}).toLowerCase().includes(q))return false;
  if(mixed&&type){
   if(type==="facebook"){if(x.source_collection!=="facebook")return false;}
   else if(type==="video"){if(!isVideo||x.source_collection==="facebook")return false;}
   else if(x.guide_type!==type)return false;
  }
  if(kind==="moves"&&tier){if(metadata.tier===null)missing.push("Tier");else if(metadata.tier!==tier)return false;}
  if(age&&kind==="practices"&&x.age_group!==age)return false;
  if(age&&kind==="games"){if(metadata.ages===null)missing.push("Age");else if(!metadata.ages.includes(age))return false;}
  if(params.get("video")==="shorts"&&!(isVideo?x.video:videoFor(x.id)?.video)?.format?.includes("short"))return false;
  if(kind==="games"&&params.get("minutes")){if(metadata.minutes===null)missing.push("Time");else if(metadata.minutes>Number(params.get("minutes")))return false;}
  if(missing.length&&!includeUnassigned)return false;
  if(mixed)x.unassigned_filters=missing;
  return true;
 });
}
function updateResults(kind,params){
 const mixed=kind!=="practices",q=(params.get("q")||"").trim(),list=libraryResults(kind,params);
 document.getElementById("results").innerHTML=list.length?list.map(x=>x.source_collection==="facebook"?practiceVideoLibraryCard(x):x.guide_type==="video"?kyleCard(x):kind==="moves"?moveCard(x):kind==="games"?gameCard(x):practiceCard(x)).join(""):'<div class="empty"><h2>No matches yet.</h2><p>Try another filter'+(mixed&&params.get("unassigned")==="0"?' or include entries without assigned filter details':'')+'.</p><button type="button" class="button outline" data-clear>Clear filters</button></div>';
 const facebookCount=list.filter(x=>x.source_collection==="facebook").length,videoCount=list.filter(x=>x.guide_type==="video").length,unassignedCount=list.filter(x=>x.unassigned_filters?.length).length,counts=mixed?list.length+(list.length===1?" entry · ":" entries · ")+(list.length-videoCount)+" original written · "+(videoCount-facebookCount)+" from Coach Kyle · "+facebookCount+(facebookCount===1?" Facebook clip":" Facebook clips"):list.length+" practices";
 document.getElementById("result-count").textContent=counts+(kind==="moves"&&params.get("category")?" · "+(T.categories.find(c=>c.id===params.get("category"))?.label||params.get("category")):"")+(q?" matching “"+params.get("q")+"”":"")+(unassignedCount?" · "+unassignedCount+" with unassigned filter details":"")+" · "+(kind==="moves"?"Choose by readiness, then check the specific variation.":kind==="games"?"Check setup and adaptations before choosing a game.":"All timings include transitions and rest.");
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
 return detailHeader("moves",id,m.name,m.purpose,badge(m.tier,tierClass(m.tier))+categoryTag(m))+'<div class="detail-layout"><div>'+section("Before you teach",p(m.prerequisite)+(prerequisites.length?'<div class="chip-links">'+prerequisites.map(i=>'<a href="#move/'+i+'">'+i+' · '+esc(byId[i]?.name||"Open move")+'</a>').join("")+'</div>':""))+section("Teach it step by step",'<ol class="steps">'+m.steps.map(s=>'<li>'+linked(s)+'</li>').join("")+'</ol>')+section("Spot it. Fix it.",'<div class="correction"><div><div class="meta-title">Common mistake</div>'+p(m.error)+'</div><div><div class="meta-title">Try this correction</div>'+p(m.fix)+'</div></div>')+section("Put it into practice",p(m.drill))+section("Coaching boundaries",p(m.boundary))+practiceVariations(id)+researchPanel(m)+'</div><aside class="detail-sidebar">'+section("Say this",m.cues.map(s=>'<p class="cue">“'+esc(s)+'”</p>').join(""),"cue-panel")+videoPanel(id)+usaPanel(id)+section("Keep it handy",'<p class="small-copy">Move '+id+' · reference page '+D.move_pages[id]+'.</p><a href="downloads/moves-reference.pdf#page='+D.move_pages[id]+'" target="_blank" rel="noopener">Open the printed move card ↗</a><div class="buttons"><a class="button outline small" href="#practices?q='+id+'">Practices using '+id+'</a></div>')+'</aside></div>';
}
function gameDetail(id){
 const g=byId[id];if(!g||!D.games.includes(g))return notFound();
 const printPage=g.print_page||D.game_pages[id],printPath=g.print_path||"downloads/practice-games.pdf";
 const printCopy=g.binder_page?"Addendum page "+printPage+" · binder page "+g.binder_page:"games reference page "+printPage;
 const provenance=g.team_favorite?'<strong>'+esc(g.origin_label||'Team favorite')+'.</strong> '+esc(g.provenance):'<strong>Original Grindstone game.</strong> Any linked video demonstrates a related activity or movement, not these exact rules. Keep the written setup, contact limits, and participation format.';
 const sources=g.sources?section("Sources & variations",'<ul class="link-list">'+g.sources.map(s=>'<li>'+ext(s.url,esc(s.title))+'<p class="fine">'+esc(s.note)+'</p></li>').join("")+'</ul>'):"";
 return detailHeader("games",id,g.name,g.format,badge(g.ages)+badge((g.team_favorite?"Suggested ":"")+g.minutes+" minutes"))+'<div class="detail-layout"><div>'+section("Set up",'<div class="meta-title">Equipment</div>'+p(g.equipment)+p(g.setup))+section("How to play",p(g.play)+(g.steps?'<ol class="steps">'+g.steps.map(s=>'<li>'+linked(s)+'</li>').join("")+'</ol>':""))+section(g.team_favorite?"Suggested adaptations":"Change it up",p(g.variation))+section("Coach watch",p(g.boundary))+note(provenance)+sources+practiceVariations(id)+'</div><aside class="detail-sidebar">'+(g.cues?section("Say this",g.cues.map(s=>'<p class="cue">'+esc(s)+'</p>').join(""),"cue-panel"):"")+videoPanel(id)+usaPanel(id)+section("Print & go",'<p class="small-copy">Game '+id+' · '+printCopy+'.</p><a href="'+printPath+'#page='+printPage+'" target="_blank" rel="noopener">Open the printed game ↗</a>')+'</aside></div>';
}
function practiceDetail(age,num){
 const x=D.practices.find(x=>x.age_group===age&&x.number===Number(num));if(!x)return notFound();
 const ids=[...new Set(JSON.stringify(x).match(/\b[PBA]\d{2}\b/g)||[])].filter(id=>byId[id]);
 let elapsed=0;
 return '<a class="back" href="#practices?age='+age+'">← Ages '+age+' practices</a><div class="detail-heading"><div><div class="badges">'+badge("Ages "+age)+badge(x.duration+" minutes")+'<span class="id">PRACTICE '+String(x.number).padStart(2,"0")+'</span></div><h1>'+esc(x.title)+'</h1><p>'+esc(x.focus)+'</p></div><div class="detail-actions"><button class="button outline" data-print>Print plan</button>'+saveButton(practiceSaveId(x))+'</div></div><div class="detail-layout"><div>'+section("Get ready",'<div class="meta-title">Set up</div>'+p(x.setup)+'<div class="meta-title">Check first</div>'+p(x.check))+section("Run the practice",x.blocks.map(b=>{let start=elapsed;elapsed+=b.minutes;return '<div class="practice-block"><div class="practice-time">'+start+'–'+elapsed+' MIN · '+b.minutes+' MINUTES</div><h3>'+esc(b.name)+'</h3>'+p(b.instructions)+'</div>';}).join(""))+section("Adapt the challenge",'<div class="meta-title">Make it easier</div>'+p(x.easier)+'<div class="meta-title">Add a challenge</div>'+p(x.harder))+section("Watch & reflect",'<div class="meta-title">Coaching boundaries</div>'+p(x.safety)+'<div class="meta-title">Notice success</div>'+p(x.success)+'<div class="meta-title">Ask the athletes</div>'+p(x.question))+'</div><aside>'+section("Moves in this practice",ids.length?'<ul class="link-list">'+ids.map(id=>'<li><a href="#move/'+id+'">'+id+' · '+esc(byId[id].name)+'</a></li>').join("")+'</ul>':'<p class="small-copy">This session focuses on group routines and movement play. Follow the full activity instructions.</p>')+section("Choose a finish",'<p class="small-copy">Need an alternative ending? Choose a familiar game that fits the group and today’s space.</p><a class="button outline" href="#games?age='+age+'">Browse games</a>')+section("Print this age group",'<a href="downloads/practices-'+age+'.pdf#page='+(x.number+4)+'" target="_blank" rel="noopener">Open the 30-practice book ↗</a><p class="fine" style="margin-top:12px">Print Letter, double-sided, flip on the long edge, at 100%.</p>')+'</aside></div>';
}
function coaching(){
 return pageTitle("THE COACH’S CORNER","Build the whole program.","Practice design, engagement, readiness, parent communication, and club operations. Use the full research and editable planning tools alongside the move library.")+kyleFeature()+volunteerFeature()+'<section class="panel presenter-feature"><div><p class="eyebrow">WELCOME THE WHOLE TEAM</p><h2>Ready for your next family meeting.</h2><p>Find presentation slides, editable materials, and the family guide in one place.</p></div><div class="buttons"><a class="button outline" href="#downloads?group=presenters">Presenter resources →</a><a class="button outline" href="#families">Families hub</a></div></section><div class="grid two">'+D.guides.map(g=>'<article class="card"><p class="eyebrow">'+esc(g.label)+'</p><h3>'+esc(g.title)+'</h3><p>'+esc(g.description)+'</p><a class="card-link" href="#guide/'+g.id+'">Read the guide →</a></article>').join("")+'</div>'+section("Official USA Wrestling resources",'<ul class="link-list">'+D.resources.map(r=>'<li>'+ext(r.url,esc(r.title))+'<p class="fine">'+esc(r.description)+'</p></li>').join("")+'</ul>')+note('<strong>How to read the video links.</strong> We prioritize genuine YouTube Shorts when a suitable demonstration is available. Some cards use a fuller lesson, a component demonstration, or a related variation. The note beside each video explains the fit. Titles, source links, and available publisher metadata were checked; this is not a claim that every clip received a fresh frame-by-frame review. Original research, selected variants, and evidence limits remain on each move page.')+note('<strong>Before practice:</strong> confirm the group’s readiness, space, pairings, stop signal, and applicable club/event requirements. The program blueprint preserves its September 2026 source dates; use the linked official pages to check current requirements.');
}
function guide(id){
 const g=D.guides.find(x=>x.id===id);if(!g)return notFound();
 return '<a class="back" href="#coaching">← Coaching resources</a>'+(id==="toolkit"?note('<strong>Adapt these templates for your club.</strong> Welcome messages and blank fields are starting points. Confirm current contacts, schedules, and competition expectations for each group with the club before sharing, including whether events are optional or required.'):"")+'<div class="guide-layout"><aside class="toc"><p class="eyebrow">IN THIS GUIDE</p>'+g.toc.map(h=>'<a href="#guide/'+id+'" data-scroll="'+h.id+'">'+esc(h.title)+'</a>').join("")+'</aside><article class="prose">'+g.html+'</article></div>';
}

function downloads(){
 const groups=[
 {id:"coaches",title:"Coaches",description:"Practice plans, move references, games, and the preserved coaching library.",items:D.downloads},
 {id:"families",title:"Families",description:"Printable guides and quick references for parents and caregivers.",items:(F.downloads||[]).filter(d=>d.group==="families")},
 {id:"presenters",title:"Presenters",description:"Materials for introducing the program and preparing a family or volunteer meeting.",items:(F.downloads||[]).filter(d=>d.group==="presenters")}
 ];
 return pageTitle("TAKE IT WITH YOU","Resources for the whole team.","Choose the materials for coaches, families, or presenters. PDFs open for reading and printing; editable files and archives download to your device.")+
 '<nav class="download-nav" aria-label="Download groups">'+groups.map(g=>'<a href="#downloads?group='+g.id+'" data-scroll="downloads-'+g.id+'" data-download-group="'+g.id+'">'+g.title+' <span>'+g.items.length+'</span></a>').join("")+'</nav>'+
 groups.map(g=>'<section id="downloads-'+g.id+'" class="download-group" tabindex="-1"><div class="section-head"><div><p class="eyebrow">DOWNLOADS</p><h2>'+g.title+'</h2><p>'+g.description+'</p></div></div>'+(g.id==="coaches"?note('<strong>Binder print setup:</strong> Letter · 100% scale · double-sided · flip on long edge. The 208-page binder is 104 sheets with alternating binding margins. Append the eight-page extra games addendum as pages 209–216 (108 sheets total). The original binder, index, and ZIP do not include the addendum. Family and presenter materials are separate downloads.'):"")+'<div class="grid">'+g.items.map(downloadCard).join("")+'</div></section>').join("");
}

function savedPage(){
 const groups=[
  {title:"Practices",items:D.practices.filter(x=>saved.has(practiceSaveId(x))),card:practiceCard},
  {title:"Written moves",items:D.moves.filter(x=>saved.has(x.id)),card:moveCard},
  {title:"Written games",items:D.games.filter(x=>saved.has(x.id)),card:gameCard},
  {title:"Coach Kyle’s collection",items:(K.entries||[]).filter(x=>saved.has("kyle:"+x.id)),card:kyleCard},
  {title:"Facebook clips",items:(V.entries||[]).filter(x=>saved.has("facebook:"+x.id)),card:practiceVideoLibraryCard}
 ];
 return pageTitle("YOUR MAT-SIDE LIST","Saved for next time.","Tap the star on any practice, move, game, or video entry to keep it here. "+(storageAvailable?"This list stays in this browser on this device.":"Browser storage is unavailable. Saved items last for this visit."))+(groups.some(group=>group.items.length)?groups.filter(group=>group.items.length).map(group=>'<div class="section-head"><h2>'+group.title+'</h2></div><div class="grid">'+group.items.map(group.card).join("")+'</div>').join(""):'<div class="empty"><h2>Start with a favorite.</h2><p>Save a practice, move, game, or video with the star button, then come back here before practice.</p><div class="buttons"><a class="button" href="#moves">Explore moves</a><a class="button outline" href="#practices">Find a practice</a></div></div>');
}
function notFound(){return pageTitle("COACH LIBRARY","That page isn’t in the playbook.","Use the library navigation to find a move, game, or practice.")+'<a class="button" href="#home">Back to the library</a>';}
function render(){
 const {path,params}=route(),parts=path.split("/");
 if((parts[0]==="move"||parts[0]==="game")&&parts.length===2&&params.has("variation")){
  const v=(V.entries||[]).find(x=>x.id===params.get("variation")&&(x.guide_ids||[]).includes(parts[1]));
  if(v&&byId[parts[1]]&&(parts[0]==="game")===parts[1].startsWith("G")){history.replaceState(null,"","#moves/videos/"+v.id);return render();}
 }
 if(path==="about/coach/ryan-devaris"){history.replaceState(null,"","#about/coach/ryan-devries"+(params.size?"?"+params:""));return render();}
 if(path==="moves/kyle/bio"){history.replaceState(null,"","#about/kyle"+(params.size?"?"+params:""));return render();}
 if(parts[0]==="kyle"){history.replaceState(null,"","#moves/"+path+(params.size?"?"+params:""));return render();}
 let html;
 if(path==="home")html=home();
 else if(["moves","games","practices"].includes(path))html=listing(path,params);
 else if(parts[0]==="move")html=moveDetail(parts[1]);
 else if(parts[0]==="game")html=gameDetail(parts[1]);
 else if(parts[0]==="practice")html=practiceDetail(parts[1],parts[2]);
 else if(path==="coaching")html=coaching();
 else if(path==="sponsors")html=sponsors();
 else if(path==="moves/videos")html=practiceVideoList(params);
 else if(parts.length===3&&parts[0]==="moves"&&parts[1]==="videos")html=practiceVideoDetail(parts[2]);
 else if(path==="moves/kyle")html=kyleList(params);
 else if(path==="about")html=about();
 else if(path==="about/kyle")html=kyleBio();
 else if(path==="about/coaches")html=coachDirectory();
 else if(parts[0]==="about"&&parts[1]==="coach")html=coachProfile(parts[2]);
 else if(parts[0]==="moves"&&parts[1]==="kyle")html=kyleDetail(parts[2]);
 else if(path==="families")html=families();
 else if(path==="family/faq")html=familyFaq(params);
 else if(parts[0]==="family")html=familyArticle(parts[1]);
 else if(path==="volunteer")html=volunteer();
 else if(parts[0]==="guide")html=guide(parts[1]);
 else if(path==="downloads")html=downloads();
 else if(path==="saved")html=savedPage();
 else html=notFound();
 main.innerHTML=html;
 document.querySelectorAll(".site-header nav a").forEach(a=>{const active=a.getAttribute("href")==="#"+({move:"moves",game:"games",practice:"practices",guide:"coaching",family:"families",volunteer:"coaching"}[parts[0]]||parts[0]);a.classList.toggle("active",active);active?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current");});
 updateSavedCount();
 if(["moves","games","practices"].includes(path)){updateResults(path,params);const form=document.getElementById("filter-form");form.addEventListener("submit",e=>e.preventDefault());const update=()=>{const next=new URLSearchParams();new FormData(form).forEach((v,k)=>{if(v)next.set(k,v);});if(form.querySelector("#include-unassigned")?.checked===false)next.set("unassigned","0");history.replaceState(null,"","#"+path+(next.size?"?"+next:""));updateResults(path,next);};form.addEventListener("input",update);form.addEventListener("reset",()=>setTimeout(()=>{form.querySelectorAll("input,select").forEach(el=>{if(el.type==="checkbox")el.checked=true;else el.value="";});update();},0));}
 if(path==="moves/videos"){updatePracticeVideos(params);const form=document.getElementById("variation-form");form.addEventListener("submit",e=>e.preventDefault());const update=()=>{const next=new URLSearchParams();new FormData(form).forEach((v,k)=>{if(v)next.set(k,v);});history.replaceState(null,"","#moves/videos"+(next.size?"?"+next:""));updatePracticeVideos(next);};form.addEventListener("input",update);form.addEventListener("reset",()=>setTimeout(()=>{form.querySelectorAll("input,select").forEach(el=>el.value="");update();document.getElementById("variation-search").focus();},0));}
 if(path==="family/faq"){updateFaq(params);const form=document.getElementById("faq-form");form.addEventListener("submit",e=>e.preventDefault());const update=()=>{const q=document.getElementById("faq-search").value;const next=new URLSearchParams();if(q)next.set("q",q);history.replaceState(null,"","#family/faq"+(next.size?"?"+next:""));updateFaq(next);};form.addEventListener("input",update);form.addEventListener("reset",()=>setTimeout(()=>{document.getElementById("faq-search").value="";update();document.getElementById("faq-search").focus();},0));}
 if(path==="moves/kyle"){updateKyle(params);const form=document.getElementById("kyle-form");form.addEventListener("submit",e=>e.preventDefault());const update=()=>{const next=new URLSearchParams();new FormData(form).forEach((v,k)=>{if(v)next.set(k,v);});history.replaceState(null,"","#moves/kyle"+(next.size?"?"+next:""));updateKyle(next);};form.addEventListener("input",update);form.addEventListener("reset",()=>setTimeout(()=>{document.getElementById("kyle-search").value="";document.getElementById("kyle-category").value="";document.getElementById("kyle-legacy-category").value="";document.getElementById("kyle-kind").value="";document.getElementById("kyle-featured").checked=false;update();document.getElementById("kyle-search").focus();},0));document.querySelector(".kyle-categories").addEventListener("click",e=>{const button=e.target.closest("[data-kyle-category]");if(button){document.getElementById("kyle-category").value=button.dataset.kyleCategory;document.getElementById("kyle-legacy-category").value="";update();}});}
 document.title=(main.querySelector("h1")?.textContent||"Coach Library")+" | Grindstone Wrestling";
 window.scrollTo({top:0,behavior:"instant"});
 if((parts[0]==="move"||parts[0]==="game")&&params.has("variation"))requestAnimationFrame(()=>{const target=document.getElementById("variation-"+params.get("variation"));target?.scrollIntoView({behavior:"instant"});target?.focus({preventScroll:true});});
 if(path==="downloads"&&["coaches","families","presenters"].includes(params.get("group")))requestAnimationFrame(()=>{const target=document.getElementById("downloads-"+params.get("group"));target?.scrollIntoView({behavior:"instant"});target?.focus({preventScroll:true});});
}
document.addEventListener("error",e=>{const image=e.target;if(image instanceof HTMLImageElement&&image.hasAttribute("data-coach-image")){image.hidden=true;image.closest(".coach-photo-frame")?.classList.add("is-fallback");}if(image instanceof HTMLImageElement&&image.hasAttribute("data-kyle-image")){image.hidden=true;image.closest(".kyle-thumbnail")?.classList.add("is-fallback");}if(image instanceof HTMLImageElement&&image.hasAttribute("data-sponsor-image")){image.hidden=true;image.closest(".sponsor-logo")?.classList.add("is-fallback");}},true);
document.addEventListener("click",e=>{
 if(e.target.closest("[data-variation-clear]"))document.getElementById("variation-form")?.reset();
 if(e.target.closest("[data-kyle-clear]"))document.getElementById("kyle-form")?.reset();
 const skip=e.target.closest(".skip");if(skip){e.preventDefault();main.focus({preventScroll:true});main.scrollIntoView({behavior:"instant"});return;}
 const faqToggle=e.target.closest("[data-faq-toggle]");if(faqToggle)document.querySelectorAll(".faq-item").forEach(d=>d.open=faqToggle.dataset.faqToggle==="open");
 if(e.target.closest("[data-faq-clear]"))document.getElementById("faq-form")?.reset();
 const b=e.target.closest("[data-save]");if(b){
  const id=b.dataset.save;if(!Object.hasOwn(saveRecords,id))return;
  saved.has(id)?saved.delete(id):saved.add(id);
  try{localStorage.setItem("grindstone-saved",JSON.stringify([...saved]));storageAvailable=true;}catch{storageAvailable=false;}
  document.querySelectorAll("[data-save]").forEach(button=>{if(button.dataset.save!==id)return;button.setAttribute("aria-pressed",saved.has(id));button.setAttribute("aria-label",(saved.has(id)?"Unsave ":"Save ")+saveRecords[id].name);button.textContent=saved.has(id)?"★":"☆";});
  updateSavedCount();const t=document.getElementById("toast");t.textContent=saved.has(id)?(storageAvailable?"Saved for next time":"Saved for this visit; browser storage unavailable"):(storageAvailable?"Removed from saved":"Removed for this visit; browser storage unavailable");t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1800);
  if(route().path==="saved"){render();(main.querySelector("[data-save]")||main).focus({preventScroll:true});}
 }
 if(e.target.closest("[data-print]"))window.print();
 if(e.target.closest("[data-clear]"))document.getElementById("filter-form")?.reset();
 const scroll=e.target.closest("[data-scroll]");if(scroll){e.preventDefault();if(scroll.dataset.downloadGroup)history.replaceState(null,"","#downloads?group="+scroll.dataset.downloadGroup);const target=document.getElementById(scroll.dataset.scroll);target?.scrollIntoView({behavior:"smooth"});target?.focus({preventScroll:true});}
});
window.addEventListener("hashchange",render);render();
})();
