import { IndexedDBStorage } from './IndexedDBStorage';
import { IndexedDBYDocStorage } from './IndexedDBYDocStorage';
import { SemanticIndex } from '../match/semanticIndex';
import { Matcher } from '../match/matcher';
import { NObject } from './object';
export class DataStore {
    crdtManager;
    backend;
    ydocBackend;
    semanticIndex;
    matcher;
    constructor(crdtManager, 
    // Use default implementations if none are provided
    // This allows for dependency injection and testing
    // Also, it allows for future implementations of DataStorage and YDocStorage
    backend = new IndexedDBStorage(), ydocBackend = new IndexedDBYDocStorage(), semanticIndex = new SemanticIndex(), matcher = new Matcher(semanticIndex)) {
        this.crdtManager = crdtManager;
        this.backend = backend;
        this.ydocBackend = ydocBackend;
        this.semanticIndex = semanticIndex;
        this.matcher = matcher;
        this.initUserProfile();
    }
    // Initialize the user profile
    initUserProfile() {
        // TODO: Implement user profile initialization
    }
    async createObject(data) {
        if (!data.id) {
            throw new Error('DataStore: docId is required to create an object');
        }
        const o = new NObject(data, this.crdtManager);
        await this.save(o);
        return o;
    }
    async save(object) {
        object.syncCRDT();
        await this.backend.save({ id: object.data.id, serializedObject: object.serialize() });
        await this.updateSemanticIndex(object);
    }
    async saveUserProfile(userProfile) {
        await this.backend.save({ id: 'userProfile', serializedObject: JSON.stringify(userProfile) });
    }
    async loadUserProfile() {
        const stored = await this.backend.object('userProfile');
        return stored ? JSON.parse(stored.serializedObject) : null;
    }
    async getObject(id) {
        const obj = await this.backend.object(id);
        return obj ? this.deserializeObject(obj.serializedObject) : null;
    }
    async query(query) {
        const results = await this.backend.query(query);
        return results.map((obj) => this.deserializeObject(obj.serializedObject));
    }
    async queryByConcept(concept) {
        const objectIds = this.semanticIndex.queryByConcept(concept);
        const objects = await Promise.all(objectIds.map((id) => this.getObject(id)));
        return objects;
    }
    async matchObjects(object) {
        return this.matcher.findMatches(object.data);
    }
    async saveYDocState(docId, update) {
        return this.ydocBackend.saveYDocState(docId, update);
    }
    async loadYDocState(docId) {
        return this.ydocBackend.loadYDocState(docId);
    }
    deserializeObject(serializedObject) {
        return new NObject(JSON.parse(serializedObject), this.crdtManager);
    }
    async updateSemanticIndex(object) {
        if (object.data.content) {
            await this.semanticIndex.addAnnotationWithText({ objectId: object.data.id, text: object.data.content });
        }
    }
}
//# sourceMappingURL=datastore.js.map