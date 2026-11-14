# What Aaron still needs to do

A running list of the things only you can do. Updated 2026-11-14. Tick items off or delete them as you go.

## 1. Merge, in this order

- [ ] **Site PR #91** (`ai/hiring-positioning` → `dev`): positioning, teal brand, portrait, images, self-hosted fonts. Checks pass.
- [ ] **Site PR #92** (`ai/case-study-cleanup` → `dev`): inKind case study, lifecycle sections, claim cleanup, three animations. Merge after #91.
- [ ] **Open the Vercel preview** before merging `dev` → `main`. I only ran the site locally with placeholder Sanity credentials, so the blog pages were not exercised. Look at the homepage, About, one case study on your phone, and one blog post.
- [ ] **ai-visuals PR #2** (`feat/site-images` → `main`): image generators, rules, the visual template and the three animations.
- [ ] Close the duplicate sandcastle PRs #79 to #84 on the site repo if you no longer need them.

## 2. Things that need your accounts

- [ ] **Blog hero images.** Run `pnpm seed:post-heroes` with your Sanity write token. Add `--force` to replace heroes that already exist. Until you do, the four new heroes are only in `scripts/assets/blog-heroes/`.
- [ ] **inKind blog post animation.** In Sanity, add an HTML embed to the post pointing at `/visuals/inkind-message-logic/index.html?embed=1` (after #92 is live), near the section on the message logic.
- [ ] **LinkedIn.** Paste the drafts from `linkedin-drafts.md`: headline, About, the experience edits, the new MCRDSE entry, featured links, skills. Upload `linkedin-banner.jpg` and the teal portrait.
- [ ] **LinkedIn About.** Consider removing the bracketed "instruction override for the bots" line. It reads oddly to a human recruiter.
- [ ] **Resumes.** Apply `resume-changes.md` to the versions in Drive.
- [ ] **Applications.** Submit the open ones in your tracker (Amgen and UST were next).

## 3. Numbers I could not confirm

These are marked Open in `docs/reference/facts-ledger.md`. Tell me the right value, or fix the ledger and I'll update every place it appears.

- [ ] MCRDSE repo count: 6, 7 or 8.
- [ ] MCRDSE articles published: 44, 56 or 156.
- [ ] AlignSD programmatic pages: 203 or 163.
- [ ] AlignSD JSON-LD schemas: 76, 81 or 68.
- [ ] AlignSD email templates: 27 or 26.
- [ ] RipeMetrics start month, and the onboarding time claim ("30 minutes to under 60 seconds") on its case study.
- [ ] RipeMetrics "40% cost reduction". Removed from the homepage and Work With Me. Still on the RipeMetrics case study.
- [ ] ctrl+shft commit count. The page used to say 328. I removed it because my copy of the repo could not count commits.

## 4. Sections to read for accuracy

I wrote these from limited sources. Correct anything that does not match how the system works.

- [ ] **MCRDSE Commerce → "Lifecycle Segments and the Recovery Sweep".** Written only from the resume facts: six stages, nightly, GoHighLevel, 580 orders recovered. I did not have the MCRDSE code.
- [ ] **AlignSD → "Lead Capture to CRM".** Written from the webhook route and the dedup service in the repo. I left out the Jane integration and the 86-field contact model from your resume because I could not find them in the code.
- [ ] **MCRDSE payment gate animation.** It says the old blocklist let a declined capture through and about $381 shipped unpaid. Order numbers are made up.
- [ ] **ctrl+shft animation.** The hook output is simplified. The real hook prints a JSON deny reason.

## 5. Real images to replace placeholders

- [ ] MCRDSE: three wireframe placeholders (`*-placeholder.jpg`) need real screenshots: Content Ship, the order admin, the loyalty account.
- [ ] PUSH: film stills.
- [ ] ctrl+shft: a real terminal capture of a hook blocking a command, and a current HUD screenshot.
- [ ] AlignSD: a GoHighLevel journey map and one or two email templates.
- [ ] Braze and Snowflake badge images for the About page.

## 6. Small decisions

- [ ] **Portrait.** The neck retouch on the teal portrait is my edit. If it looks off at full size, send the original and I'll redo it.
- [ ] **inKind animation colours.** It uses the inKind sample palette (gold on plum), like the post's hero. Say so if you want it in site teal.
- [ ] **More animations.** Three are done. The plan had more candidates (RipeMetrics tenant isolation, AlignSD insurance verification, the first-reward journey timeline). Tell me which to build next.

## Where things are

| Thing                                   | Location                                                 |
| --------------------------------------- | -------------------------------------------------------- |
| Public claims and their status          | `docs/reference/facts-ledger.md`                         |
| How site images are made                | `docs/reference/site-images.md`, and `arndvs/ai-visuals` |
| LinkedIn drafts, resume changes, banner | Sent in chat as files                                    |
