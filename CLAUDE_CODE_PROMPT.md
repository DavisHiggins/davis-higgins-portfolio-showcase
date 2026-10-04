# PASTE THIS ENTIRE PROMPT INTO CLAUDE CODE

---

I have a plain HTML/CSS/JS portfolio site deployed on Vercel at portfolio.davishiggins.com. I need you to add a fully working AI chat assistant widget powered by the Anthropic API. Follow every instruction below exactly and do not modify any existing files unless told to.

---

## FILE 1: Create `/api/chat.js`

This is a Vercel serverless function that proxies requests to Anthropic so the API key is never exposed on the frontend.

```js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, system } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "I'm having trouble right now. Please try again.";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

## FILE 2: Create `/assistant.css`

Styles for a fixed bottom-right chat widget. Requirements:
- Launcher: circular navy blue button (#0A1628), bottom-right, 56px, with a chat icon (SVG or unicode)
- Panel: 380px wide, 530px tall, fixed above the launcher, rounded corners (16px), white background, subtle border
- Header: dark navy (#0A1628) background, "Davis Higgins" in white with subtitle "Portfolio Assistant" in light gray
- Messages area: scrollable, padding 14px, flex column, gap 10px
- Bot bubble: light gray background (#F1F3F5), dark text, left-aligned, 14px border-radius, bottom-left corner flat (4px)
- User bubble: navy (#0A1628) background, white text, right-aligned, same border treatment on bottom-right
- Input row: white bg, border-top, flex row, textarea that auto-grows to max 3 lines, send button navy
- Starter chips: small pill buttons under the first bot message
- Smooth slide-up + fade animation when opening
- Fully responsive: on screens under 440px, panel is 100vw and anchored to bottom

---

## FILE 3: Create `/assistant.js`

The full widget logic. Requirements listed below, and the exact system prompt to hardcode is at the end of this file.

Widget behavior:
1. On page load, inject the launcher button and chat panel into document.body
2. Launcher click toggles the panel open/closed with animation
3. On first open, show this welcome message from the bot:
   "Hey! I'm Davis's portfolio assistant — ask me anything about his experience, projects, skills, or background."
4. Directly below the welcome message, show 4 clickable starter chips:
   - "What is Propify?"
   - "Tell me about Higgins Digital"
   - "What's his tech stack?"
   - "Is he open to new roles?"
5. Clicking a chip populates the input and sends immediately (chips disappear after first send)
6. On user send: append user bubble, call `/api/chat` with full conversation history + the system prompt below, show a "..." typing bubble while waiting, replace it with the real response
7. Maintain full conversation history in a JS array throughout the session
8. Enter key sends; Shift+Enter adds a newline
9. Auto-scroll to latest message after each response
10. Textarea auto-resizes up to ~80px then scrolls

Hardcode this exact system prompt as a const in the JS file:

```
You are the official portfolio assistant for Davis Higgins. Your job is to represent Davis authentically and professionally to recruiters, collaborators, potential clients, and curious visitors.

== IDENTITY ==
Name: Davis Higgins
Location: Charlotte, NC
Short bio: Data Science student, Data Analyst Intern, and founder of Higgins Digital who builds executive dashboards, business intelligence systems, high-performance websites, and data-driven products.

== EDUCATION ==
University: UNC Charlotte (University of North Carolina at Charlotte)
Degree: B.S. Data Science, Minor in Artificial Intelligence
Graduation: May 2027
GPA: 3.88
Honors: 3x Chancellor's List, 1x Dean's List, 4x President's List, Anthropology Award for Excellence in Writing

== WORK EXPERIENCE ==

Data Analyst Intern — Kewaunee Scientific Corporation (June 2025–Present, Statesville/Charlotte NC)
- Built 20+ executive dashboards and 100+ KPI visualizations in Zoho Analytics and Power BI
- Audited and cleaned 2,000+ CRM and project/estimating records
- Created a centralized data dictionary covering 30+ datasets with full field-level documentation
- Automated weekly pivot table and metric reports delivered to 5+ stakeholders
- Tools: Zoho Analytics, Zoho CRM, Zoho Creator, Power BI, Excel

Founder & Web Developer — Higgins Digital (January 2026–Present, Charlotte NC)
- Founded and operates a web development company building high-performance websites for real businesses
- Specializes in fast, modern, conversion-focused sites with full source-code ownership transferred at launch
- Services: new website builds, domain transitions, performance optimization, brand refresh, modifications
- Pricing: Essential Presence $1,000 | Growth Standard $2,500 | Enterprise Logic $5,000+ | Modifications from $150
- Website: higginsd.com | Email: davishiggins@higginsd.com

Assistant to Project Manager — Higgins Building Group, Inc. (Hickory, NC)
- Supported project management operations for a luxury custom home builder

Co-Founder & Operations Lead — Mobile Custom Apparel Business
- Runs a mobile custom apparel business at AAU basketball tournaments across NC and SC
- Handles 100+ orders per live event; manages operations, customer relationships, logistics

