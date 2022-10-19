import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { CharacterCreatorView } from './src/view';

const PLUGIN_NAME = ' CHARAKTER-EDITOR';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    CharacterCreatorView.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
