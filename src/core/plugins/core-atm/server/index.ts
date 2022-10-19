import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { AtmFunctions } from './src/view';

const PLUGIN_NAME = ' ATM';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    AtmFunctions.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
