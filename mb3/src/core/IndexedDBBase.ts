export abstract class IndexedDBBase {
    private dbPromise: Promise<IDBDatabase> | null = null;
    protected db: IDBDatabase | null = null; // Store the db instance

    constructor(
        protected dbName: string,
        protected storeName: string,
    ) {}

    protected async getDB(): Promise<IDBDatabase> {
        if (this.db)
            return this.db;

        if (this.dbPromise)
            return this.dbPromise;

        this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
            const request: IDBOpenDBRequest = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(new Error(`IndexedDB error: ${request.error?.message}`));

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                this.createObjectStore(this.db = (event.target as IDBOpenDBRequest).result as IDBDatabase);
            };

            request.onsuccess = (event: Event) => {
                resolve(this.db = (event.target as IDBOpenDBRequest).result as IDBDatabase);
            };
        });
        return this.dbPromise;
    }

    protected abstract createObjectStore(db: IDBDatabase): void;

    protected createIndex(store: IDBObjectStore, indexName: string, options: IDBIndexParameters): void {
        store.createIndex(indexName, indexName, options);
    }
}
