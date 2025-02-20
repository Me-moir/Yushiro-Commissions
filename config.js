const CONFIG = {
    SPREADSHEET_ID: "1iKmx1aBg3panRx0oyt3YVgHwuGbEstLycdyCTQfjPcU",
    API_KEY: "AIzaSyCiUCjIPP6lGjSZMKx_CDH8PRkBa5Gnrz8",
    SHEETS: {
        announcements: {
            range: 'Announcements!A2:F',
            columns: {
                NEWS: 0,
                DATE: 1,
                TIME: 2,
                LINE1: 3,
                LINE2: 4,
                LINK: 5
            }
        },
        maintenance: {
            range: 'Maintenance!A2:X',
            columns: {
                BUNDLE_NAME: 0,
                DEFAULT_LABEL: 1,
                PHP_MIN: 2,
                PHP_MAX: 3,
                USD_MIN: 4,
                USD_MAX: 5,
                PRICE_1_LABEL: 6,
                PRICE_1_PHP_MIN: 7,
                PRICE_1_PHP_MAX: 8,
                PRICE_1_USD_MIN: 9,
                PRICE_1_USD_MAX: 10,
                PRICE_2_LABEL: 11,
                PRICE_2_PHP_MIN: 12,
                PRICE_2_PHP_MAX: 13,
                PRICE_2_USD_MIN: 14,
                PRICE_2_USD_MAX: 15,
                PRICE_3_LABEL: 16,
                PRICE_3_PHP_MIN: 17,
                PRICE_3_PHP_MAX: 18,
                PRICE_3_USD_MIN: 19,
                PRICE_3_USD_MAX: 20,
                NOTES: 21,
                TAGS: 22,
                INCLUSIONS: 23
            }
        },
        resin: {
            range: 'Resin!A2:X',
            columns: {
                BUNDLE_NAME: 0,
                DEFAULT_LABEL: 1,
                PHP_MIN: 2,
                PHP_MAX: 3,
                USD_MIN: 4,
                USD_MAX: 5,
                PRICE_1_LABEL: 6,
                PRICE_1_PHP_MIN: 7,
                PRICE_1_PHP_MAX: 8,
                PRICE_1_USD_MIN: 9,
                PRICE_1_USD_MAX: 10,
                PRICE_2_LABEL: 11,
                PRICE_2_PHP_MIN: 12,
                PRICE_2_PHP_MAX: 13,
                PRICE_2_USD_MIN: 14,
                PRICE_2_USD_MAX: 15,
                PRICE_3_LABEL: 16,
                PRICE_3_PHP_MIN: 17,
                PRICE_3_PHP_MAX: 18,
                PRICE_3_USD_MIN: 19,
                PRICE_3_USD_MAX: 20,
                NOTES: 21,
                TAGS: 22,
                INCLUSIONS: 23
            }
        },
        'Material Farming': {
            range: 'Material Farming!A2:X',
            columns: {
                BUNDLE_NAME: 0,
                DEFAULT_LABEL: 1,
                PHP_MIN: 2,
                PHP_MAX: 3,
                USD_MIN: 4,
                USD_MAX: 5,
                PRICE_1_LABEL: 6,
                PRICE_1_PHP_MIN: 7,
                PRICE_1_PHP_MAX: 8,
                PRICE_1_USD_MIN: 9,
                PRICE_1_USD_MAX: 10,
                PRICE_2_LABEL: 11,
                PRICE_2_PHP_MIN: 12,
                PRICE_2_PHP_MAX: 13,
                PRICE_2_USD_MIN: 14,
                PRICE_2_USD_MAX: 15,
                PRICE_3_LABEL: 16,
                PRICE_3_PHP_MIN: 17,
                PRICE_3_PHP_MAX: 18,
                PRICE_3_USD_MIN: 19,
                PRICE_3_USD_MAX: 20,
                NOTES: 21,
                TAGS: 22,
                INCLUSIONS: 23
            }
        },
        'Special Offerings': {
            range: 'Special Offerings!A2:X',
            columns: {
                BUNDLE_NAME: 0,
                DEFAULT_LABEL: 1,
                PHP_MIN: 2,
                PHP_MAX: 3,
                USD_MIN: 4,
                USD_MAX: 5,
                PRICE_1_LABEL: 6,
                PRICE_1_PHP_MIN: 7,
                PRICE_1_PHP_MAX: 8,
                PRICE_1_USD_MIN: 9,
                PRICE_1_USD_MAX: 10,
                PRICE_2_LABEL: 11,
                PRICE_2_PHP_MIN: 12,
                PRICE_2_PHP_MAX: 13,
                PRICE_2_USD_MIN: 14,
                PRICE_2_USD_MAX: 15,
                PRICE_3_LABEL: 16,
                PRICE_3_PHP_MIN: 17,
                PRICE_3_PHP_MAX: 18,
                PRICE_3_USD_MIN: 19,
                PRICE_3_USD_MAX: 20,
                NOTES: 21,
                TAGS: 22,
                INCLUSIONS: 23
            }
        },
        Ascension: {
            range: 'Ascension!A2:X',
            columns: {
                BUNDLE_NAME: 0,
                DEFAULT_LABEL: 1,
                PHP_MIN: 2,
                PHP_MAX: 3,
                USD_MIN: 4,
                USD_MAX: 5,
                PRICE_1_LABEL: 6,
                PRICE_1_PHP_MIN: 7,
                PRICE_1_PHP_MAX: 8,
                PRICE_1_USD_MIN: 9,
                PRICE_1_USD_MAX: 10,
                PRICE_2_LABEL: 11,
                PRICE_2_PHP_MIN: 12,
                PRICE_2_PHP_MAX: 13,
                PRICE_2_USD_MIN: 14,
                PRICE_2_USD_MAX: 15,
                PRICE_3_LABEL: 16,
                PRICE_3_PHP_MIN: 17,
                PRICE_3_PHP_MAX: 18,
                PRICE_3_USD_MIN: 19,
                PRICE_3_USD_MAX: 20,
                NOTES: 21,
                TAGS: 22,
                INCLUSIONS: 23
            }
        }
    },
    
    FILTER_CONFIGS: {

        // Maintenance filter sets

    
        // Resin Burn filter sets
        domain: {
            title: "FILTER",
            filters: ["Artifacts", "Talent Books", "Weapon Materials"]
        },
        
        "normal boss": {
            title: "FILTER",
            filters: ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine"]
        },

        "weekly boss": {
            title: "FILTER",
            filters: ["Mondstadt", "Liyue", "Inazuma", "Sumeru"]
        },

        // Material Farming filter sets
        specialty: {
            title: "FILTER",
            filters: ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan"]
        },

        crafting: {
            title: "FILTER",
            filters: ["Cooking","Wood", "Forging Ores", "Crystal Core"]
        },

        serenitea: {
            title: "FILTER",
            filters: ["Furnishing", "Gardening", "Blueprints"]
        },

        fishing: {
            title: "FILTER",
            filters: ["Bait", "Fish", "Fishing Rod", "Weapons", "Items"]
        },
        
        // Quests
        Archon: {
            title: "FILTER",
            filters: ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan"]
        },

        Story: {
            title: "FILTER",
            filters: ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan"]
        },

        World: {
            title: "FILTER",
            filters: ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan"]
        },

        Hangout: {
            title: "FILTER",
            filters: ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan"]
        },

        Event: {
            title: "FILTER",
            filters: ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan"]
        },
    }
};
