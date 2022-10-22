import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { InventoryView } from './src/view';

const PLUGIN_NAME = 'CORE-INVENTORY';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    InventoryView.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
