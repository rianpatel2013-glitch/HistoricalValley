'use strict';

document.addEventListener('DOMContentLoaded', function() {
    
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.overlay');
    
    if (!menuToggle || !nav || !overlay) {
        console.warn('Navigation elements not found');
        return;
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        const isOpen = nav.classList.contains('show');
        const newState = !isOpen;
        
        nav.classList.toggle('show', newState);
        overlay.classList.toggle('show', newState);
        menuToggle.setAttribute('aria-expanded', newState.toString());
    }
    
    // Close the mobile menu
    function closeMobileMenu() {
        nav.classList.remove('show');
        overlay.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMobileMenu();
    });
    
    overlay.addEventListener('click', closeMobileMenu);
    
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            closeMobileMenu();
        });
    });
    
    // Responsive header logic
    function checkHeaderFit() {

        if (window.innerWidth > 768) return;
        
        const headerBrand = document.querySelector('.header-brand');
        const mobileHeader = document.querySelector('.mobile-header');
        
        if (!headerBrand || !mobileHeader || !menuToggle) return;

        const wasStacked = headerBrand.classList.contains('stacked');
        headerBrand.classList.remove('stacked');
        mobileHeader.classList.remove('stacked-header');

        const headerWidth = mobileHeader.offsetWidth;
        const menuWidth = menuToggle.offsetWidth;
        const headerPadding = 32;
        const menuMargin = 24;
        const availableWidth = headerWidth - menuWidth - headerPadding - menuMargin;

        const logo = headerBrand.querySelector('img');
        const title = headerBrand.querySelector('.site-title');
        
        if (!logo || !title) return;
    
        const gapWidth = 16;
        const buffer = 20;
        const neededWidth = logo.offsetWidth + title.offsetWidth + gapWidth + buffer;
        
        // Stack if the elements don't fit
        if (neededWidth > availableWidth) {
            headerBrand.classList.add('stacked');
            mobileHeader.classList.add('stacked-header');
        } else if (wasStacked) {
            headerBrand.classList.remove('stacked');
            mobileHeader.classList.remove('stacked-header');
        }
    }

    checkHeaderFit();

    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }

        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkHeaderFit, 100);
    });

    if (document.fonts) {
        document.fonts.ready.then(checkHeaderFit);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    
    function checkHeaderFit() {
        if (window.innerWidth > 768) return;
        
        const headerBrand = document.querySelector('.header-brand');
        const mobileHeader = document.querySelector('.mobile-header');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (!headerBrand || !mobileHeader || !menuToggle) return;
        
        const wasStacked = headerBrand.classList.contains('stacked');
        headerBrand.classList.remove('stacked');
        mobileHeader.classList.remove('stacked-header');
        
        const headerWidth = mobileHeader.offsetWidth;
        const menuWidth = menuToggle.offsetWidth;
        const headerPadding = 32;
        const menuMargin = 24;
        const availableWidth = headerWidth - menuWidth - headerPadding - menuMargin;
        
        const logo = headerBrand.querySelector('img');
        const title = headerBrand.querySelector('.site-title');
        
        if (!logo || !title) return;
        
        const gapWidth = 16;
        const buffer = 20;
        const neededWidth = logo.offsetWidth + title.offsetWidth + gapWidth + buffer;

        // Stack if the elements don't fit
        if (neededWidth > availableWidth) {
            headerBrand.classList.add('stacked');
            mobileHeader.classList.add('stacked-header');
        } else if (wasStacked) {
            headerBrand.classList.remove('stacked');
            mobileHeader.classList.remove('stacked-header');
        }
    }
    
    checkHeaderFit();
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkHeaderFit, 100);
    });

    if (document.fonts) {
        document.fonts.ready.then(checkHeaderFit);
    }
});