import {expect, it} from 'vitest';
import {PriorityQueue} from '@/core/PriorityQueue';

it('should add and poll items in priority order', () => {
    const queue = new PriorityQueue<string>();
    queue.add('item1', 2);
    queue.add('item2', 1);
    expect(queue.poll()).toBe('item2');
    expect(queue.poll()).toBe('item1');
    expect(queue.isEmpty()).toBe(true);
});
