'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.small-screen-nav');
    const overlay = document.querySelector('.overlay');
    
    if (!menuToggle || !nav || !overlay) {
        console.warn('Navigation elements not found');
        return;
    }

    function toggleDropdownMenu() {
        checkHeaderFit();
        const isOpen = nav.classList.contains('show');
        const newState = !isOpen;
        
        nav.classList.toggle('show', newState);
        overlay.classList.toggle('show', newState);
        menuToggle.setAttribute('aria-expanded', newState.toString());
    }

    function closeDropdownMenu() {
        nav.classList.remove('show');
        overlay.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleDropdownMenu();
    });
    
    overlay.addEventListener('click', closeDropdownMenu);
    
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
            closeDropdownMenu();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeDropdownMenu();
        }
    });

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
            
            closeDropdownMenu();
        });
    });

    function checkHeaderFit() {
        if (window.innerWidth > 768) return;

        const headerStyles = document.querySelector('.header-styles');
        const smallScreenHeader = document.querySelector('.small-screen-header');
        if (!headerStyles || !smallScreenHeader || !menuToggle) return;

        const wasStacked = headerStyles.classList.contains('stacked');
        headerStyles.classList.remove('stacked');
        smallScreenHeader.classList.remove('stacked-header');

        const logo = headerStyles.querySelector('img');
        const title = headerStyles.querySelector('.website-title');
        if (!logo || !title) return;

        const logoRect = logo.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();

        const gap = titleRect.left - (logoRect.right);
        const minTitleWidth = parseFloat(getComputedStyle(title).minWidth) || 56;

        if (title.offsetWidth <= minTitleWidth + 1 || gap < 8) {
            headerStyles.classList.add('stacked');
            smallScreenHeader.classList.add('stacked-header');
        } else if (wasStacked) {
            headerStyles.classList.remove('stacked');
            smallScreenHeader.classList.remove('stacked-header');
        }
    }

    function runHeaderFitAfterLogo() {
        const logo = document.querySelector('.header-styles img');
        if (logo && !logo.complete) {
            logo.addEventListener('load', checkHeaderFit, { once: true });
        } else {
            checkHeaderFit();
        }
    }

    runHeaderFitAfterLogo();

    if (document.fonts) {
        document.fonts.ready.then(runHeaderFitAfterLogo);
    }

    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeDropdownMenu();
        }
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkHeaderFit, 100);
    });

    // Large screen sidebar toggle functionality
    const sidebar = document.querySelector('.large-screen-sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    if (sidebar && sidebarToggle) {
        // Sidebar is open by default (no collapsed class)
        
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Update button icon
            if (sidebar.classList.contains('collapsed')) {
                sidebarToggle.textContent = '☰';
                sidebarToggle.setAttribute('aria-label', 'Open sidebar');
            } else {
                sidebarToggle.textContent = '✕';
                sidebarToggle.setAttribute('aria-label', 'Close sidebar');
            }
        });
        
        // Set initial button state (sidebar is open)
        sidebarToggle.textContent = '✕';
        sidebarToggle.setAttribute('aria-label', 'Close sidebar');
    }
});