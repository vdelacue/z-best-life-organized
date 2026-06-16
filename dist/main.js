"use strict";
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!navbar || !toggle || !menu)
        return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
    });
    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        menu.classList.toggle('navbar__menu--open');
    });
    menu.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('navbar__link')) {
            toggle.setAttribute('aria-expanded', 'false');
            menu.classList.remove('navbar__menu--open');
        }
    });
}
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    elements.forEach((el) => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}
function initContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('contactSuccess');
    if (!form || !success)
        return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const messageInput = document.getElementById('contactMessage');
        let isValid = true;
        isValid = validateField(nameInput, 'contactNameError', 'Please enter your name.') && isValid;
        isValid = validateEmail(emailInput) && isValid;
        isValid = validateField(messageInput, 'contactMessageError', 'Please enter a message.') && isValid;
        if (!isValid)
            return;
        form.hidden = true;
        success.hidden = false;
    });
}
function validateField(input, errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (!errorEl)
        return true;
    if (!input.value.trim()) {
        input.classList.add('contact__input--invalid');
        errorEl.textContent = message;
        return false;
    }
    input.classList.remove('contact__input--invalid');
    errorEl.textContent = '';
    return true;
}
function validateEmail(input) {
    const errorEl = document.getElementById('contactEmailError');
    if (!errorEl)
        return true;
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
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.currentTarget.getAttribute('href');
            if (!href)
                return;
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
