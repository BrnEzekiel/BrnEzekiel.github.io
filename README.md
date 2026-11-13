# BrnEzekiel.github.io

Portfolio site for Brian Onyango Ezekiel — served at https://brnezekiel.me via GitHub Pages.

## Preview locally

Requires Node 18+:

```sh
npm start
```

Then open http://localhost:8080 in a browser.

## Publish

```sh
git add -A
git commit -m "Publish portfolio site"
git push origin main
```

Then in the repo: Settings → Pages → Deploy from branch `main`, folder `/ (root)`. The `CNAME` file already points Pages at `brnezekiel.me`.

Namecheap DNS for the apex domain: an `A` record for `@` pointing at GitHub Pages, plus a `CNAME` for `www` pointing at `BrnEzekiel.github.io`. Wait a few minutes, then tick “Enforce HTTPS” in the Pages settings.

## Photos

- `banner.jpg` — social share image (hero now uses the `hero3d.js` 3D canvas).
- `portrait.png` — About portrait (transparent background).

Replace either file (keep the name) and push.

## Update the CV

Replace `Brian-Onyango-Ezekiel-CV.pdf` with the new file (keep the name) and push.

## Contact form

Messages are delivered to brianonyango229@gmail.com via FormSubmit (free, no signup).
The very first submission triggers an activation email — open it and click
activate once, then all later messages arrive directly. If the service is ever
unreachable, the form falls back to opening the visitor's email app.

## Portfolio images

`img-doorgo.png`, `img-storynest.png`, `img-dental.png` are the projects' own
logos, shown on the cards. Replace any file (keep the name) and push.