import {fromString as uint8ArrayFromString} from 'uint8arrays/from-string'
import {toString as uint8ArrayToString} from 'uint8arrays/to-string'
import {createLibp2p} from 'libp2p';
import {noise} from '@chainsafe/libp2p-noise';
import {yamux as mplex, yamux} from '@chainsafe/libp2p-yamux';
import {webSockets} from '@libp2p/websockets';
import {all} from '@libp2p/websockets/filters';
import {multiaddr} from '@multiformats/multiaddr';
import {bootstrap} from '@libp2p/bootstrap';
import {gossipsub} from '@chainsafe/libp2p-gossipsub';
import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery";
import {identify} from '@libp2p/identify'
import {circuitRelayTransport} from '@libp2p/circuit-relay-v2'
import {dcutr} from '@libp2p/dcutr'
import {kadDHT} from '@libp2p/kad-dht'
import {ipnsValidator} from 'ipns/validator'
import {ipnsSelector} from 'ipns/selector'

// #region Plugins Module (Inner Class of Core)
class CorePlugins {
    constructor(core) {
        this.core = core;
        this.analyzers = [];
        this.networks = [];
        this.loadPlugins('analyzers');
        this.loadPlugins('networks');
    }

    async loadPlugins(type) {
        // TODO in future, dynamically load from a plugins directory
        let c = this.core;
        if (type === 'analyzers') {
            this.analyzers.push(new Analyzers.KeywordAnalyzer(c));
            this.analyzers.push(new Analyzers.SentimentAnalyzer(c));
            // ... other analyzers
        } else if (type === 'networks') {
            this.networks.push(
                //new Networks.Libp2pNetwork(c)
                new Networks.WebRTCNetwork(c)
            );
            // ... other networks
        }
    }

    getEnabledPlugins(type) {
        return this[type].filter(plugin => plugin.enabled);
    }
}

class Plugin {
    constructor(core) {
        this.core = core;
        this.enabled = false;
        this.config = {};
    }

    async init() { }

    async run() { }

    async stop() { }

    enable() { this.enabled = true; }

    disable() { this.enabled = false; }

    emit(x) { this.core.emit(x); }

    loadConfig(config) {
        // Load config from an object for now, no file system
        if (typeof config === 'object') {
            this.config = config;
        }
    }
}

class Analyzer extends Plugin {
    constructor(core) {
        super(core);
    }
}

class Network extends Plugin {
    constructor(core) {
        super(core);
    }

    getConnectionStatus() { return 'Disconnected'; }
    getPeers() { return []; }
    getTraffic() { return { incoming: '0 KB/s', outgoing: '0 KB/s' }; }
    broadcast(message) { }
}

// #region Analyzer Implementations (Inner Classes of Core.Plugins)
class Analyzers {
    static KeywordAnalyzer = class extends Analyzer {
        constructor(core) {
            super(core);
            this.keywords = ['TODO', 'IMPORTANT', 'URGENT'];
        }

        async init() {
            // Load config if necessary
            // this.loadConfig({});
        }

        async run(obj) {
            const content = obj.get('content').toUpperCase();
            const matches = this.keywords.filter(keyword => content.includes(keyword));
            if (matches.length > 0) {
                obj.set('tags', matches); // Add tags to the object
                this.core.emit('notify', `Object ${obj.get('id')} tagged with: ${matches.join(', ')}`);
            }
        }
    }

    static SentimentAnalyzer = class extends Analyzer {
        async run(obj) {
            const sentimentScore = this.analyzeSentiment(obj.get('content'));
            obj.set('sentiment', sentimentScore);
            this.core.emit('notify', `Object ${obj.get('id')} sentiment: ${sentimentScore}`);
        }

        analyzeSentiment(text) {
            // Placeholder - Replace with actual sentiment analysis logic
            return 'unknown';
        }
    }

    /** LLM vision prompt */
    static LLMImageAnalyzer = class extends Analyzer {
        async run(obj) {
            // ... analyze image data ...
        }
    }

    /** Tesseract OCR (tesseract.js): Image -> Visible Text */
    static OCRImageAnalyzer = class extends Analyzer {
        async run(obj) {
            // ... analyze image data ...
        }
    }
}

// #region Network Implementations (Inner Classes of Core.Plugins)
class Networks {

