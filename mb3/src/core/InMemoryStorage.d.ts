import { DataStorage } from './DataStorage';
/**
 * InMemoryStorage uses a Map to store objects in memory. Primarily for testing.
 */
export declare class InMemoryStorage implements DataStorage {
    private store;
    save(object: any): Promise<void>;
    object(id: string): Promise<any>;
    query(query: any): Promise<any[]>;
    clear(): Promise<void>;
}
