# Sanity CMS

Teams and the About page are edited in Sanity instead of in code.

Teams cover rosters, coaching staff, schedules, results, photos and the tryout
contact details. Because the Teams listing, the nav menus and the Tryouts page
are all built from the same collection, adding or removing a team in Sanity
updates the whole site — there's no longer a hardcoded list of teams anywhere.

Still in code: the home page's main copy, and the tournament announcement.

## How it fits together

```
Coach edits + hits Publish
        │
        ▼
   Sanity (content database)
        │  webhook
        ▼
   GitHub Actions  ──build──▶  GitHub Pages  ──▶  firecrackersohio.com
```

Nothing is fetched in the visitor's browser. The site is still fully static: the
content is baked in at build time, so if Sanity ever goes down the live site is
unaffected.

| Thing                  | Where it lives                                          |
| ---------------------- | ------------------------------------------------------- |
| Editing UI (Studio)    | `firecrackersohio.sanity.studio`, hosted by Sanity      |
| Studio source + schema | `studio/` in this repo                                  |
| Content itself         | Sanity's database, not in git                           |
| Website reads it via   | `src/lib/sanity/loader.ts` → `about` content collection |
| Page template          | `src/pages/about.astro`                                 |

## One-time setup

Steps 1–4 get the content in place. Steps 5–6 automate deployment.

### 1. Fill in the project ID

Copy the project ID from <https://sanity.io/manage> (the "Firecrackers"
project). It's an 8-character string. Put it in **both** files:

- `src/lib/sanity/client.ts` → `SANITY_PROJECT_ID`
- `studio/project.ts` → `projectId`

