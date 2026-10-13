"""Build the additive 2026 coaching supplement and master index. Run with python -B.

Reads the website's current teaching content without rewriting source downloads.
Every generated path is checked before creation. No network access is required.
"""
import argparse
import hashlib
import html
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import unquote
from xml.sax.saxutils import escape

from pypdf import PdfReader
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle

SITE = Path(__file__).resolve().parents[1]
TMP = SITE / 'tmp/pdfs'
RUNTIME = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies'
NODE = RUNTIME / 'node/bin/node.exe'
WEB = 'https://packetbench.github.io/grindstone-guide/'
DATE = 'October 13, 2026'
INK = colors.HexColor('#242424')
RED = colors.HexColor('#a8312f')
GOLD = colors.HexColor('#aa7b2d')
LIGHT = colors.HexColor('#f4f1ec')
RULE = colors.HexColor('#d7d3cd')
OUTPUTS = {'master-index-2026.pdf', 'coach-supplement-2026.pdf'}


def preflight(path, directory=False):
    path = path.resolve()
    raw = str(path)
    if len(raw.encode('utf-16-le')) // 2 > 200:
        raise ValueError('Shorten output path: ' + raw)
    rel = path.relative_to(SITE)
    for part in path.parts[1:]:
        if len(part.encode('utf-16-le')) // 2 > 255 or re.search(r'[<>:"/\\|?*\x00-\x1f]', part):
            raise ValueError('Invalid component: ' + part)
        if part != part.strip() or part.endswith('.') or re.match(r'(?i)^(con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)', part):
            raise ValueError('Reserved component: ' + part)
        if '_vti_' in part.lower() or part.lower() in {'.lock', 'desktop.ini', '.ds_store'} or part.startswith('~$'):
            raise ValueError('Excluded component: ' + part)
    for i, part in enumerate(rel.parts):
        limit = 32 if directory or i < len(rel.parts)-1 else 64
        if len(part) > limit or not re.fullmatch(r'[a-z0-9][a-z0-9_.-]*', part):
            raise ValueError('New name violates policy: ' + part)
    if len(unquote(raw.split('OneDrive\\', 1)[-1]).encode('utf-16-le')) // 2 > 400:
        raise ValueError('Cloud path too long')
    if path.parent.exists():
        for peer in path.parent.iterdir():
            if peer.name.lower() == path.name.lower() and peer.name != path.name:
                raise ValueError('Case collision: ' + str(peer))
    return path


def mkdir(path):
    if path.exists():
        return
    preflight(path, directory=True)
    if not path.parent.exists():
        mkdir(path.parent)
    path.mkdir()


def norm(value):
    text = str(value).replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', ' - ').replace('\u2212', '-').replace('\u00a0', ' ').replace('\u27a1', ' to ')
    return re.sub(r'[\U00010000-\U0010ffff\u2600-\u27bf\ufe0e\ufe0f\u200d]', '', text)


def e(value):
    return escape(norm(value))


def p(text, size=10.6, bold=False, color=INK, space=5, raw=False):
    style = ParagraphStyle('p', fontName='CalibriB' if bold else 'Calibri', fontSize=size,
                           leading=size*1.27, textColor=color, spaceAfter=space,
                           allowWidows=0, allowOrphans=0, splitLongWords=1)
    return Paragraph(norm(text) if raw else e(text), style)


def head(text):
    return p(text.upper(), size=9.5, bold=True, color=RED, space=5)


def para(label, text, size=10.6):
    return p('<b>' + e(label) + '</b> ' + e(text), size, raw=True)


def link(label, url, size=8.9):
    return p('<link href="' + escape(url, {'"': '&quot;'}) + '" color="#8e2927">' + e(label) + '</link>', size, space=2, raw=True)


def url_line(url, size=8.2):
    return link(url, url, size)


def page_link(label, filename, number):
    return link(str(label), WEB+'downloads/'+filename+'#page='+str(number),9.5)


def text_html(source):
    source = re.sub(r'<figure\b[^>]*>.*?</figure>', '', source, flags=re.S)
    source = re.sub(r'<a\b[^>]*>(.*?)</a>', r'\1', source, flags=re.S)
    source = re.sub(r'<br\s*/?>', ' ', source)
    source = re.sub(r'</(?:p|li|h[1-6])>', '\n', source)
    source = re.sub(r'<[^>]+>', '', source)
    return [norm(html.unescape(x.strip())) for x in source.split('\n') if x.strip()]


