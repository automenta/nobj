import * as indexeddb from 'fake-indexeddb';

global.indexedDB = indexeddb as unknown as IDBFactory;
