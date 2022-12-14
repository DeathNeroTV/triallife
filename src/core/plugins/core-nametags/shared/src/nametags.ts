import * as alt from 'alt-server';
import NametagConfig from './config';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { NAMETAG_EVENTS } from '../enums';
import { TRIALLIFE_EVENTS_PLAYER } from '../../../../shared/enums/triallife-events';

/**
 * Send the configuration to the player.
 * @param {alt.Player} player - The player to pass the configuration to.
 * @returns None
 */
function passConfiguration(player: alt.Player) {
    alt.emitClient(player, NAMETAG_EVENTS.CONFIG, NametagConfig);
}

export class Nametags {
    /**
     * Creates a callback handler for setting up nametags when the user spawns.
     * @static
     * @memberof Nametags
     */
    static init() {
        PlayerEvents.on(TRIALLIFE_EVENTS_PLAYER.SELECTED_CHARACTER, passConfiguration);
    }
}
