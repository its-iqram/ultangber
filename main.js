/* ═══════════════════════════════════════════════════
   ULTANGBER — main.js
   All interactivity, animations & language logic
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── LANGUAGE TOGGLE ──────────────────────────── */
    const STORAGE_KEY = 'ultangber_lang';
    const btn      = document.getElementById('langToggleBtn');
    const btnFlag  = document.getElementById('langBtnFlag');
    const btnLabel = document.getElementById('langBtnLabel');
    const htmlEl   = document.documentElement;
    let currentLang = localStorage.getItem(STORAGE_KEY) || 'ms';

    function applyLang(lang) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        htmlEl.lang = lang;
        const titleEl = document.querySelector('title');
        if (titleEl) {
            titleEl.textContent = titleEl.getAttribute('data-lang-' + lang) || titleEl.textContent;
        }
        
        // Show elements for current language, hide others
        document.querySelectorAll('[data-lang-show="ms"]').forEach(el => {
            if (lang === 'ms') {
                el.classList.remove('lang-hidden');
            } else {
                el.classList.add('lang-hidden');
            }
        });
        
        document.querySelectorAll('[data-lang-show="en"]').forEach(el => {
            if (lang === 'en') {
                el.classList.remove('lang-hidden');
            } else {
                el.classList.add('lang-hidden');
            }
        });
        
        if (lang === 'ms') {
            btnFlag.textContent  = '🇬🇧';
            btnLabel.textContent = 'English';
        } else {
            btnFlag.textContent  = '🇲🇾';
            btnLabel.textContent = 'Melayu';
        }
    }

    btn.addEventListener('click', function () {
        applyLang(currentLang === 'ms' ? 'en' : 'ms');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Apply language immediately - this runs as soon as the script loads
    applyLang(currentLang);


    /* ── HAMBURGER MENU ───────────────────────────── */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks     = document.getElementById('navLinks');
    const siteHeader   = document.getElementById('site-header');

    function setHeaderHeight() {
        const h = siteHeader ? siteHeader.offsetHeight : 0;
        document.documentElement.style.setProperty('--header-h', h + 'px');
    }
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

    hamburgerBtn.addEventListener('click', function () {
        const isOpen = navLinks.classList.contains('open');
        navLinks.classList.toggle('open', !isOpen);
        hamburgerBtn.classList.toggle('open', !isOpen);
        hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburgerBtn.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        if (!siteHeader.contains(e.target)) {
            navLinks.classList.remove('open');
            hamburgerBtn.classList.remove('open');
        }
    });


    /* ── ACTIVE NAV LINK ON SCROLL ────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        navAnchors.forEach(a => {
            a.classList.remove('nav-active');
            if (a.getAttribute('href') === '#' + current) a.classList.add('nav-active');
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });


    /* ── SCROLL REVEAL ────────────────────────────── */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger siblings slightly
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let delay = 0;
                siblings.forEach((sib, idx) => {
                    if (sib === entry.target) delay = idx * 80;
                });
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    /* ── HERO TEXT ENTRANCE ───────────────────────── */
    const heroText = document.querySelector('.hero-text:not(.lang-hidden)');
    if (heroText) {
        const introWord  = heroText.querySelector('.hero-intro-word');
        const logoEl     = heroText.querySelector('.hero-logo-big, .hero-logo-fallback');
        const tagline    = heroText.querySelector('.hero-tagline');
        const subtitle   = heroText.querySelector('.hero-subtitle');
        const actions    = heroText.querySelector('.hero-actions');
        const items = [introWord, logoEl, tagline, subtitle, actions].filter(Boolean);

        items.forEach(el => {
            el.style.opacity   = '0';
            el.style.transform = 'translateY(32px)';
            el.style.transition = 'opacity .55s ease, transform .55s ease';
        });

        setTimeout(() => {
            items.forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity   = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 130);
            });
        }, 200);
    }


    /* ── STAT COUNTER ANIMATION ───────────────────── */
    function animateCount(el, target, suffix, duration) {
        const start = performance.now();
        const isFloat = String(target).includes('.');
        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
            const value = Math.round(ease * target * 10) / 10;
            el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valEl = entry.target.querySelector('.stat-val');
                if (!valEl || valEl.dataset.animated) return;
                valEl.dataset.animated = '1';
                const raw = valEl.textContent.trim(); // e.g. "+30%", "100%", "30"
                const prefix = raw.startsWith('+') ? '+' : '';
                const suffix = raw.includes('%') ? '%' : '';
                const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
                valEl.textContent = prefix + '0' + suffix;
                animateCount(valEl, num, suffix, 1400);
                if (prefix) valEl.textContent = prefix + valEl.textContent;
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-block').forEach(el => statObserver.observe(el));

    // Fix prefix issue — re-attach prefix after animation
    document.querySelectorAll('.stat-val').forEach(el => {
        const raw = el.textContent.trim();
        const prefix = raw.startsWith('+') ? '+' : '';
        if (prefix) {
            const origAnim = animateCount;
            // Will be handled inside animateCount via prefix in display
        }
    });


    /* ── NAVBAR SCROLL SHADOW ─────────────────────── */
    window.addEventListener('scroll', () => {
        siteHeader.style.boxShadow = window.scrollY > 10
            ? '0 4px 20px rgba(0,0,0,0.35)'
            : 'none';
    }, { passive: true });


    /* ── CARD TILT EFFECT (desktop only) ─────────── */
    function addTilt(selector) {
        if (window.matchMedia('(hover: hover)').matches) {
            document.querySelectorAll(selector).forEach(card => {
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width  - 0.5;
                    const y = (e.clientY - rect.top)  / rect.height - 0.5;
                    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
                    card.style.transition = 'transform .05s';
                    card.style.zIndex = '2';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                    card.style.transition = 'transform .35s ease, background .2s';
                    card.style.zIndex = '';
                });
            });
        }
    }
    addTilt('.audience-card');
    addTilt('.komponen-card');
    addTilt('.team-card');


    /* ── SMOOTH ANCHOR SCROLLING ──────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = siteHeader ? siteHeader.offsetHeight + 8 : 0;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
        });
    });


    /* ── MOCKUP PLAY BUTTON PULSE ─────────────────── */
    const mockupBtn = document.querySelector('.mockup-play-btn');
    if (mockupBtn) {
        setInterval(() => {
            mockupBtn.style.background = 'var(--yellow)';
            mockupBtn.style.color = 'var(--black, #080808)';
            setTimeout(() => {
                mockupBtn.style.background = 'var(--red)';
                mockupBtn.style.color = 'white';
            }, 600);
        }, 2800);
    }


    /* ── ACTIVE NAV STYLE VIA CSS VAR ────────────── */
    const style = document.createElement('style');
    style.textContent = `.nav-links a.nav-active { color: var(--yellow) !important; }`;
    document.head.appendChild(style);


})();
