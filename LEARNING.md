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

> **Note:** Basic package ra ang i-implement (tan-awa ang `BASIC-PACKAGE.md`). Walay agent/owner register ug walay admin approval. **Admin login ra**, walay public register. I-build nga dali ra madugangan sa Standard later (pananglitan: `status` column sa listings, optional owner).

- [x] **Phase 1** — Front-end pages with fake data (components, props, JSX, routing) ✅. Ang "List your property" form gi-defer sa Phase 6
- [x] **Phase 2** — Front-end extras: printable property details (`window.print()` + `@media print`), simple Google Map embed (`<iframe>`, `encodeURIComponent`) ✅
- [ ] **Phase 3** — Node + Express API serving properties (REST), React `fetch` + `useEffect` puli sa `properties.js`
- [ ] **Phase 4** — PostgreSQL: properties table, seed gikan sa current `properties.js` data
- [ ] **Phase 5** — Admin login ra (hashed password, JWT/session). Walay public register
- [ ] **Phase 6** — Admin add/edit/delete listings, photo upload (auto-resize + WebP), seller number admin-only, inquiry form endpoint (padung sa admin)
- [ ] **Phase 7** — Deploy: DigitalOcean, Nginx, Node, PostgreSQL, SSL, domain, backups, admin user guide

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

### Step 6: Ang ubang pages (Buy, Rent, Details, Contact) + reuse `<ClientStories />`
1. Buy + Rent pages (`Listings.jsx`, `PropertyCard.jsx`, filter by `type`) ✅
2. Property details page (`/property/:id`, `useParams`) + `PropertyGallery.jsx` ✅
3. Contact page: placeholder + `<Route path="/contact">` sa `App.jsx` (Header ug Footer naa nay link ngadto `/contact`) ✅
4. Contact page: 2-column layout (`Contact.css`) + form with controlled inputs (`useState` object, one `handleChange`, `handleSubmit` with `preventDefault`). `console.log` ra, dili pa mo-send ✅
5. **Gi-defer sa Phase 6:** "List your property" (`/sell`) form. Karon, ang "I'm Selling" button sa Hero mo-adto sa `/contact`. Ang owner mo-message ni Carl, ug si Carl (admin) ang mo-post sa listing sa Buy/Rent.
6. `<ClientStories />` sa About, Contact, Buy, Rent (inside a Fragment `<> </>`) ✅

> Wala sa Basic: search box ug featured properties sa Home. Ang listings makita sa Buy ug Rent pages.

## Where I left off

**Last update: 2026-11-15.** Phase 1 is almost done: Home, About, Buy, Rent, property details + gallery, Header (with mobile menu), and Footer all work, using fake data from `client/src/data/`. Next is the Contact page (Step 6.3).

- ✅ Step 1: React project (Vite 8, React 19) in `client/`, git repo, pushed to GitHub (`noelou/cagayanhomes`)
- ✅ Step 2: Cleaned out the default Vite files
- ✅ Step 3.1: Hero component (`components/Hero.jsx` + `Hero.css`), `style.css` from agent-carl copied to `index.css`
- ✅ Step 3.2: Why Work With Me (`WhyCard.jsx`, `WhyWorkWithMe.jsx` + `.css`), 4 cards from a `reasons` array via `.map` + `key`, added to `App.jsx` under `<Hero />`
- ✅ Step 3.3: Client stories (2026-11-09). `data/testimonials.js` (named export, 3 stories), `TestimonialCard.jsx`, `ClientStories.jsx` + `.css` (`grid--3`), added to `App.jsx` under `<WhyWorkWithMe />`. Checked in the browser.
  - Optional: add the stars line (`<p className="testimonial__stars">⭐⭐⭐⭐⭐</p>`) to `TestimonialCard.jsx`
- ✅ Step 4: React Router v8 (`react-router`). `<BrowserRouter>` in `main.jsx`, `<Routes>` in `App.jsx` with `/` (`pages/Home.jsx`) and `/about` (`pages/About.jsx`, placeholder "About me" only)
- ✅ Step 5.1–5.3: `Header.jsx` + `.css` (logo and CTA are `Link`, nav items are `NavLink`, active style is `.active`), `data/agent.js` (contact info, fake data from agent-carl), `Footer.jsx` + `.css`. Both are in `App.jsx` outside `<Routes>`.
- ✅ Step 5.4: Mobile menu ☰ (`useState`), committed.
- ✅ About page built (photo, text, phone/email/location from `agent.js`).
- ✅ Restyle + logo + banner hero.
- ✅ Step 6.1–6.2: `data/properties.js` (sale + rent items, WebP photos in `public/properties/`), `Listings.jsx`, `PropertyCard.jsx`, Buy and Rent pages, `PropertyDetails.jsx` (`/property/:id`), `PropertyGallery.jsx` (`useState` for the current photo).
- ✅ Step 6.3–6.4: Contact page (`Contact.jsx` + `.css`), route `/contact`, agent info on the left, form on the right (name, email, phone optional, message). Submit only logs to the console.
- ✅ Hero "I'm Selling" now links to `/contact`. ✅ Step 6.6 done: ClientStories on About, Contact, Buy, Rent. **Phase 1 finished (2026-11-15).**
- ✅ Phase 2 done (2026-11-15): Print button + `@media print` (hides `.navbar`, `.footer`, `.no-print`, `.gallery__thumbs`), `PropertyDetails.css` (`.details__title`, `.details__map`), Google Map `<iframe>` using `property.mapQuery || property.location`. Optional: add a precise `mapQuery` (address or coordinates) to each property in `properties.js`.
- ✅ Phase 3 started (2026-11-15):
  - 3.1 `server/` folder, `npm init -y`, Express 5, `"type": "module"`, `.gitignore` (`node_modules`), `"dev": "node --watch index.js"` script (inside `"scripts"`!)
  - 3.2 `server/index.js` with `GET /api/hello`, port 5000
  - 3.3 `GET /api/properties`, using a temporary copy `server/data/properties.js` (Phase 4 replaces it with the database)
  - 3.4 `GET /api/properties/:id` (`req.params.id`, 404 with `res.status(404).json(...)` + `return`)
  - 3.5 Vite proxy in `client/vite.config.js`: `server.proxy['/api'] = 'http://localhost:5000'`. Restart Vite after editing the config.
  - 3.6 `Listings.jsx` now loads from the API with `useState` + `useEffect` + `fetch` + loading state. **Still to check in the browser** (Buy and Rent with both servers running).
