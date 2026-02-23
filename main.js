/* =============================================
   ULTANGBER — Main JS (Subtle Animations)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Mobile Navigation Toggle ── */
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    /* ── Smooth Scrolling ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });

    /* ── Scroll Reveal (generic sections) ── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ── Staggered Team Cards Entrance ── */
    const teamGridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.team-card');
                cards.forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.55s ease, transform 0.55s cubic-bezier(.22,.68,0,1.2)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 120);
                });
                teamGridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const teamGrid = document.querySelector('.team-grid');
    if (teamGrid) teamGridObserver.observe(teamGrid);

    /* ── Advisor Banner Entrance ── */
    const advisorBanner = document.querySelector('.advisor-banner');
    if (advisorBanner) {
        const advisorObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    advisorBanner.style.opacity = '0';
                    advisorBanner.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        advisorBanner.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        advisorBanner.style.opacity = '1';
                        advisorBanner.style.transform = 'translateY(0)';
                    }, 100);
                    advisorObserver.unobserve(advisorBanner);
                }
            });
        }, { threshold: 0.3 });
        advisorObserver.observe(advisorBanner);
    }

    /* ── Stat Counter Animation ── */
    const statValues = document.querySelectorAll('.stat-value');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const raw = el.textContent.trim();
                const numMatch = raw.match(/[\d.]+/);
                if (!numMatch) return;

                const target  = parseFloat(numMatch[0]);
                const prefix  = raw.includes('+') ? '+' : '';
                const suffix  = raw.includes('%') ? '%' : '';
                const isFloat = raw.includes('.');

                let current   = 0;
                const step    = target / 50;
                const timer   = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
                }, 30);

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => counterObserver.observe(el));

    /* ── Galeri Items Stagger ── */
    const galeriObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.galeri-item');
                items.forEach((item, i) => {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, i * 100);
                });
                galeriObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const galeriGrid = document.querySelector('.galeri-grid');
    if (galeriGrid) galeriObserver.observe(galeriGrid);

    /* ── Sticky header shadow on scroll ── */
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 10
                ? '0 4px 20px rgba(0,0,0,0.12)'
                : '0 4px 6px rgba(0,0,0,0.1)';
        }, { passive: true });
    }

    /* ── Komponen / Petak / Step card reveals ── */
    const cardRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll(
                    '.komponen-card, .step-card, .petak-card, .stat-card, .testimonial-card'
                );
                cards.forEach((card, i) => {
                    card.style.opacity   = '0';
                    card.style.transform = 'translateY(24px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        card.style.opacity    = '1';
                        card.style.transform  = 'translateY(0)';
                    }, i * 90);
                });
                cardRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(
        '.komponen-grid, .steps, .petak-grid, .stats-container, .testimonials'
    ).forEach(el => cardRevealObserver.observe(el));

});
