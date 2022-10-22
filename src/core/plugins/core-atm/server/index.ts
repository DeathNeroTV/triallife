import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { AtmFunctions } from './src/view';

const PLUGIN_NAME = 'ATM';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    AtmFunctions.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
