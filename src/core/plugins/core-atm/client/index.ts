import * as alt from 'alt-client';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { ATM_INTERACTIONS } from '../shared/events';
import { LOCALE_ATM_VIEW } from '../shared/locales';

const PAGE_NAME = 'Atm';

class AtmView implements ViewModel {
    static async open() {
        if (isAnyMenuOpen()) {
            return;
        }

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, AtmView.ready);
        view.on(`${PAGE_NAME}:Close`, AtmView.close);
        view.on(`${PAGE_NAME}:Deposit`, AtmView.deposit);
        view.on(`${PAGE_NAME}:Withdraw`, AtmView.withdraw);
        view.on(`${PAGE_NAME}:Transfer`, AtmView.transfer);
        WebViewController.openPages(PAGE_NAME, true, AtmView.close);
        WebViewController.focus();
        WebViewController.showCursor(true);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, AtmView.ready);
        view.off(`${PAGE_NAME}:Close`, AtmView.close);
        view.off(`${PAGE_NAME}:Deposit`, AtmView.deposit);
        view.off(`${PAGE_NAME}:Withdraw`, AtmView.withdraw);
        view.off(`${PAGE_NAME}:Transfer`, AtmView.transfer);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        AtmView.change('banks');
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetLocale`, LOCALE_ATM_VIEW);
    }

    static deposit(amount: number, iban: string) {
        alt.emitServer(ATM_INTERACTIONS.DEPOSIT, amount, iban);
    }

    static withdraw(amount: number, iban: string) {
        alt.emitServer(ATM_INTERACTIONS.WITHDRAW, amount, iban);
    }

    static transfer(amount: number, iban1: string, iban2: string) {
        alt.emitServer(ATM_INTERACTIONS.TRANSFER, amount, iban1, iban2);
    }

    static async change(key: string) {
        if (key !== 'banks' && key !== 'cash') return;
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Update`, alt.Player.local.meta.banks, alt.Player.local.meta.cash);
    }
}

alt.onServer(ATM_INTERACTIONS.OPEN, AtmView.open);
alt.on(SYSTEM_EVENTS.META_CHANGED, AtmView.change);
