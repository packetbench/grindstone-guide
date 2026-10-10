"""Refresh website data from the preserved Grindstone library. Run with python -B."""
import json,re,sys,shutil,hashlib
from pathlib import Path
from urllib.parse import unquote
SITE=Path(__file__).resolve().parents[1]
WORK=SITE.parent
LIB=WORK/'Grindstone-Coaching-Library'
sys.path.insert(0,str(WORK/'grindstone-work'/'vendor'))
from markdown_it import MarkdownIt
def preflight(p):
    p=p.resolve();s=str(p); units=len(s.encode('utf-16-le'))//2
    if units>240: raise ValueError('Windows path exceeds 240: '+s)
    for part in p.parts[1:]:
        if len(part.encode('utf-16-le'))//2>255 or re.search(r'[<>:"/\\|?*\x00-\x1f]',part) or part!=part.strip() or part.endswith('.'): raise ValueError('Invalid component: '+part)
        if re.match(r'(?i)^(con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)',part) or '_vti_' in part.lower() or part.lower() in {'.lock','desktop.ini'} or part.startswith('~$'): raise ValueError('Reserved: '+part)
    rel=p.relative_to(SITE)
    for part in rel.parts:
        if part in {'.github','.nojekyll'}: continue
        if len(part)> (64 if part==rel.name and '.' in part else 32) or not re.fullmatch(r'[a-z0-9][a-z0-9_.-]*',part): raise ValueError('New name invalid: '+part)
    cloud=str(p).split('OneDrive\\',1)
    if len(cloud)==2 and len(unquote(cloud[1]).encode('utf-16-le'))//2>400: raise ValueError('Cloud path exceeds400')
    if p.parent.exists():
        for peer in p.parent.iterdir():
            if peer.name.lower()==p.name.lower() and peer.name!=p.name: raise ValueError('Case collision')
    return p
def put(path,text):
    p=preflight(SITE/path);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text,encoding='utf-8',newline='\n')
def read(path):return json.loads(path.read_text(encoding='utf-8-sig'))
master=read(LIB/'source-data/master-moves.json')
moves=[m for g in master['groups'] for m in g['entries']]
games=read(LIB/'source-data/master-games.json')
practices=[]
for age in ['4-6','7-10','11-14']:
    book=read(LIB/f'source-data/ages{age}.json')
    practices += [dict(p,age_group=age,duration=book['duration']) for p in book['plans']]
research={p.stem:read(p) for p in (LIB/'technical-research').glob('*.json') if re.fullmatch(r'[PBA]\d{2}',p.stem)}
videos={}
for name in ['video-pups-beginner.json','video-beginner-advanced.json','video-advanced.json','video-games-young.json','video-games-older.json']:
    f=WORK/'grindstone-work'/name
    if f.exists():
        items=read(f)
        if isinstance(items,dict):items=items.get('entries',items.get('moves',items.get('videos',[])))
        if isinstance(items,dict): items=list(items.values())
        for x in items:
            if x.get('video'):
                v=x['video'];v['format']='shorts' if 'short' in str(v.get('format','')).lower() else 'video'
                if isinstance(v.get('verified_by'),list):v['verified_by']='; '.join(v['verified_by'])
            videos[x['id']]=x
md=MarkdownIt('default',{'html':False})
guides=[]
for ident,name,title,label,desc in [
('blueprint','youth-wrestling-program-blueprint.md','Program blueprint','RESEARCH & PROGRAM DESIGN','Development, coaching, engagement, health, safeguarding, and the club operating plan.'),
('toolkit','youth-wrestling-coach-toolkit.md','Coach toolkit','PUT IT INTO PRACTICE','First visits, session templates, parent communication, readiness records, and day-to-day coaching tools.')]:
    text=(LIB/'background-research'/name).read_text(encoding='utf-8-sig')
    text=re.sub(r'<C:/[^>]*youth-wrestling-coach-toolkit\.md>', '#guide/toolkit',text)
    text=re.sub(r'<C:/[^>]*youth-wrestling-program-blueprint\.md>', '#guide/blueprint',text)
    html=md.render(text);toc=[]
    def heading(m):
        hid=f'{ident}-{len(toc)+1}';title=re.sub('<[^>]+>','',m.group(1))
        toc.append({'id':hid,'title':title});return f'<h2 id="{hid}">{m.group(1)}</h2>'
    html=re.sub(r'<h2>(.*?)</h2>',heading,html)
    html=re.sub(r'<a href="(https?://[^"]+)"',r'<a target="_blank" rel="noopener noreferrer" href="\1"',html)
    guides.append(dict(id=ident,title=title,label=label,description=desc,html=html,toc=toc))
