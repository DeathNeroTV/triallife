import * as alt from 'alt-server';
import { triallife } from '../../../../../server/api/triallife';
import { command } from '../../../../../server/decorators/commands';
import { ItemFactory } from '../../../../../server/systems/item';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { Item } from '../../../../../shared/interfaces/item';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
import { deepCloneObject } from '../../../../../shared/utility/deepCopy';

class InventoryCommands {
    @command('clearinventory', LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_INVENTORY, '/clearinventory'), PERMISSIONS.ADMIN)
    private static clearInventoryCommand(player: alt.Player) {
        triallife.state.set(player, 'inventory', []);
        triallife.player.sync.inventory(player);
    }

    @command('cleartoolbar', LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_TOOLBAR, '/cleartoolbar'), PERMISSIONS.ADMIN)
    private static clearToolbeltCommand(player: alt.Player) {
        triallife.state.set(player, 'toolbar', []);
        triallife.player.sync.inventory(player);
    }

    @command('clearequipment', LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_EQUIPMENT, '/clearequipment'), PERMISSIONS.ADMIN)
    private static clearEquipmentCommand(player: alt.Player) {
        triallife.state.set(player, 'equipment', []);
        triallife.player.sync.inventory(player);
    }

    @command('getitem', LocaleController.get(LOCALE_KEYS.COMMAND_GET_ITEM, '/getitem'), PERMISSIONS.ADMIN)
    private static async handleGetItem(player: alt.Player, ...args) {
        const fullItemName = args.join(' ');
        if (fullItemName.length <= 1) {
            triallife.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.ITEM_DOES_NOT_EXIST, fullItemName));
            return;
        }

        const item = await ItemFactory.getByName(fullItemName);
        if (!item) {
            triallife.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.ITEM_DOES_NOT_EXIST, fullItemName));
            return;
        }

        item.quantity = 1;

        const itemClone = deepCloneObject<Item>(item);
        let slotInfo = triallife.player.inventory.getFreeInventorySlot(player);
        triallife.player.inventory.inventoryAdd(player, itemClone, slotInfo.slot);

        triallife.state.set(player, 'inventory', player.data.inventory, true);
        triallife.player.sync.inventory(player);
        triallife.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.ITEM_WAS_ADDED_INVENTORY, item.name));
    }
}
