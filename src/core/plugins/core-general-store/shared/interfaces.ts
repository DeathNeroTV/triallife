import { Item } from '../../../shared/interfaces/item';
import { GENERAL_STORE_PAGE } from './enums';

export interface IShopPrice {
    price: number;
    id: number;
}

export interface IGeneralStore {
    uid?: string;
    hiddenPages: Array<GENERAL_STORE_PAGE>;
    items: Array<Array<Item>>;
    hiddenComponents: {
        [GENERAL_STORE_PAGE.FOOD]?: Array<number>;
        [GENERAL_STORE_PAGE.WATER]?: Array<number>;
        [GENERAL_STORE_PAGE.GENERAL]?: Array<number>;
    };

    pagePrices: {
        [GENERAL_STORE_PAGE.FOOD]?: number;
        [GENERAL_STORE_PAGE.WATER]?: number;
        [GENERAL_STORE_PAGE.GENERAL]?: number;
    };

    itemPrices: {
        [GENERAL_STORE_PAGE.FOOD]?: Array<IShopPrice>;
        [GENERAL_STORE_PAGE.WATER]?: Array<IShopPrice>;
        [GENERAL_STORE_PAGE.GENERAL]?: Array<IShopPrice>;
    };
}
