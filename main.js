/* ═══════════════════════════════════════════════════
   ULTANGBER — main.js
   All interactivity, animations & language logic
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── LANGUAGE TOGGLE ──────────────────────────── */
    const STORAGE_KEY = 'ultangber_lang';
    let currentLang = localStorage.getItem(STORAGE_KEY) || 'ms';

    // Apply language on DOM ready
    function applyLang(lang) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;
        
        // Update page title
        const titleEl = document.querySelector('title');
        if (titleEl) {
            const titleText = titleEl.getAttribute('data-lang-' + lang);
            if (titleText) {
                titleEl.textContent = titleText;
            }
        }
        
        // Show/hide elements based on language
        document.querySelectorAll('[data-lang-show]').forEach(el => {
            const elementLang = el.getAttribute('data-lang-show');
            if (elementLang === lang) {
                el.classList.remove('lang-hidden');
                // Use inline-block for inline elements, block for others
                const display = window.getComputedStyle(el.parentElement).display === 'inline' ? 'inline-block' : '';
                el.style.display = display;
            } else {
                el.classList.add('lang-hidden');
                el.style.display = 'none';
            }
        });
        
        // Update flag button
        const btnFlag = document.getElementById('langBtnFlag');
        if (btnFlag) {
            btnFlag.textContent = lang === 'ms' ? '🇬🇧' : '🇲🇾';
        }
    }

    // Initialize language on page load
    document.addEventListener('DOMContentLoaded', function() {
        applyLang(currentLang);
        
        // Language toggle button
        const btn = document.getElementById('langToggleBtn');
        if (btn) {
            btn.addEventListener('click', function () {
                const newLang = currentLang === 'ms' ? 'en' : 'ms';
                applyLang(newLang);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });


    /* ── DROPDOWN NAVIGATION (MOBILE) ─────────────── */
    document.addEventListener('DOMContentLoaded', function() {
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        
        dropdowns.forEach(dropdown => {
            const btn = dropdown.querySelector('.nav-dropdown-btn');
            
            if (btn) {
                btn.addEventListener('click', function(e) {
                    // On mobile, toggle dropdown menu
                    if (window.innerWidth <= 767) {
                        e.preventDefault();
                        dropdown.classList.toggle('open');
                    }
                });
            }
        });
    });


    /* ── HAMBURGER MENU ───────────────────────────── */
    document.addEventListener('DOMContentLoaded', function() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const navLinks = document.getElementById('navLinks');
        const siteHeader = document.getElementById('site-header');

        if (!hamburgerBtn || !navLinks || !siteHeader) return;

        function setHeaderHeight() {
            const h = siteHeader.offsetHeight;
            document.documentElement.style.setProperty('--header-h', h + 'px');
        }
        setHeaderHeight();
        window.addEventListener('resize', setHeaderHeight);

        hamburgerBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = navLinks.classList.contains('open');
            navLinks.classList.toggle('open');
            hamburgerBtn.classList.toggle('open');
            hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburgerBtn.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                
                // Close all dropdowns
                document.querySelectorAll('.nav-dropdown').forEach(dd => {
                    dd.classList.remove('open');
                });
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!siteHeader.contains(e.target)) {
                navLinks.classList.remove('open');
                hamburgerBtn.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                
                // Close all dropdowns
                document.querySelectorAll('.nav-dropdown').forEach(dd => {
                    dd.classList.remove('open');
                });
            }
        });
    });


    /* ── ACTIVE NAV LINK ON SCROLL ────────────────── */
    window.addEventListener('load', function() {
        const sections = document.querySelectorAll('section[id]');
        const navAnchors = document.querySelectorAll('.nav-links a');

        function updateActiveNav() {
            let current = '';
            sections.forEach(sec => {
                const top = sec.offsetTop - 100;
                if (window.scrollY >= top) {
                    current = sec.getAttribute('id');
                }
            });
            navAnchors.forEach(a => {
                a.classList.remove('nav-active');
                if (a.getAttribute('href') === '#' + current) {
                    a.classList.add('nav-active');
                }
            });
        }
        window.addEventListener('scroll', updateActiveNav, { passive: true });
        updateActiveNav(); // Initial call
    });


    /* ── SCROLL REVEAL ────────────────────────────── */
    window.addEventListener('load', function() {
        const revealEls = document.querySelectorAll('.reveal');
        
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
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
        } else {
            // Fallback for browsers without IntersectionObserver
            revealEls.forEach(el => el.classList.add('visible'));
        }
    });


    /* ── HERO TEXT ENTRANCE ───────────────────────── */
    window.addEventListener('load', function() {
        setTimeout(() => {
            const heroText = document.querySelector('.hero-text');
            if (heroText) {
                const introWords = heroText.querySelectorAll('.hero-intro-word');
                const logoEl = heroText.querySelector('.hero-logo-big, .hero-logo-fallback');
                const tagline = heroText.querySelector('.hero-tagline');
                const subtitles = heroText.querySelectorAll('.hero-subtitle');
                const actions = heroText.querySelector('.hero-actions');
                
                const items = [...introWords, logoEl, tagline, ...subtitles, actions].filter(Boolean);

                items.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(32px)';
                    el.style.transition = 'opacity .55s ease, transform .55s ease';
                });

                setTimeout(() => {
                    items.forEach((el, i) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, i * 130);
                    });
                }, 200);
            }
        }, 100);
    });


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

    window.addEventListener('load', function() {
        const statBlocks = document.querySelectorAll('.stat-block');
        
        if ('IntersectionObserver' in window) {
            const statObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const valEl = entry.target.querySelector('.stat-val');
                        if (!valEl || valEl.dataset.animated) return;
                        valEl.dataset.animated = '1';
                        const raw = valEl.textContent.trim();
                        const prefix = raw.startsWith('+') ? '+' : '';
                        const suffix = raw.includes('%') ? '%' : '';
                        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
                        valEl.textContent = prefix + '0' + suffix;
                        animateCount(valEl, num, suffix, 1400);
                        if (prefix) valEl.textContent = prefix + valEl.textContent;
                        statObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            statBlocks.forEach(el => statObserver.observe(el));
        }
    });


    /* ── NAVBAR SCROLL SHADOW ─────────────────────── */
    window.addEventListener('load', function() {
        const siteHeader = document.getElementById('site-header');
        if (siteHeader) {
            window.addEventListener('scroll', () => {
                siteHeader.style.boxShadow = window.scrollY > 10
                    ? '0 4px 20px rgba(0,0,0,0.15)'
                    : '0 2px 8px rgba(0, 0, 0, 0.08)';
            }, { passive: true });
        }
    });


    /* ── CARD TILT EFFECT (desktop only) ─────────── */
    function addTilt(selector) {
        if (window.matchMedia('(hover: hover)').matches) {
            document.querySelectorAll(selector).forEach(card => {
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
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

    window.addEventListener('load', function() {
        addTilt('.audience-card');
        addTilt('.komponen-card');
        addTilt('.team-card');
        addTilt('.dl-card');
    });


    /* ── SMOOTH ANCHOR SCROLLING ──────────────────── */
    document.addEventListener('DOMContentLoaded', function() {
        const siteHeader = document.getElementById('site-header');
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                const offset = siteHeader ? siteHeader.offsetHeight + 8 : 0;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            });
        });
    });


    /* ── MOCKUP PLAY BUTTON PULSE ─────────────────── */
    window.addEventListener('load', function() {
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
    });


    /* ── ACTIVE NAV STYLE VIA CSS ────────────────── */
    const style = document.createElement('style');
    style.textContent = `.nav-links a.nav-active { color: var(--navy) !important; font-weight: 800; }`;
    document.head.appendChild(style);

})();
