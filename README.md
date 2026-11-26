# Big Rig Wrecker

A minimal semi‑truck driving game built with **Phaser 3** and **Vite**, ready to be packaged as a **YouTube Playable**.

## Project structure
```
big-rig-wrecker/
├─ package.json          # npm manifest
├─ vite.config.js        # Vite config (static build)
├─ index.html            # HTML entry point
└─ src/
   ├─ main.js           # Game bootstrap
   └─ GameScene.js      # Simple scene with a truck that moves left/right
```

## How to run locally
```bash
# 1️⃣ Install dependencies (requires Node.js)
pnpm install   # or npm i

# 2️⃣ Start dev server
pnpm dev       # or npm run dev
```
Open the URL shown in the terminal (default `http://localhost:5173`). Use the left/right arrow keys to move the truck.

## Build for production
```bash
pnpm build   # or npm run build
```
The compiled static site appears in `dist/`.

## Deploy as a YouTube Playable

**Important:** YouTube does **not** host the game files for Playables. You must provide a publicly‑accessible HTTPS URL that serves the static `dist/` folder. YouTube only embeds that URL in an iframe.

You can host the bundle on any static‑file host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, an S3 bucket, etc.). The steps below show the most common options.

---
### Hosting options
| Host | How to publish `dist/` |
|------|------------------------|
| **GitHub Pages** | 1. Create a new repo (e.g., `big-rig-wrecker`). 2. Commit the *entire* project (or just the `dist/` folder). 3. In the repo settings enable **Pages** → **Source**: `main` (or `gh‑pages`). GitHub will serve `https://<username>.github.io/big-rig-wrecker/`. |
| **Netlify** | Drag‑and‑drop the `dist/` folder onto the Netlify dashboard, or connect the repo and let Netlify run `npm run build`. Netlify gives you a `https://<project>.netlify.app` URL. |
| **Vercel** | Same as Netlify – import the repo, Vercel detects Vite and builds automatically. |
| **Cloudflare Pages** | Connect the repo, set the build command to `npm run build`, and the output folder to `dist`. |
| **Self‑hosted (HTTPS)** | Serve `dist/` with any static web server (e.g., `npx serve -s dist`). Use a tunnelling service (ngrok, Cloudflare Tunnel) to expose an HTTPS URL. |

Once you have an HTTPS URL, continue with the YouTube Playable creation steps below.

---
## Create the Playable in YouTube Studio
1. Open **YouTube Studio → Monetization → Playables** (or the *Create Playable* flow).
2. Paste the HTTPS URL that points to `index.html` of your hosted bundle.
3. YouTube validates the page (loads within 5 s, no disallowed APIs, appropriate dimensions).
4. Enable the desired monetisation options (ads, in‑playable purchases).
5. Save and publish – the game will now appear as an interactive overlay in your videos.

1. Host the contents of `dist/` on any HTTPS static‑file host (GitHub Pages, Netlify, Vercel, etc.).
2. In **YouTube Studio → Monetization → Playables**, provide the HTTPS URL of the hosted `index.html`.
3. Enable the desired monetisation options (ads, in‑playable purchases) in the Playable creation flow.
4. Save and publish – the game will appear as an interactive overlay in your videos.

## Extending the game
- Add sprites or background images by placing assets in `src/assets/` and loading them in `preload()`.
- Implement scoring, obstacles, or sound effects using Phaser’s APIs.
- For custom YouTube‑API interactions, use `window.parent.postMessage` as allowed by the Playable sandbox.

---
### License
MIT – feel free to modify and publish.
