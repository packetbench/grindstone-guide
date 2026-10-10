"""Build the eight-page extra games addendum only. Run with python -B."""
import json,re
from pathlib import Path
from urllib.parse import unquote
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor,white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.utils import ImageReader

SITE=Path(__file__).resolve().parents[1]
def preflight(path):
 path=path.resolve(); raw=str(path)
 if len(raw.encode('utf-16-le'))//2>200: raise ValueError('Shorten output path: '+raw)
 for part in path.parts[1:]:
  if len(part.encode('utf-16-le'))//2>255 or re.search(r'[<>:"/\\|?*\x00-\x1f]',part) or part!=part.strip() or part.endswith('.'): raise ValueError(part)
  if re.match(r'(?i)^(con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)',part) or '_vti_' in part.lower() or part.lower() in {'.lock','desktop.ini','.ds_store'} or part.startswith('~$'): raise ValueError(part)
 rel=path.relative_to(SITE)
 for i,part in enumerate(rel.parts):
  if len(part)>(64 if i==len(rel.parts)-1 else 32) or not re.fullmatch(r'[a-z0-9][a-z0-9_.-]*',part): raise ValueError(part)
 if len(unquote(raw.split('OneDrive\\',1)[-1]).encode('utf-16-le'))//2>400: raise ValueError(raw)
 if path.parent.exists():
  for peer in path.parent.iterdir():
   if peer.name.lower()==path.name.lower() and peer.name!=path.name: raise ValueError('Case collision')
 return path

data=json.loads((SITE/'team-games.json').read_text(encoding='utf-8'))
assert len(data['games'])==7
out=preflight(SITE/'downloads/team-games.pdf')
ink=HexColor('#242424'); red=HexColor('#a8312f'); gold=HexColor('#bd9446')
body=ParagraphStyle('Body',fontName='Helvetica',fontSize=10.4,leading=13.6,textColor=ink,spaceAfter=0)
small=ParagraphStyle('Small',parent=body,fontSize=8.6,leading=11.5)
c=canvas.Canvas(str(out),pagesize=(612,792),pageCompression=1)
c.setTitle('Grindstone Extra Games - Index and Seven Game Cards')
c.setAuthor('Grindstone Wrestling')
c.setSubject('Eight-page binder addendum, pages 209-216')
logo=ImageReader(str(SITE/'assets/grindstone-logo.png'))
def header(title,label,page_number):
 global number,left,right,width,y
 number=page_number;left=60 if number%2 else 42;right=42 if number%2 else 60;width=612-left-right
 c.setFillColor(red);c.rect(0,779,612,13,fill=1,stroke=0)
 c.drawImage(logo,612-right-76,697,width=76,height=76,preserveAspectRatio=True,mask='auto')
 c.setFillColor(red);c.setFont('Helvetica-Bold',10);c.drawString(left,755,'GRINDSTONE WRESTLING')
 c.setFillColor(ink);c.setFont('Helvetica-Bold',27);c.drawString(left,718,title)
 c.setFillColor(gold);c.setFont('Helvetica-Bold',9.5);c.drawString(left,697,label)
 c.setStrokeColor(gold);c.setLineWidth(1.2);c.line(left,686,612-right,686);y=675
def para(text,style=body,gap=5):
 global y
 obj=Paragraph(text,style);_,height=obj.wrap(width,700)
 if y-height<66:raise ValueError('Page '+str(number)+' overflows at '+str(y-height))
 obj.drawOn(c,left,y-height);y-=height+gap
def heading(title):
 global y
 y-=3;c.setFillColor(red);c.setFont('Helvetica-Bold',10);c.drawString(left,y-9,title.upper());y-=16
def footer():
 c.setStrokeColor(HexColor('#d9d6d1'));c.setLineWidth(.5);c.line(left,54,612-right,54)
 c.setFillColor(ink);c.setFont('Helvetica',7.5);c.drawString(left,42,'EXTRA GAMES  /  INDEX: 209  /  GAME CARDS: 210-216')
 c.drawString(left,30,'Append after page 208. Letter / 100% / double-sided / flip long edge.')
 c.setFont('Helvetica-Bold',12);c.drawRightString(612-right,34,str(number))
 c.showPage()
