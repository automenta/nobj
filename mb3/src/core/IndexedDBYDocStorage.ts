import {YDocStorage} from './YDocStorage';
import {IndexedDBBase} from './IndexedDBBase';

export class IndexedDBYDocStorage extends IndexedDBBase implements YDocStorage {
    constructor(dbName: string = 'YDocsDB', storeName: string = 'YDocs') {
        super(dbName, storeName);
    }

    protected createObjectStore(db: IDBDatabase): void {
        const store = db.createObjectStore(this.storeName, { keyPath: 'docId' });
        this.createIndex(store, 'docId', { unique: true });
    }

    async saveYDocState(docId: string, update: Uint8Array): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            let r = objectStore.put({ docId, update });
            r.onsuccess = () => resolve();
            r.onerror = (event) => reject(new Error(`Error saving YDoc state: ${event}`));
        });
    }

    async loadYDocState(docId: string): Promise<Uint8Array> {
        const db = await this.getDB();
        return new Promise((resolve, reject): void => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            let r = store.get(docId);
            r.onsuccess = () => {
                const rr = r.result;
                if (rr) resolve(rr.update);
                else resolve(null);
            };
            r.onerror = (event) => reject(new Error(`Error loading YDoc state: ${event}`));
        });
    }
}
