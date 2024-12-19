import { expect, it } from 'vitest';
import * as Y from 'yjs';
import { synchronizeDocs } from '@/core/sync';
it('sync should exchange updates', () => {
    const doc1 = new Y.Doc();
    const doc2 = new Y.Doc();
    const map1 = doc1.getMap('testMap');
    const map2 = doc2.getMap('testMap');
    map1.set('key1', 'value1');
    map2.set('key2', 'value2');
    synchronizeDocs(doc1, doc2);
    expect(map1.get('key2')).toBe('value2');
    expect(map2.get('key1')).toBe('value1');
});
//# sourceMappingURL=sync.test.js.map