# Grindstone coach library website

A self-contained, buildless website for GitHub Pages. Open `index.html` directly, or serve this folder with a static server. All asset URLs are relative, so a GitHub project URL works.

## Contents

- 72 original reviewed moves plus 3 new series lessons, with written instruction and research.
- A blank practice builder with editable activities, series, timing, local saves, JSON backups and printable run sheets.
- Six readiness-based season phases for each of ages 4-6, 7-10 and 11-14; skills/series, strength and endurance progress together.
- 37 games: the original 30, two team favorites, and five coaching adaptations, with demonstration/source links and clear variation notes.
- Full program blueprint, coach toolkit, and print downloads.
- Genuine Shorts when suitable; standard videos when the more useful source is a full lesson.
- No accounts, analytics, API keys, or build dependencies. Saved items use browser-local storage only.

## Publish this folder as its own repository

1. Upload the contents of this folder to the root of the chosen GitHub repository. Do not upload the parent working folder or its research caches.
2. In repository Settings > Pages, select **GitHub Actions** as the source.
3. The included `.github/workflows/pages.yml` deploys pushes to `main`, or can be run manually from Actions. Adjust the branch if your default is different.
4. Open the Pages URL shown by GitHub after deployment succeeds.

If retaining this folder inside a larger repository, place the workflow at that repository's `.github/workflows/pages.yml` and change the artifact path to `grindstone-site`. GitHub does not discover workflows inside nested project folders.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Content maintenance

`data.js` contains the complete website content. Keep the audited move wording and the video match notes together. Replace video URLs only with inspected public links, never by guessing IDs or converting watch links into Shorts. A related demonstration is not an exact demonstration of an original game.

The source library PDFs are copied byte for byte; this website does not rewrite them. File names in this new folder use the current workspace naming policy.

Local build helper: `tools/build-data.py` reads the adjacent `Grindstone-Coaching-Library` plus the five reviewed video JSON files in `grindstone-work` and the repository-local `team-games.json`. It is for the original workspace only; no build is needed when publishing.

Public-facing video notes state whether footage, source linkage, or metadata were reviewed. Availability can change. Links do not imply USA Wrestling or a video's publisher endorses Grindstone.

## Video coverage at handoff

Checked October 10, 2026: all 72 moves and 36 of 37 games have a linked demonstration. Across these 108 references, 48 use actual YouTube Shorts, 56 use standard YouTube videos, and four preserve the original Vimeo instruction. Links may be reused for shared components. G06 Team Shape Factory needs a coach-led or team-recorded demonstration because no suitable public clip was verified. G36 Freeze & Rescue links the UK Coaching handout and a related Better Health Families video linked by UI Coach; the similarly named USA Wrestling video shows a different activity and is not used. Related clips do not replace the written game rules.

## Extra games addendum

team-games.json preserves seven additions: Ankle Tag (G31), Bulldog (G32), Tail Tag (G33), Towel Tug (G34), Circle the Bear (G35), Freeze & Rescue (G36), and Power Ball (G37). The first two are team favorites shared by a coach; the others are coaching adaptations of named source games. Added timing, scoring/reset choices, equipment options, and age adaptations are explicitly suggestions. Six standard YouTube links are official USA Wrestling curriculum references; their metadata was verified, but footage was not watched. Freeze & Rescue uses the UK Coaching written source plus a related Better Health Families video linked from UI Coach. Its source linkage and metadata were checked; footage was not watched.

downloads/team-games.pdf is a separate eight-page Letter addendum: an index plus seven game cards. Print double-sided, long-edge flip, at 100% and append after the original binder's page 208. Binder page 209 is the new index; pages 210-216 are G31-G37. Alternating binding margins are preserved. The total is 216 pages / 108 sheets when this four-sheet addendum follows the original 208-page binder. The original index, PDFs, binder, and library ZIP remain unchanged and do not contain these additions.

tools/build-team-games.py rebuilds only this addendum from team-games.json using ReportLab. The main data builder preserves all seven additions on rebuild. No build is required for the published website.

## Families and volunteer resources

The Families hub adds a 16-question searchable FAQ, a meet-day checklist,
folkstyle match basics, family expectations, and health guidance. Volunteer
coaching inquiries use the club's official Contact page; this site does not
promise openings, an assistant assignment, a particular weekly commitment, or
which inbox the club monitors.

- Routes: #families, #family/faq, #family/meet-day, #family/match-basics,
  #family/expectations, #family/health, and #volunteer.
- Content: family-data.js contains the family pages and download metadata.
  It is separate from the preserved coaching data and survives build-data.py.
