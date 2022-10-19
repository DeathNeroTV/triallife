import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { BankFunctions } from './src/view';

const PLUGIN_NAME = ' BANK';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    BankFunctions.init();
    alt.log(`~lb~3L:RP ==>~lg~${PLUGIN_NAME} ~w~wurde geladen`);
});
