# Bubble Pop for Toddlers

A calm, ad-free bubble popping game for ages 1 to 4, built for Google Play's
"Designed for Families" program. Live at **https://taugustincst.github.io/bubblepop/**
(installable PWA, works offline).

## What's in it

- **Four modes**, switched with big picture buttons: free play, animals, letters and numbers, and "find the color"
- Bubbles are large, slow, and forgiving to tap; multi-touch works so two hands (or two kids) can pop at once
- Pops are spoken aloud (color names, animal names, letters) using the device's built-in speech, which can be turned off
- Confetti and a chime every 20 pops, or every 5 correct colors in color mode. No fail state, no timers, no score pressure
- **Grown-ups screen** behind a 2.5-second hold gate (required by Play's families policy for anything leading out of the game): sound, speech, bubble size, bubble speed, and an option to hide the mode buttons so little hands can't switch modes
- No ads, no purchases, no accounts, no analytics, no network calls after first load. Only the settings and a pop counter are stored on the device
- No build step and no dependencies: `index.html`, `style.css`, `game.js`, `sw.js`, `manifest.webmanifest`

## Publishing to Google Play

Same Trusted Web Activity (TWA) flow as Ironhold and Elderon. The Bubblewrap config is `android/twa-manifest.json`
(package `com.taugustincst.bubblepop`).

```bash
npm i -g @bubblewrap/cli
cd bubblepop/android
bubblewrap init --manifest https://taugustincst.github.io/bubblepop/manifest.webmanifest
bubblewrap build          # produces app-release-bundle.aab
```

After the first upload, add a `com.taugustincst.bubblepop` entry with the Play App Signing SHA-256 fingerprint
(and your upload key's fingerprint) to `/.well-known/assetlinks.json`, next to the Elderon entry.

### Play Console checklist specific to a kids' app

- **Target audience and content**: declare the app is designed for children (ages 5 and under). This enrolls it in the Families policy; the app already meets it: no ads, no external links outside the parent-gated screen, no data collection.
- **Privacy policy URL**: `https://taugustincst.github.io/bubblepop/privacy.html`.
- **Data safety form**: "No data collected", "No data shared".
- **Content rating**: IARC questionnaire, expect "Everyone".
- **Teacher Approved program** (optional): you can apply once published; the app's educational modes (letters, colors, animals) and lack of ads make it a reasonable candidate.
- **Pricing**: Play apps cannot switch from free to paid later. Decide before publishing. A paid kids' app with "no ads, ever" as the pitch is the usual positioning for this category.
- **Store assets**: 512×512 icon (`icons/icon-512.png`), a 1024×500 feature graphic, and phone screenshots (`icons/screenshot-portrait.png` is one; capture 2 to 3 more from a phone showing the different modes).

### Updates

Push to this repo to update the game; bump `VERSION` in `sw.js` so cached players refresh.
Rebuild the Android bundle (bump `appVersionCode`) only when the wrapper or Play's target SDK requirement changes.
