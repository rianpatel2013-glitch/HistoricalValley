document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const smallScreenNav = document.querySelector('.small-screen-nav');
    const overlay = document.querySelector('.overlay');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.large-screen-sidebar');
    const body = document.body;
    const headerStyles = document.querySelector('.header-styles');
    const websiteTitle = document.querySelector('.website-title');
    const smallScreenHeader = document.querySelector('.small-screen-header');

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
    function checkTitleStacking() {
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

    checkTitleStacking();
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkTitleStacking, 100);
    });

    if (document.fonts) {
        document.fonts.ready.then(checkTitleStacking);
    }
});