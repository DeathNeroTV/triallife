import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { FactionActions } from './src/actions';
import { FactionCommands } from './src/commands';
import { FactionFuncs } from './src/funcs';
import { FactionHandler } from './src/handler';

const PLUGIN_NAME = 'FIRMENSYSTEM';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    await FactionHandler.init();
    await FactionFuncs.init();
    await FactionActions.init();
    FactionCommands.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
