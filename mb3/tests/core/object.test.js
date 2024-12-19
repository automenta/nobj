import { expect, it } from 'vitest';
import { NObject } from '@/core/object';
import { CRDTManager } from '@/core/crdt';
import { DataStore } from '@/core/datastore';
import { InMemoryStorage } from '@/core/InMemoryStorage';
import { IndexedDBYDocStorage } from '@/core/IndexedDBYDocStorage';
const mockDataStore = new DataStore(crdt(), new InMemoryStorage(), new IndexedDBYDocStorage());
function crdt() {
    const c = new CRDTManager();
    c.dataStore = mockDataStore;
    return c;
}
it('should create an object with initial data', () => {
    const obj = new NObject({ id: 'test1', title: 'Test' }, crdt());
    expect(obj).toBeDefined();
    expect(obj.getProperty('title')).toBe('Test');
});
it('should modify object properties correctly', () => {
    const obj = new NObject({ id: 'test2', title: 'Initial' }, crdt());
    obj.setProperty('title', 'Updated');
    expect(obj.getProperty('title')).toBe('Updated');
});
it('should serialize and deserialize object data accurately', () => {
    const obj = new NObject({ id: 'test3', title: 'Serialize Test' }, crdt());
    const serialized = obj.serialize();
    const newObj = new NObject({ title: '', id: 'test3' }, crdt());
    newObj.deserialize(serialized);
    expect(newObj.getProperty('title')).toBe('Serialize Test');
});
it('should handle malformed serialized data', () => {
    const obj = new NObject({ id: 'test4', title: '' }, crdt());
    expect(() => {
        obj.deserialize('malformed data');
    }).toThrow();
});
//# sourceMappingURL=object.test.js.map