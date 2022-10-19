import * as alt from 'alt-server';
import { triallife } from '../../../../server/api/triallife';
import { command } from '../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../shared/locale/locale';
import { BARBER_SHOP_LOCALE } from '../../shared/locales';
import { BarbershopView } from './view';

export class BarbershopCommands {
    static init() {}

    @command('barber', '/barber', PERMISSIONS.ADMIN)
    private static handleBarbershop(player: alt.Player) {
        BarbershopView.open(player);
    }

    @command('boffer', BARBER_SHOP_LOCALE.COMMAND_BOFFER, PERMISSIONS.NONE)
    private static handleBarbershopOffer(hairDresser: alt.Player, id: string) {
        // Some kind of item check...
        if (typeof id === 'undefined') {
            return;
        }

        const customer = triallife.systems.identifier.getPlayer(id);
        if (!customer || !customer.valid) {
            triallife.player.emit.notification(hairDresser, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
            return;
        }

        BarbershopView.offer(hairDresser, customer);
    }

    @command('baccept', BARBER_SHOP_LOCALE.COMMAND_BACCEPT, PERMISSIONS.NONE)
    private static handleBarbershopAccept(customer: alt.Player, id: string) {
        // Some kind of item check...
        if (typeof id === 'undefined') {
            return;
        }

        BarbershopView.accept(customer, parseInt(id));
    }
}
