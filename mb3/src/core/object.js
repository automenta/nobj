/**
 * KnowledgeObject represents a knowledge entity with metadata and content.
 * It can serialize/deserialize its state and uses a CRDTManager for collaborative edits.
 */
export class NObject {
    data;
    crdtManager;
    crdtObject = null;
    constructor(data, crdtManager) {
        this.data = data;
        this.crdtManager = crdtManager;
        crdtManager.id = data.id;
        this.syncCRDT();
    }
    async setContent(content) {
        this.data.content = content;
        this.syncCRDT();
    }
    syncConcepts() {
        if (this.crdtObject) {
            this.crdtObject.set('concepts', JSON.stringify(this.data.concepts));
        }
    }
    getProperty(key) {
        return this.data[key];
    }
    setProperty(key, value) {
        this.data[key] = value;
        this.syncCRDT();
    }
    setConcepts(concepts) {
        this.data.concepts = concepts;
        this.syncCRDT();
    }
    serialize() {
        return JSON.stringify(this.data);
    }
    deserialize(serializedData) {
        const parsed = JSON.parse(serializedData);
        if (typeof parsed !== 'object' || parsed === null) {
            throw new Error(`Malformed serialized data: ${serializedData}`);
        }
        this.data = parsed;
        if (this.crdtObject) {
            this.crdtObject.set('data', JSON.stringify(this.data));
        }
    }
    syncCRDT() {
        if (!this.crdtObject) {
            this.crdtObject = this.crdtManager.createObject(this.data.id);
            this.crdtObject.observeDeep((events) => {
                events.forEach((event) => {
                    event.changes.keys.forEach((change, key) => {
                        if (change.action === 'add' || change.action === 'update') {
                            const newData = JSON.parse(this.crdtObject.get('data'));
                            this.data = newData;
                        }
                    });
                });
            });
        }
        this.syncConcepts();
    }
    isValidKey(key) {
        return ['id', 'docId', 'title', 'content', 'tags'].includes(key);
    }
    isValidValue(value) {
        return (typeof value === 'string' ||
            (Array.isArray(value) && value.every((item) => typeof item === 'string')) ||
            value === undefined);
    }
    isValidObjectData(data) {
        return (typeof data === 'object' &&
            data !== null &&
            (data.content === undefined || true) &&
            (data.tags === undefined || (Array.isArray(data.tags) && data.tags.every((item) => typeof item === 'string'))));
    }
}
//# sourceMappingURL=object.js.map