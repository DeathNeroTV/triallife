import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';

export const FACTION_CONFIG = {
    FactionAdmins: [
        //
        PERMISSIONS.ADMIN,
        PERMISSIONS.OWNER,
    ],
    FactionActionTickTime: 5000, // Highly recommended to keep this slow
};
