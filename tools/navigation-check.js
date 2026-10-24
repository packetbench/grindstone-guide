"use strict";
// Dependency-free regression checks. Reads site files and creates no outputs.
const fs=require("fs"),path=require("path"),vm=require("vm"),assert=require("assert/strict");
const root=process.env.GRINDSTONE_TEST_ROOT||path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const dataFiles=["data.js","game-video-fixes.js","family-data.js","sponsors-data.js","kyle-data.js","kyle-instruction-data.js","coaches-data.js","video-additions.js","game-guides-a.js","game-guides-b.js","game-guides-c.js","game-guide-library.js","move-tags.js","series-moves.js","series-bottom.js","series-neutral.js","series-top.js","series-escapes.js","series-foundation.js","series-top-additions.js","series-neutral-additions.js","series-ready-additions.js","series-library.js","season-data.js","practice-frameworks.js","pathway-data.js","series-expansion.js","catalog-tags.js","skill-pathway.js","practice-weeks.js","practice-components.js","practice-builder.js","in-progress-data.js","in-progress.js","move-reactions.js"];
const clone=value=>JSON.parse(JSON.stringify(value));
const decode=text=>String(text).replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'");
function harness(initial="#moves",savedHistory){
 const elements={},docEvents={},winEvents={},frames=[],location={hash:initial,get href(){return 'https://packetbench.github.io/grindstone-guide/?v=test-preview'+this.hash;}};
 let focus="",renders=0,stack=savedHistory?clone(savedHistory.stack):[{hash:initial,state:null}],position=savedHistory?.position||0;
 if(savedHistory)location.hash=stack[position].hash;
 let fields=[];
 const attributes=markup=>Object.fromEntries(Array.from(markup.matchAll(/([\w-]+)="([^"]*)"/g),match=>[match[1],decode(match[2])]));
 function fieldList(html){
  const found=[];
  for(const match of html.matchAll(/<input\b([^>]*)>/g)){const attrs=attributes(match[1]);found.push({...attrs,value:attrs.value||"",type:attrs.type||"text",checked:/\bchecked\b/.test(match[1])});}
  for(const match of html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/g)){const attrs=attributes(match[1]),options=Array.from(match[2].matchAll(/<option\b([^>]*)>/g));const selected=options.find(option=>/\bselected\b/.test(option[1]))||options[0];found.push({...attrs,type:"select-one",value:attributes(selected?.[1]||"").value||""});}
  return found;
 }
 function node(id){
  if(elements[id])return elements[id];
  const item={id,dataset:{},events:{},textContent:"",classList:{add(){},remove(){}},focus(){focus=id;},setAttribute(name,value){this[name]=String(value);},getAttribute(name){return Object.hasOwn(this,name)?this[name]:null;},addEventListener(name,handler){this.events[name]=handler;},dispatchEvent(event){this.events[event.type]?.(event);},querySelector(selector){if(selector==="h1"){const title=this.innerHTML.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);return title?{textContent:title[1].replace(/<[^>]*>/g,"")}:null;}if(selector.startsWith("#"))return fields.find(field=>field.id===selector.slice(1))||null;return null;},querySelectorAll(selector){if(selector==="input,select")return fields;if(selector==="a[href]")return anchors();return [];},scrollIntoView(){}};
  let html="";Object.defineProperty(item,"innerHTML",{get:()=>html,set:value=>{html=value;if(id==="main"){fields=fieldList(value);renders++;}}});elements[id]=item;return item;
 }
 function anchors(){return Array.from((node("main").innerHTML+node("results").innerHTML).matchAll(/<a\b([^>]*)>/g),match=>{const attrs=attributes(match[1]);return {getAttribute:name=>attrs[name],focus(){focus=attrs.href;}};});}
 const history={get state(){return stack[position].state;},scrollRestoration:"auto",replaceState(state,unused,hash){stack[position]={state:clone(state),hash:hash||location.hash};location.hash=stack[position].hash;},pushState(state,unused,hash){stack=stack.slice(0,position+1);stack.push({state:clone(state),hash});position++;location.hash=hash;},back(){if(position){position--;location.hash=stack[position].hash;dispatch("popstate");dispatch("hashchange");}},forward(){if(position<stack.length-1){position++;location.hash=stack[position].hash;dispatch("popstate");dispatch("hashchange");}}};
 const window={scrollY:0,addEventListener(name,handler){(winEvents[name]||=[]).push(handler);},scrollTo({top}){this.scrollY=top;}};
 const context={console,URL,URLSearchParams,Date,Math,history,location,window,Event:class{constructor(type,options={}){this.type=type;Object.assign(this,options);}},requestAnimationFrame:callback=>frames.push(callback),setTimeout:callback=>{callback();return 0;},clearTimeout(){},localStorage:{getItem:()=>"[]",setItem(){}},document:{getElementById:id=>fields.find(field=>field.id===id)||node(id),querySelector:selector=>node(selector),querySelectorAll:selector=>selector==="[data-season-phase]"?[]:[],addEventListener(name,handler){docEvents[name]=handler;}},FormData:class{constructor(){this.values=fields.filter(field=>field.name&&(field.type!=="checkbox"||field.checked));}forEach(callback){this.values.forEach(field=>callback(field.value,field.name));}}};
 context.globalThis=context;vm.createContext(context);
 for(const file of dataFiles)vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),context,{filename:file});
 context.window.GRINDSTONE_BUILDER.bind=()=>{}; // Builder behavior has a separate full suite.
 const ending='window.addEventListener("popstate",historyNavigation);window.addEventListener("hashchange",historyNavigation);render({restore:true});';
 assert(app.includes(ending),"Test harness must match the application startup.");
 const exported='globalThis.api={safeRouteHash,backLink,navigateTo,rememberView,replaceRoute,render,libraryResults,filters,seasonPath,moveDetail,gameDetail,familyArticle,savedPage,saveRecords,currentCoachDownloads,downloads,home,historyNavigation,navigationSnapshot:()=>navigation};';
 vm.runInContext(app.replace(ending,ending.replace("render({restore:true});",exported)),context,{filename:"app.js"});
 function dispatch(name){for(const handler of winEvents[name]||[])handler({type:name});}
 function flush(){let count=0;while(frames.length){assert(count++<100,"Animation frame loop");frames.shift()();}}
 function clickReturn(){
  const match=node("main").innerHTML.match(/<a class="back" href="([^"]*)" data-return="([^"]*)">/);assert(match,"Expected contextual back link.");
  const anchor={dataset:{return:match[2]},getAttribute:name=>name==="href"?decode(match[1]):null,target:"",hasAttribute:()=>false};
  const event={button:0,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},target:{closest:selector=>selector==="a[href]"?anchor:null}};
  docEvents.click(event);flush();assert(event.defaultPrevented);
 }
 context.api.render({restore:true});flush();
 return {api:context.api,context,window,history,location,fields:()=>fields,elements,dispatch,flush,clickReturn,documentEvent(name,event){docEvents[name]?.(event);flush();},focus:()=>focus,renders:()=>renders,snapshot:()=>({stack:clone(stack),position}),navigate(hash){context.api.navigateTo(hash,hash);flush();},scroll(y){window.scrollY=y;dispatch("scroll");flush();}};
}
let checks=0;
const h=harness("#moves?q=single&tier=Beginner");
const initialId=h.history.state.grindstone.id;
h.scroll(720);h.navigate("#move/B07");
assert(h.elements.main.innerHTML.includes("Back to move results"));assert.equal(h.window.scrollY,0);
h.scroll(330);h.clickReturn();
assert.equal(h.location.hash,"#moves?q=single&tier=Beginner");assert.equal(h.window.scrollY,720);assert.equal(h.history.state.grindstone.id,initialId);checks++;
const before=h.renders();h.history.forward();h.flush();assert.equal(h.location.hash,"#move/B07");assert.equal(h.window.scrollY,330);assert.equal(h.renders(),before+1,"popstate/hashchange must render only once");checks++;
h.navigate("#season?age=7-10&phase=youth-2");h.scroll(480);h.navigate("#move/B01");h.scroll(260);h.navigate("#moves/videos/V01");
h.clickReturn();assert.equal(h.location.hash,"#move/B01");assert.equal(h.window.scrollY,260);
h.clickReturn();assert.equal(h.location.hash,"#season?age=7-10&phase=youth-2");assert.equal(h.window.scrollY,480);checks++;
for(const [list,detail,label] of [["#moves/kyle?q=stance&featured=1","#moves/kyle/K02","Back to Coach Kyle"],["#moves/videos?category=movement&q=shuffle","#moves/videos/V02","Back to Facebook"],["#games?age=4-6&minutes=4","#game/G01","Back to game results"],["#saved","#moves/kyle/K03","Back to saved items"]]){
 h.navigate(list);h.scroll(370);h.navigate(detail);assert(h.elements.main.innerHTML.includes(label));h.clickReturn();assert.equal(h.location.hash,list);assert.equal(h.window.scrollY,370);checks++;
}
h.navigate("#moves?category=bottom");h.scroll(555);h.navigate("#move/B14");h.scroll(321);
const refreshed=harness("#home",h.snapshot());assert.equal(refreshed.window.scrollY,321);refreshed.clickReturn();assert.equal(refreshed.location.hash,"#moves?category=bottom");assert.equal(refreshed.window.scrollY,555);checks++;
for(const unsafe of ["https://example.com","#//example.com","#javascript:alert(1)","javascript:alert(1)","#move/../../other","#moves\n#home","#family/<script>"])assert.equal(h.api.safeRouteHash(unsafe),"");
assert.equal(h.api.safeRouteHash("#moves?q=a%26b"),"#moves?q=a%26b");checks++;
const listingId=h.history.state.grindstone.id,historyLength=h.snapshot().stack.length;h.api.replaceRoute("#moves?q=updated&category=bottom");assert.equal(h.history.state.grindstone.id,listingId);assert.equal(h.snapshot().stack.length,historyLength);checks++;
const D=h.context.window.GRINDSTONE,S=h.context.window.GRINDSTONE_PATHWAY;
const frameworkData=h.context.window.GRINDSTONE_FRAMEWORKS;
const expansionModules=[h.context.window.GRINDSTONE_SERIES_NEUTRAL,h.context.window.GRINDSTONE_SERIES_TOP,h.context.window.GRINDSTONE_SERIES_ESCAPES,h.context.window.GRINDSTONE_SERIES_FOUNDATION];
const expandedSeries=expansionModules.flatMap(module=>module.series||[]);
const addedMoves=[...h.context.window.GRINDSTONE_SERIES_MOVES.entries,...h.context.window.GRINDSTONE_SERIES_BOTTOM.entries,...expansionModules.flatMap(module=>module.moves||[])];
const seriesById=new Map(S.series.map(item=>[item.id,item])),sequencesById=new Map(S.sequences.map(item=>[item.id,item]));
const escapeText=text=>String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const moveRoutes=new Map([...D.moves.map(item=>[item.id,"#move/"+item.id]),...h.context.window.GRINDSTONE_KYLE.entries.map(item=>[item.id,"#moves/kyle/"+item.id])]);
for(const group of S.groups)for(const phase of group.phases){
 h.navigate("#season?age="+group.age_group+"&phase="+phase.id);
 const html=h.elements.main.innerHTML;
 assert(html.includes(phase.title));assert(html.includes("Skills & connected techniques"));assert(html.includes("Strength & control"));assert(html.includes("Endurance & recovery"));assert(html.includes("Ready for the next phase?"));
 assert(!html.includes("#practice/"));
 if(phase.practice_cycle){
  assert(html.includes("Practice rhythm for this phase"));
  for(const [key,sessionId] of [["core_a","core-a"],["core_b","core-b"],["extension","extension"]]){
   const cycle=phase.practice_cycle[key];assert(cycle,"Missing practice cycle "+phase.id+"/"+key);assert(html.includes(escapeText(cycle.title)));
   const href="#practices?"+new URLSearchParams({age:group.age_group,phase:phase.id,session:sessionId});assert(html.includes('href="'+escapeText(href)+'"'),"Missing phase-to-builder context link "+href);
  }
 }
 for(const id of phase.series_ids){
  const series=seriesById.get(id);assert(series,"Unknown foundation series "+id);assert(!sequencesById.has(id));
  assert(series.age_groups.includes(group.age_group),id+" is not intended for "+group.age_group);
  assert(html.includes("series="+id+"&amp;age="+group.age_group)||html.includes("age="+group.age_group+"&amp;series="+id));
  assert(html.includes(escapeText(series.foundation)),id+" foundation missing from pathway");
  for(const branch of series.branches){
   for(const field of ["title","when","action",...(branch.readiness?["readiness"]:[])])assert(html.includes(escapeText(branch[field])),id+" branch "+field+" missing from pathway");
   for(const moveId of branch.move_ids){assert(moveRoutes.has(moveId),id+" branch references missing move "+moveId);assert(html.includes('href="'+moveRoutes.get(moveId)+'"'),id+" branch teaching link missing for "+moveId);}
  }
 }
 for(const id of phase.sequence_ids){
  const sequence=sequencesById.get(id);assert(sequence,"Unknown linked drill "+id);assert(!seriesById.has(id));
  assert(sequence.age_groups.includes(group.age_group),id+" is not intended for "+group.age_group);
  assert(html.includes("sequence="+id+"&amp;age="+group.age_group)||html.includes("age="+group.age_group+"&amp;sequence="+id));
 }
 if(phase.sequence_ids.length)assert(html.includes("Linked movement drills"));
 checks++;
}
for(const item of [...S.series,...S.sequences])assert(S.groups.some(group=>group.phases.some(phase=>[...phase.series_ids,...phase.sequence_ids].includes(item.id))),item.id+" has no pathway location");checks++;
for(const [parameter,id,type] of [["series",S.series[0].id,"series"],["sequence",S.sequences[0].id,"drill"],["series",S.sequences[0].id,"drill"]]){
 const route="#practices?age=11-14&"+parameter+"="+id;h.navigate(route);
 const state=h.context.window.GRINDSTONE_BUILDER.testing.getState();
 assert.equal(h.location.hash,route);assert.equal(state.picker.selected,"series:"+id);assert.equal(state.picker.type,type);assert.equal(state.plan.blocks.length,0);checks++;
}
const positionOf=series=>series.position||({S13:'bottom',S14:'neutral',S16:'top',S17:'neutral',S18:'neutral'}[series.id]);
h.navigate('#season?view=series');assert(h.elements.main.innerHTML.includes('<h1>Technique series</h1>'));
for(const series of S.series)assert(h.elements.main.innerHTML.includes('series='+series.id+'"'),series.id+' is missing from the series directory');checks++;
for(const position of ['foundation','neutral','top','bottom']){
 h.navigate('#season?view=series&position='+position);const html=h.elements.main.innerHTML;
 for(const series of S.series){const link='href="#season?view=series&amp;series='+series.id+'"';assert.equal(html.includes(link),positionOf(series)===position,'Incorrect '+position+' directory membership: '+series.id);}checks++;
}
for(const series of S.series){
 const route='#season?view=series&series='+series.id,fresh=harness(route),html=fresh.elements.main.innerHTML;
 assert.equal(fresh.location.hash,route);assert(html.includes('<h1>'+escapeText(series.title)+'</h1>'));assert(html.includes('Print series'));
 for(const text of [series.foundation,series.setup,series.readiness,series.boundaries,...series.steps,...series.branches.flatMap(branch=>[branch.title,branch.when,branch.action,branch.readiness].filter(Boolean))])assert(html.includes(escapeText(text)),series.id+' detail omitted instruction');
 for(const source of series.sources)assert(html.includes('href="'+escapeText(source.url)+'"'),series.id+' source link missing');
 for(const member of series.members)assert(html.includes('href="'+moveRoutes.get(member.move_id)+'"'),series.id+' member guide missing: '+member.move_id);
 if(series.verification)assert(html.includes(escapeText(series.verification)),series.id+' source scope omitted');
 assert(html.includes('href="#practices?series='+series.id+'"'));assert(html.includes('href="#moves?series='+series.id+'"'));checks++;
}
h.navigate('#season?view=series&series=S999');assert(h.elements.main.innerHTML.includes('Series not found'));assert(h.elements.main.innerHTML.includes('href="#season?view=series"'));assert(!h.elements.main.innerHTML.includes('Choose this series'));checks++;
h.navigate('#season?view=series&position=invalid');for(const series of S.series)assert(h.elements.main.innerHTML.includes(escapeText(series.title)));checks++;
for(const series of expandedSeries){
 assert(!series.age_groups.includes('4-6'));
 for(const phase of S.groups.find(group=>group.age_group==='4-6').phases)assert(!phase.series_ids.includes(series.id),'Advanced series placed into Pup phase: '+series.id);
 const results=h.api.libraryResults('moves',new URLSearchParams('series='+series.id)),members=new Set(series.members.map(member=>member.move_id));
 assert(results.length);assert(results.every(item=>members.has(item.id)));
 for(const member of series.members)assert(results.some(item=>item.id===member.move_id),series.id+' filter omitted '+member.move_id);checks++;
}
h.navigate("#season");assert.equal(h.location.hash,"#season");assert(h.elements.main.innerHTML.includes("Choose your teaching group"));checks++;
const seasonHtml=h.elements.main.innerHTML;
for(const program of frameworkData.programs){
 assert(seasonHtml.includes(escapeText(program.name)));assert(seasonHtml.includes(escapeText(program.location)));assert(seasonHtml.includes('href="#practices?program='+program.id+'"'));
 const fresh=harness("#practices?program="+program.id),state=fresh.context.window.GRINDSTONE_BUILDER.testing.getState();
 assert.equal(state.plan.program,program.id);assert.equal(state.plan.target,program.minutes);assert.equal(state.plan.startTime,program.start);assert.equal(state.plan.framework,program.defaultFramework);assert.equal(state.plan.age,"");assert.equal(state.plan.blocks.length,0);checks++;
}
for(const framework of frameworkData.frameworks){assert(seasonHtml.includes(escapeText(framework.title)));assert(seasonHtml.includes("Total: "+framework.minutes+" minutes."));checks++;}
assert(seasonHtml.includes("6:00 pm–8:00 pm"));assert(seasonHtml.includes("6:00 pm–7:00 pm"));assert(seasonHtml.includes("6:30 pm–8:00 pm"));checks++;
h.navigate("#practice/7-10/7");assert.equal(h.location.hash,"#practices?age=7-10");assert(h.elements.main.innerHTML.includes('id="practice-builder"'));assert(!h.elements.main.innerHTML.includes("PRACTICE 07"));checks++;
h.navigate("#practices");assert(h.elements.main.innerHTML.includes("Start blank"));assert(!h.elements.main.innerHTML.includes('id="filter-form"'));checks++;
for(const [entries,render] of [[D.moves,h.api.moveDetail],[D.games,h.api.gameDetail]])for(const entry of entries){const html=render(entry.id);for(const match of html.matchAll(/data-scroll="(guide-[^"]+)"/g))assert(html.includes('id="'+match[1]+'"'),"Missing guide jump target "+match[1]);}checks+=D.moves.length+D.games.length;
for(const move of addedMoves){
 assert.equal(D.moves.filter(item=>item.id===move.id).length,1,'New move must integrate once: '+move.id);
 const category=h.context.window.GRINDSTONE_TAGS.entries[move.id];assert(h.context.window.GRINDSTONE_TAGS.categories.some(item=>item.id===category),"New move has an invalid shared category: "+move.id+"/"+category);
 assert(h.api.libraryResults("moves",new URLSearchParams("category="+category)).some(item=>item.id===move.id),"New move missing from its category: "+move.id);
 const list="#moves?q="+move.id;h.navigate(list);assert(h.api.libraryResults("moves",new URLSearchParams("q="+move.id)).some(item=>item.id===move.id),"New move not searchable: "+move.id);
 h.navigate("#move/"+move.id);assert(h.elements.main.innerHTML.includes(escapeText(move.name)));assert(!h.elements.main.innerHTML.includes("undefined"));assert(!h.elements.main.innerHTML.includes("reference page undefined"));h.clickReturn();assert.equal(h.location.hash,list);checks++;
}
{
 const original={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),original);
 const previous=original.window.GRINDSTONE.videos.G16.video.url;
 assert.equal(D.videos.G16.video,null);assert.deepEqual(clone(D.videos.P11),clone(original.window.GRINDSTONE.videos.P11));
 h.navigate('#game/G16');const detail=h.elements.main.innerHTML;
 assert(detail.includes(escapeText(D.games.find(item=>item.id==='G16').name)));assert(!detail.includes(previous));assert(detail.includes('No public video'));
 assert(h.api.moveDetail('P11').includes(escapeText(D.videos.P11.video.url)),'P11 must retain its matching movement video');checks++;
}
for(const game of D.games){
 h.navigate('#game/'+game.id);const html=h.elements.main.innerHTML,plain=decode(html.replace(/<[^>]*>/g,''));
 assert(html.includes(escapeText(game.name)));assert(!html.includes('undefined'));
 for(const label of ['Scoring & success','Reset & change roles','Timing'])assert(decode(html).includes(label),game.id+' missing rules heading '+label);
 for(const text of [game.equipment,game.setup,game.play,game.scoring,game.reset,game.timing,game.boundary,...game.steps,...game.cues])assert(plain.includes(text),game.id+' page omitted: '+text);
 assert(html.includes('Print guide</strong> above for the current rules'));assert(html.includes('binder card is an earlier edition'));assert(html.includes('Archived game card'));
 assert(h.api.libraryResults('games',new URLSearchParams('q='+game.id)).some(item=>item.id===game.id),game.id+' missing from games search');checks++;
}
{
 const games=[...D.games.map(entry=>({entry,id:entry.id,path:'#game/'+entry.id})),...h.context.window.GRINDSTONE_KYLE.entries.filter(entry=>entry.kind==='game').map(entry=>({entry,id:'kyle:'+entry.id,path:'#moves/kyle/'+entry.id})),...h.context.window.GRINDSTONE_VIDEO_ADDITIONS.entries.filter(entry=>entry.kind==='game').map(entry=>({entry,id:'facebook:'+entry.id,path:'#moves/videos/'+entry.id}))];
 assert.equal(games.length,39);
 const fiveMinute=h.api.libraryResults('games',new URLSearchParams('minutes=5'));
 for(const {entry,id,path:route} of games){
   h.navigate(route);const html=h.elements.main.innerHTML;
   assert(html.includes('Game at a glance'));assert(html.includes('href="#practices?game='+encodeURIComponent(id)+'"'));
   for(const text of Object.values(entry.quick).filter(Boolean))assert(html.includes(escapeText(text)),id+' quick guidance omitted');
   assert(entry.description.length>20);assert(Number(entry.minutes)>0);
   assert(fiveMinute.some(item=>item.id===entry.id),id+' omitted from five-minute filter');checks++;
 }
}
for(const id of ["S13","S17"]){
 const series=seriesById.get(id);assert(series,"Expected shared series "+id);const memberIds=new Set(series.members.map(member=>member.move_id));
 const results=h.api.libraryResults("moves",new URLSearchParams("series="+id));assert(results.length,"Empty series filter "+id);assert(results.every(item=>memberIds.has(item.id)),"Series filter included unrelated guides: "+id);
 const eligible=new Set([...D.moves,...h.context.window.GRINDSTONE_KYLE.entries.filter(item=>item.kind!=="game")].map(item=>item.id));
 for(const memberId of memberIds)if(eligible.has(memberId))assert(results.some(item=>item.id===memberId),"Series filter omitted member "+memberId);
 h.navigate("#moves?series="+id);assert(h.elements.main.innerHTML.includes(escapeText(series.title)));checks++;
}
for(const id of ["K12","K13","K14"]){
 const series=seriesById.get("S17"),member=series.members.find(item=>item.move_id===id);assert(member,id+" must belong to the arm-drag series");
 const list="#moves/kyle?q="+id;h.navigate(list);
 const card=Array.from(h.elements["kyle-results"].innerHTML.matchAll(/<article\b[\s\S]*?<\/article>/g),match=>match[0]).find(markup=>markup.includes('data-save="kyle:'+id+'"'));
 const badge='<a class="badge category-tag" href="#moves?series=S17">'+escapeText(series.title)+'</a>';
 assert(card&&card.includes(badge),id+" collection card is missing its series badge");
 h.navigate("#moves/kyle/"+id);const detail=h.elements.main.innerHTML;
 assert(detail.split("</h1>")[0].includes(badge),id+" detail header is missing its series badge");
 const start=detail.indexOf("<h2>Where this fits</h2>");assert(start>=0,id+" detail is missing the membership panel");
 const panel=detail.slice(start,detail.indexOf("</section>",start));
 for(const text of [series.title,series.foundation,member.note].filter(Boolean))assert(panel.includes(escapeText(text)),id+" membership panel is missing its series context");
 assert(panel.includes('href="#practices?series=S17"'),id+" lacks its series planning link");
 assert(panel.includes('href="#moves?series=S17"'),id+" lacks its related series moves link");
 h.clickReturn();assert.equal(h.location.hash,list);checks++;
}
{
 const entry=h.context.window.GRINDSTONE_KYLE.entries.find(item=>item.id==='K18'),guide=h.context.window.GRINDSTONE_KYLE_INSTRUCTION.entries.K18;
 assert(guide.steps.length);assert(!/does not currently have a Peterson guide|no Peterson guide/i.test(entry.note));
 h.navigate('#moves/kyle/K18');const html=h.elements.main.innerHTML;
 assert(!html.includes('does not currently have a Peterson guide'));assert(html.includes(escapeText(guide.steps[0])));assert(html.includes(escapeText(guide.verification)));checks++;
}
for(const id of ["first-practice","programs-levels"]){const article=h.context.window.GRINDSTONE_FAMILY.pages.find(page=>page.id===id);assert(article.reviewed);assert(h.api.familyArticle(id).includes("reviewed "+article.reviewed));}checks++;
{
 const hub=harness('#families'),html=hub.elements.main.innerHTML;
 const links=Array.from(html.matchAll(/<a class="family-task" href="([^"]+)"/g),match=>decode(match[1]));
 assert.deepEqual(links,['#family/season-quickstart','#family/teamsnap','#family/first-practice','#family/first-practice?section=1','#family/first-practice?section=3','#family/meet-day','#family/match-basics','#family/health']);
 for(const link of links){
  hub.navigate(link);assert.equal(hub.location.hash,link);assert(!hub.elements.main.innerHTML.includes('<h1>Page not found'));
  const section=new URLSearchParams(link.split('?')[1]||'').get('section');
  if(section){const target='family-first-practice-'+section;assert(hub.elements.main.innerHTML.includes('id="'+target+'"'));assert.equal(hub.focus(),target);}
 }
 hub.navigate('#families');hub.fields().find(field=>field.id==='family-question').value='  shoes & gear  ';
 let prevented=false;hub.elements['family-hub-search'].dispatchEvent({type:'submit',preventDefault(){prevented=true;}});hub.flush();
 assert(prevented);assert.equal(hub.location.hash,'#family/faq?q=shoes+%26+gear');assert.equal(hub.fields().find(field=>field.id==='faq-search').value,'shoes & gear');
 hub.navigate('#families');hub.fields().find(field=>field.id==='family-question').value='   ';hub.elements['family-hub-search'].dispatchEvent({type:'submit',preventDefault(){}});hub.flush();assert.equal(hub.location.hash,'#family/faq');checks++;
}
for(const article of h.context.window.GRINDSTONE_FAMILY.pages){
 const html=h.api.familyArticle(article.id),toc=html.match(/<details class="family-mobile-toc"([^>]*)>/);
 assert(toc&&!/\bopen\b/.test(toc[1]),article.id+' contents should start collapsed');
 const related=html.indexOf('<nav class="family-related"');assert(related>0);
 for(let i=0;i<article.sections.length;i++){const target='family-'+article.id+'-'+i;assert(html.indexOf('id="'+target+'"')<related,article.id+' related links must follow the article');assert(html.includes('data-scroll="'+target+'"'));}checks++;
}
{
 const menuPage=harness('#families'),toggle=menuPage.elements['menu-toggle'],navigation=menuPage.elements['site-navigation'];
 const click=()=>menuPage.documentEvent('click',{target:{closest:selector=>selector==='[data-menu-toggle]'?toggle:null}});
 assert.equal(toggle.getAttribute('aria-expanded'),'false');assert.equal(navigation.getAttribute('data-open'),'false');
 click();assert.equal(toggle.getAttribute('aria-expanded'),'true');assert.equal(navigation.getAttribute('data-open'),'true');
 click();assert.equal(toggle.getAttribute('aria-expanded'),'false');assert.equal(navigation.getAttribute('data-open'),'false');
 click();menuPage.documentEvent('keydown',{key:'Escape'});assert.equal(toggle.getAttribute('aria-expanded'),'false');assert.equal(navigation.getAttribute('data-open'),'false');assert.equal(menuPage.focus(),'menu-toggle');
 click();menuPage.navigate('#family/first-practice');assert.equal(toggle.getAttribute('aria-expanded'),'false');assert.equal(navigation.getAttribute('data-open'),'false');checks++;
}
{
 const drafts=h.context.window.GRINDSTONE_IN_PROGRESS,draftApi=h.context.window.GRINDSTONE_DRAFTS,siteBase='https://packetbench.github.io/grindstone-guide/';
 assert(drafts.documents.length>=11,"Existing working proposals must remain available");assert.equal(new Set(drafts.documents.map(doc=>doc.id)).size,drafts.documents.length);for(const id of ["communication","season-quickstart","meet-opt-out","nutrition-handout","skin-return","gear-loans","volunteer-roles","weekly-coach-plan","station-equipment","event-logistics","document-archive"])assert(drafts.documents.some(doc=>doc.id===id),"Missing working proposal "+id);
 const categories=[...new Set(drafts.documents.map(doc=>doc.category))],draftIds=new Set(drafts.documents.map(doc=>doc.id));
 for(const category of ['',...categories,'unknown']){
  const hash='#in-progress'+(category?'?'+new URLSearchParams({category}):'');h.navigate(hash);const html=h.elements.main.innerHTML;
  assert(html.includes('<h1>In Progress</h1>'));assert(html.includes('not adopted club policy'));assert(html.includes('coaches’ text group'));assert(html.includes('does not save comments or shared edits'));
  const shown=Array.from(html.matchAll(/<a class="draft-card" href="#in-progress\/([a-z0-9-]+)"/g),match=>match[1]);
  const expected=drafts.documents.filter(doc=>!categories.includes(category)||doc.category===category).map(doc=>doc.id);assert.deepEqual(shown,Array.from(expected));
  for(const target of ['working-drafts','existing-resources']){assert(html.includes('data-scroll="'+target+'"'));assert(html.includes('id="'+target+'"'));}checks++;
 }
 for(const doc of drafts.documents){
  const hash='#in-progress/'+doc.id;assert.equal(h.api.safeRouteHash(hash),hash);h.navigate(hash);const html=h.elements.main.innerHTML,plain=decode(html.replace(/<[^>]*>/g,''));
  assert(html.includes('<h1>'+escapeText(doc.title)+'</h1>'));assert(html.includes('not adopted policy'));assert(html.includes('coaches’ text group'));assert(html.includes('does not save replies or shared edits'));assert(html.includes('data-print'));
  assert(doc.sections.length>=3&&doc.decisions.length&&doc.existing.length,doc.id+' needs a full draft with decisions and source links');
  const content=[doc.title,doc.summary,doc.why,doc.next_step,...doc.sections.flatMap(section=>[section.title,...section.paragraphs,...section.bullets]),...doc.decisions];
  for(const text of content)assert(plain.includes(text),doc.id+' page omitted draft content: '+text);
  for(const link of doc.existing)assert(html.includes('href="'+escapeText(link.href)+'"'),doc.id+' omitted an existing-resource link');
  const share=h.fields().find(field=>field.id==='draft-link');assert(share);assert.equal(share.value,siteBase+hash);assert(!share.value.includes('?'));assert(/id="draft-link" readonly/.test(html));
  const download=html.match(/href="data:text\/plain;charset=utf-8,([^"]+)" download="([^"]+)"/);assert(download,doc.id+' needs a text download');assert.equal(download[2],doc.id+'-draft.txt');
  const text=decodeURIComponent(decode(download[1]));assert.equal(text,draftApi.draftText(doc));
  for(const item of content)assert(text.includes(item),doc.id+' text download omitted draft content');
  assert(text.includes('DRAFT FOR COACH REVIEW'));assert(text.includes('does not save comments or shared edits'));assert(text.includes(siteBase+hash));assert(!text.includes('test-preview'));
  for(const link of doc.existing)assert(text.includes(new URL(link.href,siteBase).href),doc.id+' text export omitted a usable source link');checks++;
 }
 assert(drafts.existing_documents.length>=18,'Existing meeting resources must remain available');assert.equal(new Set(drafts.existing_documents.map(item=>item.id)).size,drafts.existing_documents.length);
 h.navigate('#in-progress');const hub=h.elements.main.innerHTML;
 const resources=[...drafts.existing_documents.map(item=>({href:item.href,label:item.title,...item})),...drafts.documents.flatMap(doc=>doc.existing)];
 for(const item of drafts.existing_documents){assert(hub.includes(escapeText(item.title)));assert(hub.includes(escapeText(item.summary)));assert(hub.includes('href="'+escapeText(item.href)+'"'));if(item.related_draft){assert(draftIds.has(item.related_draft));assert(hub.includes('href="#in-progress/'+item.related_draft+'"'));}}
 for(const href of new Set(resources.map(item=>item.href))){
  const url=new URL(href,siteBase);assert.equal(url.origin,new URL(siteBase).origin);assert(url.pathname.startsWith('/grindstone-guide/'));
  if(url.pathname.includes('/coach-drafts/')){const relative=decodeURIComponent(url.pathname.slice('/grindstone-guide/'.length));assert(relative.startsWith('coach-drafts/')&&relative.endsWith('.html'));assert(fs.existsSync(path.join(root,relative)),'Missing coach working page '+relative);}
  else if(url.hash){assert(h.api.safeRouteHash(url.hash),'Unrecognized existing resource route '+href);h.navigate(url.hash);assert(!h.elements.main.innerHTML.includes('That page isn’t in the playbook.'),'Broken existing resource route '+href);}
  else{const relative=decodeURIComponent(url.pathname.slice('/grindstone-guide/'.length));assert(relative.startsWith('downloads/')||(relative.startsWith('coach-drafts/')&&relative.endsWith('.html')),'Unexpected existing-resource path '+relative);assert(fs.existsSync(path.join(root,relative)),'Missing existing resource '+relative);}
 }checks++;
 h.navigate('#in-progress/missing-draft');assert(h.elements.main.innerHTML.includes('<h1>Draft not found</h1>'));assert(h.elements.main.innerHTML.includes('href="#in-progress"'));assert(!h.elements.main.innerHTML.includes('data-draft-copy'));checks++;
 for(const invalid of ['#in-progress/../../downloads','#in-progress/<script>','#in-progress/communication/extra'])assert.equal(h.api.safeRouteHash(invalid),'');checks++;
 const history=harness('#in-progress?category=Families');history.scroll(420);history.navigate('#in-progress/communication');history.scroll(180);history.history.back();history.flush();assert.equal(history.location.hash,'#in-progress?category=Families');assert.equal(history.window.scrollY,420);history.history.forward();history.flush();assert.equal(history.location.hash,'#in-progress/communication');assert.equal(history.window.scrollY,180);checks++;
}
const overview=h.context.window.GRINDSTONE_SKILL_PATHWAY.render(new URLSearchParams('age=4-6&phase=bad'));
assert(overview.includes(S.groups[0].phases[0].title));assert(overview.includes('aria-current="page"'));assert(!h.api.home().includes('ready-to-run practices'));assert(!h.api.home().includes('30 plans'));assert(!h.api.savedPage().includes('#practice/'));checks++;
const printable=h.api.currentCoachDownloads();assert.deepEqual(Array.from(printable,item=>item.pages),[14,66]);for(const item of printable)assert(fs.existsSync(path.join(root,item.path)));const downloadHtml=h.api.downloads();assert(downloadHtml.includes("pages 217–282"));assert(downloadHtml.includes("downloads/binder-index.pdf"));assert(h.api.home().includes("282 pages / 141"));checks++;
const shortForm=h.api.filters("moves",new URLSearchParams());assert(shortForm.indexOf('for="search"')<shortForm.indexOf('class="filter-options"'));assert(shortForm.indexOf('for="filter-position"')<shortForm.indexOf('class="filter-options"'));assert(!shortForm.includes('class="filter-options" open'));assert(h.api.filters("moves",new URLSearchParams("tier=Beginner")).includes('class="filter-options" open'));checks++;
assert.equal(h.api.libraryResults("moves",new URLSearchParams("tier=Beginner&type=facebook")).length,0);assert.equal(h.api.libraryResults("moves",new URLSearchParams("tier=Beginner&type=facebook&unassigned=1")).length,17);assert.equal(h.api.libraryResults("moves",new URLSearchParams("tier=Beginner&type=facebook&unassigned=0")).length,0);assert.equal(Object.keys(h.api.saveRecords).length,D.moves.length+D.games.length+D.practices.length+h.context.window.GRINDSTONE_KYLE.entries.length+h.context.window.GRINDSTONE_VIDEO_ADDITIONS.entries.length);checks++;
{
 const tags=h.context.window.GRINDSTONE_CATALOG_TAGS;
 for(const kind of ['moves','games'])for(const [key,list] of [['position','positions'],['purpose','purposes'],['use','uses']])for(const tag of tags.definitions[list]){
  const actual=h.api.libraryResults(kind,new URLSearchParams({[key]:tag.id}));
  const expected=h.api.libraryResults(kind,new URLSearchParams()).filter(item=>tags.resolve(item.id)[list].includes(tag.id));
  assert.deepEqual(Array.from(actual,item=>item.id),Array.from(expected,item=>item.id));
 }
 const pups=h.api.libraryResults('moves',new URLSearchParams('age=4-6'));
 assert(pups.some(item=>item.id==='P01'));assert(pups.every(item=>tags.resolve(item.id).age_groups.includes('4-6')));
 assert(!pups.some(item=>tags.resolve(item.id).ageStatus==='unassigned'));
 const expanded=h.api.libraryResults('moves',new URLSearchParams('age=4-6&unassigned=1'));
 assert(expanded.length>pups.length);assert(expanded.some(item=>item.unassigned_filters.includes('Age')));
 const essentials=h.api.libraryResults('moves',new URLSearchParams('core=1'));
 assert(essentials.some(item=>item.id==='N25'));assert(!essentials.some(item=>item.id==='B01'));
 assert(h.api.libraryResults('moves',new URLSearchParams('q=run+the+pipe')).some(item=>item.id==='B08'));
 const turn=h.api.libraryResults('moves',new URLSearchParams('position=top&purpose=turn&use=teach'));
 assert(turn.length);assert(turn.every(item=>{const t=tags.resolve(item.id);return t.positions.includes('top')&&t.purposes.includes('turn')&&t.uses.includes('teach');}));
 checks+=7;
}
const index=fs.readFileSync(path.join(root,"index.html"),"utf8"),scripts=Array.from(index.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g),match=>match[1].split("?")[0]);
assert(/<button\b[^>]*id="menu-toggle"[^>]*data-menu-toggle[^>]*aria-expanded="false"[^>]*aria-controls="site-navigation"/.test(index));assert(/<nav\b[^>]*id="site-navigation"[^>]*aria-label="Main navigation"/.test(index));checks++;
for(const file of dataFiles)assert(scripts.includes(file),"Production entry point missing "+file);
assert(scripts.indexOf('in-progress-data.js')<scripts.indexOf('in-progress.js'));assert(scripts.indexOf('in-progress.js')<scripts.indexOf('app.js'));assert(index.includes('href="#in-progress">In Progress</a>'));checks++;
for(const file of ['game-guides-a.js','game-guides-b.js','game-guides-c.js','kyle-instruction-data.js','video-additions.js'])assert(scripts.indexOf(file)<scripts.indexOf('game-guide-library.js'),file+' must load before game-guide-library.js');
for(const file of ['practice-builder.js','app.js'])assert(scripts.indexOf('game-guide-library.js')<scripts.indexOf(file),'Game guide integration must load before '+file);checks++;
for(const [earlier,later] of [["data.js","game-video-fixes.js"],["game-video-fixes.js","practice-builder.js"],["data.js","series-library.js"],["move-tags.js","series-library.js"],["series-moves.js","series-library.js"],["series-bottom.js","series-library.js"],...["series-neutral.js","series-top.js","series-escapes.js"].flatMap(file=>[["series-bottom.js",file],[file,"series-library.js"],[file,"series-expansion.js"]]),["series-library.js","practice-builder.js"],["series-library.js","skill-pathway.js"],["practice-frameworks.js","skill-pathway.js"],["practice-frameworks.js","practice-builder.js"],["pathway-data.js","series-expansion.js"],["series-expansion.js","skill-pathway.js"],["series-expansion.js","practice-builder.js"],["skill-pathway.js","app.js"],["practice-builder.js","app.js"]])assert(scripts.indexOf(earlier)<scripts.indexOf(later),earlier+" must load before "+later);checks++;

