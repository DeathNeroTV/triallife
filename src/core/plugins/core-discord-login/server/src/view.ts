import * as alt from 'alt-server';
import { AgendaSystem } from '../../../../server/systems/agenda';
import { AgendaOrder } from '../../../../server/systems/agenda';
import { DISCORD_LOGIN_EVENTS } from '../../shared/events';
import { triallife } from '../../../../server/api/triallife';
import { LoginController } from './login';
import { JwtProvider } from '../../../../server/systems/jwt';
import { Account } from '../../../../server/interface/iAccount';
import { DiscordUser } from '../../../../server/interface/iDiscordUser';
import { DiscordController } from '../../../core-discord/server/src/discordController';
import axios from 'axios';

async function tryToFinishLogin(player: alt.Player, token: string) {
    const request = await axios.get('https://discordapp.com/api/users/@me', {
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
        }
    })
    .catch((err) => { return null; });
    if (!request || !request.data || !request.data.id || !request.data.username) {
        alt.log(`~lb~Discord:OAuth2 ~w~==> Keine Spielerdaten gefunden`);
        return;
    }
    const isRegistered = await DiscordController.getUserByID(player, request.data.id);
    if (!isRegistered) {
        alt.log(`~lb~Discord:OAuth2 ~w~==> Es wurde kein Benutzerkonto für ~lg~${player.name} ~lk~gefunden`);
        return;
    }
    player.discord = request.data as DiscordUser;
    alt.emitClient(player, DISCORD_LOGIN_EVENTS.TO_CLIENT.CLOSE);
    LoginController.tryLogin(player);
}

function tryToLeaveServer(player: alt.Player) {
    player.kick('3L:RP ==> Server verlassen');
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
        alt.emitClient(player, DISCORD_LOGIN_EVENTS.TO_CLIENT.OPEN);
    }
}
