/**
 * DataStore provides a high-level abstraction over the selected storage backend.
 */
import {CRDTManager} from './crdt';
import {IndexedDBStorage} from './IndexedDBStorage';
import {IndexedDBYDocStorage} from './IndexedDBYDocStorage';
import {SemanticIndex} from '../match/semanticIndex';
import {Matcher} from '../match/matcher';
import {NObject} from './object';
import {UserProfile} from './user';
import {DataStorage} from "@/core/DataStorage.ts";
import {YDocStorage} from "@/core/YDocStorage.ts";

export class DataStore {
    constructor(
        private readonly crdtManager: CRDTManager,
        // Use default implementations if none are provided
        // This allows for dependency injection and testing
        // Also, it allows for future implementations of DataStorage and YDocStorage
        private backend: DataStorage = new IndexedDBStorage(),
        private ydocBackend: YDocStorage = new IndexedDBYDocStorage(),
        private semanticIndex: SemanticIndex = new SemanticIndex(),
        private matcher: Matcher = new Matcher(semanticIndex),
    ) {
        this.initUserProfile();
    }
    // Initialize the user profile
    private initUserProfile() {
        // TODO: Implement user profile initialization
    }

    async createObject(data: any): Promise<NObject> {
        if (!data.id) {
            throw new Error('DataStore: docId is required to create an object');
        }
        const o = new NObject(data, this.crdtManager);
        await this.save(o);
        return o;
    }
    async save(object: NObject): Promise<void> {
        object.syncCRDT();
        await this.backend.save({ id: object.data.id, serializedObject: object.serialize() });
        await this.updateSemanticIndex(object);
    }

    async saveUserProfile(userProfile: UserProfile): Promise<void> {
        await this.backend.save({ id: 'userProfile', serializedObject: JSON.stringify(userProfile) });
    }

    async loadUserProfile(): Promise<UserProfile | null> {
        const stored = await this.backend.object('userProfile');
        return stored ? JSON.parse(stored.serializedObject) : null;
    }

    async getObject(id: string): Promise<NObject | null> {
        const obj = await this.backend.object(id);
        return obj ? this.deserializeObject(obj.serializedObject) : null;
    }

    async query(query: any): Promise<NObject[]> {
        const results = await this.backend.query(query);
        return results.map((obj) => this.deserializeObject(obj.serializedObject));
    }

    async queryByConcept(concept: string): Promise<NObject[]> {
        const objectIds = this.semanticIndex.queryByConcept(concept);
        const objects = await Promise.all(objectIds.map((id) => this.getObject(id)));
        return objects as NObject[];
    }

    async matchObjects(object: NObject): Promise<any[]> {
        return this.matcher.findMatches(object.data);
    }

    async saveYDocState(docId: string, update: Uint8Array): Promise<void> {
        return this.ydocBackend.saveYDocState(docId, update);
    }

    async loadYDocState(docId: string): Promise<Uint8Array | null> {
        return this.ydocBackend.loadYDocState(docId);
    }

    deserializeObject(serializedObject: string): NObject {
        return new NObject(JSON.parse(serializedObject), this.crdtManager);
    }

    private async updateSemanticIndex(object: NObject): Promise<void> {
        if (object.data.content) {
            await this.semanticIndex.addAnnotationWithText({ objectId: object.data.id, text: object.data.content });
        }
    }
}
