/* Simple, robust tap/click handler for mobile and desktop */
function bindTap(el, handler, opts) {
  if (!el) return;
  opts = opts || {};
  
  let lastTouchTime = 0;
  
  const handleActivate = (e) => {
    if (opts.stopPropagation !== false) e.stopPropagation();
    if (opts.preventDefault !== false) e.preventDefault();
    handler(e);
  };
  
  el.addEventListener('touchend', (e) => {
    lastTouchTime = Date.now();
    handleActivate(e);
  }, { passive: false });
  
  el.addEventListener('click', (e) => {
    if (Date.now() - lastTouchTime < 600) {
      if (opts.stopPropagation !== false) e.stopPropagation();
      if (opts.preventDefault !== false) e.preventDefault();
      return;
    }
    handleActivate(e);
  });
}

/* ───────────────────────────────────────────────
   THEME TOGGLE — persists, smooth transition,
   honors prefers-color-scheme on first visit.
─────────────────────────────────────────────── */
(function () {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  if (!btn) return;

  const meta = document.getElementById('theme-color-meta');
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    if (meta) meta.setAttribute('content', theme === 'light' ? '#eaf4ff' : '#080b12');
  }

  bindTap(btn, () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
  });

  // System-preference change while no manual choice
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener && mq.addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'light' : 'dark');
      } catch (err) {}
    });
  }
})();

/* ── "Now" video: ensure autoplay survives autoplay-policy blocks ── */
const nowVideo = document.getElementById('now-video');
if (nowVideo) {
  const tryPlay = () => nowVideo.play().catch(() => {});
  tryPlay();
  document.addEventListener('click', tryPlay, { once: true });
}

/* ── Typing animation for name ── */
const nameEl   = document.getElementById('typed-name');
const nameText = 'Aryaman Singh';
let idx = 0;

(function type() {
  if (idx < nameText.length) {
    nameEl.textContent += nameText[idx++];
    setTimeout(type, idx === 1 ? 600 : 95);
  } else {
    nameEl.classList.add('done');
  }
})();

/* ── Level select + working-directory-aware panel switching ── */
const navLinks = document.querySelectorAll('.nav-link');
const panels   = document.querySelectorAll('.panel');
const SECTIONS = ['about', 'experience', 'skills', 'projects', 'courses'];

let currentSection = 'about';
function termDir(id) { return id === 'about' ? '~' : '~/' + id; }
function promptFor(id) { return 'aryaman@portfolio:' + termDir(id) + '$'; }
function setTermPrompt(id) {
  const p = document.getElementById('term-prompt');
  if (p) p.textContent = promptFor(id);
}

const MOBILE_ABOUT_MQ = window.matchMedia('(max-width: 900px)');

function setAboutScrollMode(id) {
  const stage = document.getElementById('main-scroll');
  if (!stage) return;
  if (id === 'about' && MOBILE_ABOUT_MQ.matches) {
    stage.classList.add('about-active');
  } else {
    stage.classList.remove('about-active');
  }
}

function showPanel(id, opts) {
  opts = opts || {};
  let found = false;
  panels.forEach(p => {
    const on = p.id === id;
    p.classList.toggle('active', on);
    if (on) { found = true; p.scrollTop = 0; }
  });
  if (!found) return;
  const prevPrompt = promptFor(currentSection);
  currentSection = id;
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === id);
  });
  if (!opts.fromTerminal && window.termEcho) window.termEcho(prevPrompt, 'cd ' + id);
  setTermPrompt(id);
  setAboutScrollMode(id);
  window.dispatchEvent(new Event('resize'));
  const stage = document.getElementById('main-scroll');
  if (stage) stage.scrollTop = 0;
}

/* Init about-active for the default (about) section on mobile */
setAboutScrollMode('about');

/* Re-check on orientation change / resize */
MOBILE_ABOUT_MQ.addEventListener('change', () => setAboutScrollMode(currentSection));

