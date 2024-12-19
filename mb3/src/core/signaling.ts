export interface ConnectionMetadata {
    [key: string]: any;
}

/**
 * SignalingServer simulates a server handling peer connections and protocols.
 */
export class SignalingServer {
    private protocolHandlers: Map<string, (peerId: string, data: any) => Promise<void>> = new Map();

    async handleConnection(peerId: string, metadata: ConnectionMetadata): Promise<any> {
        return { peer: peerId, metadata };
    }

    async handleProtocol(peerId: string, protocol: string, data: any): Promise<void> {
        const handler = this.protocolHandlers.get(protocol);
        if (handler) {
            await handler(peerId, data);
        } else {
            console.warn(`No handler for protocol: ${protocol}`);
        }
    }

    registerProtocolHandler(protocol: string, handler: (peerId: string, data: any) => Promise<void>): void {
        this.protocolHandlers.set(protocol, handler);
    }
}
