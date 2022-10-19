import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { Nametags } from './src/nametags';

const PLUGIN_NAME = ' NAMETAGS';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    Nametags.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
