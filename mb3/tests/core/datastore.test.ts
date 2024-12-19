import 'fake-indexeddb/auto';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {DataStore} from '@/core/datastore';
import {IndexedDBStorage} from '@/core/IndexedDBStorage';
import {NObject, ObjectData} from '@/core/object';
import {CRDTManager} from '@/core/crdt';

describe('DataStore with IndexedDBStorage', () => {
    const crdtManager = new CRDTManager();
    let dataStore: DataStore;
    let indexedDBStorage: IndexedDBStorage;

    beforeEach(async () => {
        indexedDBStorage = new IndexedDBStorage();
        dataStore = new DataStore(crdtManager, indexedDBStorage);
        await indexedDBStorage.clear();
    });

    afterEach(async () => {
        await indexedDBStorage.clear();
    });

    it('should save and retrieve a NObject', async () => {
        const obj = new NObject({ id: 'obj1', title: 'Test Object', content: 'Test content' }, crdtManager);
        await dataStore.save(obj);

        const retrieved = await dataStore.getObject('obj1');
        expect(retrieved).toBeInstanceOf(NObject);
        expect(retrieved?.data).toEqual(obj.data);
    });

    it('should create an object', async () => {
        const newObjData: ObjectData = { id: 'new_obj', title: 'New Object' };
        const newObj = await dataStore.createObject(newObjData);
        expect(newObj).toBeInstanceOf(NObject);
        expect(newObj.data).toEqual(newObjData);

        const retrievedObj = await dataStore.getObject('new_obj');
        expect(retrievedObj).toBeInstanceOf(NObject);
        expect(retrievedObj?.data).toEqual(newObjData);
    });

    it('should retrieve an object', async () => {
        const obj = new NObject({ id: 'obj1', title: 'Test Object' }, crdtManager);
        await dataStore.save(obj);
        const retrieved = await dataStore.getObject('obj1');
        expect(retrieved).toBeInstanceOf(NObject);
        expect(retrieved?.data).toEqual(obj.data);
    });

    it('should return null if object does not exist', async () => {
        const retrieved = await dataStore.getObject('nonexistent');
        expect(retrieved).toBeNull();
    });
});
