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
