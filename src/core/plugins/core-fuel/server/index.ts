import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { FuelSystem } from './src/fuel';

const PLUGIN_NAME = 'KRAFTSTOFF';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    FuelSystem.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
