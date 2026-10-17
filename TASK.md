# TASK.md - Portfolio AI Assistant, Navigation, Tab Polish, and Higgins Digital Case Study

## Primary Objective

Implement a polished portfolio update that makes the Davis AI assistant feel intentional, premium, and aligned with the rest of the portfolio. Also clean up navigation responsiveness, remove the older unused portfolio assistant button, fix a visual tab flicker issue, update the hero tagline, and add a new Higgins Digital case study to the Projects tab using the existing Propify case study layout as the design reference.

The goal is not to redesign the entire portfolio. Keep the current structure, style, spacing language, dark navy aesthetic, typography, animations, and overall brand direction. Make targeted, high-quality improvements that feel native to the current site.

---

## Global Rules Before Editing

1. Inspect the existing project structure before making changes.
2. Do not rewrite unrelated components.
3. Do not change routing unless required for the requested functionality.
4. Preserve the current portfolio design system and only enhance it.
5. Keep all changes responsive for desktop, tablet, and phone.
6. Use existing components, utilities, colors, spacing values, animation patterns, and data structures whenever possible.
7. If a repeated button, label, or case study component already exists, update the source of truth instead of patching only one page.
8. After implementation, run the project locally and fix all build, lint, import, and console errors.
9. After implementation, verify the portfolio works on:
   - Full desktop width
   - Narrow desktop browser width
   - Tablet width
   - Phone width
10. Do not leave unused imports, unused components, or old assistant code behind.

---

# 1. Remove the Old "Ask My Portfolio" Button Everywhere

## Current Issue

The portfolio now uses the Davis AI / Davis Intelligence assistant, so the old "Ask My Portfolio" button is no longer needed. It should be completely removed across the entire portfolio.

## Required Implementation

Completely remove every visible instance of:

- "Ask My Portfolio"
- Any button, floating trigger, CTA, nav item, or card that opens the old assistant
- Any old assistant component if it is no longer used
- Any old assistant state, imports, handlers, styles, and references

## Important

Do not remove the new Davis AI / Davis Intelligence assistant. Only remove the old "Ask My Portfolio" feature.

## Search Terms to Check

Use project-wide search for:

- `Ask My Portfolio`
- `Portfolio Assistant`
- `portfolio assistant`
- `assistant`
- `chat`
- `ChatWidget`
- `AIWidget`
- `AskPortfolio`
- `openAssistant`
- `setAssistant`
- `FloatingAssistant`

Only remove the old unused feature. Preserve and improve the current Davis AI assistant.

## Acceptance Criteria

- "Ask My Portfolio" does not appear anywhere in the UI.
- There is only one AI assistant entry point on the portfolio.
- There are no unused imports or console errors after removing it.
- The Davis Intelligence / Davis AI tool still opens and functions correctly.

---

# 2. Fix the Blue Flicker on Skills, Impact, Education, Resume, and Contact Tabs

## Current Issue

When opening the Skills, Impact, Education, Resume, and Contact tabs, there is a weird blue visual flicker that appears briefly, then disappears. This looks like a visual glitch and should be removed.

## Required Implementation

Find the source of the flicker and remove it cleanly. Possible causes to inspect:

- Initial route transition background color
- Framer Motion enter animation with the wrong background color
- Temporary loading state
- `:focus`, `:active`, or tap highlight styles
- Browser default focus outline or mobile tap highlight
- Incorrect initial animation opacity or box shadow
- A global blue overlay or gradient applied during mount
- Conditional tab content rendering with a flash of a default style
- CSS transitions applying before the correct class is loaded

## Important Design Direction

While removing the flicker, do not make these tabs flatter or less interesting. Instead, make them feel slightly more polished and visually connected to the more colorful tabs.

Add more light blue accents, edges, and subtle animations throughout the following tabs:

- Skills
- Impact
- Education
- Resume
- Contact

The new accents should match the rest of the portfolio exactly. Use the same dark navy, light blue, cyan, muted gold, glass, border, and glow language already present throughout the portfolio. Do not introduce a new color palette.

## Specific Visual Improvements to Add

Use subtle enhancements such as:

- Thin light blue/cyan borders on cards
- Soft cyan edge glows on hover
- Slight animated gradient border highlights
- Small cyan section labels or pills
- Light blue icon accents
- Card hover lift using existing motion style
- Active tab underline or glow that matches the rest of the site
- Subtle background radial glow behind major content sections
- Consistent section dividers with faint blue/gold lines

