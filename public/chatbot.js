/* ────────────────────────────────────────────────────────────────
   "Ask about Aryaman" — fully static, client-side keyword chatbot.
   No API, no build step. Knowledge base + intent matcher.
──────────────────────────────────────────────────────────────── */

const KB = [
  {
    keys: ['hi', 'hello', 'hey', 'yo', 'sup', 'greetings'],
    answer: "Hey! 👋 I'm a quick-answer bot trained on Aryaman's resume, projects, and portfolio. Ask me about his experience, skills, certifications, projects, education, or how to reach him."
  },
  {
    keys: ['who is', 'who are', 'introduce', 'introduction', 'background', 'summary', 'about aryaman', 'about him', 'about you'],
    answer: "Aryaman Singh is a software engineer with **3+ years at Citrix** (NetScaler Console / ADM Stylebooks) building React + Python apps in agile teams. He's currently doing his **MS in IT & Management** at UT Dallas (GPA 3.945, Business Analytics & Data Mining). Based in Richardson, TX."
  },
  {
    keys: ['education', 'school', 'university', 'utd', 'utdallas', 'masters', 'master', 'degree', 'gpa', 'graduate'],
    answer: "**MS in Information Technology and Management** at **The University of Texas at Dallas** — expected **December 2026**. GPA **3.945 / 4.0**, awarded the **Program Excellence Scholarship**. Coursework spans OOP in Python, Data Management, Big Data, Statistics, RPA, and a Digital Consulting Project."
  },
  {
    keys: ['citrix', 'cloud software group', 'netscaler', 'adm', 'stylebook', 'stylebooks'],
    answer: "At **Cloud Software Group (Citrix)**, Aryaman was **Software Engineer 1** on NetScaler Console / ADM Stylebooks (Jul 2022 – Apr 2025). Highlights: built interactive Cytoscape.js dependency views (+20% nav efficiency), integrated GitLab sync (-60% sync time), 150+ Cypress E2E tests (-25% manual test time/sprint), and a Python script that automated configpack log purging (-85% routine overhead)."
  },
  {
    keys: ['experience', 'work', 'job', 'jobs', 'career', 'employer', 'companies'],
    answer: "**3+ years** of full-time + intern experience: **Citrix / Cloud Software Group** (Software Engineer, ADM Stylebooks, Jul 2022 – Apr 2025), **Citrix R&D India** (SE Intern, Jan – Jun 2022), **Gravitas AI** (Full-Stack Dev Intern, Aug – Nov 2021), and **Accio Robotics** (Web Dev Intern, Nov – Dec 2020)."
  },
  {
    keys: ['intern', 'internship', 'gravitas', 'accio'],
    answer: "Internships: **Gravitas AI** (London, remote — built an Angular RBAC UI with Node.js backend services), **Accio Robotics** (migrated their site from no-code to a custom Node.js app with scroll-triggered video controls), and **Citrix R&D India** (led the Stylebooks UI migration from vanilla JS to ReactJS, 100% adoption in 3 months)."
  },
  {
    keys: ['project', 'projects', 'portfolio'],
    answer: "Featured projects: **CAMA** (AI-powered modernization assessment platform, 11 CrewAI agents, NDA), **Touchline AI** (live football-fan AI assistant — touchline-erff.onrender.com), **AdOptimize** (cross-platform ad-opt strategy deck, -35% ad waste), and **Whatup' Life Foundation** (Flutter mental-wellbeing app). Ask about any one for details!"
  },
  {
    keys: ['cama', 'modernization', 'crewai', 'consulting', 'insight global'],
    answer: "**CAMA — Comprehensive Automated Modernization Assessment** (Sep – Dec 2025, Insight Global Consulting Project). Architected an AI platform with **React + Flask + MongoDB + 11 CrewAI agents** that automates app-modernization assessments across People, Process, Technology, and Business Value. Generates 7Rs rationalization scorecards, cost projections, risk assessments, with a conversational GenAI interface — **cutting evaluation time from weeks to hours**. *NDA project.*"
  },
  {
    keys: ['touchline', 'football', 'fan', 'sport', 'soccer', 'real madrid', 'madrid', 'club'],
    answer: "**Touchline AI** is an AI assistant for football fans — helps newcomers pick a club to support and gives existing fans personalised updates on their favourite/rival clubs. **Live demo:** https://touchline-erff.onrender.com/  ·  **Code:** github.com/aaryaa07/Touchline"
  },
  {
    keys: ['adoptimize', 'ad', 'advertising', 'marketing'],
    answer: "**AdOptimize** — a product-launch deck for a cross-platform ad-optimization concept aimed at **reducing ad budget wastage by 35% in SMBs**. Covered business strategy, product roadmap, competitor analysis, and KPIs informed by sales projections."
  },
  {
    keys: ['whatup', 'life foundation', 'wellbeing', 'mental', 'flutter app', 'wlf'],
    answer: "**Whatup' Life Foundation App** — a Flutter mental-wellbeing mobile app with blogs, session scheduling, one-to-one peer support, and personalised push notifications. Code: github.com/aaryaa07/wlf-app"
  },
  {
    keys: ['skill', 'skills', 'tech', 'stack', 'technologies', 'languages', 'frameworks'],
    answer: "**Languages:** C++, Python, JavaScript.  **Frontend:** ReactJS, Flutter.  **Backend:** Node.js, Express.js, MongoDB, SQL.  **Testing:** Jest, Cypress.  **Tools:** Git, Jira, Visual Paradigm. Comfortable using GitHub Copilot and other enterprise AI tooling for productivity."
  },
  {
    keys: ['react', 'reactjs', 'frontend', 'front-end'],
    answer: "**ReactJS** is one of Aryaman's strongest stacks — 3 years of production work at Citrix on the Stylebooks app (led the migration from vanilla JS, 100% dev adoption in 3 months), built Cytoscape.js graph views, GitLab-sync UI components, and accordion-based diff reports. He also used React for **CAMA** (AI consulting platform)."
  },
  {
    keys: ['python', 'flask', 'django', 'data science'],
    answer: "**Python** experience covers backend services (Flask REST APIs in CAMA), automation scripts (configpack log-purger at Citrix saved 85% routine overhead), python-gitlab integrations, and data work via the UTD Business Analytics & Data Mining program."
  },
  {
    keys: ['testing', 'test', 'qa', 'cypress', 'jest', 'automation'],
    answer: "Heavy on test automation — **150+ Cypress E2E test scenarios** wired into Jenkins for daily regression at Citrix (cut manual test effort 25%/sprint). Earlier introduced **Jest** unit tests during the Stylebooks UI migration, leading to a **40% reduction in production regression defects**."
  },
  {
    keys: ['certification', 'cert', 'certifications', 'certificate', 'certificates', 'credential', 'credentials'],
    answer: "Three highlighted credentials: **Google AI Professional Certificate** (Coursera, 7-course specialization, May 2026), **Alteryx Designer Cloud — Core** (Dec 2025), and **Beta Gamma Sigma Member** (top business honor society — top 10% undergrad / top 20% grad of AACSB-accredited business schools)."
  },
  {
    keys: ['google ai', 'google certificate', 'google'],
    answer: "**Google AI Professional Certificate** (Coursera, May 2026) — a 7-course specialization: AI Fundamentals, Brainstorming & Planning, Research & Insights, Writing & Communicating, Content Creation, Data Analysis, and App Building. Aryaman built 20+ AI artifacts plus a custom vibe-coded AI solution as part of it."
  },
  {
    keys: ['alteryx', 'designer cloud'],
    answer: "**Alteryx Designer Cloud — Core** (Dec 2025). Foundational mastery of Alteryx Designer Cloud: workflow design, data prep & blending, cloud analytics, and automation. Verifiable badge on Credly."
  },
  {
    keys: ['bgs', 'beta gamma sigma', 'honor society', 'aacsb'],
    answer: "**Beta Gamma Sigma (BGS)** — the international business honor society. BGS recognizes the **top 10% of undergraduate students, top 20% of graduate students, and all doctoral candidates** from business schools accredited by The Association to Advance Collegiate Schools of Business (AACSB)."
  },
  {
    keys: ['visa', 'sponsorship', 'h1b', 'opt', 'cpt', 'work auth', 'authorization', 'eligible', 'eligibility'],
    answer: "**Visa:** Eligible to work in the U.S. for internships and full-time employment for **up to 36 months without sponsorship.** (STEM-extended OPT.)"
  },
  {
    keys: ['location', 'where', 'based', 'live', 'lives', 'city', 'state', 'dallas', 'texas', 'richardson', 'relocate', 'remote'],
    answer: "Based in **Richardson, TX** (Dallas–Fort Worth metro). Open to relocation and remote roles across the U.S."
  },
  {
    keys: ['contact', 'email', 'reach', 'get in touch', 'connect'],
    answer: "**Email:** as.aryamansingh@gmail.com  ·  **LinkedIn:** linkedin.com/in/as-aryamansingh/  ·  **GitHub:** github.com/aaryaa07  ·  **Phone:** +1 (945) 367-1029"
  },
  {
    keys: ['linkedin', 'profile'],
    answer: "**LinkedIn:** https://linkedin.com/in/as-aryamansingh/"
  },
  {
    keys: ['github', 'repo', 'repos', 'repository', 'code'],
    answer: "**GitHub:** https://github.com/aaryaa07 — Touchline AI, the portfolio site, vocabulary apps, and a few experiments."
  },
  {
    keys: ['hire', 'hiring', 'available', 'opportunity', 'opportunities', 'role', 'open to', 'looking', 'job search'],
    answer: "Yes — **open to opportunities** (full-time SWE / data / product-engineering roles). Eligible to work in the U.S. for **36 months without sponsorship**. The fastest path is an email: **as.aryamansingh@gmail.com**."
  },
  {
    keys: ['interest', 'hobby', 'hobbies', 'fun', 'personal', 'guitar', 'music', 'songwriting'],
    answer: "Outside of code: guitar and songwriting, plus a serious football habit (won **2nd place at the Revels Football Cup, MIT Manipal**) and a **1st place** in a low-code/no-code web design hackathon."
  },
  {
    keys: ['scholarship', 'award', 'awards', 'achievement', 'achievements', 'honor', 'honors'],
    answer: "Awards: **Program Excellence Scholarship** at UT Dallas, **Beta Gamma Sigma** member (top business-school honor), **1st place** in a low-code/no-code web hackathon, **2nd place** Revels Football Cup at MIT Manipal."
  },
  {
    keys: ['resume', 'cv', 'download'],
    answer: "Aryaman's academic resume is in this site — feel free to email him at **as.aryamansingh@gmail.com** for the latest copy."
  },
  {
    keys: ['ai', 'artificial intelligence', 'ml', 'machine learning', 'genai', 'llm', 'agent', 'agents'],
    answer: "AI work: **CAMA** uses **11 CrewAI agents** orchestrated behind a Flask API to automate modernization assessments with a conversational GenAI front end. **Touchline AI** layers AI over football data for fan-facing recommendations. Holds the **Google AI Professional Certificate**."
  },
  {
    keys: ['salary', 'compensation', 'pay'],
    answer: "Compensation is best discussed directly — drop a note to **as.aryamansingh@gmail.com** with the role context."
  }
];

