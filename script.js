// Navbar scroll shadow
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 6);
}, { passive: true });

// Mobile drawer
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
const drawerClose = document.getElementById('drawerClose');

hamburger.addEventListener('click', () => {
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeDrawer() {
  drawer.classList.remove('open');
  document.body.style.overflow = '';
}

drawerClose.addEventListener('click', closeDrawer);
drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });
drawer.querySelectorAll('.drawer-link, .drawer-cta, .drawer-acc-body a').forEach(a => {
  a.addEventListener('click', closeDrawer);
});

// Accordion in mobile drawer
function setupAccordion(btnId, bodyId) {
  const btn = document.getElementById(btnId);
  const body = document.getElementById(bodyId);
  if (!btn || !body) return;
  btn.addEventListener('click', () => {
    const isOpen = body.classList.contains('open');
    btn.classList.toggle('open', !isOpen);
    body.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
}
setupAccordion('accServices', 'accServicesBody');
setupAccordion('accResources', 'accResourcesBody');

// Newsletter form
const form = document.getElementById('newsletterForm');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.style.display = 'none';
  successMsg.style.display = 'block';
  setTimeout(() => {
    form.reset();
    form.style.display = 'flex';
    successMsg.style.display = 'none';
  }, 4000);
});

// Scroll-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      target.style.opacity = '1';
      target.style.transform = 'translateY(0)';
      observer.unobserve(target);
    }
  });
}, { threshold: 0.08 });

const animTargets = document.querySelectorAll(
  '.model-card, .outcome-card, .callout-block, .evidence-aside, .capacity-aside, .founder-visual'
);
animTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
  observer.observe(el);
});
