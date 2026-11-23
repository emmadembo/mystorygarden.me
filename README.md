# The Story Garden

Website for The Story Garden: sculptural hydroponic growing systems.
It's a plain static site (HTML, CSS and JavaScript), with no build step.

## Folder layout

```
index.html        the home page
shop.html         shop page: a card for each product
privacy.html      privacy policy
systems/          one page per product (eden.html, arjuna.html, raya.html)
favicon.svg       browser-tab icon
css/styles.css    all styling (colors and fonts are at the top, under :root)
css/legal.css     extra styling for legal pages (privacy, etc.)
css/product.css   extra styling for the product pages
js/main.js        footer year, wholesale auto-open, reduced-motion video pause
js/reveal.js      fade-up animations on scroll
js/form.js        sends the contact form to Formspree
js/carousel.js    photo/video carousel on the product pages
images/           photos and logo (lowercase-hyphenated names, no spaces)
media/            videos and their poster images
```

## Preview on your computer

1. Open Terminal in this folder.
2. Run: `python3 -m http.server 8000`
3. Open http://localhost:8000 in your browser.
4. Press `Ctrl + C` in Terminal to stop.

## Publish

The site is hosted from the GitHub repository `emmadembo/mystorygarden.me`.
Commit your changes, then push them to GitHub (`git push`). GitHub Pages republishes the
site automatically a minute or two later. Check which branch Pages publishes from under
the repository's Settings → Pages.

## Things to keep as-is

- Contact form: Formspree form ID `mqagvyaq` and the field names
  `name`, `email`, `inquiry_type`, `company`, `quantity`, `date`, `message`.
- Shop: the Stripe buy button IDs. Only the publishable key (`pk_…`) may appear in the site;
  never put a secret key (`sk_…` or `rk_…`) in any file.
