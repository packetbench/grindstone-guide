'use strict';
// Integrate the dated coach-research reports without changing frozen photo archives.
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'coach-drafts');
function safe(file){
 const full=path.resolve(dir,file);
 if(full.length>200||!full.startsWith(dir+path.sep))throw Error('Unsafe output path');
 for(const part of full.slice(path.parse(full).root.length).split(path.sep))if(part.length>255||/[<>:"|?*\x00-\x1f]/.test(part)||/^ | $|\.$/.test(part)||/^(con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)/i.test(part)||/_vti_/i.test(part))throw Error('Unsafe component');
 if(file.length>64||!/^[a-z0-9_-]+\.[a-z0-9]+$/.test(file))throw Error('Unsafe filename');
 const siblings=fs.readdirSync(dir).filter(x=>x.toLowerCase()===file.toLowerCase());
 if(siblings.length>1||(siblings.length===1&&siblings[0]!==file))throw Error('Name collision');
 return full;
}
const read=f=>fs.readFileSync(path.join(dir,f),'utf8');
const write=(f,s)=>fs.writeFileSync(safe(f),s,'utf8');
const data=JSON.parse(read('facebook-queue.json'));
const brian=data.coaches.find(p=>p.id==='brian-leaf'),jess=data.support.find(p=>p.id==='jessica-cody-hughes');
function review(q,status,note,actual=[]){return {queue_id:q.id,queued_query:q.text,status,note,actually_searched:actual.length>0,actual_search_ids:actual};}
const attemptsB=[
 {id:'b-matrats',query:'Brian',surface:'Mat Rats page internal search',url:'https://www.facebook.com/profile/100046488894033/search/?q=Brian',result:'Explicit no-results message.'},
 {id:'b-winters',query:'Brian',surface:'Legacy Winters Mill page internal search; specialist B',url:'https://www.facebook.com/profile/100063519762289/search/?q=Brian',result:'Explicit no-results message. Logged in specialist B report as well; counted once.'},
 {id:'b-norchester',query:'Brian Leaf Norchester',surface:'Facebook global search',url:'https://www.facebook.com/search/top/?q=Brian%20Leaf%20Norchester',result:'Visible results did not establish a youth-club connection.'},
 {id:'b-wrestling',query:'Brian Leaf wrestling',surface:'Facebook global search',url:'https://www.facebook.com/search/top/?q=Brian%20Leaf%20wrestling',result:'Unrelated wrestling posts and an unassigned namesake photo; no coach attribution established.'},
 {id:'b-connection',query:'Brian',surface:'User-supplied connection profile internal search',url:'https://www.facebook.com/profile/100000395008432/search/?q=Brian',result:'Business posts connect the supplied profile with Brian and Leaf Builders. Family material excluded from the coaching research.'},
 {id:'b-connection-wrestling',query:'wrestling',surface:'User-supplied connection profile internal search',url:'https://www.facebook.com/profile/100000395008432/search/?q=wrestling',result:'Explicit no-results message.'}
];
const attemptsJ=[
 {id:'j-matrats',query:'Jessica',surface:'Mat Rats page internal search',url:'https://www.facebook.com/profile/100046488894033/search/?q=Jessica',result:'Account-visible results were friends-only. No private post contents or photo links retained.'},
 {id:'j-westcarroll',query:'Jessica Hughes West Carroll',surface:'Facebook global search',url:'https://www.facebook.com/search/top/?q=Jessica%20Hughes%20West%20Carroll',result:'Unrelated visible results; no attributable role or portrait.'},
 {id:'j-lacrosse',query:'Jessica Hughes North Carroll lacrosse',surface:'Facebook global search',url:'https://www.facebook.com/search/top/?q=Jessica%20Hughes%20North%20Carroll%20lacrosse',result:'Lacrosse posts link Jes Hughes at jes.markle. This does not connect to the confirmed jessica.m.larue profile; excluded from Jessica’s biography.'}
];
const bReviews=brian.queries.map(q=>{
 const n=Number(q.id.split('-').at(-1));
 if(n===1)return review(q,'reviewed-no-result','Consolidated club check used the Mat Rats page’s Brian search, not this exact global phrase. No results.', ['b-matrats']);
 if(n===19)return review(q,'reviewed-no-result','Legacy Winters Mill page’s Brian search returned no results.', ['b-winters']);
 if(n===7)return review(q,'reviewed-no-result','Broad Brian Leaf wrestling search did not establish an attributable wrestling source.', ['b-wrestling']);
 if(n===31)return review(q,'reviewed-no-result','Norchester query returned no relevant connection; the old school candidate remains unadopted.', ['b-norchester']);
 if(n===17)return review(q,'reviewed-found','The user supplied a correct connection profile. Its business posts associate Brian with Leaf Builders; no wrestling portrait or career record established.', ['b-connection','b-connection-wrestling']);
 if([2,14,21,22,26,32].includes(n))return review(q,'duplicate/superseded','Unassigned middle-name or school candidate. Superseded by the user’s specific connection lead; not rerun and not included in the biography.');
 if([18,30].includes(n))return review(q,'duplicate/superseded','Business variants consolidated into the user-supplied connection review. No separate exact search claimed.');
 return review(q,'duplicate/superseded','Overlapping club or wrestling query consolidated into the recorded Mat Rats, Winters Mill, and broad wrestling checks; this exact phrase was not rerun.');
});
const jReviews=jess.queries.map(q=>{
 const n=Number(q.id.split('-').at(-1));
 if(n===2)return review(q,'reviewed-no-result','Consolidated Mat Rats Jessica search produced restricted posts only; excluded from public research.', ['j-matrats']);
 if(n===16)return review(q,'reviewed-no-result','West Carroll query produced no attributable role or photo.', ['j-westcarroll']);
 if(n===23)return review(q,'reviewed-no-result','Lacrosse material points to a separate profile URL; no source links that profile to Coach Jessica. Not adopted.', ['j-lacrosse']);
 if([1,3,4,5,6].includes(n))return review(q,'already-resolved','Jessica’s identity and coaching role are confirmed, with an existing credited public portrait. Cody is not a current coach profile. No new search needed to reconfirm this.');
 return review(q,'duplicate/superseded','Retained historical query; overlapping club/recreation variants were consolidated into the three recorded checks. This exact query was not rerun and its unproven background is not adopted.');
});
const reportD={version:1,checked_on:'2026-10-29',method:'Actual signed-in Facebook UI searches. Repeated variants are dispositioned, not represented as separately executed. Private content excluded. Current roster identities confirmed by the user.',coaches:[
 {id:brian.id,name:brian.name,summary:'Identity confirmed. The user’s new connection lead associates Brian with Leaf Builders, but this pass found no attributable historical wrestling photo. Club searches on both Mat Rats and legacy Winters Mill returned no results.',actual_searches:attemptsB,query_reviews:bReviews,remaining_gaps:['A public named wrestling or coaching photograph.','A named youth-team source supporting specific career dates or school affiliation.']},
 {id:jess.id,name:'Jessica M. Hughes',summary:'Coach Jessica’s identity, role, and existing public portrait are confirmed. No additional public coaching photo found. The North Carroll lacrosse result uses a separate profile and has not been added to her biography.',actual_searches:attemptsJ,query_reviews:jReviews,remaining_gaps:['A public named coaching or club-event photograph.']}
]};
write('fb-check-d.json',JSON.stringify(reportD,null,2)+'\n');
const reports=['a','b','c','d'].map(letter=>({file:'fb-check-'+letter+'.json',data:JSON.parse(read('fb-check-'+letter+'.json'))}));
const people=[...data.coaches,...data.support];
const currentContext={
 'brian-leaf':'Brian’s identity and Pennsylvania youth-heavyweight background are club confirmed. The new user-supplied connection provides a better starting point than unassigned school namesakes. No historical wrestling portrait is assigned.',
 'jordan-millman':'Identity confirmed. Existing public open-mat and Mat Rats posts are retained; a precise current group assignment has not been supplied.',
 'andy-millman':'Identity confirmed. The promoter’s April 2019 schedule establishes planned participation against Michael Mehl; a result or named bout photograph is still missing.',
 'tyler-lease':'Identity and employer portrait confirmed. School and baseball records remain routes for additional named sports photographs.',
 'brad-gabrish':'Identity and current portrait confirmed. Lucky Ducks team and tournament sources are retained; new named tournament imagery is linked in the shared results.',
 'daniel-skelonc':'Identity and police portrait confirmed. Cedar Springs and the 1997 youth results remain historical-photo research routes.'
};
for(const person of people){
 if(currentContext[person.id])person.context=currentContext[person.id];
 const matches=reports.flatMap(r=>(r.data.coaches||[]).filter(p=>p.id===person.id).map(p=>({p,file:r.file})));
 if(matches.length!==1)throw Error('Missing/duplicate report for '+person.id);
 const {p,file}=matches[0],reviews=p.query_reviews||p.queries;
 person.research={reviewed:'2026-10-29',summary:p.summary,report:file,remaining:p.remaining_gaps||p.outstanding||p.gaps||[]};
 for(const query of person.queries){
  const r=reviews.find(x=>(x.queue_id||x.query_id||x.id)===query.id);
  if(!r)throw Error('Missing query review '+query.id);
  query.research_status=r.status;
  query.research_note=r.note||r.result||r.summary||(typeof r.evidence==='string'?r.evidence:'');
  if(!query.research_note)throw Error('Missing note '+query.id);
  query.research_report=file;
 }
}
data.version=2;
data.reviewed='2026-10-29';
data.review_summary='All 203 saved query variants have a research disposition. Independent searches and direct source reviews are recorded in the dated reports; duplicate and already-resolved queries were not all rerun. A no-result check describes the visible results inspected, not proof that no photograph exists.';
data.photo_findings=[
 {coach:'Brad Gabrish',title:'Named 2025 tournament photo',url:'https://www.facebook.com/photo/?fbid=1239103658216331&set=a.503509121775792',note:'Elevate Fitness, April 11, 2025. The composite names Brad first and Clayton Arnold second. Keep the full composite; no individual crop has been assigned.'},
 {coach:'Mike Handleman',title:'Public Cagezilla win photo',url:'https://www.facebook.com/photo/?fbid=775911130991169&set=a.590078242907793',note:'CCK Martial Arts/Kenpo Self Defense, June 18, 2023. The caption congratulates Mike on his win; group collage retained at its original source.'},
 {coach:'Jerome Featherstone',title:'Named championship photo',url:'https://www.facebook.com/photo/?fbid=5726869790702423&set=a.1825582217497886',note:'Carl Kus, November 13, 2022. Caption identifies Jerome as the new Shogun Fights 155-pound champion; includes his corner team.'},
 {coach:'Ryan DeVries',title:'Coach Ryan in Mat Rats gear',url:'https://www.facebook.com/photo/?fbid=10108817500365692&set=pcb.10108817507745902',note:'Publicly posted by Ryan. His shirt reads Coach Ryan and Mat Rats Wrestling. Photographer credit is not visible; no identity is assigned to the young wrestler beside him.'}
];
jess.name='Jessica M. Hughes';
jess.context='Coach Jessica is confirmed. Historical Cody and family-support query wording is preserved for traceability; Cody is not listed as a coach. Existing public originals remain in the source archive.';
data.notes=[...new Set([...(data.notes||[]),'October 29: user confirmed the current coach identities. Unassigned faces and unrelated namesake leads are not confirmed by that statement.'])];
write('facebook-queue.json',JSON.stringify(data,null,2)+'\n');
let html=read('facebook-queue.html');
html=html.replace(/(<script[^>]*id="queue-data"[^>]*>)[\s\S]*?(<\/script>)/,'$1'+JSON.stringify(data).replace(/</g,'\\u003c')+'$2');
html=html.replace('Prepared October 24, 2026 · Search leads for review · Research continues independently','Reviewed October 29, 2026 · Public research outcomes and remaining gaps');
html=html.replace('Facebook research queue · October 24, 2026','Facebook research review · October 29, 2026').replace('Searches to work through.','Facebook research results.').replace('Photo and post searches for all 13 coaches, plus Jessica M. and Cody Hughes in program support. Mark searches you have tried and save useful links or corrections beside each coach.','The current coach identities are confirmed. Review the new public photo links and research outcomes below; your own checkboxes and notes stay separate.').replace('searches checked<br>13 coaches + program support','your checks<br>14 coach research records').replace('These searches are for you to work through. Independent public-source research continues alongside this queue; having a search queued does not mean the research stopped.','The shared review records what was found, what was already resolved, and which overlapping searches were consolidated. It does not automatically check your personal boxes.').replace('School, business and spelling leads may be tentative.','Current coach identities are confirmed. Unassigned photo subjects and separate namesake leads still need source evidence.').replaceAll('Jessica M. and Cody Hughes','Jessica M. Hughes').replaceAll('Hughes · program support','Jessica Hughes').replaceAll('All coaches + program support','All coaches').replace('<p class="eyebrow">People who help make it happen</p>','<p class="eyebrow">Coach · historical support searches</p>');
write('facebook-queue.html',html);
const sandbox={window:{}};vm.runInNewContext(read('profiles.js'),sandbox);const profiles=sandbox.window.COACH_DRAFTS;
profiles.status='Confirmed coach identities; continuing career and photo research';
for(const p of profiles.profiles){
 p.identity_confirmed=true;p.identity_confirmed_on='2026-10-29';p.profile_review_status='Identity confirmed by user October 29, 2026';p.review_title='Identity confirmed';
 p.identity_note='The user confirmed that this is the correct coach. Career sources, photo captions and additional research remain available below.';
 if(p.id==='brian-leaf')p.identity_note+=' His Pennsylvania youth-heavyweight background is club supplied. The previously rejected PINKS racer remains excluded; no new historical wrestling photo is assigned.';
 if(p.id==='brian-leaf')for(const lead of p.leads||[])if((lead.url||'').includes('leafhomebuilders'))lead.supports='The user supplied a correct local connection on October 29. Business posts on that profile associate Brian with Leaf Builders, giving this route new context. No named wrestling photograph or career record was found through it.';
 if(p.id==='jessica-hughes')p.identity_note+=' Jessica is listed as Coach, without a specific group assignment.';
 p.review_prompt='Share any corrections to the biography, current group assignment, or photo captions. The coach’s identity is confirmed.';
 if(p.status!=='existing')p.status='confirmed';
 const find=data.photo_findings.find(f=>f.coach===p.name);
 if(find){p.leads=p.leads||[];if(!p.leads.some(x=>x.url===find.url))p.leads.unshift({title:find.title,url:find.url,supports:find.note});}
}
write('profiles.js','window.COACH_DRAFTS = '+JSON.stringify(profiles,null,2)+';\n');
let app=read('app.js');
app=app.replace("labels[p.status]+'</span>'","(p.identity_confirmed?'Identity confirmed':labels[p.status])+'</span>'").replace("||'Not reviewed'","||(p.identity_confirmed?'Identity confirmed':'Not reviewed')").replace('These research pages retain sources, photo candidates and working matches for future corrections.','The coach identities shown here are confirmed. These research pages retain career sources, photo candidates and notes for future additions.').replace('Other draft identities are still open for review.','Current coach identities are confirmed. Separate unassigned namesake leads are not part of the coaching roster.').replace('Draft profile · awaiting your review','Identity confirmed · career and photo research').replace('Research and photo notes</summary>','Research history and photo notes</summary>');
write('app.js',app);
for(const name of ['index.html','facebook-queue.html']){
 let text=read(name);
 text=text.replace(/((?:src|href)="([^"?]+\.(?:js|css)))(?:\?v=[^"&]+)?"/g,(m,prefix,file)=>{
  const full=path.resolve(dir,file);if(!fs.existsSync(full))return m;
  const hash=crypto.createHash('sha256').update(fs.readFileSync(full,'utf8').replace(/\r\n/g,'\n')).digest('hex').slice(0,16);return prefix+'?v='+hash+'"';
 });
 if(name==='index.html')text=text.replace('2026–2027 · REVIEW DRAFT','2026–2027 · IDENTITIES CONFIRMED').replace('Updated October 28, 2026 · Public working draft','Updated October 29, 2026 · Confirmed identities and research notes');
 write(name,text);
}
console.log(JSON.stringify({coaches:profiles.profiles.length,query_reviews:people.reduce((n,p)=>n+p.queries.length,0),new_photo_links:data.photo_findings.length}));
