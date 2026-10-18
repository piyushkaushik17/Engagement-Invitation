# Piyush & Samridhi — Mobile invitation · v5

A mobile-first, cinematic invitation for 28 November 2026 at The Cove, Sector 5, Panchkula. No build step, framework, account, or backend is required.

## The new experience

This is a separate version in `web-invite\v5`; all existing versions are preserved. The blush-pink and powder-blue design is now a phone-first experience, with a single portrait layout capped at 480 pixels even on a desktop. Typography, 44–50 pixel touch targets, thumb-reachable navigation, and safe-area spacing are designed for phones, not a desktop page squeezed down.

Swipe up or down to move between four chapters. Native momentum scrolling and CSS scroll snapping settle at each chapter, while the same garden remains in place and text crossfades through it. Supporting browsers use CSS scroll-driven animations for scene opacity and transforms. Other browsers use a scroll-triggered animation frame with no smoothing delay between the finger and the content. There is no touch or wheel interception, gesture threshold, animation library, or automatic chapter advancement. The “When & where” shortcut opens the ceremony chapter immediately.

The viewport follows the phone's available height. Rotation preserves the current chapter. Landscape, enlarged text, or content that cannot fit gets an unclipped reading layout instead of shrinking text or hiding details. Pinch zoom is not disabled.

The closed-envelope page is animated too: the envelope floats, the wax seal glows, floral sprays sway, orbit lines breathe, and pink-and-blue petals drift. Inside, butterflies flutter, rings float, and the scenery moves with scrolling. Tap the heart on the closing chapter for an extra petal shower; this is a local visual interaction, not an RSVP or message.

Motion and music are enabled without visible toggle buttons, as requested for this version. Music starts directly from the guest's envelope-opening gesture and fades in over 1.8 seconds. Browser autoplay policies still apply: if playback is blocked, an explanatory notice asks the guest to tap the invitation, and playback is retried on that interaction. Device or browser mute settings cannot be overridden. Music pauses while the original film plays or the tab is hidden, then resumes when appropriate.

## Preview

Open `index.html` directly, or run `python -m http.server 8080` from this folder and visit `http://localhost:8080`. A local preview cannot be shared with guests; publish the folder first.

## Publish on GitHub Pages

1. Create a GitHub repository. Remember that a public repository exposes the invitation, family names, and video publicly.
2. Upload **the contents of this folder** to the repository root: `index.html`, `experience.css`, `mobile.css`, `experience.js`, `.nojekyll`, and the entire `assets` folder. Include `assets/engagement.ics` for Apple Calendar. Do not upload only the HTML or place everything inside a second `web-invite` folder.
3. In the repository, select **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select your uploaded branch and **/ (root)**, then save.
5. When GitHub finishes deployment, use the website URL shown under Pages. It will typically look like `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

All asset links are relative, so repository subpaths work. There are no API keys or server-side dependencies. Google Fonts is an optional network enhancement; system serif and sans-serif fonts work when offline. The map opens Google Maps only when a guest requests directions.

## Features

- Keyboard-accessible, animated wax-seal envelope; replay from the footer.
- Light pink, powder blue, muted rose, and pearl tones throughout the envelope, text, flowers, buttons, video dialog, and original local illustrations.
- Four touch-snapped chapters, a ceremony shortcut, direct chapter navigation, native keyboard/touch scrolling, and a live progress line.
- Responsive layouts, safe-area support, keyboard-accessible chapter navigation, and printable details.
- Countdown to **the start of 28 November in India Standard Time**, not an assumed ceremony hour.
- “Add to calendar” opens a mobile bottom sheet instead of immediately downloading a file. Google Calendar and Outlook links open prefilled all-day events for confirmation. Apple Calendar uses a normal calendar-file link, and a separate download option remains available.
- Directions using the supplied Google Maps link.
- Original invitation video in an accessible modal with native playback controls.
- Automatic music extracted from the supplied video, started by opening the envelope, with a gentle fade-in and no music or motion buttons.
- Native device sharing or clipboard copying after publication. Personalized recipient names are removed from shared links.

## Personalize

Use `?to=Ananya%20%26%20Family` after the published URL to address the envelope to a guest. Names are rendered as text, never HTML. This personalization is not private access control.

Edit names and invitation wording in `index.html`. Event dates and calendar content are in the `EVENT` object at the top of `experience.js`. If a date or venue changes, update both HTML and JavaScript, including the venue link. Colors, typography, and responsive breakpoints are in `experience.css`. The botanical and garden illustrations are original local SVG assets.

Mobile layout and scroll-timeline rules are in `mobile.css`, after the shared decorative stylesheet. Update `assets/engagement.ics` as well if the event changes; it is the static Apple Calendar import. Keep its all-day end date exclusive and its line endings CRLF.

## Calendar behavior and limits

A normal webpage cannot write an event into someone's calendar without their permission. Google Calendar and Outlook open a prefilled editor; the guest must confirm Save and may need to sign in. Their service and the phone determine whether the editor opens in an app or a browser.

Apple does not provide a universal web link for creating a native Calendar event. Its option opens the local `.ics` file without forcing a download, which supported iPhone browsers can hand off for calendar import. Other browsers and in-app browsers may download it or require the guest to open it from Files. No calendar access, OAuth token, backend, or subscription is requested. The event is **all day on 28 November 2026**, not an invented ceremony time.

Motion uses CSS animations, one sticky viewport inside a native scrolling region, and a scroll-triggered `requestAnimationFrame` for navigation state and scenery. CSS scroll timelines handle scene transitions where supported; the JavaScript fallback uses only opacity and transforms. No story rendering continues when scrolling stops. Short-lived JavaScript animation is also used for the music fade-in. Hidden cinematic chapters are inert and excluded from the accessibility tree; all chapters are readable in the overflow fallback. Animation pauses when the browser tab is hidden. Motion remains enabled without toggles, as in v3. With JavaScript disabled or when printing, the invitation falls back to normal document flow.

The stylesheets and script use the `mobile-5` version query to avoid reusing previous cached assets. Upload the contents of **v5**, not the parent folder containing all versions.

No RSVP is collected and no analytics or tracking is included. Before publishing, confirm the date, venue, and spelling of all family names, and ensure you have permission to distribute the supplied video's imagery and music.
