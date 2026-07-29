# Sanity CMS

The About page is edited in Sanity instead of in code. This is a pilot — every
other page is still hardcoded. If it works out, the same pattern extends to team
rosters and coach bios.

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

| Thing | Where it lives |
| --- | --- |
| Editing UI (Studio) | `firecrackersohio.sanity.studio`, hosted by Sanity |
| Studio source + schema | `studio/` in this repo |
| Content itself | Sanity's database, not in git |
| Website reads it via | `src/lib/sanity/loader.ts` → `about` content collection |
| Page template | `src/pages/about.astro` |

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

Then invite the coaches: **sanity.io/manage → Members → Invite**. The free plan
includes a limited number of users, so check the count before inviting everyone.
Give coaches the **Editor** role, not Administrator.

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

| Field | Value |
| --- | --- |
| Name | `Deploy website` |
| URL | `https://api.github.com/repos/Firecrackers-Ohio/firecrackers-ohio.github.io/dispatches` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type == "aboutPage" && !(_id in path("drafts.**"))` |
| Projection | `{"event_type": "sanity-publish"}` |
| HTTP method | `POST` |
| HTTP headers | `Authorization: Bearer <your token>`<br>`Accept: application/vnd.github+json` |
| Secret | leave empty |

Two parts of that table matter more than they look:

- **The `drafts.**` filter is essential.** Sanity autosaves drafts constantly.
  Without it, every few keystrokes would kick off a deploy.
- **The projection is what GitHub reads.** It replaces Sanity's default payload
  with the `event_type` GitHub's dispatch API requires, matching the
  `repository_dispatch: types: [sanity-publish]` trigger in
  `.github/workflows/deploy.yml`.

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

| Code | Cause |
| --- | --- |
| `401` | GitHub didn't get valid credentials. Check the token is in an **Authorization header** with a `Bearer ` prefix — not in Sanity's "Secret" field, which is for HMAC signing and which GitHub ignores. Also suspect a truncated paste, or an expired token. |
| `403` | Token is valid but lacks the `repo` scope. |
| `404` | Wrong repository in the URL, or the token can't see it. |
| `422` | GitHub got the request but no `event_type` — the Projection field is missing or wrong. |

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
  the results into a content collection. It isn't About-specific.
- `RichText.astro` renders any Portable Text field with the site's typography.
- The singleton pattern in `studio/sanity.config.ts` (`singletonTypes`) is how
  you add another one-of-a-kind page without giving editors a create/delete
  button.

For team rosters, the shape is different: many documents rather than one. Drop
the `entryId` override so each document keys off its own `_id`, and mirror the
existing Zod schema in `src/content.config.ts`.

Add a `_type` filter for each new document type to the webhook filter, or
broaden it, so publishing the new content also triggers a deploy.

## Gotchas

**The build fails if content is missing.** `about.astro` throws when the
`aboutPage` document isn't found. That's on purpose — better a failed deploy than
a live page with no content. A failed build also means GitHub Pages keeps serving
the previous version, so the public site never breaks.

**Don't push to `main` before step 1.** The deploy will fail on every push until
the project ID is filled in. The live site stays up, but the Actions tab goes
red.

**Photos aren't in the CMS.** Player and team photos still live in
`src/assets/rosters/` and are matched by jersey number. Only About page text is
in Sanity so far.

**The CDN is bypassed on purpose.** `src/lib/sanity/client.ts` sets
`useCdn: false`. Sanity's cached endpoint is eventually consistent, so a build
starting seconds after Publish could otherwise pick up the previous version.

**Changing the schema needs a redeploy.** Editing files in `studio/` (adding a
field, say) requires `npm run deploy` from `studio/`. Content edits never do.

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
