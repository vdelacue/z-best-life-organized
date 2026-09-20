function initThemeToggle(): void {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  if (!toggle) return;

  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    html.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

function initNavbar(): void {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  if (!navbar || !toggle || !menu) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('nav--scrolled', window.scrollY > 60);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('nav__links--open');
  });

  menu.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('nav__link')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('nav__links--open');
    }
  });
}

function initScrollAnimations(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.animationDelay = `${i * 0.1}s`;
          el.classList.add('animate-in');
          // Drop the inline opacity:0 set below. Elements that have a matching
          // .animate-in animation fade in from their own keyframes; elements that
          // don't would otherwise stay invisible forever while still taking up space.
          el.style.opacity = '';
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      if (!href) return;

      const target = document.querySelector(href);
      if (target) {
        const navHeight = document.getElementById('navbar')?.offsetHeight ?? 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

const FORM_ENDPOINT = 'https://api.web3forms.com/submit';

interface FormEndpointResponse {
  success?: boolean;
  message?: string;
}

function initContactForm(): void {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  const success = document.getElementById('contactSuccess');
  const submitBtn = document.getElementById('contactSubmit') as HTMLButtonElement | null;
  const formError = document.getElementById('contactFormError');

  if (!form || !success || !submitBtn || !formError) return;

  const defaultLabel = submitBtn.textContent ?? 'Send Message';

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const messageInput = document.getElementById('message') as HTMLTextAreaElement;

    //Run every validator so all three fields show their error at once.
    const nameValid = validateRequired(nameInput, 'nameError', 'Please enter your name.');
    const emailValid = validateEmail(emailInput);
    const messageValid = validateRequired(messageInput, 'messageError', 'Please tell me about your space.');

    if (!nameValid || !emailValid || !messageValid) return;

    formError.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = (await response.json()) as FormEndpointResponse;
      if (!result.success) {
        throw new Error(result.message ?? 'The form service rejected the submission.');
      }

      form.hidden = true;
      success.hidden = false;
    } catch {
      formError.textContent =
        "Sorry, that didn't go through. Please try again, or reach out on Instagram.";
      submitBtn.disabled = false;
      submitBtn.textContent = defaultLabel;
    }
  });
}

function validateRequired(
  input: HTMLInputElement | HTMLTextAreaElement,
  errorId: string,
  message: string
): boolean {
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
  const errorEl = document.getElementById('emailError');
  if (!errorEl) return true;

  const value = input.value.trim();

  if (!value) {
    input.classList.add('contact__input--invalid');
    errorEl.textContent = 'Please enter your email.';
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    input.classList.add('contact__input--invalid');
    errorEl.textContent = 'Please enter a valid email.';
    return false;
  }

  input.classList.remove('contact__input--invalid');
  errorEl.textContent = '';
  return true;
}

interface ServiceSlide {
  image: string;
  caption: string;
}

interface ServiceData {
  title: string;
  slides: ServiceSlide[];
}

