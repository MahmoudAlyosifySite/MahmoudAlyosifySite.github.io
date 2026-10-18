# Mahmoud Alyosify — Introduction Film · Storyboard

**Length** 90.0 s · **Format** 1920 × 1080, 30 fps (2,700 frames) · **Music** 80 BPM, 4/4, 1 bar = 3.0 s, 1 beat = 0.75 s, 30 bars
**Language** English only · **Palette** black and gold only · **Source of truth** the site files listed in §3

All paths below are relative to the repo root:
`D:\Projects Until 2024\my website\v2\MahmoudAlyosifySite.github.io\`

---

## 1. Logline, style guide, typography

### 1.1 Logline

> A boy from Assiut whose physics teachers called him "Egypt's Einstein" learns, builds and teaches his way from the Faculty of Computers and Information to an MSc in Artificial Intelligence at Queen's University in Canada, where he asks whether a language model can say less and lose nothing.

The emotional line is **calm confidence**. The film never shouts and never brags. Facts are set like captions in a museum: short, exact and quiet. One thing per moment carries gold.

**The arc in one breath:** a mark in the dark → **his portrait, lit in gold**, and his name → Assiut → the university years → first wins → graduation → service → teaching → building → the journey to Canada → Queen's and MinimalLM → "Let's give intelligence a purpose." → **the same portrait returns** beside his name, URL and signature → black.

**The signature image of the film is his site portrait, `img/img-mahmoud- april 2026.PNG`** (the hero image of his website). It opens the film and closes it, both times as a cutout composited directly on black with a soft gold rim light (see §1.8). Everything between those two appearances is the story of how he got there. The gallery photos are supporting chapter imagery only.

### 1.2 Colour (taken from the live site, `css/theme.css`, dark theme)

> **Important for the builder:** the site that is live today is styled by `css/theme.css` (loaded by `index.html`, lines 50–55). `css/modern.css` is a legacy file with cyan, violet and navy tokens (`#06b6d4`, `#8b5cf6`, `#080b12`). **Do not take any colour from `modern.css`.**

| Token | Hex / value | Use in the film |
|---|---|---|
| `--paper` | `#0B0B0C` | The frame background, every scene. Never pure `#000`. |
| `--paper-2` | `#141416` | Photo mats and inset frames (a 1px step up from the background) |
| `--paper-3` | `#111113` | The token pills in Scene 10, the end-card panel |
| `--ink` | `#EEEAE2` | Headlines and primary copy (warm paper-white, never `#FFF`) |
| `--ink-2` | `#C2BEB6` | Secondary lines |
| `--ink-3` | `#908C85` | Captions, the alias, dates in the thread |
| `--gold` | `#C9A55E` | **Marks only**: hairlines, nodes, rings, map lines, particles, the marker stroke. Never small text. |
| `--gold-ink` | `#D6B676` | Gold that carries text: kickers, numbers, the URL |
| `--gold-soft` | `rgba(201,165,94,0.34)` | Glows and selection-like washes |
| `--rule` | `rgba(238,234,226,0.12)` | Faint hairlines and frame borders |
| Foil (ink theme, from `business-card/index.html` line 76) | `#F2DFA8 · #D2AE62 · #A9843F · #E2C27E · #C49A4E` | **Only** for the light sweep across the emblem and wordmark, and the wordmark capitals |
| Marker (site highlighter, `css/theme.css` `--marker`) | path fill `#C9A55E` at `fill-opacity .42` | Under **one** key phrase per scene at most |

**How gold is used.** The site's own rule, in `css/theme.css`: "One accent, used as a mark — never as decoration. Gold means 'this is the key idea'." In the film:

- Gold appears in three roles only: (1) **lines** (hairlines, the thread, map routes, line-art), (2) **the one key phrase** (gold-ink text or the hand-drawn marker under it), (3) **light** (the foil sweep and the particle dust).
- In any frame, gold covers less than about 8% of the pixels, photos aside.
- No gold gradients on body text, no gold drop shadows, no bevels, no "gold metal" 3D text.
- **Logos and the mascot keep their real colours.** The Queen's crest stays red, blue and gold, Assiut stays black, white and yellow, and the mascot stays its own blues. Never tint, duotone or recolour them. The only logos that are already gold are Mahmoud's own emblem and signature.
- **No navy or blue design elements**: no blue bands, panels, gradients or glows. Blue that is inside a real photo (a suit, a sign, a Queen's polo) is allowed but graded down (see 1.4).

### 1.3 Fonts (the site's own pairing, loaded from Google Fonts exactly as `index.html` line 51)

```
https://fonts.googleapis.com/css2?family=Gloock&family=Ysabeau+Office:ital,wght@0,300..700;1,400..600&family=Chivo+Mono:wght@400;500&display=swap
```

- **Gloock** (display serif, single weight 400): titles, the name in captions, the big numbers. Never fake bold or italic. Turn off synthetic styles (`font-synthesis: none`).
- **Ysabeau Office** (humanist sans "with Garamond in its bones"): lines of copy; its *italic* for the quoted lines (the "Egypt's Einstein" line and the research question).
- **Chivo Mono** (400/500): kickers, years, labels and the URL, in UPPERCASE with wide tracking for kickers.
- **Mahmoud's own lettering** ("Alyosify Brush", his custom wordmark): the name in Scene 1 and on the end card. Use the `<symbol id="wordmark">` in `business-card/index.html` (line 685). It has separate `wm-caps` and `wm-lower` paths. Render it as on his ink business card (the `initials` style, the card's default): lowercase in `--ink #EEEAE2`, capitals M and A in the ink-theme foil gradient (`#F2DFA8 → #D2AE62 → #A9843F → #E2C27E → #C49A4E`, diagonal, as defined at `business-card/index.html` line 680). The standalone `business-card/mahmoud-alyosify-wordmark.svg` carries the *paper* (dark-foil) colours and a `#0B0B0C` knock-out path. Prefer the symbol.

Wait for `document.fonts.ready` before capturing frame 0. A fallback font in one frame reads as a flicker.

### 1.4 Typography scale for 1080p

| Role | Font | Size / line-height | Tracking | Colour |
|---|---|---|---|---|
| Wordmark (name lockup) | Alyosify Brush SVG | 660 px wide (Scene 1), 600 px (end card) | — | ink + foil caps |
| Display title | Gloock 400 | 112 px / 1.0 | −0.01em | `--ink` (or `--gold-ink` for "MinimalLM") |
| Headline | Gloock 400 | 72 px / 1.08 | −0.005em | `--ink` |
| Big number | Gloock 400 | 150 px / 1.0, tabular | 0 | `--gold-ink` |
| Lead line | Ysabeau Office 400 | 44 px / 1.25 | 0 | `--ink` |
| Quote / question | Ysabeau Office italic 500 | 48 px / 1.25 | 0 | `--ink`, key phrase marked |
| Secondary line | Ysabeau Office 400 | 34 px / 1.3 | 0.005em | `--ink-2` |
| Kicker | Chivo Mono 500, UPPERCASE | 22 px / 1 | 0.28em | `--gold-ink` |
| Label / caption | Chivo Mono 400 | 24 px / 1.2 | 0.08em | `--ink-3` or `--ink-2` |
| Thread year | Chivo Mono 400 | 20 px | 0.12em | `--ink-3`, the active year `--gold-ink` |

- **Safe area:** keep all text inside 160 px from the left/right and 108 px from the top/bottom (title-safe 1600 × 864). The primary text column starts at x = 160 px.
- **Measure:** at most 26 characters per line for headlines and 44 for lead lines. Break lines by sense, not by width (break points are given in the copy below with " / ").
- **Minimum size is 22 px.** Nothing smaller ever appears on screen.
- Use real typographic quotes and dashes: “ ” ’ — – ·

### 1.5 Texture: grain, vignette, dust, grade

