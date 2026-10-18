# Samridhi & Piyush — A beautiful beginning

An original, ivory-and-champagne engagement invitation for **28 November 2026** at **The Cove, Sector 5, Panchkula**. A burgundy wax seal opens into a floral, illustrated invitation with gentle scrolling reveals, both families, a calendar, venue directions, and an optional original music-box soundtrack.

## Open the invitation

Double-click `index.html`. All fonts, illustrations, styles, and scripts are included locally. No install, build, account, API key, or internet connection is needed to view the invitation. Google Maps needs a connection when you open directions.

For an HTTP preview, run `python -m http.server 8080` in this folder and visit `http://localhost:8080`. Stop it with Ctrl+C.

## Host on GitHub Pages

1. Create a GitHub repository. A public repository makes the invitation and family details publicly accessible; confirm the families are comfortable with that before publishing.
2. Upload the **contents of `web-invite_v2`** to its root: `index.html`, `invitation.css`, `invitation.js`, `engagement.ics`, `.nojekyll`, and the entire `assets` folder, including the fonts and licenses. Do not put them inside an additional nested folder.
3. Open **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select the branch containing the files and **/ (root)**, then save.
5. Once deployment completes, open the website link shown by GitHub Pages. Share that live URL with your guests, not the repository URL or a local computer path.

All resource URLs are relative, so both `username.github.io` and `username.github.io/repository-name/` work. There are no external runtime dependencies or trackers.

## Details and personalization

- Bride: **Samridhi Sharma**, daughter of **Rajneesh Sharma & Poonam Sharma**.
- Groom: **Piyush Kaushik**, son of **Satish Kaushik & Urmila Kaushik**.
- Date: **Saturday, 28 November 2026**.
- Venue: **The Cove, Sector 5, Panchkula, Haryana, India**.
- Directions use the exact Google Maps link provided by the families.
- No ceremony time was supplied. The invitation says the families will share it; the calendar is deliberately an **all-day save-the-date**, not a timed event. Its exclusive end date is 29 November.
- The countdown is to midnight at the **start of 28 November in India Standard Time**, not to an invented ceremony time. It changes to an engagement-day message on that date and a thank-you afterward.

Add `?to=Ananya%20%26%20Family` to the published URL to personalize the envelope. This is a greeting, not private access control. Guest text is rendered safely as text. The Share button removes the personalization and section hash; local preview URLs are not shared.

## Design and accessibility

The supplied reference clips inspired the paper, seal, florals, arches, and gentle motion. They are **not embedded or redistributed**, and none of their video, imagery, or music was extracted into this site. The SVG floral, courtyard, pavilion, and monogram illustrations are original. The pavilion is decorative artwork, not an accurate depiction or photograph of The Cove.

Music is off by default. The Sound button plays an original, synthesized music-box pattern using the browser's Web Audio API; it pauses when the tab is hidden. There are no third-party recordings or audio downloads.

The page supports mobile and desktop layouts, keyboard navigation, a skip link, visible focus indicators, reduced-motion preferences, and printing. Without JavaScript, the envelope is skipped and all invitation content remains readable, including directions and the calendar download. The live countdown, synthesized music, and sharing enhancement require JavaScript. No RSVP form is included, because no RSVP destination or contact was supplied.

Fonts are self-hosted Cormorant Garamond, Great Vibes, and Manrope, distributed under their included SIL Open Font Licenses in `assets/fonts/`.

## Editing later

Invitation wording and family names are in `index.html`. Colors, typography, envelope, responsive layouts, and animations are in `invitation.css`. Countdown dates, personalized greeting, sharing, and music are in `invitation.js`.

If the date or venue changes, update **all three** of `index.html`, the date constants in `invitation.js`, and `engagement.ics`. Also update the displayed November calendar if the month changes. If adding a ceremony time, replace the all-day calendar event with an explicitly time-zoned event and update the note and countdown as appropriate.
