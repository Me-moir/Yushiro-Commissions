
class SearchEngine {
    constructor(sheetDataCache, CONFIG, uiManager, cardGenerator) {
        this.sheetDataCache = sheetDataCache;
        this.CONFIG = CONFIG;
        this.uiManager = uiManager;
        this.cardGenerator = cardGenerator; // Add CardGenerator reference
        this.currentFilter = '';
        this.cardGenerator.setupCardListeners();
    }


    async loadSheetData(sheetKey) {
        if (this.sheetDataCache[sheetKey]) {
            return this.sheetDataCache[sheetKey];
        }

        try {
            const sheetConfig = CONFIG.SHEETS[sheetKey]; 
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: sheetConfig.range
            });

            const processedData = response.result.values?.slice(1) || [];
            this.sheetDataCache[sheetKey] = processedData;
            return processedData;
        } catch (error) {
            console.error(`Error loading ${sheetKey} sheet:`, error);
            return [];
        }
    }

    async performSearchRedirect(searchTerm) {
        console.log('Performing search for:', searchTerm);
        
        if (!searchTerm || searchTerm.trim().length < 2) {
            this.uiManager.DOM.contentContainer.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <div class="card-info">
                            <h2 class="card-title">Invalid Search</h2>
                            <p class="card-description">Please enter at least 2 characters to search.</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        try {
            // Get all data first for suggestions
            const allData = await this.getAllSheetData();
            
            // Perform strict search
            const searchResults = await this.searchAllSheets(searchTerm);
            console.log('Search results:', searchResults);

            // Hide filter buttons section
            const filterButtons = document.querySelector('.filter-nav .filter-buttons');
            if (filterButtons) {
                filterButtons.style.display = 'none';
            }

            let resultsHTML = '';
            
            if (searchResults.length === 0) {
                // Find similar items for suggestions
                const suggestions = this.findSimilarItems(searchTerm, allData);
                
                if (suggestions.length > 0) {
                    resultsHTML = `
                        <div class="no-results-container">
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-info">
                                        <h2 class="card-title">No Results Found</h2>
                                        <p class="card-description">No matches found for "${searchTerm}"</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="suggestions-container">
                                <div class="suggestions-header">
                                    <h2>Did you mean:</h2>
                                </div>
                                <div class="suggestions-grid">
                                    ${suggestions.map(suggestion => 
                                        `<div class="suggestion-item">
                                            ${this.cardGenerator.generateCardHTML(suggestion.rowData, suggestion.sheetConfig)}
                                        </div>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>`;
                } else {
                    resultsHTML = `
                        <div class="card no-results">
                            <div class="card-header">
                                <div class="card-info">
                                    <h2 class="card-title">No Results Found</h2>
                                    <p class="card-description">No matches found for "${searchTerm}"</p>
                                </div>
                            </div>
                        </div>`;
                }
            } else {
                resultsHTML = `
                    <div class="search-results-grid">
                        ${searchResults.map(result => 
                            `<div class="search-result-item" data-score="${result.score || 0}">
                                ${this.cardGenerator.generateCardHTML(result.rowData, result.sheetConfig)}
                            </div>`
                        ).join('')}
                    </div>`;
            }
            
            this.uiManager.DOM.contentContainer.innerHTML = resultsHTML;
            
            // Set up card listeners after adding cards to DOM
            this.cardGenerator.setupCardListeners();
            
        } catch (error) {
            console.error('Search error:', error);
            this.uiManager.DOM.contentContainer.innerHTML = `
                <div class="card error">
                    <div class="card-header">
                        <div class="card-info">
                            <h2 class="card-title">Search Error</h2>
                            <p class="card-description">An error occurred while searching: ${error.message}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    async getAllSheetData() {
        const allData = [];
        const sheetKeys = Object.keys(CONFIG.SHEETS);

        for (const sheetKey of sheetKeys) {
            const sheetData = await this.loadSheetData(sheetKey);
            sheetData.forEach(row => {
                allData.push({
                    sheetType: sheetKey,
                    rowData: row,
                    sheetConfig: CONFIG.SHEETS[sheetKey]
                });
            });
        }
        return allData;
    }

   calculateSearchScore(row, sheetConfig, searchTerm) {
        if (!row || !sheetConfig || !sheetConfig.columns) {
            return 0;
        }

        // For strict searching, we'll only look for exact matches
        const searchTermLower = searchTerm.toLowerCase().trim();
        const bundleNameIndex = sheetConfig.columns.BUNDLE_NAME;
        
        if (bundleNameIndex === undefined) return 0;
        
        const bundleName = String(row[bundleNameIndex] || '').toLowerCase().trim();
        
        // Only return a score if there's an exact match
        return bundleName === searchTermLower ? 100 : 0;
    }

    calculateLevenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,     // Deletion
                        dp[i][j - 1] + 1,     // Insertion
                        dp[i - 1][j - 1] + 1  // Substitution
                    );
                }
            }
        }

        return dp[m][n];
    }

    updateSearchResultFilters(searchResults) {
        // Ensure searchResults is an array and has content
        if (!Array.isArray(searchResults)) {
            console.warn('searchResults is not an array:', searchResults);
            searchResults = [];
        }

        const allTags = new Set();
        
        searchResults.forEach(result => {
            // Check if result and rowData exist
            if (result && result.rowData && result.sheetConfig) {
                const tagsIndex = result.sheetConfig.columns.TAGS;
                if (tagsIndex !== undefined) {
                    const tagsString = result.rowData[tagsIndex] || '';
                    tagsString.split(',').forEach(tag => {
                        const trimmedTag = tag.trim().toLowerCase();
                        if (trimmedTag) allTags.add(trimmedTag);
                    });
                }
            }
        });

        const filterNav = document.querySelector('.filter-nav');
        if (filterNav) {
            filterNav.innerHTML = `
                <div class="filter-scroll-container">
                    <div class="filter-section">
                        <div class="filter-header">
            `;
            
            // Re-setup filter button listeners and search
            if (this.uiManager) {
                this.uiManager.setupFilterButtonListeners();
                this.setupSearch();
            }
        }
    }

    async searchAllSheets(searchTerm) {
        if (!searchTerm || searchTerm.trim().length < 2) {
            return [];
        }

        const results = [];
        const sheetKeys = Object.keys(CONFIG.SHEETS);

        for (const sheetKey of sheetKeys) {
            try {
                const sheetData = await this.loadSheetData(sheetKey);
                const sheetConfig = CONFIG.SHEETS[sheetKey];

                sheetData.forEach(row => {
                    const searchScore = this.calculateSearchScore(row, sheetConfig, searchTerm);
                    if (searchScore > 0) {
                        results.push({
                            sheetType: sheetKey,
                            rowData: row,
                            sheetConfig: sheetConfig,
                            score: searchScore
                        });
                    }
                });
            } catch (error) {
                console.error(`Error searching sheet ${sheetKey}:`, error);
            }
        }

        // Sort by score in descending order and filter out low-scoring results
        return results
            .filter(result => result.score >= 2) // Only keep results with meaningful matches
            .sort((a, b) => b.score - a.score);
    }

    filterSearchResults(filterTerm) {
        const searchResults = document.querySelectorAll('.search-result');
        let visibleResultsCount = 0;
        
        searchResults.forEach(result => {
            const tagsString = result.querySelector('.card-description')?.textContent.toLowerCase() || '';
            const bundleName = result.querySelector('.card-title')?.textContent.toLowerCase() || '';
            
            const isVisible = !filterTerm || 
                tagsString.includes(filterTerm) || 
                bundleName.includes(filterTerm);
            
            result.style.display = isVisible ? '' : 'none';
            
            if (isVisible) visibleResultsCount++;
        });
    
        const noResultsMessage = document.querySelector('.no-results-filter');
        if (visibleResultsCount === 0) {
            if (!noResultsMessage) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'card no-results-filter';
                messageDiv.innerHTML = `
                    <div class="card-header">
                        <div class="card-info">
                            <h2 class="card-title">No Results Found</h2>
                            <p class="card-description">No matches found for the selected filter "${filterTerm}"</p>
                        </div>
                    </div>
                `;
                document.querySelector('#content-container').insertBefore(messageDiv, document.querySelector('.search-result'));
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    calculateStringSimilarity(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,     // Deletion
                        dp[i][j - 1] + 1,     // Insertion
                        dp[i - 1][j - 1] + 1  // Substitution
                    );
                }
            }
        }

        const maxLen = Math.max(m, n);
        const similarity = 1 - (dp[m][n] / maxLen);
        return similarity;
    }

    findSimilarItems(searchTerm, allData, maxSuggestions = 3) {
        const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
        const similarities = [];
        const seenSuggestions = new Set();

        allData.forEach(item => {
            const bundleNameIndex = item.sheetConfig.columns.BUNDLE_NAME;
            if (bundleNameIndex === undefined || !item.rowData[bundleNameIndex]) return;

            const bundleName = item.rowData[bundleNameIndex].toString().toLowerCase().trim();
            
            // Calculate various similarity metrics
            const exactSimilarity = bundleName === lowercaseSearchTerm ? 1 : 0;
            const containsSimilarity = bundleName.includes(lowercaseSearchTerm) ? 0.8 : 0;
            const levenshteinSimilarity = 1 - (this.calculateLevenshteinDistance(bundleName, lowercaseSearchTerm) / 
                                             Math.max(bundleName.length, lowercaseSearchTerm.length));

            // Use the highest similarity score
            const similarity = Math.max(exactSimilarity, containsSimilarity, levenshteinSimilarity);

            const suggestionKey = `${item.sheetType}-${bundleName}`;
            
            // Only include items with significant similarity
            if (similarity > 0.6 && !seenSuggestions.has(suggestionKey)) {
                seenSuggestions.add(suggestionKey);
                similarities.push({
                    ...item,
                    similarity
                });
            }
        });

        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, maxSuggestions);
    }

    resetSearchAndFilters() {
        const searchInput = document.getElementById('dynamic-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Get current active subtab information
        const activeLink = document.querySelector('.dropdown-content .nav-link[data-content].active');
        const subtabTitle = activeLink ? Array.from(activeLink.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join(' ')
            .trim() : '';
        
        // Reset page title if current sheet exists
        if (this.uiManager.currentSheet) {
            this.uiManager.DOM.pageTitle.textContent = this.uiManager.currentMainTab || 
                this.uiManager.currentSheet.charAt(0).toUpperCase() + this.uiManager.currentSheet.slice(1);
            
            // Restore subtab display if we have an active subtab
            if (subtabTitle) {
                this.uiManager.DOM.activeSubtab.textContent = `  ${subtabTitle}`;
                this.uiManager.DOM.activeSubtab.style.display = 'inline';
            } else {
                this.uiManager.DOM.activeSubtab.textContent = '';
                this.uiManager.DOM.activeSubtab.style.display = 'none';
            }
        }
        
        // Show the filter buttons when resetting
        const filterButtons = document.querySelector('.filter-nav .filter-buttons');
        if (filterButtons) {
            filterButtons.style.display = '';
        }
        
        this.currentFilter = '';
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    
        if (this.uiManager.currentSheet) {
            this.uiManager.updateFilterButtons(this.uiManager.currentSheet);
        }
    }

    setupSearch() {
        console.log('Setting up search in SearchEngine...');
        const searchInput = document.getElementById('dynamic-search');
        
        if (!searchInput) {
            console.error('Search input element not found');
            return;
        }

        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                
                if (searchTerm) {
                    this.uiManager.DOM.pageTitle.textContent = 'Search Results';
                    this.uiManager.DOM.contentContainer.innerHTML = '<div class="loading">Searching...</div>';
                    await this.performSearchRedirect(searchTerm);
                }
            }
        });

        // Setup search button if it exists
        const searchButton = document.querySelector('.search-button');
        if (searchButton) {
            searchButton.addEventListener('click', async () => {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    await this.performSearchRedirect(searchTerm);
                }
            });
        }
    }

    filterDataByBoth(data, sheetConfig) {
        return data.filter(row => {
            const tagsString = row[sheetConfig.columns.TAGS] || '';
            const tags = typeof tagsString === 'string' 
                ? tagsString.split(',').map(tag => tag.trim().toLowerCase())
                : (tagsString || []);
            
            const matchesCategory = !this.currentCategory || 
                tags.some(tag => tag.includes(this.currentCategory.toLowerCase()));
            
            const matchesSidebarFilter = !this.currentFilter || 
                tags.some(tag => tag.includes(this.currentFilter.toLowerCase()));
            
            return matchesCategory && matchesSidebarFilter;
        });
    }
}