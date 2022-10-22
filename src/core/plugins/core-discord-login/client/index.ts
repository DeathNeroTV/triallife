import * as alt from 'alt-client';
import { triallifeClient } from '../../../client/api/triallife';
import { DISCORD_LOGIN_EVENTS } from '../shared/events';
import { DISCORD_CONFIG } from './config';

class DiscordLoginView {
    static open() {
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
        triallifeClient.webview.open([DISCORD_LOGIN_EVENTS.PAGE_NAME], true);
        triallifeClient.webview.on(DISCORD_LOGIN_EVENTS.TO_CLIENT.TRY_FINISH, DiscordLoginView.finish);
        triallifeClient.webview.focus();
        triallifeClient.webview.showCursor(true);
    }

    static close() {
        triallifeClient.webview.close([DISCORD_LOGIN_EVENTS.PAGE_NAME]);
        triallifeClient.webview.unfocus();
        triallifeClient.webview.showCursor(false);
        alt.toggleGameControls(true);
        alt.Player.local.isMenuOpen = false;
    }

    static async finish() {
        const token = await alt.Discord.requestOAuth2Token(DISCORD_CONFIG.CLIENT_ID);
        alt.emitServer(DISCORD_LOGIN_EVENTS.TO_SERVER.TRY_FINISH, token);
    }
}

alt.onServer(DISCORD_LOGIN_EVENTS.TO_CLIENT.OPEN, DiscordLoginView.open);
alt.onServer(DISCORD_LOGIN_EVENTS.TO_CLIENT.CLOSE, DiscordLoginView.close);
