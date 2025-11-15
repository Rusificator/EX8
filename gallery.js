// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    const gallerySlider = document.querySelector('.gallery-slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const currentPage = document.querySelector('.current-page');
    const totalPages = document.querySelector('.total-pages');
    const pagerDots = document.querySelector('.pager-dots');
    
    let currentPageIndex = 0;
    const slidesCount = slides.length;
    
    // Calculate slides per view based on screen width
    function getSlidesPerView() {
        if (window.innerWidth <= 768) {
            return 1;
        } else if (window.innerWidth <= 1024) {
            return 2;
        } else {
            return 3;
        }
    }
    
    // Calculate total pages
    function calculateTotalPages() {
        const slidesPerView = getSlidesPerView();
        return Math.ceil(slidesCount / slidesPerView);
    }
    
    // Calculate current slide position based on current page
    function getCurrentSlide() {
        const slidesPerView = getSlidesPerView();
        return currentPageIndex * slidesPerView;
    }
    
    // Create dots for desktop pager
    function createDots() {
        const totalPagesCount = calculateTotalPages();
        pagerDots.innerHTML = '';
        
        for (let i = 0; i < totalPagesCount; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.setAttribute('data-page', i);
            dot.addEventListener('click', function() {
                const page = parseInt(this.getAttribute('data-page'));
                goToPage(page);
            });
            pagerDots.appendChild(dot);
        }
    }
    
    // Go to specific page
    function goToPage(page) {
        const totalPagesCount = calculateTotalPages();
        
        if (page < 0) {
            currentPageIndex = totalPagesCount - 1; // Go to last page
        } else if (page >= totalPagesCount) {
            currentPageIndex = 0; // Go to first page
        } else {
            currentPageIndex = page;
        }
        
        showSlide();
    }
    
    // Update pager and button states
    function updatePager() {
        const totalPagesCount = calculateTotalPages();
        
        // Update numeric pager
        currentPage.textContent = currentPageIndex + 1;
        totalPages.textContent = totalPagesCount;
        
        // Update dots pager
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentPageIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // For cyclic navigation, we don't disable buttons
        // But we can add visual feedback if needed
        prevBtn.classList.toggle('cyclic-prev', currentPageIndex === 0);
        nextBtn.classList.toggle('cyclic-next', currentPageIndex === totalPagesCount - 1);
    }
    
    // Show current slide
    function showSlide() {
        const slidesPerView = getSlidesPerView();
        const currentSlide = getCurrentSlide();
        const slideWidth = 100 / slidesPerView;
        const translateX = -currentSlide * slideWidth;
        
        gallerySlider.style.transform = `translateX(${translateX}%)`;
        updatePager();
    }
    
    // Next page with cyclic behavior
    function nextPage() {
        const totalPagesCount = calculateTotalPages();
        goToPage(currentPageIndex + 1);
    }
    
    // Previous page with cyclic behavior
    function prevPage() {
        const totalPagesCount = calculateTotalPages();
        goToPage(currentPageIndex - 1);
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevPage);
    nextBtn.addEventListener('click', nextPage);
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Recreate dots if needed
            createDots();
            
            // Adjust current page if it's out of bounds after resize
            const totalPagesCount = calculateTotalPages();
            if (currentPageIndex >= totalPagesCount) {
                currentPageIndex = totalPagesCount - 1;
            }
            
            showSlide();
        }, 250);
    });
    
    // Initialize
    createDots();
    updatePager();
    showSlide();
});