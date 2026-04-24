/* ═══════════════════════════════════════════════════
   ULTANGBER — Enhanced main.js (Optimised & Clean)
   Handles: Language, Navigation, Animations, Effects
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ───────────────────────────────────────────────
       UTILITIES
    ─────────────────────────────────────────────── */
    const $ = (sel, scope = document) => scope.querySelector(sel);
    const $$ = (sel, scope = document) => scope.querySelectorAll(sel);

    function debounce(fn, delay = 100) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /* ───────────────────────────────────────────────
       LANGUAGE TOGGLE
    ─────────────────────────────────────────────── */
    const STORAGE_KEY = 'ultangber_lang';
    let currentLang = localStorage.getItem(STORAGE_KEY) || 'ms';

    function applyLang(lang) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;

        $$('[data-lang-show]').forEach(el => {
            const show = el.getAttribute('data-lang-show') === lang;
            el.classList.toggle('lang-hidden', !show);
            el.style.display = show ? '' : 'none';
        });

        const flag = $('#langBtnFlag');
        if (flag) flag.textContent = lang === 'ms' ? '🇬🇧' : '🇲🇾';
    }

    document.addEventListener('DOMContentLoaded', () => {
        applyLang(currentLang);

        const btn = $('#langToggleBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                applyLang(currentLang === 'ms' ? 'en' : 'ms');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });

    /* ───────────────────────────────────────────────
       MOBILE NAV + DROPDOWN
    ─────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        const hamburger = $('#hamburgerBtn');
        const nav = $('#navLinks');
        const header = $('#site-header');

        if (!hamburger || !nav || !header) return;

        function setHeaderHeight() {
            document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
        }
        setHeaderHeight();
        window.addEventListener('resize', debounce(setHeaderHeight, 150));

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('open');
            hamburger.classList.toggle('open');
        });

        // dropdown (mobile)
        $$('.nav-dropdown').forEach(dd => {
            const btn = $('.nav-dropdown-btn', dd);
            if (!btn) return;

            btn.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dd.classList.toggle('open');
                }
            });
        });

        // close on click
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                nav.classList.remove('open');
                hamburger.classList.remove('open');
                $$('.nav-dropdown').forEach(d => d.classList.remove('open'));
            }
        });

        // close on link click
        $$('#navLinks a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                hamburger.classList.remove('open');
            });
        });
    });

    /* ───────────────────────────────────────────────
       ACTIVE NAV LINK
    ─────────────────────────────────────────────── */
    window.addEventListener('load', () => {
        const sections = $$('section[id]');
        const links = $$('.nav-links a');

        function updateNav() {
            let current = '';
            sections.forEach(sec => {
                const top = sec.offsetTop - 120;
                if (window.scrollY >= top) current = sec.id;
            });

            links.forEach(link => {
                link.classList.toggle('nav-active',
                    link.getAttribute('href') === '#' + current
                );
            });
        }

        window.addEventListener('scroll', debounce(updateNav, 50));
        updateNav();
    });

    /* ───────────────────────────────────────────────
       SCROLL REVEAL
    ─────────────────────────────────────────────── */
    window.addEventListener('load', () => {
        const items = $$('.reveal');

        if (!('IntersectionObserver' in window)) {
            items.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.1 });

        items.forEach(el => observer.observe(el));
    });

    /* ───────────────────────────────────────────────
       HERO ANIMATION
    ─────────────────────────────────────────────── */
    window.addEventListener('load', () => {
        const hero = $('.hero-text');
        if (!hero) return;

        const elements = hero.querySelectorAll('*');

        elements.forEach((el, i) => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.5s ease';

            setTimeout(() => {
                el.style.opacity = 1;
                el.style.transform = 'translateY(0)';
            }, 150 + i * 80);
        });
    });

    /* ───────────────────────────────────────────────
       STAT COUNTER
    ─────────────────────────────────────────────── */
    function animateCount(el, target, suffix = '', duration = 1200) {
        let start = 0;
        const step = target / (duration / 16);

        function update() {
            start += step;
            if (start >= target) {
                el.textContent = target + suffix;
                return;
            }
            el.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(update);
        }
        update();
    }

    window.addEventListener('load', () => {
        const stats = $$('.stat-block');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = $('.stat-val', entry.target);
                if (!el || el.dataset.done) return;

                el.dataset.done = "1";
                const num = parseInt(el.textContent.replace(/\D/g, ''));
                const suffix = el.textContent.includes('%') ? '%' : '';

                el.textContent = '0' + suffix;
                animateCount(el, num, suffix);

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        stats.forEach(s => observer.observe(s));
    });

    /* ───────────────────────────────────────────────
       SCROLL PROGRESS BAR
    ─────────────────────────────────────────────── */
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = 0;
    progressBar.style.left = 0;
    progressBar.style.height = '4px';
    progressBar.style.background = 'var(--red)';
    progressBar.style.zIndex = 9999;
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', debounce(() => {
        const scroll = window.scrollY;
        const height = document.body.scrollHeight - window.innerHeight;
        const percent = (scroll / height) * 100;
        progressBar.style.width = percent + '%';
    }, 10));

    /* ───────────────────────────────────────────────
       CARD TILT EFFECT (DESKTOP ONLY)
    ─────────────────────────────────────────────── */
    function addTilt(selector) {
        if (!window.matchMedia('(hover: hover)').matches) return;

        $$(selector).forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                card.style.transform =
                    `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.03)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    window.addEventListener('load', () => {
        addTilt('.komponen-card');
        addTilt('.team-card');
        addTilt('.dl-card');
        addTilt('.award-card');
    });

    /* ───────────────────────────────────────────────
       SMOOTH SCROLL
    ─────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        const header = $('#site-header');

        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const target = $(this.getAttribute('href'));
                if (!target) return;

                e.preventDefault();

                const offset = header ? header.offsetHeight + 10 : 0;

                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            });
        });
    });

})();
