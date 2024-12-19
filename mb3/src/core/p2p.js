import { WebrtcProvider } from 'y-webrtc';
/**
 * Peer represents a network peer that can connect and send messages using y-webrtc.
 */
export class Peer {
    id;
    provider;
    constructor(id, signalingServerUrl, roomName, doc) {
        this.id = id;
        const serverUrl = process.env.VITE_SIGNALING_SERVER_URL || signalingServerUrl;
        this.provider = new WebrtcProvider(roomName, doc, {
            signaling: [serverUrl],
        });
        // Log connected peers
        this.provider.awareness.on('change', () => {
            console.log(`Peer ${this.id}: Connected peers:`, this.provider.awareness.getStates().size);
        });
        // Handle connection status
        this.provider.on('status', (event) => {
            if (event.connected) {
                console.log(`Peer ${this.id}: Connected to signaling server`);
            }
            else {
                console.log(`Peer ${this.id}: Disconnected from signaling server`);
            }
        });
        // Handle peer changes
        this.provider.on('peers', (event) => {
            if (event.added.length > 0) {
                console.log('Peer(s) joined:', event.added);
            }
            if (event.removed.length > 0) {
                console.log('Peer(s) left:', event.removed);
            }
        });
        this.setupReconnection();
    }
    sendMessage(message) {
        try {
            this.provider.doc.transact(() => {
                this.provider.doc.getMap('messages').set(this.id, message);
            });
        }
        catch (error) {
            console.error('Error broadcasting message:', error);
        }
    }
    disconnect() {
        this.provider.disconnect();
    }
    setupReconnection() {
        let attempts = 0;
        let timeoutId = null;
        const reconnect = () => {
            clearTimeout(timeoutId);
            const delay = Math.min(5000 * Math.pow(2, attempts), 60000);
            timeoutId = setTimeout(() => {
                if (!this.provider.connected) {
                    console.warn(`Peer ${this.id}: Attempting to reconnect to signaling server (attempt ${attempts + 1})...`);
                    this.provider.connect();
                    attempts++;
                }
            }, delay);
        };
        this.provider.on('status', (event) => {
            if (!event.connected) {
                reconnect();
            }
            else {
                attempts = 0;
            }
        });
    }
}
//# sourceMappingURL=p2p.js.map