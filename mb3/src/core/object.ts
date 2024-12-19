import {CRDTManager} from './crdt';
import * as Y from 'yjs';

/**
 * KnowledgeObjectData holds structured information about a knowledge entity.
 */
export interface ObjectData {
    id: string;
    title: string;
    content?: string;
    tags?: string[];
    concepts?: string[];
}

/**
 * KnowledgeObject represents a knowledge entity with metadata and content.
 * It can serialize/deserialize its state and uses a CRDTManager for collaborative edits.
 */
export class NObject {
    private crdtObject: Y.Map<any> | null = null;

    constructor(
        public data: ObjectData,
        public crdtManager: CRDTManager
    ) {
        crdtManager.id = data.id;
        this.syncCRDT();
    }

   async setContent(content: string): Promise<void> {
       this.data.content = content;
       this.syncCRDT();
    }

    private syncConcepts(): void {
        if (this.crdtObject) {
            this.crdtObject.set('concepts', JSON.stringify(this.data.concepts));
        }
    }

    getProperty<T extends keyof ObjectData>(key: T): ObjectData[T] {
        return this.data[key];
    }
   setProperty<T extends keyof ObjectData>(key: T, value: ObjectData[T]): void {
       this.data[key] = value;
       this.syncCRDT();
    }

   setConcepts(concepts: string[]): void {
       this.data.concepts = concepts;
       this.syncCRDT();
    }

    serialize(): string {
        return JSON.stringify(this.data);
    }

    deserialize(serializedData: string): void {
        const parsed = JSON.parse(serializedData);
        if (typeof parsed !== 'object' || parsed === null) {
            throw new Error(`Malformed serialized data: ${serializedData}`);
        }
        this.data = parsed as ObjectData;
        if (this.crdtObject) {
            this.crdtObject.set('data', JSON.stringify(this.data));
        }
    }

    syncCRDT(): void {
        if (!this.crdtObject) {
            this.crdtObject = this.crdtManager.createObject(this.data.id);
            this.crdtObject.observeDeep((events) => {
                events.forEach((event) => {
                    event.changes.keys.forEach((change, key) => {
                        if (change.action === 'add' || change.action === 'update') {
                            const newData = JSON.parse(this.crdtObject!.get('data'));
                            this.data = newData;
                        }
                    });
                });
            });
        }
        this.syncConcepts();
    }

    private isValidKey(key: string): key is keyof ObjectData {
        return ['id', 'docId', 'title', 'content', 'tags'].includes(key);
    }

    private isValidValue(value: any): value is ObjectData[keyof ObjectData] {
        return (
            typeof value === 'string' ||
            (Array.isArray(value) && value.every((item) => typeof item === 'string')) ||
            value === undefined
        );
    }

    private isValidObjectData(data:ObjectData): boolean {
        return (
            typeof data === 'object' &&
            data !== null &&
            (data.content === undefined || true) &&
            (data.tags === undefined || (Array.isArray(data.tags) && data.tags.every((item: any) => typeof item === 'string')))
        );
    }
}