def table(rows, widths, sizes=9.5, header=True):
    cells = [[cell if isinstance(cell,Paragraph) else p(cell, sizes, bold=(header and i==0), space=0) for cell in row] for i, row in enumerate(rows)]
    t = Table(cells, colWidths=widths, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 5), ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 2.8), ('BOTTOMPADDING', (0,0), (-1,-1), 2.8),
        ('ROWBACKGROUNDS', (0,1 if header else 0), (-1,-1), [colors.white, LIGHT]),
        ('LINEBELOW', (0,0), (-1,0), 0.6, GOLD),
    ]))
    return t


class Page:
    def __init__(self, title, label, blocks, key=None, columns=None):
        self.title, self.label, self.blocks = title, label, blocks
        self.key, self.columns = key, columns


class Book:
    def __init__(self, path, title, binder_start=None):
        self.path = preflight(path)
        self.title = title
        self.binder_start = binder_start
        self.pages = []
        self.positions = {}
        self.bottoms = []

    def add(self, title, label, blocks, key=None, columns=None):
        self.pages.append(Page(title, label, blocks, key, columns))
        if key:
            self.positions[key] = len(self.pages)

    def even(self, title='Notes and practice choices'):
        if len(self.pages) % 2:
            self.add(title, 'COACH WORKSHEET', [
                p('Athletes / group: _______________________________________________________'),
                p('Focus for next practice: __________________________________________________'),
                p('Readiness observed: ____________________________________________________'),
                p('Simpler option: _________________________________________________________'),
                p('Partner task and stop condition: ___________________________________________'),
                p('Follow-up: _____________________________________________________________'),
                p('This notes page completes the duplex section. Keep sensitive athlete information in the club\'s separate secure records.', 9.2),
            ])

    def render(self):
        c = canvas.Canvas(str(self.path), pagesize=(612,792), pageCompression=1)
        c.setTitle(self.title)
        c.setAuthor('Grindstone Wrestling')
        c.setSubject('Letter-size, double-sided coaching reference; ' + DATE)
        for number, page in enumerate(self.pages, 1):
            binder = self.binder_start + number - 1 if self.binder_start else None
            left = 60 if number % 2 else 42
            right = 42 if number % 2 else 60
            width = 612-left-right
            if page.key:
                c.bookmarkPage(page.key)
                c.addOutlineEntry(norm(page.title), page.key, 0, False)
            for alias, destination in self.positions.items():
                if destination == number and alias != page.key:c.bookmarkPage(alias)
            c.setFillColor(RED); c.rect(0,780,612,12,fill=1,stroke=0)
            c.setFillColor(RED); c.setFont('CalibriB',10); c.drawString(left,756,'GRINDSTONE WRESTLING')
            title = p(page.title,24,bold=True,space=0)
            _, height = title.wrap(width,100)
            if height > 64:
                raise ValueError('Title too large: '+page.title)
            title.drawOn(c,left,742-height)
            y = 732-height
            c.setFillColor(GOLD); c.setFont('CalibriB',8.8); c.drawString(left,y,norm(page.label))
            y -= 11
            c.setStrokeColor(GOLD); c.setLineWidth(.9); c.line(left,y,612-right,y)
            y -= 12
            def draw(blocks,x,w,top):
                at=top
                for b in blocks:
                    _,h=b.wrap(w,700)
                    if at-h < 64:
                        raise ValueError(f'{self.path.name} page {number} ({page.title}) overflows by {64-at+h:.1f}pt at {getattr(b,"text",type(b).__name__)[:80]}')
                    b.drawOn(c,x,at-h)
                    at -= h+getattr(b,'spaceAfter',7)
                self.bottoms.append({'page':number,'bottom':round(at,2)})
            draw(page.blocks,left,width,y)
            if page.columns:
                gap=20; cw=(width-gap)/2
                draw(page.columns[0],left,cw,y)
                draw(page.columns[1],left+cw+gap,cw,y)
            c.setStrokeColor(RULE);c.setLineWidth(.5);c.line(left,52,612-right,52)
            c.setFillColor(INK);c.setFont('Calibri',8)
            c.drawString(left,39, 'COACH SUPPLEMENT 2026' if binder else 'MASTER INDEX 2026')
            c.drawString(left,27,'Letter / 100% / double-sided / flip long edge')
            c.setFont('CalibriB',10)
            c.drawRightString(612-right,38, f'BINDER {binder}' if binder else f'INDEX {number}')
            c.setFont('Calibri',8)
            c.drawRightString(612-right,27, f'Supplement {number} / {len(self.pages)}' if binder else f'{number} / {len(self.pages)}')
            c.showPage()
        c.save()


