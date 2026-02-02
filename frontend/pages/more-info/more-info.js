// InfoSlider functionality
let currentIndex = 0;
let infoslider, prevBtn, nextBtn, indicators, totalSlides;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    infoslider = document.getElementById('infoslider');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    indicators = document.querySelectorAll('.info-indicator');
    totalSlides = document.querySelectorAll('.info-section').length;
    
    InitializeInfoSlider();
});

function UpdateInfoSlider() {
    // Move the slider
    infoslider.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;
}

function GoToSlide(index) {
    currentIndex = index;
    UpdateInfoSlider();
}

function NextSlide() {
    if (currentIndex < totalSlides - 1) {
        currentIndex++;
        UpdateInfoSlider();
    }
}

function PrevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
        UpdateInfoSlider();
    }
}

// Event listeners
function InitializeInfoSlider() {
    nextBtn.addEventListener('click', NextSlide);
    prevBtn.addEventListener('click', PrevSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => GoToSlide(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') PrevSlide();
        else if (e.key === 'ArrowRight') NextSlide();
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    infoslider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    infoslider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        HandleSwipe();
    });

    function HandleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) NextSlide();
            else PrevSlide();
        }
    }

    UpdateInfoSlider();
}