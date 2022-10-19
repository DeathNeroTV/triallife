import * as alt from 'alt-server';
import { AgendaOrder, AgendaSystem } from './agenda';

let callback: (player: alt.Player) => Promise<void>;

export class DevModeOverride {
    static setDevAccountCallback(cb: (player: alt.Player) => Promise<void>) {
        callback = cb;
    }

    static async login(player: alt.Player) {
        if (!callback) {
            alt.logError(`DevModeOverride.setDevAccountCallback was not defined. A login system must have a dev callback.`);
            return;
        }

        await callback(player);
        AgendaSystem.initPlayer(player);
        AgendaSystem.goToAgenda(player, AgendaOrder.CHARACTER_SELECT);
    }
}
