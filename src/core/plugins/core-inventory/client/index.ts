import * as alt from 'alt-client';
import { triallifeClient } from '../../../client/api/triallife';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Item, StoredItem } from '../../../shared/interfaces/inventory';
import { INVENTORY_EVENTS } from '../shared/events';

const validKeys = ['inventory', 'equipment', 'toolbar'];

let inventory: Array<Item<StoredItem>>;
let equipment: Array<Item<StoredItem>>;
let toolbar: Array<Item<StoredItem>>;
let isOpen = false;

const KEY = 89; // 'Y'

class InternalFunctions {
    static init() {
        alt.on('keyup', InternalFunctions.handleKeyPress);
    }

    static handleKeyPress(key: number) {
        if (key !== KEY) {
            return;
        }

        alt.emitServer(INVENTORY_EVENTS.TO_SERVER.OPEN);
    }
}

class InventoryWebView {
    /**
     * Opens the WebView.
     * The function call is from the server-side.
     *
     * @static
     * @param {alt.Player[]} _players
     * @return {*}
     * @memberof InventoryWebView
     */
    static open(_inventory: Array<Item<StoredItem>>, _equipment: Array<Item<StoredItem>>, _toolbar: Array<Item<StoredItem>>) {
        inventory = _inventory;
        equipment = _equipment;
        toolbar = _toolbar;

        if (triallifeClient.webview.isAnyMenuOpen()) {
            return;
        }

        console.log(JSON.stringify(inventory));
        console.log(JSON.stringify(equipment));
        console.log(JSON.stringify(toolbar));

        triallifeClient.webview.ready(INVENTORY_EVENTS.PAGE, InventoryWebView.ready);
        triallifeClient.webview.open([INVENTORY_EVENTS.PAGE], true, InventoryWebView.close);
        triallifeClient.webview.focus();
        triallifeClient.webview.showCursor(true);
        alt.Player.local.isMenuOpen = true;
        isOpen = true;
    }

    /**
     * A ready event to send the data up to the WebView.
     *
     * @static
     * @memberof InventoryWebView
     */
    static ready() {
        triallifeClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_EQUIPMENT, equipment);
        triallifeClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_INVENTORY, inventory);
    }

    /**
     * Called when the WebView event is closed.
     *
     * @static
     * @memberof InventoryWebView
     */
    static close() {
        inventory = undefined;
        equipment = undefined;
        triallifeClient.webview.unfocus();
        triallifeClient.webview.showCursor(false);
        alt.toggleGameControls(true);
        alt.Player.local.isMenuOpen = false;
        alt.emitServer(INVENTORY_EVENTS.TO_SERVER.CLOSE);

        isOpen = false;
    }

    static processMetaChange(key: string, value: any, oldValue: any): void {
        if (!isOpen) {
            return;
        }

        // Weed out the keys we don`t care about.
        if (!validKeys.includes(key)) {
            return;
        }

        if (key === 'inventory') {
            inventory = value;
            triallifeClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_INVENTORY, inventory, toolbar);
            return;
        }

        if (key === 'toolbar') {
            toolbar = value;
            triallifeClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_INVENTORY, inventory, toolbar);
            return;
        }

        if (key === 'equipment') {
            equipment = value;
            triallifeClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_EQUIPMENT, equipment);
        }
    }
}

// alt.onServer(SYSTEM_EVENTS.TICKS_START, InternalFunctions.init);
alt.onServer(INVENTORY_EVENTS.TO_CLIENT.OPEN, InventoryWebView.open);
alt.onServer(INVENTORY_EVENTS.TO_CLIENT.CLOSE, InventoryWebView.close);
alt.on(SYSTEM_EVENTS.META_CHANGED, InventoryWebView.processMetaChange);
