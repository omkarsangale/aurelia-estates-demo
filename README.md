# Aurelia Estates

A complete premium real estate concept, inspired by the architectural photography and project showcase direction of https://www.designheed.com/.

The refined design includes larger supporting text (17–19px body copy, 16px form fields and footer links), stronger text contrast, warmer editorial copy, a softer image treatment, and a complete footer with collection links and a visit invitation. Phone and desktop layouts were checked after these changes.

## Present the website

Open `dist/index.html` in Chrome or Edge. The website has no runtime installation or build requirements. Photographs, responsive WebP variants and the DM Sans font are included locally; system fonts provide a fallback.

For a local HTTP preview, run `node server.mjs` in this directory and visit http://127.0.0.1:4173. Press Ctrl+C to stop the server.

## Included

- Responsive desktop, tablet and mobile layouts.
- Three-image hero carousel, project category filters and detailed project dialogs.
- Lifestyle photo gallery, mobile navigation and site visit request preview.
- Enquiry validation, accessible labels, keyboard dismissal and reduced-motion support.
- Original demo brand, copy and custom SVG mark.

## Content and forms

Aurelia Estates and its three projects are illustrative. Sample locations, floor areas and amenities are not actual property advertisements. Photos are illustrative and do not show the sample projects. No real customer testimonials, awards or business performance claims have been invented.

Forms validate locally and show a preview; they do not send or store visitor information or reserve a visit. Replace sample branding and content and connect a real enquiry service before production use.

## Photography

Bundled Unsplash source images:

- Hero: https://images.unsplash.com/photo-1600596542815-ffad4c1539a9
- Interiors: https://images.unsplash.com/photo-1600607687920-4e2a09cf159d
- Residences: https://images.unsplash.com/photo-1575627853189-5af447c0e951
- Commercial: https://images.unsplash.com/photo-1497366754035-f200968a6e72
- Lifestyle: https://images.unsplash.com/photo-1613977257363-707ba9348227

## Validation

Run `npm run check` and `npm test` after `npm ci` to reproduce the syntax and Chrome browser checks. Browser journeys cover 320, 390, 768, 1024 and 1440px, all project and gallery controls, filters, selections, validation, keyboard operation, reduced motion, image delivery and overflow. See [REVIEW-NOTES.md](REVIEW-NOTES.md) for details and limitations, and open [review/index.html](review/index.html) for paired before/after captures.

## Hosting

This refinement is local only. No deployment or live enquiry backend has been connected. Existing hosting metadata is preserved in `.openai/hosting.json`. The Netlify badge setting and production overlap still require owner-side verification; see REVIEW-NOTES.md.
