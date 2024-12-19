import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
/**
 * Peer represents a network peer that can connect and send messages using y-webrtc.
 */
export declare class Peer {
    id: string;
    provider: WebrtcProvider;
    constructor(id: string, signalingServerUrl: string, roomName: string, doc: Y.Doc);
    sendMessage(message: Uint8Array): void;
    disconnect(): void;
    private setupReconnection;
}
