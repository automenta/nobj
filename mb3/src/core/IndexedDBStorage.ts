import { Storage } from './Storage';

export class IndexedDBStorage implements Storage {
    private dbPromise: Promise<IDBDatabase> | null = null;
    private db: IDBDatabase | null = null;
    private storeName: string;

    constructor(private dbName: string = 'CollaborativeRealityEditorDB', storeName: string = 'objects') {
        this.storeName = storeName;
    }

    private async getDB(): Promise<IDBDatabase> {
        if (this.db)
            return this.db;

        if (this.dbPromise)
            return this.dbPromise;

        this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
            const request: IDBOpenDBRequest = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(new Error(`IndexedDB error: ${request.error?.message}`));

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
                this.createObjectStore(db);
                this.db = db;
            };

            request.onsuccess = (event: Event) => {
                this.db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
                resolve(this.db);
            };
        });
        return this.dbPromise;
    }

    private createObjectStore(db: IDBDatabase): void {
        const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
        this.createIndex(store, 'key', { unique: true });
    }

    private createIndex(store: IDBObjectStore, indexName: string, options: IDBIndexParameters): void {
        store.createIndex(indexName, indexName, options);
    }

    async save(key: string, value: any): Promise<void> {
        const db = await this.getDB();
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put({ key, value });
            request.onsuccess = () => resolve();
            request.onerror = (event: Event) => reject(new Error(`Error saving object: ${event}`));
        });
    }

    async load(key: string): Promise<any> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result?.value);
            request.onerror = (event: Event) => reject(new Error(`Error getting object: ${event}`));
        });
    }

    async query(query: Record<string, any>): Promise<any[]> {
        const db = await this.getDB();
        return new Promise<any[]>((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const results: any[] = [];
            const request = store.openCursor();
            request.onsuccess = (event: Event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    if (!query || this.matchesQuery(cursor.value.value, query)) results.push(cursor.value.value);
                    cursor.continue();
                } else resolve(results);
            };
            request.onerror = (event) => reject(new Error(`Error querying objects: ${event}`));
        });
    }

    async clear(): Promise<void> {
        const db = await this.getDB();
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = (event: Event) => reject(new Error(`Error clearing database: ${event}`));
        });
    }

    private matchesQuery(obj: any, query: Record<string, unknown>): boolean {
        return Object.entries(query).every(
            ([key, value]) => obj[key] === value || (Array.isArray(value) && value.includes(obj[key])),
        );
    }
}