Also confirm the dataset name matches (`production` in both) and note whether
the dataset is **public** or **private**. If it's private, see
[Private datasets](#private-datasets) below.

The project ID is not a secret — it's a public identifier, safe to commit.

### 2. Install the Studio's dependencies

The Studio is a separate package so its dependencies (React, Sanity) stay out of
the website build and don't slow down CI.

```bash
cd studio
npm install
```

### 3. Load the starting content

This imports the current About page copy — mission statement, culture section,
and the national-org link — so nothing has to be retyped.

```bash
cd studio
npx sanity login     # first time only
npm run seed
```

### 4. Publish the Studio

```bash
cd studio
npm run deploy
```

Pick the hostname when prompted, or keep the `studioHost` already set in
`studio/project.ts`. Result: `https://firecrackersohio.sanity.studio`.

This is the only deploy you have to run by hand. After it, changes under `studio/`
redeploy on merge — see [Deploying the Studio](#deploying-the-studio) for the one
secret that needs.

Then invite the coaches: **sanity.io/manage → Members → Invite**. The free plan
includes a limited number of users, so check the count before inviting everyone.
Give coaches the **Editor** role, not Administrator — Editors can publish on
their own, and the Studio hides the admin-only fields from them. See
[Who can edit what](#who-can-edit-what).

At this point you can verify the site builds against real content:

```bash
npm run build     # from the repo root
```

### 5. Create a GitHub token for the webhook

Sanity needs permission to trigger the deploy workflow.

- **Classic token** (simplest): <https://github.com/settings/tokens> → Generate
  new token (classic) → tick the **`repo`** scope.
- **Fine-grained token**: scope it to
  `Firecrackers-Ohio/firecrackers-ohio.github.io` with **Contents: Read and
  write**.

Copy the token — you can't view it again. **Note its expiry date somewhere.**
When it expires, publishing silently stops deploying, which is a confusing
failure to debug months later.

### 6. Add the webhook in Sanity

**sanity.io/manage → API → Webhooks → Create webhook**

| Field        | Value                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Name         | `Deploy website`                                                                                                                    |
| URL          | `https://api.github.com/repos/Firecrackers-Ohio/firecrackers-ohio.github.io/dispatches`                                             |
| Dataset      | `production`                                                                                                                        |
| Trigger on   | Create, Update, Delete                                                                                                              |
| Filter       | `_type in ["aboutPage", "team"] && !(_id in path("drafts.**"))`                                                                     |
| Projection   | `{"event_type": "sanity-publish", "client_payload": {"documentType": _type, "documentName": coalesce(name, pageTitle, "content")}}` |
| HTTP method  | `POST`                                                                                                                              |
| HTTP headers | `Authorization: Bearer <your token>`<br>`Accept: application/vnd.github+json`                                                       |
| Secret       | leave empty                                                                                                                         |

Three parts of that table matter more than they look:

- **The `drafts.**` filter is essential.\*\* Sanity autosaves drafts constantly.
  Without it, every few keystrokes would kick off a deploy.
- **The `_type` list must include every edited type.** If `team` is missing, a
  coach can publish a roster change and nothing will deploy — the edit just sits
  there looking like it worked. Add new document types here as you create them.
- **The projection is what GitHub reads.** It replaces Sanity's default payload
  with the `event_type` GitHub's dispatch API requires, matching the
  `repository_dispatch: types: [sanity-publish]` trigger in
  `.github/workflows/deploy.yml`. The `client_payload` part is what lets the
  notification email say which document changed.

## Deploying the Studio

The Studio is its own bundle, separate from the website. A schema change merged to
`main` — a new field, or just reworded help text — does nothing at
firecrackersohio.sanity.studio until that bundle is rebuilt. Content edits are
different: they go straight to the dataset and never need a deploy.

`.github/workflows/studio.yml` does the rebuild on any push to `main` that touches
`studio/**`. It's deliberately a separate workflow from the website deploy —
different trigger, and a failed Studio deploy shouldn't block the site going out.

It needs one secret, `SANITY_AUTH_TOKEN`:

1. **sanity.io/manage → API → Tokens → Add token.** Give it the **Deploy Studio**
   role if the project offers it, otherwise **Administrator** — a Viewer or Editor
   token can read and write content but can't deploy.
2. Add it to the repo as `SANITY_AUTH_TOKEN` under **Settings → Secrets and
   variables → Actions**.
3. **Note its expiry date somewhere**, same as the webhook token below.

If the secret is missing, the workflow fails on its first step and says so rather
than skipping quietly. A skipped deploy is exactly the silent drift this is meant
to stop.

Deploying by hand still works, and is what you'll do for first-time setup before
the secret exists:

```bash
cd studio
npm run deploy
```

To force a redeploy without a code change, use **Actions → Deploy Sanity Studio →
Run workflow**.

## Getting emailed when someone publishes

Sanity can't send email itself — webhooks only POST to a URL. So the deploy
workflow sends it, in the "Email on content publish" step of
`.github/workflows/deploy.yml`. It fires only for Sanity-triggered deploys, not
for your own pushes, and only after the deploy succeeds.

Add these repository secrets under **Settings → Secrets and variables →
Actions**:

| Secret          | Value                                         |
| --------------- | --------------------------------------------- |
| `MAIL_TO`       | Where to send the alert                       |
| `MAIL_USERNAME` | The sending account, e.g. a Gmail address     |
| `MAIL_PASSWORD` | An **app password**, not your normal password |
| `MAIL_SERVER`   | Optional, defaults to `smtp.gmail.com`        |
| `MAIL_PORT`     | Optional, defaults to `465`                   |

For Gmail you need 2FA enabled, then generate an app password at
<https://myaccount.google.com/apppasswords>. A normal account password will be
rejected.

The step is skipped when `MAIL_USERNAME` or `MAIL_TO` is missing, so leaving
these unset doesn't break deploys — you just won't get emails.

Note this tells you _something_ changed and links to the site and the build log.
It doesn't diff the content. To see exactly what changed, open the document in
the Studio and use its History panel.

Test it by editing the About page and hitting Publish. A run should appear in the
repo's Actions tab within a few seconds, and the site updates in a couple of
minutes.

### Debugging the webhook

Delivery attempts are visible from the CLI, which is faster than the web UI:

```bash
cd studio
npx sanity hooks list                     # confirm it exists
npx sanity hooks logs "Deploy Website"    # status code of each attempt
```

`204` is success — that's what GitHub returns for an accepted dispatch. What the
failures mean:

| Code  | Cause                                                                                                                                                                                                                                                     |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `401` | GitHub didn't get valid credentials. Check the token is in an **Authorization header** with a `Bearer ` prefix — not in Sanity's "Secret" field, which is for HMAC signing and which GitHub ignores. Also suspect a truncated paste, or an expired token. |
| `403` | Token is valid but lacks the `repo` scope.                                                                                                                                                                                                                |
| `404` | Wrong repository in the URL, or the token can't see it.                                                                                                                                                                                                   |
| `422` | GitHub got the request but no `event_type` — the Projection field is missing or wrong.                                                                                                                                                                    |

Two things that surprise people:

- **Editing the webhook config doesn't re-fire it.** It only fires when a
  document changes, so you need to publish a real edit to retest. Sanity leaves
  Publish disabled when nothing has actually changed.
- **A deploy triggered this way shows up in Actions with the event
  `repository_dispatch`** and the title `sanity-publish`, not as a push. That's
  how you tell a content deploy from a code deploy at a glance.

Expect roughly a minute from Publish to live.

## Testing locally

Two servers, two terminal tabs. They're independent — the Studio talks straight
to Sanity's database, and the website reads from it.

```bash
# Tab 1 — the website
npm run dev                 # http://localhost:3000

# Tab 2 — the Studio
cd studio && npm run dev    # http://localhost:3333
```

**The one thing that will confuse you:** editing in the Studio does not update
the running website, for two separate reasons.

1. The site only reads **published** content, so a draft never shows up.
2. Astro fetches from Sanity **once at startup** and caches the result. There's
   no watcher on remote content.

So the loop is: edit → **Publish** → restart the website dev server. On restart
you'll see it re-fetch:

```
[sanity-loader] Loaded 1 document from Sanity
```

If a change still doesn't appear, delete the cache and start again:

```bash
rm -rf .astro && npm run dev
```

To check the real thing rather than dev mode:

```bash
npm run build && npm run preview
```

To see the raw content the site is reading, without any of the website involved:

```bash
curl "https://9mzt60a4.api.sanity.io/v2026-07-27/data/query/production?query=*%5B_type%3D%3D%22aboutPage%22%5D%5B0%5D"
```

## Day to day, for coaches

1. Go to <https://firecrackersohio.sanity.studio> and sign in.
2. Click **About page**.
3. Edit the text. Changes save automatically as a draft — the live site does not
   change yet.
4. Click **Publish**.
5. The site updates itself within a few minutes. No further action needed.

Editors can add, reorder (drag), and remove sections, and use bold, italic, and
links. Headings and bullet lists are deliberately unavailable, because the page
template has no styling for them.

## Extending this to other pages

The pieces worth reusing:

- `sanityLoader()` in `src/lib/sanity/loader.ts` takes any GROQ query and feeds
  the results into a content collection.
- `RichText.astro` renders any Portable Text field with the site's typography.
- `headshotImage()` / `teamPhotoImage()` in `src/lib/sanity/image.ts` build CDN
  URLs with a fixed crop and a 2x srcset.
- The singleton pattern in `studio/sanity.config.ts` (`singletonTypes`) adds
  another one-of-a-kind page without giving editors a create/delete button.
- `studio/scripts/` holds the migration scripts. `npx sanity exec <script>
--with-user-token` runs one against the real dataset using your CLI login, so
  no API token is needed for one-off data fixes.

Two things to remember for any new type: add it to the **webhook filter**, or
publishing won't deploy, and give it a **hyphenated ID** (see the dot gotcha
below).

## Who can edit what

Two kinds of user: **Administrator** (you) and **Editor** (the coaches). Coaches
can publish without approval; they just see a shorter form.

Hidden from Editors:

| Hidden                                  | Where             | Why                                                                       |
| --------------------------------------- | ----------------- | ------------------------------------------------------------------------- |
| Team name                               | `team.name`       | Drives the nav, the age-group phrasing on Tryouts, and the document title |
| Web address                             | `team.slug`       | Locked after creation; changing it breaks every link                      |
| Birth year range                        | `team.birthYears` | An org-wide rule for the age group, not a per-team setting                |
| About page                              | sidebar item      | Not a coach's page                                                        |
| Create / delete / duplicate / unpublish | document actions  | Adding and removing teams is an admin job                                 |

Everything else on a team — roster, coaching staff, schedule, results, headings,
short description, team photo, social links, contact phone — is coach-editable.

How it works: `studio/roles.ts` exports `isAdmin()` and an `adminOnly` callback,
used as `hidden: adminOnly` on a field and as a conditional in the sidebar and
document actions in `studio/sanity.config.ts`. To move a field between the two
categories, add or remove that one line — and remember schema changes need a
[Studio deploy](#deploying-the-studio) to reach the hosted Studio.

Two things to know:

- **It's for clarity, not security.** These are UI rules. Sanity enforces
  per-field permissions only through custom roles, which are Enterprise-only, so
  an Editor with an API token could still write a hidden field. `visionTool()` is
  also enabled for everyone, so nothing in the dataset is actually concealed. The
  goal is a short, obvious form.
- **Never put `adminOnly` on a required field a coach can create empty.** Hidden
  plus required plus empty blocks publishing with a validation error the coach
  can't see the cause of. That's exactly why Editors can't create teams: you
  create the team and set its name and web address, then the coach fills in the
  rest.

## What editors deliberately cannot do

Editors change text, upload images, and add, remove or reorder items in lists.
They do not control presentation. Keep it that way when adding fields:

- No colour, spacing, font or width options.
- Rich text is limited to paragraphs, bold, italic and links. Headings and lists
  are excluded because the templates have no styling for them.
- The About page's sections alternate plain and boxed **by position**, rather
  than offering a per-section choice.
- Which roster view appears, which tabs exist, and the order of page sections are
  template decisions.

## Working with teams

Each team is one document. Field groups in the Studio mirror the tabs on the
website — Details, Roster, Coaches, Schedule, Results — so what an editor sees
lines up with what a visitor sees.

Things worth knowing:

- **The web address is locked after creation.** A team's slug determines
  `/teams/jones`, so it's set once and then read-only. Changing it would break
  every existing link. If it genuinely has to change, a developer must do it, and
  the old URL will 404 afterwards.
- **Headshots are cropped to 4:5 automatically.** Sanity's CDN does the crop, so
  a square phone snap and a tall portrait both come out matching the card. Use
  the crop tool in the Studio to choose which part of the photo is kept —
  otherwise the middle wins, which sometimes cuts off a face.
- **Grid view appears only when at least one player has a photo.** A roster with
  no photos shows the table instead. That's derived, not a setting.
- **An empty roster is allowed** and shows "Coming soon". A team must always have
  at least one coach.
- **The Schedule tab has two fixed tables**, fall and spring/summer, each with
  its own heading and tournament list. Both are optional; whichever is empty
  shows its heading above "Coming soon". The pair is fixed — a coach can't add a
  third. (The fields are `fallSchedule` and, for historical reasons, plain
  `schedule` for spring/summer.)
- **The Results tab is a list of tables, one per year**, and coaches add them.
  Each has a heading and its own finishes, and they render in the order they're
  arranged in the Studio — newest year first by convention, not enforced. A new
  season means adding a table, not overwriting the last one. A table with no rows
  shows its heading above "Coming soon".
- **Age groups live in the team name.** "14U Jones" is parsed to produce the
  "from 11U through 14U" phrasing on the home, teams and tryouts pages. Keep the
  `NNU` format or that phrase will silently drop that team.
- **Tryout contact details** (phone, birth year range) sit on the team, and the
  Tryouts page uses the _first_ coach in the staff list as the contact. Reorder
  the staff and you change who's listed there.

### Removing a team

Delete the document in the Studio. The team disappears from the nav, the Teams
page and the Tryouts page on the next deploy, and its page stops being built —
so `/teams/<slug>` will 404 for anyone with an old link. Consider whether that
URL is likely to be shared anywhere before deleting.

## Gotchas

**The build fails if content is missing.** `about.astro` throws when the
`aboutPage` document isn't found. That's on purpose — better a failed deploy than
a live page with no content. A failed build also means GitHub Pages keeps serving
the previous version, so the public site never breaks.

**Don't push to `main` before step 1.** The deploy will fail on every push until
the project ID is filled in. The live site stays up, but the Actions tab goes
red.

**Never put a dot in a document ID.** Sanity treats a dotted prefix as a
reserved namespace — the same mechanism as `drafts.` — and refuses
_unauthenticated_ reads of those documents. The first pass of the team migration
used IDs like `team.jones`, which imported fine and was readable with the CLI,
but the public API returned `{"omitted":[{"reason":"permission"}]}`. Since the
build reads without a token, that would have deployed a site with no teams at
all, and no error, because an empty collection is valid. IDs are `team-jones`
with a hyphen for this reason.

That last part no longer holds, deliberately: the loader takes a `minEntries`
option and both collections set it to 1, so a collection that comes back empty
fails the build instead of quietly publishing a site without it. Set it on any
new collection the site can't sensibly render without.

**A GROQ projection returns null, not nothing.** Ask for a field that isn't set
and you get `"email": null`, which Zod's `.optional()` rejects. The loader strips
nulls recursively before validation (`stripNulls` in
`src/lib/sanity/loader.ts`) so the schemas can use plain `.optional()`.

**The CDN is bypassed on purpose.** `src/lib/sanity/client.ts` sets
`useCdn: false`. Sanity's cached endpoint is eventually consistent, so a build
starting seconds after Publish could otherwise pick up the previous version.

**Changing the schema needs a redeploy.** Editing files in `studio/` — adding a
field, or just reworking a field's help text — changes nothing at
firecrackersohio.sanity.studio until the Studio bundle is rebuilt. Content edits
never need this. `.github/workflows/studio.yml` handles it on merge; see
[Deploying the Studio](#deploying-the-studio).

### Private datasets

If the dataset is private, the build needs a read token:

1. sanity.io/manage → API → Tokens → Add token, **Viewer** permission.
2. Add it to the repo as a secret named `SANITY_READ_TOKEN`
   (Settings → Secrets and variables → Actions).
3. Pass it to `createClient` in `src/lib/sanity/client.ts` via
   `token: import.meta.env.SANITY_READ_TOKEN`, and add an `env` block to the
   build step in `.github/workflows/deploy.yml`.

Making the dataset public is simpler and carries no real downside for content
that's published on a public website anyway.
