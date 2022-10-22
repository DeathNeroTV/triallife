import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { VoiceSystem } from './src/system';

const PLUGIN_NAME = ' SPRACH-CHAT';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    VoiceSystem.init();
    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
