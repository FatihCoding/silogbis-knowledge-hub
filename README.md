# SILOGBIS Knowledge Hub — V3 (Minimal Hybrid Library)

**Status:** Pilot, noindex, no public documents published.  
**Hosting:** Cloudflare Workers Static Assets (same existing Worker).  
**Source of truth:** Google Sheets Master Control (private), with manually approved public catalog releases.  
**Identity:** Original SILOGBIS logo and V1 navy–blue visual language.

## What is included

- **6 physical HTML pages:** `/`, `/academic/`, `/kp-internship/`, `/research/`, `/competition/`, `/alumni/`.
- Homepage: compact hero and five fully navigable category buttons.
- Category pages: shared stylesheet and JavaScript, keyword search, filter chips, real resource links when approved, Public/Internal switch.
- Internal access **fails closed**. No internal filenames, private sheet IDs, contacts, or URLs are shipped. Optional internal Drive/Sites folder links are shown **only** after an admin explicitly activates an ACL-verified link in `site-config.json`. Even when activated, the link itself becomes visible, so the Google ACL must be independently verified.
- Public assets read only `taxonomy.json`, `catalog.json`, `site-config.json`.
- Private publisher script (not deployed to Cloudflare): `backend/Public_Catalog_Publisher_V3.gs` — supports Form submissions and admin-curated official sources, both behind review and human authorization.
- Pilot noindex in all six HTML pages and `_headers`.

## STEP 1 — Update the EXISTING GitHub repository

1. Make sure the repository is `FatihCoding/silogbis-knowledge-hub` and branch `main` (or the future SILOGBIS-owned repository).
2. Back up the existing source or rely on GitHub history. **Do not delete the project or create a second Cloudflare Worker.**
3. Extract `SILOGBIS_Knowledge_Hub_V3_FULL.zip`. Upload its **contents**, not the ZIP itself, to the repository root. `public/`, `scripts/`, `backend/`, `docs/`, `package.json`, and `wrangler.jsonc` must be at the root.
4. Better for targeted updates: use `SILOGBIS_Knowledge_Hub_V3_PATCH.zip`. It includes the changed frontend and new docs/publisher; original logo files remain unchanged in the repository.
5. Replace files at the SAME paths. If GitHub Upload refuses to overwrite, use `github.dev` or GitHub's Edit file feature. Do not create nested paths like `SILOGBIS_Knowledge_Hub_V3/public/index.html`.
6. Commit to `main` with `SILOGBIS V3 minimal multipage hybrid navigation`.
7. Cloudflare Git integration deploys automatically. In Cloudflare → Worker → Deployments, look for the latest **Success** (not the older V2 deployment).
8. Open `https://silogbis-knowledge-hub.silogbis23.workers.dev/` and test the URLs in `docs/LIVE_QA.md`.

No Cloudflare reconfiguration should be necessary: existing Wrangler `assets.directory` still targets `./public`.

## STEP 2 — Keep the backend private

- **Do not paste** any Apps Script or Master Control IDs into `public/`.
- **Do not move** `SpreadsheetApp`, `DriveApp`, or `FormApp` code to Cloudflare.
- **Do not delete or rerun** `setupSilogbisHubV2`.
- The existing Forms scripts/triggers remain unchanged. Note: Forms were closed after QA.
- To publish resource metadata, follow `docs/PUBLISHING_PLAYBOOK.md`; install the publisher as a new `.gs` file in the existing private Apps Script project. Nothing runs automatically.

## STEP 3 — Content and access

- `public/data/catalog.json`: currently `[]`. This is intentional; only approved PUBLIC material can go here.
- `public/data/site-config.json`: pilot mode, internal folder links disabled, Forms disabled. This is intentional.
- **Public** resources: catalog titles and HTTPS links are visible to everyone; Google Drive file must open from Incognito without SILOGBIS login.
- **Internal** resources: keep actual files and names inside access-controlled Google Drive. Optional hub-specific portal link can be activated after ACL check; site must not list internal files or contacts.
- **Restricted** admin/alumni data: never exposed on frontend or via public JSON.

See `docs/ACCESS_AND_SECURITY.md` for the hybrid architecture and `docs/DESIGN_HANDOVER.md` for Marcom.

## QA / validation

Node.js optional for contributors:

```bash
npm run build
```

This validates routes, taxonomy, public data gates, noindex/public launch state, and link restrictions. `npm run test` runs the same static validation. The actual website requires **no npm packages** in the browser.

**Tested locally:** static build, browser-rendered desktop/mobile, five homepage category links, filter chips, search/reset, Public/Internal tabs, fixture-based public resource link, and rejection of internal resource metadata. See `docs/LIVE_QA.md` for verification after Cloudflare deploy.

**Not yet done:** uploading to user's GitHub, actual Cloudflare deployment of V3, real Google Drive internal ACL audit, real Google Forms enabling, approval/export of real resource, public Search Console registration. Do not claim those steps complete.


## V3.1 quick access
Root Drive button now links to official access-controlled Google Drive. Direct category Drive and approved Sheets links can be added under `quickLinks` in `public/data/site-config.json` only after manual permission tests. The admin Master Control and raw alumni database are never public shortcuts. See `CLICKABLE_PREVIEW_AND_SETUP.txt`.
