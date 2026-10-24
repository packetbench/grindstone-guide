#!/usr/bin/env python3
"""Build the two-page Letter companion from the current family quickstart.

Run: python tools/quickstart-pdf.py
Requires reportlab and pypdf. Reads family-data.js; does not edit website content.
The full article's printable text is checked against the final PDF before saving.
"""
from __future__ import annotations

import hashlib
import html
from html.parser import HTMLParser
import io
import json
from pathlib import Path
import re
import sys
import unicodedata

from pypdf import PdfReader
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    Image, PageBreak, Paragraph, SimpleDocTemplate, Spacer,
    Table, TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "family-data.js"
OUTPUT = ROOT / "downloads" / "season-quickstart-2026.pdf"
BASE_URL = "https://packetbench.github.io/grindstone-guide/"
LIVE_URL = BASE_URL + "#family/season-quickstart"
CHARCOAL = colors.HexColor("#1c2023")
RED = colors.HexColor("#a7302d")
GOLD = colors.HexColor("#d7b559")
MUTED = colors.HexColor("#535b60")
PALE = colors.HexColor("#f2f3f2")
WIDTH = letter[0] - 2 * 47
TRANSLATE = str.maketrans({
    "\u2010": "-", "\u2011": "-", "\u2012": "-", "\u2013": "-",
    "\u2014": " - ", "\u2212": "-", "\u2018": "'", "\u2019": "'",
    "\u201c": '"', "\u201d": '"', "\u00b7": "|", "\u00a0": " ",
})


def preflight(path: Path) -> Path:
    """Validate every generated path before writing, including Windows rules."""
    absolute = path.absolute()
    value = str(absolute)
    units = len(value.encode("utf-16-le")) // 2
    if units > 240:
        raise ValueError(f"Output path exceeds 240 UTF-16 units: {value}")
    if units > 200:
        print(f"Path uses permitted 201-240 range: {value}", file=sys.stderr)
    device = re.compile(r"^(con|prn|aux|nul|com[0-9\u00b9\u00b2\u00b3]|lpt[0-9\u00b9\u00b2\u00b3])(?:\.|$)", re.I)
    parts = absolute.parts
    cursor = Path(parts[0])
    for component in parts[1:]:
        if len(component.encode("utf-16-le")) // 2 > 255:
            raise ValueError(f"Long component: {component}")
        if (component != component.strip() or component.endswith(".")
                or re.search(r'[<>:"/\\|?*\x00-\x1f]', component)
                or device.match(component) or "_vti_" in component.lower()
                or component.lower() in {"desktop.ini", ".ds_store", ".lock"}
                or component.startswith("~$")):
            raise ValueError(f"Unsafe component: {component}")
        if cursor.exists() and (cursor == ROOT or ROOT in cursor.parents):
            matches = [p.name for p in cursor.iterdir()
                       if p.name.casefold() == component.casefold()]
            if any(name != component for name in matches):
                raise ValueError(f"Case-insensitive collision: {cursor / component}")
        cursor /= component
    # Only the existing source-root path is exempt from cosmetic naming rules.
    relative = absolute.relative_to(ROOT)
    for i, component in enumerate(relative.parts):
        is_file = i == len(relative.parts) - 1
        limit = 64 if is_file else 32
        pattern = r"[a-z0-9][a-z0-9_-]*(?:\.[a-z0-9]+)?" if is_file else r"[a-z0-9][a-z0-9_-]*"
        if len(component) > limit or not re.fullmatch(pattern, component):
            raise ValueError(f"Unsafe new output name: {component}")
    if absolute.suffix.lower() in {".tmp", ".lock"}:
        raise ValueError("Temporary names are not deliverables")
    if "onedrive" in [part.casefold() for part in parts]:
        index = [part.casefold() for part in parts].index("onedrive")
        if len("/".join(parts[index + 1:]).encode("utf-16-le")) // 2 > 400:
            raise ValueError("Cloud-relative path exceeds 400 units")
    return absolute


def clean(text: str) -> str:
    return unicodedata.normalize("NFKC", text).translate(TRANSLATE)


class Node:
    def __init__(self, tag="root", attrs=None):
        self.tag, self.attrs, self.children = tag, dict(attrs or []), []

    def text(self):
        return "".join(child.text() if isinstance(child, Node) else child
                       for child in self.children)


