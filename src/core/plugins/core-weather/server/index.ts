import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

import './src/commands/weatherCommands';

const PLUGIN_NAME = ' WETTER';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
