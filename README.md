# Piyush & Samridhi — Blush & blue invitation · v3

A mobile-first, cinematic invitation for 28 November 2026 at The Cove, Sector 5, Panchkula. No build step, framework, account, or backend is required.

## The new experience

This is a separate version in `web-invite\v3`; `v1` and `v2` are not modified. A blush-pink and powder-blue envelope opens into a light watercolor garden with cherry blossoms, butterflies, pearl-like orbit details, a pastel pavilion, and a pair of swans. The original full-screen chapter transitions are retained: typography travels through the viewport while one continuous garden stays in place.

The closed-envelope page is animated too: the envelope floats, the wax seal glows, floral sprays sway, orbit lines breathe, and pink-and-blue petals drift. Inside, butterflies flutter, rings float, and the scenery moves with scrolling. Tap the heart on the closing chapter for an extra petal shower; this is a local visual interaction, not an RSVP or message.

Motion and music are enabled without visible toggle buttons, as requested for this version. Music starts directly from the guest's envelope-opening gesture and fades in over 1.8 seconds. Browser autoplay policies still apply: if playback is blocked, an explanatory notice asks the guest to tap the invitation, and playback is retried on that interaction. Device or browser mute settings cannot be overridden. Music pauses while the original film plays or the tab is hidden, then resumes when appropriate.

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
- Light pink, powder blue, muted rose, and pearl tones throughout the envelope, text, flowers, buttons, video dialog, and original local illustrations.
- Four scroll-controlled chapters, direct chapter navigation, native keyboard/touch scrolling, and a live progress line.
- Responsive layouts, safe-area support, keyboard-accessible chapter navigation, and printable details.
- Countdown to **the start of 28 November in India Standard Time**, not an assumed ceremony hour.
- Downloadable all-day `.ics` event for Apple Calendar, Google Calendar import, and Outlook. The video does not give a ceremony time; the page explicitly says the families will share it.
- Directions using the supplied Google Maps link.
- Original invitation video in an accessible modal with native playback controls.
- Automatic music extracted from the supplied video, started by opening the envelope, with a gentle fade-in and no music or motion buttons.
- Native device sharing or clipboard copying after publication. Personalized recipient names are removed from shared links.

## Personalize

Use `?to=Ananya%20%26%20Family` after the published URL to address the envelope to a guest. Names are rendered as text, never HTML. This personalization is not private access control.

Edit names and invitation wording in `index.html`. Event dates and calendar content are in the `EVENT` object at the top of `experience.js`. If a date or venue changes, update both HTML and JavaScript, including the venue link. Colors, typography, and responsive breakpoints are in `experience.css`. The botanical and garden illustrations are original local SVG assets.

Motion uses CSS animations, one sticky viewport, and a scroll-triggered `requestAnimationFrame`. There is no animation library, wheel/touch interception, automatic chapter advancement, or continuously running story render loop. Short-lived JavaScript animation is also used for the music fade-in. Hidden chapters are inert and excluded from the accessibility tree. Animation pauses when the browser tab is hidden. In this version, motion stays enabled instead of offering a toggle or inheriting device reduced-motion settings. With JavaScript disabled or when printing, the invitation falls back to readable document flow.

The stylesheet and script use the `pastel-3` version query to avoid reusing previous cached assets. Upload the contents of **v3**, not the parent folder containing all versions.

No RSVP is collected and no analytics or tracking is included. Before publishing, confirm the date, venue, and spelling of all family names, and ensure you have permission to distribute the supplied video's imagery and music.
