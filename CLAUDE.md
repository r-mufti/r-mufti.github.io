# Project: Roushan Mufti Mohammad — Personal Portfolio Website

## Purpose
A personal portfolio website for Roushan, a finance postgraduate from the
Delhi School of Economics, seeking entry-level roles in Finance, Investment
Banking, Equity Research, Corporate Banking, and Financial Analysis in India
(including GCCs), and open to opportunities in the UAE / Gulf region and Europe.

Primary audience: recruiters and hiring managers at banks, investment firms,
financial services companies, and GCCs. They will spend under 60 seconds on
the site. Make who he is, what he knows, and how to contact him obvious
within the first screen.

## About Roushan
- Full name: Roushan Mufti Mohammad (use this exact name on the site so it
  matches all certificates; "Roushan" is fine in casual copy like the About text)
- Location: Delhi, India
- Headline: "Finance Postgraduate | Delhi School of Economics | Aspiring Financial Analyst"
- Availability: can join within one month of accepting an offer
- Open to working in: major cities in India, the UAE / Gulf region, and Europe
- Photo: his own portrait at /assets/photos/roushan.jpg (shown in the hero and
  the contact section; an "RM" monogram is shown until it is uploaded)

### Education
- **M.Com (Finance specialisation)** — Delhi School of Economics, University of Delhi (2024–2026)
  - Relevant coursework: International Financial Management, International
    Financial System, Insurance Products and Practice, Strategic Management,
    Operations Research, Entrepreneurship & New Venture Planning
- **B.Com** — Shaheed Bhagat Singh College (Evening), University of Delhi (2021–2024)
- **Class XII** — Jamia Millia Islamia

Do NOT display any CGPA, percentage, or division anywhere on the site.

### Certifications
Show as cards: certificate name, issuer, date, and a "Verify" or "View" link.
Order by relevance to finance roles:

1. **Governing Sustainable Finance** — Asian Development Bank Institute (ADBI), Oct 2024
   - Verify: https://elearning-adbi.org/certificate-verifier/?&code=113794-173-009-7795
   - File: /assets/certificates/ADBI_Governing_Sustainable_Finance.pdf
2. **Investment Risk Management** — Coursera
3. **Governance, Risk and Compliance (GRC) and Data Privacy** — Udemy, Nov 2024 (11 hours)
   - Verify: https://ude.my/UC-c26adada-5a1a-4a96-a35f-1781b96fab5f
   - File: /assets/certificates/Udemy_GRC_Data_Privacy.pdf
4. **Basics of Finance** — HP LIFE (HP Foundation), Nov 2024
   - File: /assets/certificates/HP_LIFE_Basics_of_Finance.pdf
5. **Lean Six Sigma White Belt (LSSWB)** — CertiProf, Sep 2024 (valid until Sep 2027)
   - Certification ID: 100461743
   - File: /assets/certificates/CertiProf_Lean_Six_Sigma_White_Belt.pdf
6. **Leadership** — HarvardX

### Workshops
- **Generative AI and ChatGPT Mastery** — one-day in-campus workshop at IIT Delhi
  (Rendezvous 2024, conducted by World Technocon), Oct 2024
  - No certificate file yet: show as a card without a "View" link. When
    /assets/certificates/IIT_Delhi_GenAI_Workshop.pdf is added, link it.

Also show, separately from the cards: "Preparing for CFA Level 1"
(describe exactly this way; do not say "CFA candidate").

### Skills
- Finance: financial statement analysis, investment risk management,
  international finance, macroeconomic analysis, commodity markets
- Tools: Microsoft Excel (advanced), Microsoft PowerPoint, Bloomberg, NSMART
- Technical: basic Python / Node.js scripting for data work
- Areas of interest: macroeconomics, commodities, fintech, digital assets and stablecoins

### Leadership & Activities
- Member, Rotaract Club of Delhi School of Economics

### Projects
[Add real work samples here before launch. Examples to build:
 - DCF valuation of an NSE-listed company (Excel model + 1-page summary PDF)
 - Equity research note on a sector or company
 - Macro or commodity market analysis write-up]
Each project should have: title, 2-line summary, key finding, and a
download or view link. If no projects are ready, hide this section
entirely rather than showing placeholders.

### Contact
- Email: roushan@roushanmufti.in (forwards to his Gmail via Cloudflare Email Routing)
  - Protect it from spam bots: do NOT put it as plain text or a plain
    mailto: link in the HTML. Assemble it with a small JavaScript snippet
    on click (e.g. a "Show email" / "Email me" button), and make the
    contact form (Formspree) the main way to reach him.
- LinkedIn: [linkedin.com/in/your-profile]
- Resume: /assets/Roushan_Resume.pdf (downloadable)

## Site structure (single page with smooth-scroll navigation)
1. **Hero** — name, headline, one-line value statement, two buttons:
   "Download Resume" and "Contact Me"; photo with key-fact cards
   (2 degrees, 6 certifications, "Preparing for CFA Level 1")
2. **About** — 3–4 sentence professional summary (draft below)
3. **Education** — timeline layout (shown as a year-by-year journey)
4. **Skills & Certifications** — grouped cards
5. **Projects** — cards (hidden until real projects are added)
6. **Leadership** — Rotaract
7. **FAQ for recruiters** — roles sought, start date, relocation, tools, CFA, resume
8. **Contact** — email (with a copy button), LinkedIn, simple contact form
   (use Formspree or similar)

### Draft About text
"I'm a finance postgraduate from the Delhi School of Economics with a
specialisation in Finance and a strong interest in markets, macroeconomics,
and how capital moves across borders. My coursework in international
financial management and risk has shaped an analytical, detail-oriented
approach to financial problems. I'm currently preparing for CFA Level 1 and
looking for roles in financial analysis, investment research, and banking
where I can contribute from day one and keep learning."

## Design requirements
- Tone: professional, clean, confident. Layout is inspired by heynesh.com
  (large photo hero, key-fact cards, journey timeline, numbered cards, FAQ),
  but kept in the navy/gold palette with a banker's-CV level of restraint
- Colours: deep navy (#0B1F3A) primary, white background, one accent
  (muted gold #C9A227), grey for secondary text
- Fonts: a clean serif for headings (e.g. Playfair Display or Libre
  Baskerville), a readable sans-serif for body (e.g. Inter)
- Light animation only: fade/slide-in on scroll, count-up numbers, timeline
  fill, a slow text marquee. No animation libraries (e.g. GSAP); always
  respect "prefers-reduced-motion"
- Fully responsive — must look excellent on mobile
- Fast: plain HTML, CSS and minimal JavaScript; no heavy frameworks
- Accessible: good contrast, alt text, semantic HTML
- Include a favicon, page title, and meta description for SEO and link previews

## Technical requirements
- Static site: index.html, styles.css, script.js, /assets folder
  (resume at /assets/Roushan_Resume.pdf; certificates in /assets/certificates/)
- Host on GitHub Pages (free) with the custom domain **roushanmufti.in**
  - Add a CNAME file in the repo root containing exactly: roushanmufti.in
  - DNS is managed in Cloudflare (Roushan will add the records himself)
  - Use https://roushanmufti.in in the meta tags, canonical URL and link previews
- Keep code simple and well-commented so it can be edited without a developer

## Things to avoid
- No personal details beyond name, city, email, and LinkedIn (no phone
  number, home address, or date of birth)
- No links to or mentions of any social media theme pages or side brands
- No stock photos of people; no placeholder "Lorem ipsum" text in the final version
- No exaggerated claims (e.g. "expert", "CFA") — keep everything accurate
