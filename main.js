/* ========================================
   ULTANGBER WEBSITE - MAIN JAVASCRIPT
   Fixed: Language toggle & navbar issues
======================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== LANGUAGE TOGGLE - FIXED =====
    const langBtn = document.getElementById('langToggleBtn');
    const langFlag = document.getElementById('langBtnFlag');
    let currentLang = localStorage.getItem('ultangber-lang') || 'ms';
    
    // Set initial language
    document.body.classList.add(`lang-${currentLang}`);
    updateLangButton(currentLang);
    
    // Language toggle event
    if (langBtn) {
        langBtn.addEventListener('click', function() {
            // Toggle language
            currentLang = currentLang === 'ms' ? 'en' : 'ms';
            
            // Update body class
            document.body.classList.remove('lang-ms', 'lang-en');
            document.body.classList.add(`lang-${currentLang}`);
            
            // Update button display
            updateLangButton(currentLang);
            
            // Save preference
            localStorage.setItem('ultangber-lang', currentLang);
            
            // Update page title
            updatePageTitle(currentLang);
        });
    }
    
    function updateLangButton(lang) {
        if (!langFlag) return;
        
        if (lang === 'ms') {
            langFlag.textContent = '🇬🇧'; // Show English flag when in Malay (click to switch to English)
        } else {
            langFlag.textContent = '🇲🇾'; // Show Malaysia flag when in English (click to switch to Malay)
        }
    }
    
    function updatePageTitle(lang) {
        const title = document.querySelector('title');
        if (title) {
            if (lang === 'ms') {
                title.textContent = 'ULTANGBER – Belajar Sambil Bermain';
            } else {
                title.textContent = 'ULTANGBER – Learn While You Play';
            }
        }
    }
    
    // ===== MOBILE HAMBURGER MENU - FIXED =====
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
    
    // ===== SMOOTH SCROLLING =====
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.getElementById('site-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('site-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
        } else {
            header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
    
    // ===== ACTIVE NAV LINK HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active from all links
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active to current section link
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // ===== PERFORMANCE: Debounce scroll events =====
    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    window.addEventListener('scroll', debounce(highlightNavLink));
    
    // ===== PREVENT FLASH OF UNSTYLED CONTENT =====
    document.body.style.visibility = 'visible';
    
    // ===== IMAGE LAZY LOADING FALLBACK =====
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
        console.log('Browser supports lazy loading');
    } else {
        // Fallback for browsers that don't support lazy loading
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
    
    // ===== CONSOLE LOG =====
    console.log('%c🎮 ULTANGBER Website Loaded Successfully! 🎮', 'color: #58CC02; font-size: 16px; font-weight: bold;');
    console.log('%cLanguage: ' + currentLang.toUpperCase(), 'color: #1CB0F6; font-size: 14px;');
    console.log('%cDeveloped by SEMEKAP Innovation Team', 'color: #FF9600; font-size: 12px;');
});

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// ===== PREVENT RIGHT CLICK ON IMAGES (Optional) =====
// Uncomment if you want to protect images
/*
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});
*/

// ===== SERVICE WORKER (Optional - for PWA) =====
// Uncomment if you want to add PWA functionality
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
*/
