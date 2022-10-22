import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { FuelStationSystem } from './src/fuelStation';

const PLUGIN_NAME = ' TANKSTELLEN';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    FuelStationSystem.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