def load_data():
    files=['data.js','kyle-data.js','kyle-instruction-data.js','video-additions.js','family-data.js']
    if (SITE/'season-data.js').exists(): files.append('season-data.js')
    script='const fs=require("fs"),vm=require("vm"),c={window:{}};vm.createContext(c);for(const f of '+json.dumps(files)+')vm.runInContext(fs.readFileSync(f,"utf8"),c);process.stdout.write(JSON.stringify(c.window));'
    return json.loads(subprocess.check_output([str(NODE),'-e',script],cwd=SITE,encoding='utf-8'))


def kyle_pages(book, entries, guides):
    for entry in sorted(entries,key=lambda x:x['id']):
        key=entry['id']; g=guides[key]
        name=entry['name']
        blocks=[p(g['purpose']),para('Readiness:',g['readiness']),para('Set up:',g['setup']),head('Teach the movement')]
        blocks += [para(str(i)+'.',step) for i,step in enumerate(g['steps'],1)]
        blocks += [head('Coaching cues'),p(' / '.join(g['cues']))]
        if g.get('sources'):
            blocks.append(p('Written instruction references:',8.7,bold=True))
            for s in g['sources']:
                url=s['url']; url=WEB+url if url.startswith('#') else url
                blocks.append(link(s['title'],url,8.5))
        book.add(key+'  '+name,'COACH KYLE COLLECTION  /  TEACHING GUIDE',blocks,key)
        b=[head('Practice and adapt')]
        drill=g.get('drill',{})
        b += [para(drill.get('name','Practice')+':',drill.get('setup',''))]
        for field,label in [('rounds','Suggested dose:'),('goal','Look for:')]:
            if drill.get(field): b.append(para(label,drill[field]))
        for a in g.get('age_adaptations',[]): b.append(para('Ages '+a['group']+':',a['text'],10.0))
        b.append(head('Common problems'))
        for m in g.get('mistakes',[]): b.append(para(m['problem'],m['correction'],10.0))
        b.append(head('Boundaries and readiness'))
        for s in g.get('safety',[]):b.append(p(s,10.0,space=4))
        b.append(head('Video and source notes'))
        v=entry['video']
        b += [p(v['channel']+' - '+v['title'],9.0,space=3),url_line(v['url']),p(g.get('verification',entry.get('note','')),8.8,space=4)]
        book.add(key+'  Practice notes','COACH KYLE COLLECTION  /  '+name,b,key+'-notes')


def fb_pages(book, entries, data):
    names={x['id']:x.get('name',x.get('title','')) for x in data['moves']+data['games']}
    for entry in sorted([x for x in entries if x.get('steps')],key=lambda x:x['id']):
        key=entry['id']
        b=[p(entry['description']),head('Teach the drill')]
        b += [para(str(i)+'.',step) for i,step in enumerate(entry['steps'],1)]
        b += [head('Coaching cues'),p(' / '.join(entry.get('cues',[]))),head('Adapt to readiness')]
        for group,txt in entry.get('age_adaptations',{}).items(): b.append(para('Ages '+group+':',txt))
        b += [head('Boundaries'),p(entry['boundaries']),head('Source reference'),p(entry['publisher'],9.2),url_line(entry['url']),p(entry.get('relationship',''),9.2),p('Written drill: Grindstone coaching adaptation. Source clip was spot-checked; a full audiovisual review was not completed.',8.8)]
        book.add(key+'  '+entry['title'],'FACEBOOK COLLECTION  /  WRITTEN DRILL',b,key)
    references=sorted([x for x in entries if not x.get('steps')],key=lambda x:x['id'])
    for index in range(0,len(references),2):
        blocks=[]; pair=references[index:index+2]
        for entry in pair:
            blocks += [head(entry['id']+'  '+entry['title']),p(entry['description'],10.5)]
            if entry.get('focus'):
                focus=entry['focus'];focus=' / '.join(focus) if isinstance(focus,list) else str(focus)
                blocks.append(para('Watch for:',focus,10))
            related=[x+' '+names.get(x,'') for x in entry.get('guide_ids',[])]
            if related: blocks.append(para('Written foundations:', '; '.join(related),10))
            blocks += [p(entry['publisher'],9.2),url_line(entry['url']),p('Video reference only. '+entry.get('relationship',''),9.0),p(' ',7,space=8)]
        blocks.append(p('These cards identify source material; they do not supply a complete teaching sequence. Teach the linked written foundations first and select a suitable progression before using a clip. Prior review used publisher information and visual spot-checks, not a complete audiovisual review.',8.7))
        book.add('Video reference cards','FACEBOOK COLLECTION  /  '+', '.join(x['id'] for x in pair),blocks,pair[0]['id'])
        for entry in pair:book.positions[entry['id']]=len(book.pages)
    book.even()


