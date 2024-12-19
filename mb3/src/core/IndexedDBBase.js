export class IndexedDBBase {
    dbName;
    storeName;
    dbPromise = null;
    db = null; // Store the db instance
    constructor(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
    }
    async getDB() {
        if (this.db)
            return this.db;
        if (this.dbPromise)
            return this.dbPromise;
        this.dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onerror = () => reject(new Error(`IndexedDB error: ${request.error?.message}`));
            request.onupgradeneeded = (event) => {
                this.createObjectStore(this.db = event.target.result);
            };
            request.onsuccess = (event) => {
                resolve(this.db = event.target.result);
            };
        });
        return this.dbPromise;
    }
    createIndex(store, indexName, options) {
        store.createIndex(indexName, indexName, options);
    }
}
//# sourceMappingURL=IndexedDBBase.js.map