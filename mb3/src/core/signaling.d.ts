export interface ConnectionMetadata {
    [key: string]: any;
}
/**
 * SignalingServer simulates a server handling peer connections and protocols.
 */
export declare class SignalingServer {
    private protocolHandlers;
    handleConnection(peerId: string, metadata: ConnectionMetadata): Promise<any>;
    handleProtocol(peerId: string, protocol: string, data: any): Promise<void>;
    registerProtocolHandler(protocol: string, handler: (peerId: string, data: any) => Promise<void>): void;
}
