import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { BarbershopCommands } from './src/commands';
import { BarbershopView } from './src/view';

const PLUGIN_NAME = ' FRISEURE';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    BarbershopView.init();
    BarbershopCommands.init();

    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
