import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { FactionPaycheckSystem } from './src/system';

const PLUGIN_NAME = 'FIRMEN-AUSZAHLUNG';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    FactionPaycheckSystem.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