for(const [start,end] of [["#kyle/bio","#about/kyle"],["#kyle/bio?from=old","#about/kyle?from=old"],["#kyle/K01","#moves/kyle/K01"],["#moves/kyle/bio","#about/kyle"]]){
 const page=harness(start);assert.equal(page.location.hash,end);assert(!page.elements.main.innerHTML.includes("That page isn’t in the playbook."));checks++;
}
for(const start of ["#kyle/foo","#kyle/K01/extra","#kyle/../../other"]){
 const page=harness(start);assert(page.elements.main.innerHTML.includes("That page isn’t in the playbook."),"Invalid legacy route must fail gracefully: "+start);checks++;
}
for(const tier of ["Pup","Beginner","Advanced"]){
 const strict=h.api.libraryResults("moves",new URLSearchParams({tier}));assert(strict.length);assert(strict.every(item=>h.context.window.GRINDSTONE_CATALOG_TAGS.resolve(item.id)?.tier===tier),"Default tier results include unassigned or other-tier entries: "+tier);
 const expanded=h.api.libraryResults("moves",new URLSearchParams({tier,unassigned:"1"}));assert(expanded.length>strict.length);assert(expanded.every(item=>{const assigned=h.context.window.GRINDSTONE_CATALOG_TAGS.resolve(item.id)?.tier;return assigned===tier||!assigned;}));assert(expanded.some(item=>!h.context.window.GRINDSTONE_CATALOG_TAGS.resolve(item.id)?.tier&&item.unassigned_filters.includes("Tier")));checks++;
}
{
 const page=harness("#moves?tier=Pup");const checkbox=page.fields().find(field=>field.id==="include-unassigned");assert.equal(checkbox.checked,false);
 checkbox.checked=true;page.elements["filter-form"].dispatchEvent({type:"input",target:checkbox});page.flush();assert.equal(new URLSearchParams(page.location.hash.split("?")[1]).get("unassigned"),"1");
 checkbox.checked=false;page.elements["filter-form"].dispatchEvent({type:"input",target:checkbox});page.flush();assert.equal(new URLSearchParams(page.location.hash.split("?")[1]).has("unassigned"),false);
 checkbox.checked=true;page.elements["filter-form"].dispatchEvent({type:"reset"});page.flush();assert.equal(checkbox.checked,false);assert.equal(page.location.hash,"#moves");checks++;
}
{
 const page=harness("#season?view=series&series=S19"),closed={open:false},alreadyOpen={open:true};
 const original=page.elements.main.querySelectorAll;page.elements.main.querySelectorAll=selector=>selector===".pathway-series-card > details"?[closed,alreadyOpen]:original.call(page.elements.main,selector);
 page.dispatch("beforeprint");assert(closed.open&&alreadyOpen.open);page.dispatch("beforeprint");page.dispatch("afterprint");assert.equal(closed.open,false);assert.equal(alreadyOpen.open,true);checks++;
 const css=fs.readFileSync(path.join(root,"practice-builder.css"),"utf8");assert(css.includes(".pathway-series-card>details{display:block!important}"));checks++;
}
{
 const allMoves=h.api.libraryResults("moves",new URLSearchParams()).length,allGames=h.api.libraryResults("games",new URLSearchParams()).length;
 const home=h.api.home();assert(home.includes("<strong>"+allMoves+"</strong><span>written & video move guides"));assert(home.includes("<strong>"+allGames+"</strong><span>games & video guides"));checks++;
 const downloads=h.api.downloads();assert(downloads.includes("Assemble the preserved binder edition"));assert(!downloads.includes("current teaching binder"));for(const html of [home,downloads]){assert(html.includes("earlier game wording")||html.includes("earlier fixed plans and game wording"));assert(html.includes("latest move and series additions"));assert(html.includes("Print guide"));assert(html.includes("Print series"));}checks++;
}


