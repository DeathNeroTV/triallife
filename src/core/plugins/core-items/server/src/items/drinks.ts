import { ITEM_TYPE } from '../../../../../shared/enums/itemTypes';
import { Item } from '../../../../../shared/interfaces/item';
import EFFECTS from '../../../../../shared/enums/effects';

export const drinks: Array<Item> = [
    {
        name: `Wasser`,
        description: `Eine Flasche erfrischendes Wasser.`,
        dbName: 'water',
        icon: 'crate',
        slot: 0,
        sell: 0.49,
        buy: 0.98,
        maxStack: 10,
        quantity: 1,
        rarity: 0,
        behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.CAN_STACK | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_WATER,
            amount: 5,
            sound: 'item_drink',
        },
        version: 1,
    },
    {
        name: `Cola`,
        description: `Eine Flasche erfrischende Cola.`,
        dbName: 'cola',
        icon: 'crate',
        slot: 0,
        sell: 1.09,
        buy: 2.18,
        maxStack: 10,
        quantity: 1,
        rarity: 1,
        behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.CAN_STACK | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_WATER,
            amount: 25,
            sound: 'item_drink',
        },
        version: 1,
    },
    {
        name: `Limonade`,
        description: `Eine Flasche erfrischende Limonade.`,
        dbName: 'lemonade',
        icon: 'crate',
        slot: 0,
        sell: 1.09,
        buy: 2.18,
        maxStack: 10,
        quantity: 1,
        rarity: 1,
        behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.CAN_STACK | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_WATER,
            amount: 15,
            sound: 'item_drink',
        },
        version: 1,
    },
];
