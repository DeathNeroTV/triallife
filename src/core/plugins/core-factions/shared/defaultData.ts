import { Complete } from '../../../shared/utility/complete';
import { FactionRank, FactionSettings, RankPermissions } from './interfaces';

export const DefaultRanks: Array<FactionRank> = [
    {
        name: 'Owner',
        actionPermissions: [],
        rankPermissions: {
            addMembers: true,
            bankAdd: true,
            bankRemove: true,
            kickMembers: true,
            manageMembers: true,
            manageRanks: true,
            manageRankPermissions: true,
        },
        vehicles: [],
        weight: 99,
    },
    {
        name: 'Member',
        actionPermissions: [],
        rankPermissions: {
            addMembers: false,
            bankAdd: false,
            bankRemove: false,
            kickMembers: false,
            manageMembers: false,
            manageRanks: false,
            manageRankPermissions: false,
        },
        vehicles: [],
        weight: 1,
    },
];

export const AllRankPermissions: Complete<RankPermissions> = {
    addMembers: false,
    bankAdd: false,
    bankRemove: false,
    kickMembers: false,
    manageMembers: false,
    manageRanks: false,
    manageRankPermissions: false,
    manageVehicles: false,
};

export const DefaultSettings: Partial<FactionSettings> = {
    blip: -1,
    blipColor: 0,
    maxVehicles: 0,
    motd: '',
    parkingSpots: [],
    position: { x: 0.0, y: 0.0, z: 0.0 },
    vehicles: [],
};
