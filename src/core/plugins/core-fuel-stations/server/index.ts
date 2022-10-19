import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { FuelStationSystem } from './src/fuelStation';

const PLUGIN_NAME = ' TANKSTELLEN';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    FuelStationSystem.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