## Avoid

- Bright electric blue blocks
- Heavy neon effects
- Overpowering gradients
- Excessive movement
- Layout shifts
- Animations that hurt readability
- Any change that makes the tabs look disconnected from the rest of the site

## Acceptance Criteria

- The blue flicker is gone on Skills, Impact, Education, Resume, and Contact.
- Opening each tab feels smooth and premium.
- These tabs have slightly more visual color and polish than before.
- Colors still match the existing portfolio design.
- No route/page animation causes a flash or layout jump.
- No console errors.

---

# 3. Update the Hero / Intro Tagline

## Current Text to Replace

Replace this exact text wherever it appears:

`Data Analyst | Data Science & AI | Statistical Modeling | Predictive Analytics`

## New Text

`Data Analyst | Data Science & AI | Web Developer | Digital Creator`

## Implementation Notes

- Update the source of truth, not just one rendered instance.
- Check desktop and mobile layouts after updating.
- Make sure line wrapping looks clean on smaller screens.
- The new tagline should visually match the existing typography and spacing.

## Acceptance Criteria

- The old tagline no longer appears anywhere.
- The new tagline appears correctly on the portfolio.
- The tagline looks clean on desktop and mobile.

---

# 4. Redesign and Fix the Davis Intelligence AI Assistant

## Current Issue

The Davis Intelligence / Davis AI assistant currently has a major usability issue: the text input where users type questions has white text on a white background, making typed text impossible to see.

The assistant also needs to look more pronounced, premium, noticeable, and aligned with the portfolio.

## Required Assistant Identity

Use the following exact assistant identity:

### Name

`Davis Intelligence`

### Floating Button Text

`Ask Davis AI`

### Open Header

`Davis Intelligence`

### Subtext

`Portfolio AI Assistant`

### First Message

Use this exact first message:

`Hey! I'm Davis Intelligence, an AI chatbot developed by Davis Higgins. I'm a portfolio assistant, trained to answer questions about Davis and his portfolio. Ask me about Davis’s experience, projects, businesses, resume, technical skills, or goals.`

## Floating Button Design

Replace the current floating trigger with a more noticeable premium pill button.

### Visual Requirements

- Dark navy pill button
- Gold border
- Subtle gold glow
- Small AI, sparkle, chat, or lightning icon
- Text: `Ask Davis AI`
- Smooth hover expansion
- Slight scale-up on hover
- Soft glow increase on hover
- Placed in the bottom-right corner
- Must not block core content
- Must stay visible while scrolling
- Must remain usable on mobile

## Suggested Interaction

Default state:

`[icon] Ask Davis AI`

Hover state:

- Button slightly expands
- Glow becomes stronger
- Optional short helper text can appear if it does not clutter the layout, such as:
  - `Ask about Davis`
  - `Portfolio AI Assistant`

## Popup Design Requirements

The opened AI chat popup should feel like a polished mini product, not a default chatbot.

### Header

Include:

- `Davis Intelligence`
- `Portfolio AI Assistant`
- Small icon or monogram
- Close button
- Optional subtle status pill like `Online` or `AI Guide`, if it fits the current style

### Body

- Dark navy / glassmorphism background
- Thin blue/cyan/gold border accents
- Soft inner glow or radial highlight
- Messages should have clear visual hierarchy
- Assistant messages should be readable
- User messages should be visually distinct
- Keep spacing comfortable and professional
- Match portfolio fonts and radius values

### Input Fix

Fix the text entry box completely.

The typed text must be visible in all states:

- Normal state
- Focus state
- Hover state
- Disabled/loading state
- Mobile state

Preferred input styling:

- Dark navy or very dark blue input background
- White or near-white typed text
- Muted light-blue placeholder text
- Gold or cyan focus border
- Visible caret
- Clear send button
- Send button disabled state still readable

Do not use white text on a white background.

## Functional Requirements

- The assistant must still call the existing Claude API integration successfully.
- Do not expose the API key client-side if the existing code already protects it.
- Do not break current environment variable handling.
- Preserve the existing API route/serverless function structure unless there is a clear issue.
- Preserve the current conversation behavior unless it conflicts with the new first message.
- The assistant should load with the required first message visible.
- The user should be able to type, send, and read responses clearly.

## Responsive Requirements

On mobile:

