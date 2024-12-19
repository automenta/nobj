/**
 * PriorityQueue is a basic priority queue implementation using an array and sort.
 */
export declare class PriorityQueue<T> {
    private heap;
    add(item: T, priority: number): void;
    poll(): T | undefined;
    isEmpty(): boolean;
}