{
 const stamp=require(path.join(root,"tools/stamp-assets.js")),crypto=require("crypto");
 const inspected=stamp.inspect(root),styles=Array.from(index.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g));
 assert.equal(stamp.hash(Buffer.from("same\r\ntext\r\n")),stamp.hash(Buffer.from("same\ntext\n")),"Git line-ending conversion must not change a release version");assert.equal(inspected.original,index);assert.equal(inspected.assets.length,scripts.length+styles.length);assert.equal(inspected.html,index,"Asset URLs need restamping after source changes");
 for(const asset of inspected.assets){const expected=crypto.createHash("sha256").update(fs.readFileSync(asset.file,"utf8").replace(/\r\n/g,"\n"),"utf8").digest("hex").slice(0,16);assert.equal(asset.expected,expected);assert.equal(asset.actual,expected,"Stale asset URL: "+asset.relative);assert(asset.current);}checks++;
 const stale=index.replace(/(src="app\.js)(?:\?[^"]*)?"/,'$1?v=outdated"'),restamped=stamp.versionHtml(stale,root);
 assert.notEqual(stale,index);assert(restamped.assets.some(asset=>asset.relative==="app.js"&&!asset.current));assert.equal(restamped.html,index);assert.equal(stamp.versionHtml(restamped.html,root).html,index);checks++;
 const virtual=stamp.versionHtml(index,root,file=>path.basename(file)==="app.js"?Buffer.concat([fs.readFileSync(file),Buffer.from("\n// changed for in-memory regression")]):fs.readFileSync(file));
 assert(virtual.assets.some(asset=>asset.relative==="app.js"&&!asset.current));assert.notEqual(virtual.html,index);assert.equal(fs.readFileSync(path.join(root,"app.js"),"utf8"),app,"Virtual asset check must not modify source");checks++;
 const untouched='<script src="https://example.test/external.js?v=old"></script><link rel="stylesheet" href="//example.test/external.css"><link rel="icon" href="assets/grindstone-logo.png">';
 assert.equal(stamp.versionHtml(untouched,root).html,untouched);assert.equal(stamp.versionHtml(untouched,root).assets.length,0);
 const extraQuery=stamp.versionHtml('<script src="app.js?lang=en&amp;v=old#lesson"></script>',root).html;assert(extraQuery.includes("lang=en&amp;v="));assert(extraQuery.includes('#lesson"'));checks++;
 for(const invalid of ['<script src="../outside.js"></script>','<link rel="stylesheet" href="/outside.css">'])assert.throws(()=>stamp.versionHtml(invalid,root),/project-relative|leaves the site/);checks++;
 const before=fs.readFileSync(path.join(root,"index.html"));const result=require("child_process").spawnSync(process.execPath,[path.join(root,"tools/stamp-assets.js"),"--check"],{encoding:"utf8"});
 assert.equal(result.status,0,result.stderr);assert(result.stdout.includes("No files written"));assert(before.equals(fs.readFileSync(path.join(root,"index.html"))));checks++;
}

console.log("PASS: "+checks+" navigation, builder routing, pathway, filter, family, and guide checks. No files written.");
