// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with data-scroll attribute
const scrollElements = document.querySelectorAll('[data-scroll]');
scrollElements.forEach(el => observer.observe(el));

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

if (lightboxTriggers.length > 0) {
    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = trigger.src || trigger.querySelector('img')?.src;
            const imgAlt = trigger.alt || trigger.querySelector('img')?.alt || '';
            
            if (imgSrc) {
                lightboxImg.src = imgSrc;
                lightboxImg.alt = imgAlt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add active class to current nav item
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    // Normalize paths for comparison
    const normalizedCurrent = currentPath.endsWith('/') ? currentPath : currentPath + '/';
    const normalizedLink = linkPath.endsWith('/') ? linkPath : linkPath + '/';
    
    // Check if paths match or if we're on index and link is to index
    if (normalizedCurrent === normalizedLink || 
        (normalizedCurrent.endsWith('index.html') && normalizedLink.endsWith('/')) ||
        (normalizedCurrent.endsWith('/') && linkPath.endsWith('index.html'))) {
        link.classList.add('active');
    }
});
