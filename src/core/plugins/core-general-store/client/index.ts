import * as alt from 'alt-client';
import * as native from 'natives';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { sleep } from '../../../client/utility/sleep';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Item } from '../../../shared/interfaces/item';
import { SHOP_INTERACTIONS } from '../shared/events';
import { IGeneralStore } from '../shared/interfaces';

const PAGE_NAME = 'GeneralStore';

let storeData: IGeneralStore = null;
let isOpen = false;

class InternalFunctions implements ViewModel {
    static async open(_storeData: IGeneralStore) {
        if (isAnyMenuOpen()) return;
        storeData = _storeData;
        alt.toggleGameControls(false);
        await WebViewController.setOverlaysVisible(false);
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.on(`${PAGE_NAME}:PurchaseAll`, InternalFunctions.purchaseAll);
        alt.Player.local.isMenuOpen = true;
        isOpen = true;
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);
        alt.setWatermarkPosition(2);
    }

    static async close() {
        await sleep(100);
        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);
        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.off(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.off(`${PAGE_NAME}:PurchaseAll`, InternalFunctions.purchaseAll);
        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);
        alt.Player.local.isMenuOpen = false;
        alt.emitServer(SHOP_INTERACTIONS.EXIT);
        isOpen = false;
        alt.setWatermarkPosition(4);
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetData`, storeData);
        view.emit(`${PAGE_NAME}:SetBankData`, alt.Player.local.meta.banks.find((x) => x.type === 'private').amount + alt.Player.local.meta.cash);
        native.doScreenFadeIn(100);
    }

    static async handleMetaChanged(key: string, _items: Array<Item>, _oldValue: any) {
        if (key === 'bank' || (key === 'cash' && isOpen)) {
            const view = await WebViewController.get();
            view.emit(`${PAGE_NAME}:SetBankData`, alt.Player.local.meta.banks.find((x) => x.type === 'private').amount + alt.Player.local.meta.cash);
        }
    }

    static purchaseAll(items: Array<Item>, uid: string) {
        alt.emitServer(SHOP_INTERACTIONS.PURCHASE_ALL, items, uid);
    }
}

alt.on(SYSTEM_EVENTS.META_CHANGED, InternalFunctions.handleMetaChanged);
alt.onServer(SHOP_INTERACTIONS.OPEN, InternalFunctions.open);
