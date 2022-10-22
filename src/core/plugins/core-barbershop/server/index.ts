import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { BarbershopCommands } from './src/commands';
import { BarbershopView } from './src/view';

const PLUGIN_NAME = ' FRISEURE';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    BarbershopView.init();
    BarbershopCommands.init();

    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
