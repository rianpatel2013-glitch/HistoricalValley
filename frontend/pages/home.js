// Image Slider functionality
let currentImgIndex = 0;
let imageSlider, prevImgBtn, nextImgBtn, sliderIndicators, totalImages;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    imageSlider = document.getElementById('imageSlider');
    prevImgBtn = document.getElementById('prevImgBtn');
    nextImgBtn = document.getElementById('nextImgBtn');
    sliderIndicators = document.querySelectorAll('.slider-indicator');
    totalImages = document.querySelectorAll('.image-slider img').length;
    
    InitializeImageSlider();
});

function UpdateImageSlider() {
    // Move the slider
    imageSlider.style.transform = `translateX(-${currentImgIndex * 100}%)`;
    
    // Update indicators
    sliderIndicators.forEach((indicator, index) => {
        if (index === currentImgIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Update button states
    prevImgBtn.disabled = currentImgIndex === 0;
    nextImgBtn.disabled = currentImgIndex === totalImages - 1;
}

function GoToImage(index) {
    currentImgIndex = index;
    UpdateImageSlider();
}

function NextImage() {
    if (currentImgIndex < totalImages - 1) {
        currentImgIndex++;
        UpdateImageSlider();
    }
}

function PrevImage() {
    if (currentImgIndex > 0) {
        currentImgIndex--;
        UpdateImageSlider();
    }
}

// Event listeners
function InitializeImageSlider() {
    nextImgBtn.addEventListener('click', NextImage);
    prevImgBtn.addEventListener('click', PrevImage);

    sliderIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => GoToImage(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') PrevImage();
        else if (e.key === 'ArrowRight') NextImage();
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    imageSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    imageSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        HandleSwipe();
    });

    function HandleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) NextImage();
            else PrevImage();
        }
    }

    UpdateImageSlider();
}