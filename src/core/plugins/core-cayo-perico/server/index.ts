import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

const PLUGIN_NAME = ' CAYO PERICO';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