class Tree(HTMLParser):
    def __init__(self, markup):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(markup)
        if len(self.stack) != 1:
            raise ValueError("Unbalanced source HTML")

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag == "br":
            node.children.append(" ")
        elif tag not in {"img", "hr", "input", "meta", "link"}:
            self.stack.append(node)

    def handle_endtag(self, tag):
        if tag in {"br", "img", "hr", "input", "meta", "link"}:
            return
        if self.stack[-1].tag != tag:
            raise ValueError(f"Mismatched source HTML end tag: {tag}")
        self.stack.pop()

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def hidden(node):
    return "no-print" in node.attrs.get("class", "").split()


def nodes(node, tag):
    found = []
    for child in node.children:
        if isinstance(child, Node) and not hidden(child):
            if child.tag == tag:
                found.append(child)
            found.extend(nodes(child, tag))
    return found


def inline(node):
    if isinstance(node, str):
        return html.escape(clean(node))
    if hidden(node):
        return ""
    content = "".join(inline(child) for child in node.children)
    if node.tag in {"strong", "b"}:
        return f"<b>{content}</b>"
    if node.tag in {"em", "i"}:
        return f"<i>{content}</i>"
    if node.tag == "br":
        return "<br/>"
    if node.tag == "a":
        href = node.attrs["href"]
        if href.startswith("#"):
            href = BASE_URL + href
        return f'<link href="{html.escape(href, quote=True)}" color="#a7302d">{content}</link>'
    return content


styles = getSampleStyleSheet()
styles.add(ParagraphStyle("Text", fontName="Helvetica", fontSize=10.3,
                          leading=13.8, textColor=CHARCOAL, spaceAfter=7))
styles.add(ParagraphStyle("Heading", parent=styles["Text"], fontName="Helvetica-Bold",
                          fontSize=13, leading=16, textColor=RED,
                          spaceBefore=11, spaceAfter=7, keepWithNext=True))
styles.add(ParagraphStyle("Small", parent=styles["Text"], fontSize=8.6,
                          leading=11, textColor=MUTED))
styles.add(ParagraphStyle("TableCell", parent=styles["Text"], fontSize=9,
                          leading=11.8, spaceAfter=0))
styles.add(ParagraphStyle("TableHead", parent=styles["TableCell"],
                          fontName="Helvetica-Bold", textColor=colors.white))
styles.add(ParagraphStyle("TitleBrand", fontName="Helvetica-Bold", fontSize=22,
                          leading=25, textColor=CHARCOAL, spaceAfter=3))
styles.add(ParagraphStyle("BrandLabel", fontName="Helvetica-Bold", fontSize=9,
                          leading=12, textColor=RED))
styles.add(ParagraphStyle("ListText", parent=styles["Text"], spaceAfter=6,
                          leftIndent=16, firstLineIndent=-16))
styles.add(ParagraphStyle("LinkBox", parent=styles["Text"], fontSize=9.1,
                          leading=12.8, spaceAfter=0))


def paragraph(node, style="Text"):
    return Paragraph(inline(node), styles[style])


def schedule(node):
    rows = nodes(node, "tr")
    data = []
    for i, row in enumerate(rows):
        cells = [c for c in row.children if isinstance(c, Node) and c.tag in {"th", "td"}]
        data.append([paragraph(c, "TableHead" if i == 0 else "TableCell") for c in cells])
    if len(data) != 5 or any(len(row) != 4 for row in data):
        raise ValueError("Schedule changed shape; review the two-page layout")
    table = Table(data, colWidths=[103, 139, 105, WIDTH - 347], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), CHARCOAL),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [PALE, colors.white]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LINEBELOW", (0, -1), (-1, -1), 0.7, GOLD),
    ]))
    return [table, Spacer(1, 10)]


def blocks(node):
    result = []
    for child in node.children:
        if not isinstance(child, Node) or hidden(child):
            continue
        cls = child.attrs.get("class", "").split()
        if child.tag == "p":
            result.append(paragraph(child, "Small" if "fine" in cls else "Text"))
        elif child.tag in {"ul", "ol"}:
            items = [c for c in child.children if isinstance(c, Node) and c.tag == "li"]
            for i, item in enumerate(items, 1):
                label = f"{i}." if child.tag == "ol" else "-"
                result.append(Paragraph(f"<b>{label}</b>  {inline(item)}", styles["ListText"]))
        elif child.tag == "table":
            result.extend(schedule(child))
        elif "quickstart-link" in cls:
            guide_link = nodes(child, "a")[0].attrs["href"]
            qr = QrCodeWidget(guide_link)
            bounds = qr.getBounds()
            side = 63
            scale = side / (bounds[2] - bounds[0])
            drawing = Drawing(side, side, transform=[scale, 0, 0, scale, 0, 0])
            drawing.add(qr)
            row = Table([[Paragraph(inline(child), styles["LinkBox"]), drawing]],
                        colWidths=[WIDTH - 86, 86])
            row.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]))
            result.extend([row, Spacer(1, 8)])
        else:
            result.extend(blocks(child))
    return result


