// Tailwind Config
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif']
      },
      colors: {
        sand: '#f5f0eb',
        warm: '#e8e0d8',
        stone: '#8a8178',
        charcoal: '#2c2825',
        accent: '#b8a898'
      }
    }
  }
};

// Φόρτωση Header και Footer
async function loadComponents() {
  try {
    const headerRes = await fetch('header.html');
    document.getElementById('header-placeholder').innerHTML = await headerRes.text();

    const footerRes = await fetch('footer.html');
    document.getElementById('footer-placeholder').innerHTML = await footerRes.text();

    // Ενεργοποίηση εικονιδίων και active link μετά τη φόρτωση
    lucide.createIcons();
    setActiveLink();

    // Ελέγχουμε τα χρώματα του Header αμέσως μόλις φορτώσει
    updateHeaderState();
  } catch (error) {
    console.error('Σφάλμα φόρτωσης components:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
  lucide.createIcons(); // Για τα εικονίδια στο κυρίως σώμα
});

// Εύρεση Active Link
function setActiveLink() {
  const currentPath = window.location.pathname;
  let page = currentPath.split('/').pop().replace('.html', '');
  if (!page || page === '') page = 'index';

  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active-link'));
  const activeLink = document.querySelector(`[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active-link');
}

// Mobile Menu
window.toggleMobileMenu = function () {
  document.getElementById('mobile-menu').classList.toggle('hidden');
};

// Fade-in Animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

setTimeout(() => {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}, 100);

// Λογική για το χρώμα και το φόντο του Header
function updateHeaderState() {
  const header = document.getElementById('site-header');
  if (!header) return;

  // Βρίσκουμε αν είμαστε στην αρχική σελίδα
  const currentPath = window.location.pathname;
  let page = currentPath.split('/').pop().replace('.html', '');
  if (!page || page === '') page = 'index';
  const isHomePage = page === 'index';

  // Αν έχουμε σκρολάρει πάνω από 100px
  if (window.scrollY > 100) {
    header.classList.add('bg-white', 'shadow-md', 'text-charcoal');
    header.classList.remove('bg-transparent', 'text-white');
  } else {
    // Αν είμαστε στην κορυφή της σελίδας
    header.classList.remove('bg-white', 'shadow-md');
    header.classList.add('bg-transparent');

    // Αν είμαστε στην Αρχική, τα γράμματα γίνονται λευκά. Αλλιώς παραμένουν σκούρα.
    if (isHomePage) {
      header.classList.add('text-white');
      header.classList.remove('text-charcoal');
    } else {
      header.classList.add('text-charcoal');
      header.classList.remove('text-white');
    }
  }
}

// Εκτέλεση της λογικής κατά το σκρολάρισμα
window.addEventListener('scroll', updateHeaderState);

// Φόρμα Επικοινωνίας & Toast Banner (Τρέχει μόνο στο contact.html)
const contactForm = document.getElementById('contact-form');
const toastBanner = document.getElementById('toast-banner');

if (contactForm && toastBanner) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
      // Εμφάνιση του Banner με animation
      toastBanner.classList.remove('-translate-y-32', 'opacity-0');
      toastBanner.classList.add('translate-y-0', 'opacity-100');

      // Καθαρισμός της φόρμας
      contactForm.reset();

      // Κρύψιμο του Banner μετά από 5 δευτερόλεπτα
      setTimeout(() => {
        toastBanner.classList.remove('translate-y-0', 'opacity-100');
        toastBanner.classList.add('-translate-y-32', 'opacity-0');
      }, 5000);
    }
  });
}

// --- Λογική Cookies ---

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// --- Cookie Banner ---

function initCookieBanner() {
  // Αν το cookie υπάρχει ήδη, δεν κάνουμε τίποτα
  if (getCookie("agia_marina_cookie_consent")) return;

  // Δημιουργία του HTML του banner
  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  // Tailwind classes για εμφάνιση (fixed στο κάτω μέρος)
  banner.className = 'fixed bottom-0 left-0 w-full bg-charcoal text-white z-[200] p-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] hidden-banner';

  banner.innerHTML = `
        <div class="flex-1">
            <p class="text-sm font-light tracking-wide leading-relaxed">
                <span class="font-medium text-accent uppercase text-xs tracking-widest block mb-1">Privacy Preference</span>
                We use cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our use of cookies.
            </p>
        </div>
        <div class="flex items-center gap-4">
            <a href="privacy-policy.html" class="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors">Privacy Policy</a>
            <button id="accept-cookies" class="bg-white text-charcoal px-8 py-2 text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300">
                Accept
            </button>
        </div>
    `;

  document.body.appendChild(banner);

  // Μικρή καθυστέρηση για να δουλέψει το animation εισόδου
  setTimeout(() => {
    banner.classList.remove('hidden-banner');
  }, 1000);

  // Event Listener για το κουμπί
  document.getElementById('accept-cookies').addEventListener('click', () => {
    setCookie("agia_marina_cookie_consent", "false", 1);
    banner.classList.add('hidden-banner');
    setTimeout(() => banner.remove(), 600);
  });
}

// Εκτέλεση μόλις φορτώσει η σελίδα
document.addEventListener('DOMContentLoaded', () => {
  // ... εδώ έχεις τον υπάρχοντα κώδικα (loadComponents κλπ) ...
  initCookieBanner();
});

// Κοινή συνάρτηση ελέγχου Honeypot
function isSpam(formId) {
  const hpField = document.querySelector(`#${formId} [name^="hp_"]`);
  return hpField && hpField.value !== "";
}

// Logic για το Contact Form
document.addEventListener('submit', function (e) {
  if (e.target && e.target.id === 'contact-form') {
    e.preventDefault();

    if (isSpam('contact-form')) {
      console.warn("Bot detected. Submission blocked.");
      return; // Σταματάει εδώ, δεν στέλνει τίποτα
    }

    // Εδώ συνεχίζει ο κώδικας που στέλνει το email (π.χ. EmailJS ή fetch)
    showToast("Message sent successfully!");
  }

  // Logic για το Newsletter Form
  if (e.target && e.target.id === 'newsletter-form') {
    e.preventDefault();

    if (isSpam('newsletter-form')) return;

    // Εδώ συνεχίζει η εγγραφή στο newsletter
    showToast("Thank you for subscribing!");
  }
});



function moveSlide(carouselId, direction) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.slide');
  if (slides.length === 0) return;

  // Βρίσκουμε την τρέχουσα ενεργή εικόνα (αυτή με opacity-100)
  let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('opacity-100'));

  // Αν για κάποιο λόγο δεν βρει καμία (π.χ. λάθος στο αρχικό HTML), ξεκινάει από την πρώτη
  if (currentIndex === -1) currentIndex = 0;

  // 1. Σβήνουμε την τρέχουσα εικόνα
  slides[currentIndex].classList.remove('opacity-100');
  slides[currentIndex].classList.add('opacity-0');

  // 2. Υπολογίζουμε την επόμενη εικόνα
  let nextIndex = (currentIndex + direction + slides.length) % slides.length;

  // 3. Εμφανίζουμε την επόμενη
  slides[nextIndex].classList.remove('opacity-0');
  slides[nextIndex].classList.add('opacity-100');
}

// // Αυτόματο παίξιμο (προαιρετικό) - Κάθε 5 δευτερόλεπτα
// setInterval(() => {
//   const allCarousels = document.querySelectorAll('.carousel');
//   allCarousels.forEach(c => moveSlide(c.id, 1));
// }, 5000);