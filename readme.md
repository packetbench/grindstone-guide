# Grindstone coach library website

A self-contained, buildless website for GitHub Pages. Open `index.html` directly, or serve this folder with a static server. All asset URLs are relative, so a GitHub project URL works.

## Contents

- 72 reviewed moves, complete instruction and research.
- 90 practices across ages 4-6, 7-10, and 11-14.
- 30 original games plus two team favorites: Ankle Tag (G31) and Bulldog (G32), with related demonstrations and clear variation notes.
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

Checked October 10, 2026: all 72 moves and 31 of 32 games have a linked demonstration. Across these 103 references, 48 use actual YouTube Shorts, 51 use standard YouTube videos, and four preserve the original Vimeo instruction. Links may be reused for shared components. G06 Team Shape Factory is explicitly marked for a team-recorded demonstration because no suitable public clip was verified. Related clips do not replace the written game rules.

## Team favorites addendum

team-games.json is the source for G31 Ankle Tag and G32 Bulldog, their related videos, and the addendum download entry. These are team favorites shared by a coach, not newly invented Grindstone games. Added timing, reset choices, equipment options, and age adaptations are explicitly suggestions. Both standard YouTube links are official USA Wrestling curriculum references; their metadata was verified, but their footage was not watched.

downloads/team-games.pdf is a separate two-page Letter handout. Print double-sided, long-edge flip, at 100% and append after the original binder's page 208. Its numbered pages are 209 (G31) and 210 (G32), with alternating binding margins. The original 208-page binder, original index, PDFs, and library ZIP remain unchanged and do not contain these additions. The website downloads page and this addendum provide the new game index.

tools/build-team-games.py rebuilds only this addendum from team-games.json using ReportLab. The main data builder preserves the additions on rebuild. No build is required for the published website.
