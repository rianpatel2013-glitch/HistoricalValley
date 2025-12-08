'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const smallScreenNav = document.querySelector('.drop_down-nav');
const overlay = document.querySelector('.overlay');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const body = document.body;
const headerStyles = document.querySelector('.header-styles');
const websiteTitle = document.querySelector('.website-title');
const smallScreenHeader = document.querySelector('.drop_down-header');

// Toggle Mobile Menu
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        const isOpen = smallScreenNav.classList.toggle('show');
        overlay.classList.toggle('show', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
        body.style.overflow = isOpen ? 'hidden' : '';
    });
}

// Close mobile menu when user clicks outside of it
if (overlay) {
    overlay.addEventListener('click', function() {
        smallScreenNav.classList.remove('show');
        overlay.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
    });
}

// Stack Title
function check_title_stacking() {
    if (!headerStyles || !websiteTitle || !smallScreenHeader) return;
   
    if (window.innerWidth > 768) {
        headerStyles.classList.remove('stacked');
        smallScreenHeader.classList.remove('stacked-header');
        return;
    }

    const computedStyle = window.getComputedStyle(websiteTitle);
    const fontSize = parseFloat(computedStyle.fontSize);
    const rootFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    const minFontSize = 1.5 * rootFontSize;
    const tolerance = 0.5;

    if (fontSize <= minFontSize + tolerance) {
        headerStyles.classList.add('stacked');
        smallScreenHeader.classList.add('stacked-header');
    } else {
        headerStyles.classList.remove('stacked');
        smallScreenHeader.classList.remove('stacked-header');
    }
}
check_title_stacking();

let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(check_title_stacking, 100);
});

if (document.fonts) {
    document.fonts.ready.then(check_title_stacking);
}

// Open and Close sidebar
if (sidebarToggle && sidebar) {
    sidebarToggle.textContent = '✕';
    
    sidebarToggle.setAttribute('aria-label', 'Close sidebar');
   
    sidebarToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        sidebar.classList.toggle('collapsed');
       
        if (sidebar.classList.contains('collapsed')) {
            sidebarToggle.textContent = '☰';
            sidebarToggle.setAttribute('aria-label', 'Open sidebar');
        } else {
            sidebarToggle.textContent = '✕';
            sidebarToggle.setAttribute('aria-label', 'Close sidebar');
        }
    });
}