- Downloads are grouped for coaches, families, and presenters. The four-page
  parent guide already includes the FAQ and penalties; those two one-page
  files are optional extracts. Family resources do not expand the coach binder.
- A single 16-slide presentation is published. The curated family-kit.zip
  contains the 12 selected public documents, with one presentation and no
  internal publishing notes or redundant presentation variants.
- tools/sync-family.py copies the selected September 26, 2026 documents from
  the neighboring Wrestiling/output directory and checks exact hashes, PDF
  page counts, and presentation slide count. It refuses differing existing
  destinations so future replacements receive an explicit review.
- family-integrity.json records preserved source filenames, hashes, current
  page counts, and the archive manifest. The current skin reference has three
  examples and three photo credits; earlier four-example QA is superseded.
- Web source review: October 11, 2026. Rules are labeled NFHS folkstyle with
  youth/event modifications; seasonal dates, fees, logistics, placement, and
  participation expectations remain questions for the club. Health and weight
  concerns are directed to healthcare professionals. The original downloadable
  documents retain their September 26 preparation date.
- Existing QR codes stay in printable documents and lead to their original
  club/contact/USA Wrestling destinations. Web pages use ordinary labeled links.


## Coach Kyle, About Us and sponsors preview

October 12, 2026 update: `kyle-data.js` contains the 22 submitted videos in six categories: 20 supplied Shorts links and two standard videos. The Corner is nested under Moves at `#moves/kyle`, with detail routes `#moves/kyle/K01` through `#moves/kyle/K22`. Legacy `#kyle` links redirect. All 21 non-game videos also appear in the main Moves library; K01 appears in Games. Written/video filters preserve the original written collections. Downloads is linked in the shared footer.

Video cards use original YouTube thumbnail URLs and a local logo fallback; no YouTube media is bundled. Original titles, supplied labels, and source-check limitations are preserved. Metadata and thumbnail availability were checked through official YouTube oEmbed; footage was not reviewed. K15 has a visible supplied-label/publisher-title mismatch for review.

The About Us hub is at `#about`, with Kyle’s biography at `#about/kyle`. The club story, programs and values are summarized from Grindstone’s official Home, Mat Rats, Valkyries and Volunteers pages, checked October 12, 2026. Current season prices and schedules are left to the official club site.

Kyle’s 2021 coaching start and 2025 appointment as head of Grindstone were supplied by the user. His 1993 Ohio Division III 189-pound title and 6–5 final are documented in official OHSAA results. The Lorain County wrestling history records his high school progression and Cleveland State participation. Full college career dates and results remain unverified; the public biography does not turn a single 1994 reference into an assumed career duration. No Hall of Fame induction or college award is claimed.

Historical photo provenance:

- The state-champion portrait is displayed from the original image URL exposed by Columbia High School’s Kyle Rutledge athletics profile. Its label explicitly identifies Kyle and the 1993 wrestling title. This is an athletics / All Ohio entry, not a Hall of Fame induction record.
- `assets/kyle-team.png` is an unchanged render of PDF page 58 (printed page 54) from Columbia’s 1993 Emerald yearbook in the Lorain Public Library System collection. The team caption identifies Kyle in the center of the seated front row.
- `assets/kyle-athletic.png` is an unchanged render of PDF page 114 from the same yearbook. Its Most Athletic caption identifies Joanna Pietch and Kyle Rutledge.
- Full original page pixels are preserved in these PNGs. CSS crops only the displayed viewport, and visible captions link to each source page. Images are attributed source material, not claimed as Grindstone-owned or openly licensed.

Yearbook record: https://lorain.omeka.net/items/show/576

Original PDF: https://s3.amazonaws.com/omeka-lorain/original/fbb35278940ee71c01c7360b2b7b1198.pdf

`#sponsors` is ready for club supporters. `sponsors-data.js` intentionally has an empty `sponsors` array. Future entries accept `name`, `url`, `logo`, and `description`. Add only user-confirmed supporters and approved assets.

Publication requires user review: work on a `codex/` feature branch, show a local preview, and obtain explicit approval of the current changes before pushing or merging to `main` or deploying. See `AGENTS.md`. The existing Pages workflow deploys on main pushes, so a push is also a publication action.

Copied image SHA256 values:

- kyle-team.png: `0c78f87e518ddb35dc06f0230776093bbdd80c0079bdd5127406c5611ec8198d`
- kyle-athletic.png: `008801eced2629ebc1678175f3567721155e62ff18ca280379e1f968404e27b2`

## Coaching team preview

