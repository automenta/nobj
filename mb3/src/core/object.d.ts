import { CRDTManager } from './crdt';
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
export declare class NObject {
    data: ObjectData;
    crdtManager: CRDTManager;
    private crdtObject;
    constructor(data: ObjectData, crdtManager: CRDTManager);
    setContent(content: string): Promise<void>;
    private syncConcepts;
    getProperty<T extends keyof ObjectData>(key: T): ObjectData[T];
    setProperty<T extends keyof ObjectData>(key: T, value: ObjectData[T]): void;
    setConcepts(concepts: string[]): void;
    serialize(): string;
    deserialize(serializedData: string): void;
    syncCRDT(): void;
    private isValidKey;
    private isValidValue;
    private isValidObjectData;
}
