# Learning Log — React + Node

Goal: learn React then Node by rebuilding the Carl real estate site (cagayanhomes.ph).
I type the code myself; Claude explains each step.

## How we work

- **Ako ang mo-type sa codes.** Dili si Claude ang mosulat sa files para nako.
- **Human ko ug type, i-explain dayon ni Claude** unsa ang purpose sa code ug para asa siya: unsa ang buhaton sa matag line, ngano kinahanglan, ug asa siya gamiton sa website.
- Bag-o pa kaayo ko sa React, so:
  - Gagmay nga steps lang matag higayon
  - Simple nga explanation, Bisaya/English
  - Kung naay bag-ong React word (component, props, JSX, state...), i-explain una sa dili pa gamiton

## Setup

- Node and npm installed ✅
- Bag-ong folder: `noel/project/cagayanhomes/` (kaugalingong git repo, `git init`)
- React app sa `cagayanhomes/client/`, Node backend unya sa `cagayanhomes/server/`
- Ang Vue version (`noel/project/agent-carl/`) pasagdan lang isip reference sa design + content. Dili i-copy ang `.vue` files, ako ang mo-type sa React version.
- I-copy gikan sa `agent-carl` kung kinahanglan na sa step:
  - `carl-prof.jpg` (hero section)
  - `style.css` (ang CSS mogana ra gihapon sa React)
  - `src/data/*.js` (fake data para sa property cards, testimonials)

## Roadmap

> **Note:** Basic package ang i-implement (tan-awa ang `BASIC-PACKAGE.md`). Ang Phase 5 (agent/owner register) ug ang admin approval sa Phase 6 kay dili apil sa Basic. Admin login ra ang kinahanglan.

- [ ] **Phase 1** — React project setup, pages with fake data (components, props, JSX, routing)
- [ ] **Phase 2** — Property cards, filters, details page, print (`useState`, `useEffect`, events)
- [ ] **Phase 3** — Node + Express API serving properties (REST, `fetch`)
- [ ] **Phase 4** — Database
- [ ] **Phase 5** — Register / login for agents and owners
- [ ] **Phase 6** — Property + image upload, admin approval, hide seller number from public
- [ ] **Phase 7** — Deploy + connect domain

## Phase 1 — Steps

### Step 1: Himo og folder ug React project

Sa terminal, sulod sa `noel/project/`:

```bash
mkdir cagayanhomes
cd cagayanhomes
git init
```
- `mkdir` = himo og bag-ong folder
- `git init` = himoon ni nga folder nga git repo (para ma-track ang changes)

I-copy ang `LEARNING.md` ug `plan.html` gikan sa `agent-carl` ngadto sa `cagayanhomes`.

```bash
npm create vite@latest client -- --template react
```
- Si **Vite** mohimo og starter React project sa `client/` folder
- `--template react` = React ang gusto, dili Vue
- Kung mangutana, i-Enter lang ang default

```bash
cd client
npm install
npm run dev
```
- `npm install` = i-download ang packages nga nakalista sa `package.json` (react, react-dom, vite) ngadto sa `node_modules/`
- `npm run dev` = i-start ang dev server. Ablihi ang link (kasagaran `http://localhost:5173`)
- ✅ Success kung makita ang Vite + React page nga naay counter button
- Para i-stop ang server: `Ctrl + C`

### Step 2: Limpyohan ang default files
_(i-explain ni Claude ang matag file sa `client/` una sa dili pa limpyohan)_

### Step 3: Home page (tagsa-tagsa nga section, Basic package)
1. Hero/Banner: title, text, "I'm Buying" / "I'm Selling" buttons, photo ni Carl ✅
2. Why work with me: cards (**props**, **`.map`**) ✅
3. Client stories (ipakita sa tanang pages) ✅

### Step 4: React Router (daghang pages) ✅
1. `npm install react-router` (v8; dili na `react-router-dom`) ✅
2. `pages/Home.jsx` (Hero + Why + Client Stories) ✅
3. `<BrowserRouter>` palibot sa `<App />` sa `main.jsx` ✅
4. `<Routes>` + `<Route>` sa `App.jsx`, test page `pages/About.jsx` ✅

