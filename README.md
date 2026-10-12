<p align="center">
  <a href="https://davishiggins.com"><img src="assets/hero.svg" width="100%" alt="Davis Higgins personal portfolio. Animated cover: the DH mark and DAVIS HIGGINS in tall condensed type on pale blue beside a flowing field of navy wave lines with a drifting Carolina Blue spotlight." /></a>
</p>

<h1 align="center">Portfolio</h1>

<p align="center"><strong>My personal portfolio at davishiggins.com: a motion-led, editorial home for my work, experience, and the projects I build across data, AI, and the web.</strong></p>

<p align="center">
  <a href="https://davishiggins.com"><img src="assets/btn-open.svg" height="44" alt="Visit davishiggins.com" /></a>&nbsp;
  <a href="https://davishiggins.com/work"><img src="assets/btn-work.svg" height="44" alt="Work" /></a>&nbsp;
  <a href="https://www.higginsd.com/work/davishiggins-com"><img src="assets/btn-case.svg" height="44" alt="Case study" /></a>
</p>

<p align="center"><sub>Live · Built by Davis Higgins</sub></p>

---

## See it in motion

<p align="center">
  <img src="assets/demo.gif" width="760" alt="Screen recording of davishiggins.com: the animated wave-line field and DAVIS HIGGINS title, scrolling into the about and highlights sections, then opening the Work page." />
</p>

<p align="center"><sub>Real capture of the live site: home scroll scene, then the Work route. <a href="assets/demo.png">Static frame</a></sub></p>

## What it does

- **An identity first.** A full-width animated wave field and an oversized name set the tone before any copy appears. The header carries location, a contrast toggle, social links, and a résumé link.
- **The work, organized.** A Work route presents each project with its category, a short description, the tools behind it, and a link to the live product. Portfolio and Domains pages map everything I run across the web.
- **Me, briefly.** About and Contact routes cover experience, current roles, and the fastest ways to reach me.

## Why I built it

I wanted a portfolio that feels designed, not templated, and that can grow as fast as my project list does. It needed room for analytics work, client websites, and AI systems without forcing them all into one generic card.

## What I built

- **A multi-route site:** Work, About, Contact, Portfolio, and Domains pages with route heroes and a project grid
- **Custom components:** the project grid, an interactive cursor trail, flip-text links, running-line dividers, a systems section, and a closing footer
- **A single content layer** for my identity, experience, skills, projects, and links, so updates never touch layout
- **My brand throughout:** navy and Carolina Blue, the DH mark, and a header verse typewriter
- **Content carried over** from earlier versions of davishiggins.com, including projects, experience, and the full link ecosystem

<details>
<summary><strong>How it's put together</strong></summary>

<br />

```mermaid
flowchart TB
    D[Site content<br/>identity · experience · projects · links] --> P[Pages and components]
    T[Design tokens<br/>color · type · breakpoints] --> P
    P --> H[Fast static pages]
    H --> M[Motion layer]
```

| Decision | Why |
|---|---|
| **Static first** | Pages ship as plain HTML and load JavaScript only where motion needs it, so the site stays fast even with heavy visual effects. |
| **Content separate from layout** | Adding a project is a content change, not a component edit. |
| **One token system** | Colors, type, and breakpoints come from one source, so the contrast theme switches cleanly across every page. |

</details>

## Screens

<table>
  <tr>
    <td width="62%"><img src="assets/screenshot-home.png" alt="davishiggins.com homepage: a dense field of navy wave lines above the title DAVIS DH HIGGINS in tall condensed type." /></td>
    <td rowspan="2" width="38%" align="center"><img src="assets/screenshot-mobile.png" width="300" alt="davishiggins.com homepage on a phone with the wave field and stacked DAVIS HIGGINS title." /></td>
  </tr>
  <tr>
    <td><img src="assets/screenshot-work.png" alt="davishiggins.com Work page listing Cade (AI systems) and Higgins Building Group (client website) with descriptions and tool tags." /></td>
  </tr>
</table>

<sub>Homepage · Work · Homepage on mobile</sub>

## Technology

| Layer | Technology |
|---|---|
| Framework | Astro, TypeScript |
| Styling | Sass, CSS custom properties |
| Motion | GSAP, Lenis, canvas and WebGL effects |
| Hosting | Vercel |

---

<p align="center">
  <a href="https://davishiggins.com"><img src="assets/btn-open.svg" height="44" alt="Visit davishiggins.com" /></a>&nbsp;
  <a href="https://github.com/DavisHiggins"><img src="assets/btn-more.svg" height="44" alt="More of my work" /></a>
</p>

<p align="center"><sub>© 2026 Davis Higgins. Site foundation adapted from AW-2025-Portfolio by Antoine Wodniack (CC BY-NC 4.0).</sub></p>
