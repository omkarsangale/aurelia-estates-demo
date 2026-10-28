# Aurelia Estates

A complete premium real estate concept, inspired by the architectural photography and project showcase direction of https://www.designheed.com/.

The refined design includes larger supporting text (17–19px body copy, 16px form fields and footer links), stronger text contrast, warmer editorial copy, a softer image treatment, and a complete footer with collection links and a visit invitation. Phone and desktop layouts were checked after these changes.

## Present the website

Open `dist/index.html` in Chrome or Edge. The website has no installation or build requirements, and all five photographs are included locally. An internet connection loads the optional web fonts; system fonts provide a fallback.

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
- Residences: https://images.unsplash.com/photo-1600585154340-be6161a56a0c
- Commercial: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab
- Lifestyle: https://images.unsplash.com/photo-1613977257363-707ba9348227

## Validation

JavaScript syntax check passed. Browser checks covered desktop and mobile widths, image loading, category filtering, project details, selected-project transfer to the visit form, form preview, lifestyle gallery, and mobile navigation. No horizontal overflow was found at the inspected widths.

## Hosting

The private Sites project ID is preserved in `.openai/hosting.json`. Publication could not complete because the environment could not connect to `git.chatgpt-team.site` over HTTPS. No successful deployment is claimed. Resume publication using the existing project ID rather than creating a new Site.
