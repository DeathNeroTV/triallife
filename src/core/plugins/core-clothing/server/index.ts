import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { ClothingFunctions } from './src/view';

const PLUGIN_NAME = ' KLEIDUNGSLÄDEN';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    ClothingFunctions.init();
    alt.log(`~lb~3L:RP ==> ~lg~${PLUGIN_NAME} wurde geladen`);
});
