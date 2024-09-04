document.addEventListener('DOMContentLoaded', function() {
    // Get the preloader elements
const loader = document.querySelector('.loader');
const containerl = document.querySelector('.containerl');

// Create a new div for the black background
const background = document.createElement('div');
document.body.appendChild(background);

// Style the background
background.style.position = 'fixed';
background.style.top = '0';
background.style.left = '0';
background.style.width = '100%';
background.style.height = '100%';
background.style.backgroundColor = '#131313';
background.style.zIndex = '9998';

// Style the loader
loader.style.position = 'fixed';
loader.style.top = '50%';
loader.style.left = '50%';
loader.style.transform = 'translate(-50%, -50%)';
loader.style.zIndex = '9999';

// Function to hide the preloader with fade effect
function hidePreloader() {
  containerl.style.opacity = '0';
  background.style.transition = 'opacity 1s ease-out';
  background.style.opacity = '0';
  
  setTimeout(() => {
    loader.style.display = 'none';
    background.style.display = 'none';
  }, 1000);
}

// Set a minimum display time for the preloader
const minDisplayTime = 2000; // 2 seconds

// Get the start time
const startTime = Date.now();

// Add an event listener to the window's 'load' event
window.addEventListener('load', () => {
  // Calculate how long it's been since the page started loading
  const elapsedTime = Date.now() - startTime;
  
  if (elapsedTime < minDisplayTime) {
    // If less than minDisplayTime has passed, wait for the remaining time
    setTimeout(hidePreloader, minDisplayTime - elapsedTime);
  } else {
    // If more than minDisplayTime has passed, hide the preloader immediately
    hidePreloader();
  }
});

// Prevent scrolling while the preloader is active
document.body.style.overflow = 'hidden';

// Re-enable scrolling when the preloader is hidden
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.style.overflow = '';
  }, Math.max(minDisplayTime, 2000)); // Wait for at least 2 seconds or minDisplayTime
});
    // Navigation menu functionality
    initNavigation();

    // FAQ accordion functionality
    initFAQAccordion();

    // Carousel functionality
    initCarousel();

    // Services toggle functionality
    initServicesToggle();
});

function initNavigation() {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.classList.add('nav-backdrop');
    body.appendChild(backdrop);

    function toggleMenu() {
        menuIcon.classList.toggle('active');
        navLinks.classList.toggle('active');
        backdrop.classList.toggle('active');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
        
        // Toggle the icon between hamburger and close
        const icon = menuIcon.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }

    menuIcon.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);

    // Close menu when clicking on a nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Close menu when resizing to a larger screen
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Subnav functionality
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                toggleSubnav(this);
            }
        });
    });
}

function toggleArrowIcon(item) {
    const arrow = item.querySelector('i.fa-solid.fa-angle-down, i.fa-solid.fa-angle-up');
    if (arrow) {
        arrow.classList.toggle('fa-angle-down');
        arrow.classList.toggle('fa-angle-up');
    }
}
function updateArrowIcons() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const arrow = item.querySelector('i.fa-solid.fa-angle-down, i.fa-solid.fa-angle-up');
        if (arrow) {
            if (item.classList.contains('active')) {
                arrow.classList.remove('fa-angle-down');
                arrow.classList.add('fa-angle-up');
            } else {
                arrow.classList.remove('fa-angle-up');
                arrow.classList.add('fa-angle-down');
            }
        }
    });
}

function toggleSubnav(item) {
    const subnav = item.querySelector('.subnav');
    const span = item.querySelector('span');

    if (item.classList.contains('active')) {
        closeSubnav(item, subnav, span);
    } else {
        // Close all other subnavs
        document.querySelectorAll('.nav-item.active').forEach(activeItem => {
            if (activeItem !== item) {
                closeSubnav(activeItem, activeItem.querySelector('.subnav'), activeItem.querySelector('span'));
            }
        });

        openSubnav(item, subnav, span);
    }
    updateArrowIcons();
}

function closeSubnav(item, subnav, span) {
    subnav.style.maxHeight = subnav.scrollHeight + "px";
    subnav.style.overflow = "hidden";
    setTimeout(() => {
        subnav.style.maxHeight = "0px";
    }, 10);
    item.classList.remove('active');
    span.style.color = "#fff";
}

