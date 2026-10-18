# Samridhi & Piyush — A cinematic engagement invitation

**28 November 2026 · The Cove, Sector 5, Panchkula**

This revision replaces the conventional scrolling page with a full-viewport, animated invitation inspired by the two reference clips.

## The experience

1. A tall, embossed-paper envelope fills the screen. A burgundy wax seal carries the couple's monogram, and a moving sheen catches the raised ornament.
2. Tapping the seal lifts it and opens four separate paper faces. Warm light leaks through the seams, then expands into gold rays, particles, and a luminous reveal.
3. Animated champagne silk fills the opening, ripples, and parts from the center.
4. The couple's names reveal over a moving, photographic palace setting with crystal chandeliers, glimmering dust, and falling petals.
5. Native scrolling moves between five overlapping invitation scenes in the same pinned viewport: the couple, their families, the engagement date, the venue, and the closing invitation/countdown. The film's framing moves with the scroll. Dots and the next arrow also navigate the scenes.

The palace backdrop uses locally hosted, looping MP4 films made from a licensed photograph. It is a cinematic photographic treatment, **not a live 3D model**. The silk, particles, and petals are animated with Canvas 2D, and the paper opening uses CSS transforms, light layers, and masks. This keeps the experience available on phones and computers without requiring WebGL or a powerful graphics card.

The opening lasts about 10 seconds. **Skip opening** bypasses it. **Experience it again** at the end replays the entire sequence. Music is optional and off by default.

For an explicitly animated preview regardless of the computer's reduced-motion setting, open `index.html?motion=on` through the local server, or use the **Motion on** control. `?motion=off` explicitly requests the quiet version. Without either parameter, the guest's device preference is honored.

## Preview

Open `index.html` directly. For an HTTP preview:

```powershell
python -m http.server 8092
```

Visit `http://localhost:8092/`. Stop the server with Ctrl+C. The preview URL is local to your computer, not a link to send guests.

## Publish on GitHub Pages

1. Create a GitHub repository. Confirm the families are comfortable publishing their names and event details publicly.
2. Upload this folder's contents to the repository root, including `index.html`, `cinematic.css`, `cinematic.js`, `cinema-film.js`, `credits.html`, `engagement.ics`, `.nojekyll`, and the **entire `assets` folder**.
3. Go to **Settings → Pages → Deploy from a branch**. Select your branch and **/ (root)**, then save.
4. Share the website URL shown by GitHub Pages after deployment completes.

No build, dependency installation, API key, backend, CDN, or third-party runtime request is needed. All paths are relative and work under a GitHub repository subpath. Keep the credit page and media-license attribution when publishing.

The older `invitation.css` and `invitation.js` are not referenced by the new `index.html`; the current files have distinct filenames and versioned URLs so they do not reuse the old experience from the browser cache.

## Event details

- **Bride:** Samridhi Sharma, daughter of Rajneesh Sharma & Poonam Sharma.
- **Groom:** Piyush Kaushik, son of Satish Kaushik & Urmila Kaushik.
- **Date:** Saturday, 28 November 2026.
- **Venue:** The Cove, Sector 5, Panchkula, Haryana, India.
- **Directions:** The exact Google Maps link supplied by the families.

No ceremony time was supplied. The page explicitly says the families will share it. The calendar download is an all-day event, with 29 November as its exclusive end date. The countdown is to the start of 28 November in India Standard Time, not to an invented ceremony hour. It becomes an engagement-day message on the date and a thank-you afterward.

Personalize the envelope using `?to=Ananya%20%26%20Family` after the live URL. This is a greeting, not private access control. Sharing removes the greeting and any section hash.

## Accessibility and playback

- Native touch/keyboard scrolling, chapter buttons, a skip link, visible focus indicators, and an accessible calendar download.
- Inactive scenes are inert and excluded from the accessibility tree.
- Device reduced-motion preferences are honored: the opening is skipped, the film pauses, and the particles and decorative animations stop. A visible **Motion off / Motion on** button lets the guest explicitly choose.
- Background animation and music pause when the browser tab is hidden.
- Without JavaScript, the envelope is omitted and the complete invitation remains readable in ordinary document flow.
- Printing displays all scenes as a readable document, rather than printing a single pinned frame.
- If a browser blocks the silent film, its local poster remains visible and a playback notice is shown. The invitation details and actions remain usable.

## Artwork and media permissions

The palace photograph is **“Palácio Queluz interior 1.JPG” by Husond**, from Wikimedia Commons, under **CC BY-SA 3.0**. The resized poster and color-graded, cropped camera-loop films are adaptations under the same license. Source, attribution, modification details, and license links are on the linked `credits.html` page.

The palace is a decorative setting, **not The Cove**. The reference videos are not redistributed or embedded, and none of their footage, names, or music appears in this site.

The paper ornament, wax seal, light effects, silk, particles, and music-box pattern are original invitation elements. Fonts are self-hosted under the SIL Open Font Licenses included in `assets/fonts/`.

## Editing

`index.html` contains the invitation text. `cinematic.css` controls the envelope, lighting, typography, and scene layout. `cinematic.js` controls the opening timeline, scrolling, calendar-related copy, countdown, sharing, motion preference, and music. `cinema-film.js` animates the silk and particles and plays the appropriate portrait or landscape film.

If the date or venue changes, update the HTML, the date constants in `cinematic.js`, and `engagement.ics`. If changing a published file, increment its `v=` query in `index.html` to avoid stale caches.
