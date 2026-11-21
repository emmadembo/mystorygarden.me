# The Story Garden

Website for The Story Garden: sculptural hydroponic growing systems.
It's a plain static site (HTML, CSS and JavaScript), with no build step.

## Folder layout

```
index.html        the page
css/styles.css    all styling
js/main.js        menu, smooth scrolling, video carousel, footer year
js/form.js        sends the contact form to Formspree
images/           photos and logo (lowercase-hyphenated names, no spaces)
media/            videos
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