- **Film grain**: a full-frame monochrome noise layer, opacity **0.035**, blend `overlay`, re-seeded **every frame** from the frame index (deterministic: `seed = frame`). Use 1-px noise scaled 1.5× so it stays fine. Never animated "scratches" or "dust and hair" overlays.
- **Vignette**: a radial gradient centred, transparent to 58% radius, `rgba(0,0,0,0.55)` at the corners. Constant through the film (on photos a little stronger, 0.62).
- **Gold dust**: 48 particles, seeded (`mulberry32(1123)`), radius 0.8–2.2 px, colour `--gold`, opacity 0.12–0.40, drifting **upward** 6–14 px/s with a slow sinusoidal sway (amplitude 6 px, period 7–11 s), plus a soft 4-px blur glow. Visible in the intro, the build and the climax at most. In the photo scenes they stay above the photos at 50% of their normal opacity. They never swarm, burst or explode.
- **Photo grade** (CSS filters on every photo): `saturate(0.82) contrast(1.04) brightness(0.92) sepia(0.06)`. Photos with strong blue (`IMG_2921.jpg`, `IMG_8530.JPG`, `queen shirt.jpg`) take `saturate(0.72)` instead. Over each photo add a 2-stop gradient of `--paper` from the side that carries text (0.92 → 0 over 45% of the width) so text never sits on a busy image.
- **Photo frame**: photos either fill the frame (full bleed with the gradient) or sit in an inset frame. The inset is a `--paper-2` mat, a 1-px `--rule` border, radius **3 px** (the site's only radius, `--r`) and no drop shadow beyond `0 30px 70px rgba(0,0,0,0.6)`.

### 1.6 Motion principles

- **Slow and decelerating.** The default ease is the site's `--ease` = `cubic-bezier(0.2, 0.7, 0.2, 1)`. Fades and dissolves use `--ease-soft` = `cubic-bezier(0.4, 0, 0.2, 1)`. Ken Burns moves are **linear** in scale and position (any easing on a 6-s push reads as a lurch).
- **Nothing bouncy**: no overshoot, no spring, no elastic, no wobble, no rotation of text, no 3D flips.
- Text **fades up**: opacity 0 → 1 and `translateY(18px) → 0` over **0.75 s** (one beat). Multi-word reveals stagger by word at 60 ms. Letter-by-letter reveals happen only on the name and "MinimalLM" (40 ms per letter).
- Text **fades out** in place over 0.5 s (no movement), always finished **before** the next cut.
- **Ken Burns**: 4–8% total scale change per 6 s. Never more than 12% in a single shot.
- **Line-art draws** with `stroke-dasharray / stroke-dashoffset` over 1.5–3 s, `--ease`. Strokes are 1.25–1.5 px, `stroke-linecap: round`, colour `--gold`.
- **Cuts**: every scene change is a **0.75-s cross-dissolve through `--paper`** centred on the bar line (it starts 0.375 s before the bar and ends 0.375 s after it), unless the scene says otherwise. Hard cuts happen in only one place (the 60.0 s downbeat of the climax).
- All animation is a pure function of `t` (seconds). No `Math.random()` without a seed, no CSS transitions triggered by time, and no `requestAnimationFrame` state.

### 1.7 A recurring device: "the thread"

The site and his cards use **a gold line that leaves its label and ends in a node** (`linkedin-cover/index.html`, `business-card/index.html` `.edge`). The film borrows it as the **thread** of his journey:

- A 1-px `--gold` hairline at **y = 1000 px**, from x = 160 to x = 1760, at 0.55 opacity, with small ring nodes (10 px, 1.5-px gold border, `--paper` centre) at the years **2000 · 2019 · 2023 · 2025 · 2026**, labelled beneath in Chivo Mono 20 px, `--ink-3`.
- A filled **playhead node** (8 px gold dot with a 14-px `--gold-soft` glow) slides along it, moving only forward, during each scene's first 1.5 s (`--ease`). The active year label turns `--gold-ink`.
- Node x-positions (for the slide): 2000 → x 220, 2019 → x 560, 2023 → x 900, 2025 → x 1300, 2026 → x 1700. In-between positions are interpolated (2022 → x 815, 2024 → x 1100).
- The thread is visible from **Scene 2 to Scene 8** (12.0–60.0 s). In the climax it becomes the journey arc (see Scene 9) and it is not used in the intro or the outro.

### 1.8 The hero portrait (the film's signature image)

**File:** `img/img-mahmoud- april 2026.PNG` (2048 × 2048, RGBA, a clean transparent cutout: navy suit, gold tie, gold pocket square, the gold emblem pin on the lapel). Its alpha bounding box is x 44–1966, y 152–2048: the top of his hair is at **7.5%** of the image height, his eyes at about **33%**, and the jacket is cut by the **bottom edge** of the image. The site's whole palette was sampled from this photograph (`css/theme.css` header), which is why it belongs at both ends of the film.

**Never use** `img/_web/portrait.webp` (900 px) for it, never put it in a box, mat, circle or frame, and never recolour, tint, duotone or "gold-grade" the suit, skin or tie. The navy of the suit is his real clothing and stays exactly as photographed.

**The composite (one recipe, used in both Scene 1 and Scene 11):**

1. **Placement.** Directly on `--paper` (`#0B0B0C`), no box. Displayed **1000 px tall** (so 1000 × 1000), its **bottom edge on the frame's bottom edge** (y 80–1080). The head top therefore sits at about y 155 and the eyes at about y 410.
2. **Bottom melt.** A linear alpha mask on the portrait from 100% at 78% of its height to 0% at 100%, so the hard cut at the jacket dissolves into black. No visible line where the image ends.
3. **Back glow** (behind the portrait, a separate layer): a radial gradient centred on his head and shoulders (at 50% x, 38% y of the portrait), `rgba(201,165,94,0.20)` at the centre fading to 0 at a radius of 560 px. It is warm air behind him, not a halo.
4. **Gold rim light** (on the portrait layer itself, built from the cutout's own alpha). Stack these CSS `drop-shadow`s, which follow the silhouette:
   `filter: drop-shadow(0 0 1px rgba(214,182,118,0.70)) drop-shadow(-2px -1px 3px rgba(242,223,168,0.32)) drop-shadow(0 0 22px rgba(201,165,94,0.22)) drop-shadow(0 0 70px rgba(201,165,94,0.10));`
   The first is a crisp 1-px edge, the second a key-light rim from the upper left (the light in the photo comes from the front-left), and the last two are a soft glow. **This rim matters most on his hair**, which is near-black and would otherwise vanish into the background. Check the hairline at 100% zoom: you should see a thin warm edge, not a yellow outline.
5. **Own grade:** `contrast(1.03) brightness(0.98)` only. No saturation change, no sepia. (It is the one photo exempt from the photo grade in §1.5.)
6. **Breathing.** While it is on screen the portrait has a linear push of 1.00 → 1.03 per 6 s, anchored at the bottom centre, so it never lifts off the frame's bottom edge.
7. **The rim "ignites".** When the portrait appears, its rim and back glow start at 0 and rise to full over 2.25 s, **0.75 s after** the portrait itself has started to fade in. He appears out of the dark first, then the light finds him.

Place it on the **right** of the frame: portrait centre at **x = 1400** (it then spans about x 900–1900; the cutout's left shoulder fades into black). Text always sits in the left column (x 160–820), never over the portrait.

---

## 2. Scenes

### 2.1 Overview

| # | Scene | Bars | Time (s) | Music section | Key visual | On-screen copy (headline) |
|---|---|---|---|---|---|---|
| 1 | The Mark | 1–4 | 0.0–12.0 | Intro | Emblem reveal → **hero portrait, gold rim light** + wordmark | *Mahmoud Alyosify* |
| 2 | Origins | 5–6 | 12.0–18.0 | Verse | Gold line-art Egypt, the Nile, Assiut | “Egypt’s Einstein.” |
| 3 | Assiut University | 7–8 | 18.0–24.0 | Verse | `Bio FCI 2023.jpg` + Assiut logo | Assiut University |
| 4 | First Wins | 9–10 | 24.0–30.0 | Verse | Three-panel triptych | He learned to lead. |
| 5 | Graduation | 11–12 | 30.0–36.0 | Verse | `DSC_3777.jpg` | Graduated, 2023. |
| 6 | Service | 13–14 | 36.0–42.0 | Build | `IMG_4263 Copy.JPG` | Military service. |
| 7 | Teaching | 15–17 | 42.0–51.0 | Build | `teach.png` → numbers → `IMG_8530.JPG` | 10,000+ learners |
| 8 | Building | 18–20 | 51.0–60.0 | Build | Gold neural constellation of projects | He builds intelligent systems. |
| 9 | Egypt to Canada | 21–23 | 60.0–69.0 | Climax | Journey arc → `queen shirt.jpg` + Queen’s logo | Queen’s University |
| 10 | MinimalLM | 24–26 | 69.0–78.0 | Climax | Token line that ends earlier | Can a language model say less? |
| 11 | A Purpose | 27–30 | 78.0–90.0 | Outro | Statement → **hero portrait returns** + end card → black | Let’s give intelligence a purpose. |

Bar boundaries for reference: bar n starts at (n − 1) × 3.0 s. The cuts at 12, 18, 24, 30, 36, 42, 51, 60, 69 and 78 s all land on bar lines.

---

### Scene 1 — The Mark

**Bars 1–4 · 0.00–12.00 s · Intro (near-silence → soft pad → sparse piano)**

**On-screen copy (word for word)**
- `Mahmoud Alyosify` (the wordmark, as lettering, not typed text)
- `AI ENGINEER · RESEARCHER · EDUCATOR` (Chivo Mono kicker, `--gold-ink`)
- `also known as Mahmoud Sayed Youssef` (Ysabeau Office italic 30 px, `--ink-3`). This is the one place where 30 px is allowed under 34 px.

**Assets**
- Emblem: `linkedin-cover/emblem.png` (1053 × 942, transparent, already black and gold, his own mark). Displayed at **420 px wide**, centred at (960, 520).
- **Hero portrait**: `img/img-mahmoud- april 2026.PNG`, composited exactly as in **§1.8** (on black, no box, bottom melt, back glow, gold rim light, centre x = 1400, 1000 px tall, bottom-anchored). This is the first time the audience sees him, so it is the most important moment of the intro.
- Wordmark: the `<symbol id="wordmark">` from `business-card/index.html` (see §1.3), **660 px wide** (it must stay inside the left column, x 160–820), top-left corner at (160, 400).

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 0.00 | — | Pure `--paper`. Grain on. Nothing else. |
| 0.75 | b2 | Gold dust begins to appear, fading 0 → full over 3.0 s. |
| 1.50 | b3 | A single `--gold` hairline draws outward from the centre (960, 760), width 0 → 420 px, over 1.5 s (`--ease`). |
| 3.00 | **Bar 2** (pad enters) | The emblem resolves: opacity 0 → 1, `blur(10px) → 0`, scale 0.965 → 1.0 over **2.25 s** (`--ease`). The hairline stays beneath it. |
| 4.50 | b3 of bar 2 | **Light sweep**: a 22°-angled band of the foil gradient (`#F2DFA8` core, 18% of the emblem's width) travels across the emblem from −30% to 130% over 1.5 s (`--ease-soft`), masked to the emblem's own alpha (`mask-image: url(emblem.png)`), `mix-blend-mode: screen`, peak opacity 0.55. |
| 6.00 | **Bar 3** (first piano notes) | The emblem drifts up 40 px and fades to 0 over 1.5 s. The hairline retracts. At the same time **the portrait emerges from the dark**: opacity 0 → 1 and `brightness(0.4) → 0.98` over 2.25 s (`--ease-soft`), with no slide; he is simply revealed where he stands. |
| 6.75 | b2 | **The rim light ignites** (§1.8 step 7): the gold rim and the back glow rise from 0 to full over 2.25 s. In parallel, the wordmark reveals left → right through a soft-edged mask wipe (an 80-px feather), over 1.5 s, as if drawn by a brush. |
| 8.25 | b4 | The kicker `AI ENGINEER · RESEARCHER · EDUCATOR` fades up under the wordmark (y = 620). |
| 9.00 | **Bar 4** | The alias line fades up (y = 672). A 1-px `--gold` underline (240 px) draws beneath the kicker. |
| 6.00–12.0 | — | The portrait breathes: scale 1.00 → 1.03, linear, anchored at the bottom centre. |
| 10.50 | b3 of bar 4 | Second foil light sweep, this time across the wordmark capitals only (1.2 s, opacity 0.45). |
| 11.25 | b4 | The text fades out (0.5 s). The portrait holds alone on black for its last beat. |
| 11.625–12.375 | bar line | Dissolve through `--paper` into Scene 2. The rim light fades first, then the portrait, so the last thing seen is his face. |

**Music sync:** the emblem lands on the pad's entry at 3.0 s. The portrait lands on the first piano phrase at 6.0 s, and the rim light reaches full on the downbeat of bar 4 (9.0 s). Keep the first 1.5 s of the picture completely empty to honour the near-silence.

**Transition:** a 0.75-s dissolve through black, centred on 12.0 s.

---

### Scene 2 — Origins

**Bars 5–6 · 12.00–18.00 s · Verse (the piano arpeggio and low strings enter)**

**On-screen copy**
- Kicker: `ASSIUT · UPPER EGYPT · 2000`
- Line 1 (lead, `--ink`): `It began in Assiut, Upper Egypt.`
- Line 2 (quote, Ysabeau italic 48): `His physics teachers called him / “Egypt’s Einstein.”` with the site marker under **“Egypt’s Einstein.”**

(At most 11 words are on screen at once: lines 1 and 2 never share the frame.)

**Assets**
- **Line art to build** (SVG, gold strokes 1.25 px, nothing filled): a minimal outline of Egypt's borders and the Mediterranean and Red Sea coasts, and the **Nile** as a single brighter line (1.5 px, opacity 1.0) running south → north, with the Delta fanning out. A ring node marks **Assiut** on the Nile, about 375 km south of Cairo (use real coordinates: Assiut ≈ 27.18° N, 31.18° E; Cairo ≈ 30.04° N, 31.24° E). Put the map on the **right half** (map bounding box x 1000–1700, y 140–900). Cairo appears only as a faint unlabelled dot.
- No photo.

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 12.00 | **Bar 5** | The country outline draws over 2.25 s (`--ease`), opacity 0.35. The thread appears at the bottom (fade 0.75 s) and the playhead slides to **2000**. |
| 12.75 | b2 | The Nile draws from the south border to the Delta, 1.5 s, full gold. The kicker fades up (x 160, y 360). |
| 13.50 | b3 | The Assiut ring node pops in by scaling 0.6 → 1 with opacity (no overshoot), then sends **one** slow ring pulse (radius 10 → 46 px, opacity 0.5 → 0, 1.5 s). |
| 13.50 | b3 | Line 1 fades up (x 160, y 420). |
| 15.00 | **Bar 6** | Line 1 fades out (0.5 s). |
| 15.75 | b2 | Line 2 fades up, word stagger. |
| 16.50 | b3 | The marker draws under “Egypt’s Einstein.” from left to right over 0.75 s (animate `background-size` 0 → 100%). |
| 17.25 | b4 | A second soft pulse at Assiut. Everything except the thread starts to fade by 17.625. |

**Camera:** the whole map drifts up 14 px and scales 1.00 → 1.04 over the 6 s (linear).

**Music sync:** the Nile is drawn on the first arpeggio bar. The marker is drawn on a beat (16.5 s) so it feels like a pen stroke on the music.

**Transition:** the Assiut node holds briefly, then a dissolve through black centred on 18.0 s.

---

### Scene 3 — Assiut University

**Bars 7–8 · 18.00–24.00 s · Verse**

**On-screen copy**
- Kicker: `2019 – 2023`
- Headline (Gloock 72): `Assiut University`
- Secondary (34): `Faculty of Computers and Information`
- Line at 21.0 s (34, `--ink-2`): `B.Sc. Computer & Information Science / Bioinformatics`

**Assets**
- Photo: `img/Mahmoud's Photo Gallery/Bio FCI 2023.jpg` (3934 × 2642). This is the class photo in front of the faculty building, whose bilingual sign "FACULTY OF COMPUTERS AND INFORMATION" is visible. **Full bleed.**
  - Ken Burns: **start** scale 1.30 centred on the sign (focus x 50%, y 27%) → **end** scale 1.12 centred at (50%, 45%), linear over 6.75 s (including the dissolves). This reveals the crowd of graduates under the sign.
  - The `--paper` gradient comes from the **left** (text side) and also a 220-px gradient from the bottom for the thread.
- Logo: `img/_web/logos/assiut-dark.webp` (240 × 352, the dark-background version, real colours). Display at **150 px tall**, top-left of the text block (x 160, y 250). Real colours: do not tint.

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 18.00 | **Bar 7** | The photo resolves from the dissolve. The playhead slides to **2019**. |
| 18.75 | b2 | The Assiut logo fades in (opacity only, 1.0 s). |
| 19.50 | b3 | The kicker and headline fade up (x 160, y 440 / 480). |
| 20.25 | b4 | The secondary line fades up. |
| 21.00 | **Bar 8** | The secondary line cross-fades into the degree line. |
| 22.50 | b3 | The playhead begins a slow slide 2019 → 2022 (finishes 24.75). |
| 23.25 | b4 | The text fades out. |

**Music sync:** the headline lands on beat 3 of the first bar. The degree line arrives with the second phrase at 21.0 s.

**Transition:** a dissolve through black centred on 24.0 s.

---

### Scene 4 — First Wins

**Bars 9–10 · 24.00–30.00 s · Verse**

**On-screen copy**
- Headline (Gloock 72, centred above the panels at y 190): `He learned to lead.`
- One caption at a time under the active panel (Chivo Mono 24, `--ink-2`, with its key words in `--gold-ink`):
  - Panel A: `1ST PLACE · SMART CITIES HACKATHON · 2022`
  - Panel B: `IDEAL STUDENT · 2022–2023`
  - Panel C: `VITALISM SOLUTION · IMAGINE CUP SEMI-FINALIST`

**Assets.** Three inset frames, each **520 × 640 px** (portrait crops), 40-px gutters, centred (x 380, 960, 1540; y 300–940), `--paper-2` mats, 3-px radius.
- **A**: `img/Mahmoud's Photo Gallery/IMG_0578.JPG` (4032 × 3024). The team holding the "First Winner · Smart Hospital" cheque. Mahmoud is **third from the left** (maroon sweater, glasses). Crop focus **x 47%, y 40%** so that he and the cheque sit in frame. Ken Burns 1.06 → 1.10.
- **B**: `img/Mahmoud's Photo Gallery/IMG_2921.jpg` (6720 × 4480). Mahmoud on stage receiving his Ideal Student certificate (navy suit, gold tie). Crop focus **x 66%, y 38%** with him centred. The circuit-board backdrop behind him is blue, so use the blue-photo grade (`saturate(0.72)`) and a darker `brightness(0.86)`. Ken Burns 1.08 → 1.12.
- **C**: `img/Mahmoud's Photo Gallery/IMG_7833.jpg` (4032 × 3024). The Vitalism stand ("Faculty of Computer and Information, Assiut University · Vitalism (Contactless Estimation of Vital Signs Using Real-Time Video)"). Mahmoud is in the **grey suit with the gold tie**, centre. Crop focus **x 50%, y 42%**, keeping the stand's sign in the top of the frame. Ken Burns 1.06 → 1.10.

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 24.00 | **Bar 9** | The headline fades up. The playhead is already at 2022. |
| 24.75 | b2 | **Panel A** reveals with a vertical mask wipe (bottom → top, 0.75 s), then its caption fades up beneath the panels (centred, baseline y 975). In this scene only, the thread sits lower, at **y 1030**, so it clears the captions. |
| 26.25 | b4 | **Panel B** reveals. Caption A fades out and caption B fades up. Panel A dims to 55% brightness. |
| 27.00 | **Bar 10** | The playhead slides to **2023** (slow, 1.5 s). |
| 27.75 | b2 | **Panel C** reveals. Caption B is replaced by caption C. Panel B dims. |
| 29.25 | b4 | All three panels come back to full brightness together for a final 0.5-s "group" moment. The text fades out. |

**Music sync:** each panel arrives one and a half bars apart on a beat, matching the arpeggio's rising pattern. Do not reveal on every beat: the cadence is A (b2) — B (b4) — C (b2 of the next bar).

**Transition:** the three frames dissolve through black, centred on 30.0 s.

---

### Scene 5 — Graduation

**Bars 11–12 · 30.00–36.00 s · Verse (the end of the verse phrase)**

**On-screen copy**
- Kicker: `JULY 2023`
- Headline (Gloock 72): `Graduated.` with the marker under it
- Secondary (34, `--ink-2`): `GPA 3.53 / 4.00 · Graduation project graded A+`

**Assets**
- Photo: `img/Mahmoud's Photo Gallery/DSC_3777.jpg` (6016 × 4016). Graduation day: Mahmoud in the navy suit with the gold tie and pocket square, laughing among classmates with gold sashes. This is the most joyful image in the gallery. **Full bleed.**
  - **Focus point: his face at x 54%, y 40%.** Place him in the **right** half of the frame: start scale 1.14 with the focus at screen (1240, 470) → end scale 1.22 with the focus at (1260, 460), linear.
  - The photographer's watermark ("M" logo) sits in the **bottom-left corner** (x < 8%, y > 90%). The minimum scale of 1.14, together with this positioning, crops it out. **Check frame 900 and frame 1080 for any trace of it.**
  - The gradient from the left at 0.92 → 0 over 50% of the width.

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 30.00 | **Bar 11** | The photo resolves. The playhead is at **2023**. |
| 30.75 | b2 | The kicker fades up (x 160, y 420). |
| 31.50 | b3 | `Graduated.` fades up. |
| 32.25 | b4 | The marker draws under `Graduated.` (0.75 s). |
| 33.00 | **Bar 12** | The secondary line fades up. |
| 34.50 | b3 | A very soft warm bloom: a `--gold-soft` radial glow, 0 → 0.18 opacity, centred on his face, then back to 0 by 35.6 s. It is subtle: it should be felt, not seen. |
| 35.25 | b4 | The text fades out. |

**Music sync:** this is the verse's resolution. The headline and marker land on beats 3–4 so the scene breathes before the build begins.

**Transition:** a dissolve through black centred on 36.0 s. The build's pulse begins on a clean black frame.

---

### Scene 6 — Service

**Bars 13–14 · 36.00–42.00 s · Build (the soft pulse and cello enter)**

**On-screen copy**
- Kicker: `2024 – 2025`
- Line 1 (lead 44): `Military service, as a systems engineer.`
- Line 2 (34, `--ink-2`), from 39.0 s: `Back-end systems for toll roads serving / over half of Egypt’s vehicles.`
- Line 3 (Ysabeau italic 40, `--ink`), from 40.5 s, replacing line 2: `He kept learning when there was little room to.`

**Assets**
- Photo: `img/Mahmoud's Photo Gallery/IMG_4263 Copy.JPG` (3357 × 2238). Mahmoud stands alone in front of a military gate under palm trees, holding a document: a quiet, dignified frame. Use it as an **inset** on the right: frame **760 × 620 px** at x 1000–1760, y 220–840. Crop focus **x 50%, y 55%** (he stands at the centre). Ken Burns 1.04 → 1.10, slowly moving **toward him**.
  - Grade: the standard grade plus `brightness(0.88)`. The sky is bright, so pull it down with a top gradient of `rgba(11,11,12,0.35)`.
- **Alternative** if Mahmoud prefers a uniform photo: `img/Mahmoud's Photo Gallery/EG ARMY.jpg`. It is only 540 × 960, so it may only be used **at most 320 × 568 px**, never larger.

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 36.00 | **Bar 13** (pulse begins) | The inset frame's border draws as a 1-px `--rule` rectangle (dashoffset, 1.5 s). The photo fades in inside it from 36.75. The playhead slides to **2024**. |
| 36.75 | b2 | The kicker fades up (x 160, y 400). |
| 37.50 | b3 | Line 1 fades up. |
| 39.00 | **Bar 14** | Line 2 fades up beneath line 1. |
| 40.50 | b3 | Line 2 fades out and line 3 fades up in its place. |
| 41.25 | b4 | The text fades out. |

**Music sync:** the pulse is the clock under this scene. Keep the motion minimal and steady; this is the most restrained scene in the film.

**Transition:** a dissolve through black centred on 42.0 s.

---

### Scene 7 — Teaching

**Bars 15–17 · 42.00–51.00 s · Build**

**On-screen copy**
- **Beat A (42.0–45.0)**
  - Kicker: `EINSTEIN MISR · SINCE 2020`
  - Lead: `Arabic lessons in algorithms, discrete maths / and probability.`
- **Beat B (45.0–48.0)**
  - Big numbers side by side: `10,000+` with label `LEARNERS` and `700K+` with label `YOUTUBE VIEWS`
- **Beat C (48.0–51.0)**
  - Kicker: `NATIONAL TELECOMMUNICATION INSTITUTE`
  - Lead: `Machine-learning instructor.`
  - Secondary (`--ink-2`): `300+ hours · 100+ students`

**Assets**
- **A**: `img/Mahmoud's Photo Gallery/teach.png` (1817 × 1078). Mahmoud at a whiteboard, writing a discrete-maths proof ("Prove that f(x) = 2x + 1 is bijective"). The board is very bright, so **do not set text over it**. Present it as a **wide inset** on the **right**: frame 1000 × 593 px at x 760–1760, y 200–793. Crop: the full frame, with the slow pan from the board to him: position x 62% → 40% (focus y 45%) at scale 1.10, linear over 3.75 s. Grade `brightness(0.82)` so the board sits at about `#CFCAC0`, not pure white. Text sits on black on the left (x 160–700).
- **B**: no photo. The teach.png inset dims and blurs to `blur(14px) brightness(0.35)` behind the numbers.
- **C**: `img/Mahmoud's Photo Gallery/IMG_8530.JPG` (3480 × 2610). Mahmoud standing alone in front of the NTI building under the sign "National Telecommunication Institute". **Full bleed**, with the text on the left over the gradient. Ken Burns: start scale 1.25 focused on him (x 52%, y 62%) → end scale 1.08 focused at (52%, 40%), pulling back to reveal the sign at the top. The sign lettering is blue, so use the blue-photo grade (`saturate(0.72)`).

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 42.00 | **Bar 15** | The teach.png inset fades in. The playhead slides to **2025**. |
| 42.75 | b2 | The kicker fades up. |
| 43.50 | b3 | The lead line fades up, word by word. |
| 44.625 | — | The text fades out (finished by 45.0). |
| 45.00 | **Bar 16** | The inset blurs and dims (0.75 s). `10,000+` fades up at (560, 540), **counting up** from 0 to 10,000 over 1.5 s (`--ease`, integers rendered with thousands separators). Its label fades up beneath. |
| 45.75 | b2 | `700K+` fades up at (1260, 540) and counts 0 → 700 over 1.5 s, then adds "K+". |
| 47.25 | b4 | A 1-px gold hairline draws between the two numbers. The numbers fade out from 47.5. |
| 48.00 | **Bar 17** | Cut (by dissolve) to the NTI photo. The kicker fades up at 48.0. |
| 48.75 | b2 | The lead fades up. |
| 49.50 | b3 | The secondary fades up. |
| 50.25 | b4 | The text fades out. |

**Music sync:** the count-ups land on the downbeat of bar 16 and finish on beat 3, riding the cello line. Do not tick or "slot-machine" the digits; they must roll smoothly.

**Transition:** the NTI photo dissolves through black, centred on 51.0 s.

---

### Scene 8 — Building

**Bars 18–20 · 51.00–60.00 s · Build (the end of the build, rising into the climax)**

**On-screen copy**
- Headline (Gloock 72, centred at y 200): `He builds intelligent systems.` (from the site's hero, "I build intelligent systems")
- Project names, one at a time, each next to its node (Chivo Mono 24, `--ink-2`, the newest one `--gold-ink`):
  `AUDIOSHIELD` · `SIMCLR-VISION-SSL` · `SCRAP` · `HORUS-OSINT` · `HORUS SENTINEL` · `RL-CLOUD-AUTOSCALER`
- Closing line (Ysabeau 34, `--ink-2`, centred at y 900), from 57.0 s: `LLMs · Agents · Computer Vision · Reinforcement Learning`

At most 5 headline words + 6 short names + the closing line are on screen at the same time. The headline leaves when the closing line arrives.

**Assets**
- **Gold neural constellation** (SVG, build it): a loose three-layer network, **not** a rigid grid. 18 nodes in total (4 in the input layer, 8 in the hidden layer and 6 in the output layer), spread over x 360–1560, y 330–820 with seeded jitter (±24 px). Edges are 1-px `--gold` at 0.18 opacity. Nodes are 6-px rings. The **6 output nodes** are the six projects, each labelled to its right.
- No photos and no logos.

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 51.00 | **Bar 18** | The headline fades up. The playhead holds at 2025. |
| 51.75 | b2 | The edges draw from left to right in three waves (input → hidden 0.75 s, hidden → output 0.75 s). |
| 52.50 | b3 | Pulses of light (small gold dots with glow) begin to travel along the edges, 4 at a time, seeded and slow (360 px/s). |
| 53.25 | b4 | Output node 1 lights (fill 0 → gold, glow) and `AUDIOSHIELD` fades up. |
| 54.00 | **Bar 19** | Node 2: `SIMCLR-VISION-SSL`. |
| 54.75 | b2 | Node 3: `SCRAP`. |
| 55.50 | b3 | Node 4: `HORUS-OSINT`. |
| 56.25 | b4 | Node 5: `HORUS SENTINEL`. |
| 57.00 | **Bar 20** | Node 6: `RL-CLOUD-AUTOSCALER`. The headline fades out. The closing skills line fades up. |
| 57.75–59.25 | b2–b4 | The whole network brightens (edge opacity 0.18 → 0.45) as the music rises. The camera slowly pushes in from 1.00 to 1.06. |
| 59.25 | b4 | The labels fade out. The network keeps glowing. The playhead on the thread brightens. |
| 59.625–60.0 | — | **Everything except one bright point at the playhead collapses to black** (the network fades out in 0.375 s). The last frame before 60.0 shows only the thread and its glowing node. |

**Music sync:** the six names arrive on six consecutive beats (53.25 → 57.0). This is the one place where the rhythm is felt in the picture, because the build is at its densest. The collapse at 59.625 is a breath before the swell.

**Transition:** the **only hard cut** in the film, on the 60.0-s downbeat. The thread's playhead node is carried across the cut and becomes the starting point of the journey arc (same screen position, 1300 × 1000, then it travels; see Scene 9).

---

### Scene 9 — Egypt to Canada

**Bars 21–23 · 60.00–69.00 s · Climax (the full warm swell)**

**On-screen copy**
- **Part A (60.0–66.0)**
  - Kicker: `SEPTEMBER 2025`
  - Headline (Gloock 72): `From Egypt to Canada.`
  - Label at Kingston (Chivo Mono 24, `--gold-ink`): `KINGSTON, ONTARIO`
- **Part B (66.0–69.0)**
  - Headline (Gloock 72): `Queen’s University`
  - Lead (44): `MSc in Artificial Intelligence`
  - Secondary (Chivo Mono 24, `--gold-ink`): `DIGILIANS PRESIDENTIAL SCHOLARSHIP`

**Assets**
- **Part A: the journey map (build it).** A minimal dotted world map: the land masses of the North Atlantic region as a grid of 2-px dots (dot spacing 14 px), `--gold` at 0.14 opacity. The frame covers about 90° W to 40° E longitude and 15° N to 60° N latitude, centred on the Atlantic. **Egypt** (Assiut) sits right of centre at about x 1440, y 760; **Kingston, Ontario** (about 44.23° N, 76.49° W) sits on the left at about x 420, y 430. Use a real equirectangular projection so both positions are honest.
  - **The arc**: a single gold path (1.5 px, full opacity) from Assiut to Kingston, a gentle great-circle-like curve that lifts above the straight line by about 180 px. A comet head (a 7-px gold dot with a 28-px `--gold-soft` glow and a 120-px fading tail) travels along it.
  - **Maple leaf**: a single-stroke gold line-art maple leaf (a stylised 11-point leaf, 1.25-px stroke, no fill), 90 px tall, drawn beside Kingston.
- **Part B**
  - Photo: `img/Mahmoud's Photo Gallery/queen shirt.jpg` (2048 × 2048). Mahmoud smiling, in glasses and a Queen's University polo (crest visible on the chest). The clearest, most present face in the gallery. **Right half, full height**: a frame of x 900–1920, y 0–1080 with the left edge fading into `--paper` over 260 px. Focus: **face at x 50%, y 27%**, placed at screen (1380, 360). Ken Burns 1.04 → 1.09.
  - **Crop out the sign at the right edge of this photo** (lettering that begins "ANTHRO…", x > 82% of the source). Position the crop so that no part of that sign is ever in frame. Use the blue-photo grade, but keep the crest's red legible (do not desaturate below 0.72).
  - Logo: `img/_web/logos/queens-dark.webp` (320 × 243, the dark-background version, real colours: red and gold crest, red wordmark), displayed at **220 px wide** above the headline (x 160, y 230). It is small at the source, so **never show it larger than 320 px wide**. If a larger logo is needed, use `img/logo_q.png` (768 × 584) but check that its darker red still reads on `#0B0B0C`.

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 60.00 | **Bar 21** (swell) | Hard cut. The thread is gone. The playhead node (at 1300, 1000) rises along a short curve to the Assiut position (1440, 760) over 0.75 s (`--ease`) as the dotted map fades up beneath it (0 → 0.14 over 1.5 s). |
| 60.75 | b2 | **The arc launches.** The comet head travels from Assiut to Kingston over **2.25 s** (`--ease`), and the path draws behind it (dashoffset synced to the head). The kicker fades up (x 160, y 860, lower-left, out of the arc's way). |
| 61.50 | b3 | The headline `From Egypt to Canada.` fades up (x 160, y 920). |
| 63.00 | **Bar 22** | **Arrival**: a ring pulse at Kingston (radius 10 → 60 px, 1.5 s). The maple leaf draws (1.5 s). The `KINGSTON, ONTARIO` label fades up beside it. |
| 63.00–66.0 | — | The camera pushes slowly toward Kingston: scale 1.00 → 1.10, focus moving from the frame centre to Kingston (linear). |
| 65.25 | b4 | The map text fades out. |
| 65.625–66.375 | bar line | A dissolve through black into Part B. |
| 66.00 | **Bar 23** | The Queen's photo fades in on the right. |
| 66.375 | — | The Queen's logo fades in (opacity only, 1.0 s). |
| 66.75 | b2 | `Queen’s University` fades up (x 160, y 520). |
| 67.50 | b3 | `MSc in Artificial Intelligence` fades up (y 600). |
| 68.25 | b4 | `DIGILIANS PRESIDENTIAL SCHOLARSHIP` fades up (y 668), followed by a 1-px gold underline drawn across 300 px. |
| 68.625 | — | The text holds. Scene 10 takes over without the photo leaving (see the transition). |

**Music sync:** the swell's downbeat at 60.0 s is the hardest edit in the film. The arc should **leave** on beat 2 (60.75), so the downbeat itself is just the map appearing — a breath, then the flight. The arrival lands on the next downbeat (63.0).

**Transition:** **no dissolve to black** at 69.0. The photo stays where it is on the right, the left text fades out between 68.625 and 69.0, and the photo dims to 40% brightness from 69.0 to 70.5 while the MinimalLM title builds in the same left column. This continuity keeps the climax feeling like a single movement.

---

### Scene 10 — MinimalLM

**Bars 24–26 · 69.00–78.00 s · Climax (sustained)**

**On-screen copy**
- Kicker: `MSC RESEARCH PROJECT · 2026`
- Display title (Gloock 112, `--gold-ink`): `MinimalLM`
- Question (Ysabeau italic 48), from 70.5 s: `Can a language model say less / and lose nothing a reader needs?` with the marker under **say less**
- After the token visual, from 74.25 s (Ysabeau 34, `--ink-2`): `Training-free. Measured for meaning, latency and energy.`
- From 75.75 s (Ysabeau 34, `--ink`): `He led a four-student team.`

**Assets**
- The Queen's photo, continuing from Scene 9 (still on the right, dimmed to 40%). It fades **out completely by 72.0 s** so the token visual sits on black.
- **The token line (build it).** One illustrative answer written as a row of **token pills**. Each pill is Chivo Mono 26 px `--ink-2` on `--paper-3`, with a 1-px `--rule` border, 3-px radius, 10-px horizontal padding and 8-px gaps, centred at y 560. The sentence (illustrative only; it is not a result from the project):
  `Kingston` `is` `in` `Ontario` `,` `Canada` `.` | `In` `summary` `,` `as` `mentioned` `,` `Kingston` `is` `located` `in` `Ontario` `.`
  That is 19 pills: the first 7 are **the answer** and the remaining 12 are **the redundant tail**. (At these sizes the full row is about 1,500 px wide, so it fits inside the 1,600-px safe width. If it does not, set the pills at 24 px rather than wrapping the row.)
- A thin vertical **gate line**: 1.5-px `--gold`, 120 px tall, with a small Chivo Mono 20 px label `STOP` above it in `--gold-ink`. It sits right after the first full stop.

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 69.00 | **Bar 24** | The previous text is gone. The kicker fades up (x 160, y 400). |
| 69.75 | b2 | `MinimalLM` reveals letter by letter (40 ms per letter, 0.75 s each fade), then a foil **light sweep** passes across it (70.875 → 72.0, opacity 0.45). |
| 70.50 | b3 | The question fades up beneath (y 600). |
| 71.25 | b4 | The marker draws under **say less**. |
| 71.625 | — | The question and title fade out. The photo finishes fading out by 72.0. |
| 72.00 | **Bar 25** | The token pills appear **one every 0.075 s** (about 2 frames) from left to right (opacity + `translateY(10px) → 0`, 0.3 s each), as if being generated. All 19 are shown by 73.4 s. |
| 72.75 | b2 | (While the pills are still appearing) the gate line drops in after the 7th pill (opacity 0 → 1, `translateY(-20px) → 0`), together with its `STOP` label. |
| 73.50 | b3 | **The tail falls away**: the 12 pills after the gate dim to 0.12 opacity and drift 12 px down, one after another (40 ms stagger). The 7 answer pills brighten to `--ink`, and their borders turn `--gold` at 0.6. The row recentres smoothly on the 7 remaining pills (0.75 s). |
| 74.25 | b4 | The "Training-free…" line fades up beneath (y 700). |
| 75.00 | **Bar 26** | Hold. |
| 75.75 | b2 | The "Training-free…" line is replaced by `He led a four-student team.` |
| 77.25 | b4 | Everything fades out (0.5 s). |
| 77.625–78.375 | bar line | A dissolve through black into the outro. |

**Music sync:** the climax's peak is the moment the tail falls away (73.5 s, beat 3 of bar 25): the swell resolves into a held chord, and the picture empties. Less on screen becomes the visual statement.

**Accuracy notes for the builder**
- The pills are **an illustration of the idea**, not a reported result. **Do not add any percentage, token count, "x% shorter", speed-up figure or chart.**
- The gate line labelled `STOP` matches what the biography says the processor mostly did in practice ("ending answers earlier", "a stop controller"). Do not label it "AI" or anything else.
- **Never mention any other project name, paper or evaluation from the master's year.** Only **MinimalLM**.

**Transition:** a dissolve through black centred on 78.0 s.

---

### Scene 11 — A Purpose

**Bars 27–30 · 78.00–90.00 s · Outro (the music resolves and fades)**

**The idea.** The film ends where it began: **the same hero portrait, in the same place, lit by the same gold rim** (§1.8). In the opening he was introduced. Now, after the journey, he returns, and his name, his site and his signature gather beside him. The portrait arrives on bar 28 with the closing statement and stays to the very last fade, so **the final image of the film is his face**.

**On-screen copy**
- **Part A (78.0–81.0)**, centred on black, Gloock 72, three beats: `He learns.` `He builds.` `He teaches.`
- **Part B (81.0–84.0)**, left column, Gloock 72: `Let’s give intelligence / a purpose.` with the marker under **a purpose**. The portrait is on the right.
- **Part C (84.0–90.0)**: the end card, in the left column, with the portrait still on the right.
  - The emblem
  - The wordmark `Mahmoud Alyosify` (the lettering)
  - Chivo Mono 28, `--gold-ink`: `mahmoudalyosifysite.github.io`
  - Chivo Mono 24, `--ink-2`, two lines: `mahmoud.alyosify@gmail.com` / `linkedin.com/in/mahmoudalyosify`
  - Small (Ysabeau 26 italic, `--ink-3`), next to the mascot: `Ask Mahmoud AI on the site.` This is the one place where 26 px is allowed.

**Layout of the final frame (1920 × 1080).** The left column is x 160–820 with its centre line at **x 490**; the right is the portrait.

| Element | Position | Size |
|---|---|---|
| Hero portrait (§1.8 recipe) | centre x **1400**, bottom-anchored (y 80–1080) | 1000 × 1000 |
| Signature watermark | centred at (960, 560), behind everything, including the portrait | 1500 px wide, opacity 0.10 |
| Emblem | centred at (490, 250) | 170 px wide |
| Wordmark | centred at (490, 450) | 600 px wide |
| Gold hairline | centred at (490, 545) | 1 px × 220 px, `--gold` |
| URL | centred at x 490, baseline y 610 | Chivo Mono 28 |
| Email / LinkedIn | centred at x 490, baselines y 660 and 700 | Chivo Mono 24 |
| Mascot + line | mascot centred at (330, 880), line left-aligned at x 410, baseline y 895 | mascot 140 px tall |

**Assets**
- **Hero portrait**: `img/img-mahmoud- april 2026.PNG`, the full §1.8 recipe (on black, no box, bottom melt, back glow, gold rim light). It must be **pixel-for-pixel in the same place and size as in Scene 1** (centre x 1400, 1000 px tall, bottom-anchored), so the bookend is felt.
- Emblem: `linkedin-cover/emblem.png`, 170 px wide (see the layout table).
- Signature: `linkedin-cover/signature.svg` (viewBox `259 52 1987 684`, a single **filled** path in `#C9A55E`). It is a watermark **behind** the whole end card, including behind the portrait: 1500 px wide, centred at (960, 560), **opacity 0.10**. It is a filled outline, not a stroke, so `stroke-dashoffset` will not draw it. Reveal it with a **mask wipe**: a 120-px feathered vertical edge moving left → right over 2.25 s, matching the direction of writing.
- Wordmark: the business-card symbol (see §1.3), **600 px wide**.
- Mascot: `img/Mahmoud Bot.png` (1024 × 1536, transparent, **real colours**, never recoloured). It is the site's assistant, "Mahmoud AI". **140 px tall**, opacity 0.92, at the bottom of the left column. It is the only non-gold, non-portrait colour on the end card, so keep it small and still. If it pulls focus from the portrait in review, remove it and its line together; nothing else changes.

**Choreography**
| t (s) | Beat | Action |
|---|---|---|
| 78.00 | **Bar 27** | Black. |
| 78.75 | b2 | `He learns.` fades up (centred, x 560). |
| 79.50 | b3 | `He builds.` fades up (x 960). |
| 80.25 | b4 | `He teaches.` fades up (x 1360). |
| 80.625 | — | The three fade out together (finished by 81.0). |
| 81.00 | **Bar 28** | **The portrait returns**: opacity 0 → 1 and `brightness(0.4) → 0.98` over 2.25 s on the right, exactly as in Scene 1. `Let’s give intelligence` fades up in the left column (x 160, y 470). |
| 81.75 | b2 | **The rim light ignites** (0 → full over 2.25 s, finishing on the downbeat of bar 29). `a purpose.` fades up on the second line (y 550). |
| 82.50 | b3 | The marker draws under **a purpose** (0.75 s). |
| 83.25 | b4 | The statement fades out. The portrait stays and breathes (1.00 → 1.03, linear, to the end of the film). |
| 84.00 | **Bar 29** | The signature watermark starts its mask wipe (84.0 → 86.25). The emblem fades in (opacity and `blur(6px) → 0`, 1.5 s). |
| 84.75 | b2 | The wordmark reveals by its mask wipe (1.5 s). The hairline draws from its centre outward. |
| 85.50 | b3 | The URL fades up. |
| 86.25 | b4 | The email and LinkedIn lines fade up. A final, slow foil sweep crosses the emblem (86.25 → 87.75, opacity 0.4), and **at the same time a single, very soft brightening of the portrait's rim** (rim glow +30% for 1.5 s, then back): one shared breath of light. |
| 87.00 | **Bar 30** | The mascot and its line fade in (1.0 s, no motion other than a 10-px upward drift over 2 s). |
| 88.25 | — | **Fade to black, in order**: the left-column text, emblem and mascot fade first (88.25 → 89.0); **the portrait and its rim fade last** (88.5 → 89.5, `--ease-soft`), so the last thing to leave the screen is his face. The dust fades with the portrait. |
| 89.50–90.00 | — | Pure `--paper`, grain still on for the last 15 frames. Frame 2699 is the last. |

**Music sync:** the three "He…" lines sit on beats 2–4 of the resolving phrase. The portrait returns on the downbeat of bar 28, with the closing statement, and its rim reaches full light on the downbeat of bar 29 as the end card begins. The end card is fully built by the time the last chord rings (bar 30). The fade to black should finish with the music's tail. If the composer's last note decays later, keep the picture black and do not extend the end card.

**Transition:** fade to black. No credits.

---

## 3. Facts used (each with its source file)

Every fact on screen comes from the site's own files. The builder can check each one against the file named. Where sources disagree, the copy uses the wording that all of them support.

| # | Fact as used on screen | Scene | Source file (and location) |
|---|---|---|---|
| 1 | Name "Mahmoud Alyosify"; alias "Mahmoud Sayed Youssef" | 1 | `js/data.js` (`person.name`, `aliasAr`); `biography/index.html` ("Names"); business-card `id__alias` in `business-card/index.html` |
| 2 | "AI engineer · researcher · educator" | 1 | `biography/index.html` lead ("an Egyptian artificial-intelligence engineer, researcher and educator") |
| 3 | Born in 2000 in El Fath City, Assiut Governorate, Upper Egypt | 2 | `biography/index.html` ("Early life", infobox "Born 23 November 2000") |
| 4 | His physics teachers called him "Egypt's Einstein" (أينشتاين مصر) | 2 | `biography/index.html` ("Early life") |
| 5 | Assiut University, Faculty of Computers and Information, 2019–2023 | 3 | `biography/index.html` ("Assiut University": Sept 2019 to July 2023); `cv.md` (Education) |
| 6 | B.Sc. Computer & Information Science (Bioinformatics) | 3 | `cv.md`; `js/data.js` (`about.facts`) |
| 7 | 1st Place, Smart Cities Hackathon 2022 | 4 | `js/data.js` (`achievements`); `cv.md`; `biography/index.html` ("Vitalism Solution"); photo `IMG_0578.JPG` shows the "First Winner · Smart Hospital" cheque |
| 8 | Ideal Student 2022–2023 | 4 | `js/data.js` (`achievements`); `cv.md`; `biography/index.html` ("Student leadership"); photo `IMG_2921.jpg` shows the certificate |
| 9 | Vitalism Solution, Microsoft Imagine Cup 2023 semi-finalist | 4 | `js/data.js` (`projects`, `achievements`); `cv.md` |
| 10 | Graduated July 2023; GPA 3.53 / 4.00 | 5 | `biography/index.html` ("Assiut University"); `cv.md`; `js/data.js` |
| 11 | Graduation project graded A+ | 5 | `cv.md`; `js/data.js` (`projects` → Vitalism Solution) |
| 12 | Military service Feb 2024 – Mar 2025, systems engineer | 6 | `js/data.js` (`experience`); `cv.md`; `biography/index.html` ("Military service") |
| 13 | Back-end systems for toll roads serving over half of Egypt's vehicles | 6 | `js/data.js` (`experience`: "national toll infrastructure serving 50%+ of Egyptian vehicles"); `biography/index.html` |
| 14 | "He kept learning when there was little room to." | 6 | `biography/index.html` ("Military service": "to keep learning on his own when circumstances left little room for it") |
| 15 | Einstein Misr, teaching since 2020; Arabic lessons in algorithms, discrete maths and probability | 7 | `js/data.js` (`experience` "2020 — Present", `teaching`); `biography/index.html` ("Einstein Misr") |
| 16 | 10,000+ learners; 700K+ YouTube views | 7 | `js/data.js` (`stats`, `teaching`); `cv.md`; `biography/index.html` |
| 17 | Machine-learning instructor at the National Telecommunication Institute (NTI); 300+ hours to 100+ students | 7 | `biography/index.html` ("National Telecommunication Institute"); `ar/index.html` (lines ~94–97, the same figures); `js/data.js` (`experience`) |
| 18 | "He builds intelligent systems." | 8 | `index.html` hero ("I build intelligent systems") |
| 19 | Project names: AudioShield, SimCLR-Vision-SSL, SCRAP, Horus-OSINT, HORUS Sentinel, RL-Cloud-Autoscaler | 8 | `js/data.js` (`projects`); `cv.md`; `biography/index.html` ("Projects") |
| 20 | LLMs · Agents · Computer Vision · Reinforcement Learning | 8 | `biography/index.html` lead ("large language models … AI agents, computer vision and reinforcement learning") |
| 21 | Began the MSc in September 2025 | 9 | `biography/index.html` ("Queen's University"); `ar/index.html` |
| 22 | Kingston, Ontario, Canada | 9 | `biography/index.html` ("Queen's University in Kingston, Ontario") |
| 23 | MSc in Artificial Intelligence, Queen's University | 9 | `js/data.js`; `cv.md`; `biography/index.html` |
| 24 | Digilians Presidential Scholarship | 9 | `cv.md`; `js/data.js` (`about.body`); `biography/index.html` |
| 25 | MinimalLM, his master's research project, 2026 | 10 | `biography/index.html` ("MinimalLM", "CISC 898, 2026"); `ar/index.html` |
| 26 | "Can a language model say less and lose nothing a reader needs?" | 10 | `biography/index.html` ("asked whether a model can be made to say less at inference time … while losing none of the content a reader needs") |
| 27 | Training-free; measured for meaning, latency and energy | 10 | `biography/index.html` ("training-free logits processor", "'no loss of meaning' as a statistical non-inferiority hypothesis and also measured latency and GPU energy") |
| 28 | The processor's effect came mainly from ending answers earlier (the `STOP` gate in the visual) | 10 | `biography/index.html` ("its savings turned out to come mainly from ending answers earlier: in effect, it behaved as a stop controller") |
| 29 | He led a four-student team | 10 | `biography/index.html` ("Alyosify led the four-student team"); `data/mahmoud-profile.json` ("MinimalLM research details") |
| 30 | "He learns. He builds. He teaches." | 11 | `biography/index.html` ("Teaching": "he learns, he builds, he teaches") |
| 31 | "Let's give intelligence a purpose." | 11 | `index.html` (contact section and footer); `business-card/index.html` (card back) |
| 32 | mahmoudalyosifysite.github.io · mahmoud.alyosify@gmail.com · linkedin.com/in/mahmoudalyosify | 11 | `js/data.js` (`person.email`, `links`); `cv.md` (Contact) |
| 33 | "Mahmoud AI" is the assistant on his site | 11 | `biography/index.html` ("Names": "it is the conversational assistant on his website"); `index.html` ("Ask Mahmoud AI") |

**Source disagreements the builder should know about**
- **The name of the master's project.** `js/data.js`, `cv.md` and `data/mahmoud-profile.json` still title it "Verbosity-Aware Decoding for Token-Efficient Language Model Inference". `biography/index.html`, `ar/index.html` and the latest CVs (commit `da93b00`, "MinimalLM research framing") call it **MinimalLM**. Following Mahmoud's rule, **the film uses "MinimalLM" only** and never shows the long title.
- **Is the MSc finished?** `js/data.js` and `cv.md` say "completing … Expected 2026". `biography/index.html` (reviewed 29 September 2026) says "He completed the degree in 2026". The film says only **"MSc in Artificial Intelligence"**, which is true either way. Do not add "graduated" or "completed" for Queen's unless Mahmoud confirms.
- **NTI teaching scope.** `cv.md` and `js/data.js` mention the first 90-hour programme only. The biography and Arabic page add "more than 300 hours … to more than 100 students" across the Al-Arish, Assiut and Minya branches. The film uses the biography's totals.

**Deliberately left out:** ELIDE and anything about a paper or human evaluation (Mahmoud's rule); the "Data Analysis with Python" certificate (not his); any percentage or numeric result from MinimalLM (the biography states that the results are unpublished); certificates in general (too list-like for a film); the Fortinet, Huawei and AWS badges; and his birth date to the day.

---

## 4. Notes for the builder

### 4.1 Where this could easily look cheap, and how to avoid it

1. **Gold everywhere.** If gold fills text, backgrounds and frames, the film looks like a wedding invitation. Gold is lines, one key phrase and light. Body copy is `--ink`. If in doubt, take the gold out.
2. **Metallic-gold effects.** No bevel, emboss, chrome, lens flares or "3D gold" text. The single foil light sweep is the only metal treatment, and it appears only four times in the film (the emblem twice, the wordmark, "MinimalLM").
3. **Slideshow rhythm.** Do not give every photo the same zoom and the same 6-s hold. The film alternates full-bleed photos (3, 5, 7C, 9B), insets (4, 6, 7A) and pure line-art scenes (2, 8, 9A, 10). Keep that alternation.
4. **Ken Burns that is too fast.** More than 12% scale in a shot looks like a cheap template. Keep the moves linear, slow and toward the face.
5. **Bouncy or springy motion.** Any overshoot instantly reads as an "intro template". Use only the two site curves.
6. **Blue creeping in.** The site's dark theme has no blue design elements. Watch out for: the blue circuit backdrop in `IMG_2921.jpg`, the blue NTI sign in `IMG_8530.JPG`, the Queen's polo, and the mascot. Grade the photos as specified. The navy suit in the hero portrait is the exception: it is his real clothing and is **never** graded, tinted or recoloured (§1.8). **Never** add a blue glow, a navy panel or a "tech blue" gradient, and **never** use any token from `css/modern.css`.
7. **Recoloured logos.** The Queen's and Assiut logos and the mascot stay in their real colours. Do not run them through the site's `--emblem-filter` duotone.
8. **Pure black and pure white.** The background is `#0B0B0C`, not `#000`; the text is `#EEEAE2`, not `#FFF`. Pure white text on near-black flickers in compression.
9. **Low-resolution sources upscaled.** Maximum display sizes: `EG ARMY.jpg` ≤ 320 × 568, `queens-dark.webp` ≤ 320 px wide, `assiut-dark.webp` ≤ 240 px wide, `img/_web/portrait.webp` (900 px) **must not be used** at full height (use the 2048-px `img-mahmoud- april 2026.PNG` instead), and `IMG_1412.JPG` and `IMG_7735.JPG` (1024 px) are not used.
10. **Too many words.** Never more than about 12 words in the frame at once. If a line does not fit the measure, shorten it with Mahmoud's approval rather than shrinking the type.
11. **Dense count-ups.** The number roll in Scene 7 must be smooth and eased, with no flicker of random digits.
12. **A busy end card.** The end card has five elements. Do not add social icons, QR codes, phone numbers or a "Subscribe" button.
13. **Grain that crawls.** Grain must be fine and low (3.5%). If it is visible at a glance on a still frame, it is too strong.
14. **The hero portrait looking like a sticker.** A cutout on black looks cheap when (a) the rim is a hard yellow outline, (b) the glow is so wide that it becomes a halo, (c) the bottom of the image ends in a visible straight line, or (d) it sits in a box or circle. Follow §1.8 exactly: a 1-px warm edge, a soft glow that is barely there, the bottom melt, and no container. Judge it at 100% on a calibrated screen and on a phone: on the phone, the rim should be felt more than seen.
15. **Compression banding.** Large `--paper` areas with gradients band in H.264. Render to a high-bitrate master (ProRes 422 HQ or PNG frames), add the grain **before** encoding (it dithers the gradients), and encode the delivery file at 1080p30, H.264 High, CRF ≤ 16 or ≥ 20 Mbps, `yuv420p`, BT.709 colour tags.

### 4.2 Photo hygiene

- **`queen shirt.jpg`**: a sign is visible at the **right edge** with lettering that begins "ANTHRO…". **It must never be in frame** (the film carries no AI-tool attribution of any kind). Keep the crop well left of x = 82% of the source.
- **`DSC_3777.jpg`**: a photographer's watermark ("M") sits in the bottom-left. It must be cropped out at every frame of the move.
- **Third parties.** Several photos include classmates and officials. They appear only as part of group moments, and **no other person's name is shown**. Do not use `IMG_5377.JPG` (it shows a child and phone numbers on a banner), `IMG_1290.png` (another person's face on a poster), `Start.png` and `img/about.png` (composite collages with a cartoon), `Vitalism Solution’s Team.png` (a bright blue graphic band), or `mAHMOUD&un.png` (a collage, with context unclear in the site files).
- **EXIF orientation.** Some gallery JPGs are phone photos. Read them with EXIF orientation applied (or use the already-oriented versions in `img/_web/gallery/*.webp`, which are lighter but lower resolution: check that any WebP used is at least the display size).
- **Paths with spaces and apostrophes.** `img/Mahmoud's Photo Gallery/` and `img/img-mahmoud- april 2026.PNG` contain spaces and an apostrophe (note the space straight after the hyphen in `img-mahmoud- april`, and the uppercase `.PNG`). URL-encode them in HTML (`Mahmoud's%20Photo%20Gallery`, `img-mahmoud-%20april%202026.PNG`), and the curly apostrophe in `Vitalism Solution’s Team.png` is U+2019 (that file is not used).

### 4.3 Assets that must be built (no generator; draw them as SVG)

| Asset | Scene | Spec |
|---|---|---|
| Egypt outline, the Nile and an Assiut node | 2 | Real geography, simplified to about 120 points; 1.25 / 1.5-px gold strokes; no fill |
| Three-panel triptych frames | 4 | 520 × 640 insets, `--paper-2` mats, 3-px radius |
| Neural constellation (18 nodes) | 8 | Seeded jitter; edges at 0.18 → 0.45 opacity; travelling light pulses |
| Dotted Atlantic map, arc and comet | 9 | Equirectangular; 2-px dots on a 14-px grid at 0.14 opacity; 1.5-px arc |
| Maple leaf | 9 | A single continuous stroke, 11 points, 90 px tall |
| Token pills and STOP gate | 10 | Chivo Mono 26 px, `--paper-3`, 3-px radius |
| The marker stroke | 2, 5, 10, 11 | Reuse the exact path from `css/theme.css` `--marker` (viewBox `0 0 400 40`) |
| Foil light sweep | 1, 10, 11 | The ink-theme foil stops, masked to the target's alpha, `screen` blend |

**Do not draw the Kingston skyline, Queen's buildings or the Pyramids.** A recognisable landmark that is drawn inaccurately looks cheap, and none is needed: the map, the arc and one maple leaf say "Canada" calmly.

### 4.4 Timing checklist

- Scene starts are at 0, 12, 18, 24, 30, 36, 42, 51, 60, 69 and 78 s, and every one is a multiple of 3.0.
- Every text beat listed is a multiple of 0.75 s (the fades that finish before a cut, such as 11.625, are the only exceptions, and they are timed so that each fade ends at a beat or bar line).
- Check at frames **0, 360, 900, 1800, 2070, 2340 and 2699** (0, 12, 30, 60, 69, 78 and 89.97 s) that the picture matches the table, and scrub around 60.0 s (frame 1800) to confirm that the hard cut lands exactly on the downbeat with the audio.

### 4.5 Hard rules (repeat)

- **MinimalLM is the only master's project named.** No ELIDE, no paper and no "human evaluation".
- Black and gold only. No navy or blue design elements. Logos and the mascot in their real colours.
- Nothing from the "Data Analysis with Python" certificate.
- Only the facts in §3. No invented awards, numbers or dates.
- No Claude, Anthropic or AI-tool credit anywhere: not in the film, its metadata, its file name or the end card.

---

## 5. Revision 2 — photos Mahmoud added (18 Oct 2026)

Timing and music are unchanged; these photos were added at his request.

| Scene | Time | Change | Asset (`intro-video/film/assets/`) |
|---|---|---|---|
| 2 Origins | 12.0–18.0 | Kicker "Born 23 November 2000" (biography infobox). The map zooms into Assiut at 14.25 and opens onto three framed photos, in order: him as a toddler (no age on screen, at his request), his nursery-school photo (both with a faded "family print" grade), and on horseback among the palms. | `toddler.jpg`, `childhood.jpg`, `horse.jpg` (corner AI mark cropped out) |
| 3 Assiut University | 21.0–24.0 | The class photo gives way to three framed photos from his university years: at FCI, a studio portrait (light-blue sweater), and the Nile trip in Luxor (2020). | `student.jpg`, `youth.jpg`, `luxor.jpg` |
| 8 Building | 51.0–54.0 | "He builds / intelligent systems." beside the computer-lab photo; the network follows, names every 0.6 s from 55.0. | `lab.jpg` |
| 9B Queen's | 66.0–69.75 | Replaces the polo photo: the selfie at the Queen's University sign in the snow (January 2026). | `queens-snow.jpg` |
| 10 MinimalLM | 69.4–72.0 | An inset of the School of Computing banner beside the title. Cropped to the banner's title and his face; the garbled lower banner text and the corner AI mark are outside the crop. | `computing.jpg` |
| 11 A Purpose | 78.0–81.5 | "He learns. / He builds. / He teaches." stacked left, beside him in traditional dress under gold lights; the photo dissolves into the hero portrait in the same place at 81.0. | `heritage.jpg` |
| 6 Service | 36.0–42.0 | A diptych: in a suit between two officers in front of an armoured vehicle (his folder dates it 2022; shown for confidence, uncaptioned), then the existing gate photo. The single-inset frame draw was removed. | `officers.jpg`, `service.jpg` |
| 7 Teaching | 42.4–44.6 | The Einstein Misr channel logo, real colours, 150 px, above the kicker. | `einstein-misr.png` |
| 7 Teaching | 47.6–51.4 | The NTI beat becomes "From trainee / to machine-learning / instructor.": his photo at Microsoft, Smart Village, taken during the NTI training (his account; the site lists NTI's AI in Cybersecurity, 420 hrs), the original photo (IMG_4883), beside an inset of the NTI building photo. | `microsoft.jpg`, `nti.jpg` |
| 10 MinimalLM | 72.0–77.9 | Tokens tightened (pills every 0.06 s, both lines stacked from 73.6, out by 75.4). New beat 75.3–77.9: “As for the future, your task is not to foresee it, but to enable it.” — Antoine de Saint-Exupéry (Citadelle), beside him in a black suit by a jet model. The banner text is cropped out and the place is never named, at his request. | `vision.jpg` |
| 4 First Wins | 24.0–30.0 | Four panels (380 × 560) instead of three; first the Student Union photo with the flag of Egypt, caption "STUDENT UNION · Scientific Committee Secretary" (cv.md: Secretary, Higher Scientific & Technological Committee, Student Union). Panels every 1.1 s. | `union.jpg` |
