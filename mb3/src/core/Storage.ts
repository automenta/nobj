/**
 * Storage defines an interface for saving, retrieving, and querying data.
 */
export interface Storage {
    save(key: string, value: any): Promise<void>;
    load(key: string): Promise<any | null>;
    query(query: Record<string, any>): Promise<any[]>;
    clear(): Promise<void>;
}
/**
 * Storage defines an interface for saving, retrieving, and querying data.
 */
export interface Storage {
    save(key: string, value: any): Promise<void>;
    load(key: string): Promise<any | null>;
    query(query: Record<string, any>): Promise<any[]>;
    clear(): Promise<void>;
}
