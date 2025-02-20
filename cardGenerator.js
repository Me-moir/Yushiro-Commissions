
class CardGenerator {
    generateCardHTML(row, sheetConfig) {
        if (!row || !sheetConfig) {
            console.warn('Missing data or sheet configuration');
            return '<div class="card">Invalid card data</div>';
        }

        let sheetKey;
        for (const [key, config] of Object.entries(CONFIG.SHEETS)) {
            if (config === sheetConfig) {
                sheetKey = key;
                break;
            }
        }

        if (!sheetKey) {
            console.warn('Unable to determine sheet type for card generation');
            return '<div class="card">Unknown card type</div>';
        }

        const cardGenerators = {
            announcements: this.createAnnouncementCard.bind(this),
            maintenance: this.createMaintenanceCard.bind(this),
            resin: this.createResinCard.bind(this),
            'Material Farming': this.createMaterial_FarmingCard.bind(this),
            'Special Offerings': this.createSpecial_OfferingsCard.bind(this),
            Ascension: this.createAscensionCard.bind(this)
        };

        const generator = cardGenerators[sheetKey];
        return generator ? generator(row, sheetConfig) : '<div class="card">Unsupported card type</div>';
    }

    generateContentHTML(sheetKey, data, sheetConfig) {
        const cardGenerators = {
            announcements: this.createAnnouncementCard.bind(this),
            maintenance: this.createMaintenanceCard.bind(this),
            resin: this.createResinCard.bind(this),
            'Material Farming': this.createMaterial_FarmingCard.bind(this),
            'Special Offerings': this.createSpecial_OfferingsCard.bind(this),
            Ascension: this.createAscensionCard.bind(this)
        };

        const generator = cardGenerators[sheetKey];
        return generator ? data.map(row => generator(row, sheetConfig)).join('') 
                    : '<div class="card">No content available</div>';
    }

