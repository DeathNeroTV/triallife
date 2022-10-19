import * as alt from 'alt-client';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { BANK_INTERACTIONS } from '../shared/events';

const PAGE_NAME = 'Bank';

class BankView implements ViewModel {
    static bankName: string = '';
    static bankColor: string = '';
    static charName: string = '';

    static async open(_bankName, _bankColor, _charName) {
        if (isAnyMenuOpen()) return;
        BankView.bankColor = _bankColor;
        BankView.bankName = _bankName;
        BankView.charName = _charName;
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, BankView.ready);
        view.on(`${PAGE_NAME}:Close`, BankView.close);
        view.on(`${PAGE_NAME}:Create`, BankView.create);
        view.on(`${PAGE_NAME}:Remove`, BankView.remove);
        WebViewController.openPages(PAGE_NAME, true, BankView.close);
        WebViewController.focus();
        WebViewController.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);
        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, BankView.ready);
        view.off(`${PAGE_NAME}:Close`, BankView.close);
        view.off(`${PAGE_NAME}:Create`, BankView.create);
        view.off(`${PAGE_NAME}:Remove`, BankView.remove);
        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);
        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        BankView.change('banks');
    }

    static create(type: string) {
        alt.emitServer(BANK_INTERACTIONS.CREATE, BankView.bankName, type);
    }

    static remove(iban: string) {
        alt.emitServer(BANK_INTERACTIONS.REMOVE, iban);
    }

    static async change(key: string) {
        if (key !== 'banks') return;
        const view = await WebViewController.get();
        view.emit(
            `${PAGE_NAME}:Update`,
            BankView.bankName,
            BankView.bankColor,
            BankView.charName,
            alt.Player.local.meta.banks.filter((x) => x.name === BankView.bankName),
        );
    }
}

alt.onServer(BANK_INTERACTIONS.OPEN, BankView.open);
alt.on(SYSTEM_EVENTS.META_CHANGED, BankView.change);
