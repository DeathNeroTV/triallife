import * as alt from 'alt-server';

import atms from '../../../../shared/information/atms';
import { ServerBlipController } from '../../../../server/systems/blip';
import { InteractionController } from '../../../../server/systems/interaction';
import { LocaleController } from '../../../../shared/locale/locale';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import Database from '@stuyk/ezmongodb';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { ATM_INTERACTIONS } from '../../shared/events';
import { triallife } from '../../../../server/api/triallife';
import { BankInfo } from '../../../../shared/interfaces/bank';

const INTERACTION_RANGE = 1.5;
class InternalFunctions {
    static async deposit(player: alt.Player, amount: number, _id: string): Promise<void> {
        if (player.data.cash < amount) {
            triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }
        if (!triallife.player.currency.sub(player, amount)) {
            triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }
        if (!triallife.player.currency.addBank(player, amount, _id)) {
            triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }
        var parts = amount.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        triallife.player.emit.notification(player, `~r~- ${parts.join(',')} $`);
        triallife.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }

    static async withdraw(player: alt.Player, amount: number, _id: string): Promise<void> {
        if (!triallife.player.currency.subBank(player, amount, _id)) {
            triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }
        if (!triallife.player.currency.add(player, amount)) {
            triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }
        var parts = amount.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        triallife.player.emit.notification(player, `~g~+ ${parts.join(',')} $`);
        triallife.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }

    static async transfer(player: alt.Player, amount: number, _id: string, iban: string): Promise<void> {
        const bankPlayer = await Database.fetchData<BankInfo>('_id', _id, Collections.Banks);
        const bankTarget = await Database.fetchData<BankInfo>('iban', iban, Collections.Banks);
        const target = [...alt.Player.all].find((x) => x.data && bankTarget.type === 'private' && x.data._id.toString() === bankTarget.owner);
        var parts = amount.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        if (!bankPlayer || !bankTarget) {
            triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            triallife.player.sync.currencyData(player);
            return;
        }
        if (amount > bankPlayer.amount) {
            triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            triallife.player.sync.currencyData(player);
            return;
        }
        if (!triallife.player.currency.subBank(player, amount, bankPlayer._id)) {
            triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            triallife.player.sync.currencyData(player);
            return;
        }
        if (target) {
            if (!triallife.player.currency.addBank(target, amount, bankTarget._id)) {
                triallife.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                triallife.player.sync.currencyData(player);
                return;
            }
            triallife.player.emit.notification(target, `~g~+${parts.join(',')} $~w~-~y~Überweisung`);
            triallife.player.emit.soundFrontend(target, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        } else await Database.updatePartialData(bankTarget._id, { amount: bankTarget.amount + amount }, Collections.Banks);
        triallife.player.sync.currencyData(player);
        triallife.player.emit.notification(player, `~r~-${parts.join(',')} $~w~-~y~Uberweisung`);
        triallife.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }

    static async transferCash(player: alt.Player, amount: number, id: string | number): Promise<void> {
        const target: alt.Player = [...alt.Player.all].find((x) => `${x.id}` === `${id}`);
        if (!target) return;
        if (target.id === player.id) return;
        if (amount > player.data.cash) return;
        if (!triallife.player.currency.sub(player, amount)) return;
        if (!triallife.player.currency.add(target, amount)) return;
        var parts = amount.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const msgTarget = LocaleController.get(LOCALE_KEYS.PLAYER_RECEIVED_BLANK, `~g~+ ${parts.join(',')} $`, player.data.name);
        const msgPlayer = LocaleController.get(LOCALE_KEYS.PLAYER_RECEIVED_BLANK, `~r~- ${parts.join(',')} $`, target.data.name);
        triallife.player.emit.notification(target, msgTarget);
        triallife.player.emit.notification(player, msgPlayer);
        triallife.player.emit.soundFrontend(target, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        triallife.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }
}

export class AtmFunctions {
    static init() {
        for (let i = 0; i < atms.length; i++) {
            const position = atms[i];
            ServerBlipController.append({
                text: 'Bankautomat',
                color: 11,
                sprite: 207,
                scale: 1,
                shortRange: true,
                pos: position,
                uid: `Bankautomat-${i}`,
            });
            InteractionController.add({
                position,
                description: 'Bankautomat benutzen',
                range: INTERACTION_RANGE,
                callback: (player: alt.Player) => alt.emitClient(player, ATM_INTERACTIONS.OPEN),
                isPlayerOnly: true,
                debug: false,
            });
        }
    }
}

alt.onClient(ATM_INTERACTIONS.DEPOSIT, InternalFunctions.deposit);
alt.onClient(ATM_INTERACTIONS.WITHDRAW, InternalFunctions.withdraw);
alt.onClient(ATM_INTERACTIONS.TRANSFER, InternalFunctions.transfer);
