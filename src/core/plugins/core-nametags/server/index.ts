import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { Nametags } from './src/nametags';

const PLUGIN_NAME = ' NAMETAGS';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    Nametags.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
