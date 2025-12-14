# CCR Locksmith - AI Coding Instructions

## Project Overview
This is a hybrid web project consisting of two distinct parts:
1. **Main Site (Root)**: A static HTML/CSS/JS website hosted on Netlify.
2. **Blog (`/blog`)**: A modern Astro v5 application.

## 1. Main Site Architecture (Root)
- **Type**: Static HTML Website (No build step required for root files).
- **Structure**: Flat file structure. Each service has its own `.html` file (e.g., `automotive.html`, `residential.html`).
- **Templating**: **NONE**. 
  - **CRITICAL**: Header, Footer, Navigation, and Trust Bars are **hardcoded** in every single `.html` file.
  - **Action**: When modifying common UI elements, you **MUST** update every `.html` file in the root directory.
  - *Note*: `assets/js/includes.js` and `partials/` exist but are **NOT** currently active in the main pages. Do not rely on them for global updates unless refactoring.

### Key Directories
- `assets/css/`: Contains `main.css` (primary styles) and `style.css`.
- `assets/js/`: Contains `main.js` (UI logic, jQuery-based) and vendor scripts.
- `images/`: Static image assets.
- `blog/`: The separate Astro project.

### Developer Workflow
- **Run**: Open `index.html` directly in a browser or use a simple static server (e.g., Live Server).
- **Deploy**: Pushing to `main` triggers a Netlify deployment.
- **Forms**: Uses Netlify Forms (attributes `netlify` or `data-netlify="true"` in `<form>`).

## 2. Blog Architecture (`/blog`)
- **Framework**: Astro v5.
- **Structure**: Standard Astro project.
  - `src/pages/`: Routes.
  - `src/components/`: Reusable UI components.
  - `src/layouts/`: Page layouts.
- **Commands** (run from `blog/` directory):
  - `npm run dev`: Start development server.
  - `npm run build`: Build for production.

## 3. Conventions & Patterns
- **HTML Structure**:
  - Pages use a `body.is-preload` class that is removed by `main.js` on load.
  - Header contains hardcoded contact info and navigation.
  - Footer contains hardcoded copyright and links.
- **Styling**:
  - `main.css` is the core stylesheet.
  - `noscript.css` handles fallback styles.
- **Analytics & SEO**:
  - Google Analytics (`gtag.js`) is present in `<head>`.
  - Schema.org JSON-LD is included in `<head>`. Ensure this is preserved/updated when creating new pages.

## 4. Common Tasks
- **Adding a New Service Page**:
  1. Copy an existing service page (e.g., `automotive.html`) to maintain layout/metadata.
  2. Update `<title>`, `<meta name="description">`, and JSON-LD schema.
  3. Update the content section.
  4. **Crucial**: Add the new link to the Navigation menu in **ALL** other HTML files.
- **Updating Phone/Email**:
  - Requires a global find-and-replace across all `.html` files.

## 5. Tech Stack
- **Root**: HTML5, CSS3, jQuery, Netlify Forms.
- **Blog**: Astro, React (potentially), TypeScript.
