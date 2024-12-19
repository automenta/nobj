/**
 * DataStorage defines an interface for saving, retrieving, and querying objects.
 * Implementations can be IndexedDB, in-memory, or other backends.
 */
export interface DataStorage {
    save(object: any): Promise<void>;

    object(id: string): Promise<any>;

    query(query: any): Promise<any[]>;

    clear(): Promise<void>;
}
