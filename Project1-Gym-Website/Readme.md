# IRON EDGE — Premium Fitness Club Landing Page

A responsive, single-page website for a premium gym, built with plain HTML, CSS, and JavaScript. No build tools or server are required to run it locally.

## Features

- Responsive dark-and-gold design
- Hero, programs, membership, trainers, testimonials, gallery, and contact sections
- Mobile navigation, scroll progress, back-to-top button, and animated statistics
- Accessible labels, focus states, meaningful image descriptions, and reduced-motion support
- Contact form with loading, success, and error feedback
- Honeypot spam protection

## Project structure

```text
Project1-Gym-Website/
├── index.html    # Page structure and content
├── style.css     # Styling and responsive layouts
├── script.js     # Site interactions and contact-form submission
└── Readme.md     # Project documentation
```

All photography is loaded from Unsplash; the project does not use a local asset folder.

## Run locally

Open `index.html` in a browser, or start a local server for a more reliable preview:

```bash
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## Contact form

The contact form submits to [FormSubmit](https://formsubmit.co/) and sends enquiries to `amaanmuseo@gmail.com`. The site uses FormSubmit’s AJAX endpoint, so visitors remain on the page while the message is sent.

The first submission for an email address requires FormSubmit activation. After activation, each accepted submission is forwarded to the configured mailbox. FormSubmit retains submissions temporarily in its archive, which can help recover a message that was filtered by the email provider.

## Update site content

Before publishing, update the contact details, opening hours, membership pricing, trainer information, social links, and any Unsplash images that should be replaced with licensed business photography.

## Deployment

The site can be deployed to GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static web host. Test the contact form on the deployed site before launch.

## Browser support

The site supports current versions of Chrome, Edge, Firefox, and Safari.