The directory at `#about/coaches` links to Kyle's existing biography and five new
profiles at `#about/coach/<id>`: mike-handleman, eric-westervelt, ryan-devries,
jerome-featherstone, and thomas-schnepp. `coaches-data.js` supplies the editable
profiles, source links, optional photos, and program volunteer recognition. The
earlier ryan-devaris route redirects to ryan-devries for existing preview links.

Grindstone roles and personal coaching details were supplied by the user.
The user confirmed Mike's Delaware Valley identity and Jerome's Oklahoma /
Mad House Boxing identity, supplied Ryan's and Eric's LinkedIn profiles, and
approved Ryan's warm personal description. Ryan's name follows the confirmed
profile spelling, Ryan DeVries. College results and school history for Ryan
and Eric remain research leads until linked to these exact coaches; they are
not presented as established career facts. The user confirmed Jessica M.
Hughes's name and her work in team coordination, events, community outreach
and general program support. The user also confirmed Cody’s steady presence
and requested that they be recognized as a team. A single “Jessica M. and
Cody Hughes” card appears under “People who help make it happen,” separate
from the coaching profiles and commercial sponsors.

Photo provenance:

- `assets/mike-handleman.jpg` is an unchanged 800 x 800 JPEG from the exact
  LinkedIn image URL supplied by the user. The supplied portrait is displayed with a caption; its LinkedIn credit link was removed at the user’s request.
  SHA256: `a99ccf9bc673878850e7e45147e5bcc0e8dab7890ae6249e2bb02b806050743a`.
- Kyle’s archive portrait is preserved unchanged as assets/kyle-rutledge.webp
  with its original school-archive credit. SHA256:
  dfdd4d15465c95278369682bd85a4d304705a371d7999e97d34d52a215d8b6af.
- Jerome’s 1080 x 1080 photograph is preserved unchanged as
  assets/jerome-featherstone.jpg from the original Up2Us Sports image URL,
  with a visible credit linking the March 14, 2018 article. SHA256:
  ef26e853d29bee8f96a2e4ea30f7d302e944ce5d53d2f57f791e47a5d9442931. The
  article places the photo beside a testimonial explicitly naming Jerome
  Featherstone. It replaces the small 150 x 150 Mad House staff thumbnail.
  The original image was visually inspected; no generated alteration or
  identity inference from appearance was used.
- Eric and Ryan now have local portraits from the exact professional profiles
  previously confirmed by the user. Their displayed profile-photo elements
  supplied the image URLs; no identity inference from appearance was used.
  Eric: 500 x 500, assets/eric-westervelt.jpg, SHA256
  a32fafce935b57748cc93a229bf1b073b140d63de5eb063f05f7194a28b8940d.
  Ryan: 800 x 800, assets/ryan-devries.jpg, SHA256
  cba99dfb96d30aa349be43266b084181186e2f08966c3fb483f1fa4dd880c7d4.
  No LinkedIn links appear in the bios or photo credits.
- Thomas still needs a suitable portrait; his own profile displays an initial.
  Jessica’s named profile was linked from her public Mat Rats comment, but its
  current image is a distant kayaking scene. No individual headshot was inferred
  from family photographs. Jessica and Cody have text recognition for now.
  Attributed third-party images are not claimed as Grindstone-owned or openly licensed.

Expanded biography research (October 12, 2026):

- Mike: Shippensburg’s 2006–07 results add primary corroboration across college
  seasons. Program details follow the official Valkyries page. The unnamed
  first-person founding story is not attributed to Mike.
- Eric: the user confirmed his major contribution to club funding through local
  business sponsorship outreach. His confirmed professional profile supports
  Marine Corps service and recreation/parks work; neither a Westminster nor a
  Shenendehowa wrestling history is asserted without an identity bridge.
- Ryan: his confirmed profile directly lists BS Industrial Engineering and MS
  Workforce Development and Training at Eastern Illinois, plus operations and
  training work. Same-name EIU wrestling and Proviso West records remain
  unconfirmed and excluded; no college wrestling career is inferred from attendance.
- Jerome: NEISWA history verifies the 2004 Salisbury 171-pound title; Oklahoma’s
  official media guide lists a 2005 varsity letter; university and Lehigh records
  support competition at 157/165 pounds across 2004–05 and 2005–06. These are
  documented seasons, not a claim about his full career duration.
- Kyle: Carroll County’s 2026 camp guide confirms an instructor role for
  Grindstone’s youth camp. Exact Cleveland State career dates and an explicitly
  captioned college photograph remain unresolved. Existing school photos remain.