/* Wire every nav link (desktop tabs + mobile drawer clones) */
function wireNavLink(link) {
  if (link.dataset.navWired) return;
  link.dataset.navWired = '1';
  let lastTouch = 0;
  const activate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = link.dataset.section;
    if (id) showPanel(id);
    if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
  };
  link.addEventListener('touchend', (e) => {
    lastTouch = Date.now();
    activate(e);
  }, { passive: false });
  link.addEventListener('click', (e) => {
    if (Date.now() - lastTouch < 600) { e.preventDefault(); e.stopPropagation(); return; }
    activate(e);
  });
}

navLinks.forEach(wireNavLink);

/* Mobile nav drawer — body-level overlay, separate from grid layout */
(function () {
  const navToggle = document.getElementById('nav-toggle');
  const topbar = document.querySelector('.topbar');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const MOBILE_MQ = window.matchMedia('(max-width: 900px)');

  if (!navToggle || !topbar || !mobileNav || !mobileNavPanel) return;

  function buildMobileNavPanel() {
    if (mobileNavPanel.dataset.built) return;
    navLinks.forEach(link => {
      const item = link.cloneNode(true);
      item.classList.add('mobile-nav-link');
      item.removeAttribute('data-nav-wired');
      wireNavLink(item);
      mobileNavPanel.appendChild(item);
    });
    mobileNavPanel.dataset.built = '1';
  }

  function closeMobileMenu() {
    mobileNav.hidden = true;
    mobileNav.setAttribute('aria-hidden', 'true');
    topbar.classList.remove('tabs-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-nav-open');
  }
  window.closeMobileMenu = closeMobileMenu;

  function openMobileMenu() {
    buildMobileNavPanel();
    mobileNav.hidden = false;
    mobileNav.setAttribute('aria-hidden', 'false');
    topbar.classList.add('tabs-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-nav-open');
  }

  function toggleMobileMenu() {
    if (mobileNav.hidden) openMobileMenu();
    else closeMobileMenu();
  }

  let navToggleLastTouch = 0;
  navToggle.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    navToggleLastTouch = Date.now();
    if (MOBILE_MQ.matches) toggleMobileMenu();
  }, { passive: false });
  navToggle.addEventListener('click', (e) => {
    if (Date.now() - navToggleLastTouch < 600) { e.preventDefault(); e.stopPropagation(); return; }
    e.preventDefault();
    e.stopPropagation();
    if (MOBILE_MQ.matches) toggleMobileMenu();
  });

  if (mobileNavBackdrop) {
    let backdropLastTouch = 0;
    mobileNavBackdrop.addEventListener('touchend', (e) => {
      e.preventDefault();
      backdropLastTouch = Date.now();
      closeMobileMenu();
    }, { passive: false });
    mobileNavBackdrop.addEventListener('click', (e) => {
      if (Date.now() - backdropLastTouch < 600) { e.preventDefault(); return; }
      e.preventDefault();
      closeMobileMenu();
    });
  }

  /* Desktop: horizontal tabs in topbar still work via wireNavLink above */
  MOBILE_MQ.addEventListener('change', () => {
    if (!MOBILE_MQ.matches) closeMobileMenu();
  });
})();

/* Mobile ID card popup */
(function () {
  const idToggle = document.getElementById('mobile-id-toggle');
  const idPopup = document.getElementById('mobile-id-popup');
  const idClose = idPopup && idPopup.querySelector('.mobile-id-close');
  if (!idToggle || !idPopup || !idClose) return;

  const closePopup = () => {
    idPopup.hidden = true;
    idToggle.setAttribute('aria-expanded', 'false');
  };

  const openPopup = () => {
    idPopup.hidden = false;
    idToggle.setAttribute('aria-expanded', 'true');
  };

  bindTap(idToggle, () => {
    if (idPopup.hidden) openPopup();
    else closePopup();
  });

  bindTap(idClose, closePopup);
  bindTap(idPopup, (e) => {
    if (e.target === idPopup) closePopup();
  });
})();

