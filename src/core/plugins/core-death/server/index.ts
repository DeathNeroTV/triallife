import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { DeathCommands } from './src/commands';
import { DeathSystem } from './src/death';

const PLUGIN_NAME = ' BEWUSSTLOSIGKEIT';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    DeathSystem.init();
    DeathCommands.init();
    alt.log(`~lb~3L:RP ==>~lg~${PLUGIN_NAME} ~w~wurde geladen`);
});
