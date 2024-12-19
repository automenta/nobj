import * as Y from 'yjs';
import { Peer } from './p2p';

export class CRDTManager {
    readonly doc: Y.Doc;
    public id: string;
    private objects: Map<string, Y.Map<any>> = new Map();
    private peer: Peer | null = null;

    constructor() {
        this.id = 'unknown';
        this.doc = new Y.Doc();
        this.doc.on('update', this.handleDocUpdate.bind(this));
    }

    private handleDocUpdate = (update: Uint8Array): void => {
        this.sendUpdateToPeers(update);
    };

    private sendUpdateToPeers(update: Uint8Array): void {
        if (this.peer) {
            this.peer.sendMessage(update);
        }
    }

    onUpdate(callback: (update: Uint8Array) => void): void {
        this.doc.on('update', (update) => callback(update));
    }

    createObject(id: string): Y.Map<any> {
        const object = this.doc.getMap<any>(id);
        this.objects.set(id, object);
        return object;
    }

    getObject(type: string): Y.Map<any> | undefined {
        return this.objects.get(type);
    }

    hasObject(type: string): boolean {
        return this.objects.has(type);
    }

    destroyObject(id: string): void {
        const object = this.objects.get(id);
        if (object) {
            object.clear();
            this.objects.delete(id);
        }
    }

    getDocUpdate(): Uint8Array {
        return Y.encodeStateAsUpdate(this.doc);
    }

    merge(update: Uint8Array): void {
        try {
            Y.applyUpdate(this.doc, update);
        } catch (error) {
            console.error('Error merging update:', error);
        }
    }

    connect(peer: Peer): void {
        this.peer = peer;
        this.peer.provider.on('sync', (isSynced: boolean) => {
            if (isSynced) console.log(`CRDT document ${this.id} synced with peer`);
        });
    }

    disconnect(): void {
        if (this.peer) {
            this.peer.disconnect();
            this.peer = null;
        }
    }
}
