import { LOCALE_GENERAL } from '../../shared/locales';
import { GENERAL_STORE_PAGE } from '../../shared/enums';

export const EXAMPLE_GENERAL_DATA = [
    {
        pageName: LOCALE_GENERAL.LABEL_FOOD,
        ids: [0],
        internalID: GENERAL_STORE_PAGE.FOOD,
        startValue: 0,
        items: [{ name: 'Sandwich', quantity: 0, buy: 1.59 }],
    },
    {
        pageName: LOCALE_GENERAL.LABEL_WATER,
        ids: [1],
        internalID: GENERAL_STORE_PAGE.WATER,
        startValue: 0,
        items: [{ name: 'Wasser', quantity: 0, buy: 0.59 }],
    },
    {
        pageName: LOCALE_GENERAL.LABEL_GENERAL,
        ids: [2],
        internalID: GENERAL_STORE_PAGE.GENERAL,
        startValue: 0,
        items: [{ name: 'Brechstange', quantity: 0, buy: 4.99 }],
    },
];
