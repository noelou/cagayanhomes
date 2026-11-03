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

### Step 3: Home page (tagsa-tagsa nga section)
1. Hero/Banner: title, text, "I'm Buying" / "I'm Selling" buttons, photo ni Carl
2. Search box
3. Featured properties: property cards (**props**, **`.map`**)
4. Why work with me
5. Client stories

## Where I left off

- **Node study:** paused at EventEmitter. Resume at Phase 3.
- **JS basics:** comfortable with `const`, arrow functions, template literals, `.map`, destructuring.
- **CSS:** already comfortable, so styling is not a focus.

## Notes per step

<!-- Add what you learned after each step here -->
