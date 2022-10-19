import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { InventoryView } from './src/view';

const PLUGIN_NAME = ' CORE-INVENTORY';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    InventoryView.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
