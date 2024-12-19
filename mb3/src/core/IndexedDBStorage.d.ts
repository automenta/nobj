import { DataStorage } from './DataStorage';
import { IndexedDBBase } from './IndexedDBBase';
export declare class IndexedDBStorage extends IndexedDBBase implements DataStorage {
    constructor(dbName?: string, storeName?: string);
    protected createObjectStore(db: IDBDatabase): void;
    save(object: any): Promise<void>;
    object(id: string): Promise<any>;
    objectDelete(id: string): Promise<void>;
    query(query: Record<string, any>): Promise<any[]>;
    clear(): Promise<void>;
    private matchesQuery;
}
