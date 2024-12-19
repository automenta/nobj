/**
 * PriorityQueue is a basic priority queue implementation using an array and sort.
 */
export class PriorityQueue {
    heap = [];
    add(item, priority) {
        this.heap.push({ item, priority });
        this.heap.sort((a, b) => a.priority - b.priority);
    }
    poll() {
        return this.heap.shift()?.item;
    }
    isEmpty() {
        return this.heap.length === 0;
    }
}
//# sourceMappingURL=PriorityQueue.js.map