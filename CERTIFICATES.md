# Certificates — how the system works

The certificate section is **file-driven**. You never edit HTML or JavaScript to
add, remove or rename a certificate.

## Adding a certificate or a photo — the one command

```bash
npm run build
```

That runs three steps in order: optimise images → rebuild the certificate
manifest → rebuild the photo-gallery manifest. Run it after adding **any**
image or PDF, then commit and push.

## Adding a certificate

1. Drop the file into the right folder:

   ```
   Certificates/
   ├── Coursera/                 → Coursera courses & specialisations
   ├── Competitions/             → hackathons, awards, competition certificates
   ├── Activities-Volunteering/  → volunteering, leadership, student activities
   ├── Technical-Courses/        → training from anywhere that isn't Coursera
   └── Other/                    → everything else
   ```

2. Regenerate the manifest:

   ```bash
   node tools/build-certificates.mjs
   ```

3. Commit and push. Done.

Supported formats: `.png` `.jpg` `.jpeg` `.webp` `.gif` `.avif` `.pdf`

## Certificate names

**The filename is the title.** Name the file exactly what you want shown:

| File on disk                          | Shown on the site                    |
|---------------------------------------|--------------------------------------|
| `Machine Learning Specialization.pdf` | Machine Learning Specialization      |
| `Advanced Learning Algorithms.pdf`    | Advanced Learning Algorithms         |
| `IMG_4014.JPG`                        | IMG 4014  ← rename this one          |

Rename a file → re-run the script → the title updates. No code change.

### When the filename can't be the title

`tools/certificate-titles.json` holds optional overrides keyed by
`Category/filename`:

```json
"Coursera/Sequence Models!.pdf": {
  "title":  "Sequence Models",
  "issuer": "DeepLearning.AI · Coursera",
  "year":   "2024",
  "verify": "https://coursera.org/verify/XXXXXXXX",
  "course": "https://www.coursera.org/learn/nlp-sequence-models"
}
```

Every field is optional. Delete an entry once the filename says it all.

### Files still carrying camera names

These 21 files show a cleaned filename because they haven't been renamed yet.
The build script lists them each run. Renaming them is the whole fix:

```
Activities-Volunteering/  IMG_1602, IMG_3993, IMG_3994, IMG_3995, IMG_5413,
                          IMG_9390, Screenshot 2025-02-13 023245
Competitions/             IMG_0598, IMG_0600, IMG_2648, IMG_7887
Technical-Courses/        IMG_0340, IMG_0342, IMG_3992, IMG_6131,
                          Annotation 2020-07-04…, Annotation 2020-07-25…,
                          Screenshot 2025-06-10 155852, Screenshot 2025-06-24 102044,
                          iti 1 … iti 5
Other/                    IMG_4014, IMG_4015, IMG_4832, IMG_4833
```

They currently fall back to titles in `certificate-titles.json`. Once you rename
the files properly you can delete those override entries.

## Coursera course links

Coursera certificates get a **View course** button.

- If `certificate-titles.json` has a `course` URL for that file, it is used.
- Otherwise the button opens an **official Coursera search for the exact
  course title** — `coursera.org/search?query=…`.

The fallback is deliberate: a search URL can never point at the *wrong* course,
whereas a guessed course slug can. Eight slugs were checked and confirmed to
resolve (Machine Learning Specialization, Advanced Learning Algorithms,
Convolutional Neural Networks, Improving Deep Neural Networks, Structuring ML
Projects, Sequence Models, Mathematics for ML: Linear Algebra, What is Data
Science?) and are pinned in the overrides file. To pin more, paste the exact
course URL into the `course` field.

## What the visitor sees

Five category cards → click one → an **in-page gallery** opens. The visitor is
never navigated away from the portfolio.

The gallery has: previous / next, a thumbnail strip, a close button, keyboard
control (`←` `→` `Home` `End` `Esc`), swipe on touch, and an **Open** button for
the original file.

**Images** render contained (never cropped) so the whole certificate is readable.
**PDFs** embed in a viewer on desktop; on phones — where browsers routinely
refuse to render PDFs in a frame — they show a card with an *Open PDF* button
instead of a broken grey box.

## Performance

- Thumbnails and gallery images are lazy-loaded.
- Only the visible certificate is rendered; neighbours are prefetched.
- Closing the gallery tears down the iframe / large image.
- Reveal animations use one shared `IntersectionObserver`, no scroll handlers.
