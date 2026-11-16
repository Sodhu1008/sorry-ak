# A Little Apology From My Heart ❤️

A small, romantic, one-page website: an opening gift surprise, an apology, the things you love about her, a photo gallery, 10 reasons, your promises, one gentle question, and a final love letter.

It's built with plain **HTML, CSS and JavaScript**: no installs, no build step, no internet services (apart from Google Fonts for the pretty lettering).

```
sorry/
├── index.html          ← the page
├── css/style.css       ← all the styling (colors at the top)
├── js/content.js       ← ✏️ ALL YOUR WORDS, NAMES, PHOTOS AND MUSIC LIVE HERE
├── js/main.js          ← animations & interactions
├── js/music.js         ← background music
├── images/             ← 📸 your photos go here
└── music/              ← 🎵 your song goes here
```

---

## 1. Install dependencies

Nothing to install. 🎉 You only need a web browser.

(Optional) If you want a local web server, any of these work:
- **VS Code**: install the *Live Server* extension, right-click `index.html` → *Open with Live Server*.
- **Node.js**: `npx serve .`
- **Python**: `python -m http.server 8000`

## 2. Run the website locally

Double-click **`index.html`**. It opens in your browser and everything works.

Or, with one of the servers above, open the address it prints (for example `http://localhost:8000`).

## 3. Replace the photographs

1. Copy your photos into the **`images/`** folder, e.g. `images/first-date.jpg`.
2. Open **`js/content.js`** and find the `photos:` list.
3. Change each `src` to your file name and write a caption:

   ```js
   { src: "images/first-date.jpg", alt: "Us at the cafe", caption: "One of my favorite moments ❤️" },
   ```

4. Add or remove lines to show between 6 and 10 photos. Portrait, landscape and square photos all work: the gallery keeps each photo's own shape, so nothing gets cropped.

**Tips so photos load fast:**
- Resize them to about **1200 px** on the longest side and save as JPG (quality ~80%). Free tools: [squoosh.app](https://squoosh.app), or *Photos → Resize* on Windows.
- File names are case-sensitive once online: `Photo.JPG` ≠ `photo.jpg`. Lowercase names with no spaces are safest.

## 4. Add background music

1. Put an MP3 into the **`music/`** folder, e.g. `music/our-song.mp3`.
2. In **`js/content.js`**, set:

   ```js
   music: {
     file: "music/our-song.mp3",
     volume: 0.35,
   },
   ```

If you leave `file: ""`, a soft built-in music-box melody plays instead, so it always works.

**How it plays:** the song starts automatically when the site opens. Most browsers block sound until the visitor first taps, clicks or presses a key, so in practice it begins on her first touch (for example when she presses *Open Your Surprise*).
The round 🎵 button in the bottom-right corner is visible on every screen. It stops the song, and once stopped it stays off until she presses it again.

Keep the MP3 small (3–5 MB, e.g. 128 kbps) so it starts quickly on mobile data.

## 5. Customize all messages

Everything personal is in **`js/content.js`**:

| What | Where in `content.js` |
|---|---|
| Her name / nickname | `herName` |
| Your name / sign-off | `yourName` |
| Opening screen text | `opening` |
| Apology message & signature | `apology` |
| The six "special" cards | `specialThings` |
| Photo files & captions | `photos` |
| 10 reasons | `reasons` |
| Promises | `promises`, `promisesClosing` |
| The question & both replies | `question` |
| Final love letter | `letter` |
| Footer | `footer` |

Rules of thumb:
- Text goes between quotes: `"like this"`. If your text contains a `"`, use `'` around it instead, or write `\"`.
- Keep the comma at the end of each item.
- Write `{herName}` anywhere and it is replaced with her name.
- Save, then refresh the browser.

**Colors:** change the values at the top of `css/style.css` (`--rose`, `--deep`, etc.).

## 6. Build the production version

There's nothing to build. The folder *is* the production version.
Before you share it, check that:
- your photos are in `images/` and listed in `content.js`
- the site looks right on your phone (open it from the deployed link)

## 7. Deploy the website (free)

**Netlify Drop (easiest, about 1 minute)**
1. Go to <https://app.netlify.com/drop>.
2. Drag the whole `sorry` folder onto the page.
3. You get a link like `https://something-cute.netlify.app`. You can rename it under *Site settings → Change site name*.

**GitHub Pages**
1. Create a GitHub repository and upload all files (keep the folder structure).
2. Go to *Settings → Pages → Deploy from a branch → main / root*.
3. Your link appears after a minute: `https://<your-username>.github.io/<repo-name>/`.

**Vercel**
1. Go to <https://vercel.com/new>, import the repository (or use `npx vercel` in this folder).
2. No settings needed; framework preset: *Other*.

> 💡 Privacy: anyone with the link can see the site, including your photos. Use a site name that isn't easy to guess, and only share the link with her.

---

### Features

- Loading animation → opening gift-box surprise with floating hearts
- Background music that starts automatically (on her first tap if the browser requires it), with an always-visible stop/play button
- "Replay the surprise" button (bottom-right corner and footer)
- Scroll-triggered animations, floating hearts, sparkles, flowers and butterflies
- Heart cursor with a soft trail on desktop (normal touch behavior on phones)
- Photo gallery with a full-screen lightbox (click, arrow keys, swipe, Esc to close)
- A respectful question: both answers are always visible and clickable, and "I need some time" gets a kind, understanding reply
- Fully responsive, keyboard-friendly, screen-reader labels, and calmer motion for people who turn on "reduce motion" on their device

Made with love ❤️
