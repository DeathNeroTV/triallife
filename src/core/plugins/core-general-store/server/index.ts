import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { ShopFunctions } from './src/view';

const PLUGIN_NAME = ' EINZELHANDLE';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    ShopFunctions.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
