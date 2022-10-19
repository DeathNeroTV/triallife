import * as alt from 'alt-server';
import { Account } from '../interface/iAccount';
import { DiscordUser } from '../interface/iDiscordUser';
import { InteractionShape } from './extColshape';
import { Vector3 } from '../../shared/interfaces/vector';
import IAttachable from '../../shared/interfaces/iAttachable';
import { playerConst } from '../api/consts/constPlayer';

declare module 'alt-server' {
    export interface Player {
        pendingLogin?: boolean;
        discordToken?: string;
        needsQT?: boolean;
        hasModel?: boolean;
        accountData?: Partial<Account>;
        discord?: DiscordUser;
        data: Character;
        acPosition?: alt.Vector3;
        acHealth?: number;
        acArmour?: number;
        nextPingTime: number;
        nextItemSync: number;
        nextPlayTime: number;
        wanted: number;
        lastToolbarData: { equipped: boolean; slot: number };
        gridSpace: number;
        currentWeather: string;
        lastEnteredVehicleID: number;
        isPushingVehicle: boolean;
        vehiclesSpawned: number;
        currentWaypoint: Vector3 | null;
        currentInteraction: InteractionShape | null;
        lastFactionInvite: alt.Player;
        attachables?: Array<IAttachable> | null;
        hasSatDown?: boolean;
        hasFullySpawned?: boolean;
        voiceRange: number;
    }
}

/**
 * The deprecated version of the triallife playerFuncs API.
 *
 * Use `triallife.player` instead.
 *
 * @deprecated Use the new {@link triallife} const.
 */
export const playerFuncs = playerConst;
