import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { RegisterItems } from './src/registerItems';
import { UpdateItems } from './src/updateItems';

const PLUGIN_NAME = ' GEGENSTÄNDE';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    RegisterItems.init();
    UpdateItems.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
