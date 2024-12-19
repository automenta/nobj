import * as Y from 'yjs';
import { DataStore } from './datastore';
/**
 * CRDTManager wraps a Y.Doc for collaborative editing.
 * It provides methods to create CRDT-backed objects, merge updates, and handle updates.
 */
export class CRDTManager {
    doc;
    id;
    // Map of object IDs to Y.Map instances
    objects = new Map();
    peer = null;
    dataStore;
    constructor() {
        this.id = 'unknown';
        this.doc = new Y.Doc();
        this.doc.on('update', this.handleDocUpdate.bind(this));
        this.dataStore = new DataStore(this);
        this.syncFromStorage();
    }
    handleDocUpdate = (update) => {
        this.sendUpdateToPeers(update);
        this.saveUpdateToDataStore(update);
    };
    async syncFromStorage() {
        const savedDoc = await this.dataStore.loadYDocState(this.id);
        if (savedDoc) {
            try {
                Y.applyUpdate(this.doc, savedDoc);
            }
            catch (e) {
                console.error(`Error applying stored update for docId ${this.id}`, e);
            }
        }
    }
    sendUpdateToPeers(update) {
        if (this.peer) {
            this.peer.sendMessage(update);
        }
    }
    saveUpdateToDataStore(update) {
        if (this.dataStore) {
            this.dataStore.saveYDocState(this.id, update);
        }
    }
    onUpdate(callback) {
        this.doc.on('update', (update) => callback(update));
    }
    createObject(id) {
        const object = this.doc.getMap(id);
        this.objects.set(id, object);
        return object;
    }
    getObject(type) {
        return this.objects.get(type);
    }
    hasObject(type) {
        return this.objects.has(type);
    }
    destroyObject(id) {
        const object = this.objects.get(id);
        if (object) {
            object.clear();
            this.objects.delete(id);
        }
    }
    getDocUpdate() {
        return Y.encodeStateAsUpdate(this.doc);
    }
    merge(update) {
        try {
            Y.applyUpdate(this.doc, update);
        }
        catch (error) {
            console.error('Error merging update:', error);
        }
    }
    connect(peer) {
        this.peer = peer;
        this.peer.provider.on('update', (message) => {
            try {
                Y.applyUpdate(this.doc, message);
            }
            catch (error) {
                console.error('Error applying peer update:', error);
            }
        });
        this.peer.provider.on('synced', (isSynced) => {
            if (isSynced)
                console.log(`CRDT document ${this.id} synced with peer`);
        });
    }
    disconnect() {
        if (this.peer) {
            this.peer.disconnect();
            this.peer = null;
        }
    }
}
//# sourceMappingURL=crdt.js.map