    createAnnouncementCard(row, config) {
        const { columns } = config;
        const cardTitle = row[columns.NEWS] || 'Untitled';
        const imagePath = `../images/${cardTitle.toLowerCase().replace(/\s+/g, '-')}.png`;
        
        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-left">
                        <div class="card-image" style="overflow: hidden; border-radius: 12px;">
                            <img src="${imagePath}" 
                                alt="${cardTitle}" 
                                onerror="this.onerror=null; this.src='../images/default-announcement.png';"
                                style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;" />
                        </div>
                        <div class="card-info">
                            <h2 class="card-title">${cardTitle}</h2>
                            <p class="card-description">${row[columns.DATE] || ''} ${row[columns.TIME] || ''}</p>
                        </div>
                    </div>
                    <div class="card-right">
                        <button class="expand-btn">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <p>${row[columns.LINE1] || ''}</p>
                    ${row[columns.LINE2] ? `<p>${row[columns.LINE2]}</p>` : ''}
                </div>
            </div>
        `;
    }

    createMaintenanceCard(row, config) {
        // Basic card info
        const bundleName = row[config.columns.BUNDLE_NAME] || 'Unknown Bundle';
        const imagePath = `../images/${bundleName.toLowerCase().replace(/\s+/g, '-')}.png`;
        
        // Define all pricing data
        const prices = {
            default: {
                label: row[config.columns.DEFAULT_LABEL] || 'Default Price',
                php: {
                    min: row[config.columns.PHP_MIN],
                    max: row[config.columns.PHP_MAX]
                },
                usd: {
                    min: row[config.columns.USD_MIN],
                    max: row[config.columns.USD_MAX]
                }
            },
            price1: {
                label: row[config.columns.PRICE_1_LABEL],
                php: {
                    min: row[config.columns.PRICE_1_PHP_MIN],
                    max: row[config.columns.PRICE_1_PHP_MAX]
                },
                usd: {
                    min: row[config.columns.PRICE_1_USD_MIN],
                    max: row[config.columns.PRICE_1_USD_MAX]
                }
            },
            price2: {
                label: row[config.columns.PRICE_2_LABEL],
                php: {
                    min: row[config.columns.PRICE_2_PHP_MIN],
                    max: row[config.columns.PRICE_2_PHP_MAX]
                },
                usd: {
                    min: row[config.columns.PRICE_2_USD_MIN],
                    max: row[config.columns.PRICE_2_USD_MAX]
                }
            },
            price3: {
                label: row[config.columns.PRICE_3_LABEL],
                php: {
                    min: row[config.columns.PRICE_3_PHP_MIN],
                    max: row[config.columns.PRICE_3_PHP_MAX]
                },
                usd: {
                    min: row[config.columns.PRICE_3_USD_MIN],
                    max: row[config.columns.PRICE_3_USD_MAX]
                }
            }
        };
    
        // Format a price range
        const formatPrice = (min, max, currency) => {
            if (!min && !max) return 'Unavailable';
            if (!max || min === max) return `${currency}${min}`;
            return `${currency}${min} - ${currency}${max}`;
        };
    
        // Get initial prices for display
        const initialPhpPrice = formatPrice(prices.default.php.min, prices.default.php.max, '₱');
        const initialUsdPrice = formatPrice(prices.default.usd.min, prices.default.usd.max, '$');
    
        // Generate price variation buttons
        // Generate price variation buttons
        const getPriceButtons = () => {
            let buttons = [
                `<button type="button" class="price-btn active" data-price-type="default">
                    ${prices.default.label}
                </button>`
            ];
    
            if (prices.price1.label) {
                buttons.push(
                    `<button type="button" class="price-btn" data-price-type="price1">
                        ${prices.price1.label}
                    </button>`
                );
            }
    
            if (prices.price2.label) {
                buttons.push(
                    `<button type="button" class="price-btn" data-price-type="price2">
                        ${prices.price2.label}
                    </button>`
                );
            }

            if (prices.price3.label) {
                buttons.push(
                    `<button type="button" class="price-btn" data-price-type="price3">
                        ${prices.price3.label}
                    </button>`
                );
            }
    
            return buttons.join('');
        };
    
        // Build the card HTML
        return `
            <div class="card" 
                data-bundle-name="${bundleName}"
                data-php-min="${row[config.columns.PHP_MIN] || ''}"
                data-php-max="${row[config.columns.PHP_MAX] || ''}"
                data-usd-min="${row[config.columns.USD_MIN] || ''}"
                data-usd-max="${row[config.columns.USD_MAX] || ''}"
                data-price1-php-min="${row[config.columns.PRICE_1_PHP_MIN] || ''}"
                data-price1-php-max="${row[config.columns.PRICE_1_PHP_MAX] || ''}"
                data-price1-usd-min="${row[config.columns.PRICE_1_USD_MIN] || ''}"
                data-price1-usd-max="${row[config.columns.PRICE_1_USD_MAX] || ''}"
                data-price2-php-min="${row[config.columns.PRICE_2_PHP_MIN] || ''}"
                data-price2-php-max="${row[config.columns.PRICE_2_PHP_MAX] || ''}"
                data-price2-usd-min="${row[config.columns.PRICE_2_USD_MIN] || ''}"
                data-price2-usd-max="${row[config.columns.PRICE_2_USD_MAX] || ''}"
                data-price3-php-min="${row[config.columns.PRICE_3_PHP_MIN] || ''}"
                data-price3-php-max="${row[config.columns.PRICE_3_PHP_MAX] || ''}"
                data-price3-usd-min="${row[config.columns.PRICE_3_USD_MIN] || ''}"
                data-price3-usd-max="${row[config.columns.PRICE_3_USD_MAX] || ''}">
                
                <!-- Card Header -->
                <div class="card-header">
                    <div class="card-left">
                        <!-- Card Image -->
                        <div class="card-image">
                            <img src="${imagePath}" 
                                alt="${bundleName}" 
                                onerror="this.onerror=null; this.src='../images/default-bundle.png';"
                                style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;" />
                        </div>
                        
                        <!-- Card Info -->
                        <div class="card-info">
                            <h2 class="card-title">${bundleName}</h2>
                            <p class="card-description">${row[config.columns.NOTES] || 'No description available'}</p>
                            
                            <!-- Mobile Price Display -->
                            <div class="mobile-price">
                                <span class="mobile-php">${initialPhpPrice}</span>
                                <span class="price-divider">|</span>
                                <span class="mobile-usd">${initialUsdPrice}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Desktop Price Display -->
                    <div class="card-right desktop-price">
                        <div class="price-container">
                            <span class="card-price">${initialPhpPrice}</span>
                            <span class="card-price-usd">${initialUsdPrice}</span>
                        </div>
                        <button class="expand-btn">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Card Content -->
                <div class="card-content">
                    <div class="card-content-layout">
                        <!-- Description Section -->
                        <div class="card-content-left">
                            <h3>Description</h3>
                            ${this.createListItems(row[config.columns.INCLUSIONS])}
                        </div>
                        
                        <!-- Price Variations Section -->
                        <div class="card-content-right price-variations">
                            <h3>Item Variation</h3>
                            <div class="price-variation-buttons">
                                ${getPriceButtons()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createResinCard(row, config) {
        return this.createMaintenanceCard(row, config);
    }

    createMaterial_FarmingCard(row, config) {
        return this.createMaintenanceCard(row, config); 
    }

    createSpecial_OfferingsCard(row, config) {
        return this.createMaintenanceCard(row, config); 
    }

    createAscensionCard(row, config) {
        return this.createMaintenanceCard(row, config); 
    }

    createListItems(listsString) {
        if (!listsString) return '';
        
        // Split the string by semicolon, removing them completely
        const items = listsString.split(';').map(item => item.trim()).filter(item => item);
        if (items.length === 0) return '';
    
        const itemStyles = {
            description: `
                margin-bottom: 8px;
                font-weight: 500;
                color:rgb(203, 203, 203);
                line-height: 0.5;
            `,
            bulletList: `
                list-style: none;
                padding-left: 20px;
                margin: 4px 0;
            `,
            bulletItem: `
                position: relative;
                padding-left: 15px;
                margin-bottom: 6px;
                color: #ffffff;
                &::before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: #ffffff;
                }
            `,
            tag: `
                padding: 3px 6px;
                border-radius: 3px;
                font-size: 0.5em;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: white;
                margin-left: 8px;
            `,
            gradients: {
                gold: 'linear-gradient(45deg, #FFD700, #FFA500)',
                red: 'linear-gradient(45deg, #FF4444, #FF0000)',
                blue: 'linear-gradient(45deg, #4169E1, #00BFFF)',
                green: 'linear-gradient(45deg, #32CD32, #00FF00)',
                orange: 'linear-gradient(45deg, #FFA500, #FF6347)',
                violet: 'linear-gradient(45deg, #9400D3, #8A2BE2)'
            }
        };
    
        const tagTypes = {
            '#L': { color: '#FF4444', label: 'Limited' },
            '#O': { color: '#FF4444', label: 'Optional' },
            '#F': { 
                gradient: 'linear-gradient(45deg,rgb(65, 118, 209),rgb(85, 180, 85))',
                label: 'Freebie' 
            },
            '#P': { color: '#FF4444', label: 'Promo' },
            '#S': { 
                gradient: 'linear-gradient(45deg, #FFD700, #FFA500)',
                label: 'Special'
            }
        };
    
        const processHighlightedText = (text) => {
            const patterns = {
                'G\\(': itemStyles.gradients.gold,
                'R\\(': itemStyles.gradients.red,
                'B\\(': itemStyles.gradients.blue,
                'Gr\\(': itemStyles.gradients.green,
                'O\\(': itemStyles.gradients.orange,
                'V\\(': itemStyles.gradients.violet
            };
    
            let processedText = text;
            
            Object.entries(patterns).forEach(([pattern, gradient]) => {
                const regex = new RegExp(`\\(${pattern}(.*?)\\)\\)`, 'g');
                processedText = processedText.replace(regex, (match, content) => {
                    return `<span style="background: ${gradient}; -webkit-background-clip: text; background-clip: text; color: transparent;">${content.trim()}</span>`;
                });
            });
    
            return processedText;
        };
    
        let descriptionHtml = '';
        let bulletListHtml = '';
    
        items.forEach(item => {
            const trimmedItem = item.trim();
            
            // Check if item is a bullet point
            if (trimmedItem.startsWith('(-)')) {
                const bulletContent = trimmedItem.slice(3).trim();
                bulletListHtml += `
                    <li style="${itemStyles.bulletItem}">
                        ${processHighlightedText(bulletContent)}
                    </li>
                `;
            } else {
                // Process tags
                let content = trimmedItem;
                let tagHtml = '';
                
                for (const [tag, style] of Object.entries(tagTypes)) {
                    if (trimmedItem.startsWith(tag)) {
                        content = trimmedItem.slice(tag.length).trim();
                        const tagStyle = style.gradient ?
                            `${itemStyles.tag} background: ${style.gradient}; text-shadow: 1px 1px 1px rgba(0,0,0,0.2);` :
                            `${itemStyles.tag} background-color: ${style.color};`;
                        tagHtml = `<span style="${tagStyle}">${style.label}</span>`;
                        break;
                    }
                }
                
                descriptionHtml += `
                    <p style="${itemStyles.description}">
                        ${processHighlightedText(content)}
                        ${tagHtml}
                    </p>
                `;
            }
        });
    
        const bulletListWrapper = bulletListHtml ? 
            `<ul style="${itemStyles.bulletList}">${bulletListHtml}</ul>` : '';
    
        return `
            <div class="description-container">
                ${descriptionHtml}
                ${bulletListWrapper}
            </div>
        `;
    }

    setupCardListeners() {
        console.log('Setting up card listeners...');
        
        // Find all cards including those in search results
        document.querySelectorAll('.card').forEach(card => {
            const expandBtn = card.querySelector('.expand-btn');
            const content = card.querySelector('.card-content');
            const priceVariationBtns = card.querySelectorAll('.price-btn');
            
            // Remove existing listeners to prevent duplicates
            card.removeEventListener('click', this.handleCardClick);
            expandBtn?.removeEventListener('click', this.handleExpandBtnClick);
            
            // Add click handler for the card
            card.addEventListener('click', (e) => {
                // Only toggle if not clicking price button or expanded content
                if (!e.target.closest('.price-btn') && !e.target.closest('.card-content.active')) {
                    this.toggleCard(card);
                }
            });
            
            // Add specific handler for expand button
            if (expandBtn) {
                expandBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleCard(card);
                });
            }
            
            // Setup price variation buttons if they exist
            if (priceVariationBtns.length > 0) {
                this.setupPriceVariationListeners(card, priceVariationBtns);
            }
        });
    }

