import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { GarageFunctions } from './src/view';
import './src/garages';
import { GarageSystem } from './src/system';

const PLUGIN_NAME = 'GARAGEN';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    GarageSystem.init();
    GarageFunctions.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
