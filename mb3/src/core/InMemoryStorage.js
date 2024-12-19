/**
 * InMemoryStorage uses a Map to store objects in memory. Primarily for testing.
 */
export class InMemoryStorage {
    store = new Map();
    async save(object) {
        this.store.set(object.id, object);
    }
    async object(id) {
        return this.store.get(id);
    }
    async query(query) {
        return Array.from(this.store.values()).filter((obj) => Object.entries(query).every(([key, value]) => obj[key] === value));
    }
    async clear() {
        this.store.clear();
    }
}
//# sourceMappingURL=InMemoryStorage.js.map