/* In-panel links that point to another level (e.g. "See my work" → projects) */
function bindPanelLink(a) {
  bindTap(a, () => {
    const id = a.getAttribute('href').slice(1);
    const panel = document.getElementById(id);
    if (panel && panel.classList.contains('panel')) {
      a.classList.add('is-pressed');
      setTimeout(() => a.classList.remove('is-pressed'), 220);
      showPanel(id);
    }
  });
}

document.querySelectorAll('.stage a[href^="#"]').forEach(bindPanelLink);

(function () {
  // "Let's talk" → mailto link: works natively on desktop; needs explicit handler on mobile
  const letsTalk = document.querySelector('.hero-actions .btn-ghost');
  if (letsTalk && letsTalk.href && letsTalk.href.startsWith('mailto:')) {
    letsTalk.addEventListener('touchend', (e) => {
      e.preventDefault();
      window.location.href = letsTalk.getAttribute('href');
    }, { passive: false });
  }
  // Note: "See my work" (#experience) is already handled by bindPanelLink above.
})();

/* Projects — master/detail showcase */
document.querySelectorAll('.proj-item').forEach(item => {
  item.addEventListener('click', () => {
    const key = item.dataset.proj;
    document.querySelectorAll('.proj-item').forEach(i => i.classList.toggle('active', i === item));
    document.querySelectorAll('.proj-view').forEach(v => v.classList.toggle('active', v.id === 'pv-' + key));
  });
});

/* ── Working terminal (cd / ls / help …) ── */
(function () {
  const body  = document.getElementById('term-body');
  const out   = document.getElementById('term-out');
  const input = document.getElementById('term-input');
  if (!body || !out || !input) return;

  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function line(html, cls) {
    const el = document.createElement('div');
    el.className = 'term-line' + (cls ? ' ' + cls : '');
    el.innerHTML = html;
    out.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  // echo a command as if typed (used when a nav tab is clicked)
  window.termEcho = function (promptText, cmd) {
    line('<span class="tp">' + esc(promptText) + '</span> <span class="term-cmd">' + esc(cmd) + '</span>');
  };

  const OPEN = {
    github:  'https://github.com/aaryaa07',
    linkedin:'https://linkedin.com/in/as-aryamansingh',
    email:   'mailto:as.aryamansingh@gmail.com',
    touchline:'https://touchline-erff.onrender.com/'
  };

  function run(raw) {
    const cmd = raw.trim();
    line('<span class="tp">' + esc(promptFor(currentSection)) + '</span> <span class="term-cmd">' + esc(cmd) + '</span>');
    if (!cmd) return;
    const parts = cmd.split(/\s+/);
    const name = parts[0].toLowerCase();
    const arg  = (parts[1] || '').toLowerCase();

    if (name === 'cd') {
      let t = (!arg || arg === '~' || arg === '/' || arg === '..') ? 'about'
            : arg.replace(/^\.\//, '').replace(/\/$/, '');
      if (SECTIONS.includes(t)) showPanel(t, { fromTerminal: true });
      else line('cd: no such section: ' + esc(arg) + '  — try <span class="term-accent">ls</span>', 'term-err');
    } else if (name === 'ls' || name === 'dir') {
      line('<span class="term-accent">about/  experience/  skills/  projects/  courses/</span>');
    } else if (name === 'pwd') {
      line('/home/aryaman/portfolio' + (currentSection === 'about' ? '' : '/' + currentSection), 'term-info');
    } else if (name === 'whoami') {
      line('Aryaman Singh — Full-Stack &amp; Data Engineer · 3+ years SWE @ Citrix · MS @ UT Dallas · open to work', 'term-info');
    } else if (name === 'help' || name === 'man') {
      line('commands: <span class="term-accent">cd &lt;section&gt;</span> · <span class="term-accent">ls</span> · <span class="term-accent">pwd</span> · <span class="term-accent">whoami</span> · <span class="term-accent">open &lt;github|linkedin|email&gt;</span> · <span class="term-accent">clear</span>', 'term-info');
      line('sections: <span class="term-accent">about experience skills projects courses</span>  — or just click the tabs above.', 'term-info');
    } else if (name === 'open') {
      if (OPEN[arg]) { line('opening ' + esc(arg) + ' …', 'term-info'); window.open(OPEN[arg], '_blank', 'noopener'); }
      else line('open: try <span class="term-accent">github</span> | <span class="term-accent">linkedin</span> | <span class="term-accent">email</span>', 'term-err');
    } else if (name === 'echo') {
      line(esc(parts.slice(1).join(' ')));
    } else if (name === 'clear' || name === 'cls') {
      out.innerHTML = '';
    } else {
      line('zsh: command not found: ' + esc(name) + '  (try <span class="term-accent">help</span>)', 'term-err');
    }
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const v = input.value; input.value = ''; run(v); }
  });
  body.addEventListener('click', () => input.focus());

  line('<span class="term-info">welcome — this terminal works. type <span class="term-accent">help</span>, or navigate with <span class="term-accent">cd projects</span>.</span>');
  setTermPrompt('about');
})();

