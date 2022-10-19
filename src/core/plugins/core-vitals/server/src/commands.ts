import * as alt from 'alt-server';
import { VITAL_NAMES } from '../../shared/enums';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { VitalsSystem } from './system';
import { command } from '../../../../server/decorators/commands';
import { triallife } from '../../../../server/api/triallife';

class VitalsCommands {
    @command('setfood', '/setfood [amount]', PERMISSIONS.ADMIN)
    private static setFoodCommand(player: alt.Player, commandValue: string) {
        let value = parseInt(commandValue);

        if (isNaN(value)) {
            return;
        }

        value = VitalsSystem.normalizeVital(value);
        VitalsSystem.adjustVital(player, VITAL_NAMES.FOOD, value, true);
    }

    @command('setwater', '/setwater [amount]', PERMISSIONS.ADMIN)
    private static setWaterCommand(player: alt.Player, commandValue: string) {
        let value = parseInt(commandValue);

        if (isNaN(value)) {
            return;
        }

        value = VitalsSystem.normalizeVital(value);
        VitalsSystem.adjustVital(player, VITAL_NAMES.WATER, value, true);
    }
}
