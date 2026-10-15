#!/usr/bin/env node
// Renders the code-native project visuals to PNG masters in media-src/designed/.
// These cover projects with no approved public imagery (private professional work)
// or with real data that is clearer redrawn in the portfolio's visual language.
// Every illustrative image is labeled as illustrative inside the image itself and
// contains no employer or client data. Numbers shown come from the case studies.
//
//   node scripts/render-designed-media.mjs

/* global document -- used inside Playwright page callbacks */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'media-src', 'designed')
fs.mkdirSync(outDir, { recursive: true })

const interFont = `data:font/woff2;base64,${fs
  .readFileSync(path.join(root, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'))
  .toString('base64')}`

const base = `
@font-face { font-family: 'Inter'; src: url('${interFont}') format('woff2'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1600px; height: 900px; overflow: hidden; }
body {
  font-family: 'Inter', system-ui, sans-serif; color: #e2e8f0; -webkit-font-smoothing: antialiased;
  background:
    radial-gradient(circle at 18% 0%, rgba(56,189,248,.22), transparent 38%),
    radial-gradient(circle at 100% 40%, rgba(99,102,241,.18), transparent 40%),
    linear-gradient(180deg, #0a1322 0%, #07101d 55%, #060d18 100%);
  position: relative;
}
.grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px); background-size: 52px 52px; }
.wrap { position: absolute; inset: 64px 72px; }
.eyebrow { display: inline-flex; gap: 10px; align-items: center; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.05); border-radius: 999px; padding: 10px 20px; font-size: 18px; letter-spacing: .22em; text-transform: uppercase; color: #7dd3fc; font-weight: 600; }
.badge { position: absolute; right: 0; top: 0; border: 1px solid rgba(253,224,71,.35); background: rgba(253,224,71,.08); color: #fde68a; border-radius: 999px; padding: 10px 20px; font-size: 17px; font-weight: 600; letter-spacing: .06em; }
.glass { border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.04); border-radius: 28px; }
h1 { font-size: 64px; font-weight: 650; letter-spacing: -.02em; color: #fff; line-height: 1.05; }
.muted { color: #94a3b8; }
.cyan { color: #67e8f9; }
.node { border: 1px solid rgba(125,211,252,.35); background: rgba(14,30,52,.85); border-radius: 22px; padding: 22px 24px; }
.node b { display: block; font-size: 25px; color: #fff; font-weight: 650; }
.node span { display: block; margin-top: 8px; font-size: 19px; color: #94a3b8; line-height: 1.4; }
.arrow { color: #38bdf8; font-size: 34px; display: flex; align-items: center; justify-content: center; }
.foot { position: absolute; left: 0; bottom: 0; font-size: 17px; color: #64748b; letter-spacing: .02em; }
`

const bars = (values, heights) =>
  values
    .map(
      (v, i) => `<div style="display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:12px;flex:1">
        <div style="font-size:30px;font-weight:700;color:#fff">${v.value}</div>
        <div style="width:100%;height:${heights[i]}px;border-radius:18px 18px 6px 6px;background:${v.color}"></div>
        <div style="font-size:21px;color:#cbd5e1;font-weight:600">${v.label}</div>
        <div style="font-size:16px;color:#64748b">${v.sub}</div></div>`,
    )
    .join('')

