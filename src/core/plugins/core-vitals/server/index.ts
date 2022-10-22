import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { VitalsSystem } from './src/system';

import './src/commands';
import { VitalsEffects } from './src/effects';

const PLUGIN_NAME = ' VITALITÄT';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    VitalsSystem.init();
    VitalsEffects.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
