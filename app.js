class DashboardApp {
    constructor() {
        this.cardGenerator = new CardGenerator();
        this.sheetDataCache = {};
        this.uiManager = new UIManager(this.cardGenerator, this);
        this.searchEngine = new SearchEngine(
            this.sheetDataCache, 
            CONFIG, 
            this.uiManager,
            this.cardGenerator  
        );
        this.currentSheet = null;
        this.currentFilter = '';
        this.previousActiveLink = null;
        this.currentCategory = '';
        this.cardGenerator.setupCardListeners();
        this.initializeApplication();
    }

    initializeApplication() {
        this.loadGoogleAPI();
        this.setupEventListeners();
    }

    initializeSheetDataCache() {
        this.sheetDataCache = {};
    }

    async loadGoogleAPI() {
        try {
            console.log('Loading Google API script...'); // Debug log
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';

            const scriptLoadPromise = new Promise((resolve, reject) => {
                script.onload = () => {
                    console.log('Google API script loaded successfully');
                    resolve();
                };
                script.onerror = (error) => {
                    console.error('Failed to load Google API script:', error);
                    reject(new Error('Failed to load Google API'));
                };
            });
            document.body.appendChild(script);
            await scriptLoadPromise;

            console.log('Loading GAPI client...'); // Debug log
            await new Promise((resolve, reject) => {
                gapi.load('client', {
                    callback: resolve,
                    onerror: reject
                });
            });
            console.log('Initializing Google client...'); // Debug log
            await this.initializeGoogleClient();
            console.log('Google API setup complete'); // Debug log
            this.loadInitialContent();
            
        } catch (error) {
            console.error('Error in loadGoogleAPI:', error);
            this.uiManager.showError(`Failed to load Google API: ${error.message}`);
        }
    }

    initializeGoogleClient() {
        return new Promise((resolve, reject) => {
            try {
                gapi.client.init({
                    apiKey: CONFIG.API_KEY,
                    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
                }).then(() => {
                    console.log('Google Sheets API initialized successfully');
                    resolve();
                }).catch((error) => {
                    console.error('Failed to initialize Google Sheets API:', error);
                    reject(error);
                });
            } catch (error) {
                console.error('Error in initializeGoogleClient:', error);
                reject(error);
            }
        });
    }
    
    setupEventListeners() {
        this.uiManager.setupNavigationListeners();
        this.uiManager.setupMobileNavigation();
        this.searchEngine.setupSearch(); 
        this.uiManager.setupFilterNavigation();
    }

    async performSearchRedirect(searchTerm) {
        try {
            this.uiManager.DOM.contentContainer.innerHTML = '<div class="loading">Searching...</div>';
            await this.searchEngine.performSearchRedirect(searchTerm);
        } catch (error) {
            console.error('Search error:', error);
            this.uiManager.showError(`Search failed: ${error.message}`);
        }
    }

    async loadSheetContent(sheetKey, category = '') {
        try {
            const sheetConfig = CONFIG.SHEETS[sheetKey];
            if (!sheetConfig) {
                this.uiManager.showError('Invalid sheet configuration');
                return;
            }

            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: sheetConfig.range
            });

            if (!response.result.values) {
                this.uiManager.showError('No data found');
                return;
            }

            // Filter the data based on both category and current filter
            const filteredData = this.filterDataByBoth(
                response.result.values,
                sheetConfig,
                category,
                this.uiManager.currentFilter
            );

            if (filteredData.length === 0) {
                this.uiManager.DOM.contentContainer.innerHTML = `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-info">
                                <h2 class="card-title">No Results</h2>
                                <p class="card-description">No items found for the selected filter.</p>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }

            // Use cardGenerator to generate HTML for filtered data
            const cardsHTML = this.cardGenerator.generateContentHTML(sheetKey, filteredData, sheetConfig);
            this.uiManager.DOM.contentContainer.innerHTML = cardsHTML;
            this.cardGenerator.setupCardListeners();

        } catch (error) {
            console.error('Error loading content:', error);
            this.uiManager.showError('Failed to load content');
        }
    }

    filterDataByBoth(data, sheetConfig, category, currentFilter) {
        if (!data || !sheetConfig) {
            console.warn('Missing data or sheet configuration');
            return [];
        }

        return data.filter(row => {
            const tagsColumnIndex = sheetConfig.columns.TAGS;
            if (tagsColumnIndex === undefined) {
                console.warn('No TAGS column defined in sheet config');
                return true;
            }

            const tagsString = (row[tagsColumnIndex] || '').toString();
            const tags = tagsString.split(',').map(tag => tag.trim().toLowerCase());

            // Check if both category and filter match
            const matchesCategory = !category || tags.some(tag => tag.includes(category.toLowerCase()));
            const matchesFilter = !currentFilter || tags.includes(currentFilter.toLowerCase());

            return matchesCategory && matchesFilter;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new DashboardApp();
});