- ⏭️ **Next:** finish 3.6 check, then 3.7 `PropertyDetails.jsx` fetches `/api/properties/:id` (handle 404 / loading). Then Phase 4 (PostgreSQL).
- **Run the project:** two terminals: `cd server && npm run dev` (port 5000) and `cd client && npm run dev` (port 5173).
- **Decisions (2026-11-15):**
  - Owners dili mo-post sa ilang kaugalingon. Sila mo-contact ni Carl (Contact page o Facebook), ug ang admin ra ang mo-post sa Buy/Rent.
  - Ang public form **walay photo upload**. Photos kay Facebook, o ang admin ang mo-upload (resize + WebP, Phase 6).
  - Admin notification kay Standard ra, dili Basic. Ang submissions ma-save sa database; ang admin makakita sa panel.
  - Anti-spam sa Phase 6 (both Contact + inquiry endpoint): honeypot, rate limit, field length limits, optional Cloudflare Turnstile.
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

### Step 6.4 Contact form ✅
- **Controlled input:** React ang naghawid sa value sa `useState`. `value={form.name}` = ipakita ang state; `onChange={handleChange}` = i-update ang state sa matag type. Kung walay `onChange`, ma-freeze ang input.
- **Usa ka state object** para sa tibuok form: `useState({ name: '', email: '', phone: '', message: '' })`. Usa ra ka `handleChange`: `setForm({ ...form, [e.target.name]: e.target.value })`. Ang `name` attribute sa input kinahanglan parehas sa key sa state.
- `...form` = kopyahon ang daan nga fields. `[e.target.name]` (square brackets) = gamiton ang value sa `name` isip key.
- `e.preventDefault()` sa `handleSubmit` = dili mo-reload ang page.
- `htmlFor` ug `id` kinahanglan parehas; ang `id` kinahanglan unique.
- Sayop nga nahimo: gi-copy ang Name block pero wala usba tanan (`id`, `name`, `value`, `htmlFor`), ug typo sa `name="namphonee"`. Check ang matag field pagkahuman sa copy-paste.
- Ang `setForm` dili mausab dayon ang `form`; makita ang bag-ong value sa sunod nga render.

### Phase 3 Backend (Express) ✅ so far
- **Server** = program nga naghulat sa requests ug mo-send og responses. **Route** = URL nga gi-answer sa server: `app.get('/api/properties', (req, res) => { res.json(properties) })`. `req` = request, `res` = response.
- **Port:** server 5000, Vite 5173. `import ... from './data/properties.js'` sa Node kinahanglan ang `.js`.
- **`:id`** sa route → `req.params.id` (parehas sa `useParams()` sa React). **404:** `return res.status(404).json({...})`. Ang `return` para usa ra ang response.
- **CORS** = browser rule nga dili mo-allow og fetch gikan sa laing port/domain unless mo-allow ang server. **Proxy** (Vite karon, Nginx sa production) = ang browser makakita og usa ra ka origin, so walay CORS. Pwede pud `cors` package kung lain ang domains.
- **`fetch`** mo-return og Promise. `await` maghulat sulod sa `async` function. `res.json()` Promise pud.
- **`useEffect(() => { ... }, [])`** = mo-run human ma-display ang component, **kausa matag mount** (mo-run pag balik sa page). Kung walay `[]` = loop (fetch → setState → render → fetch...). Ang function sa `useEffect` dili pwede `async`, so himoa ang async function sulod ug tawga.
- **Loading state:** `useState([])` ug `useState(true)`; ipakita ang "Loading..." hangtod moabot ang data.
- Sayop nga nahimo: ang `"dev"` script gibutang sa gawas sa `"scripts"`; ang `"type": "commonjs"` default sa `npm init -y` usbon ngadto sa `"module"`.

### Old notes (Step 3.2 draft)
- `useState`: natun-an gikan sa SearchBox example (`const [type, setType] = useState('buy')`; gamita ang `setType`, dili `type = ...`). Wala na ang SearchBox sa Basic.
