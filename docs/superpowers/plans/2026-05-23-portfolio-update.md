# Portfolio Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement TASK.md: rename AI widget to Davis Intelligence, fix input visibility, add hamburger nav, reorder nav tabs, update tagline, fix blue flicker, polish affected tabs, and add Higgins Digital case study.

**Architecture:** Single-file Vite/React SPA (`src/App.jsx`). All logic, data, and render code lives in App.jsx. Two supplementary files need changes: `index.html` (remove old vanilla JS assistant) and `public/assistant.css`/`public/assistant.js` (old files to be orphaned). API route at `api/chat.js` has a response-field bug to fix.

**Tech Stack:** React 18, Framer Motion, Tailwind CSS 3, Lucide icons, Vite 5, Vercel serverless API

---

## Codebase Map

| File | Status | What changes |
|------|--------|--------------|
| `src/App.jsx` | Modify | All 6 main task areas |
| `index.html` | Modify | Remove old `assistant.css`/`assistant.js` script tags |
| `api/chat.js` | Modify | Fix response field: `reply` → client reads `data.reply` (currently client reads `data.text`, causing API to always fall back to local KB) |
| `public/assistant.css` | Keep (orphaned) | No reference after index.html change |
| `public/assistant.js` | Keep (orphaned) | No reference after index.html change |

### Key facts discovered in code review:
- `AskPortfolioWidget` at App.jsx:833 IS the current assistant (no separate old widget — just rename/redesign it)
- `public/assistant.js` + `public/assistant.css` ARE the old widget — referenced only in `index.html` lines 9 and 14
- API bug: server returns `{ reply }` (api/chat.js:31), client reads `data?.text` (App.jsx:809) — always falls back to local KB
- `NAV_ITEMS` current order: Home, Experience, Projects, **Skills, Impact, Education**, Resume, Contact — needs Education moved before Skills
- Tagline is in two places: the nav header (App.jsx:2048–2053) split across two `<div>` lines
- Blue flicker root cause: no `-webkit-tap-highlight-color: transparent`, and `PageAccents` blur divs may briefly render before framer opacity animation stabilizes — fix both
- Hamburger menu: currently uses a scrollable chip row for `xl:hidden`; replace with hamburger toggle + dropdown panel

---

## Task 1: Remove Old Vanilla JS Assistant + Fix API Response Field

**Files:**
- Modify: `index.html`
- Modify: `api/chat.js`
- Modify: `src/App.jsx` (one-line fix at line 809)

- [ ] **Step 1: Remove old assistant from index.html**

In `index.html`, remove these two lines:
```html
<!-- REMOVE this line: -->
<link rel="stylesheet" href="/assistant.css">
<!-- REMOVE this line: -->
<script src="/assistant.js"></script>
```

After edit, `index.html` body should have only:
```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
```

- [ ] **Step 2: Fix API response field mismatch in App.jsx**

At App.jsx:809, change:
```js
return data?.text || null
```
to:
```js
return data?.reply || null
```

- [ ] **Step 3: Verify build still compiles**

Run: `npm run build` in `C:/Users/Davis Higgins/Downloads/UTDPortfolio`
Expected: `dist/` created, zero errors.

---

## Task 2: Reorder Nav + Update Tagline

**Files:**
- Modify: `src/App.jsx` (NAV_ITEMS array ~line 49, header tagline ~lines 2048–2053)

- [ ] **Step 1: Reorder NAV_ITEMS**

Change the array at App.jsx:49–58 from:
```js
const NAV_ITEMS = [
  { label: 'Home', key: 'home', icon: Home },
  { label: 'Experience', key: 'experience', icon: Briefcase },
  { label: 'Projects', key: 'projects', icon: Code2 },
  { label: 'Skills', key: 'skills', icon: Layers },
  { label: 'Impact', key: 'skills-proof', icon: ShieldCheck },
  { label: 'Education', key: 'education', icon: GraduationCap },
  { label: 'Resume', key: 'resume', icon: NotebookText },
  { label: 'Contact', key: 'contact', icon: Mail },
]
```
to:
```js
const NAV_ITEMS = [
  { label: 'Home', key: 'home', icon: Home },
  { label: 'Experience', key: 'experience', icon: Briefcase },
  { label: 'Projects', key: 'projects', icon: Code2 },
  { label: 'Education', key: 'education', icon: GraduationCap },
  { label: 'Skills', key: 'skills', icon: Layers },
  { label: 'Impact', key: 'skills-proof', icon: ShieldCheck },
  { label: 'Resume', key: 'resume', icon: NotebookText },
  { label: 'Contact', key: 'contact', icon: Mail },
]
```

