import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { LoginController } from './src/login';
import { LoginView } from './src/view';

const PLUGIN_NAME = 'DISCORD-LOGIN';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    LoginView.init();
    LoginController.init();

    alt.log(`~lb~3L:RP ~w~==> ~lg~${PLUGIN_NAME} ~lk~wurde geladen`);
});
