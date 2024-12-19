/**
 * DataStore provides a high-level abstraction over the selected storage backend.
 */
import { CRDTManager } from './crdt';
import { SemanticIndex } from '../match/semanticIndex';
import { Matcher } from '../match/matcher';
import { NObject } from './object';
import { UserProfile } from './user';
import { DataStorage } from "@/core/DataStorage.ts";
import { YDocStorage } from "@/core/YDocStorage.ts";
export declare class DataStore {
    private readonly crdtManager;
    private backend;
    private ydocBackend;
    private semanticIndex;
    private matcher;
    constructor(crdtManager: CRDTManager, backend?: DataStorage, ydocBackend?: YDocStorage, semanticIndex?: SemanticIndex, matcher?: Matcher);
    private initUserProfile;
    createObject(data: any): Promise<NObject>;
    save(object: NObject): Promise<void>;
    saveUserProfile(userProfile: UserProfile): Promise<void>;
    loadUserProfile(): Promise<UserProfile | null>;
    getObject(id: string): Promise<NObject | null>;
    query(query: any): Promise<NObject[]>;
    queryByConcept(concept: string): Promise<NObject[]>;
    matchObjects(object: NObject): Promise<any[]>;
    saveYDocState(docId: string, update: Uint8Array): Promise<void>;
    loadYDocState(docId: string): Promise<Uint8Array | null>;
    deserializeObject(serializedObject: string): NObject;
    private updateSemanticIndex;
}