- [ ] **Step 2: Update hero tagline in header**

In the header section around App.jsx:2048–2053, change:
```jsx
<div className="whitespace-nowrap text-sm text-slate-400">
  Data Analyst | Data Science &amp; AI |
</div>
<div className="whitespace-nowrap text-sm text-slate-400">
  Statistical Modeling | Predictive Analytics
</div>
```
to:
```jsx
<div className="whitespace-nowrap text-sm text-slate-400">
  Data Analyst | Data Science &amp; AI |
</div>
<div className="whitespace-nowrap text-sm text-slate-400">
  Web Developer | Digital Creator
</div>
```

---

## Task 3: Add Hamburger Menu for Narrow Screens

**Files:**
- Modify: `src/App.jsx` (App component state + header section)

The header currently has an `xl:hidden` scrollable chip bar (App.jsx:2103–2121). Replace it with a hamburger toggle + animated dropdown.

- [ ] **Step 1: Add hamburger state to App component**

In the `App()` function, add `menuOpen` state after existing state declarations:
```js
const [menuOpen, setMenuOpen] = useState(false)
```

- [ ] **Step 2: Replace the scrollable tab bar with hamburger + dropdown**

Find and replace the entire `xl:hidden` section (App.jsx:2098–2121):
```jsx
<div className="ml-auto rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 xl:hidden">
  {activeTitle}
</div>
```
and:
```jsx
<div className="section-shell pb-4 xl:hidden">
  <div className="flex snap-x gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-2">
    {NAV_ITEMS.map((item) => { ... })}
  </div>
</div>
```

Replace with this structure inside the header:

```jsx
{/* Mobile: current tab label + hamburger button */}
<div className="ml-auto flex items-center gap-3 xl:hidden">
  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300">
    {activeTitle}
  </span>
  <button
    type="button"
    onClick={() => setMenuOpen((o) => !o)}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
    aria-expanded={menuOpen}
  >
    {menuOpen ? <X className="h-5 w-5" /> : (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  </button>
</div>
```

