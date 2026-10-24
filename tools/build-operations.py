"""Build the four-page paper worksheet edition from the authoritative HTML.

No duplicate worksheet prose lives here. Every body, table, checklist and footer
is read from downloads/operations-worksheets.html. Fail rather than clip a page.
"""
from __future__ import annotations

import argparse
import html
import io
import re
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


@dataclass
class Element:
    tag: str
    attrs: dict = field(default_factory=dict)
    children: list = field(default_factory=list)

    def text(self):
        return ''.join(c.text() if isinstance(c, Element) else c for c in self.children)

    def elements(self, tag=None):
        return [c for c in self.children if isinstance(c, Element) and (tag is None or c.tag == tag)]

    def find_all(self, tag):
        out = []
        for child in self.elements():
            if child.tag == tag:
                out.append(child)
            out.extend(child.find_all(tag))
        return out


class SourceParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Element('document')
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Element(tag, dict(attrs))
        self.stack[-1].children.append(node)
        if tag == 'br':
            node.children.append('\n')
        elif tag not in {'meta', 'link', 'input', 'img', 'hr'}:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def normalized(text):
    return text.replace('\xa0', ' ').translate(str.maketrans({'\u2013': '-', '\u2014': '-', '\u2011': '-', '\u2192': '>'}))


def compact(text):
    return re.sub(r'\s+', '', normalized(text))


def preflight(target, replace=False):
    """Validate every newly chosen descendant before the output write."""
    target = target.resolve()
    assert len(str(target).encode('utf-16-le')) // 2 <= 200, target
    for part in target.parts[1:]:
        assert len(part.encode('utf-16-le')) // 2 <= 255, part
        assert part == part.strip() and not part.endswith('.'), part
        assert not re.search(r'[<>:"/\\|?*\x00-\x1f]', part), part
        assert not re.match(r'^(con|prn|aux|nul|com[0-9\u00b9\u00b2\u00b3]|lpt[0-9\u00b9\u00b2\u00b3])(?:\.|$)', part, re.I), part
        assert '_vti_' not in part.lower() and part.lower() not in {'.lock', 'desktop.ini', 'forms'}, part
    assert len(target.name) <= 64 and re.fullmatch(r'[a-z0-9_-]+\.[a-z0-9]+', target.name), target
    cloud = next((p for p in target.parents if p.name.lower() == 'onedrive'), None)
    if cloud:
        assert len(str(target.relative_to(cloud)).encode('utf-16-le')) // 2 <= 400
    assert target.parent.is_dir(), target.parent
    collisions = [p for p in target.parent.iterdir() if p.name.lower() == target.name.lower()]
    assert not collisions or (replace and collisions == [target]), collisions
    return target


INK = colors.HexColor('#202629')
GOLD = colors.HexColor('#ad841d')
RULE = colors.HexColor('#9da5a7')
PALE = colors.HexColor('#f1f2ed')
MARGIN = 39.6
WIDTH = letter[0] - 2 * MARGIN
STYLES = {
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10, leading=13, textColor=INK),
    'note': ParagraphStyle('note', fontName='Helvetica', fontSize=9, leading=11.5, textColor=INK),
    'h2': ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=INK),
    'cell': ParagraphStyle('cell', fontName='Helvetica', fontSize=9, leading=11, textColor=INK),
    'head': ParagraphStyle('head', fontName='Helvetica-Bold', fontSize=8.5, leading=10.5, textColor=INK),
    'footer': ParagraphStyle('footer', fontName='Helvetica', fontSize=7.8, leading=10, textColor=INK),
}


def para(text, kind='body'):
    markup = html.escape(normalized(text).strip()).replace('\n', '<br/>')
    return Paragraph(markup, STYLES[kind])