specs=[
('Grindstone-Coaching-Binder.pdf','coaching-binder.pdf','Complete coaching binder',208,'All materials, indexed with alternating binding margins.'),
('Grindstone-Master-Binder-Index.pdf','binder-index.pdf','Master binder index',10,'Find every move, game, practice, and coaching topic.'),
('Grindstone-Coach-Moves-Reference.pdf','moves-reference.pdf','Coach moves reference',43,'The shared Pup, Beginner, and Advanced move handout.'),
('Grindstone-End-of-Practice-Games.pdf','practice-games.pdf','End-of-practice games',9,'Thirty original games with setup, rules, and variations.'),
('Grindstone-Program-Blueprint.pdf','program-blueprint.pdf','Program blueprint',15,'The complete program research and design.'),
('Grindstone-Coach-Toolkit.pdf','coach-toolkit.pdf','Coach toolkit',15,'Planning tools, templates, and coaching guidance.')]
for age in ['4-6','7-10','11-14']:
    specs += [(f'Grindstone-Practices-Ages-{age}.pdf',f'practices-{age}.pdf',f'Ages {age}: 30 practices',34,'Complete practice plans for this age group.'),(f'Grindstone-Coach-Handout-Ages-{age}.pdf',f'quick-cues-{age}.pdf',f'Ages {age}: quick coaching cues',2,'Mat-side reminders with move reference pages.')]
downloads=[dict(title='Complete original library',description='All reviewed PDFs, editable materials, and the original research report in one archive.',type='ZIP',path='downloads/coaching-library.zip')]
planned=[SITE/'data.js']+[SITE/'downloads'/x[1] for x in specs]+[SITE/'assets'/x for x in ['grindstone-logo.png','mat-rats-logo.png']]+[SITE/'downloads/coaching-library.zip']
for p in planned:preflight(p)
integrity=[]
def copy(src,dst):
    dst=preflight(dst);dst.parent.mkdir(parents=True,exist_ok=True)
    if not dst.exists() or hashlib.sha256(dst.read_bytes()).digest()!=hashlib.sha256(src.read_bytes()).digest():shutil.copyfile(src,dst)
    a=hashlib.sha256(src.read_bytes()).hexdigest();b=hashlib.sha256(dst.read_bytes()).hexdigest()
    assert a==b;integrity.append({'source':src.name,'site_path':str(dst.relative_to(SITE)).replace('\\','/'),'sha256':b})
for old,new,title,pages,desc in specs:
    copy(LIB/old,SITE/'downloads'/new)
    downloads.append(dict(title=title,pages=pages,description=desc,type='PDF',path='downloads/'+new))
for name in ['grindstone-logo.png','mat-rats-logo.png']:copy(LIB/'assets'/name,SITE/'assets'/name)
copy(WORK/'Grindstone-Coaching-Library.zip',SITE/'downloads/coaching-library.zip')
resources=[
dict(title='USA Wrestling: Folkstyle Level 1',url='https://www.usawmembership.com/usa_wrestling_core_curriculum/1',description='Official starting positions, takedowns, bottom skills, and top skills.'),
dict(title='USA Wrestling: Folkstyle Level 2',url='https://www.usawmembership.com/usa_wrestling_core_curriculum/2',description='Additional finishes, escapes, rides, and turns.'),
dict(title='USA Wrestling: Folkstyle Level 3',url='https://www.usawmembership.com/usa_wrestling_core_curriculum/3',description='Further technique options for coaches selecting appropriate progressions.'),
dict(title='USA Wrestling: Drills, Activities & Games',url='https://www.usawmembership.com/usa_wrestling_core_curriculum/7',description='Official movement and game demonstrations. Select activities according to readiness.'),
dict(title='USA Wrestling: Techniques by Age',url='https://www.themat.com/news/2019/october/10/techniques-by-age',description='Coaching guidance on foundations, experience, and skill progression.')]
data=dict(moves=moves,games=games['games'],practices=practices,research=research,videos=videos,guides=guides,downloads=downloads,resources=resources,move_pages=master['entry_pages'],game_pages=games['entry_pages'],video_checked='2026-10-10')
assert len(moves)==72 and len(data['games'])==30 and len(practices)==90
put('data.js','window.GRINDSTONE = '+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n')
put('copy-integrity.json',json.dumps(integrity,indent=2))
print(json.dumps({'moves':len(moves),'games':len(data['games']),'practices':len(practices),'video_records':len(videos),'preserved_copies':len(integrity),'max_planned_path':max(len(str(p)) for p in planned)},indent=2))
