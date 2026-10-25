/* Public working documents for discussion in the coaches' text group. */
(() => {
"use strict";
const data=window.GRINDSTONE_IN_PROGRESS;
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const route=id=>"#in-progress/"+id;
const base=()=>String(location.href||"").split("#")[0].split("?")[0];
const publicUrl=id=>base()+route(id);
const list=items=>'<ul>'+items.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>';
function draftText(doc){
 return [doc.title,"GRINDSTONE WRESTLING | DRAFT FOR COACH REVIEW","Updated "+data.reviewed,publicUrl(doc.id),"",doc.summary,"","Why this is proposed",doc.why,"",
 ...doc.sections.flatMap(s=>[s.title,...s.paragraphs,...s.bullets.map(x=>"- "+x),...(s.links||[]).map(link=>link.label+" — "+new URL(link.href,base()).href),""]),
 "Decisions for the coaches",...doc.decisions.map((x,i)=>(i+1)+". "+x),"","Next step",doc.next_step,"",
 "Already available",...doc.existing.map(x=>x.label+" — "+new URL(x.href,base()).href),"",
 "Discuss in the coaches' text group. Include the document, section, proposed wording and reason. This website does not save comments or shared edits."
 ].join("\n");
}
function hub(params){
 const categories=[...new Set(data.documents.map(d=>d.category))];
 const selected=categories.includes(params.get("category"))?params.get("category"):"";
 const shown=data.documents.filter(d=>!selected||d.category===selected);
 return '<div class="draft-hub"><div class="page-title"><p class="eyebrow">COACHES · WORKING DOCUMENTS</p><h1>In Progress</h1><p>Review the proposals, share a link in the coaches’ text group, and help decide what happens next.</p></div>'+
 '<div class="draft-notice"><strong>Drafts for discussion</strong><p>These proposals are not adopted club policy. Each one shows what already exists, suggested content and decisions still needed.</p><p>Discuss changes in the coaches’ text group. This public site displays drafts; it does not save comments or shared edits.</p></div>'+
 '<div class="draft-jumps no-print"><a href="#in-progress" data-scroll="working-drafts">Working drafts ↓</a><a href="#in-progress" data-scroll="existing-resources">Already available ↓</a></div>'+
 '<section id="working-drafts" tabindex="-1"><h2>Working drafts</h2><nav class="draft-filters no-print" aria-label="Filter working documents"><a href="#in-progress"'+(!selected?' aria-current="page"':'')+'>All drafts ('+data.documents.length+')</a>'+
 categories.map(c=>'<a href="#in-progress?'+esc(new URLSearchParams({category:c}).toString())+'"'+(selected===c?' aria-current="page"':'')+'>'+esc(c)+'</a>').join("")+'</nav>'+
 '<p class="fine">'+shown.length+' drafts · Updated '+esc(data.reviewed)+'</p><div class="draft-grid">'+shown.map(d=>
 '<a class="draft-card" href="'+route(d.id)+'"><span class="eyebrow">'+esc(d.category)+'</span><h3>'+esc(d.title)+'</h3><p>'+esc(d.summary)+'</p><span class="draft-card-footer">'+d.decisions.length+' decisions to discuss <span aria-hidden="true">→</span></span></a>').join("")+'</div></section>'+
 '<section id="existing-resources" tabindex="-1" class="draft-existing"><h2>Already available</h2><p>Meeting topics already supported by a guide, handout or coaching tool. These links open the existing resource in its usual place on the site.</p><div class="draft-grid">'+(data.existing_documents||[]).map(d=>'<article class="draft-card"><span class="eyebrow">'+esc(d.category)+'</span><h3><a href="'+esc(d.href)+'">'+esc(d.title)+'</a></h3><p>'+esc(d.summary)+'</p><div class="draft-card-footer"><a href="'+esc(d.href)+'">Open existing resource →</a></div>'+(d.related_draft?'<p class="draft-related"><a href="'+route(d.related_draft)+'">Related proposal</a></p>':'')+'</article>').join("")+'</div></section></div>';
}
function detail(id){
 const doc=data.documents.find(d=>d.id===id);
 if(!doc)return '<div class="page-title"><h1>Draft not found</h1><p>Choose a working document from In Progress.</p></div><a class="button" href="#in-progress">All drafts</a>';
 return '<article class="draft-document"><a class="back" href="#in-progress">← All working documents</a><header class="page-title"><p class="eyebrow">'+esc(doc.category)+' · '+esc(doc.status)+'</p><h1>'+esc(doc.title)+'</h1><p>'+esc(doc.summary)+'</p><p class="fine">Updated '+esc(data.reviewed)+'</p></header>'+
 (doc.kind==='research' ? '<div class="draft-notice"><strong>Research backlog — unfinished instructions stay out of the move library</strong><p>Reply to any numbered question you can help with. Other work continues while these remain open.</p></div>' : '<div class="draft-notice"><strong>Working proposal — not adopted policy</strong><p>Use the coaches’ text group to suggest changes. Refer to a section title and the wording you would change.</p></div>')+
 '<div class="draft-actions no-print"><button type="button" class="button" data-draft-copy>Copy draft link</button><button type="button" class="button outline" data-print>Print draft</button><a class="button outline" href="data:text/plain;charset=utf-8,'+esc(encodeURIComponent(draftText(doc)))+'" download="'+doc.id+'-draft.txt">Download text</a></div>'+
 '<div class="draft-share no-print"><label for="draft-link">Link to share in the text group</label><input id="draft-link" readonly value="'+esc(publicUrl(doc.id))+'"><p id="draft-share-status" role="status" aria-live="polite"></p></div>'+
 (doc.kind==='research' ? '<nav class="draft-filters no-print" aria-label="Technique questions">'+doc.sections.filter(s=>s.id).map(s=>'<a href="'+route(doc.id)+'" data-scroll="'+esc(s.id)+'">'+esc(s.title)+'</a>').join('')+'</nav>' : '')+
 '<div class="prose"><section><h2>Why this is proposed</h2><p>'+esc(doc.why)+'</p></section>'+
 doc.sections.map(s=>'<section'+(s.id?' id="'+esc(s.id)+'" tabindex="-1"':'')+'><h2>'+esc(s.title)+'</h2>'+s.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join("")+list(s.bullets)+(s.links?.length ? '<ul>'+s.links.filter(link=>/^https:\/\//.test(link.href)||/^#move\/[A-Z]\d+$/.test(link.href)||/^#season\?view=series&series=S\d+$/.test(link.href)).map(link=>'<li><a href="'+esc(link.href)+'"'+(/^https:\/\//.test(link.href)?' target="_blank" rel="noopener noreferrer"':'')+'>'+esc(link.label)+(/^https:\/\//.test(link.href)?' ↗':'')+'</a></li>').join("")+'</ul>' : "")+'</section>').join("")+
 '<section class="draft-decisions"><h2>Decisions for the coaches</h2><ol>'+doc.decisions.map(d=>'<li>'+esc(d)+'</li>').join("")+'</ol></section>'+
 '<section><h2>Next step</h2><p>'+esc(doc.next_step)+'</p></section><section><h2>Already available</h2><ul>'+doc.existing.map(x=>'<li><a href="'+esc(x.href)+'">'+esc(x.label)+'</a></li>').join("")+'</ul></section>'+
 '<section class="draft-feedback"><h2>Send feedback in the text group</h2><p>A useful reply includes:</p><div class="draft-feedback-template"><p><strong>Draft:</strong> '+esc(doc.title)+' ('+esc(data.reviewed)+')</p><p><strong>Section:</strong> [section title]</p><p><strong>Suggested change:</strong> [your wording]</p><p><strong>Reason or open question:</strong> [what this resolves]</p></div><p class="fine">The site does not save replies or shared edits. Keep individual athlete and family information out of public drafts.</p></section></div></article>';
}
function bind(root){
 root.querySelector("[data-draft-copy]")?.addEventListener("click",async()=>{
  const field=root.querySelector("#draft-link"),status=root.querySelector("#draft-share-status");
  try{await navigator.clipboard.writeText(field.value);status.textContent="Link copied. Paste it into the coaches’ text group.";}
  catch{field.focus();field.select();status.textContent="Select and copy this link, then paste it into the coaches’ text group.";}
 });
}
window.GRINDSTONE_DRAFTS={render:(id,params=new URLSearchParams())=>id?detail(id):hub(params),bind,draftText};
})();
