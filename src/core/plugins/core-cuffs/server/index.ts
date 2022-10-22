import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { CuffSystem } from './src/system';

const PLUGIN_NAME = ' HANDSCHELLEN';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    await CuffSystem.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
