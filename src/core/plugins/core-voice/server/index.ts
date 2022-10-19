import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { VoiceSystem } from './src/system';

const PLUGIN_NAME = ' SPRACH-CHAT';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    VoiceSystem.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
