// Mobile nav
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// Active nav link by current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Fade in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Drag-scroll gallery strip
const scrollEl = document.querySelector('.gallery-scroll');
if (scrollEl) {
  let isDown = false, startX, scrollLeft;
  scrollEl.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - scrollEl.offsetLeft;
    scrollLeft = scrollEl.scrollLeft;
  });
  scrollEl.addEventListener('mouseleave', () => isDown = false);
  scrollEl.addEventListener('mouseup', () => isDown = false);
  scrollEl.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollEl.offsetLeft;
    scrollEl.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

// Carta tabs
const tabs = document.querySelectorAll('.carta-tab');
const cartaSections = document.querySelectorAll('.carta-section[data-section]');

if (tabs.length && cartaSections.length) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      const section = document.querySelector(`.carta-section[data-section="${target}"]`);
      if (section) {
        const offset = section.getBoundingClientRect().top + window.scrollY - 160;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    cartaSections.forEach(sec => {
      if (sec.getBoundingClientRect().top < 200) current = sec.dataset.section;
    });
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === current));
  });
}

// ── Language system ──────────────────────────────────────────────
function applyLang(lang) {
  if (typeof translations === 'undefined' || !translations[lang]) return;
  localStorage.setItem('raconsLang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const t = translations[lang][el.getAttribute('data-i18n')];
    if (t !== undefined) el.textContent = t;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const t = translations[lang][el.getAttribute('data-i18n-html')];
    if (t !== undefined) el.innerHTML = t;
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  const pageTitles = {
    es: { index: "Raco'ns Xiringuito — Platja del Racó, Begur", carta: "Carta — Raco'ns Xiringuito · Begur", galeria: "Galería — Raco'ns Xiringuito · Begur", contacto: "Contacto — Raco'ns Xiringuito · Begur" },
    ca: { index: "Raco'ns Xiringuito — Platja del Racó, Begur", carta: "Carta — Raco'ns Xiringuito · Begur", galeria: "Galeria — Raco'ns Xiringuito · Begur", contacto: "Contacte — Raco'ns Xiringuito · Begur" },
    en: { index: "Raco'ns Xiringuito — Platja del Racó, Begur", carta: "Menu — Raco'ns Xiringuito · Begur", galeria: "Gallery — Raco'ns Xiringuito · Begur", contacto: "Contact — Raco'ns Xiringuito · Begur" },
  };
  const page = document.body.getAttribute('data-page');
  if (page && pageTitles[lang]) document.title = pageTitles[lang][page] || document.title;
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.lang-btn');
  if (btn) applyLang(btn.getAttribute('data-lang'));
});

applyLang(localStorage.getItem('raconsLang') || 'es');

// Lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox img');
const lightboxClose = document.querySelector('.lightbox-close');

if (lightbox) {
  document.querySelectorAll('.gallery-masonry-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}
