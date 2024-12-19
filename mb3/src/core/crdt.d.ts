import * as Y from 'yjs';
import { Peer } from './p2p';
import { DataStore } from './datastore';
/**
 * CRDTManager wraps a Y.Doc for collaborative editing.
 * It provides methods to create CRDT-backed objects, merge updates, and handle updates.
 */
export declare class CRDTManager {
    readonly doc: Y.Doc;
    id: string;
    private objects;
    private peer;
    dataStore: DataStore;
    constructor();
    private handleDocUpdate;
    private syncFromStorage;
    private sendUpdateToPeers;
    private saveUpdateToDataStore;
    onUpdate(callback: (update: Uint8Array) => void): void;
    createObject(id: string): Y.Map<any>;
    getObject(type: string): Y.Map<any> | undefined;
    hasObject(type: string): boolean;
    destroyObject(id: string): void;
    getDocUpdate(): Uint8Array;
    merge(update: Uint8Array): void;
    connect(peer: Peer): void;
    disconnect(): void;
}
