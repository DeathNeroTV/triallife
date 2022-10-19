import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { Keys } from './system/keys';
import { WebSocketClient } from './system/ws';

const PLUGIN_NAME = ' Debug';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    WebSocketClient.init();
    Keys.init();
    alt.log(`~lb~3L:RP ==>~lg~${PLUGIN_NAME} ~w~wurde geladen`);
});
