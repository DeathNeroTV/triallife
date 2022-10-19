import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { LoginController } from './src/login';
import { LoginView } from './src/view';

const PLUGIN_NAME = ' DISCORD-LOGIN';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    LoginView.init();
    LoginController.init();

    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
});
