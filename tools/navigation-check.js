"use strict";
// Dependency-free regression checks. Reads site files and creates no outputs.
const fs=require("fs"),path=require("path"),vm=require("vm"),assert=require("assert/strict");
const root=process.env.GRINDSTONE_TEST_ROOT||path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const dataFiles=["data.js","family-data.js","sponsors-data.js","kyle-data.js","kyle-instruction-data.js","coaches-data.js","video-additions.js","move-tags.js","season-data.js"];
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
 const context={console,URLSearchParams,Date,Math,history,location,window,Event:class{constructor(type,options={}){this.type=type;Object.assign(this,options);}},requestAnimationFrame:callback=>frames.push(callback),setTimeout:callback=>{callback();return 0;},clearTimeout(){},localStorage:{getItem:()=>"[]",setItem(){}},document:{getElementById:id=>fields.find(field=>field.id===id)||node(id),querySelector:selector=>node(selector),querySelectorAll:selector=>selector==="[data-season-phase]"?[]:[],addEventListener(name,handler){docEvents[name]=handler;}},FormData:class{constructor(){this.values=fields.filter(field=>field.name&&(field.type!=="checkbox"||field.checked));}forEach(callback){this.values.forEach(field=>callback(field.value,field.name));}}};
 context.globalThis=context;vm.createContext(context);
 for(const file of dataFiles)vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),context,{filename:file});
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
h.navigate("#practices?age=7-10&q=stance");h.scroll(480);h.navigate("#practice/7-10/1");h.scroll(910);h.navigate("#move/B01");h.scroll(260);h.navigate("#moves/videos/V01");
h.clickReturn();assert.equal(h.location.hash,"#move/B01");assert.equal(h.window.scrollY,260);
h.clickReturn();assert.equal(h.location.hash,"#practice/7-10/1");assert.equal(h.window.scrollY,910);
h.clickReturn();assert.equal(h.location.hash,"#practices?age=7-10&q=stance");assert.equal(h.window.scrollY,480);checks++;
for(const [list,detail,label] of [["#moves/kyle?q=stance&featured=1","#moves/kyle/K02","Back to Coach Kyle"],["#moves/videos?category=movement&q=shuffle","#moves/videos/V02","Back to Facebook"],["#games?age=4-6&minutes=4","#game/G01","Back to game results"],["#saved","#moves/kyle/K03","Back to saved items"]]){
 h.navigate(list);h.scroll(370);h.navigate(detail);assert(h.elements.main.innerHTML.includes(label));h.clickReturn();assert.equal(h.location.hash,list);assert.equal(h.window.scrollY,370);checks++;
}
h.navigate("#moves?category=bottom");h.scroll(555);h.navigate("#move/B14");h.scroll(321);
const refreshed=harness("#home",h.snapshot());assert.equal(refreshed.window.scrollY,321);refreshed.clickReturn();assert.equal(refreshed.location.hash,"#moves?category=bottom");assert.equal(refreshed.window.scrollY,555);checks++;
for(const unsafe of ["https://example.com","#//example.com","#javascript:alert(1)","javascript:alert(1)","#move/../../other","#moves\n#home","#family/<script>"])assert.equal(h.api.safeRouteHash(unsafe),"");
assert.equal(h.api.safeRouteHash("#moves?q=a%26b"),"#moves?q=a%26b");checks++;
const listingId=h.history.state.grindstone.id,historyLength=h.snapshot().stack.length;h.api.replaceRoute("#moves?q=updated&category=bottom");assert.equal(h.history.state.grindstone.id,listingId);assert.equal(h.snapshot().stack.length,historyLength);checks++;
const D=h.context.window.GRINDSTONE,S=h.context.window.GRINDSTONE_SEASON;
for(const group of S.groups)for(const phase of group.phases){const list=h.api.libraryResults("practices",new URLSearchParams({age:group.age_group,phase:phase.id}));assert.deepEqual(Array.from(list,x=>x.number),Array.from(phase.practice_numbers));}checks+=15;

const phaseRoute="#practices?age=7-10&phase="+S.groups[1].phases[1].id;
h.navigate(phaseRoute);h.scroll(680);h.navigate("#practice/7-10/7");h.scroll(740);h.navigate("#move/B07");h.clickReturn();assert.equal(h.location.hash,"#practice/7-10/7");assert.equal(h.window.scrollY,740);h.clickReturn();assert.equal(h.location.hash,phaseRoute);assert.equal(h.window.scrollY,680);checks++;

h.navigate("#season");assert.equal(h.location.hash,"#practices");assert(h.elements["season-path"].innerHTML.includes(S.title));checks++;
h.navigate("#practices?age=7-10&phase="+S.groups[1].phases[1].id);
const ageField=h.fields().find(field=>field.name==="age");ageField.value="4-6";h.elements["filter-form"].events.input({target:ageField});assert.equal(new URLSearchParams(h.location.hash.split("?")[1]).has("phase"),false,"Changing age must clear the old phase");checks++;
for(const [entries,render] of [[D.moves,h.api.moveDetail],[D.games,h.api.gameDetail]])for(const entry of entries){const html=render(entry.id);for(const match of html.matchAll(/data-scroll="(guide-[^"]+)"/g))assert(html.includes('id="'+match[1]+'"'),"Missing guide jump target "+match[1]);}checks+=D.moves.length+D.games.length;
assert(h.api.familyArticle("first-practice").includes("reviewed 2026-10-13"));assert(h.api.familyArticle("programs-levels").includes("reviewed 2026-10-13"));checks++;
h.navigate("#practices?age=7-10&q=single");
const searchField=h.fields().find(field=>field.name==="q");searchField.value="double";h.elements["filter-form"].events.input({target:searchField});
const ageLinks=Array.from(h.elements["season-path"].innerHTML.matchAll(/<a href="(#practices\?[^"]+)"/g),match=>match[1]);assert.equal(ageLinks.length,3);assert(ageLinks.every(href=>href.includes("q=double")&&!href.includes("q=single")),"Age links must retain the current search");checks++;
const printable=h.api.currentCoachDownloads();assert.deepEqual(Array.from(printable,item=>item.pages),[14,66]);for(const item of printable)assert(fs.existsSync(path.join(root,item.path)));const downloadHtml=h.api.downloads();assert(downloadHtml.includes("pages 217–282"));assert(downloadHtml.includes("downloads/binder-index.pdf"));assert(h.api.home().includes("282 pages / 141"));checks++;
const shortForm=h.api.filters("moves",new URLSearchParams());assert(shortForm.indexOf('for="search"')<shortForm.indexOf('class="filter-options"'));assert(shortForm.indexOf('for="move-category"')<shortForm.indexOf('class="filter-options"'));assert(!shortForm.includes('class="filter-options" open'));assert(h.api.filters("moves",new URLSearchParams("tier=Beginner")).includes('class="filter-options" open'));checks++;
assert.equal(h.api.libraryResults("moves",new URLSearchParams("tier=Beginner&type=facebook")).length,17);assert.equal(h.api.libraryResults("moves",new URLSearchParams("tier=Beginner&type=facebook&unassigned=0")).length,0);assert.equal(Object.keys(h.api.saveRecords).length,239);checks++;
console.log("PASS: "+checks+" navigation, filter, season, family, and guide checks. No files written.");
