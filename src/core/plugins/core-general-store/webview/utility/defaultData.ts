import { GENERAL_STORE_PAGE } from '../../shared/enums';

export const DEFAULT_GENERAL_STORE = {
    uid: 'general-store-0',
    hiddenComponents: {},
    hiddenPages: [],
    pagePrices: {
        [GENERAL_STORE_PAGE.FOOD]: 2.5,
        [GENERAL_STORE_PAGE.WATER]: 1.5,
        [GENERAL_STORE_PAGE.GENERAL]: 5.0,
    },
    itemPrices: {
        [GENERAL_STORE_PAGE.FOOD]: [{ id: 0, price: 2.5 }],
        [GENERAL_STORE_PAGE.WATER]: [{ id: 0, price: 1.5 }],
        [GENERAL_STORE_PAGE.GENERAL]: [{ id: 0, price: 5.5 }],
    },
    items: [[], [], []],
};