class SheetRenderer:
    def __init__(self, pdf):
        self.pdf = pdf
        self.section_id = ''
        self.table_index = 0
        self.bottoms = []

    def paragraph(self, text, y, x=MARGIN, width=WIDTH, kind='body', gap=7):
        p = para(text, kind)
        _, height = p.wrap(width, 720)
        p.drawOn(self.pdf, x, y - height)
        return y - height - gap

    def table(self, element, y, x, width):
        rows = element.find_all('tr')
        count = len(rows[0].elements())
        ratios = {
            ('gear', 0): [.12, .18, .27, .18, .25],
            ('gear', 1): [.12, .22, .22, .23, .21],
            ('roles', 0): [.22, .39, .39],
            ('event', 0): [.36, .17, .17, .30],
            ('documents', 0): [.24, .20, .16, .13, .27],
        }[(self.section_id, self.table_index)]
        assert count == len(ratios)
        contents = [[para(c.text(), 'head' if c.tag == 'th' else 'cell') for c in row.elements()] for row in rows]
        table = Table(contents, colWidths=[width * r for r in ratios], hAlign='LEFT')
        blank_height = 35 if self.section_id in {'gear', 'documents'} else 40
        table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), .5, RULE),
            ('BACKGROUND', (0, 0), (-1, 0), PALE),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 7),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ]))
        # Blank and partly blank rows need room for handwriting.
        if self.section_id != 'roles':
            table._argH = [None] + [blank_height] * (len(rows) - 1)
            table._rowHeights = table._argH[:]
        _, height = table.wrap(width, 720)
        table.drawOn(self.pdf, x, y - height)
        self.table_index += 1
        return y - height - 8

    def element(self, el, y, x=MARGIN, width=WIDTH):
        if el.tag == 'p':
            kind = 'note' if 'note' in el.attrs.get('class', '') else 'body'
            if 'warning' in el.attrs.get('class', ''):
                start = y
                y = self.paragraph(el.text(), y, x + 10, width - 10, kind)
                self.pdf.setStrokeColor(GOLD)
                self.pdf.setLineWidth(2)
                self.pdf.line(x, start, x, y + 7)
                return y
            return self.paragraph(el.text(), y, x, width, kind)
        if el.tag == 'h2':
            return self.paragraph(el.text(), y - 7, x, width, 'h2', 7)
        if el.tag == 'ul':
            for li in el.elements('li'):
                self.pdf.setStrokeColor(INK)
                self.pdf.setLineWidth(.6)
                self.pdf.rect(x + .5, y - 9, 7, 7, fill=0, stroke=1)
                y = self.paragraph(li.text(), y, x + 15, width - 15, 'body', 5)
            return y
        if el.tag == 'table':
            return self.table(el, y, x, width)
        if el.tag == 'div':
            if 'two' in el.attrs.get('class', '').split():
                gap = 22
                cw = (width - gap) / 2
                bottoms = []
                for i, col in enumerate(el.elements()):
                    cy = y
                    for child in col.elements():
                        cy = self.element(child, cy, x + i * (cw + gap), cw)
                    bottoms.append(cy)
                return min(bottoms)
            for child in el.elements():
                y = self.element(child, y, x, width)
            return y
        raise ValueError(f'Unsupported worksheet block: {el.tag}')

    def sheet(self, section, number):
        self.section_id = section.attrs['id']
        self.table_index = 0
        header = section.elements('header')[0]
        labels = header.elements('p')
        self.pdf.setFillColor(INK)
        self.pdf.setFont('Helvetica-Bold', 8.5)
        self.pdf.drawString(MARGIN, 751, normalized(labels[0].text()))
        self.pdf.setFont('Helvetica-Bold', 20)
        self.pdf.drawString(MARGIN, 723, normalized(header.elements('h1')[0].text()))
        self.pdf.setFont('Helvetica', 8.5)
        self.pdf.drawString(MARGIN, 705, normalized(labels[1].text()))
        self.pdf.setStrokeColor(GOLD)
        self.pdf.setLineWidth(2)
        self.pdf.line(MARGIN, 694, letter[0] - MARGIN, 694)
        y = 678
        for child in section.elements():
            if child.tag not in {'header', 'footer'}:
                y = self.element(child, y)
        if y < 83:
            raise ValueError(f'Worksheet {number} would overflow: last body baseline {y:.1f}')
        self.bottoms.append(round(y, 1))
        self.pdf.setStrokeColor(RULE)
        self.pdf.setLineWidth(.5)
        self.pdf.line(MARGIN, 72, letter[0] - MARGIN, 72)
        footer = section.elements('footer')[0].text()
        self.paragraph(footer, 64, width=WIDTH - 46, kind='footer', gap=0)
        self.pdf.setFont('Helvetica', 8)
        self.pdf.setFillColor(INK)
        self.pdf.drawRightString(letter[0] - MARGIN, 53, f'{number} / 4')
        self.pdf.showPage()


def main():
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('--replace', action='store_true', help='Rebuild the explicitly owned generated PDF.')
    opts = args.parse_args()
    root = Path(__file__).resolve().parents[1]
    source = root / 'downloads/operations-worksheets.html'
    target = preflight(root / 'downloads/operations-worksheets.pdf', opts.replace)
    original = source.read_bytes()
    parser = SourceParser()
    parser.feed(original.decode('utf-8'))
    sheets = [n for n in parser.root.find_all('section') if 'sheet' in n.attrs.get('class', '').split()]
    assert [s.attrs['id'] for s in sheets] == ['gear', 'roles', 'event', 'documents']
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter, pageCompression=1)
    pdf.setTitle('Grindstone Wrestling - Draft Operations Worksheets')
    pdf.setAuthor('Grindstone Wrestling')
    pdf.setSubject('Four blank draft worksheets. Print double-sided with long-edge binding.')
    renderer = SheetRenderer(pdf)
    for i, sheet in enumerate(sheets, 1):
        renderer.sheet(sheet, i)
    pdf.save()
    data = buffer.getvalue()
    reader = PdfReader(io.BytesIO(data))
    assert len(reader.pages) == 4
    # Confirm every substantive source text unit survived pagination and layout.
    for sheet, page in zip(sheets, reader.pages):
        extracted = compact(page.extract_text())
        for node in sheet.find_all('p') + sheet.find_all('h1') + sheet.find_all('h2') + sheet.find_all('li') + sheet.find_all('th') + sheet.find_all('td') + sheet.find_all('footer'):
            expected = compact(node.text())
            assert expected in extracted, f'Missing source content: {node.text()}'
    assert source.read_bytes() == original, 'Source changed during build; retry after the writer completes.'
    preflight(target, opts.replace)
    target.write_bytes(data)
    print(f'Created {target}')
    print(f'Pages: 4; all source text verified; body bottoms (pt): {renderer.bottoms}')


if __name__ == '__main__':
    main()
