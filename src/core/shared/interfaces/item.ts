import { EQUIPMENT_TYPE } from '../enums/equipmentType';
import { ITEM_TYPE } from '../enums/itemTypes';

export interface ItemData {
    [key: string]: any;
}

export interface Item<T = ItemData> {
    _id?: any;
    name: string;
    dbName?: string;
    uuid?: string;
    description: string;
    /**
     * Auto-color rarity.
     * 0 - Grey
     * 1 - White
     * 2 - Green
     * 3 - Blue
     * 4 - Purple
     * 5 - Orange
     * 6 - Red
     * @type {number}
     * @memberof Item
     */
    buy: number;
    sell: number;
    rarity?: number;
    icon: string;
    quantity: number;
    maxStack?: number;
    behavior: ITEM_TYPE;
    slot?: number;
    hash?: string;
    equipment?: EQUIPMENT_TYPE;
    model?: string;
    data: ItemData | T;
    version?: number;
}

export interface ItemSpecial extends Item {
    dataName: string;
    dataIndex: number;
    isInventory: boolean;
    isEquipment: boolean;
    isToolbar: boolean;
}

export interface DroppedItem {
    item: Item;
    position: { x: number; y: number; z: number };
    gridSpace: number;
    dimension: number;
}
