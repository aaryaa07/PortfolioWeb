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

/* ── Smooth scroll: nav links scroll the main panel on desktop ── */
const mainEl   = document.getElementById('main-scroll');
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    /* On mobile the body scrolls; on desktop `.main` scrolls */
    if (window.innerWidth > 900) {
      mainEl.scrollTo({ top: target.offsetTop - 32, behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Active nav highlight on scroll ── */
const sections = document.querySelectorAll('.section');

function getScrollRoot() {
  return window.innerWidth > 900 ? mainEl : null; /* null = viewport */
}

function buildObserver() {
  const root = getScrollRoot();
  return new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, {
    root,
    threshold: 0.35,
    rootMargin: '-10% 0px -40% 0px',
  });
}

let observer = buildObserver();
sections.forEach(s => observer.observe(s));

/* Rebuild observer if layout switches between desktop / mobile */
let prevWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if ((window.innerWidth > 900) !== (prevWidth > 900)) {
    observer.disconnect();
    observer = buildObserver();
    sections.forEach(s => observer.observe(s));
    prevWidth = window.innerWidth;
  }
});
