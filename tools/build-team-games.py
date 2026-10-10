"""Build the two-page team favorites addendum only. Run with python -B."""
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
out=preflight(SITE/'downloads/team-games.pdf')
ink=HexColor('#242424'); red=HexColor('#a8312f'); gold=HexColor('#bd9446')
body=ParagraphStyle('Body',fontName='Helvetica',fontSize=10.4,leading=13.6,textColor=ink,spaceAfter=0)
small=ParagraphStyle('Small',parent=body,fontSize=8.6,leading=11.5)
c=canvas.Canvas(str(out),pagesize=(612,792),pageCompression=1)
c.setTitle('Grindstone Team Favorites - Ankle Tag and Bulldog')
c.setAuthor('Grindstone Wrestling')
c.setSubject('Two-page binder addendum, pages 209-210')
logo=ImageReader(str(SITE/'assets/grindstone-logo.png'))
for g in data['games']:
 number=g['binder_page']; left=60 if number%2 else 42; right=42 if number%2 else 60; width=612-left-right
 c.setFillColor(red); c.rect(0,779,612,13,fill=1,stroke=0)
 c.drawImage(logo,612-right-76,697,width=76,height=76,preserveAspectRatio=True,mask='auto')
 c.setFillColor(red); c.setFont('Helvetica-Bold',10); c.drawString(left,755,'GRINDSTONE WRESTLING')
 c.setFillColor(ink); c.setFont('Helvetica-Bold',27); c.drawString(left,718,g['name'])
 c.setFillColor(gold); c.setFont('Helvetica-Bold',10); c.drawString(left,697,g['id']+'  /  TEAM FAVORITE  /  SUGGESTED '+str(g['minutes'])+' MINUTES')
 c.setStrokeColor(gold); c.setLineWidth(1.2); c.line(left,686,612-right,686)
 y=675
 def para(text,style=body,gap=5):
  global y
  obj=Paragraph(text,style); _,height=obj.wrap(width,700)
  if y-height<66: raise ValueError('Page '+str(number)+' overflows at '+str(y-height))
  obj.drawOn(c,left,y-height); y-=height+gap
 def heading(title):
  global y
  y-=3; c.setFillColor(red); c.setFont('Helvetica-Bold',10); c.drawString(left,y-9,title.upper()); y-=16
 para(escape('Paired, touch-only ankle tag.' if g['id']=='G31' else 'Also called Sharks and Minnows. Team rule: hip to mat = new shark.'),body,6)
 heading('Set up')
 para('<b>Equipment:</b> '+escape(g['equipment']))
 para(escape(g['setup']))
 heading('How to play')
 para(escape(g['play']))
 for i,step in enumerate(g['steps'],1): para('<b>'+str(i)+'.</b> '+escape(step),body,4)
 heading('Suggested adaptations')
 para(escape(g['variation']))
 heading('Coach watch')
 para(escape(g['boundary']))
 para('<b>Say this:</b> '+escape(' | '.join(g['cues'])),body,5)
 heading('Related demonstration & source')
 video=data['videos'][g['id']]['video']
 para('<b>USA Wrestling:</b> <link href="'+escape(video['url'])+'">'+escape(video['title'])+'</link><br/>'+escape(video['url'])+'<br/><link href="https://www.usawmembership.com/usa_wrestling_core_curriculum/7">Official games curriculum: usawmembership.com/usa_wrestling_core_curriculum/7</link>',small,4)
 para('Related video, not these exact team rules. Official curriculum link and metadata checked October 10, 2026; footage not watched. '+('Use hand-to-ankle touches, never foot-stepping.' if g['id']=='G31' else 'Crawling/hug Bulldog is another variation; use the written team rules here.'),small,4)
 para('Team favorite shared by a coach. Added round lengths, resets, scoring/rotation, and age choices are suggestions.',small,0)
 c.setStrokeColor(HexColor('#d9d6d1')); c.setLineWidth(.5); c.line(left,54,612-right,54)
 c.setFillColor(ink); c.setFont('Helvetica',7.5); c.drawString(left,42,'TEAM FAVORITES INDEX: G31 Ankle Tag - 209 | G32 Bulldog - 210')
 c.drawString(left,30,'Append after page 208. Letter / 100% / double-sided / flip long edge.')
 c.setFont('Helvetica-Bold',12); c.drawRightString(612-right,34,str(number))
 print(json.dumps({'game':g['id'],'binder_page':number,'body_bottom':round(y,1),'left_margin':left,'right_margin':right}))
 c.showPage()
c.save()
print(str(out))
