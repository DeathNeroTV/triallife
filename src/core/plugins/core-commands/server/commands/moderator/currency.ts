import Database from '@stuyk/ezmongodb';
import alt from 'alt-server';
import { triallife } from '../../../../../server/api/triallife';
import { command } from '../../../../../server/decorators/commands';
import { Collections } from '../../../../../server/interface/iDatabaseCollections';
import { CurrencyTypes } from '../../../../../shared/enums/currency';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { BankInfo } from '../../../../../shared/interfaces/bank';

class CurrencyCommands {
    @command(['cash', 'setcash'], '/setcash [amount] [id]', PERMISSIONS.ADMIN | PERMISSIONS.OWNER)
    private static setCashCommand(player: alt.Player, amount: string, id: string | null = null): void {
        if (id === null || id === undefined) {
            triallife.player.currency.set(player, parseFloat(amount));
            return;
        }

        const target = triallife.systems.identifier.getPlayer(id);
        if (!target) {
            triallife.player.emit.notification(player, 'Spieler wurde nicht gefunden');
            return;
        }

        triallife.player.currency.set(target, parseFloat(amount));
    }

    @command('addbank', '/addbank [type] [amount] [iban]', PERMISSIONS.ADMIN | PERMISSIONS.OWNER)
    private static async addBankCommand(player: alt.Player, amount: string, iban: string | null = null): Promise<void> {
        var bank = await Database.fetchData<BankInfo>('iban', iban, Collections.Banks);
        if (iban === null || iban === undefined) {
            bank = (await triallife.player.currency.getAllBankAccountsPlayer(player)).find((x) => x.type === 'private');
            await triallife.player.currency.setBank(player, parseFloat(amount), bank.iban);
            return;
        }
        const target = triallife.systems.identifier.getPlayerByName(bank.owner);
        if (!target) {
            triallife.player.emit.notification(player, 'Spieler wurde nicht gefunden');
            return;
        }
        triallife.player.currency.addBank(target, parseFloat(amount), bank.iban);
    }

    @command('addcash', '/addcash [amount] [id]', PERMISSIONS.ADMIN | PERMISSIONS.OWNER)
    private static addCashCommand(player: alt.Player, amount: string, id: string | null = null): void {
        if (id === null || id === undefined) {
            triallife.player.currency.set(player, parseFloat(amount));
            return;
        }
        const target = triallife.systems.identifier.getPlayer(id);
        if (!target) {
            triallife.player.emit.notification(player, 'Spieler wurde nicht gefunden');
            return;
        }
        triallife.player.currency.add(target, parseFloat(amount));
    }

    @command('setbank', '/setbank [amount] [id]', PERMISSIONS.ADMIN | PERMISSIONS.OWNER)
    private static async setBankCommand(player: alt.Player, amount: string, id: string | null = null): Promise<void> {
        const banks = await Database.fetchAllByField<BankInfo>('type', 'private', Collections.Banks);
        if (id === null || id === undefined) {
            const index = banks.findIndex((x) => x.owner === player.data.name);
            if (index !== -1) triallife.player.currency.setBank(parseFloat(amount), banks[index].iban);
            return;
        }
        const target = triallife.systems.identifier.getPlayer(id);
        if (!target) {
            triallife.player.emit.notification(player, 'Spieler wurde nicht gefunden');
            return;
        }
        const index = banks.findIndex((x) => x.owner === target.data.name);
        triallife.player.currency.setBank(parseFloat(amount), banks[index].iban);
    }
}