- Floating pill can shrink if needed, but text should still be readable.
- Popup should fit within the viewport.
- Popup should not overflow horizontally.
- Input should be easy to tap.
- Close button should be easy to tap.
- Do not let the popup cover the entire screen unless that is the cleanest responsive solution.

## Acceptance Criteria

- Floating button reads `Ask Davis AI`.
- Open header reads `Davis Intelligence`.
- Subtext reads `Portfolio AI Assistant`.
- First assistant message matches the required text exactly.
- User input text is clearly visible while typing.
- Popup styling matches the portfolio.
- Assistant still works with the existing Claude API.
- No old "Ask My Portfolio" feature remains.

---

# 5. Make Navigation Responsive With a Hamburger Menu

## Current Issue

When users shrink the portfolio page on a computer or view it on a phone, the tab navigation becomes cramped.

## Required Implementation

When the available width is too small for the full tab row, collapse the tabs into a clean hamburger menu.

## Desktop Navigation

On full desktop width, show tabs horizontally in this exact left-to-right order:

1. Home
2. Experience
3. Projects
4. Education
5. Skills
6. Impact
7. Resume
8. Contact

## Mobile / Narrow Navigation

On smaller widths:

- Hide the cramped horizontal tab row.
- Show a three-line hamburger button.
- When clicked, open a clean tab menu.
- The tab menu should display the same tab order:
  1. Home
  2. Experience
  3. Projects
  4. Education
  5. Skills
  6. Impact
  7. Resume
  8. Contact
- Menu should close when a tab is selected.
- Menu should close when clicking outside, if possible.
- Menu should be keyboard accessible where practical.
- Menu should match the site design:
  - Dark navy background
  - Light blue/cyan border accents
  - Soft glow
  - Clean hover states
  - Current tab clearly highlighted
  - Smooth open/close animation

## Suggested Breakpoint

Use the breakpoint that best fits the existing design. Likely around 768px to 1024px, depending on the current tab spacing.

Do not force the horizontal nav if it looks cramped.

## Acceptance Criteria

- Desktop tab order is exactly: Home, Experience, Projects, Education, Skills, Impact, Resume, Contact.
- Narrow screens use a hamburger menu.
- Mobile navigation does not look crammed.
- Menu opens and closes smoothly.
- Selecting a tab works correctly.
- Current tab is visibly active.
- No layout shift or overflow occurs.

---

# 6. Add Higgins Digital Case Study to the Projects Tab

## Goal

Add a new Higgins Digital case study to the Projects tab. Use the existing Propify case study shown in the portfolio as the direct implementation and visual inspiration.

The new case study should feel like it belongs next to the Propify case study. Reuse the same card, accordion, deep dive, metric, architecture, and section design patterns wherever possible.

## Required Case Study Title

`Full Case Study: Higgins Digital`

## Suggested Label

Use the same small label style as Propify. Suggested label:

`DEEP DIVE`

## Intro Summary

Use this copy:

`A full breakdown of how I built Higgins Digital from a personal idea into a polished web development brand: the problem, brand strategy, site architecture, design system, service positioning, and launch-ready execution.`

## Case Study Sections

Build the case study using the same structure and styling as the Propify case study screenshot:

- 01 - Problem
- 02 - Approach
- 03 - Architecture
- 04 - Key Decisions
- 05 - Tradeoffs
- 06 - Results

If the existing Propify case study uses the same section component, feed the content below into that structure.

---

## Higgins Digital Case Study Content

### 01 - Problem

#### Heading

`A strong skill set needed a credible business presence.`

#### Body

`Higgins Digital started from a simple gap: I was already building high-quality websites and digital tools, but I needed a brand that made the work feel as professional as the output. The goal was to create a digital presence that could communicate trust quickly, explain services clearly, and make the company feel legitimate to business owners, recruiters, and potential clients.`

#### Detail Cards

Card 1 label:

`USER PAIN`

Card 1 text:

`Small businesses often need better websites, but agency pricing can feel unclear, inflated, or disconnected from the actual value delivered.`

Card 2 label:

`MARKET GAP`

Card 2 text:

`There was room for a lean, modern web development brand focused on performance, conversion, transparent communication, and full client ownership.`

---

### 02 - Approach

#### Heading

`Build the brand like a product, not a placeholder.`

#### Body

`Rather than treating Higgins Digital as a basic landing page, I built it as a complete brand system. The site needed to show what I build, explain how I work, display pricing clearly, and prove that the same level of polish offered to clients was present in my own company platform.`