const PAGES = {
  'kewaunee-analytics-cover': `
    <div class="grid"></div><div class="wrap">
      <div class="eyebrow">Executive analytics</div>
      <div class="badge">Illustrative · no company data</div>
      <div style="position:absolute;top:110px;left:0;right:0;bottom:40px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;grid-template-rows:150px 1fr;gap:22px">
        ${['Pipeline', 'Bids', 'Quotes', 'Expiring'].map((k, i) => `<div class="glass" style="padding:24px"><div class="muted" style="font-size:18px;letter-spacing:.14em;text-transform:uppercase">${k}</div><div style="margin-top:22px;height:14px;width:${[70, 55, 82, 40][i]}%;border-radius:8px;background:linear-gradient(90deg,#38bdf8,#22d3ee)"></div><div style="margin-top:14px;height:10px;width:${[45, 60, 35, 68][i]}%;border-radius:8px;background:rgba(148,163,184,.35)"></div></div>`).join('')}
        <div class="glass" style="grid-column:span 2;padding:30px;display:flex;align-items:flex-end;gap:16px">
          ${[38, 52, 46, 64, 58, 72, 66, 84, 78, 90].map((h) => `<div style="flex:1;height:${h}%;border-radius:10px 10px 4px 4px;background:linear-gradient(180deg,rgba(56,189,248,.95),rgba(56,189,248,.25))"></div>`).join('')}
        </div>
        <div class="glass" style="padding:30px;display:flex;align-items:center;justify-content:center">
          <div style="width:250px;height:250px;border-radius:50%;background:conic-gradient(#38bdf8 0 42%,#818cf8 42% 67%,#22d3ee 67% 84%,rgba(148,163,184,.35) 84%);-webkit-mask:radial-gradient(circle,transparent 52%,#000 53%);mask:radial-gradient(circle,transparent 52%,#000 53%)"></div>
        </div>
        <div class="glass" style="padding:30px;display:flex;flex-direction:column;gap:18px;justify-content:center">
          ${[88, 72, 64, 50, 36].map((w) => `<div style="height:16px;width:${w}%;border-radius:8px;background:rgba(125,211,252,.55)"></div>`).join('')}
        </div>
      </div>
    </div>`,
  'kewaunee-analytics-detail': `
    <div class="grid"></div><div class="wrap">
      <div class="eyebrow">Reporting workflow</div>
      <div class="badge">Illustrative workflow · no company data</div>
      <h1 style="margin-top:34px;font-size:52px">From a stakeholder question to a dashboard leadership uses</h1>
      <div style="position:absolute;top:250px;left:0;right:0;display:grid;grid-template-columns:1fr 50px 1fr 50px 1fr 50px 1fr;align-items:stretch">
        <div class="node"><b>Stakeholder question</b><span>Sales, engineering, estimating, operations, and leadership requests</span></div><div class="arrow">→</div>
        <div class="node"><b>Validated records</b><span>2,000+ CRM records cleaned, validated, and restructured</span></div><div class="arrow">→</div>
        <div class="node"><b>Model + definitions</b><span>Data models, DAX measures, KPI definitions, and data dictionaries</span></div><div class="arrow">→</div>
        <div class="node" style="border-color:rgba(103,232,249,.6)"><b>Executive reporting</b><span>20+ dashboards, 100+ KPI visuals, automated recurring reports</span></div>
      </div>
      <div class="glass" style="position:absolute;left:0;right:0;bottom:40px;padding:26px 30px;display:flex;gap:40px;font-size:21px">
        <div><span class="cyan" style="font-weight:700">Tools</span> <span class="muted">Power BI · DAX · Zoho Analytics · Zoho CRM · SQL · Excel</span></div>
        <div><span class="cyan" style="font-weight:700">Principle</span> <span class="muted">Start from the decision, then define the data</span></div>
      </div>
    </div>`,
  'one-chaptr-cover': `
    <div class="grid"></div><div class="wrap">
      <div class="eyebrow">Multi-tenant storefronts</div>
      <div class="badge">Illustrative · not client screens</div>
      <div style="position:absolute;top:120px;left:0;right:0;bottom:30px;display:grid;grid-template-columns:repeat(3,1fr);gap:28px">
        ${[['#38bdf8', 'Storefront A'], ['#a78bfa', 'Storefront B'], ['#34d399', 'Storefront C']].map(([c, n]) => `
        <div class="glass" style="padding:24px;display:flex;flex-direction:column;gap:18px">
          <div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;gap:10px;align-items:center"><div style="width:34px;height:34px;border-radius:10px;background:${c}"></div><div style="font-size:21px;font-weight:650;color:#fff">${n}</div></div><div style="width:70px;height:12px;border-radius:6px;background:rgba(148,163,184,.4)"></div></div>
          <div style="height:150px;border-radius:18px;background:linear-gradient(135deg,${c}55,rgba(255,255,255,.04))"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;flex:1">
            ${[0, 1, 2, 3].map(() => `<div style="border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);display:flex;flex-direction:column;justify-content:flex-end;padding:12px;gap:8px"><div style="height:10px;width:70%;border-radius:5px;background:rgba(226,232,240,.5)"></div><div style="height:10px;width:40%;border-radius:5px;background:${c}"></div></div>`).join('')}
          </div>
        </div>`).join('')}
      </div>
      <div class="foot">One shared codebase · tenant configuration · reusable component schemas</div>
    </div>`,
  'one-chaptr-detail': `
    <div class="grid"></div><div class="wrap">
      <div class="eyebrow">Platform architecture</div>
      <div class="badge">Illustrative architecture</div>
      <h1 style="margin-top:34px;font-size:52px">Configuration decides how a store looks.<br><span class="cyan">Contracts decide how it behaves.</span></h1>
      <div style="position:absolute;top:300px;left:0;right:0;display:grid;grid-template-columns:1fr 46px 1.15fr 46px 1fr 46px 1fr;align-items:stretch">
        <div class="node"><b>Tenant configuration</b><span>Brand, catalog presentation, and storefront settings per client</span></div><div class="arrow">→</div>
        <div class="node" style="border-color:rgba(103,232,249,.6)"><b>Shared Next.js + TypeScript codebase</b><span>63-component UI system with schemas and complete loading, empty, error, and success states</span></div><div class="arrow">→</div>
        <div class="node"><b>Typed provider boundary</b><span>Data models and mock providers used today</span></div><div class="arrow" style="color:#64748b">⇢</div>
        <div class="node" style="border-style:dashed;border-color:rgba(148,163,184,.5);background:rgba(14,30,52,.4)"><b>InkSoft integration</b><span>Planned · prepared through typed API boundaries, not yet live</span></div>
      </div>
    </div>`,
  'nypd-crime-data-analysis-cover': `
    <div class="grid"></div><div class="wrap">
      <div class="eyebrow">NYPD Hate Crimes open data</div>
      <h1 style="margin-top:30px;font-size:54px">Reported hate crimes per month</h1>
      <div class="muted" style="margin-top:12px;font-size:22px">Normalized by period length · values from the final report</div>
      <div style="position:absolute;left:40px;right:40px;top:290px;bottom:70px;display:flex;gap:70px;align-items:stretch">
        ${bars(
          [
            { value: '36.0', label: 'Pre-COVID', sub: 'Jan 2019 – Feb 2020', color: 'linear-gradient(180deg,#7dd3fc,#0ea5e9)' },
            { value: '36.6', label: 'During COVID', sub: 'Mar 2020 – Dec 2021', color: 'linear-gradient(180deg,#a5b4fc,#6366f1)' },
            { value: '49.9', label: 'Post-COVID', sub: 'Jan 2022 – Apr 2025', color: 'linear-gradient(180deg,#67e8f9,#06b6d4)' },
          ],
          [252, 256, 350],
        )}
      </div>
      <div class="foot">Reported incidents only · association, not causation</div>
    </div>`,
  'census-data-analysis-cover': `
    <div class="grid"></div><div class="wrap" style="display:flex;align-items:center;justify-content:center">
      <div style="width:1060px;height:740px;border-radius:26px;background:#f8fafc;color:#0f172a;box-shadow:0 40px 120px rgba(0,0,0,.5);padding:80px 90px;position:relative;display:flex;flex-direction:column;justify-content:center;text-align:center">
        <div style="font-size:19px;letter-spacing:.24em;text-transform:uppercase;color:#0369a1;font-weight:700">Team research paper · DTSC 1302</div>
        <div style="margin-top:34px;font-size:56px;line-height:1.12;font-weight:700;letter-spacing:-.01em">The Impact of Race, Sex, Years of Education, and Age on Salary</div>
        <div style="margin:40px auto 0;width:120px;height:4px;border-radius:2px;background:#0ea5e9"></div>
        <div style="margin-top:36px;font-size:23px;color:#334155;line-height:1.5">Davis Higgins, Chris Loor-Luna, Cory Nguyen,<br>Tam Khong &amp; Jeffrey Alvarez</div>
        <div style="margin-top:20px;font-size:19px;color:#64748b">School of Data Science · UNC Charlotte · December 2024</div>
      </div>
    </div>`,
  'prospectiq-detail': `
    <div class="grid"></div><div class="wrap">
      <div class="eyebrow">ProspectIQ pipeline</div>
      <h1 style="margin-top:30px;font-size:50px">One normalization boundary, one auditable record</h1>
      <div style="position:absolute;top:220px;left:0;right:0;display:grid;grid-template-columns:repeat(7,1fr);gap:14px">
        ${[
          ['CLI input', 'Command line or interactive menu'],
          ['Source modules', '8 platforms behind one registry'],
          ['Lead model', 'Lead.from_raw normalizes every source'],
          ['Enrichment', 'Websites, domains, MX records'],
          ['Verification', 'Pattern inference, optional SMTP'],
          ['Scoring', '0–100, every point a named signal'],
          ['CSV export', 'Provenance + injection-safe'],
        ].map(([t, s], i) => `<div class="node" style="padding:18px;${i === 2 ? 'border-color:rgba(103,232,249,.7)' : ''}"><div style="font-size:15px;color:#38bdf8;font-weight:700;letter-spacing:.12em">0${i + 1}</div><b style="font-size:22px;margin-top:6px">${t}</b><span style="font-size:17px">${s}</span></div>`).join('')}
      </div>
      <div style="position:absolute;left:0;right:0;bottom:30px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px">
        <div class="glass" style="padding:24px"><div class="cyan" style="font-weight:700;font-size:21px">Every record keeps</div><div class="muted" style="margin-top:10px;font-size:19px;line-height:1.5">email source · confidence · verification status · company domain · score · platform · timestamp</div></div>
        <div class="glass" style="padding:24px"><div class="cyan" style="font-weight:700;font-size:21px">Observed ≠ inferred</div><div class="muted" style="margin-top:10px;font-size:19px;line-height:1.5">A published address and a pattern-inferred guess are labeled differently in the export.</div></div>
        <div class="glass" style="padding:24px"><div class="cyan" style="font-weight:700;font-size:21px">Responsible limits</div><div class="muted" style="margin-top:10px;font-size:19px;line-height:1.5">No CAPTCHA solving, block evasion, private data, or automated messaging.</div></div>
      </div>
    </div>`,
}

const only = new Set(process.argv.slice(2))
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 })
for (const [id, body] of Object.entries(PAGES)) {
  if (only.size && !only.has(id)) continue
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${base}</style></head><body>${body}</body></html>`)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(outDir, `${id}.png`) })
  console.log('rendered', id)
}
await browser.close()