    handleCardClick(e, card) {
        // Get content and icon for this card
        const content = card.querySelector('.card-content');
        const icon = card.querySelector('.expand-btn i');
        
        // Check if this card is already active
        const isActive = content?.classList.contains('active');
        
        // Close all other cards first
        this.closeAllCards();
        
        // Toggle this card
        if (content) {
            if (!isActive) {
                content.classList.add('active');
                card.classList.add('active');
                if (icon) {
                    icon.className = 'fa-solid fa-chevron-up';
                }
            }
        }
    }

    handleExpandBtnClick(e, card) {
        // Same logic as handleCardClick
        this.handleCardClick(e, card);
    }
    
    closeAllCards() {
        document.querySelectorAll('.card').forEach(card => {
            const content = card.querySelector('.card-content');
            const icon = card.querySelector('.expand-btn i');
            
            content?.classList.remove('active');
            card.classList.remove('active');
            if (icon) {
                icon.className = 'fa-solid fa-chevron-down';
            }
        });
    }

    formatPriceWithValidation(min, max, symbol) {
        // Helper function to check if a value is valid
        const isValidPrice = (value) => {
            if (value === undefined || value === null || value === '') return false;
            const num = parseFloat(value);
            return !isNaN(num) && num >= 0;
        };
    
        // Convert values to numbers if they're valid
        const minNum = isValidPrice(min) ? parseFloat(min) : null;
        const maxNum = isValidPrice(max) ? parseFloat(max) : null;
    
        // If both values are invalid, return Unavailable
        if (minNum === null && maxNum === null) {
            return 'Unavailable';
        }
    
        // If only max is invalid or both values are equal, return only min
        if (maxNum === null || minNum === maxNum) {
            return `${symbol}${minNum.toFixed(2)}`;
        }
    
        // If only min is invalid, use max as a single price
        if (minNum === null) {
            return `${symbol}${maxNum.toFixed(2)}`;
        }
    
        // If both values are valid and different, return range
        return `${symbol}${minNum.toFixed(2)} - ${symbol}${maxNum.toFixed(2)}`;
    }

