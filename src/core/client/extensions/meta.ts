import { Appearance } from '../../shared/interfaces/appearance';
import { BankInfo } from '../../shared/interfaces/bank';
import { Item } from '../../shared/interfaces/item';

export interface Meta {
    admin: { [x: string]: Array<any> };
    permissionLevel: number;
    isDead: boolean;
    gridSpace: number;
    voice: boolean;
    banks: Array<Partial<BankInfo>>;
    voiceRange: number;
    cash: number;
    food: number;
    water: number;
    appearance: Appearance;
    inventory: Array<Partial<Item>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;
}
