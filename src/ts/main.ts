function initNavbar(): void {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  if (!navbar || !toggle || !menu) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
  });

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('navbar__menu--open');
  });

  menu.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('navbar__link')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('navbar__menu--open');
    }
  });
}

function initScrollAnimations(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

function initContactForm(): void {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  const success = document.getElementById('contactSuccess');

  if (!form || !success) return;

  form.addEventListener('submit', (e: Event) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName') as HTMLInputElement;
    const emailInput = document.getElementById('contactEmail') as HTMLInputElement;
    const messageInput = document.getElementById('contactMessage') as HTMLTextAreaElement;

    let isValid = true;

    isValid = validateField(nameInput, 'contactNameError', 'Please enter your name.') && isValid;
    isValid = validateEmail(emailInput) && isValid;
    isValid = validateField(messageInput, 'contactMessageError', 'Please enter a message.') && isValid;

    if (!isValid) return;

    form.hidden = true;
    success.hidden = false;
  });
}

function validateField(input: HTMLInputElement | HTMLTextAreaElement, errorId: string, message: string): boolean {
  const errorEl = document.getElementById(errorId);
  if (!errorEl) return true;

  if (!input.value.trim()) {
    input.classList.add('contact__input--invalid');
    errorEl.textContent = message;
    return false;
  }

  input.classList.remove('contact__input--invalid');
  errorEl.textContent = '';
  return true;
}

function validateEmail(input: HTMLInputElement): boolean {
  const errorEl = document.getElementById('contactEmailError');
  if (!errorEl) return true;

  const value = input.value.trim();

  if (!value) {
    input.classList.add('contact__input--invalid');
    errorEl.textContent = 'Please enter your email.';
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) {
    input.classList.add('contact__input--invalid');
    errorEl.textContent = 'Please enter a valid email.';
    return false;
  }

  input.classList.remove('contact__input--invalid');
  errorEl.textContent = '';
  return true;
}

function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      if (!href) return;

      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initContactForm();
  initSmoothScroll();
});
