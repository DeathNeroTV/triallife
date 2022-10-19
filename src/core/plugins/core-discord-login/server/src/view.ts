import * as alt from 'alt-server';
import { sha256Random } from '../../../../server/utility/encryption';
import { AgendaSystem } from '../../../../server/systems/agenda';
import { AgendaOrder } from '../../../../server/systems/agenda';
import { DISCORD_LOGIN_EVENTS } from '../../shared/events';
import { triallife } from '../../../../server/api/triallife';
import { LoginController } from './login';
import { JwtProvider } from '../../../../server/systems/jwt';
import { Account } from '../../../../server/interface/iAccount';
import { DiscordUser } from '../../../../server/interface/iDiscordUser';
import { DiscordController } from '../../../core-discord/server/src/discordController';

async function tryToFinishLogin(player: alt.Player, id: string) {
    const player_identifier = player.discordToken;
    if (!player_identifier) {
        alt.logError(`Player's Discord Token not present`);
        return;
    }
    const isRegistered = await DiscordController.getUserByID(player, id);
    if (!isRegistered) {
        alt.logWarning(`[Discord Auth] No Account found for ${player.name}`);
        return;
    }
    alt.emitClient(player, DISCORD_LOGIN_EVENTS.TO_CLIENT.CLOSE);
    LoginController.tryLogin(player);
}

function tryToLeaveServer(player: alt.Player) {
    player.kick('Sie haben den Server verlassen.');
}

export class LoginView {
    static init() {
        alt.onClient(DISCORD_LOGIN_EVENTS.TO_SERVER.TRY_FINISH, tryToFinishLogin);
        alt.onClient(DISCORD_LOGIN_EVENTS.TO_SERVER.TRY_LEAVE, tryToLeaveServer);
        AgendaSystem.set(AgendaOrder.LOGIN_SYSTEM, LoginView.show);
    }

    static async show(player: alt.Player) {
        if (!player || !player.valid) return;

        const token = await JwtProvider.fetch(player);
        if (typeof token === 'string') {
            const identifier = await JwtProvider.verify(token);
            if (typeof identifier === 'string') {
                const account: Partial<Account> | null = await triallife.database.funcs.fetchData<Account>('_id', identifier, triallife.database.collections.Accounts);
                if (account) {
                    player.discord = { id: account.discord } as DiscordUser;
                    LoginController.tryLogin(player);
                    return;
                }
            }
        }
        const uniquePlayerData = JSON.stringify(player.ip + player.hwidHash + player.hwidExHash);
        player.discordToken = sha256Random(uniquePlayerData);
        alt.emitClient(player, DISCORD_LOGIN_EVENTS.TO_CLIENT.OPEN);
    }
}
