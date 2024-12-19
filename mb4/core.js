import {EventEmitter} from 'events';
import * as Y from 'yjs';
import {IndexeddbPersistence} from 'y-indexeddb';
import 'fake-indexeddb/auto'; // In-Memory IndexedDB for Node.js environment
import {v4 as uuidv4} from 'uuid';

function generateUUID() {
    return uuidv4();
}

class Core extends EventEmitter {

    constructor() {
        super();
        this.ydoc = new Y.Doc();
        new Core.Data.IndexedDBStorage('collab-editor', this.ydoc); // Use inner class

        this.objects = new Core.Data.ObjectModel(this.ydoc);
        this.objects.core = this;
        this.user = new Core.Data.UserModel(this.ydoc);
        this.schemas = new Core.Data.SchemaModel(this.ydoc);
        this.schemas.core = this;
        this.schemas.loadSchemas();
        this.analyzers = [];
        this.networks = [];
        this.plugins = new Core.Plugins(this);
        this.observeData();
        //this.loadPlugins('analyzers'); // Not needed for outline
        //this.loadPlugins('networks'); // Not needed for outline
    }

    // #region Data Observation
    observeData() {
        this.objects.observeDeep((events, transaction) =>
            events.forEach(event => {
                if (event.changes.keys.size > 0) {
                    event.changes.keys.forEach((change, key) => {
                        const obj = this.objects.get(key);
                        if (obj) {
                            if (change.action === 'add' || change.action === 'update') {
                                if (obj.has('inReplyTo')) {
                                    const targetObjId = obj.get('inReplyTo');
                                    const targetObjAuthor = this.objects.get(targetObjId)?.get('author');
                                    this.emit('notify', targetObjAuthor === this.me() ? `Your object ${targetObjId} was modified` : `New reply received on object: ${targetObjId}`);
                                } else if (obj.get('author') !== this.me()) {
                                    this.emit('notify', `Object ${obj.get('id')} was modified`);
                                }

                                this.runAnalyzers(obj);
                            }
                        }
                    });
                }
            }));
    }

    // #region Object Operations
    async newObject(content, isPrivate = true, inReplyTo = null) {
        const objectId = this.objects.create(content, this.me(), isPrivate, inReplyTo);
        const obj = this.objects.get(objectId);

        await this.runAnalyzers(obj);
        return objectId;
    }

    updateObject(objectId, newContent) {
        const obj = this.objects.get(objectId)
        if (obj?.get('author') === this.me()) {
            this.objects.update(objectId, newContent);
            this.runAnalyzers(obj);
        }
    }

    deleteObject(objectId) {
        if (this.objects.get(objectId)?.get('author') === this.me())
            this.objects.delete(objectId);
    }

    get(id) { return this.objects.get(id); }

    // #region User Operations
    userData() { return this.user.toJSON(); }
    updateUser(key, value) { this.user.set(key, value); }
    me() { return this.user.me(); }

    // #region Analyzers
    async runAnalyzers(obj) {
        for (const analyzer of this.getEnabledPlugins('analyzers')) {
            try {
                await analyzer.run(obj);
            } catch (error) {
                console.error(`Error running analyzer ${analyzer.constructor.name}:`, error);
            }
        }
    }
}

class DataModel extends EventEmitter {
    constructor(doc, collectionName) {
        super();
        this.doc = doc;
        this.collection = this.doc.getMap(collectionName);
    }

    forEach(f) { this.collection.forEach(f); }
    get(key) { return this.collection.get(key); }
    set(key, value) { this.collection.set(key, value); }
    delete(key) { this.collection.delete(key); }
    observe(callback) { this.collection.observe(callback); }
    observeDeep(callback) { this.collection.observeDeep(callback); }
    keys() { return this.collection.keys(); }
    toJSON() { return this.collection.toJSON(); }
}

// #region Data Module (Inner Class of Core)
Core.Data = {
    IndexedDBStorage: class {
        constructor(dbName, ydoc) {
            this.provider = new IndexeddbPersistence(dbName, ydoc);
        }
    },

    ObjectModel: class extends DataModel {
        constructor(doc) {
            super(doc, 'objects');
        }

        create(content, author, isPrivate = true, inReplyTo = null) {
            const id = generateUUID();
            const newObj = new Y.Map();
            newObj.set('id', id);
            newObj.set('author', author);
            newObj.set('content', content);
            newObj.set('isPrivate', isPrivate);
            newObj.set('timestamp', Date.now());
            newObj.set('replies', []);
            newObj.set('schema', 'default');

            if (inReplyTo) {
                newObj.set('inReplyTo', inReplyTo);
                const parentObj = this.get(inReplyTo);
                if (parentObj) {
                    const parentReplies = parentObj.get('replies') || [];
                    parentReplies.push(id);
                    parentObj.set('replies', parentReplies);
                }
            }
            this.set(id, newObj);
            return id;
        }

        update(id, content) {
            const obj = this.get(id);
            if (obj) obj.set('content', content);
        }

        validate(object, schemaName) {
            const schema = this.core.schemas.get(schemaName);
            if (!schema) return false;

            for (const field of schema.required) {
                if (!object.has(field)) {
                    return false;
                }
            }
            return true;
        }
    },

    SchemaModel: class extends DataModel {
        constructor(doc) {
            super(doc, 'schemas');
        }

        loadSchemas(schemasDir = './schemas') {
            //For now, lets just add a dummy default schema
            const schemaData = {
                "type": "object",
                "required": ["id", "content"],
                "properties": {
                    "id": {"type": "string"},
                    "content": {"type": "string"}
                }
            }
            const schemaName = "default";

            this.set(schemaName, schemaData);
            console.log(`Loaded schema: ${schemaName}`);
        }
    },

    UserModel: class extends DataModel {
        constructor(doc) {
            super(doc, 'user');
            const id = generateUUID(), name = `Anonymous-${Math.floor(Math.random() * 1000)}`;
            if (!this.me()) {
                this.set('id', id);
                this.set('name', name);
                this.set('profile', {});
            }
        }

        me() { return this.get('id'); }

        getProfile() { return this.get('profile'); }

        setProfile(profileData) { this.set('profile', profileData); }
    }
}

export default Core;