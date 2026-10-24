"use strict";
// Dependency-free regression checks. Reads site files and creates no outputs.
const fs=require("fs"),path=require("path"),vm=require("vm"),assert=require("assert/strict");
const root=process.env.GRINDSTONE_TEST_ROOT||path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const dataFiles=["data.js","family-data.js","sponsors-data.js","kyle-data.js","kyle-instruction-data.js","coaches-data.js","video-additions.js","move-tags.js","series-moves.js","series-bottom.js","series-library.js","season-data.js","practice-frameworks.js","pathway-data.js","skill-pathway.js","practice-builder.js"];
const clone=value=>JSON.parse(JSON.stringify(value));
const decode=text=>String(text).replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'");
function harness(initial="#moves",savedHistory){
 const elements={},docEvents={},winEvents={},frames=[],location={hash:initial};
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
  const item={id,dataset:{},events:{},textContent:"",classList:{add(){},remove(){}},focus(){focus=id;},setAttribute(name,value){this[name]=value;},addEventListener(name,handler){this.events[name]=handler;},dispatchEvent(event){this.events[event.type]?.(event);},querySelector(selector){if(selector==="h1"){const title=this.innerHTML.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);return title?{textContent:title[1].replace(/<[^>]*>/g,"")}:null;}if(selector.startsWith("#"))return fields.find(field=>field.id===selector.slice(1))||null;return null;},querySelectorAll(selector){if(selector==="input,select")return fields;if(selector==="a[href]")return anchors();return [];},scrollIntoView(){}};
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
 return {api:context.api,context,window,history,location,fields:()=>fields,elements,dispatch,flush,clickReturn,focus:()=>focus,renders:()=>renders,snapshot:()=>({stack:clone(stack),position}),navigate(hash){context.api.navigateTo(hash,hash);flush();},scroll(y){window.scrollY=y;dispatch("scroll");flush();}};
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
const addedMoves=[...h.context.window.GRINDSTONE_SERIES_MOVES.entries,...h.context.window.GRINDSTONE_SERIES_BOTTOM.entries];
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
 const category=h.context.window.GRINDSTONE_TAGS.entries[move.id];assert(h.context.window.GRINDSTONE_TAGS.categories.some(item=>item.id===category),"New move has an invalid shared category: "+move.id+"/"+category);
 assert(h.api.libraryResults("moves",new URLSearchParams("category="+category)).some(item=>item.id===move.id),"New move missing from its category: "+move.id);
 const list="#moves?q="+move.id;h.navigate(list);assert(h.api.libraryResults("moves",new URLSearchParams("q="+move.id)).some(item=>item.id===move.id),"New move not searchable: "+move.id);
 h.navigate("#move/"+move.id);assert(h.elements.main.innerHTML.includes(escapeText(move.name)));assert(!h.elements.main.innerHTML.includes("undefined"));assert(!h.elements.main.innerHTML.includes("reference page undefined"));h.clickReturn();assert.equal(h.location.hash,list);checks++;
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
assert(h.api.familyArticle("first-practice").includes("reviewed 2026-10-13"));assert(h.api.familyArticle("programs-levels").includes("reviewed 2026-10-13"));checks++;
const overview=h.context.window.GRINDSTONE_SKILL_PATHWAY.render(new URLSearchParams('age=4-6&phase=bad'));
assert(overview.includes(S.groups[0].phases[0].title));assert(overview.includes('aria-current="page"'));assert(!h.api.home().includes('ready-to-run practices'));assert(!h.api.home().includes('30 plans'));assert(!h.api.savedPage().includes('#practice/'));checks++;
const printable=h.api.currentCoachDownloads();assert.deepEqual(Array.from(printable,item=>item.pages),[14,66]);for(const item of printable)assert(fs.existsSync(path.join(root,item.path)));const downloadHtml=h.api.downloads();assert(downloadHtml.includes("pages 217–282"));assert(downloadHtml.includes("downloads/binder-index.pdf"));assert(h.api.home().includes("282 pages / 141"));checks++;
const shortForm=h.api.filters("moves",new URLSearchParams());assert(shortForm.indexOf('for="search"')<shortForm.indexOf('class="filter-options"'));assert(shortForm.indexOf('for="move-category"')<shortForm.indexOf('class="filter-options"'));assert(!shortForm.includes('class="filter-options" open'));assert(h.api.filters("moves",new URLSearchParams("tier=Beginner")).includes('class="filter-options" open'));checks++;
assert.equal(h.api.libraryResults("moves",new URLSearchParams("tier=Beginner&type=facebook")).length,17);assert.equal(h.api.libraryResults("moves",new URLSearchParams("tier=Beginner&type=facebook&unassigned=0")).length,0);assert.equal(Object.keys(h.api.saveRecords).length,D.moves.length+D.games.length+D.practices.length+h.context.window.GRINDSTONE_KYLE.entries.length+h.context.window.GRINDSTONE_VIDEO_ADDITIONS.entries.length);checks++;
const index=fs.readFileSync(path.join(root,"index.html"),"utf8"),scripts=Array.from(index.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g),match=>match[1].split("?")[0]);
for(const file of dataFiles)assert(scripts.includes(file),"Production entry point missing "+file);
for(const [earlier,later] of [["data.js","series-library.js"],["move-tags.js","series-library.js"],["series-moves.js","series-library.js"],["series-bottom.js","series-library.js"],["series-library.js","practice-builder.js"],["series-library.js","skill-pathway.js"],["practice-frameworks.js","skill-pathway.js"],["practice-frameworks.js","practice-builder.js"],["pathway-data.js","skill-pathway.js"],["skill-pathway.js","app.js"],["practice-builder.js","app.js"]])assert(scripts.indexOf(earlier)<scripts.indexOf(later),earlier+" must load before "+later);checks++;
console.log("PASS: "+checks+" navigation, builder routing, pathway, filter, family, and guide checks. No files written.");
