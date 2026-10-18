# Piyush & Samridhi — Engagement invitation

A mobile-first, cinematic invitation for 28 November 2026 at The Cove, Sector 5, Panchkula. No build step, framework, account, or backend is required.

## The new experience

This is **not a stack of scrolling page sections**. After the green envelope opens, a dark, full-screen garden stays in place while native scrolling moves four overlapping chapters through it: the couple, the families, the celebration, and a closing invitation. Typography travels through the viewport, chapters crossfade, the background changes depth, and the gold halos turn with your scrolling. Chapter dots and next buttons provide a second way to navigate.

The gold petals, interlocking rings, foliage, heart, and video control animate even while scrolling is idle. The header has an explicit **Motion on / Motion off** switch. Device reduced-motion settings are honored by default, with an on-screen explanation; guests can explicitly enable the animated experience using that switch.

## Preview

Open `index.html` directly, or run `python -m http.server 8080` from this folder and visit `http://localhost:8080`. A local preview cannot be shared with guests; publish the folder first.

## Publish on GitHub Pages

1. Create a GitHub repository. Remember that a public repository exposes the invitation, family names, and video publicly.
2. Upload **the contents of this folder** to the repository root: `index.html`, `experience.css`, `experience.js`, `.nojekyll`, and the entire `assets` folder. Do not upload only the HTML or place everything inside a second `web-invite` folder. The previous `styles.css` and `script.js` have been replaced.
3. In the repository, select **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select your uploaded branch and **/ (root)**, then save.
5. When GitHub finishes deployment, use the website URL shown under Pages. It will typically look like `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

All asset links are relative, so repository subpaths work. There are no API keys or server-side dependencies. Google Fonts is an optional network enhancement; system serif and sans-serif fonts work when offline. The map opens Google Maps only when a guest requests directions.

## Features

- Keyboard-accessible, animated wax-seal envelope; replay from the footer.
- The letter opens into an immersive, forest-green and antique-gold scene with visibly animated chapter transitions instead of vertical page partitions.
- Four scroll-controlled chapters, direct chapter navigation, native keyboard/touch scrolling, and a live progress line.
- Responsive layouts, safe-area support, explicit motion controls, reduced-motion support, and printable details.
- Countdown to **the start of 28 November in India Standard Time**, not an assumed ceremony hour.
- Downloadable all-day `.ics` event for Apple Calendar, Google Calendar import, and Outlook. The video does not give a ceremony time; the page explicitly says the families will share it.
- Directions using the supplied Google Maps link.
- Original invitation video in an accessible modal with native playback controls.
- Optional music extracted from the supplied video, off by default. Music pauses while the film plays or the browser tab is hidden.
- Native device sharing or clipboard copying after publication. Personalized recipient names are removed from shared links.

## Personalize

Use `?to=Ananya%20%26%20Family` after the published URL to address the envelope to a guest. Names are rendered as text, never HTML. This personalization is not private access control.

Edit names and invitation wording in `index.html`. Event dates and calendar content are in the `EVENT` object at the top of `experience.js`. If a date or venue changes, update both HTML and JavaScript, including the venue link. Colors, typography, and responsive breakpoints are in `experience.css`. The botanical and garden illustrations are original local SVG assets.

Motion uses CSS animations, one sticky viewport, and a scroll-triggered `requestAnimationFrame`. There is no animation library, wheel/touch interception, automatic chapter advancement, or continuously running JavaScript loop. Hidden chapters are inert and excluded from the accessibility tree. Animation pauses when the browser tab is hidden. With motion off, chapter changes are immediate and decorative animation stops. With JavaScript disabled or when printing, the invitation falls back to readable document flow.

The new stylesheet and script have different filenames from the original design and versioned URLs to avoid reusing the old cached assets. After uploading future changes, update the `v=` values in `index.html` if necessary.

No RSVP is collected and no analytics or tracking is included. Before publishing, confirm the date, venue, and spelling of all family names, and ensure you have permission to distribute the supplied video's imagery and music.