#### Bullet Points

- `Created a premium navy and gold visual system that feels professional, sharp, and memorable.`
- `Built a clear service structure around websites, custom platforms, redesigns, integrations, and client ownership.`
- `Designed project sections to show before-and-after improvements, not just screenshots.`
- `Developed concise copy that explains value quickly without sounding generic or inflated.`
- `Structured the experience around trust, clarity, conversion, and proof of execution.`

---

### 03 - Architecture

#### Heading

`Brand, content, and frontend working together.`

#### Body

`The site was designed as a full digital business system: brand identity, page structure, service positioning, project proof, calls to action, and responsive frontend execution all working together.`

#### Architecture Diagram

If the existing Propify case study has an architecture diagram component, create a similar diagram for Higgins Digital.

Use this flow:

`Brand Strategy + Positioning`
down to
`Design System + UI Components`
down to
`Service Pages + Pricing Structure`
down to
`Project Proof + Case Studies`
down to
`CTA Flow + Quote Requests`

Keep the diagram style consistent with the Propify diagram:
- Dark container
- Thin light borders
- Small monospace or technical labels
- Light blue/cyan accents
- Clean vertical flow

#### Tech / System Cards

Card 1 label:

`BRAND LAYER`

Card 1 text:

`Naming, positioning, navy/gold palette, logo usage, messaging, and trust-focused service framing.`

Card 2 label:

`FRONTEND`

Card 2 text:

`React, Vite, responsive components, animation polish, reusable sections, and performance-focused implementation.`

Card 3 label:

`CONTENT SYSTEM`

Card 3 text:

`Service copy, pricing structure, project proof, FAQs, before-and-after comparisons, and conversion-focused calls to action.`

Card 4 label:

`LAUNCH WORKFLOW`

Card 4 text:

`Production-ready site structure, source-code ownership, clean deployment workflow, and scalable future updates.`

---

### 04 - Key Decisions

#### Heading

`Make the business feel established before the first conversation.`

#### Decision 1 Title

`Use pricing clarity as a trust signal.`

#### Decision 1 Body

`The site presents packages and service ranges clearly so potential clients immediately understand the level of work, expected investment, and value behind each option.`

#### Decision 2 Title

`Lead with transformation proof, not vague promises.`

#### Decision 2 Body

`Project sections emphasize before-and-after improvements, stronger user experience, cleaner structure, better trust signals, and a more professional digital presence.`

#### Decision 3 Title

`Keep the copy direct and business-focused.`

#### Decision 3 Body

`The messaging avoids overused agency language and focuses on what business owners actually care about: credibility, speed, usability, ownership, and conversion.`

#### Decision 4 Title

`Treat the brand as a long-term platform.`

#### Decision 4 Body

`The site was structured so Higgins Digital can grow beyond a portfolio page into a real company presence with future case studies, quote flows, client portals, and internal tools.`

---

### 05 - Tradeoffs

#### Heading

`Balancing polish, speed, and business clarity.`

#### Tradeoff 1

`Visual polish vs. performance: the site uses animation and rich visuals, but they need to stay lightweight, responsive, and fast enough to support the brand's performance-first promise.`

#### Tradeoff 2

`Detailed services vs. simple decision-making: the site explains multiple service types without overwhelming visitors who just want to understand what Higgins Digital can build for them.`

#### Tradeoff 3

`Personal founder brand vs. company brand: the site needed to benefit from Davis Higgins's credibility while still making Higgins Digital feel like a standalone business.`

#### Tradeoff 4

`Premium feel vs. accessibility: the dark navy and gold aesthetic needed enough contrast, readable text, and clear interaction states across every screen size.`

---

### 06 - Results

#### Heading

`A polished company platform built to create trust and convert attention into conversations.`

#### Metric Cards

Metric 1 value:

`1`

Metric 1 label:

`Full company platform`

Metric 2 value:

`5+`

Metric 2 label:

`Core service paths`

Metric 3 value:

`60-75%`

Metric 3 label:

`Below typical agency quotes`

Metric 4 value:

`100%`

Metric 4 label:

`Client source-code ownership`

#### Results Body

`Higgins Digital became more than a personal project. It became a professional web development brand with clear service positioning, polished visuals, strong project proof, transparent pricing, and a conversion-focused structure. The result is a company platform that shows what I can build while also serving as a real client acquisition channel.`

