import * as alt from 'alt-server';
import { triallife_DEBUG_EVENTS } from '../../shared/events';
import { WebSocketClient } from './ws';

export class Keys {
    static init() {
        alt.onClient(triallife_DEBUG_EVENTS.ClientToServer.FORWARD, Keys.handleForwardData);
    }

    private static handleForwardData(player: alt.Player) {
        WebSocketClient.addToList(JSON.stringify(player.pos));
    }
}
