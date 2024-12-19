export declare abstract class IndexedDBBase {
    protected dbName: string;
    protected storeName: string;
    private dbPromise;
    protected db: IDBDatabase | null;
    constructor(dbName: string, storeName: string);
    protected getDB(): Promise<IDBDatabase>;
    protected abstract createObjectStore(db: IDBDatabase): void;
    protected createIndex(store: IDBObjectStore, indexName: string, options: IDBIndexParameters): void;
}