header('Extra games','INDEX + SEVEN GAME CARDS  /  FOUR DOUBLE-SIDED SHEETS',209)
c.bookmarkPage('index')
para('Two team favorites and five coaching adaptations. Choose a familiar activity and the version that fits your athletes\' readiness. Timings, resets, scoring options, and age choices are marked as suggestions.')
heading('Find the game')
c.setFillColor(ink);c.setFont('Helvetica-Bold',9);c.drawString(left,y-10,'GAME');c.drawRightString(612-right-62,y-10,'PDF PAGE');c.drawRightString(612-right,y-10,'BINDER');y-=21
for g in data['games']:
 c.setFillColor(HexColor('#f4f1ec'));c.roundRect(left,y-45,width,42,4,fill=1,stroke=0)
 c.setFillColor(red);c.setFont('Helvetica-Bold',11);c.drawString(left+10,y-18,g['id']+'  '+g['name'])
 c.setFillColor(ink);c.setFont('Helvetica',8.5);c.drawString(left+10,y-33,g.get('origin_label','Team favorite')+'  /  suggested '+str(g['minutes'])+' minutes')
 c.setFont('Helvetica-Bold',11);c.drawRightString(612-right-64,y-24,str(g['print_page']));c.drawRightString(612-right-10,y-24,str(g['binder_page']))
 c.linkRect('',g['id'],(left,y-45,612-right,y),relative=0,thickness=0)
 y-=49
heading('Print and file')
para('Print this PDF on Letter paper at 100%, double-sided, flipping on the long edge. Its eight pages make four sheets. Append it after the original binder\'s page 208; the combined set is 216 pages / 108 sheets.')
para('This addendum has its own index. The original binder, index, PDFs, and library ZIP remain unchanged and do not include these seven additions.')
heading('Use the demonstrations')
para('Each card links a related video and names its source. Source linkage and title/publisher metadata were checked; footage was not watched. Teach the written version and its contact limits before starting the game.',small)
footer()
for g in data['games']:
 header(g['name'],g['id']+'  /  '+g.get('origin_label','Team favorite').upper()+'  /  SUGGESTED '+str(g['minutes'])+' MINUTES',g['binder_page'])
 c.bookmarkPage(g['id']);c.addOutlineEntry(g['id']+' '+g['name'],g['id'],0,False)
 para(escape(g['print_summary']),body,6)
 heading('Set up')
 para('<b>Equipment:</b> '+escape(g['equipment']))
 para(escape(g['setup']))
 heading('How to play')
 para(escape(g['play']))
 for i,step in enumerate(g['steps'],1):para('<b>'+str(i)+'.</b> '+escape(step),body,4)
 heading('Suggested adaptations')
 para(escape(g['variation']))
 heading('Coach watch')
 para(escape(g['boundary']))
 para('<b>Say this:</b> '+escape(' | '.join(g['cues'])),body,5)
 heading('Related demonstration & source')
 record=data['videos'][g['id']];video=record.get('video')
 if video:
  para('<b>'+escape(video['channel'])+':</b> <link href="'+escape(video['url'])+'">'+escape(video['title'])+'</link><br/>'+escape(video['url']),small,4)
  if g['id']=='G36':
   para('<link href="https://www.uicoach.org/recess-games/stuckinthemud">Video source: uicoach.org/recess-games/stuckinthemud</link><br/><link href="'+escape(g['sources'][0]['url'])+'">Written source: UK Coaching / Play Their Way - Wrestling games for children</link>',small,4)
  else:para('<link href="https://www.usawmembership.com/usa_wrestling_core_curriculum/7">Official curriculum: usawmembership.com/usa_wrestling_core_curriculum/7</link>',small,4)
  para('Related demonstration; follow the selected written rules. Source linkage and metadata checked October 10, 2026; footage not watched.'+(' Use hand-to-ankle touches, never foot-stepping.' if g['id']=='G31' else ''),small,4)
 else:para(escape(record.get('note','Use a coach-led demonstration of the written rules.')),small,4)
 para(escape('Team favorite shared by a coach. Added timing, resets, scoring/rotation, and age choices are suggestions.' if g['id'] in {'G31','G32'} else 'Coaching adaptation of a named source game. Added timing, resets, scoring, contact limits, and age choices are suggestions.'),small,0)
 print(json.dumps({'game':g['id'],'binder_page':number,'body_bottom':round(y,1),'left_margin':left,'right_margin':right}))
 footer()
c.save()
print(str(out))
