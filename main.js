/* ==========================================================================
   THEWEBVUE — shared site behavior (used on every page)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSmoothScroll();
  initRevealOnScroll();
});

/* ---------- mobile nav ---------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const panel = document.getElementById('mobilePanel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.classList.toggle('rotate-90', isOpen);
  });

  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

/* ---------- smooth scroll for same-page anchors ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---------- reveal-on-scroll ---------- */
function initRevealOnScroll() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!targets.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(t => t.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));
}

/* ---------- back navigation ---------- */
// Used by the "Back to..." link on category pages. If the visitor actually
// came from within this site, take them back to wherever that was (native
// browser history). Otherwise (e.g. they opened the page directly from a
// shared link), fall back to the given href instead of a dead-end.
function goBack(event, fallbackHref) {
  const cameFromSameSite = document.referrer && document.referrer.indexOf(window.location.origin) === 0;
  if (cameFromSameSite && window.history.length > 1) {
    event.preventDefault();
    window.history.back();
    return false;
  }
  return true; // let the normal href navigation happen
}


const WHATSAPP_NUMBER = '919629006826';
const CALL_NUMBER = '+919629006826';

function getFormData() {
  const nameEl = document.getElementById('userName');
  const numberEl = document.getElementById('userNumber');
  const locationEl = document.getElementById('userLocation');
  const templateEl = document.getElementById('templateGroup');
  if (!nameEl || !numberEl || !locationEl || !templateEl) return null;

  const name = nameEl.value.trim();
  const number = numberEl.value.trim();
  const location = locationEl.value.trim();
  const template = templateEl.value;

  if (!name || !number || !location || !template) {
    alert('Please fill in all contact details (Name, Phone Number, Location, and Template) before proceeding to WhatsApp.');
    return null;
  }
  return { name, number, location, template };
}

function buildMessage(data) {
  return `Hello Thewebvue! \uD83D\uDC4B\n\nI am interested in getting an event website template. Here are my details:\n\n\uD83D\uDC64 *Name:* ${data.name}\n\uD83D\uDCDE *Phone:* ${data.number}\n\uD83D\uDCCD *Location:* ${data.location}\n\uD83C\uDFA8 *Category:* ${data.template}\n\nPlease let me know the next steps!`;
}

function handleWhatsApp() {
  const data = getFormData();
  if (!data) return;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(data))}`, '_blank');
}

function handleFloatingWhatsApp() {
  const data = getFormData();
  if (!data) {
    const contactSection = document.getElementById('contact-us');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    // No contact form on this page — go straight to WhatsApp with a generic greeting
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Thewebvue! I'd like to know more about your event website templates.")}`, '_blank');
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(data))}`, '_blank');
}

function handleCall() {
  window.location.href = `tel:${CALL_NUMBER}`;
}

/* Pre-fill the template dropdown when arriving from a category page link,
   e.g. index.html#contact-us?template=Weddings%20%26%20Engagements */
(function prefillTemplateFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get('template');
  if (!wanted) return;
  document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('templateGroup');
    if (select) select.value = wanted;
  });
})();