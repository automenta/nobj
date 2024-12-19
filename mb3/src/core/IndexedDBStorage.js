import { IndexedDBBase } from './IndexedDBBase';
export class IndexedDBStorage extends IndexedDBBase {
    constructor(dbName = 'CollaborativeRealityEditorDB', storeName = 'NObjects') {
        super(dbName, storeName);
    }
    createObjectStore(db) {
        const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
        this.createIndex(store, 'id', { unique: true });
    }
    async save(object) {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(object);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(new Error(`Error saving object: ${event}`));
        });
    }
    async object(id) {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(new Error(`Error getting object: ${event}`));
        });
    }
    async objectDelete(id) {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(new Error(`Error deleting object: ${event}`));
        });
    }
    async query(query) {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const results = [];
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (!query || this.matchesQuery(cursor.value, query))
                        results.push(cursor.value);
                    cursor.continue();
                }
                else
                    resolve(results);
            };
            request.onerror = (event) => reject(new Error(`Error querying objects: ${event}`));
        });
    }
    async clear() {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(new Error(`Error clearing database: ${event}`));
        });
    }
    matchesQuery(obj, query) {
        return Object.entries(query).every(([key, value]) => obj[key] === value || (Array.isArray(value) && value.includes(obj[key])));
    }
}
//# sourceMappingURL=IndexedDBStorage.js.map