import * as alt from 'alt-server';
import { TRIALLIFE_EVENTS_PLAYER } from '../../shared/enums/triallife-events';

const playerEvents: Array<{ eventName: string; callback: (player: alt.Player, ...args: any[]) => void }> = [];

export class PlayerEvents {
    /**
     * Usually called by internal functions. Can be used to manually trigger an triallife Event though.
     * @static
     * @param {TRIALLIFE_EVENTS_PLAYER} eventName
     * @param {alt.Player} player
     * @memberof PlayerEvents
     */
    static trigger(eventName: TRIALLIFE_EVENTS_PLAYER, player: alt.Player, ...args: any[]) {
        for (let i = 0; i < playerEvents.length; i++) {
            if (playerEvents[i].eventName !== eventName) {
                continue;
            }

            playerEvents[i].callback(player, ...args);
        }
    }

    /**
     * Trigger a callback specific to triallife Player Events.
     * @static
     * @param {TRIALLIFE_EVENTS_PLAYER} eventName
     * @param {(player: alt.Player) => void} callback
     * @memberof PlayerEvents
     */
    static on(eventName: TRIALLIFE_EVENTS_PLAYER, callback: (player: alt.Player, ...args: any[]) => void) {
        playerEvents.push({ eventName, callback });
    }
}
