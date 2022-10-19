import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { FactionPaycheckSystem } from './src/system';

const PLUGIN_NAME = ' FIRMEN-AUSZAHLUNG';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    FactionPaycheckSystem.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
