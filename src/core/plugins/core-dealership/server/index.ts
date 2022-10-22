import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { DefaultDealerships } from './src/defaults';
import { DealershipView } from './src/view';

const PLUGIN_NAME = 'AUTOHÄNDLER';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    DealershipView.init();
    DefaultDealerships.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