/* ───────────────────────────────────────────────
   EXPERIENCE — country-road journey.
   • A winding SVG road snakes between roadside
     sign-posts (alternating left / right).
   • Each sign shows the company name; clicking it
     wobbles the sign and pops up an "alert" with
     the role and the work done there.
─────────────────────────────────────────────── */
(function () {
  const tl = document.getElementById('exp-timeline');
  if (!tl) return;

  const road  = tl.querySelector('.tl-road');
  const paths = tl.querySelectorAll('.tl-road-edge, .tl-road-base, .tl-road-dash');

  function buildRoad() {
    const nodes = Array.from(tl.querySelectorAll('.tl-node'));
    if (!nodes.length || !road) return;
    const W = tl.clientWidth, H = tl.clientHeight;
    const base = tl.getBoundingClientRect();
    road.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const pts = nodes.map(n => {
      const r = n.getBoundingClientRect();
      return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top };
    });

    // Bleed the road off the top and bottom like a real road.
    const head = { x: pts[0].x, y: -10 };
    const tail = { x: pts[pts.length - 1].x, y: H + 10 };
    const all = [head, ...pts, tail];

    let d = `M ${all[0].x.toFixed(1)} ${all[0].y.toFixed(1)}`;
    for (let i = 1; i < all.length; i++) {
      const a = all[i - 1], b = all[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x.toFixed(1)} ${my.toFixed(1)}, ${b.x.toFixed(1)} ${my.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    paths.forEach(p => p.setAttribute('d', d));
  }

  /* ── Pop-up modal ── */
  const modal = document.getElementById('exp-modal');
  const $ = id => document.getElementById(id);

  function openModal(sign) {
    $('exp-modal-period').textContent  = sign.dataset.period || '';
    $('exp-modal-co').textContent      = sign.dataset.company || '';
    $('exp-modal-role').textContent    = sign.dataset.role || '';
    $('exp-modal-summary').textContent = sign.dataset.summary || '';
    const tagWrap = $('exp-modal-tags');
    tagWrap.innerHTML = '';
    (sign.dataset.tags || '').split(',').forEach(t => {
      t = t.trim(); if (!t) return;
      const s = document.createElement('span');
      s.className = 'ptag';
      s.textContent = t;
      tagWrap.appendChild(s);
    });
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('show'));
  }
  function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => { modal.hidden = true; }, 280);
  }

  function tapSign(sign) {
    sign.classList.add('is-tapped');
    setTimeout(() => sign.classList.remove('is-tapped'), 560);
    openModal(sign);
  }

  tl.querySelectorAll('.tl-sign').forEach(sign => {
    bindTap(sign, () => tapSign(sign));
  });

  if (modal) {
    modal.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', closeModal);
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeModal();
      }, { passive: false });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  let rT;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(buildRoad, 80); });
  window.addEventListener('load', buildRoad);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildRoad);
  setTimeout(buildRoad, 150);
  setTimeout(buildRoad, 600);
  buildRoad();
})();
