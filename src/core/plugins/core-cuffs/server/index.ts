import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { CuffSystem } from './src/system';

const PLUGIN_NAME = ' HANDSCHELLEN';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    await CuffSystem.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
