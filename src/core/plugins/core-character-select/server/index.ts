import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { CharacterSelectView } from './src/view';

const PLUGIN_NAME = ' CHARAKTER-AUSWAHL';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    CharacterSelectView.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