### Step 5: Header ug Footer
1. `Header.jsx` + `.css` (`Link`, `NavLink`) ✅
2. `<Header />` sa `App.jsx` gawas sa `<Routes>` ✅
3. `data/agent.js` + `Footer.jsx` + `.css` ✅
4. Mobile menu ☰ (`useState`)

### Step 6: Ang ubang pages (Buy, Rent, Contact) + reuse `<ClientStories />`
_(sunod pa)_

> Wala sa Basic: search box ug featured properties sa Home. Ang listings makita sa Buy ug Rent pages. Ang "I'm Selling" button mo-adto sa "List your property" inquiry form.

## Where I left off

**Last update: 2026-11-09.** Router, Header, and Footer done. Paused at Phase 1, Step 5.4 (mobile menu).

- ✅ Step 1: React project (Vite 8, React 19) in `client/`, git repo, pushed to GitHub (`noelou/cagayanhomes`)
- ✅ Step 2: Cleaned out the default Vite files
- ✅ Step 3.1: Hero component (`components/Hero.jsx` + `Hero.css`), `style.css` from agent-carl copied to `index.css`
- ✅ Step 3.2: Why Work With Me (`WhyCard.jsx`, `WhyWorkWithMe.jsx` + `.css`), 4 cards from a `reasons` array via `.map` + `key`, added to `App.jsx` under `<Hero />`
- ✅ Step 3.3: Client stories (2026-11-09). `data/testimonials.js` (named export, 3 stories), `TestimonialCard.jsx`, `ClientStories.jsx` + `.css` (`grid--3`), added to `App.jsx` under `<WhyWorkWithMe />`. Checked in the browser.
  - Optional: add the stars line (`<p className="testimonial__stars">⭐⭐⭐⭐⭐</p>`) to `TestimonialCard.jsx`
- ✅ Step 4: React Router v8 (`react-router`). `<BrowserRouter>` in `main.jsx`, `<Routes>` in `App.jsx` with `/` (`pages/Home.jsx`) and `/about` (`pages/About.jsx`, placeholder "About me" only)
- ✅ Step 5.1–5.3: `Header.jsx` + `.css` (logo and CTA are `Link`, nav items are `NavLink`, active style is `.active`), `data/agent.js` (contact info, fake data from agent-carl), `Footer.jsx` + `.css`. Both are in `App.jsx` outside `<Routes>`.
- ⏭️ **Next: Step 5.4 Mobile menu ☰ (first `useState`).** Explained 2026-11-09 but **not saved yet**: `Header.jsx` and `Header.css` on disk are still the 5.1 version.
  - `Header.jsx`: `import { useState } from 'react'`, `const [isOpen, setIsOpen] = useState(false)`, `closeMenu()` → `setIsOpen(false)`, a `<button className="navbar__toggle">` with 3 `<span>` and `onClick={() => setIsOpen(!isOpen)}`, `<nav className={isOpen ? 'navbar__links navbar__links--open' : 'navbar__links'}>`, and `onClick={closeMenu}` on every link + the logo
  - `Header.css`: add `.navbar__toggle` + `.navbar__toggle span`, and the `@media (max-width: 860px)` block from `agent-carl/src/components/NavBar.vue`
  - Test in phone view (`F12` → `Ctrl + Shift + M`): ☰ opens/closes, clicking a link closes the menu
