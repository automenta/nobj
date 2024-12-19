import { describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { DataStore } from '@/core/datastore';
import { InMemoryStorage } from '@/core/InMemoryStorage';
import { CRDTManager } from '@/core/crdt';
import { IndexedDBYDocStorage } from '@/core/IndexedDBYDocStorage';
const mockDataStore = new DataStore(newManager(), new InMemoryStorage(), new IndexedDBYDocStorage());
function newManager() {
    const c = new CRDTManager();
    c.dataStore = mockDataStore;
    return c;
}
describe('CRDTManager', () => {
    it('should initialize a new Y.Doc', () => {
        const crdt = newManager();
        expect(crdt).toBeDefined();
    });
    it('should create a Y.Map object', () => {
        const crdt = newManager();
        const obj = crdt.createObject('myObject');
        expect(obj).toBeInstanceOf(Y.Map);
        obj.set('key1', 'value1');
        expect(obj.get('key1')).toBe('value1');
    });
    it('should merge updates from another CRDTManager', () => {
        // Create two CRDTManager instances
        const crdt1 = newManager();
        const crdt2 = newManager();
        // Create a shared object in each instance
        const obj1 = crdt1.createObject('myObject');
        const obj2 = crdt2.createObject('myObject');
        // Make changes to the object in each instance
        obj1.set('key1', 'value1');
        obj2.set('key2', 'value2');
        // Get the docUpdate from crdt1
        const update = crdt1.getDocUpdate();
        // Merge the update into crdt2
        crdt2.merge(update);
        // Verify that the changes are merged
        expect(obj2.get('key1')).toBe('value1');
        expect(obj2.get('key2')).toBe('value2');
    });
    it('should return a non-empty docUpdate after changes', () => {
        const crdt = newManager();
        const obj = crdt.createObject('myObject');
        // Make a change
        obj.set('key1', 'value1');
        // Get the docUpdate
        const update = crdt.getDocUpdate();
        // Verify that the update is not empty
        expect(update).toBeInstanceOf(Uint8Array);
        expect(update.length).toBeGreaterThan(0);
    });
    it('should destroy a Y.Map object', () => {
        const crdt = newManager();
        crdt.createObject('myObject');
        expect(crdt.hasObject('myObject')).toBe(true); // Verify object exists
        crdt.destroyObject('myObject');
        expect(crdt.hasObject('myObject')).toBe(false); // Verify object is destroyed
    });
    it('should handle destroying a non-existent object', () => {
        const crdt = newManager();
        expect(() => crdt.destroyObject('nonExistentObject')).not.toThrow(); // No error should be thrown
    });
    it('should call onUpdate callback with the update', () => {
        const crdt = newManager();
        const obj = crdt.createObject('myObject');
        // Mock the callback function
        const callback = vi.fn();
        // Register the callback
        crdt.onUpdate(callback);
        // Make a change
        obj.set('key1', 'value1');
        // Get the docUpdate (for comparison)
        crdt.getDocUpdate();
        // Expect the callback to have been called once
        expect(callback).toHaveBeenCalledTimes(1);
        // Expect the callback to have been called with the update
        const calledWith = callback.mock.calls[0][0];
        expect(calledWith).toBeInstanceOf(Uint8Array);
        // Note: This is a basic check. A more robust check would compare the contents of the update.
        expect(calledWith.length).toBeGreaterThan(0);
    });
    it('should retrieve existing Y.Map objects', () => {
        const crdt = newManager();
        crdt.createObject('existingObject');
        const obj = crdt.getObject('existingObject');
        expect(obj).toBeInstanceOf(Y.Map);
    });
    it('should return undefined when retrieving non-existent objects', () => {
        const crdt = newManager();
        const obj = crdt.getObject('nonExistentObject');
        expect(obj).toBeUndefined();
    });
    it('should clear the object when destroyed', () => {
        const crdt = newManager();
        const obj = crdt.createObject('myObject');
        obj.set('key1', 'value1'); // Add some data
        crdt.destroyObject('myObject');
        expect(obj.size).toBe(0); // Check if the object is cleared
    });
    it('should call onUpdate callback whenever the document updates', () => {
        const crdt = newManager();
        const obj = crdt.createObject('myObject');
        const callback = vi.fn();
        crdt.onUpdate(callback);
        obj.set('key', 'value'); // Trigger an update
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(expect.any(Uint8Array));
    });
});
//# sourceMappingURL=crdt.test.js.map