import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { ShopFunctions } from './src/view';

const PLUGIN_NAME = ' EINZELHANDLE';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    ShopFunctions.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
