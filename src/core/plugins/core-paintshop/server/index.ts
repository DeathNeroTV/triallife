import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { PaintShopView } from './src/view';

const PLUGIN_NAME = 'LACKIEREREI';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    PaintShopView.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
