import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { RegisterItems } from './src/registerItems';
import { UpdateItems } from './src/updateItems';

const PLUGIN_NAME = ' GEGENSTÄNDE';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    RegisterItems.init();
    UpdateItems.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