Then, right after the closing `</header>` tag, add the dropdown panel:
```jsx
<AnimatePresence>
  {menuOpen && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-x-0 top-[73px] z-40 xl:hidden"
    >
      <div className="mx-4 overflow-hidden rounded-[1.5rem] border border-sky-300/20 bg-[#0a1322]/95 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activePage === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => { setActivePage(item.key); setMenuOpen(false) }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? 'bg-white/10 text-white ring-1 ring-sky-300/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-sky-300' : 'text-slate-400'}`} />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400" />}
              </button>
            )
          })}
        </div>
        <div className="border-t border-white/5 px-3 pb-3">
          <button
            type="button"
            onClick={() => { setActivePage('contact'); setMenuOpen(false) }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-300/10 px-4 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-300/20"
          >
            <Mail className="h-4 w-4" />
            Contact Me
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

Also add a click-outside-to-close effect by adding this `useEffect` in the App component:
```js
useEffect(() => {
  if (!menuOpen) return
  const close = (e) => {
    if (!e.target.closest('[data-menu]') && !e.target.closest('button[aria-label*="navigation"]')) {
      setMenuOpen(false)
    }
  }
  document.addEventListener('click', close)
  return () => document.removeEventListener('click', close)
}, [menuOpen])
```

Also close menu when tab changes — add `setMenuOpen(false)` to any existing `setActivePage` calls, OR just auto-close in the `menuOpen` useEffect when `activePage` changes:
```js
useEffect(() => { setMenuOpen(false) }, [activePage])
```

---

## Task 4: Fix Blue Flicker + Add Tab Polish

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.jsx` (PageAccents, and the individual tab render cases)

The flicker has two likely causes:
1. No `-webkit-tap-highlight-color: transparent` — mobile browsers flash blue on touch
2. Missing `outline-none` on nav/interactive elements causes browser default blue focus ring to appear on first tab render

- [ ] **Step 1: Add global mobile tap/focus fixes to index.css**

Add these rules to `src/index.css` after the `::selection` block:
```css
* {
  -webkit-tap-highlight-color: transparent;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid rgba(125, 211, 252, 0.6);
  outline-offset: 2px;
}

button:focus:not(:focus-visible),
a:focus:not(:focus-visible) {
  outline: none;
}
```

- [ ] **Step 2: Polish Skills tab cards**

In the Skills case (App.jsx ~line 1639), update the SKILLS_MATRIX grid cards:
```jsx
<div key={group} className="glass rounded-[1.5rem] p-5 shadow-soft border-sky-300/10 hover:border-sky-300/25 transition-colors duration-300">
  <div className="flex items-center gap-3">
    <div className="rounded-2xl bg-sky-400/10 p-2.5 text-sky-300 border border-sky-300/20">
      <Icon className="h-4 w-4" />
    </div>
    <h4 className="text-base font-semibold text-white">{group}</h4>
  </div>
  ...
```

And update `ProficiencySkill` expanded state ring to be more visible:
```jsx
expanded ? 'ring-1 ring-sky-300/40 shadow-[0_0_20px_rgba(56,189,248,0.08)]' : 'hover:border-sky-300/15'
```

- [ ] **Step 3: Polish Impact tab cards**

In the `skills-proof` case (App.jsx ~line 1694), update the impact story cards to add a subtle left border accent and hover effect:
```jsx
className="glass rounded-[2rem] p-5 shadow-soft sm:p-6 border-l-2 border-l-sky-400/20 hover:border-l-sky-400/40 transition-colors duration-300"
```

And the `item.eyebrow` pill:
```jsx
<div className="mb-4 inline-flex rounded-full bg-sky-400/10 border border-sky-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
```

- [ ] **Step 4: Polish Education tab**

In the `education` case (App.jsx ~line 1740), update the institution cards:
```jsx
<div className="glass rounded-[2rem] px-4 py-6 shadow-soft sm:px-5 sm:py-7 hover:border-sky-300/20 transition-colors duration-300">
```

The honors card icon container:
```jsx
<div className="shrink-0 rounded-2xl bg-sky-400/10 p-3 text-sky-300 border border-sky-300/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
```

- [ ] **Step 5: Polish Resume tab**

In the `resume` case (App.jsx ~line 1875), the quick-access card already has blurs. Add a section label accent:

After the `SectionHeader`, add a small accent line at the top of the main card:
```jsx
<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
```

And ensure the highlights card gets the same accent treatment:
```jsx
<div className="glass rounded-[2rem] p-5 shadow-soft sm:p-7 border-sky-300/10 hover:border-sky-300/20 transition-colors duration-300">
```

- [ ] **Step 6: Polish Contact tab**

In the `contact` case (App.jsx ~line 1944), the main card already has blurs. Add the section header top accent line inside the card:
```jsx
<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
```

And update contact link cards to start with a more visible cyan glow on hover:
```jsx
className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0f172a]/70 p-5 transition duration-300 hover:border-sky-300/30 hover:bg-[#13203a]/85 hover:shadow-[0_15px_40px_rgba(56,189,248,0.15)]"
```

---

## Task 5: Redesign AskPortfolioWidget → DavisIntelligenceWidget

**Files:**
- Modify: `src/App.jsx` (rename function, redesign JSX, fix first message, fix input)

This is the largest visual change. The function at App.jsx:833 named `AskPortfolioWidget` needs to become `DavisIntelligenceWidget`. The floating button, popup header, and first message all change. The input needs explicit dark background + white text.

- [ ] **Step 1: Update function name and first message**

Change `function AskPortfolioWidget()` to `function DavisIntelligenceWidget()`.

Change the initial messages state from:
```js
const [messages, setMessages] = useState([
  {
    role: 'assistant',
    text: "Hi! I'm Davis's AI assistant. Ask me anything about his experience, projects, technical skills, education, or how to reach him.",
  },
])
```
to:
```js
const [messages, setMessages] = useState([
  {
    role: 'assistant',
    text: "Hey! I'm Davis Intelligence, an AI chatbot developed by Davis Higgins. I'm a portfolio assistant, trained to answer questions about Davis and his portfolio. Ask me about Davis's experience, projects, businesses, resume, technical skills, or goals.",
  },
])
```

- [ ] **Step 2: Redesign the floating button**

Replace the button JSX (App.jsx ~line 880–888):
```jsx
<button
  type="button"
  onClick={() => setOpen((o) => !o)}
  className="fixed bottom-6 right-6 z-[60] inline-flex items-center gap-2.5 rounded-full border border-sky-300/40 bg-gradient-to-br from-sky-400 to-cyan-300 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-[0_15px_40px_rgba(56,189,248,0.35)] transition hover:scale-105 hover:shadow-[0_20px_50px_rgba(56,189,248,0.5)] sm:px-7 sm:py-4 sm:text-[17px]"
  aria-label="Open Ask My Portfolio chat"
>
  {open ? <X className="h-[18px] w-[18px]" /> : <MessageCircle className="h-[18px] w-[18px]" />}
  {open ? 'Close' : 'Ask My Portfolio'}
</button>
```

with:
```jsx
<button
  type="button"
  onClick={() => setOpen((o) => !o)}
  className="fixed bottom-6 right-6 z-[60] inline-flex items-center gap-2.5 rounded-full border border-yellow-400/50 bg-[#0a1628] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(212,175,55,0.2)] transition hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.35)] sm:px-6 sm:py-3.5 sm:text-base"
  aria-label={open ? 'Close Davis Intelligence chat' : 'Open Davis Intelligence chat'}
>
  {open ? (
    <X className="h-4 w-4 text-slate-300" />
  ) : (
    <Sparkles className="h-4 w-4 text-yellow-300" />
  )}
  <span className={open ? 'text-slate-300' : 'text-white'}>
    {open ? 'Close' : 'Ask Davis AI'}
  </span>
</button>
```

- [ ] **Step 3: Redesign the popup header**

Replace the popup header div (App.jsx ~line 898–910):
```jsx
<div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-br from-sky-500/15 to-indigo-500/10 px-4 py-3">
  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-cyan-300 text-slate-950 shadow-[0_4px_15px_rgba(56,189,248,0.35)]">
    <Sparkles className="h-4 w-4" />
  </div>
  <div className="min-w-0 flex-1">
    <div className="text-sm font-semibold text-white">Ask My Portfolio</div>
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-sky-300">
      <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
      Davis's AI Assistant
    </div>
  </div>
</div>
```

with:
```jsx
<div className="flex items-center gap-3 border-b border-yellow-400/20 bg-gradient-to-br from-[#0d1f3c] to-[#0a1628] px-4 py-3.5">
  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 shadow-[0_4px_15px_rgba(212,175,55,0.2)]">
    <Brain className="h-4 w-4" />
  </div>
  <div className="min-w-0 flex-1">
    <div className="text-sm font-semibold text-white">Davis Intelligence</div>
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-yellow-400/80">
      <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
      Portfolio AI Assistant
    </div>
  </div>
  <button
    type="button"
    onClick={() => setOpen(false)}
    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white"
    aria-label="Close chat"
  >
    <X className="h-3.5 w-3.5" />
  </button>
</div>
```

- [ ] **Step 4: Update the popup container styling**

Change the popup motion.div className (App.jsx ~line 896–897) from:
```
className="fixed bottom-24 right-6 z-[60] flex w-[calc(100vw-3rem)] max-w-[26rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08111f]/95 shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl"
```
to:
```
className="fixed bottom-24 right-6 z-[60] flex w-[calc(100vw-3rem)] max-w-[26rem] flex-col overflow-hidden rounded-[1.5rem] border border-yellow-400/20 bg-[#08111f]/97 shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(212,175,55,0.08)] backdrop-blur-xl"
```

- [ ] **Step 5: Fix the input for visible text**

Replace the input container and input (App.jsx ~lines 957–967):
```jsx
<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition focus-within:border-sky-300/40 focus-within:bg-white/10">
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKey}
    disabled={loading}
    placeholder={loading ? 'Thinking…' : 'Ask a question…'}
    className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none disabled:opacity-60"
  />
