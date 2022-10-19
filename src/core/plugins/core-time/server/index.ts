import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

import './src/commands/timeCommands';

const PLUGIN_NAME = ' ZEITVERWALTUNG';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
