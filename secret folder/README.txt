================================================================
  DRANOJ JAMES A. SORONGON — PORTFOLIO WEBSITE
  README.txt
================================================================

Welcome! This is a complete portfolio website built with
pure HTML, CSS, and JavaScript — no frameworks required.

================================================================
  FOLDER STRUCTURE
================================================================

portfolio/
│
├── index.html          ← Home page
├── about.html          ← About me
├── skills.html         ← Skills & expertise
├── experience.html     ← Work history
├── projects.html       ← Projects showcase
├── schedule.html       ← Availability calendar
├── contact.html        ← Contact form
│
├── css/
│   └── style.css       ← All styles
│
├── js/
│   └── script.js       ← All JavaScript
│
├── images/
│   ├── profile.jpg     ← Your profile photo (add this!)
│   └── projects/
│       ├── project1.jpg
│       ├── project2.jpg
│       └── ...
│
└── README.txt          ← This file


================================================================
  HOW TO RUN THE WEBSITE
================================================================

Option A — Open directly in browser (simplest):
  1. Double-click index.html
  2. It opens in your default web browser.
  3. Click the nav links to visit all pages.

Option B — Use a local server (recommended, fixes some image
  loading issues on Chrome):
  1. Install VS Code: https://code.visualstudio.com
  2. Install the "Live Server" extension (by Ritwick Dey)
  3. Right-click index.html → "Open with Live Server"
  4. Your browser opens at http://127.0.0.1:5500

Option C — Upload to a web host:
  1. Use any hosting: Netlify (free), GitHub Pages, Hostinger
  2. Upload the entire /portfolio/ folder
  3. Point your domain to the folder


================================================================
  HOW TO ADD YOUR PROFILE PHOTO
================================================================

1. Take or prepare a professional headshot (portrait style)
2. Rename it EXACTLY to:  profile.jpg
3. Place it at:  /portfolio/images/profile.jpg
4. Open index.html in browser — photo appears automatically

Photo tips:
  - Ideal size: 600 × 750 px (portrait, 4:5 ratio)
  - Good lighting, neutral or blurred background
  - File size under 300 KB (compress at squoosh.app)
  - The image fills ~30% of homepage width via CSS grid


================================================================
  HOW TO ADD A NEW PROJECT
================================================================

1. Open: portfolio/projects.html
2. Find the comment that says:
     <!-- PROJECT CARD 1  ← Duplicate this block to add more -->
3. Copy the entire block from <!-- PROJECT CARD --> to </div>
4. Paste it right after the last </div> of the last card
5. Edit:
     a. The title text
     b. The description paragraph
     c. The stack tags (copy/edit <span class="stack-tag">)
6. Add your project image:
     a. Name it: my-project-name.jpg
     b. Place it in: /portfolio/images/projects/my-project-name.jpg
     c. In the <img> tag, change:
           src="images/projects/project1.jpg"
        to:
           src="images/projects/my-project-name.jpg"
7. Save — the grid layout adjusts automatically

Image tips for projects:
  - Recommended: 800 × 450 px (16:9 ratio)
  - Format: .jpg or .png
  - File size under 300 KB
  - Screenshots, diagrams, or mockups all work well


================================================================
  HOW TO CONNECT EMAILJS (Contact Form)
================================================================

EmailJS lets the contact form send emails without a backend.
It is FREE for up to 200 emails/month.

STEP 1: Create account at https://www.emailjs.com
        Click "Sign Up Free"

STEP 2: Add Email Service
        → Dashboard → Email Services → Add New Service
        → Choose Gmail
        → Sign in with: dramessorongon@gmail.com
        → Click "Connect Account"
        → COPY the SERVICE ID shown (looks like "service_abc123")

STEP 3: Create Email Template
        → Dashboard → Email Templates → Create New Template
        → Fill in:
            To Email:  dramessorongon@gmail.com
            Subject:   New message from {{from_name}}
            Content:
              Name:    {{from_name}}
              Email:   {{reply_to}}
              Message: {{message}}
        → Click Save
        → COPY the TEMPLATE ID (looks like "template_xyz789")

STEP 4: Get Public Key
        → Dashboard → Account tab → General
        → COPY the Public Key (looks like "user_AbCdEf123")

STEP 5: Open  /portfolio/js/script.js
        Find these 3 lines (around line 90–92):
            const serviceID  = 'YOUR_SERVICE_ID';
            const templateID = 'YOUR_TEMPLATE_ID';
            const publicKey  = 'YOUR_PUBLIC_KEY';
        Replace each value with your copied IDs.

STEP 6: Save script.js and test the contact form!
        Fill in name, email, message → click Send
        Check your Gmail inbox within 60 seconds.

Troubleshooting:
  - Check your Gmail spam folder
  - Make sure you authorised Gmail access in Step 2
  - Double-check IDs for typos


================================================================
  SECURITY GUIDE
================================================================

1. INPUT VALIDATION
   Already implemented in script.js:
   - Name must be 2+ characters
   - Email must be valid format
   - Message must be 10+ characters
   - All input is sanitized to prevent XSS attacks

2. SPAM PROTECTION
   A hidden "honeypot" field is in contact.html:
   - Bots auto-fill it; humans never see it
   - If filled, the form ignores the submission silently
   - EmailJS also has built-in rate limiting

3. API KEY SAFETY
   - The EmailJS PUBLIC KEY is safe to include in front-end code
     (it is designed for client-side use)
   - NEVER share your EmailJS private key or Gmail password
   - Do not commit sensitive credentials to GitHub

4. HTTPS (When hosting)
   - Always use HTTPS hosting (Netlify/GitHub Pages do this free)
   - HTTP exposes form data to interception
   - Most free hosts enable HTTPS automatically

5. RATE LIMITING
   - EmailJS free tier: 200 emails/month
   - If you receive spam, add a CAPTCHA (see reCAPTCHA by Google)
   - You can also add IP-based limits via Cloudflare (free CDN)

6. CONTENT SECURITY
   - The site uses no eval(), no innerHTML with user input
   - All user data goes through the sanitize() function in script.js
   - External scripts (EmailJS, Google Fonts) are loaded from
     reputable CDNs (jsdelivr.net, fonts.googleapis.com)


================================================================
  CUSTOMISATION QUICK REFERENCE
================================================================

Change colors:
  Open css/style.css → look for :root { ... }
  Edit the CSS variables at the top.

Change fonts:
  Edit the @import line at the top of style.css
  Then update --font-head and --font-body variables.

Add social links:
  Edit the footer in each HTML file.
  Example: <a href="https://linkedin.com/in/yourname">LinkedIn</a>

Update contact details:
  Search all HTML files for "dramessorongon@gmail.com"
  and "+63 994 985 0210" — replace with your updated info.


================================================================
  CREDITS
================================================================

Fonts:     Google Fonts — Syne & DM Sans (free, open license)
Icons:     Inline SVG and emoji (no external dependency)
Email:     EmailJS (free tier at emailjs.com)

Built entirely from scratch — no frameworks, no jQuery,
no Bootstrap. Pure HTML, CSS, and vanilla JavaScript.

================================================================
  CONTACT
================================================================

Dranoj James A. Sorongon
dramessorongon@gmail.com
+63 994 985 0210
Iloilo City, Philippines

================================================================