function openSubnav(item, subnav, span) {
    subnav.style.maxHeight = "0px";
    subnav.style.display = 'block';
    setTimeout(() => {
        subnav.style.maxHeight = subnav.scrollHeight + "px";
    }, 10);
    item.classList.add('active');
    span.style.color = "#007bff";
}

function initFAQAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    const viewAllBtn = document.getElementById('view-all-btn');
    const extraFaqs = document.getElementById('extra-faqs');
    let activeTimer;

    function closeAccordionItem(item) {
        item.classList.remove('active');
        item.querySelector('.accordion-content').style.maxHeight = null;
        item.querySelector('.timer-bar').style.animation = 'none';
    }

    function openAccordionItem(item) {
        // Close any open item first
        const openItem = document.querySelector('.accordion-item.active');
        if (openItem) closeAccordionItem(openItem);

        // Open the clicked item
        item.classList.add('active');
        const content = item.querySelector('.accordion-content');
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Start the timer animation
        const timerBar = item.querySelector('.timer-bar');
        timerBar.style.animation = 'none'; // Reset the animation
        timerBar.offsetHeight; // Trigger reflow
        timerBar.style.animation = 'timer 30s linear';

        // Set up auto-close
        clearTimeout(activeTimer);
        activeTimer = setTimeout(() => closeAccordionItem(item), 30000);
    }

    accordionItems.forEach((item) => {
        item.querySelector('.accordion-header').addEventListener('click', () => {
            if (item.classList.contains('active')) {
                closeAccordionItem(item);
                clearTimeout(activeTimer);
            } else {
                openAccordionItem(item);
            }
        });
    });

    viewAllBtn.addEventListener('click', function() {
        extraFaqs.style.display = extraFaqs.style.display === 'none' ? 'block' : 'none';
        viewAllBtn.innerHTML = extraFaqs.style.display === 'none' ? 
            'View All <i class="fa-solid fa-chevron-down"></i>' : 
            'View Less <i class="fa-solid fa-chevron-up"></i>';
    });
}
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    const intervalTime = 10000; // Time between automatic slides (10 seconds)
    let touchStartX = 0;
    let touchEndX = 0;
    let intervalId;

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startAutoSlide() {
        intervalId = setInterval(nextSlide, intervalTime);
    }

    function stopAutoSlide() {
        clearInterval(intervalId);
    }

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }

    function handleTouchMove(e) {
        touchEndX = e.touches[0].clientX;
    }

    function handleTouchEnd() {
        const touchDiff = touchStartX - touchEndX;
        if (touchDiff > 50) {
            nextSlide();
        } else if (touchDiff < -50) {
            prevSlide();
        }
        // Restart auto-sliding
        stopAutoSlide();
        startAutoSlide();
    }

    // Set up automatic sliding
    startAutoSlide();

    // Set up manual sliding with indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Touch events for swipe functionality
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('touchstart', handleTouchStart, {passive: true});
    carouselContainer.addEventListener('touchmove', handleTouchMove, {passive: true});
    carouselContainer.addEventListener('touchend', handleTouchEnd);
}

function initServicesToggle() {
    const pilotPriceBtn = document.getElementById('pilotPriceBtn');
    const productsBtn = document.getElementById('productsBtn');
    const pilotPriceList = document.getElementById('pilotPriceList');
    const productsList = document.getElementById('productsList');
    const toggleButtonContainer = document.querySelector('.toggle-button');

    function toggleContent(event) {
        if (event.target.classList.contains('active')) return;

        const isProductsActive = event.target.id === 'productsBtn';
        
        // Update button states
        toggleButtonContainer.classList.toggle('products-active', isProductsActive);
        toggleButtonContainer.classList.toggle('pilot-active', !isProductsActive);
        productsBtn.classList.toggle('active', isProductsActive);
        pilotPriceBtn.classList.toggle('active', !isProductsActive);

        // Update content visibility
        pilotPriceList.classList.toggle('active', !isProductsActive);
        productsList.classList.toggle('active', isProductsActive);

        // Trigger reflow and fade transition
        void pilotPriceList.offsetWidth;
        void productsList.offsetWidth;

        pilotPriceList.style.opacity = isProductsActive ? '0' : '1';
        productsList.style.opacity = isProductsActive ? '1' : '0';
    }

    pilotPriceBtn.addEventListener('click', toggleContent);
    productsBtn.addEventListener('click', toggleContent);

    // Initial setup
    pilotPriceList.classList.add('active');
    pilotPriceList.style.opacity = '1';
    productsList.style.opacity = '0';
}



