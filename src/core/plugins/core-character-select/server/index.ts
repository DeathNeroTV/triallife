import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { CharacterSelectView } from './src/view';

const PLUGIN_NAME = ' CHARAKTER-AUSWAHL';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    CharacterSelectView.init();
    alt.log(`~lb~3L:RP ==>~lg~${PLUGIN_NAME} ~w~wurde geladen`);
});