const SUGGESTIONS = [
  "What's your experience?",
  "Tell me about CAMA",
  "Visa status?",
  "Tech stack",
  "How to contact you?",
];

const FALLBACK = "I don't have a great answer for that — but Aryaman would, and you can reach him at **as.aryamansingh@gmail.com**. Try asking about his experience, projects, certifications, or visa status.";

/* ── Intent matcher ── */
function findAnswer(text) {
  const q = text.toLowerCase().trim();
  if (!q) return FALLBACK;
  let best = { score: 0, answer: null };
  for (const entry of KB) {
    let score = 0;
    for (const key of entry.keys) {
      if (q.includes(key)) score += key.length;
    }
    if (score > best.score) best = { score, answer: entry.answer };
  }
  return best.answer || FALLBACK;
}

/* ── Lightweight markdown: **bold** and URL → <a> ── */
function renderInline(text) {
  const escape = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  let out = escape(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(https?:\/\/[^\s<]+|[a-z0-9.-]+\.(?:com|org|io|onrender\.com)\/[^\s<]*)/gi,
    (m) => {
      const href = m.startsWith('http') ? m : 'https://' + m;
      return `<a href="${href}" target="_blank" rel="noopener">${m}</a>`;
    });
  return out;
}

/* ── DOM ── */
const fab        = document.getElementById('chat-fab');
const panel      = document.getElementById('chat-panel');
const closeBtn   = document.getElementById('chat-close');
const log        = document.getElementById('chat-log');
const form       = document.getElementById('chat-form');
const input      = document.getElementById('chat-input');
const suggBox    = document.getElementById('chat-suggestions');

