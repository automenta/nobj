import {describe, expect, it} from 'vitest';
import {Peer} from '@/core/p2p';
import * as Y from 'yjs';

// Mock the signaling server URL for testing
const mockSignalingServerUrl = 'ws://localhost:4444';
const roomName = 'test-room';

describe('Peer', () => {
    it('should connect and exchange messages', async () => {
        const doc1 = new Y.Doc();
        const doc2 = new Y.Doc();
        const peer1 = new Peer('peer1', mockSignalingServerUrl, roomName, doc1);
        const peer2 = new Peer('peer2', mockSignalingServerUrl, roomName, doc2);

        peer1.provider.connect();
        peer2.provider.connect();

        // Wait for peers to connect
        await new Promise((resolve) => {
            let connectedCount = 0;
            const checkConnected = () => {
                connectedCount++;
                if (connectedCount === 2) {
                    resolve(true);
                } else setTimeout(checkConnected, 500);
            };
            peer1.provider.once('synced', checkConnected);
            peer2.provider.once('synced', checkConnected);
        });

        // Set up message receiving callbacks
        const receivedMessages1: any[] = [];
        // const unsub1 = doc1.on('update', (update: Uint8Array) => {
        //     receivedMessages1.push({ message: update, senderId: peer2.id });
        // });

        const receivedMessages2: any[] = [];
        // const unsub2 = doc2.on('update', (update: Uint8Array) => {
        //     receivedMessages2.push({ message: update, senderId: peer1.id });
        // });

        {
            // Send messages by updating the Y.Doc
            const ymap1 = doc1.getMap('testmap');
            ymap1.set('message', 'Hello from peer1');
            const ymap2 = doc2.getMap('testmap');
            ymap2.set('message', 'Hello from peer2');
        }

        // Wait for messages to be received
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Log received messages for debugging
        console.log('Received messages at peer1:', receivedMessages1);
        console.log('Received messages at peer2:', receivedMessages2);

        // Assertions
        expect(receivedMessages1.length).toBeGreaterThan(0);
        expect(receivedMessages2.length).toBeGreaterThan(0);

        {
            const ymap1 = doc1.getMap('testmap');
            expect(ymap1.get('message')).toEqual('Hello from peer2');
            const ymap2 = doc2.getMap('testmap');
            expect(ymap2.get('message')).toEqual('Hello from peer1');
        }

        peer1.provider.disconnect();
        peer2.provider.disconnect();
        // unsub1(() => {});
        // unsub2(() => {});
    });
});
