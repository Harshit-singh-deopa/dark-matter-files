# Dark Matter Files

This is the full site project: homepage, info pages, and 6 category templates
that automatically generate a page for every article you publish. The
homepage's 6 preview boxes also update themselves automatically — see
"How the homepage stays in sync" below.

## How it's organized

- `static-pages/` — your homepage (index.html) and About/FAQ/Privacy/Terms.
  These are complete, finished files and are copied as-is into the final site.
- `src/categories.njk` — one template that automatically generates all 6
  category pages (UFO Files, Paranormal, etc.) by looping through the
  `categories` list in `eleventy.config.js`.
- `src/_layouts/article.njk` — one template that automatically generates a
  page for every article file found in `src/content/articles/`.
- `src/content/articles/*.md` — the actual case file articles. There are 6
  sample articles in here already (matching the ones on the homepage) so you
  can see the system working. Add a new `.md` file here (or publish through
  the CMS once it's connected) and a new page appears automatically — no
  template editing required.
- `src/latest-articles.11ty.js` — generates a small `latest-articles.json`
  file at build time, listing the newest published article in each category.
- `admin/` — the Decap CMS editor. Once deployed, visiting `yoursite.com/admin`
  gives you a login screen and a "fill the form, click publish" interface for
  adding new case files.

## How the homepage stays in sync (auto-pull)

The homepage's 6 preview boxes are no longer hand-written text. A small
script at the bottom of `static-pages/index.html` fetches `latest-articles.json`
when the page loads and fills in each box with whatever the newest article in
that category actually is — title, image, summary, case number, and link.

This means: publish a new case file through the CMS → the next time the site
rebuilds → the matching homepage box updates itself automatically. You never
need to edit the homepage by hand again.

This was tested directly: a temporary newer-dated test article was added, the
homepage box updated to show it automatically, and the test article was then
removed to restore the original 6 samples.

If `latest-articles.json` can't be reached for any reason (for example, if
you open `index.html` directly from your computer instead of visiting the
live site), the boxes simply keep their original hand-written preview text
as a safe fallback — nothing breaks.

## Before this goes live, two things still need to be filled in

1. **`admin/config.yml`** — near the top, replace:
   ```
   repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
   ```
   with your actual GitHub username and the name of the repository you upload
   this project to.

2. **`static-pages/index.html`** — search for `YOUR_WEB3FORMS_ACCESS_KEY_HERE`
   (appears twice — the report form and the feedback form) and replace with
   your real Web3Forms access key so form submissions actually reach your inbox.

## Testing it yourself before uploading (optional)

If you ever want to preview the site on your own computer before uploading to
GitHub, you'd need Node.js installed, then from this folder run:

```
npm install
npm run build
```

This creates a `_site` folder — open `_site/index.html` in a browser to preview.
You do not need to do this to deploy; Cloudflare Pages will run this build
step automatically.

## What's NOT done yet

- Real article content — only 6 sample articles exist right now, reused from
  the homepage's original placeholder cases.
- The GitHub repository itself hasn't been created.
- Decap CMS's GitHub login connection ("OAuth") hasn't been set up yet —
  needed before the `/admin` login screen will actually work.
- Cloudflare Pages hasn't been connected.
- Domain hasn't been connected.

