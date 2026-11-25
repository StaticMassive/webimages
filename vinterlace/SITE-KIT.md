# Vinterlace: site kit for the website builder

Everything the Vinterlace page on staticmassive.com needs: logos, screenshots, footage, colours and
the download link. The copy, tone and page structure are in the separate website brief; this file
is the list of files and links. It lives at `vinterlace/SITE-KIT.md` in the webimages repo.

Vinterlace (formerly CrashSaver) is a Mac app by Static Massive for FPV pilots. It cleans analog
static out of DVR footage and brings back clips that won't play.

All files are served from the public `webimages` repo through jsDelivr:

```
https://cdn.jsdelivr.net/gh/StaticMassive/webimages@main/vinterlace/<file>
```

The page already uses these paths. Files keep the same names when they are updated, so the page picks
them up without code changes. jsDelivr caches `@main` for up to 12 hours. To show a change at once,
open `https://purge.jsdelivr.net/gh/StaticMassive/webimages@main/vinterlace/<file>`.

---

## 1. Logos

| File | Use it for |
|---|---|
| `wordmark-on-dark.svg` | The name on dark backgrounds (the page's default) |
| `wordmark-on-light.svg` | The name on white or light backgrounds |
| `wordmark.svg` | Inline SVG that takes its letter colour from CSS `color` (`currentColor`). The two dots keep their own colours |
| `lockup-stacked.svg` | Wordmark with "BY STATIC MASSIVE" under it, on dark. For a hero or footer |
| `icon.svg`, `icon.png` | App icon (512×512 PNG). Next to the wordmark, in the download box, and as the favicon or share image |

Full URLs:

- https://cdn.jsdelivr.net/gh/StaticMassive/webimages@main/vinterlace/wordmark-on-dark.svg
- https://cdn.jsdelivr.net/gh/StaticMassive/webimages@main/vinterlace/wordmark-on-light.svg
- https://cdn.jsdelivr.net/gh/StaticMassive/webimages@main/vinterlace/wordmark.svg
- https://cdn.jsdelivr.net/gh/StaticMassive/webimages@main/vinterlace/lockup-stacked.svg
- https://cdn.jsdelivr.net/gh/StaticMassive/webimages@main/vinterlace/icon.svg
- https://cdn.jsdelivr.net/gh/StaticMassive/webimages@main/vinterlace/icon.png

**How to use the wordmark**

- Wherever the page writes the product name as a big styled heading (now `<p class="csv-word">Vinterlace</p>`
  in the hero), use the wordmark image instead, with `alt="Vinterlace"`. Body text keeps the plain
  word "Vinterlace".
- The wordmark is about 4:1 (width to height). Set its height, not its width: 56–72 px in the hero
  and 24–32 px in a nav bar or footer. Don't go below 20 px.
- Keep clear space around it at least as tall as the dot on the i.
- Don't recolour, stretch, outline or add effects. The red dot on the i and the cyan full stop are
  part of the mark.
- Icon and wordmark side by side: make the icon about 1.6 times the wordmark's height, with a gap
  about half the wordmark's height.

## 2. Colours

| Name | Hex | Where |
|---|---|---|
| Background | `#15171c` | App background, dark panels |
| Ink | `#ece9df` | Text and the wordmark on dark |
| Record red | `#e5484d` | The dot on the i. The one main action (the download button) |
| Selection cyan | `#37b3c2` | The full stop and the icon's progress bar. Links and highlights |
| Dim | `#8f9097` | Secondary text |

Fonts are Archivo (headings and UI) and JetBrains Mono (labels and numbers). Both are OFL; the
woff2 files are in `brand/` of the local kit and on Google Fonts.

## 3. Screenshots (real app, real footage)

All are 1920×1200 WebP, from build 2.0.0 (65526f5) with the new name and logo.

| File | Shows |
|---|---|
| `clean-workspace.webp` | Clean: a real clip with static, the before/after split, the damage timeline |
| `restore-workspace.webp` | Restore: a clip that won't play ("Won't play: the index is missing") |
| `walkthrough-1.webp` … `walkthrough-5.webp` | The five pages of the in-app tour |

Base URL as above, for example
https://cdn.jsdelivr.net/gh/StaticMassive/webimages@main/vinterlace/clean-workspace.webp

`lens-clean.webp` and `lens-timeline.webp` are close-ups of the Clean controls and the timeline. They
show no name or logo, so they are still current.

## 4. Footage

These haven't changed: `tram-before.mp4` / `tram-after.mp4` (hero pair), `arch-before.mp4` /
`arch-after.mp4`, their `*-poster.jpg`, and the stills `still-tram-*`, `still-fence-*` and
`still-arch-*` (`-before.jpg` / `-after.jpg`). The page already uses them.

## 5. Download

The download works like AuxRip's and Toob Stash's: a direct link to the newest release in a public
downloads repo. With the `download` attribute the file starts downloading and the visitor stays on
the page.

```html
<a class="csv-btn" href="https://github.com/StaticMassive/vinterlace-downloads/releases/latest/download/Vinterlace-mac.dmg" download>
  Download for Mac
</a>
<p class="csv-req">macOS 11 or later · Apple Silicon and Intel · 18 MB</p>
```

- Mac only for now. Windows is planned; don't show a Windows button or promise a date.
- `releases/latest/download/...` always points at the newest release, so the button never needs
  editing when a new version comes out.
- Put the first-open steps right under the button or in a small "Installing" note. They are needed
  until the app is notarized by Apple:
  1. Open the downloaded file and drag Vinterlace onto the Applications folder.
  2. Open Applications and double-click Vinterlace.
  3. The first time only, your Mac says it can't check the app. Click **Done**, open
     **System Settings → Privacy & Security**, scroll down and click **Open Anyway**, then open
     Vinterlace again.
- Already installed? Vinterlace updates itself (it reads `latest.json` from the same release).

> **Status:** the `vinterlace-downloads` repo and its first release are not published yet. Until
> they are, the link returns 404, so keep the **Coming soon** panel and leave the button out.
> Swap the button in when the owner says it's live.

## 6. Page links

| What | Link |
|---|---|
| Page | Under Software beside AuxRip (`/pages/auxrip`), Toob Stash (`/pages/toob-stash`) and PanoDek (`/pages/panodek`); `/pages/vinterlace` to match |
| Breadcrumb | Static Massive `/` → Software `/pages/software` → Vinterlace |
| Mac download | https://github.com/StaticMassive/vinterlace-downloads/releases/latest/download/Vinterlace-mac.dmg |
| Release notes and older versions | https://github.com/StaticMassive/vinterlace-downloads/releases |
| Support | mailto:info@staticmassive.com |
