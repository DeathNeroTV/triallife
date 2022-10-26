import * as alt from 'alt-server';
import { Item } from '../../shared/interfaces/item';
import EFFECT from '../../shared/enums/effects';
import { INVENTORY_TYPE } from '../../shared/enums/inventoryTypes';
import { ItemEffects } from '../systems/itemEffects';
import { triallife } from '../api/triallife';

function handleItemEvent(player: alt.Player, item: Item, slot: number, type: INVENTORY_TYPE | string) {
    if (!item || !item.data || !item.data.amount) {
        return;
    }

    triallife.player.safe.addHealth(player, item.data.amount, false);
    triallife.player.inventory.notify(player, `+${item.data.amount} Gesundheit`);

    if (item.data.sound) {
        triallife.player.emit.sound3D(player, item.data.sound, player);
    }
}

ItemEffects.add(EFFECT.EFFECT_HEAL, handleItemEvent);
