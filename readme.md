# Grindstone coach library website

A self-contained, buildless website for GitHub Pages. Open `index.html` directly, or serve this folder with a static server. All asset URLs are relative, so a GitHub project URL works.

## Contents

- 72 reviewed moves, complete instruction and research.
- 90 practices across ages 4-6, 7-10, and 11-14.
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
profiles, source links, optional photos, and an empty supporters list. The
earlier ryan-devaris route redirects to ryan-devries for existing preview links.

Grindstone roles and personal coaching details were supplied by the user.
The user confirmed Mike's Delaware Valley identity and Jerome's Oklahoma /
Mad House Boxing identity, supplied Ryan's and Eric's LinkedIn profiles, and
approved Ryan's warm personal description. Ryan's name follows the confirmed
profile spelling, Ryan DeVries. College results and school history for Ryan
and Eric remain research leads until linked to these exact coaches; they are
not presented as established career facts. Cody Hughes's wife's contributions
are known, but her name is not yet confirmed, so no anonymous or invented
profile is displayed.

Photo provenance:

- `assets/mike-handleman.jpg` is an unchanged 800 x 800 JPEG from the exact
  LinkedIn image URL supplied by the user. The supplied portrait is displayed with a caption; its LinkedIn credit link was removed at the user’s request.
  SHA256: `a99ccf9bc673878850e7e45147e5bcc0e8dab7890ae6249e2bb02b806050743a`.
- Jerome's 1080 x 1080 photograph is displayed from the original Up2Us Sports
  image URL, with a visible credit linking the March 14, 2018 article. The
  article places the photo beside a testimonial explicitly naming Jerome
  Featherstone. It replaces the small 150 x 150 Mad House staff thumbnail.
  The original image was visually inspected; no generated alteration or
  identity inference from appearance was used.
- No portraits are inferred from similarly named people. Ryan and Eric's
  LinkedIn pages require sign-in in the available browser, so their photos
  are not included yet. Attributed third-party images are not claimed as
  Grindstone-owned or openly licensed.

The directory and profiles include responsive layouts, About Us navigation,
source credits, print controls and image-unavailable fallbacks. All changes
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