- Then: Step 6, the Buy, Rent, Contact pages (placeholders first, add their `<Route>`s) and reuse `<ClientStories />` on other pages. That finishes Phase 1.
- 💡 Turn on **File → Auto Save** in VS Code (twice the files weren't saved when checked).

- **Node study:** paused at EventEmitter. Resume at Phase 3.
- **JS basics:** comfortable with `const`, arrow functions, template literals, `.map`, destructuring.
- **CSS:** already comfortable, so styling is not a focus.

## Notes per step

<!-- Add what you learned after each step here -->

### Step 3.1 Hero
- **Component** = function nga mo-`return` og JSX. Ang `<template>` sa Vue = ang gi-return sa function.
- **JSX** kay JavaScript, dili HTML: `className` (dili `class`), `htmlFor`, `onClick`, `src={photo}`.
- `{ }` sa JSX = "JavaScript ni".
- Image kay i-`import` (`import carlPhoto from '../assets/carl-prof.jpg'`).
- Walay `<style scoped>` sa React: separate `.css` file, i-import. Global ang CSS, so gamit og BEM names (`.hero__photo`).

### Step 3.2 Why Work With Me ✅
- **`.map` + `key`:** `{reasons.map((reason) => <WhyCard key={reason.title} ... />)}`. Ang `.map` mohimo og usa ka component matag item sa array. Ang `key` kinahanglan unique, para mahibal-an sa React kung unsang card ang nausab.
- **Props** = info nga ipasa sa component, like function arguments. `function WhyCard({ title, text })`, gamit `<WhyCard title="..." text="..." />`.
- Vue `{{ title }}` ug `:src="photo"` → React `{title}` ug `src={photo}`. Ang `{ }` ra sa duha. Expressions ra (walay `if`/`for` sulod).
- Vue `v-html` → React `dangerouslySetInnerHTML={{ __html: html }}`. Likayi (XSS risk); gamita ang `{text}` + CSS `white-space: pre-line`.
- `&mdash;` mogana sa JSX text pero dili sa JS string. Sa string, i-type ang tinuod nga `—`.

### Step 3.3 Client Stories ✅
- **Named export vs default export:** `export const testimonials` → `import { testimonials } from '../data/testimonials.js'` (naay `{ }`, parehas gyud ang pangalan). `export default WhyCard` → `import WhyCard from ...` (walay `{ }`). Usa ra ka default matag file; ang named pwede daghan.
- Ang data naa sa separate file (`data/`) kay daghang components ang mogamit. Unya, ang database na ang mopuli niini.
- `../data/` = mogawas una sa `components/`, dayon mosulod sa `data/`.
- Separate component ang `ClientStories` para ma-reuse sa ubang pages, `<ClientStories />` ra.
- Si Vite mangita ra sa extension, so mogana ang import nga walay `.js`. Pero mas maayo nga parehas ang estilo sa tanang imports.

### Step 4 React Router ✅
- **Routing** = basahon ang URL, ipakita ang husto nga page, nga dili mag-reload. React Router = Vue Router sa React.
- `pages/` = tibuok page nga naay URL (sama sa `views/` sa Vue). `components/` = gagmay nga parte nga ma-reuse.
- **Fragment `<> </>`** = invisible nga parent. Usa ra ka parent ang ma-return sa component, ug ang Fragment walay extra `<div>` sa HTML.
- `<BrowserRouter>` sa `main.jsx` (= `app.use(router)` sa Vue) para makahibalo ang tanan sulod niini sa URL.
- `<Routes>` + `<Route path="/about" element={<About />} />` (= `routes: [...]` + `<RouterView />` sa Vue).
- Sayop nga nahimo: `class=` imbes `className=` sa JSX. Mogana gihapon pero naay warning sa console. Ang `class` kay reserved word sa JS.

### Step 5 Header ug Footer (5.1–5.3 ✅)
- Ang Header ug Footer kay **gawas** sa `<Routes>` sa `App.jsx`, mao nga makita sa tanang pages.
- `<a href>` = mo-reload, para ra sa ubang website. `<Link to>` = dili mo-reload. `<NavLink to>` = `Link` + `active` class sa current page (para sa navbar).
- Sa React Router, `.active` ang class (sa Vue kay `.router-link-active`).
- `data/agent.js` kay **object** (usa ra ka agent), ang `testimonials` kay **array** (daghan). Basahon gamit ang tuldok: `{agent.email}`.
- `{new Date().getFullYear()}` = current year, mausab ra sa iyang kaugalingon.
- **`useState` (5.4, explained):** `const [isOpen, setIsOpen] = useState(false)`. Gamita kanunay ang `setIsOpen(...)`, dili `isOpen = ...`, para mo-update ang screen. `onClick={() => setIsOpen(!isOpen)}` naay `() =>` para dili tawgon dayon; ang `onClick={closeMenu}` kay walay `()`.

### Old notes (Step 3.2 draft)
- `useState`: natun-an gikan sa SearchBox example (`const [type, setType] = useState('buy')`; gamita ang `setType`, dili `type = ...`). Wala na ang SearchBox sa Basic.
