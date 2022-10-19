import { Vector3 } from './vector';
import { DEFAULT_CONFIG } from '../../server/triallife/main';
import { Appearance } from './appearance';
import { CharacterInfo } from './characterInfo';
import { Item } from './item';
import { CHARACTER_PERMISSIONS } from '../flags/permissionFlags';

export interface Character {
    [key: string]: any;
    _id?: any;
    character_id?: number;
    account_id: any;
    dimension: number;
    pos: Partial<Vector3>;
    name: string;
    cash: number;
    health: number;
    armour: number;
    food: number;
    water: number;
    isDead: boolean;
    hours: number;
    wanted: number;
    characterPermission?: CHARACTER_PERMISSIONS | null;
    appearance: Partial<Appearance>;
    info: Partial<CharacterInfo>;
    inventory: Array<Partial<Item>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;
    faction: string | null;
    banned: { state: boolean; reason: string };
}

export const CharacterDefaults: Partial<Character> = {
    pos: DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS as Vector3,
    cash: DEFAULT_CONFIG.PLAYER_CASH,
    appearance: {},
    info: {},
    food: 100,
    water: 100,
    isDead: false,
    health: 199,
    armour: 0,
    hours: 0,
    wanted: 0,
    banned: { state: false, reason: '' },
};
