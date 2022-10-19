import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

import './src/commands/timeCommands';

const PLUGIN_NAME = ' ZEITVERWALTUNG';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lb~3L:RP ==> ~lg~${PLUGIN_NAME} wurde geladen`);
});
