# Piyush & Samridhi — Engagement invitation

A mobile-first, static invitation for 28 November 2026 at The Cove, Sector 5, Panchkula. No build step, framework, account, or backend is required.

## Preview

Open `index.html` directly, or run `python -m http.server 8080` from this folder and visit `http://localhost:8080`. A local preview cannot be shared with guests; publish the folder first.

## Publish on GitHub Pages

1. Create a GitHub repository. Remember that a public repository exposes the invitation, family names, and video publicly.
2. Upload **the contents of this folder** to the repository root: `index.html`, `styles.css`, `script.js`, `.nojekyll`, and the entire `assets` folder. Do not upload only the HTML or place everything inside a second `web-invite` folder.
3. In the repository, select **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select your uploaded branch and **/ (root)**, then save.
5. When GitHub finishes deployment, use the website URL shown under Pages. It will typically look like `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

All asset links are relative, so repository subpaths work. There are no API keys or server-side dependencies. Google Fonts is an optional network enhancement; system serif and sans-serif fonts work when offline. The map opens Google Maps only when a guest requests directions.

## Features

- Keyboard-accessible, animated wax-seal envelope; replay from the footer.
- Staged seal, flap, and letter animation crossfades into a staggered hero entrance. Text and cards reveal individually while scrolling; garden artwork has gentle scroll-linked depth and leaves sway subtly.
- A continuous watercolor-style background and feathered illustrations replace hard section partitions. A thin reading-progress line, drifting gold flecks, and a softly pulsing film control keep the page alive without taking over native scrolling.
- Responsive layout, mobile quick actions, safe-area support, reduced-motion support, and printable details.
- Countdown to **the start of 28 November in India Standard Time**, not an assumed ceremony hour.
- Downloadable all-day `.ics` event for Apple Calendar, Google Calendar import, and Outlook. The video does not give a ceremony time; the page explicitly says the families will share it.
- Directions using the supplied Google Maps link.
- Original invitation video in an accessible modal with native playback controls.
- Optional music extracted from the supplied video, off by default. Music pauses while the film plays or the browser tab is hidden.
- Native device sharing or clipboard copying after publication. Personalized recipient names are removed from shared links.

## Personalize

Use `?to=Ananya%20%26%20Family` after the published URL to address the envelope to a guest. Names are rendered as text, never HTML. This personalization is not private access control.

Edit names and invitation wording in `index.html`. Event dates and calendar content are in the `EVENT` object at the top of `script.js`. If a date or venue changes, update both HTML and JavaScript, plus the map links in the desktop and mobile buttons. Colors, typography, and responsive breakpoints are in `styles.css`. The botanical and garden illustrations are original local SVG assets.

Motion uses native CSS transitions and a scroll-triggered `requestAnimationFrame`, with no animation library, scroll hijacking, or continuously running JavaScript render loop. Parallax is smaller on phones; decorative animation pauses when its scene or the browser tab is out of view. Reduced-motion preferences disable ornamental movement and reveal content immediately, including when the preference changes while the page is open.

No RSVP is collected and no analytics or tracking is included. Before publishing, confirm the date, venue, and spelling of all family names, and ensure you have permission to distribute the supplied video's imagery and music.
