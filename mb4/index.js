import {createHash} from 'crypto';
import Core from './core.js';
import UI from './ui.js';
import { CorePlugins, Plugin, Analyzer, Network, Analyzers, Networks } from './plugins.js';

function hash(data) {
    return createHash('sha256').update(data).digest('hex');
}
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Attach inner classes to Core and Plugins
Core.Plugins = CorePlugins;
Core.Plugin = Plugin;
Core.Analyzer = Analyzer;
Core.Network = Network;
Core.Analyzers = Analyzers;
Core.Networks = Networks;

const core = new Core();
const ui = new UI(core);