    toggleCard(card) {
        if (!card) return;
        
        const content = card.querySelector('.card-content');
        const icon = card.querySelector('.expand-btn i');
        const isCurrentlyActive = content?.classList.contains('active');
        
        // First close all cards
        document.querySelectorAll('.card').forEach(otherCard => {
            const otherContent = otherCard.querySelector('.card-content');
            const otherIcon = otherCard.querySelector('.expand-btn i');
            
            otherContent?.classList.remove('active');
            otherCard.classList.remove('active');
            if (otherIcon) {
                otherIcon.className = 'fa-solid fa-chevron-down';
            }
        });
        
        // Then open the clicked card if it wasn't already open
        if (!isCurrentlyActive && content) {
            content.classList.add('active');
            card.classList.add('active');
            if (icon) {
                icon.className = 'fa-solid fa-chevron-up';
            }
        }
    }

    setupSearchResultListeners() {
        // Find all cards within search results
        const searchResultCards = document.querySelectorAll('.search-result .card');
        if (searchResultCards.length > 0) {
            this.setupCardListeners();
        }
    }

    generateSearchResultsHTML(searchResults) {
        if (!searchResults || searchResults.length === 0) {
            return ''; // Return empty string as the no results card is handled in performSearchRedirect
        }
    
        const html = searchResults.map(result => {
            const cardGenerators = {
                announcements: this.createAnnouncementCard.bind(this),
                maintenance: this.createMaintenanceCard.bind(this),
                resin: this.createResinCard.bind(this),
                Material_Farming: this.createMaterial_FarmingCard.bind(this),
                Special_Offerings: this.createSpecial_OfferingsCard.bind(this),
                ascension: this.createAscensionCard.bind(this)
            };
    
            const generator = cardGenerators[result.sheetType];
            if (generator) {
                const cardHTML = generator(result.rowData, result.sheetConfig);
                return `<div class="search-result" data-score="${result.score || 0}">${cardHTML}</div>`;
            }
            return '';
        }).join('');
        
        return html;
    }

