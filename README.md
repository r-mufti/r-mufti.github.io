# Roushan Mufti Mohammad — Portfolio

Personal portfolio website of Roushan Mufti Mohammad, finance postgraduate from the Delhi School of Economics.

Live at: https://roushanmufti.in

## Files

| File | What it is |
| --- | --- |
| `index.html` | All the page content (text, sections, links) |
| `styles.css` | Colours, fonts and layout. Colours are at the top of the file |
| `script.js` | Small helpers: hidden-until-uploaded buttons, email and copy buttons, contact form, mobile menu, light animation |
| `assets/` | Photo, resume, certificates, icons and the link-preview image |
| `CNAME` | Tells GitHub Pages to use the domain `roushanmufti.in` |
| `_config.yml` | Keeps `README.md` and `CLAUDE.md` off the live site |

## Adding your photo

Upload a portrait photo as `assets/photos/roushan.jpg` (upright, roughly
900 × 1125 pixels, under about 300 KB). It appears in the arch-shaped frame
at the top of the page and next to the chat bubble in the contact section.
Until it is uploaded, a gold "RM" monogram is shown instead.

## Adding the resume and certificates

Download and "View" buttons stay hidden until their file is uploaded, then
appear by themselves. There is no code to change. Upload each file to
exactly this path, with exactly this name (capital letters matter):

| Button | Upload to |
| --- | --- |
| Download Resume | `assets/Roushan_Resume.pdf` |
| Governing Sustainable Finance (ADBI) | `assets/certificates/ADBI_Governing_Sustainable_Finance.pdf` |
| GRC and Data Privacy (Udemy) | `assets/certificates/Udemy_GRC_Data_Privacy.pdf` |
| Basics of Finance (HP LIFE) | `assets/certificates/HP_LIFE_Basics_of_Finance.pdf` |
| Lean Six Sigma White Belt (CertiProf) | `assets/certificates/CertiProf_Lean_Six_Sigma_White_Belt.pdf` |
| Generative AI workshop (IIT Delhi) | `assets/certificates/IIT_Delhi_GenAI_Workshop.pdf` |

On GitHub: open the folder, click **Add file → Upload files**, and commit.

## Finishing the contact section

Two placeholders in `index.html` start with `YOUR_`. While a placeholder is
there, that item stays hidden, so visitors never see a broken link.

1. **Contact form.** Create a free form at [formspree.io](https://formspree.io).
   It gives you an address like `https://formspree.io/f/abcdwxyz`. In
   `index.html`, replace `YOUR_FORM_ID` with the last part (`abcdwxyz`).
2. **LinkedIn.** Replace `YOUR_LINKEDIN_ID` with the end of your profile
   address, e.g. `https://www.linkedin.com/in/roushan-mufti`.

The email address is never written in the page. It is put together only
when a visitor clicks "Show email address", which keeps it away from spam bots.

## Editing the FAQ

The recruiter questions and answers are in `index.html`, in the section
that starts with the comment `FAQ for recruiters`. Edit the text between
`<h3>` and `</h3>` for a question, and inside `<p>` for its answer.

## Adding projects

The Projects section is already written but switched off. See the
instructions in the `5. PROJECTS` comment in `index.html`.

## Publishing (GitHub Pages + Cloudflare)

1. On GitHub: **Settings → Pages**. Under "Build and deployment", pick
   **Deploy from a branch**, branch `main`, folder `/ (root)`.
   The custom domain should read `roushanmufti.in` (it comes from the `CNAME` file).
2. In Cloudflare DNS for `roushanmufti.in`, add:

   | Type | Name | Content |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `r-mufti.github.io` |

   Set these to **DNS only** (grey cloud) so GitHub can issue the HTTPS
   certificate. Leave the MX/TXT records for Cloudflare Email Routing as they are.
3. Once GitHub shows the domain as verified, tick **Enforce HTTPS**.
