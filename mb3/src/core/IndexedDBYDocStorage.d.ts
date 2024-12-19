import { YDocStorage } from './YDocStorage';
import { IndexedDBBase } from './IndexedDBBase';
export declare class IndexedDBYDocStorage extends IndexedDBBase implements YDocStorage {
    constructor(dbName?: string, storeName?: string);
    protected createObjectStore(db: IDBDatabase): void;
    saveYDocState(docId: string, update: Uint8Array): Promise<void>;
    loadYDocState(docId: string): Promise<Uint8Array>;
}
