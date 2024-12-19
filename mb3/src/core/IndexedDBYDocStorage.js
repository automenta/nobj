import { IndexedDBBase } from './IndexedDBBase';
export class IndexedDBYDocStorage extends IndexedDBBase {
    constructor(dbName = 'YDocsDB', storeName = 'YDocs') {
        super(dbName, storeName);
    }
    createObjectStore(db) {
        const store = db.createObjectStore(this.storeName, { keyPath: 'docId' });
        this.createIndex(store, 'docId', { unique: true });
    }
    async saveYDocState(docId, update) {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            let r = objectStore.put({ docId, update });
            r.onsuccess = () => resolve();
            r.onerror = (event) => reject(new Error(`Error saving YDoc state: ${event}`));
        });
    }
    async loadYDocState(docId) {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            let r = store.get(docId);
            r.onsuccess = () => {
                const rr = r.result;
                if (rr)
                    resolve(rr.update);
                else
                    resolve(null);
            };
            r.onerror = (event) => reject(new Error(`Error loading YDoc state: ${event}`));
        });
    }
}
//# sourceMappingURL=IndexedDBYDocStorage.js.map