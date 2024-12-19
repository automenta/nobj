import 'fake-indexeddb/auto';
import { IndexedDBStorage } from '@/core/IndexedDBStorage';
import { NObject } from '@/core/object';
import { CRDTManager } from '@/core/crdt';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataStore } from '@/core/datastore';
import { InMemoryStorage } from '@/core/InMemoryStorage';
import { IndexedDBYDocStorage } from '@/core/IndexedDBYDocStorage';
const mockDataStore = new DataStore(crdt(), new InMemoryStorage(), new IndexedDBYDocStorage());
function crdt() {
    const c = new CRDTManager();
    c.dataStore = mockDataStore;
    return c;
}
describe('IndexedDBStorage', () => {
    let storage;
    beforeEach(async () => {
        storage = new IndexedDBStorage();
        await storage.clear();
    });
    afterEach(async () => {
        await storage.clear();
    });
    it('should save and retrieve an object', async () => {
        const data = { id: 'testDocId', title: 'Test Object' };
        const obj = new NObject(data, crdt());
        await storage.save(obj);
        const retrievedObj = await storage.object('testDocId');
        expect(retrievedObj).toEqual(obj.data);
    });
    // Add more tests for queryObjects and other scenarios here
});
//# sourceMappingURL=IndexedDBStorage.test.js.map