The directory and profiles include responsive layouts, About Us navigation,
portrait directory cards, source credits, print controls and image-unavailable
fallbacks. Local portrait assets let the preview work without external image
requests. All changes
remain on the feature branch for local review; publication still requires
explicit approval.


## Written guides for Coach Kyle's collection

All 22 entries now have complete instruction in `kyle-instruction-data.js`,
separate from the preserved original move/game data and video metadata.
Each guide includes purpose, readiness, setup, 5-8 numbered steps, coaching
cues, common mistakes and corrections, a practice drill, adaptations for
ages 4-6 / 7-10 / 11-14, action-specific boundaries, sources, and an explicit
description of its relationship to the linked video.

The existing `#moves/kyle/K01` through `#moves/kyle/K22` routes display these
instructions with section jump links and printing. Instruction text is
searchable in the Corner, main Moves library, and Games library. Filters
distinguish original written guides from Coach Kyle's collection without
duplicating records: 72 original moves plus 21 Kyle entries, and 37 original
games plus K01. The 90 practice plans and existing printable files are preserved.

Evidence and variation notes:

- The guides are coaching progressions using the reviewed library and cited
  primary instruction. They are not presented as transcripts of all 22 clips.
- K01 contains a complete Grindstone touch-only game adaptation. Selected
  opening frames were inspected, but the submitted clip's exact game rules
  and scoring were not established.
- K10 teaches a high-single front trip. Selected frames of the supplied clip
  around 31-40 seconds confirm a raised-leg position and forward landing
  onto the hands; exact grip transfer and leg-block contact remain unverified.
  The written progression follows its cited references and is distinct from
  a backward heel sweep or run-the-pipe finish.
- K15 preserves the supplied failed-shot label versus publisher head-defense
  mismatch. Its main instruction teaches the defensive position.
- K06 uses a grounded single-leg defense foundation; K19 uses a shoulder-roll
  foundation; K21 uses a spiral-ride progression against a hands-supported
  raised base. Each page identifies the distinction from its unreviewed clip.
- K18's Peterson and other advanced finishes require the listed prerequisite
  skills and a cooperative progression; the Pup adaptations use foundations
  rather than automatically assigning the full movement by age.
- Source links distinguish internal library references from external publishers.
  New research checks do not imply endorsement by the linked organizations.

The new data file must be included alongside `kyle-data.js` when serving the
site. A full page refresh loads it into an already-open preview. These remain
local review changes until the user explicitly approves publication.


Bio link preference: the user requested no LinkedIn links in public biographies, including photo credits. Research provenance may mention the service here, but the rendered bio data contains no LinkedIn URLs.

## Coach research review - October 12, 2026

Publication checkpoint: user-reviewed commit 42efb62 was pushed to main and its Pages run completed successfully. Later research on codex/coach-research remains a local preview until separately approved.

- Thomas confirmed wrestling at Eaton Rapids High School, Michigan, and graduation in 2010. His bio uses that statement and his confirmed work with the Pups, older group and coaching library. Specific wrestling seasons, results and an old photo remain unverified; his 2010 graduation is user-confirmed.
- Ryan confirmed as the EIU wrestler. Contemporary reporting and the 2003 Warbler support a 4-0 Missouri Open freshman/sophomore heavyweight title in 2002; this is a tournament record, not a season record. Prep results for a Proviso West/Elmhurst namesake remain excluded pending a school identity bridge. No complete college career total or captioned historic photo found.
- Mike: Delaware Valley Cornucopia 2007, printed page 151 (archive leaf n155), explicitly connects Mike Handleman to Crofton/Arundel and the 133-pound group. State brackets support 2001-2003 qualifying appearances at 112/125/130. College attendance and four letters do not independently establish every competitive season. The yearbook junior label remains unresolved. Uncaptioned DelVal action photos are not attributed to Mike.
- Eric: contemporary Carroll County Times reports establish first varsity season 1997-98, a pin in the 1998 state-dual semifinal, 1999 county runner-up and All-County second team. The team state-dual finish is not an individual state medal. The 18-12 regional-preview record and sixth seed are not used as a final record or sixth-place result.
- Eric archival image: assets/eric-wrestling-1999.png is rendered from the identified photo region on PDF page 9 of CCT_02211999.pdf, not enhanced or synthesized. Original Stephen Cherry credit retained. The newspaper caption explicitly identifies Chris Currence behind Eric. Source: https://cctimes.carr.org/documents/CCT_02211999.pdf#page=9
- Kyle: school yearbooks corroborate four high-school seasons, junior wrestling honors, senior football awards and NHS membership. College dates, totals and a captioned college photograph remain unverified after CSU record-book and archive research; no single isolated year is presented as his full college career.
- Jerome: existing primary-source college/prep history and Up2Us portrait retained. Archived OU links and guides did not yield a captioned college image. No unrelated sensitive personal history has been added.
- Jessica M. and Cody Hughes remain recognized together using the user-confirmed roles. No unsupported athletic biography, individual headshot or sponsor has been invented.

