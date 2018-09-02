import * as sqlite3 from 'better-sqlite3';

export default class Database {
    private db: sqlite3;
    
    constructor() {
        this.db = new sqlite3("food.db");

        this.setup();
    }

    setup() {
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS "FoodCategories" (
                'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                'name' TEXT NOT NULL
            )
        `).run();

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS "Items" (
                'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                'name' TEXT NOT NULL,
                'upc' INTEGER NOT NULL UNIQUE,
                'imageUrl' TEXT,
                'lastSeenPrice' REAL,
                'detailImageUrl' TEXT,
                'brandName' TEXT NOT NULL,
                'itemSize' REAL,
                'itemSizeType' TEXT,
                'foodCategoryId' INTEGER,
                FOREIGN KEY('foodCategoryId') REFERENCES 'FoodCategories'('id')
            )
        `).run();

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS "FoodCategoriesFavorites" (
                'foodCategoryId' INTEGER NOT NULL UNIQUE,
                'itemId' INTEGER NOT NULL,
                FOREIGN KEY('foodCategoryId') REFERENCES 'FoodCategories'('id'),
                FOREIGN KEY('itemId') REFERENCES 'Items'('id'),
                PRIMARY KEY('foodCategoryId','itemId')
            )
        `).run();

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS "Inventory" (
                'itemId' INTEGER,
                'units' REAL NOT NULL,
                'location' TEXT,
                'dateObtained' INTEGER,
                FOREIGN KEY('itemId') REFERENCES 'Inventory'('itemId'),
                PRIMARY KEY('itemId')
            )
        `).run();

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS "Recipes" (
                'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                'name' TEXT NOT NULL UNIQUE,
                'imageUrl' TEXT,
                'description' TEXT,
                'servingSize' REAL
            )
        `).run();

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS "RecipeSteps" (
                'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                'recipeId' INTEGER NOT NULL,
                'step' INTEGER NOT NULL,
                'description' TEXT,
                'foodCategoryId' INTEGER,
                'type' TEXT,
                'duration' REAL,
                'quantity' REAL,
                FOREIGN KEY('recipeId') REFERENCES 'Recipes'('id')
            )
        `).run();
    }

    get(): sqlite3 {
        return this.db;
    }

    patch(table: string, id: string, params: Object) {
        let setString = "";

        for(let key in params) {
            setString += `${key} = $${key},`;
        }

        setString = setString.substring(0, setString.length - 1);

        let query = `UPDATE ${table}
            SET ${setString}
            WHERE id == ${id}
        `;

        console.log(query);

        return this.db.prepare(query);
    }
}