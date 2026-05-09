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
let ignoreObserver = false;

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    ignoreObserver = true;
    window.setTimeout(() => {
      ignoreObserver = false;
    }, 500);

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

function updateActiveSection() {
  if (ignoreObserver) return;

  const root = getScrollRoot();
  const scrollTop = root ? root.scrollTop : window.scrollY;
  const offset = 100;
  let activeId = sections[0]?.id;

  sections.forEach(section => {
    const sectionTop = root ? section.offsetTop : section.getBoundingClientRect().top + scrollTop;
    if (sectionTop <= scrollTop + offset) {
      activeId = section.id;
    }
  });

  navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === activeId));
}

function attachScrollListener() {
  const root = getScrollRoot();
  const target = root || window;
  target.addEventListener('scroll', updateActiveSection);
}

function detachScrollListener() {
  const root = getScrollRoot();
  const target = root || window;
  target.removeEventListener('scroll', updateActiveSection);
}

let prevWidth = window.innerWidth;
attachScrollListener();
updateActiveSection();

window.addEventListener('resize', () => {
  const currentWidth = window.innerWidth;
  if ((currentWidth > 900) !== (prevWidth > 900)) {
    detachScrollListener();
    attachScrollListener();
    prevWidth = currentWidth;
    updateActiveSection();
  }
});