---

## Placement in Projects Tab

Add Higgins Digital to the Projects tab in the correct project order.

Suggested placement:

- Near the top of Projects, since it is a major founder/business project.
- It should sit close to Propify if Propify is already presented as a deep case study.
- Do not bury it below smaller projects.

## Project Card Summary

If the Projects tab has a compact project card before opening the case study, use this content.

### Project Name

`Higgins Digital`

### Short Description

`A high-performance web development brand and company platform built to present services, pricing, project proof, and client-focused digital solutions with a premium navy-and-gold identity.`

### Tags

Use whichever tag system the project already uses. Suggested tags:

- `Web Development`
- `Brand Strategy`
- `React`
- `UI/UX`
- `Business Platform`
- `Founder Project`

### CTA

Use the same CTA pattern as the other project case studies.

Suggested CTA text:

`View Case Study`

Optional external link if the portfolio already supports project links:

`https://higginsd.com`

Do not add a broken link. Only include the external link if the existing project data model supports it cleanly.

---

# 7. Visual Styling Requirements for the Higgins Digital Case Study

Use the Propify case study screenshot as the design standard.

Match the following:

- Deep navy background
- Rounded section cards
- Thin blue/cyan borders
- Small uppercase section labels
- Technical/premium typography
- Clean white headings
- Muted light text
- Light blue accent dots
- Dark embedded diagram area
- Metric cards at the bottom
- Strong spacing between sections
- Consistent card widths
- No cramped text
- No inconsistent border radius
- No mismatched font sizes

## Important

Do not make the Higgins Digital case study look like a separate design. It should feel like the same case study component as Propify, only with different content.

---

# 8. Final QA Checklist

After all changes are implemented, verify the following manually.

## Old Assistant Removal

- [ ] "Ask My Portfolio" is gone from every page.
- [ ] No old assistant button remains.
- [ ] No unused imports or broken references remain.

## Davis Intelligence

- [ ] Floating button says `Ask Davis AI`.
- [ ] Floating button is visually noticeable.
- [ ] Floating button uses dark navy, gold border, and subtle gold glow.
- [ ] Popup header says `Davis Intelligence`.
- [ ] Popup subtext says `Portfolio AI Assistant`.
- [ ] First message matches the required text exactly.
- [ ] Text input is readable while typing.
- [ ] Placeholder is readable.
- [ ] Send button is clear.
- [ ] Assistant still returns responses through the existing Claude API integration.
- [ ] Popup is usable on mobile.

## Tagline

- [ ] Old tagline is fully removed.
- [ ] New tagline is visible:
  `Data Analyst | Data Science & AI | Web Developer | Digital Creator`

## Flicker and Tab Polish

- [ ] Skills tab opens without blue flicker.
- [ ] Impact tab opens without blue flicker.
- [ ] Education tab opens without blue flicker.
- [ ] Resume tab opens without blue flicker.
- [ ] Contact tab opens without blue flicker.
- [ ] These tabs have improved light blue accents and animation polish.
- [ ] The new accents match the existing site palette.

## Navigation

- [ ] Desktop tab order is exactly:
  `Home, Experience, Projects, Education, Skills, Impact, Resume, Contact`
- [ ] Narrow screens use a hamburger menu.
- [ ] Hamburger menu opens smoothly.
- [ ] Menu closes after tab selection.
- [ ] Mobile layout is not cramped.
- [ ] No horizontal overflow appears.

## Higgins Digital Case Study

- [ ] Projects tab includes `Higgins Digital`.
- [ ] Case study title is `Full Case Study: Higgins Digital`.
- [ ] Case study uses the same visual language as Propify.
- [ ] All six sections are present.
- [ ] Architecture diagram is included or adapted cleanly.
- [ ] Metric cards are present.
- [ ] External link to `https://higginsd.com` only appears if supported cleanly by the existing project data structure.
- [ ] No broken links, missing imports, or layout issues.

## Build

- [ ] Run the dev server.
- [ ] Check browser console for errors.
- [ ] Run the production build.
- [ ] Fix all build errors.
- [ ] Confirm final UI is polished on desktop and mobile.

---

# Final Instruction

Implement this like a careful portfolio production update. Keep the existing site identity, but make the AI assistant, responsive navigation, tab polish, and Higgins Digital case study feel more premium, intentional, and aligned with Davis Higgins's personal brand and Higgins Digital's navy/gold visual identity.
