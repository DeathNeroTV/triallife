import EFFECT from '../../../../../shared/enums/effects';
import { ITEM_TYPE } from '../../../../../shared/enums/itemTypes';
import { Item } from '../../../../../shared/interfaces/item';

export const utility: Array<Item> = [
    {
        name: `Werkzeugkasten`,
        description: `Für die Reperatur von Fahrzeugen.`,
        dbName: 'repair-kit',
        icon: 'toolbox',
        slot: 0,
        sell: 1250.0,
        buy: 25000.0,
        maxStack: 1,
        quantity: 1,
        behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.CONSUMABLE | ITEM_TYPE.SKIP_CONSUMABLE,
        data: {
            event: EFFECT.EFFECT_REPAIR,
        },
        version: 1,
    },
    {
        name: `Erste Hilfe Koffer`,
        description: `Bei Verletzungen jeglicher Art hilfreich.`,
        dbName: 'first-aid-kit',
        icon: 'toolbox',
        slot: 0,
        sell: 125.0,
        buy: 250.0,
        maxStack: 1,
        quantity: 1,
        behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.CONSUMABLE | ITEM_TYPE.SKIP_CONSUMABLE,
        data: {
            amount: 25,
            event: EFFECT.EFFECT_HEAL,
        },
        version: 1,
    },
];
