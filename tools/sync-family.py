"""Copy the selected preserved family resources and verify their exact bytes. Run with python -B."""
import hashlib, io, json, re, zipfile
from pathlib import Path
from urllib.parse import unquote
from pypdf import PdfReader

SITE = Path(__file__).resolve().parents[1]
SOURCE = SITE.parent.parent / "Wrestiling" / "output"
SPECS = [
 ("Grindstone-Parent-Handout.pdf", "parent-guide.pdf", 4),
 ("Grindstone-Parent-FAQ.pdf", "parent-faq.pdf", 1),
 ("Grindstone-Common-Penalties.pdf", "common-penalties.pdf", 1),
 ("Grindstone-Code-of-Conduct.pdf", "family-conduct.pdf", 1),
 ("Grindstone-Skin-Health-Handout.pdf", "skin-health.pdf", 1),
 ("Grindstone-Matside-Welcome-Sign.pdf", "matside-welcome.pdf", 1),
 ("Grindstone-Volunteer-Coach-Handout.pdf", "volunteer-coaching.pdf", 1),
 ("Grindstone-Parent-Orientation-Final.pptx", "parent-orientation.pptx", None),
 ("Grindstone-Speaker-Script.docx", "presenter-script.docx", None),
 ("Grindstone-Parent-Presentation-Outline.docx", "presentation-outline.docx", None),
 ("Grindstone-Research-and-Sources.md", "parent-sources.md", None),
 ("Grindstone-Skin-Health-Sources.md", "skin-sources.md", None),
]

def sha(data):
 return hashlib.sha256(data).hexdigest()

def preflight(path):
 path = path.resolve()
 raw = str(path)
 if len(raw.encode("utf-16-le")) // 2 > 200:
  raise ValueError("Shorten output path: " + raw)
 for component in path.parts[1:]:
  if len(component.encode("utf-16-le")) // 2 > 255 or re.search(r'[<>:"/\\|?*\x00-\x1f]', component):
   raise ValueError("Invalid component: " + component)
  if component != component.strip() or component.endswith("."):
   raise ValueError("Invalid edge characters")
  if re.match(r"(?i)^(con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)", component):
   raise ValueError("Reserved device")
  if "_vti_" in component.lower() or component.lower() in {".lock", "desktop.ini", ".ds_store"} or component.startswith("~$"):
   raise ValueError("Reserved cloud component")
 rel = path.relative_to(SITE)
 for index, component in enumerate(rel.parts):
  maximum = 64 if index == len(rel.parts)-1 else 32
  if len(component)>maximum or not re.fullmatch(r"[a-z0-9][a-z0-9_.-]*", component):
   raise ValueError("Invalid chosen name: " + component)
 cloud = unquote(raw.split("OneDrive\\", 1)[-1])
 if len(cloud.encode("utf-16-le")) // 2 > 400:
  raise ValueError("Cloud path too long")
 if path.parent.exists():
  for sibling in path.parent.iterdir():
   if sibling.name.lower() == path.name.lower() and sibling.name != path.name:
    raise ValueError("Case collision")
 return path

manifest_path = preflight(SITE / "family-integrity.json")
archive_path = preflight(SITE / "downloads/family-kit.zip")
targets = [preflight(SITE / "downloads" / name) for _, name, _ in SPECS]
for target in targets:
 if not target.parent.is_dir():
  raise ValueError("Expected existing downloads directory")
records, payloads = [], {}
for (source_name, target_name, expected_pages), target in zip(SPECS, targets):
 source = SOURCE / source_name
 data = source.read_bytes()
 record = {"source": source_name, "site_path": "downloads/" + target_name, "sha256": sha(data), "bytes": len(data)}
 if expected_pages is not None:
  reader = PdfReader(io.BytesIO(data))
  assert len(reader.pages) == expected_pages, source_name
  assert all(abs(float(p.mediabox.width)-612)<1 and abs(float(p.mediabox.height)-792)<1 for p in reader.pages), source_name
  record["pages"] = expected_pages
 if target.suffix in {".pptx", ".docx"}:
  with zipfile.ZipFile(io.BytesIO(data)) as z:
   assert z.testzip() is None
   if target.suffix == ".pptx":
    record["slides"] = len([n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)])
    assert record["slides"] == 16
 if target.exists() and target.read_bytes() != data:
  raise ValueError("Existing destination differs; review before replacement: " + str(target))
 records.append(record)
 payloads[target_name] = data

# Preflight the hypothetical extracted descendants too; the archive is flat.
for name in payloads:
 preflight(SITE / "downloads" / name)
archive_buffer = io.BytesIO()
with zipfile.ZipFile(archive_buffer, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
 for name, data in payloads.items():
  info = zipfile.ZipInfo(name, (2026, 9, 26, 0, 0, 0))
  info.compress_type = zipfile.ZIP_DEFLATED
  info.external_attr = 0o644 << 16
  z.writestr(info, data)
archive_bytes = archive_buffer.getvalue()
manifest = {
 "verified": "2026-10-11",
 "source_prepared": "2026-09-26",
 "source_package": "Wrestiling/output",
 "method": "Preserved bytes; current page and slide counts verified. Source dates remain visible.",
 "canonical_presentation": "Grindstone-Parent-Orientation-Final.pptx",
 "skin_reference_scope": "Three examples: ringworm, impetigo, staph/MRSA. Three photo credits. Older four-example QA is superseded.",
 "files": records,
 "archive": {"site_path": "downloads/family-kit.zip", "entries": len(payloads), "sha256": sha(archive_bytes)}
}
manifest_bytes = (json.dumps(manifest, indent=2) + "\n").encode("utf-8")
for target, data in [(archive_path, archive_bytes), (manifest_path, manifest_bytes)]:
 if target.exists() and target.read_bytes() != data:
  raise ValueError("Existing generated destination differs; review before replacement: " + str(target))
# Verify inputs stayed stable before the first write.
for record in records:
 assert sha((SOURCE / record["source"]).read_bytes()) == record["sha256"]
for target, (_, name, _) in zip(targets, SPECS):
 if not target.exists():
  target.write_bytes(payloads[name])
for target, data in [(archive_path, archive_bytes), (manifest_path, manifest_bytes)]:
 if not target.exists():
  target.write_bytes(data)
for record in records:
 assert sha((SITE / record["site_path"]).read_bytes()) == record["sha256"]
 assert sha((SOURCE / record["source"]).read_bytes()) == record["sha256"]
print(json.dumps({"preserved_files": len(records), "pdf_pages": sum(r.get("pages", 0) for r in records), "presentation_slides": 16, "archive_entries": len(payloads), "max_output_path": max(len(str(p)) for p in targets + [manifest_path, archive_path])}, indent=2))