```

with:
```jsx
<div className="flex items-center gap-2 rounded-full border border-white/15 bg-[#0d1f3c] px-3 py-1.5 transition focus-within:border-yellow-400/40 focus-within:shadow-[0_0_0_2px_rgba(212,175,55,0.1)]">
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKey}
    disabled={loading}
    placeholder={loading ? 'Thinking…' : 'Ask a question…'}
    className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-slate-500 outline-none caret-yellow-300 disabled:opacity-60"
    style={{ color: '#ffffff' }}
  />
```

- [ ] **Step 6: Update the footer disclaimer**

Change (App.jsx ~line 978):
```jsx
<p className="mt-1.5 text-[10px] text-slate-500">
  {'Powered by Claude. Answers may vary.'}
</p>
```
to:
```jsx
<p className="mt-1.5 text-[10px] text-slate-500">
  Davis Intelligence · Powered by Claude
</p>
```

- [ ] **Step 7: Update the call site**

In the App return JSX, change:
```jsx
<AskPortfolioWidget />
```
to:
```jsx
<DavisIntelligenceWidget />
```

---

## Task 6: Add Higgins Digital Case Study

**Files:**
- Modify: `src/App.jsx` (add new component, add state, add case study render)

The Propify case study uses `CaseStudyDropdown` (App.jsx:1104) and a corresponding state `caseStudyExpanded`. The Higgins Digital case study needs the same pattern.

- [ ] **Step 1: Add HD case study state to App component**

Add alongside `caseStudyExpanded`:
```js
const [hdCaseStudyExpanded, setHdCaseStudyExpanded] = useState(false)
```

- [ ] **Step 2: Add HigginsDigitalCaseStudy component**

Add the new component right after the `CaseStudyDropdown` function ends (~line 1319). Full component:

```jsx
function HigginsDigitalCaseStudy({ expanded, onToggle }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border border-sky-300/30 bg-white/[0.04] shadow-soft transition-all duration-300 ${
        expanded ? 'ring-1 ring-sky-300/40 shadow-[0_15px_50px_rgba(56,189,248,0.12)]' : ''
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-cyan-400/8 to-white/5" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.18),rgba(8,17,31,0.85))]" />

      <button
        type="button"
        onClick={onToggle}
        className="relative flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.02] sm:p-6"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_10px_25px_rgba(56,189,248,0.3)]">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200 sm:text-xs sm:tracking-[0.2em]">
              Deep Dive
            </div>
            <h3 className="mt-1.5 break-words text-xl font-semibold leading-tight text-white sm:text-2xl">
              Full Case Study: Higgins Digital
            </h3>
          </div>
        </div>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-sky-300 transition-transform duration-300 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden"
          >
            <div className="relative border-t border-white/10 px-5 pb-6 pt-6 sm:px-6 sm:pb-8">
              <p className="mb-6 text-sm leading-7 text-slate-300 sm:text-base">
                A full breakdown of how I built Higgins Digital from a personal idea into a polished web development brand: the problem, brand strategy, site architecture, design system, service positioning, and launch-ready execution.
              </p>

              <div className="space-y-6">
                {/* 01 - Problem */}
                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    01 · Problem
                  </div>
                  <h3 className="text-xl font-semibold text-white">A strong skill set needed a credible business presence.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Higgins Digital started from a simple gap: I was already building high-quality websites and digital tools, but I needed a brand that made the work feel as professional as the output. The goal was to create a digital presence that could communicate trust quickly, explain services clearly, and make the company feel legitimate to business owners, recruiters, and potential clients.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">User Pain</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Small businesses often need better websites, but agency pricing can feel unclear, inflated, or disconnected from the actual value delivered.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Market Gap</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">There was room for a lean, modern web development brand focused on performance, conversion, transparent communication, and full client ownership.</p>
                    </div>
                  </div>
                </div>

                {/* 02 - Approach */}
                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    02 · Approach
                  </div>
                  <h3 className="text-xl font-semibold text-white">Build the brand like a product, not a placeholder.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Rather than treating Higgins Digital as a basic landing page, I built it as a complete brand system. The site needed to show what I build, explain how I work, display pricing clearly, and prove that the same level of polish offered to clients was present in my own company platform.
                  </p>
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> Created a premium navy and gold visual system that feels professional, sharp, and memorable.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> Built a clear service structure around websites, custom platforms, redesigns, integrations, and client ownership.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> Designed project sections to show before-and-after improvements, not just screenshots.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> Developed concise copy that explains value quickly without sounding generic or inflated.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> Structured the experience around trust, clarity, conversion, and proof of execution.</li>
                  </ul>
                </div>

                {/* 03 - Architecture */}
                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    03 · Architecture
                  </div>
                  <h3 className="text-xl font-semibold text-white">Brand, content, and frontend working together.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    The site was designed as a full digital business system: brand identity, page structure, service positioning, project proof, calls to action, and responsive frontend execution all working together.
                  </p>
                  <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#08111f]/60 p-5 font-mono text-[11px] leading-6 text-slate-300 sm:text-xs">
                    <pre className="whitespace-pre">{`  ┌─────────────────────────────┐
  │  Brand Strategy + Positioning│
  └──────────────┬──────────────┘
                 ▼
  ┌─────────────────────────────┐
  │  Design System + UI Components│
  └──────────────┬──────────────┘
                 ▼
  ┌─────────────────────────────┐
  │  Service Pages + Pricing    │
  └──────────────┬──────────────┘
                 ▼
  ┌─────────────────────────────┐
  │  Project Proof + Case Studies│
  └──────────────┬──────────────┘
                 ▼
  ┌─────────────────────────────┐
  │  CTA Flow + Quote Requests  │
  └─────────────────────────────┘`}</pre>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Brand Layer</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Naming, positioning, navy/gold palette, logo usage, messaging, and trust-focused service framing.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Frontend</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">React, Vite, responsive components, animation polish, reusable sections, and performance-focused implementation.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Content System</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Service copy, pricing structure, project proof, FAQs, before-and-after comparisons, and conversion-focused calls to action.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Launch Workflow</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Production-ready site structure, source-code ownership, clean deployment workflow, and scalable future updates.</p>
                    </div>
                  </div>
                </div>

                {/* 04 - Key Decisions */}
                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    04 · Key Decisions
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-semibold text-white">Use pricing clarity as a trust signal.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">The site presents packages and service ranges clearly so potential clients immediately understand the level of work, expected investment, and value behind each option.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Lead with transformation proof, not vague promises.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">Project sections emphasize before-and-after improvements, stronger user experience, cleaner structure, better trust signals, and a more professional digital presence.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Keep the copy direct and business-focused.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">The messaging avoids overused agency language and focuses on what business owners actually care about: credibility, speed, usability, ownership, and conversion.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Treat the brand as a long-term platform.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">The site was structured so Higgins Digital can grow beyond a portfolio page into a real company presence with future case studies, quote flows, client portals, and internal tools.</p>
                    </div>
                  </div>
                </div>

                {/* 05 - Tradeoffs */}
                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    05 · Tradeoffs
                  </div>
                  <div className="space-y-3 text-sm leading-7 text-slate-300">
                    <p><span className="font-semibold text-white">Visual polish vs. performance:</span> the site uses animation and rich visuals, but they need to stay lightweight, responsive, and fast enough to support the brand's performance-first promise.</p>
                    <p><span className="font-semibold text-white">Detailed services vs. simple decision-making:</span> the site explains multiple service types without overwhelming visitors who just want to understand what Higgins Digital can build for them.</p>
                    <p><span className="font-semibold text-white">Personal founder brand vs. company brand:</span> the site needed to benefit from Davis Higgins's credibility while still making Higgins Digital feel like a standalone business.</p>
                    <p><span className="font-semibold text-white">Premium feel vs. accessibility:</span> the dark navy and gold aesthetic needed enough contrast, readable text, and clear interaction states across every screen size.</p>
                  </div>
                </div>

                {/* 06 - Results */}
                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    06 · Results
                  </div>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-sky-300/30 bg-sky-400/10 p-5">
                      <div className="text-3xl font-bold text-white">1</div>
                      <div className="mt-1 text-sm text-slate-300">Full company platform</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">5+</div>
                      <div className="mt-1 text-sm text-slate-300">Core service paths</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">60-75%</div>
                      <div className="mt-1 text-sm text-slate-300">Below typical agency quotes</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">100%</div>
                      <div className="mt-1 text-sm text-slate-300">Client source-code ownership</div>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-300">
                    Higgins Digital became more than a personal project. It became a professional web development brand with clear service positioning, polished visuals, strong project proof, transparent pricing, and a conversion-focused structure. The result is a company platform that shows what I can build while also serving as a real client acquisition channel.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a href="https://higginsd.com/" target="_blank" rel="noreferrer" className="primary-btn">
                    Live Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 3: Render HD case study in the Projects tab**

In the projects render loop (App.jsx ~line 1626), the Propify check renders `CaseStudyDropdown`. Add a parallel check after it for Higgins Digital:

```jsx
{project.title === 'Propify' ? (
  <CaseStudyDropdown
    expanded={caseStudyExpanded}
    onToggle={() => setCaseStudyExpanded((v) => !v)}
  />
) : null}
{project.title === 'Higgins Digital' ? (
  <HigginsDigitalCaseStudy
    expanded={hdCaseStudyExpanded}
    onToggle={() => setHdCaseStudyExpanded((v) => !v)}
  />
) : null}
```

---

## Task 7: QA + Production Build

**Files:**
- `src/App.jsx` (final check for any missed `AskPortfolioWidget` references)

- [ ] **Step 1: Verify no "Ask My Portfolio" references remain**

Search for `Ask My Portfolio`, `AskPortfolio`, `openAssistant` in `src/App.jsx`.
Expected: zero matches.

- [ ] **Step 2: Run dev server and visually verify**

Run: `npm run dev`
Check:
- Floating button says "Ask Davis AI"
- Click it → header says "Davis Intelligence", subtext says "Portfolio AI Assistant"
- First message matches required text
- Type in input → text is visible
- Old "Ask My Portfolio" button is gone
- Nav order: Home, Experience, Projects, Education, Skills, Impact, Resume, Contact
- Hero tagline shows "Web Developer | Digital Creator"
- Hamburger menu appears on narrow viewport
- Projects tab has Higgins Digital case study with expand button
- Skills/Impact/Education/Resume/Contact open without blue flash

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: zero errors, `dist/` folder created.

- [ ] **Step 4: Fix any build errors**

If build fails, fix the specific error and re-run.

---

## Self-Review Checklist

**Spec coverage:**
- [x] Remove "Ask My Portfolio" → Task 1 (remove from index.html) + Task 5 (rename widget)
- [x] Davis Intelligence identity → Task 5 (button text, header, subtext, first message, popup design)
- [x] Fix input visibility → Task 5 Step 5
- [x] Hero tagline update → Task 2 Step 2
- [x] Blue flicker fix → Task 4 (tap highlight + focus styles)
- [x] Nav reorder → Task 2 Step 1
- [x] Hamburger menu → Task 3
- [x] Higgins Digital case study → Task 6
- [x] API response field bug fix → Task 1 Step 2

**Placeholder scan:** None — all steps contain exact code.

**Type consistency:** The new `HigginsDigitalCaseStudy` component uses the same prop signature `{ expanded, onToggle }` as `CaseStudyDropdown`. State variable `hdCaseStudyExpanded` matches the call site.