    static Libp2pNetwork = class extends Network {
        constructor(core) {
            super(core);
            this.node = null;
            this.pubsubTopic = 'collab-editor-objects'; // PubSub topic for object updates
            this.knownPeers = new Set();
            this.createNode((n)=>{
                this.node = n;
                n.start();
                this.init();
            });
        }

        init() {
            this.core.ydoc.on('update', async (update, origin) => {
                if (origin !== this) {
                    const msg = {
                        update: uint8ArrayToString(update, 'base64'),
                        timestamp: Date.now()
                    }
                    const encodedMessage = uint8ArrayFromString(JSON.stringify(msg));
                    await this.node.services.pubsub.publish(this.pubsubTopic, encodedMessage)
                }
            });

            this.node.addEventListener('self:peer:update', (evt) => {
                this.emit('status', this.getConnectionStatus())
                this.emit('peers', this.getPeers())
            })

            this.node.addEventListener('peer:connect', (evt) => {
                const peerId = evt.detail
                if (!this.knownPeers.has(peerId)) {
                    this.knownPeers.add(peerId)
                    this.emit('peer:connect', evt.detail)
                    this.emit('status', this.getConnectionStatus())
                    this.emit('peers', this.getPeers())
                }
            })

            this.node.addEventListener('peer:disconnect', (evt) => {
                this.emit('peer:disconnect', evt.detail)
                this.emit('status', this.getConnectionStatus())
                this.emit('peers', this.getPeers())
            })

            this.node.services.pubsub.subscribe(this.pubsubTopic);
            this.node.services.pubsub.addEventListener('message', (evt) => {
                const msg = evt.detail;
                if (msg.topic === this.pubsubTopic) {
                    try {
                        const decodedString = uint8ArrayToString(msg.data);
                        const message = JSON.parse(decodedString);
                        const update = uint8ArrayFromString(message.update, 'base64');

                        // Apply update from a remote peer
                        Y.applyUpdate(this.core.ydoc, update, this);
                    } catch (error) {
                        console.error('Failed to process received message:', error);
                    }
                }
            });

            // Handle object updates and broadcast them to the network
            this.core.objects.observeDeep(async (events, transaction) => {
                if (transaction.origin !== this) {
                    events.forEach(event => {
                        event.changes.keys.forEach((change, key) => {
                            const obj = this.core.objects.get(key);
                            if (obj && !obj.get('isPrivate')) {
                                // Broadcast changes for public objects
                                const update = Y.encodeStateAsUpdate(this.core.ydoc);
                                const msg = {
                                    update: uint8ArrayToString(update, 'base64'),
                                    timestamp: Date.now()
                                }
                                const encodedMessage = uint8ArrayFromString(JSON.stringify(msg));
                                this.node.services.pubsub.publish(this.pubsubTopic, encodedMessage);
                            }
                        });
                    });
                }
            });

            this.enable();
            this.emit('init');
        }

        createNode(onReady) {
            const bootstrapMultiaddrs = [
                '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
            ].map((s) => multiaddr(s))

            createLibp2p({
                start: false,
                addresses: {
                    listen: ['/ip4/0.0.0.0/tcp/0', '/ip4/0.0.0.0/tcp/0/ws'],
                },
                transports: [
                    webSockets({
                        filter: all
                    }),
                    circuitRelayTransport({
                        discoverRelays: 2
                    })
                ],
                connectionEncryption: [noise()],
                streamMuxers: [yamux(), mplex()],
                connectionGater: {
                    denyDialMultiaddr: async (multiAddr) => {
                        const str = multiAddr.toString()
                        return !str.includes("/ws/") && !str.includes("/wss/") && !str.includes("/p2p-circuit/")
                    },
                },
                peerDiscovery: [
                    bootstrap({
                        list: bootstrapMultiaddrs,
                    }),
                    pubsubPeerDiscovery({
                        interval: 5000,
                        topics: [this.pubsubTopic, `_peer-discovery._p2p._pubsub`]
                    })
                ],
                services: {
                    dht: kadDHT({
                        kBucketSize: 20,
                        clientMode: false,
                        validators: {
                            ipns: ipnsValidator
                        },
                        selectors: {
                            ipns: ipnsSelector
                        }
                    }),
                    pubsub: gossipsub({
                        emitSelf: false,
                        allowPublishToZeroPeers: true
                    }),
                    identify: identify(),
                    dcutr: dcutr()
                }
            }).then(onReady);

            // // Wait for the 'listening' event on the WebSocket transport
            // const wsTransport = this.node.getTransports().find(t => t.constructor.name === 'WebSockets');
            // if (wsTransport) {
            //     await new Promise((resolve) => {
            //         wsTransport.addEventListener('listening', () => {
            //             console.log('WebSocket transport is listening');
            //             resolve();
            //         }, { once: true }); // Ensure the listener is only called once
            //     });
            // } else {
            //     console.warn('WebSocket transport not found');
            // }

        }
        getConnectionStatus() {
            return this.node.status;
        }

        getPeers() {
            return Array.from(this.knownPeers);
        }

        getTraffic() {
            // Placeholder - gather actual traffic data if available
            return { incoming: '... KB/s', outgoing: '... KB/s' };
        }

        broadcast(message) {
            // Use GossipSub to broadcast messages
            const encodedMessage = uint8ArrayFromString(JSON.stringify(message));
            this.node.services.pubsub.publish(this.pubsubTopic, encodedMessage);
        }
    }

    // ... other network stubs ...
    // Example:
    static WebRTCNetwork = class extends Network {
        async init() {
            // ... initialize WebRTC connection ...
        }
    }
}

export { CorePlugins, Plugin, Analyzer, Network, Analyzers, Networks };