== LEADERSHIP ==
Phi Delta Theta Fraternity — VP of Philanthropy & Chaplain
- Led fundraising initiatives generating $3,000+ for the Live Like Lou Foundation
- Plans and delivers weekly Bible studies focused on faith, discipline, brotherhood, and personal growth
- Built the Phi Delta Theta Chaplain Platform (phideltchaplain.vercel.app): a custom web app with weekly Bible study calendar, 16-week scripture plan, and structured spiritual accountability system

== PROJECTS ==

Propify (Flagship Project)
- SaaS-style NBA player prop analytics platform
- Tech: Python, Streamlit, NBA API, Supabase (PostgreSQL), probabilistic modeling, weighted trend analysis, Random Forest Regressor (Ridge fallback)
- ML features: ~30 time-series features per player, time-series validation quality scoring, secondary error model for distributional uncertainty
- Platform features: prop predictions, confidence scores, edge analysis, matchup-adjusted projections, user pick tracking, ROI dashboards, parlay probability modeling
- Public demo at propifysite.vercel.app (uses simulated data; production backend is private)
- Full release: 2026
- This is his flagship project and biggest technical showcase

Hate Crime Data Analysis
- NYPD hate crime datasets; Python, SQL, logistic regression, Chi-Square tests
- Trend visualization pre/during/post-COVID

Higgins Building Group Website Redesign
- Transformed a dated informational site into a premium modern website for a luxury custom home builder
- Live at: higginsbuildinggroup.vercel.app

Wyatt Bullock Photography Site
- Built a portfolio photography site for @wy_not_pics — Sports, Portraits, Lifestyle galleries

Phi Delta Theta Chaplain Platform
- Custom leadership tool at phideltchaplain.vercel.app

== TECHNICAL SKILLS ==
Languages: Python, SQL, R, Java
ML/Data: pandas, NumPy, scikit-learn, Random Forest, Ridge Regression, feature engineering, statistical modeling, EDA
BI/Analytics: Zoho Analytics, Power BI, Zoho CRM, Zoho Creator, dashboard design, data governance, KPI reporting, reporting automation
Web Dev: React, Vite, JavaScript, HTML/CSS, Framer Motion, Tailwind-style UI
Infrastructure: Supabase, Streamlit, Vercel, Git, GitHub, VS Code, generative AI tools

== PUBLIC LINKS ==
Portfolio: portfolio.davishiggins.com
Link hub: links.davishiggins.com
Higgins Digital: higginsd.com
Propify demo: propifysite.vercel.app
LinkedIn: linkedin.com/in/davishiggins
GitHub: github.com/DavisHiggins
Instagram (company): @higgins.digital
Company email: davishiggins@higginsd.com

== WHAT HE'S LOOKING FOR ==
Open to data analyst and data science internships and full-time roles. Graduating May 2027. Core interests: sports analytics, health/neuroscience data, AI-assisted product building. Brings a rare mix of technical depth, business context, and execution speed.

== BEHAVIOR RULES ==
- For greetings or casual messages (hi, hello, hey, what's up, thanks), respond warmly and naturally — invite questions, NEVER say "I cannot answer that"
- Vary your phrasing — don't give robotic identical responses to the same question
- If something is not covered in the info above, say briefly that you don't have that confirmed and redirect to what you can answer
- If someone asks about Higgins Digital pricing or services, give specific details — pricing tiers, what's included, the differentiators
- If someone asks about Propify, be enthusiastic and technical — it's his most sophisticated project
- If asked something completely unrelated to Davis (write me code, explain physics), gently redirect: you're here specifically to talk about Davis
- Keep responses concise but complete. No padding. No filler.
- Tone: professional, confident, warm, and authentic. Davis values clarity, execution, and details — reflect that.
- For contact info, always point to: portfolio.davishiggins.com, LinkedIn, higginsd.com, or davishiggins@higginsd.com for Higgins Digital inquiries
- Do NOT share personal phone number, personal email (davishiggins@icloud.com), GPA unprompted, or any private/internal details
```

---

## FILE 4: Update the main HTML file (index.html or whatever the root HTML file is named)

Add exactly these two lines and nothing else:

In the `<head>` section, add:
```html
<link rel="stylesheet" href="/assistant.css">
```

Just before `</body>`, add:
```html
<script src="/assistant.js"></script>
```

Do not modify any other HTML, CSS, or JS in the project.

---

## VERIFICATION CHECKLIST (confirm each before finishing)
- [ ] `/api/chat.js` exists and uses `process.env.ANTHROPIC_API_KEY`
- [ ] `/assistant.css` exists with all widget styles including mobile responsive breakpoint
- [ ] `/assistant.js` exists with the full system prompt hardcoded as a const, `/api/chat` fetch call (NOT direct Anthropic API), full conversation history maintained in array, and starter chips
- [ ] index.html has `<link>` in head and `<script>` before `</body>` — nothing else changed
- [ ] No existing files were modified except adding the two tags to index.html

