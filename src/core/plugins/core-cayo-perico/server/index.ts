import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

const PLUGIN_NAME = ' CAYO PERICO';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