def season_pages(book, season):
    if not season:return
    b=[p(season['intro'])]
    for key,title in [('repeat','When to repeat'),('advance','When to advance'),('catch_up','After a missed practice'),('late_joiner','Welcoming a late joiner')]:
        value=season.get('guidance',{}).get(key)
        if value:
            b += [head(title),p(value if isinstance(value,str) else ' '.join(value))]
    b.append(p('This pathway organizes the existing 90 practice plans. Phases are teaching blocks, not promised calendar dates or automatic promotion by age. The original blueprint and toolkit remain companions.',9.5))
    book.add('Season pathway','PLAN / REPEAT / ADAPT',b,'season')
    for group in season['groups']:
        age=group['age_group'];b=[p(group['summary'])]
        for phase in group['phases']:
            ns=phase['practice_numbers'];rng=f'{min(ns):02d}-{max(ns):02d}'
            b += [head(phase['title']+'  |  Practices '+rng),p(phase['description'])]
            focus=phase.get('focus',[])
            if focus: b.append(para('Focus:', ' / '.join(focus) if isinstance(focus,list) else focus,9.8))
        b.append(p('See this age group in the master index for each practice title and original binder page. Repeat or simplify a block whenever the readiness checks call for it.',9.2))
        book.add('Ages '+age+' pathway','EXISTING PRACTICES 01-30  /  FIVE FLEXIBLE PHASES',b,'season-'+age)
        if group.get('next_steps'):
            b=[p('Choose one extension only after the athlete can meet its prerequisites with control. These are routes into existing advanced cards, not additional compulsory practices.')]
            for step in group['next_steps']:
                b += [head(step['title']),p(step['description']),para('Ready when:',step['readiness'],9.8),para('Prerequisites:',', '.join(step.get('prerequisite_ids',[])),9.8),para('Explore:',', '.join(step['move_ids']),9.8)]
            book.add('After the foundation practices','ADVANCED EXTENSIONS  /  READINESS FIRST',b,'season-next')
    book.even()


