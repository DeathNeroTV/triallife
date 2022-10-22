import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { createDefaultInteriors } from './src/interiors';
import { InteriorSystem } from './src/system';

const PLUGIN_NAME = ' GEBÄUDE';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    await InteriorSystem.init();
    await createDefaultInteriors();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
