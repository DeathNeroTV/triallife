import { ITEM_TYPE } from '../../../../../shared/enums/itemTypes';
import { Item } from '../../../../../shared/interfaces/item';
import EFFECTS from '../../../../../shared/enums/effects';

export const food: Array<Item> = [
    {
        name: `Hamburger`,
        description: `Ein leckerer Hamburger.`,
        dbName: 'burger',
        icon: 'burger',
        slot: 0,
        sell: 1.25,
        buy: 2.5,
        maxStack: 10,
        quantity: 1,
        rarity: 1,
        behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.CAN_STACK | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_FOOD,
            amount: 5,
            sound: 'item_eat',
        },
        version: 1,
    },
    {
        name: `Cheeseburger`,
        description: `Ein leckerer Cheeseburger.`,
        dbName: 'cheeseburger',
        icon: 'burger',
        slot: 0,
        sell: 1.25,
        buy: 2.5,
        quantity: 1,
        rarity: 1,
        behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.CAN_STACK | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_FOOD,
            amount: 25,
            sound: 'item_eat',
        },
        version: 1,
    },
    {
        name: `Brot`,
        description: `Ein Leib Brot, bestehend aus 5 Stücken.`,
        dbName: 'bread',
        icon: 'bread',
        slot: 0,
        sell: 0.69,
        buy: 1.19,
        quantity: 5,
        rarity: 0,
        behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.CAN_STACK | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_FOOD,
            amount: 3,
            sound: 'item_eat',
        },
        version: 1,
    },
];