def family_pages(book, family):
    # Compact print adaptation of the two current articles. Check key facts before
    # building so a later website update cannot silently leave this insert stale.
    articles={a['id']:a for a in family['pages']}
    if 'first-practice' in articles and 'programs-levels' in articles:
        first=articles['first-practice']; cross=articles['programs-levels']
        raw=' '.join(s['html'] for s in first['sections'])
        for fact in ['1225 Washington Road','560 Gorsuch Road','TeamSnap','donated','baseball field','concert entrance']:
            if fact not in raw:raise ValueError('Review first-practice print adaptation after changed fact: '+fact)
        b=[p('New wrestlers are welcome. Confirm the program and placement with the club, then check TeamSnap before leaving.'),head('Where to go'),table([
            ['Group / school','Address and entrance'],
            ['Mat Rats recreational team\nWestminster High School','1225 Washington Road, Westminster, MD 21157. Use the main entrance or the concert entrance.'],
            ['Pups and Valkyries\nWinters Mill High School','560 Gorsuch Road, Westminster, MD 21157. Use the entrance by the baseball field.']], [225,285],10.3),
            para('Times and changes:','TeamSnap carries group schedules, arrival instructions, cancellations and changes. Ask the club for access if your family has not received it.'),
            head('Pack and prepare'),p('Bring comfortable athletic clothes, a labeled water bottle, wrestling shoes and any headgear requested for your group, street shoes for outside, and a change of clothes. Ask what is required on day one before buying gear. Use clean mat footwear and keep jewelry off the mat.'),
            para('Donated gear:','The club keeps donated shoes and headgear from previous seasons. Ask a coach about available sizes and fit, or how to pass along usable outgrown gear.'),
            head('Arrive, learn the room, reset'),p('Find the coach or team helper and confirm the group. Locate water and gear space, caregiver waiting and pickup arrangements. Tell the coach about an injury, participation restriction or support need. Check in before joining late.'),p('Help your child learn the stop signal, try a movement and work kindly with a partner. Ask for an easier introduction if needed. Encourage effort without coaching over the instructor. After practice, ask what they tried and check the next TeamSnap message.'),
            head('Get help'),p('For placement or TeamSnap access, include your child\'s age, experience and program of interest when contacting the club.',9.8),url_line('mailto:grindstonewrestlingmd@gmail.com'),url_line('https://www.grindstonewrestling.org/contact'),
            p('Locations, entrances, TeamSnap use and donated gear were confirmed by the club contributor. School addresses were checked against official school information. Current schedules and registration remain with the club.',8.7)]
        book.add(first['title'],'FIRST-PRACTICE CHECKLIST  /  '+DATE,b,'first-practice')
        b=[p(cross['description']),head('The club program is where you belong'),table([
            ['Program','Published ages','Starting point'],
            ['Pups','First year, 4-6','Introductory clinic within Mat Rats: movement, skills and fun, without competitions.'],
            ['Mat Rats recreational team','6-14','Coed program for new and experienced wrestlers. Placement considers age and experience.'],
            ['Valkyries','Girls, 5-14','Dedicated girls program welcoming new and experienced wrestlers. Competition is optional.']], [122,90,298],10.2),
            p('The club confirms placement, current availability, schedules and registration. These published age ranges are program information, not permission to use every move.',10),
            head('Practice age groups help a coach choose a plan'),p('The library has 30 plans each for ages 4-6, 7-10 and 11-14. These groups organize lesson length, language and challenge; they are not separate registration programs. Valkyries coaches can use the same library and adapt it to their athletes.'),
            head('Teaching tiers describe a lesson'),para('Pup:','Movement and introductory foundations, usually with simple solo or cooperative tasks.'),para('Beginner:','Basic positions and partner techniques. Check the guide\'s prerequisites before adding resistance.'),para('Advanced:','Linked attacks, counters and more demanding control. Prerequisite skills matter more than age.'),
            p('An older beginner can use a Pup movement drill. An experienced younger wrestler still needs a readiness check. For unassigned Kyle or Facebook entries, read the setup and adaptations.'),
            head('Choose the next challenge together'),p('Look for a reliable stop signal, controlled movement, respect for a partner and the ability to show the key action. Start cooperatively and add one challenge at a time. Return to a simpler step when a position breaks down.'),
            link('Official Mat Rats and Pups information','https://www.grindstonewrestling.org/mat-rats'),link('Official Valkyries information','https://www.grindstonewrestling.org/copy-of-mat-rats')]
        book.add(cross['title'],'CLUB PROGRAMS / PRACTICE AGE GROUPS / TEACHING TIERS',b,'programs-levels')
        book.even()
        return
    for article in family['pages']:
        if article['id'] not in {'first-practice','programs-levels'}:continue
        blocks=[p(article['description'])]
        for section in article['sections']:
            blocks.append(head(section['title']))
            blocks.extend(p(t,10.2) for t in text_html(section['html']))
        if article.get('sources'):
            blocks.append(head('Source and current information'))
            for source in article['sources']:blocks.append(link(source['title'],source['url'],8.6))
        # Partition at section boundaries. Full article text is retained.
        chunks=[];current=[];height=0
        for block in blocks:
            _,h=block.wrap(510,700); h+=getattr(block,'spaceAfter',7)
            if height+h>568 and current:
                chunks.append(current);current=[];height=0
            current.append(block);height+=h
        if current:chunks.append(current)
        for i,chunk in enumerate(chunks):
            book.add(article['title']+(' - continued' if i else ''),'FAMILY AND COACH QUICK REFERENCE',chunk,article['id'] if i==0 else article['id']+'-'+str(i+1))
    book.even()


def original_sections():
    return [('Coach moves reference','11-54','moves-reference.pdf',43),('Original games G01-G30','55-64','practice-games.pdf',9),('Ages 4-6 practices','65-99','practices-4-6.pdf',34),('Ages 7-10 practices','100-134','practices-7-10.pdf',34),('Ages 11-14 practices','135-169','practices-11-14.pdf',34),('Program blueprint','170-185','program-blueprint.pdf',15),('Coach toolkit and forms','186-201','coach-toolkit.pdf',15),('Quick cues, all ages','202-208',None,None)]


