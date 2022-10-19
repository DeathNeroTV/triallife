import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { BankFunctions } from './src/view';

const PLUGIN_NAME = ' BANK';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    BankFunctions.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
