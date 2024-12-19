import { Storage } from './Storage';

export class InMemoryStorage implements Storage {
    private store: Map<string, any> = new Map();

    async save(key: string, value: any): Promise<void> {
        this.store.set(key, value);
    }

    async load(key: string): Promise<any> {
        return this.store.get(key) || null;
    }

    async query(query: Record<string, any>): Promise<any[]> {
         return Array.from(this.store.values()).filter((obj) =>
            Object.entries(query).every(
                ([key, value]) => obj[key] === value || (Array.isArray(value) && value.includes(obj[key])),
            ),
        );
    }

    async clear(): Promise<void> {
        this.store.clear();
    }
}