def master_index(path,data,kyle,fb,book,counts):
    master=Book(path,'Grindstone Master Index - October 2026')
    end=216+len(book.pages)
    blocks=[p('A current finding aid for the preserved original library and the new additive supplements. Use printed BINDER numbers to locate original material; do not renumber the original binder.'),head('File in this order'),table([
        ['Set','Pages / sheets','Printed binder range'],['Original coach binder','208 / 104','1-208'],['Extra games G31-G37','8 / 4','209-216'],['Coach supplement 2026',f'{len(book.pages)} / {len(book.pages)//2}',f'217-{end}']], [218,115,177],10),p(f'Combined teaching set: {end} numbered pages / {end//2} double-sided sheets. This separate master index is an optional front reference; its INDEX numbers do not alter BINDER numbers.',10),head('Original sections'),table([['Section','Binder pages']]+[[x[0],x[1]] for x in original_sections()],[390,120],10),p('Print Letter, Actual Size / 100%, double-sided, flip on the long edge. All new sections preserve even page counts and alternating punch margins. Print a short range only when you need those pages.',9.5)]
    master.add('The complete coaching library','MASTER INDEX 2026  /  '+DATE,blocks,'overview')
    for prefix,title in [('P','Pup foundations'),('B','Beginner moves'),('A','Advanced moves')]:
        rows=[['ID','Move','Binder','Move PDF']]
        for m in data['moves']:
            if m['id'].startswith(prefix):
                local=data['move_pages'][m['id']];rows.append([m['id'],m['name'],page_link(local+11,'coaching-binder.pdf',local+11),page_link(local,'moves-reference.pdf',local)])
        master.add(title,'ORIGINAL 72 WRITTEN GUIDES  /  READINESS, NOT AGE PERMISSION',[table(rows,[42,328,70,70],10),p('The Move PDF column refers to the standalone 43-page moves reference. Companion research and video fit notes remain in the website library under the same IDs.',9.2)],'moves-'+prefix)
    rows=[['ID','Game','Binder','Game PDF']]
    for g in data['games']:
        if int(g['id'][1:])<=30:
            local=data['game_pages'][g['id']];rows.append([g['id'],g['name'],page_link(local+55,'coaching-binder.pdf',local+55),page_link(local,'practice-games.pdf',local)])
    master.add('Original practice games','G01-G30  /  PRESERVED NINE-PAGE GAME PDF',[table(rows,[42,328,70,70],10)],'games')
    rows=[['ID','Game','Binder','Extra PDF']]
    for g in data['games']:
        if int(g['id'][1:])>30:
            n=int(g['id'][1:]);rows.append([g['id'],g['name'],page_link(n+179,'team-games.pdf',n-29),page_link(n-29,'team-games.pdf',n-29)])
    b=[table(rows,[42,328,70,70],10),head('What the newer collections contain'),p('K01-K22: complete written coaching progressions, with practice suggestions, readiness requirements, boundaries and source relationships. K01 is a game; K02-K22 are movement or technique guides.'),p('V01-V05: short written drills adapted by Grindstone. V06-V18: source-video reference cards, with observed topics and links to existing written foundations. A reference card is not a complete teaching sequence.'),p('The separate eight-page extra-games PDF starts with its own index on binder page 209. It remains unchanged. No copy of those seven game cards is repeated in the coach supplement.'),head('Evidence and versions'),p('Video metadata, source descriptions and selected-frame reviews have different limits. Read the source note on each new guide. A linked clip may show a component or variant instead of the full written progression. No full viewing of every video is claimed.'),p('This October 2026 supplement carries the current preview wording, including K19 Roll-Out Foundation. Original frozen PDFs retain their earlier wording and original page numbers.')]
    master.add('Extra games and new collections','G31-G37  /  K01-K22  /  V01-V18',b,'extra-games')
    for age,offset in [('4-6',68),('7-10',103),('11-14',138)]:
        rows=[['Plan','Practice','Binder','Plan PDF']]
        for plan in data['practices']:
            if plan['age_group']==age:rows.append([f'{plan["number"]:02d}',plan['title'],page_link(offset+plan['number'],'coaching-binder.pdf',offset+plan['number']),page_link(plan['number']+3,'practices-'+age+'.pdf',plan['number']+3)])
        master.add('Ages '+age+' - 30 practices','ORIGINAL PRACTICE PLANS  /  REPEAT AND ADAPT AS NEEDED',[table(rows,[42,328,70,70],9.8)],'practices-'+age)
    for collection,label,title in [(sorted(kyle,key=lambda x:x['id']),'K','Coach Kyle teaching guides'),(sorted(fb,key=lambda x:x['id']),'V','Facebook drills and references')]:
        rows=[['ID','Title','Type','Binder','Sup.']]
        for entry in collection:
            n=book.positions[entry['id']]
            title_text=entry.get('name',entry.get('title'))
            end_page=n+1 if label=='K' else n
            local=f'{n}-{end_page}' if label=='K' else str(n)
            binder=f'{216+n}-{216+end_page}' if label=='K' else str(216+n)
            rows.append([entry['id'],title_text,'Guide' if label=='K' else ('Drill' if entry.get('steps') else 'Reference'),page_link(binder,'coach-supplement-2026.pdf',n),page_link(local,'coach-supplement-2026.pdf',n)])
        b=[table(rows,[34,260,65,91,60],9.4),p('Sup. means the local page in coach-supplement-2026.pdf. Both the supplement page and continuous binder number appear in its footer.',9.2)]
        if label=='V':b.append(p('Source reference cards share a page in pairs. Use the same V ID on the website for the original clip and full source notes. The short drills and references are distinct from the original written move cards.',9.2))
        master.add(title,'NEW SUPPLEMENT  /  ARTICLE IDS RETAINED',b,'new-'+label)
    rows=[['Topic','Binder','Supplement']]
    for key,title in [('season','Season planning and progression'),('season-4-6','Ages 4-6 season pathway'),('season-7-10','Ages 7-10 season pathway'),('season-11-14','Ages 11-14 season pathway'),('season-next','Advanced extensions'),('first-practice','First-practice orientation'),('programs-levels','Club programs and teaching levels')]:
        if key in book.positions:
            n=book.positions[key];rows.append([title,page_link(216+n,'coach-supplement-2026.pdf',n),page_link(n,'coach-supplement-2026.pdf',n)])
    b=[table(rows,[360,75,75],10),head('Original planning and reusable forms'),table([['Reference','Binder'],['Blueprint: evidence / pathways / coaching','171-173'],['What to teach / flexible season','174-175'],['Engagement / inclusion / health','176-178'],['Safeguarding / operations / competition','179-181'],['Quality measures / launch / sources','181-185'],['First visit / starter practice sessions','188-191'],['Games / wrestling cards','192-193'],['Practice planner / readiness record','194-195'],['Parent orientation / pre-practice check','196-197'],['Emergency plan / incident and cleaning records','198-199'],['Program dashboard / local decisions','200-201'],['Quick cues: 4-6 / 7-10 / 11-14','203 / 205 / 207']],[400,110],9.6)]
    master.add('Planning and coach tools','FIND THE RIGHT FORM BEFORE PRINTING',b,'planning')
    rows=[['Standalone PDF','Pages']]
    for name,count in counts.items():
        if name not in OUTPUTS and name!='coaching-binder.pdf':rows.append([name,str(count)])
    b=[p('These files are preserved individual resources. Print only the parts you need; the original binder already contains the main coaching sections.'),table(rows,[425,85],9.6),head('Other existing formats'),p('Parent orientation slides, presentation outline and presenter script remain available separately. The original coaching-library ZIP and family-kit ZIP are preserved; these new PDFs are separate downloads and are not silently inserted into those archives.',9.8),p('For club dates, fees, placement and current procedures, use the club\'s current instructions and official website.',9.5),url_line('https://www.grindstonewrestling.org/')]
    master.add('Standalone print resources','VERIFIED PDF PAGE COUNTS  /  '+DATE,b,'downloads')
    master.even('Printing and binder notes')
    master.render()
    return master


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--allow-pending',action='store_true');args=parser.parse_args()
    for font,filename in [('Calibri','calibri.ttf'),('CalibriB','calibrib.ttf'),('CalibriI','calibrii.ttf')]:pdfmetrics.registerFont(TTFont(font,str(Path('C:/Windows/Fonts')/filename)))
    pdfmetrics.registerFontFamily('Calibri',normal='Calibri',bold='CalibriB',italic='CalibriI',boldItalic='CalibriB')
    original={f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in (SITE/'downloads').iterdir() if f.is_file() and f.name not in OUTPUTS}
    counts={f.name:len(PdfReader(f).pages) for f in sorted((SITE/'downloads').glob('*.pdf')) if f.name not in OUTPUTS}
    assert counts['coaching-binder.pdf']==208 and counts['team-games.pdf']==8
    loaded=load_data();data=loaded['GRINDSTONE'];kyle=loaded['GRINDSTONE_KYLE']['entries'];guides=loaded['GRINDSTONE_KYLE_INSTRUCTION']['entries'];fb=loaded['GRINDSTONE_VIDEO_ADDITIONS']['entries'];season=loaded.get('GRINDSTONE_SEASON');family=loaded['GRINDSTONE_FAMILY']
    assert len(kyle)==22 and len(fb)==18
    missing=[]
    if not season:missing.append('season-data.js')
    for key in ['first-practice','programs-levels']:
        if key not in {p['id'] for p in family['pages']}:missing.append(key)
    if missing and not args.allow_pending:raise ValueError('Awaiting final source content: '+', '.join(missing))
    book=Book(SITE/'downloads/coach-supplement-2026.pdf','Grindstone Coach Supplement - October 2026',217)
    book.add('Coach supplement 2026','TEACHING GUIDES / PLANNING / SOURCE REFERENCES',[], 'cover')
    book.add('Find the new material','K = COACH KYLE  /  V = FACEBOOK COLLECTION',[], 'contents')
    season_pages(book,season)
    family_pages(book,family)
    kyle_pages(book,kyle,guides)
    fb_pages(book,fb,data)
    end=216+len(book.pages)
    book.pages[0].blocks=[p('A practical companion to the original coaching library. This supplement adds 22 Coach Kyle teaching guides, five short written drills, and 13 source-video reference cards, together with new planning and family orientation material.'),head('Print and file'),p(f'This PDF contains {len(book.pages)} pages / {len(book.pages)//2} double-sided sheets. Append it after the eight-page games addendum. Its printed BINDER numbers run from 217 to {end}; the original 208-page binder and games pages 209-216 stay unchanged.'),p('Use Letter paper, Actual Size / 100%, double-sided, flipping on the long edge. The wider punch margin alternates. Kyle guides use two-page spreads; the Facebook section uses shorter drills and compact reference cards.'),head('Read the teaching relationship'),p('Written steps, repetitions, age adaptations and boundaries are coaching progressions. They are not transcripts of every linked clip. A related video can illustrate a component or variant; teach the stated progression and use the source note to identify the difference.'),p('Age bands organize practice choices. Readiness, controlled receiving, partner trust and a reliable stop-and-release response determine what an athlete should do next. Use the simpler option when those checks are not met.'),head('Find existing instruction'),p('The updated master index points to all 72 original moves, 37 games, 90 practices, planning forms and standalone resources. K and V identifiers match the website. Video reference cards name the original written guide IDs for fuller instruction.'),head('Version and source scope'),p('Prepared '+DATE+' from the current review content. Original downloads and ZIP archives remain unchanged. Publisher titles, links and prior selected-frame checks have different limits; no full viewing of every clip is claimed.',9.6),p('K19 is a Roll-Out Foundation, distinct from the linked head-spin variation. Full teaching notes remain on its guide. Current club logistics and program placement should be confirmed with the club.',9.6)]
    left=[head('Coach Kyle - full guides')];right=[head('Facebook collection')]
    for entry in sorted(kyle,key=lambda x:x['id']):left.append(link(entry['id']+'  '+entry['name']+'  ...  '+str(book.positions[entry['id']]),'#'+entry['id'],9.4))
    for entry in sorted(fb,key=lambda x:x['id']):right.append(link(entry['id']+'  '+entry['title']+'  ...  '+str(book.positions[entry['id']]),'#'+entry['id'],9.4))
    right += [head('Planning and orientation')]
    for key,title in [('season','Season pathway'),('season-next','Advanced extensions'),('first-practice','First practice'),('programs-levels','Programs and teaching levels')]:
        if key in book.positions:right.append(p(title+'  ...  '+str(book.positions[key]),9.4,space=4))
    right.append(p('Numbers on this page are local supplement pages. Add 216 for the printed BINDER number.',8.8))
    book.pages[1].columns=(left,right)
    book.render()
    master=master_index(SITE/'downloads/master-index-2026.pdf',data,kyle,fb,book,counts)
    for name,digest in original.items():assert hashlib.sha256((SITE/'downloads'/name).read_bytes()).hexdigest()==digest,name+' changed'
    report={'date':DATE,'supplement_pages':len(book.pages),'master_index_pages':len(master.pages),'binder_range':[217,end],'supplement_positions':book.positions,'original_pdf_pages':counts,'preserved_original_files':len(original),'pending_content':missing,'minimum_content_bottom':min(x['bottom'] for x in book.bottoms+master.bottoms),'outputs':list(OUTPUTS)}
    mkdir(TMP);report_path=preflight(TMP/'build-report.json');report_path.write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2))


if __name__=='__main__':main()
