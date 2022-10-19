import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

import './src/commands/weatherCommands';

const PLUGIN_NAME = ' WETTER';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lb~3L:RP ==>~lg~${PLUGIN_NAME} ~w~wurde geladen`);
});
