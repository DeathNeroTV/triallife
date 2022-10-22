import * as alt from 'alt-server';
import { triallife } from '../../../server/api/triallife';
import { command } from '../../../server/decorators/commands';
import { PluginSystem } from '../../../server/systems/plugins';
import { PERMISSIONS } from '../../../shared/flags/permissionFlags';
const PLUGIN_NAME = 'ROLEPLAY-BEFEHLE';

class Commands {
    @command('testextrasound', '/testextrasound', PERMISSIONS.ADMIN)
    private static testExtraSound(player: alt.Player) {
        triallife.player.emit.sound2D(player, `@plugins/sounds/example-extras/test.ogg`);
    }
}

PluginSystem.registerPlugin(PLUGIN_NAME, () => {});
