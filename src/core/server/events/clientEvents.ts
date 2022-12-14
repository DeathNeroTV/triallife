import * as alt from 'alt-server';
import { TRIALLIFE_EVENTS_PLAYER_CLIENT } from '../../shared/enums/triallife-events';

const clientEvents: Array<{ eventName: string; callback: (player: alt.Player, ...args: any[]) => void }> = [];

export class ClientEvents {
    /**
     * Usually called by internal functions. Can be used to manually trigger an triallife Event though.
     * @static
     * @param {TRIALLIFE_EVENTS_PLAYER} eventName
     * @param {alt.Player} player
     * @memberof ClientEvents
     */
    static trigger(eventName: TRIALLIFE_EVENTS_PLAYER_CLIENT, player: alt.Player, ...args: any[]) {
        for (let i = 0; i < clientEvents.length; i++) {
            if (clientEvents[i].eventName !== eventName) {
                continue;
            }

            clientEvents[i].callback(player, ...args);
        }
    }

    /**
     * Trigger a callback specific to triallife Player Events.
     * @static
     * @param {TRIALLIFE_EVENTS_PLAYER} eventName
     * @param {(player: alt.Player) => void} callback
     * @memberof ClientEvents
     */
    static on(eventName: TRIALLIFE_EVENTS_PLAYER_CLIENT, callback: (player: alt.Player, ...args: any[]) => void) {
        clientEvents.push({ eventName, callback });
    }
}