const SERVICE_DATA: Record<string, ServiceData> = {
  closets: {
    title: 'Closets & Wardrobes',
    slides: [
      { image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80', caption: 'Custom-designed closet systems that maximize every inch of space.' },
      { image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80', caption: 'Organized wardrobes where everything has its place.' },
      { image: 'https://images.unsplash.com/photo-1616627577385-5c0c4dab55a5?w=800&q=80', caption: 'Seasonal rotation systems that keep your closet clutter-free.' },
    ],
  },
  pantries: {
    title: 'Pantries & Kitchens',
    slides: [
      { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', caption: 'Beautifully labeled containers that make meal prep a breeze.' },
      { image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80', caption: 'Deep pantry organization with pull-out systems and clear zones.' },
      { image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80', caption: 'Kitchen drawers sorted so every utensil is within reach.' },
    ],
  },
  mudrooms: {
    title: 'Mudrooms & Entryways',
    slides: [
      { image: 'https://images.unsplash.com/photo-1585128903994-9788298932a4?w=800&q=80', caption: 'Drop zones that keep bags, shoes, and coats off the floor.' },
      { image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80', caption: 'Hooks, cubbies, and baskets tailored for every family member.' },
      { image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', caption: 'Entryway benches with hidden storage for a clean first impression.' },
    ],
  },
  playrooms: {
    title: 'Playrooms & Family Spaces',
    slides: [
      { image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=800&q=80', caption: 'Toy rotation systems kids can actually use on their own.' },
      { image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80', caption: 'Color-coded bins and labels that make cleanup feel like a game.' },
      { image: 'https://images.unsplash.com/photo-1598928506311-c55ez16305e8?w=800&q=80', caption: 'Family rooms that balance grown-up style with kid-friendly function.' },
    ],
  },
};

function initServiceModal(): void {
  const modal = document.getElementById('serviceModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');
  const counterEl = document.getElementById('modalCounter');
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (!modal || !track || !dotsContainer || !titleEl || !descEl || !counterEl) return;

  let currentIndex = 0;
  let currentSlides: ServiceSlide[] = [];

  function renderSlides(data: ServiceData): void {
    currentSlides = data.slides;
    currentIndex = 0;

    titleEl!.textContent = data.title;

    track!.innerHTML = data.slides
      .map((slide) => `<div class="modal__slide"><img src="${slide.image}" alt="${slide.caption}" loading="lazy"></div>`)
      .join('');

    dotsContainer!.innerHTML = data.slides
      .map((_, i) => `<button class="modal__dot${i === 0 ? ' modal__dot--active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`)
      .join('');

    updateCarousel();
  }

  function updateCarousel(): void {
    const slides = track!.querySelectorAll<HTMLElement>('.modal__slide');
    slides.forEach((slide) => {
      slide.style.transform = `translateX(-${currentIndex * 100}%)`;
    });

    const dots = dotsContainer!.querySelectorAll('.modal__dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('modal__dot--active', i === currentIndex);
    });

    descEl!.textContent = currentSlides[currentIndex]?.caption ?? '';
    counterEl!.textContent = `${currentIndex + 1} / ${currentSlides.length}`;
  }

  function openModal(serviceKey: string): void {
    const data = SERVICE_DATA[serviceKey];
    if (!data) return;

    renderSlides(data);
    modal!.classList.add('modal--open');
    modal!.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(): void {
    modal!.classList.remove('modal--open');
    modal!.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll<HTMLElement>('[data-service]').forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-service');
      if (key) openModal(key);
    });

    card.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const key = card.getAttribute('data-service');
        if (key) openModal(key);
      }
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  prevBtn?.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : currentSlides.length - 1;
    updateCarousel();
  });

  nextBtn?.addEventListener('click', () => {
    currentIndex = currentIndex < currentSlides.length - 1 ? currentIndex + 1 : 0;
    updateCarousel();
  });

  dotsContainer.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const index = target.getAttribute('data-index');
    if (index !== null) {
      currentIndex = parseInt(index, 10);
      updateCarousel();
    }
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (modal!.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : currentSlides.length - 1;
      updateCarousel();
    }
    if (e.key === 'ArrowRight') {
      currentIndex = currentIndex < currentSlides.length - 1 ? currentIndex + 1 : 0;
      updateCarousel();
    }
  });
}

function initHeroVideo(): void {
  const video = document.querySelector<HTMLVideoElement>('.hero__video video');
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;

  const play = (): void => {
    const attempt = video.play();
    if (attempt !== undefined) {
      attempt.catch(() => {
        const resume = (): void => {
          video.play().catch(() => {});
          ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach((evt) =>
            window.removeEventListener(evt, resume)
          );
        };
        ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach((evt) => 
          window.addEventListener(evt, resume, { once: true, passive: true })
        );
      });
    }
  }

  if (video.readyState >= 2) {
    play();
  } else {
    video.addEventListener('loadeddata', play, { once: true });
    video.addEventListener('canplay', play, {once: true});
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initScrollAnimations();
  initSmoothScroll();
  initContactForm();
  initServiceModal();
  initHeroVideo();
});