    setupPriceVariationListeners(card, priceVariationBtns) {
        const desktopPriceContainer = card.querySelector('.card-right .price-container');
        const mobilePriceContainer = card.querySelector('.mobile-price');

        priceVariationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const priceType = btn.getAttribute('data-price-type');
                
                let priceData = {
                    php: { min: null, max: null },
                    usd: { min: null, max: null }
                };
        
                switch(priceType) {
                    case 'default':
                        priceData = {
                            php: {
                                min: card.dataset.phpMin,
                                max: card.dataset.phpMax
                            },
                            usd: {
                                min: card.dataset.usdMin,
                                max: card.dataset.usdMax
                            }
                        };
                        break;
                    case 'price1':
                        priceData = {
                            php: {
                                min: card.dataset.price1PhpMin,
                                max: card.dataset.price1PhpMax
                            },
                            usd: {
                                min: card.dataset.price1UsdMin,
                                max: card.dataset.price1UsdMax
                            }
                        };
                        break;
                    case 'price2':
                        priceData = {
                            php: {
                                min: card.dataset.price2PhpMin,
                                max: card.dataset.price2PhpMax
                            },
                            usd: {
                                min: card.dataset.price2UsdMin,
                                max: card.dataset.price2UsdMax
                            }
                        };
                        break;
                    case 'price3':
                        priceData = {
                            php: {
                                min: card.dataset.price3PhpMin,
                                max: card.dataset.price3PhpMax
                            },
                            usd: {
                                min: card.dataset.price3UsdMin,
                                max: card.dataset.price3UsdMax
                            }
                        };
                        break;
                }
        
                // Update active button
                priceVariationBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
        
                const phpPrice = this.formatPriceWithValidation(priceData.php.min, priceData.php.max, '₱');
                const usdPrice = this.formatPriceWithValidation(priceData.usd.min, priceData.usd.max, '$');
        
                // Helper function to animate price change
                const animatePriceChange = (element) => {
                    if (!element) return;
                    element.classList.remove('price-update');
                    void element.offsetWidth;
                    element.classList.add('price-update');
                    
                    setTimeout(() => {
                        element.classList.remove('price-update');
                    }, 1000);
                };
        
                // Update desktop price display with animation
                if (desktopPriceContainer) {
                    const cardPrice = desktopPriceContainer.querySelector('.card-price');
                    const cardPriceUsd = desktopPriceContainer.querySelector('.card-price-usd');
                    
                    if (cardPrice) {
                        cardPrice.textContent = phpPrice;
                        animatePriceChange(cardPrice);
                    }
                    if (cardPriceUsd) {
                        cardPriceUsd.textContent = usdPrice;
                        animatePriceChange(cardPriceUsd);
                    }
                }
        
                // Update mobile price display with animation
                if (mobilePriceContainer) {
                    const mobilePHP = mobilePriceContainer.querySelector('.mobile-php');
                    const mobileUSD = mobilePriceContainer.querySelector('.mobile-usd');
                    
                    if (mobilePHP) {
                        mobilePHP.textContent = phpPrice;
                        animatePriceChange(mobilePHP);
                    }
                    if (mobileUSD) {
                        mobileUSD.textContent = usdPrice;
                        animatePriceChange(mobileUSD);
                    }
                }
            });
        });
    }
}