import * as alt from 'alt-server';
import { ServerBlipController } from '../../../../server/systems/blip';
import { InteractionController } from '../../../../server/systems/interaction';
import { LocaleController } from '../../../../shared/locale/locale';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { SHOP_INTERACTIONS } from '../../shared/events';
import { triallife } from '../../../../server/api/triallife';
import { Item } from '../../../../shared/interfaces/item';
import { IGeneralStore } from '../../shared/interfaces';
import { Blip } from '../../../../shared/interfaces/blip';
import { PolygonShape } from '../../../../server/extensions/extColshape';
import { Interaction } from '../../../../shared/interfaces/interaction';
import generalStores from './stores';
import { deepCloneObject } from '../../../../shared/utility/deepCopy';
import { GENERAL_STORE_PAGE } from '../../shared/enums';
import { Vector3 } from '../../../../shared/interfaces/vector';
import { sha256 } from '../../../../server/utility/encryption';
import { ITEM_TYPE } from '../../../../shared/enums/itemTypes';
import { food } from '../../../core-items/server/src/items/food';
import { drinks } from '../../../core-items/server/src/items/drinks';
import { utility } from '../../../core-items/server/src/items/utility';
import { isFlagEnabled } from '../../../../shared/utility/flags';

const DefaultItemData: IGeneralStore = {
    hiddenComponents: {},
    hiddenPages: [],
    pagePrices: {
        [GENERAL_STORE_PAGE.FOOD]: 2.5,
        [GENERAL_STORE_PAGE.WATER]: 1.5,
        [GENERAL_STORE_PAGE.GENERAL]: 5.0,
    },
    itemPrices: {},
    items: [[], [], []],
};

const itemRef: Item = {
    name: `Item`,
    description: `An Item`,
    icon: 'crate',
    slot: 0,
    quantity: 1,
    buy: 0.0,
    sell: 0.0,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.CONSUMABLE | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.CAN_STACK,
    data: {},
};

let generalStoreList: Array<IGeneralStore> = [];
let isGeneralStoresReady = false;

export class ShopFunctions {
    static init() {
        for (let i = 0; i < generalStores.length; i++) {
            const position = generalStores[i];
            const uid = `247-shop-${i}`;
            const defaultBlip: Blip = {
                text: '24/7 Laden',
                color: 52,
                sprite: 52,
                scale: 1,
                shortRange: true,
                pos: position,
                uid,
            };
            const defaultInteraction: Interaction = {
                position,
                description: 'Gegenstände kaufen',
            };
            if (generalStores[i].vertices && generalStores[i].vertices.length > 0) {
                const polygon = new PolygonShape(position.z, position.z + 2.5, generalStores[i].vertices, true, false);
                polygon.addEnterCallback(ShopFunctions.enter);
                polygon.addLeaveCallback(ShopFunctions.leave);
                polygon.isPlayerOnly = true;
            }
            const generalData = deepCloneObject<IGeneralStore>(DefaultItemData);
            generalData.uid = uid;
            ShopFunctions.create(position, generalData, deepCloneObject(defaultBlip), deepCloneObject(defaultInteraction));
            isGeneralStoresReady = true;
        }
    }

    static async create(position: Vector3, store: IGeneralStore, blip: Blip, interaction: Interaction) {
        if (!store.uid) store.uid = sha256(JSON.stringify(store));
        blip.uid = store.uid;
        blip.pos = position;
        interaction.position = {
            x: position.x,
            y: position.y,
            z: position.z - 1,
        };
        interaction.isPlayerOnly = true;
        interaction.callback = (player: alt.Player) => {
            const data = ShopFunctions.getGeneralStoreData(store.uid);
            alt.emitClient(player, SHOP_INTERACTIONS.OPEN, data, store.uid);
        };
        const storeItems = [[...food], [...drinks], [...utility]];
        store.items = storeItems;
        ServerBlipController.append(blip);
        InteractionController.add(interaction);
        generalStoreList.push(store);
    }

    static getGeneralStoreData(uid: string): IGeneralStore {
        const index = generalStoreList.findIndex((x) => x.uid === uid);
        if (index <= -1) return null;
        return generalStoreList[index];
    }

