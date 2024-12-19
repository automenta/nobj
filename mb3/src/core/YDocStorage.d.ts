/**
 * YDocStorage defines the interface for storing and retrieving Yjs document states.
 */
export interface YDocStorage {
    /**
     * Saves the given Yjs document update.
     * @param docId The ID of the document.
     * @param update The Yjs document update.
     */
    saveYDocState(docId: string, update: Uint8Array): Promise<void>;
    /**
     * Loads the Yjs document state for the given document ID.
     * @param docId The ID of the document.
     * @returns The Yjs document state or null if not found.
     */
    loadYDocState(docId: string): Promise<Uint8Array | null>;
}