All rendered biographies continue to omit LinkedIn links. Existing moves, games, videos, practices and downloadable materials are unchanged by this research pass.

Publication authorization update: the user subsequently requested immediate publication as coach research is ready. Completed coach updates may now be published under that scoped authorization.

## Shared move categories

move-tags.js defines the shared browsing labels and maps every original and Coach Kyle entry to one primary category. Facebook entries keep their existing category IDs from video-additions.js. Add a mapping when introducing a written or Kyle move; do not infer a teaching tier from its category. Distinct entries, source links and original coaching instructions remain separate.

The main library filters all 113 move entries by #moves?category=<id>. Clickable category labels open that view from any collection. Coach Kyle’s collection uses #moves/kyle?tag=<id> for new filters; its earlier category links retain their original membership. Original category names remain searchable. Changes stay on the preview branch pending review.


## Practice builder and season pathway — October 23, 2026

`#practices` opens the blank builder. `#season` opens the independent skill pathway. The current navigation no longer lists fixed practice plans; legacy `#practice/<age>/<number>` links lead to the builder for that age. Original data, PDFs and binder page numbers are preserved in Downloads.

- `practice-builder.js` adapts original, Kyle and Facebook entries, technique series, linked movement drills and 15 training activities. It preserves the difference between written instruction and video-only references.
- `pathway-data.js` contains 18 phases, foundation-based series, linked drills, activities, readiness/regression guidance and primary source links. A series starts from a common position or control and offers different options for opponent reactions. Suggested doses are authored coaching starting points, not official prescriptions.
- `skill-pathway.js` renders the pathway and preselects individual series/activities in the builder. Following a link never appends duplicate blocks automatically.
- `practice-builder.css` supplies responsive layouts and a compact printed run sheet with optional full instruction.
- `practice-frameworks.js` records the supplied 2026–27 program windows (Pups 60 minutes, Valkyries 90, Blue/Black 120) and editable time allocations. Program selection does not assign an age. Core A, Core B, an extension and a revisit provide shared teaching purposes across different attendance patterns.
- Frameworks contain generic coaching tasks, not a fixed list of techniques. Applying a framework replaces blocks only after confirmation when a draft has content, and Undo restores the previous structure. Selecting a library guide for an existing slot preserves its time, practice section and station plan.
- Program, start time, session purpose, learning stage, delivery format and station notes survive saving, JSON transfer and printing. Earlier version-1 files remain readable. Displayed clock times supplement elapsed times; a changed target never silently rescales existing work.
- Series membership is many-to-many and identifies preparation, entry, foundation, option, finish and drill roles. The main move library supports `#moves?series=Sxx`; the builder has a matching series filter. Phase links offer an explicit “Use this session focus” action, preserving existing blocks.
- `series-moves.js` and `series-bottom.js` contain three new coaching adaptations: N01 arm drag to single-leg pickup, N02 underhook to high single, and N11 sit-out knee-under stand-up. `series-library.js` integrates them into the existing move library, categories, favorites and builder. New cards print from the page; they are not assigned nonexistent original binder pages.
- New move evidence comes from the named creator’s written lesson and publisher/video metadata. Complete footage was not inspected in this pass; video panels describe the component or full-series scope. Facebook focus notes, including advanced head/neck-loading restrictions, travel into builder boundaries and printouts.
- Drafts and named practices use separate versioned local-storage keys; browser storage does not sync across devices. JSON import/export provides a backup and transfer option. The existing favorites key is unchanged.
- Run `node tools/builder-check.js` and `node tools/navigation-check.js` for builder and route regressions. No build dependencies are required.

The original S01–S12 teaching sequences now live in `sequences` and appear as linked movement drills. Their saved source IDs remain `series:Sxx`; old `?series=Sxx` links still select the same drill. `?sequence=Sxx` is the current drill link. Saved blocks retain their authored text and timing while legacy sequence block types are relabeled as drills. Foundation series begin at S13, include reaction/option branches and instructor references, and retain their option instructions through saving, JSON transfer and printing.

This update remains on the preview branch until the user reviews and approves publication.
