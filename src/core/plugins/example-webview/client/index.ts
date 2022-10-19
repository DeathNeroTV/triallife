import * as alt from 'alt-client';
import { triallifeClient } from '../../../client/api/triallife';
import { ExampleWebViewEvents } from '../shared/viewInfo';

let players: alt.Player[];

class ExampleWebView {
    /**
     * Opens the WebView.
     * The function call is from the server-side.
     *
     * @static
     * @param {alt.Player[]} _players
     * @return {*}
     * @memberof ExampleWebView
     */
    static open(_players: alt.Player[]) {
        players = _players;
        if (triallifeClient.webview.isAnyMenuOpen(true)) {
            return;
        }

        triallifeClient.webview.ready(ExampleWebViewEvents.ViewName, ExampleWebView.ready);
        triallifeClient.webview.open([ExampleWebViewEvents.ViewName], true, ExampleWebView.close);
        triallifeClient.webview.focus();
        triallifeClient.webview.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    /**
     * A ready event to send the data up to the WebView.
     *
     * @static
     * @memberof ExampleWebView
     */
    static ready() {
        triallifeClient.webview.emit(ExampleWebViewEvents.ClientToWebView.LOAD_PLAYERS, players);
    }

    /**
     * Called when the WebView event is closed.
     *
     * @static
     * @memberof ExampleWebView
     */
    static close() {
        players = undefined;
        triallifeClient.webview.unfocus();
        triallifeClient.webview.showCursor(false);
        alt.toggleGameControls(true);
        alt.Player.local.isMenuOpen = false;
    }
}

alt.onServer(ExampleWebViewEvents.ClientServer.OPEN, ExampleWebView.open);
