import {describe, expect, it} from 'vitest';
import {InMemoryStorage} from '@/core/InMemoryStorage';

describe('InMemoryStorage', () => {
    it('should save and retrieve an object', async () => {
        const storage = new InMemoryStorage();
        const obj = {
            id: 'test1',
            value: 'test',
        };
        await storage.save(obj);
        const retrieved = await storage.object('test1');
        expect(retrieved).toEqual(obj);
    });

    it('should query objects', async () => {
        const storage = new InMemoryStorage();
        const obj1 = {
            id: 'test1',
            type: 'A',
        };
        const obj2 = {
            id: 'test2',
            type: 'B',
        };
        await storage.save(obj1);
        await storage.save(obj2);
        const results = await storage.query({ type: 'A' });
        expect(results).toEqual([obj1]);
    });

    it('should return undefined if object does not exist', async () => {
        const storage = new InMemoryStorage();
        const retrieved = await storage.object('nonexistent');
        expect(retrieved).toBeUndefined();
    });

    it('should clear the database', async () => {
        const storage = new InMemoryStorage();
        const obj1 = { id: 'test1', value: 'test' };
        await storage.save(obj1);
        await storage.clear();
        const retrieved = await storage.object('test1');
        expect(retrieved).toBeUndefined();
    });
});
