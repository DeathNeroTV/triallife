import * as alt from 'alt-server';
import { AgendaSystem } from '../../../server/systems/agenda';
import { PluginSystem } from '../../../server/systems/plugins';
import { triallife_EXAMPLE_AGENDA } from '../shared/enums';

const PLUGIN_NAME = ' LOGO';

/**
 * `Show the triallife logo and then wait 2 seconds before continuing`
 * @param {alt.Player} player - alt.Player - The player who is going to be shown the agenda.
 * @returns The function itself.
 */
function showTriallifeLogo(player: alt.Player) {
    alt.emitClient(player, triallife_EXAMPLE_AGENDA.SHOW);
    alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        alt.emitClient(player, triallife_EXAMPLE_AGENDA.CLOSE);
        alt.nextTick(() => {
            AgendaSystem.goNext(player);
        });
    }, 5500);
}

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~3L:RP ==> ${PLUGIN_NAME} wurde geladen`);
    AgendaSystem.set(0, showTriallifeLogo);
});
