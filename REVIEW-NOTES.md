# Aurelia Estates refinement — local review

The existing buildless HTML, CSS and JavaScript stack is retained. No framework migration or runtime animation dependency was needed. Playwright, axe, Sharp and the locally packaged font are development tools/assets only. There is no server-side enquiry integration.

## Review

- Run `npm start`, then open `http://127.0.0.1:4173`.
- Open `review/index.html` for paired before/after desktop and mobile screenshots. Captures compare the original local checkout with the refined local checkout, not an independently verified live deployment.
- `npm run check` checks application syntax. `npm test` runs the Chrome browser journeys, accessibility checks and reduced-motion/fallback checks. Chrome must be installed. `npm ci` restores the pinned development tools.
- `npm run optimize:images` regenerates local WebP image variants from the retained JPEG source files.

## Implemented

- Narrow mobile header uses a single-line Visit label; menu, carousel, gallery and close controls have at least 44px touch areas.
- Sticky-header anchor clearance, a balanced two-column mobile filter group, a horizontal desktop single-result feature, and short filter transitions with stable desktop section height.
- Named footer collection links open the correct project. Project selection transfers to both preview forms. Dialog content scrolls inside the modal frame, leaving the close control reachable.
- Local form error summaries and associated field errors, focus on the first invalid field, optional phone validation, whitespace-name checks, current/future visit-date validation and live preview status. Editing a field clears stale preview feedback. Submit controls stay disabled if JavaScript does not initialize.
- Early illustrative/demo disclosure and Pune collection line. Existing sample content and Clarigence.in credit preserved; no prices, approvals, testimonials, availability or performance claims added.
- Tighter philosophy, approach and contact spacing on mobile. The lifestyle section grows with its content at narrow widths, preventing the footer from covering its action.
- Hero copy: 540ms opacity/16px reveal, 65–240ms stagger (last completes at 780ms). Image: 1.03→1 in 800ms; manual slides crossfade in 600ms after decoding. One-time section reveals: 520ms. Filters: 220ms. Dialogs/menu: 240ms. Card images: at most 1.03 scale, with restrained arrow movement on hover/focus.
- Native dialogs, keyboard containment, Escape dismissal and restoration to the initiating control. Mobile menu contains keyboard focus and makes background content inert while open. All motion, including the backdrop, respects reduced motion; content does not rely on an animation initialization class.
- Darker small text and focus indicators. Local 480/800/1200/1600px WebP sources, reserved image dimensions, eager/high-priority hero loading, lazy content images, and locally served DM Sans with its license.

## Validation scope

Browser journeys cover 320, 390, 768, 1024 and 1440px at 900px height: menu and anchors, all filters, all three project dialogs and named footer links, selected-project transfer, close reachability, errors and valid previews, gallery wrapping, keyboard containment/restoration, loaded images, JavaScript errors, external/form network requests and horizontal overflow. axe checks the page, mobile menu, all projects, visit dialog, gallery and demo information. Reduced-motion and JavaScript-disabled content visibility are checked separately.

Results: `npm run check` passed; all seven browser scenarios passed. The eight axe-scanned states reported zero WCAG A/AA violations. No horizontal overflow, failed image requests, page JavaScript errors or outbound enquiry requests were found in those journeys. `git diff --check` passed. These results describe the local checkout and the scope above.

Automated Chrome checks do not establish a complete manual screen-reader audit, real-device Safari/Firefox behavior or production Core Web Vitals. Optional modern CSS entry/exit transitions fall back to immediate display on older browsers while modal behavior remains native.

## Photography

All photographs illustrate the concept and do not depict these sample projects.

- Residences: Saxon White on Unsplash, https://unsplash.com/photos/low-angle-photography-of-concrete-apartment-building-8SIZAxh2YVk — source https://images.unsplash.com/photo-1575627853189-5af447c0e951
- Boutique workspace interior: https://images.unsplash.com/photo-1497366754035-f200968a6e72
- Existing villa, interior and pool source credits remain in README.md.

## Hosting dependency

No hosting setting or deployment was changed. The footer reserves 104px plus safe-area padding below its content as a landing area for a floating badge. The actual host-injected badge is absent locally, so production overlap remains unverified.

For reliable removal for all visitors, the Netlify project owner can use **Project configuration → General → Powered by Netlify badge → Off → Save**. Netlify documents that this takes effect on the next request without a redeploy: https://docs.netlify.com/manage/projects/powered-by-netlify-badge/. Its isolated injected frame cannot be controlled by this site's stylesheet. No badge-hiding CSS or script is included.