    static async overrideGeneralData(uid: string, data: IGeneralStore) {
        await this.waitForReady();
        const index = generalStoreList.findIndex((x) => x.uid === uid);
        if (index <= -1) {
            console.error(new Error(`Clothing store with ${uid} does not exist.`));
            return;
        }
        data.uid = generalStoreList[index].uid;
        generalStoreList[index] = data;
    }

    private static waitForReady(): Promise<void> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!isGeneralStoresReady) return;
                alt.clearInterval(interval);
                return resolve();
            }, 100);
        });
    }

    static async exit(player: alt.Player) {
        triallife.player.sync.inventory(player);
    }

    static async purchase(player: alt.Player, shopUID: string, item: Partial<Item>, noSound = false): Promise<boolean> {
        const index = generalStoreList.findIndex((x) => x.uid === shopUID);
        if (index <= -1) {
            triallife.player.emit.sound2D(player, 'item_error');
            return false;
        }
        let totalCost: number = item.quantity * item.buy;
        if (totalCost >= 1) {
            const banks = await triallife.player.currency.getAllBankAccountsPlayer(player);
            const index = banks.findIndex((x) => x.type === 'private');
            if (index !== -1) {
                if (player.data.cash + banks[index].amount < totalCost) {
                    triallife.player.emit.sound2D(player, 'item_error');
                    return false;
                }
            } else {
                if (player.data.cash < totalCost) {
                    triallife.player.emit.sound2D(player, 'item_error');
                    return false;
                }
            }
        }
        const newItem = deepCloneObject<Item>(itemRef);
        newItem.name = item.name;
        newItem.description = item.description;
        newItem.icon = item.icon;
        newItem.data = { ...item.data };
        newItem.quantity = item.quantity;
        newItem.sell = item.buy / 2;
        newItem.buy = item.buy;
        await alt.Utils.wait(500);
        let didGetAdded = false;
        const openSlot = triallife.player.inventory.getFreeInventorySlot(player);
        if (!openSlot) {
            triallife.player.emit.sound2D(player, 'item_error');
            return false;
        }
        didGetAdded = triallife.player.inventory.inventoryAdd(player, newItem, openSlot.slot);
        if (!didGetAdded) {
            triallife.player.emit.sound2D(player, 'item_error');
            return false;
        }
        if (totalCost >= 1) {
            if (!triallife.player.currency.subAllCurrencies(player, totalCost)) {
                triallife.player.emit.sound2D(player, 'item_error');
                return false;
            }
        }
        await triallife.state.setBulk(player, { inventory: player.data.inventory }, true);
        triallife.player.sync.inventory(player);
        if (!noSound) triallife.player.emit.sound2D(player, 'item_purchase');
        triallife.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.ITEM_WAS_ADDED_INVENTORY, `${newItem.quantity}x ${newItem.name}`));
        return true;
    }

    static async purchaseAll(player: alt.Player, items: Array<Item>, shopUID: string) {
        if (items.length <= 0) return;
        for (const item of items) {
            if (!isFlagEnabled(item.behavior, ITEM_TYPE.CAN_STACK) && item.quantity >= 2) {
                for (let i = 0; i < item.quantity; i++) {
                    const clonedRef = deepCloneObject<Item>(item);
                    clonedRef.quantity = 1;
                    const result = await ShopFunctions.purchase(player, shopUID, clonedRef, true);
                    triallife.player.emit.soundFrontend(player, result ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS'); 
                }
            } else {
                const result = await ShopFunctions.purchase(player, shopUID, item, true);
                triallife.player.emit.soundFrontend(player, result ? 'Hack_Success' : 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            }
        }
        triallife.player.emit.sound2D(player, 'item_purchase');
    }

    static enter(_polygon: PolygonShape, player: alt.Player) {
        if (!(player instanceof alt.Player)) return;
        triallife.player.emit.sound2D(player, 'shop_enter', 0.5);
    }

    static leave(_polygon: PolygonShape, player: alt.Player) {
        if (!(player instanceof alt.Player)) return;
        triallife.player.emit.sound2D(player, 'shop_enter', 0.5);
    }
}

alt.onClient(SHOP_INTERACTIONS.EXIT, ShopFunctions.exit);
alt.onClient(SHOP_INTERACTIONS.PURCHASE_ALL, ShopFunctions.purchaseAll);
