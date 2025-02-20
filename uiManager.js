class UIManager {
    constructor(cardGenerator, app) {
        this.cardGenerator = cardGenerator;
        this.app = app;
        this.DOM = {
            toggleBtn: document.querySelector('.toggle-btn'),
            sidebar: document.querySelector('.sidebar'),
            overlay: document.querySelector('.overlay'),
            toggleIcon: document.querySelector('.toggle-btn i'),
            pageTitle: document.querySelector('.page-title'),
            activeSubtab: document.querySelector('.active-subtab'),
            searchInput: document.getElementById('dynamic-search'),
            contentContainer: document.getElementById('content-container')
        };
        this.currentSheet = null;
        this.currentCategory = '';
        this.currentFilter = '';
        this.currentMainTab = '';
        this.setupMobileNavigation();
    }

    setupMobileNavigation() {
        // Verify all required elements exist first
        if (!this.DOM.toggleBtn || !this.DOM.sidebar || !this.DOM.overlay) {
            console.error('Required DOM elements for mobile navigation not found');
            return;
        }
    
        // Toggle button click handler
        this.DOM.toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileSidebar();
        });
    
        // Outside click handler
        document.addEventListener('click', (e) => {
            if (this.DOM.sidebar.classList.contains('active')) {
                // Check if click is outside sidebar and not on toggle button
                if (!this.DOM.sidebar.contains(e.target) && !this.DOM.toggleBtn.contains(e.target)) {
                    this.closeMobileSidebar();
                }
            }
        });
    
        // Escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.DOM.sidebar.classList.contains('active')) {
                this.closeMobileSidebar();
            }
        });
    }
    
    toggleMobileSidebar() {
        const isActive = this.DOM.sidebar.classList.contains('active');
        if (!isActive) {
            this.openMobileSidebar();
        } else {
            this.closeMobileSidebar();
        }
    }
    
    openMobileSidebar() {
        // Add classes in sequence
        requestAnimationFrame(() => {
            this.DOM.overlay.classList.add('active');
            this.DOM.sidebar.classList.add('active');
            this.DOM.toggleBtn.classList.add('active');
            this.DOM.toggleIcon.className = 'fa-solid fa-chevron-left';
            document.body.style.overflow = 'hidden';
        });
    }
    
    closeMobileSidebar() {
        // Remove classes in sequence
        requestAnimationFrame(() => {
            this.DOM.overlay.classList.remove('active');
            this.DOM.sidebar.classList.remove('active');
            this.DOM.toggleBtn.classList.remove('active');
            this.DOM.toggleIcon.className = 'fa-solid fa-chevron-right';
            document.body.style.overflow = '';
            this.closeAllDropdowns();
        });
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-content.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    
        document.querySelectorAll('.nav-link[data-dropdown]').forEach(link => {
            link.classList.remove('active');
            
            const arrow = link.querySelector('.dropdown-arrow i');// Reset arrow rotation
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
            
            const img = link.querySelector('.nav-icon');// Reset image
            if (img && img.dataset.inactiveSrc) {
                img.src = img.dataset.inactiveSrc;
            }
        });
    }

    showError(message) {
        console.error('Showing error:', message); // Debug log
        this.DOM.contentContainer.innerHTML = `
            <div class="card error-card">
                <div class="card-header">
                    <div class="card-info">
                        <h2 class="card-title">Error</h2>
                        <p class="card-description">${message}</p>
                    </div>
                </div>
                <div class="card-content">
                    <button class="retry-btn" onclick="location.reload()">
                        Retry
                    </button>
                </div>
            </div>
        `;
    }
    
    setupFilterNavigation() {
        const filterToggle = document.querySelector('.filter-toggle-btn');
        const filterNav = document.querySelector('.filter-nav');
        
        if (filterToggle) {
            filterToggle.addEventListener('click', () => {
                filterToggle.classList.toggle('active');
                filterNav?.classList.toggle('active');
            });
        }
        this.setupFilterButtonListeners();
    }

    setupNavigationListeners() {
        this.activeTab = null;
        this.isTabTransitioning = false;
    
        // Set up dropdown tabs
        document.querySelectorAll('.nav-link[data-dropdown]').forEach(link => {
            // Extract text content safely by getting all text nodes
            const textContent = Array.from(link.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join(' ')
                .trim();

            const existingImage = link.querySelector('img');
            const isHome = existingImage && existingImage.src.includes('yushiro-logo');
            
            // Only modify the HTML if dropdown arrow doesn't exist
            if (!link.querySelector('.dropdown-arrow')) {
                const imgHtml = existingImage ? existingImage.outerHTML : '';
                link.innerHTML = `
                    ${imgHtml}
                    ${textContent}
                    <span class="dropdown-arrow">
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                `;
            }
    
            if (isHome && existingImage) {
                existingImage.removeAttribute('data-active-src');
                existingImage.removeAttribute('data-inactive-src');
            }

            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (this.isTabTransitioning) return;

                // Store the main tab title, getting it from the current state of the element
                this.currentMainTab = Array.from(link.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent.trim())
                    .join(' ')
                    .trim();
                
                const dropdownContent = document.getElementById(link.dataset.dropdown);
                if (!dropdownContent) return;
                
                this.isTabTransitioning = true;
                
                // Handle image swap
                const navIcon = link.querySelector('.nav-icon');
                if (navIcon) {
                    const activeSrc = navIcon.dataset.activeSrc;
                    const inactiveSrc = navIcon.dataset.inactiveSrc;
                    if (link.classList.contains('active')) {
                        navIcon.src = inactiveSrc;
                    } else {
                        navIcon.src = activeSrc;
                    }
                }

                // Close other dropdowns
                document.querySelectorAll('.nav-link[data-dropdown]').forEach(otherLink => {
                    if (otherLink !== link && otherLink.classList.contains('active')) {
                        const otherDropdown = document.getElementById(otherLink.dataset.dropdown);
                        if (otherDropdown) {
                            otherDropdown.classList.remove('active');
                        }
                        otherLink.classList.remove('active');
                        const otherArrow = otherLink.querySelector('.dropdown-arrow i');
                        if (otherArrow) {
                            otherArrow.style.transform = 'rotate(0deg)';
                        }
                        // Reset other nav icons
                        const otherIcon = otherLink.querySelector('.nav-icon');
                        if (otherIcon && otherIcon.dataset.inactiveSrc) {
                            otherIcon.src = otherIcon.dataset.inactiveSrc;
                        }
                    }
                });

                // Toggle current dropdown
                link.classList.toggle('active');
                dropdownContent.classList.toggle('active');

                const arrow = link.querySelector('.dropdown-arrow i');
                if (arrow) {
                    arrow.style.transform = link.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }

                this.activeTab = link.classList.contains('active') ? link : null;
                this.isTabTransitioning = false;
            });
        });

        // Set up content links (subtabs)
        document.querySelectorAll('.dropdown-content .nav-link[data-content]').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (this.isTabTransitioning) return;

                this.DOM.contentContainer.classList.add('loading');

                const dropdownElement = link.closest('.dropdown-content');
                const contentId = dropdownElement?.id;
                
                if (contentId) {
                    // Remove active class from other content links
                    document.querySelectorAll('.nav-link[data-content]').forEach(otherLink => {
                        if (otherLink !== link) {
                            otherLink.classList.remove('active');
                        }
                    });

                    // Add active class to current link
                    link.classList.add('active');

                    const category = this.getContentCategory(link);
                    this.currentSheet = contentId;
                    this.currentCategory = category;
                    this.currentFilter = ''; // Reset current filter when changing subtabs
                    
                    // Get the subtab title
                    const subtabTitle = Array.from(link.childNodes)
                        .filter(node => node.nodeType === Node.TEXT_NODE)
                        .map(node => node.textContent.trim())
                        .join(' ')
                        .trim();
                    
                    // Update main title and subtab display
                    if (this.currentMainTab) {
                        this.DOM.pageTitle.textContent = this.currentMainTab;
                        
                        if (subtabTitle) {
                            this.DOM.activeSubtab.textContent = ` - ${subtabTitle}`;
                            this.DOM.activeSubtab.style.display = 'inline';
                        } else {
                            this.DOM.activeSubtab.textContent = '';
                            this.DOM.activeSubtab.style.display = 'none';
                        }
                    }
                    
                    // Reset search and update filters
                    this.app.searchEngine.resetSearchAndFilters();
                    this.updateFilterButtons(contentId);
                    
                    // Load content
                    await this.app.loadSheetContent(contentId, category);
                }

                this.DOM.contentContainer.classList.remove('loading');
                
                if (window.innerWidth <= 768) {
                    this.closeMobileSidebar();
                }
            });
        });
    }

    animateContentTransition(callback) {
        return new Promise(resolve => {
            this.DOM.contentContainer.style.opacity = '0';
            setTimeout(() => {
                callback();
                this.DOM.contentContainer.style.opacity = '1';
                resolve();
            }, 200);
        });
    }

    getContentCategory(link) {
        const category = link.getAttribute('data-content');
        const isDashboardItem = link.closest('#dashboard') !== null;
        if (isDashboardItem) {
            return '';
        }
        if (category) {
            return category
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        return '';
    }

    updateFilterButtons(tabId) {
        const filterNav = document.querySelector('.filter-nav');
        if (!filterNav) return;
    
        // Use currentCategory (which contains the data-content value) instead of tabId
        const configKey = this.currentCategory.toLowerCase().replace(/\s+/g, '-');
        const config = CONFIG.FILTER_CONFIGS[configKey];
        
        // Get the active sidebar title
        const activeLink = document.querySelector('.nav-link[data-content].active');
        const headerTitle = activeLink ? 
            activeLink.textContent.trim().toUpperCase() : 
            (config?.title || "FILTERS");
    
        // Use the same structure for both cases (with and without filters)
        if (this.DOM.pageTitle.textContent === 'Search Results' || !config) {
            filterNav.innerHTML = `
                <div class="filter-scroll-container">
                    <div class="filter-section">
                        <div class="filter-header">
                            <h6 class="region-title">${this.DOM.pageTitle.textContent === 'Search Results' ? 'SEARCH' : headerTitle}</h6>
                            <div class="search-container">
                                <input type="text" id="dynamic-search" class="search-input" placeholder="Search...">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.app.searchEngine.setupSearch();
            return;
        }
    
        // Case with filter configs
        filterNav.innerHTML = `
            <div class="filter-scroll-container">
                <div class="filter-section">
                    <div class="filter-header">
                        <h6 class="region-title">${headerTitle}</h6>
                        <div class="search-container">
                            <input type="text" id="dynamic-search" class="search-input" placeholder="Search...">
                        </div>
                    </div>
                    <div class="filter-buttons">
                        ${config.filters.map(filter => `
                            <button class="filter-btn" data-filter="${filter}">
                                ${filter}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        this.setupFilterButtonListeners();
        this.app.searchEngine.setupSearch();
    }

    setupFilterButtonListeners() {
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const filter = button.getAttribute('data-filter');
                
                if (button.classList.contains('active')) {
                    button.classList.remove('active');
                    this.currentFilter = '';
                } else {
                    document.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    button.classList.add('active');
                    this.currentFilter = filter;
                }
                
                // Apply filter immediately
                if (this.currentSheet) {
                    this.DOM.contentContainer.classList.add('loading');
                    await this.app.loadSheetContent(this.currentSheet, this.currentCategory);
                    
                    // Reset both window and main content scroll
                    const mainContent = document.querySelector('.main-content');
                    if (mainContent) {
                        mainContent.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                    
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    
                    this.DOM.contentContainer.classList.remove('loading');
                }
            });
        });
    }

}