let opened = false;

function pushMsg(role, html) {
  const el = document.createElement('div');
  el.className = `chat-msg chat-msg-${role}`;
  el.innerHTML = html;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}

function pushTyping() {
  const el = pushMsg('bot', '<span class="typing"><span></span><span></span><span></span></span>');
  el.classList.add('chat-msg-typing');
  return el;
}

function ask(question) {
  pushMsg('user', renderInline(question));
  const typing = pushTyping();
  const delay = 380 + Math.min(question.length * 12, 700);
  setTimeout(() => {
    typing.remove();
    pushMsg('bot', renderInline(findAnswer(question)));
  }, delay);
}

/* ── Suggestions ── */
function renderSuggestions() {
  suggBox.innerHTML = '';
  SUGGESTIONS.forEach((q) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chat-chip';
    b.textContent = q;
    b.addEventListener('click', () => {
      ask(q);
      input.focus();
    });
    suggBox.appendChild(b);
  });
}

/* ── Open / close ── */
function openPanel() {
  const mainEl = document.getElementById('main-scroll');
  const savedScroll = mainEl ? mainEl.scrollTop : 0;

  panel.hidden = false;
  panel.classList.add('open');
  fab.classList.add('hidden');
  if (!opened) {
    opened = true;
    setTimeout(() => {
      pushMsg('bot', renderInline("Hey! 👋 I'm a quick-answer bot for Aryaman's portfolio. Ask me anything — experience, projects, certs, visa, contact info."));
      renderSuggestions();
    }, 250);
  }
  setTimeout(() => {
    input.focus({ preventScroll: true });
    if (mainEl) mainEl.scrollTop = savedScroll;
  }, 320);
}

function closePanel() {
  const mainEl = document.getElementById('main-scroll');
  const savedScroll = mainEl ? mainEl.scrollTop : 0;

  panel.classList.remove('open');
  fab.classList.remove('hidden');
  input.blur();
  if (mainEl) mainEl.scrollTop = savedScroll;

  setTimeout(() => { panel.hidden = true; }, 220);
}

fab.addEventListener('click', openPanel);
closeBtn.addEventListener('click', closePanel);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;
  ask(q);
  input.value = '';
});

/* Esc closes the panel when open */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !panel.hidden) closePanel();
});