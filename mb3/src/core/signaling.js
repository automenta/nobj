/**
 * SignalingServer simulates a server handling peer connections and protocols.
 */
export class SignalingServer {
    protocolHandlers = new Map();
    async handleConnection(peerId, metadata) {
        return { peer: peerId, metadata };
    }
    async handleProtocol(peerId, protocol, data) {
        const handler = this.protocolHandlers.get(protocol);
        if (handler) {
            await handler(peerId, data);
        }
        else {
            console.warn(`No handler for protocol: ${protocol}`);
        }
    }
    registerProtocolHandler(protocol, handler) {
        this.protocolHandlers.set(protocol, handler);
    }
}
//# sourceMappingURL=signaling.js.map