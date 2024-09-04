const API_KEY = 'AIzaSyCiUCjIPP6lGjSZMKx_CDH8PRkBa5Gnrz8';
const SHEET_ID = '1iKmx1aBg3panRx0oyt3YVgHwuGbEstLycdyCTQfjPcU';
const filters = new Set(); // Keep track of active filters

// Listen for filter button clicks
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        const sheetName = this.getAttribute('data-sheet');
        
        // Toggle active filter
        if (filters.has(sheetName)) {
            filters.delete(sheetName);
            this.classList.remove('active');
        } else {
            filters.add(sheetName);
            this.classList.add('active');
        }

        // Fetch and display data based on active filters
        fetchAndDisplayData();
    });
});

// Function to fetch data based on active filters
function fetchAndDisplayData() {
    const activeFilters = Array.from(filters);
    
    if (activeFilters.length === 0) {
        document.getElementById('sheet-data').innerHTML = '<p>No filter selected</p>';
        return;
    }

    let html = '';
    activeFilters.forEach(sheetName => {
        // Log the sheetName being fetched
        console.log(`Fetching data for sheet: ${sheetName}`);

        // URL encode the sheet name to avoid issues with spaces or special characters
        const encodedSheetName = encodeURIComponent(sheetName);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedSheetName}!A1:F100?key=${API_KEY}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data fetched:', data); // Log the response data

                const rows = data.values;
                if (rows && rows.length > 0) {
                    rows.slice(1).forEach(row => {
                        const bundleName = row[0] || '';
                        const phpMinPrice = row[1] || '';
                        const phpMaxPrice = row[2] || '';
                        const usdMinPrice = row[3] || '';
                        const usdMaxPrice = row[4] || '';
                        const otherDetails = row[5] || '';

                        // Generate HTML for the card
                        if (bundleName.trim() !== '') {
                            html += `
                              <div class="card">
                                <h3>${bundleName}</h3>
                                ${otherDetails.trim() !== '' ? `<p class="features"> ${otherDetails}</p>` : ''}
                                <div class="prices">
                                  ${phpMinPrice.trim() !== '' ? `<p class="php-price">PHP ${phpMinPrice}${phpMaxPrice.trim() !== '' ? ` - ${phpMaxPrice}` : ''}</p>` : ''}
                                  ${usdMinPrice.trim() !== '' ? `<p class="usd-price">USD ${usdMinPrice}${usdMaxPrice.trim() !== '' ? ` - ${usdMaxPrice}` : ''}</p>` : ''}
                                </div>
                              </div>
                            `;
                        }
                        
                    });
                }

                document.getElementById('sheet-data').innerHTML = html;
            })
            .catch(error => {
                console.error('Error fetching data:', error); // Log any errors
                document.getElementById('sheet-data').innerHTML = `<p>Error fetching data for ${sheetName}</p>`;
            });
    });
}








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