def normalized(text):
    return re.sub(r"\s+", " ", clean(text)).strip()


def main():
    output = preflight(OUTPUT)
    raw = SOURCE.read_text(encoding="utf-8-sig")
    data = json.loads(raw[raw.index("{"):raw.rfind("}") + 1])
    article = next(p for p in data["pages"] if p["id"] == "season-quickstart")
    expected_titles = [
        "Your weekly practice", "Before and after practice",
        "Get every caregiver connected", "Competition depends on your program",
        "Keep the full family guide handy",
    ]
    sections = article["sections"]
    if [s["title"] for s in sections] != expected_titles:
        raise ValueError("Quickstart sections changed; review the two-page layout")
    trees = [Tree(section["html"]).root for section in sections]
    source_hash = hashlib.sha256(raw.replace("\r\n", "\n").encode()).hexdigest()
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=47, rightMargin=47,
                            topMargin=34, bottomMargin=57, title=clean(article["title"]),
                            author="Grindstone Wrestling",
                            subject="Family season quickstart; source SHA256 " + source_hash,
                            pageCompression=1)
    logo = Image(str(ROOT / "assets" / "grindstone-logo.png"), width=55, height=55)
    brand = Table([[logo, [
        Paragraph("GRINDSTONE WRESTLING", styles["BrandLabel"]),
        Paragraph(clean(article["title"]), styles["TitleBrand"]),
    ]]], colWidths=[68, WIDTH - 68])
    brand.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    story = [brand]
    for i, (section, tree) in enumerate(zip(sections, trees)):
        if i == 2:
            story.append(PageBreak())
            story.append(Paragraph("GRINDSTONE WRESTLING / FAMILY QUICKSTART", styles["BrandLabel"]))
        story.append(Paragraph(clean(section["title"]), styles["Heading"]))
        story.extend(blocks(tree))

    def footer(canvas, document):
        canvas.saveState()
        canvas.setStrokeColor(GOLD)
        canvas.setLineWidth(1)
        canvas.line(47, 43, letter[0] - 47, 43)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 7.9)
        canvas.drawString(47, 31, LIVE_URL)
        canvas.linkURL(LIVE_URL, (47, 28, letter[0] - 47, 40), relative=0)
        canvas.drawString(47, 18, f"Prepared {article['reviewed']} | Print double-sided; flip on the long edge")
        canvas.drawRightString(letter[0] - 47, 18, f"{document.page} / 2")
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    payload = buffer.getvalue()
    reader = PdfReader(io.BytesIO(payload))
    if len(reader.pages) != 2:
        raise ValueError(f"Expected two pages, got {len(reader.pages)}. Review content/layout.")
    for page in reader.pages:
        if tuple(float(v) for v in page.mediabox[2:]) != (612.0, 792.0):
            raise ValueError("Companion must use Letter pages")
    extracted = normalized(" ".join(page.extract_text() for page in reader.pages))
    assertions = 0
    for section, tree in zip(sections, trees):
        for fragment in [section["title"]] + [
            n.text() for tag in ("p", "li", "th", "td")
            for n in nodes(tree, tag)
        ]:
            if normalized(fragment) not in extracted:
                raise ValueError(f"Printable source text missing: {fragment}")
            assertions += 1
    if LIVE_URL not in extracted:
        raise ValueError("Readable live companion URL is missing")
    # A source file changed mid-build should never silently produce stale output.
    if SOURCE.read_text(encoding="utf-8-sig") != raw:
        raise ValueError("Family content changed during generation; rerun")
    preflight(output)
    output.write_bytes(payload)
    print(f"Created {output}")
    print(f"Verified 2 Letter pages; {assertions} printable source fragments; {len(payload):,} bytes")
    print(f"Family source SHA256: {source_hash}")


if __name__ == "__main__":
    main()
