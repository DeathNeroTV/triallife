import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { ExampleWebViewServer } from './src/view';

const PLUGIN_NAME = ' BEISPIEL-WEBVIEW';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    ExampleWebViewServer.init();
    alt.log(`~lb~3L:RP ==>~lg~${PLUGIN_NAME} ~w~wurde geladen`);
});
