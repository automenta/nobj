import * as Y from 'yjs';

/**
 * synchronizeDocs exchanges updates between two Yjs documents, merging their states.
 */
export function synchronizeDocs(doc1: Y.Doc, doc2: Y.Doc): void {
    const update1 = Y.encodeStateAsUpdate(doc1);
    const update2 = Y.encodeStateAsUpdate(doc2);
    Y.applyUpdate(doc1, update2);
    Y.applyUpdate(doc2, update1);
}
