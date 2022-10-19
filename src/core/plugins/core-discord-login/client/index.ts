import * as alt from 'alt-client';
import { triallifeClient } from '../../../client/api/triallife';
import { DISCORD_LOGIN_EVENTS } from '../shared/events';

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

    static finish() {
        alt.emitServer(DISCORD_LOGIN_EVENTS.TO_SERVER.TRY_FINISH, alt.Discord.currentUser.id);
    }
}

alt.onServer(DISCORD_LOGIN_EVENTS.TO_CLIENT.OPEN, DiscordLoginView.open);
alt.onServer(DISCORD_LOGIN_EVENTS.TO_CLIENT.CLOSE, DiscordLoginView.close);
