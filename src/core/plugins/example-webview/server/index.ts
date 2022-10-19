import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { ExampleWebViewServer } from './src/view';

const PLUGIN_NAME = ' BEISPIEL-WEBVIEW';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    ExampleWebViewServer.init();
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
