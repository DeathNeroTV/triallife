import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { AdminFunctions } from './src/view';

const PLUGIN_NAME = ' ADMIN';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    AdminFunctions.init();
    alt.log(`~lb~3L:RP ==> ~lg~${PLUGIN_NAME} wurde geladen`);
});