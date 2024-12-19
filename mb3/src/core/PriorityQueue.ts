/**
 * PriorityQueue is a basic priority queue implementation using an array and sort.
 */
export class PriorityQueue<T> {
    private heap: Array<{ item: T; priority: number }> = [];

    add(item: T, priority: number): void {
        this.heap.push({ item, priority });
        this.heap.sort((a, b) => a.priority - b.priority);
    }

    poll(): T | undefined {
        return this.heap.shift()?.item;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }
}
