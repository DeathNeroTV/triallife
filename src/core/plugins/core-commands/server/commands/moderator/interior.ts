import alt from 'alt-server';
import { triallife } from '../../../../../server/api/triallife';
import { command } from '../../../../../server/decorators/commands';
import { PlayerEvents } from '../../../../../server/events/playerEvents';
import { TRIALLIFE_EVENTS_PLAYER } from '../../../../../shared/enums/triallife-events';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';

class InteriorCommands {
    @command('setdimension', '/setdimension <ID> <DIMENSION>', PERMISSIONS.ADMIN)
    private static setDimensionCommand(player: alt.Player, id: number, dimension: number) {
        const target = triallife.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) return;

        triallife.player.safe.setDimension(target, dimension);
        triallife.state.set(target, 'dimension', dimension);
        triallife.player.emit.notification(player, `Set dimension of ${target.data.name} to ${target.dimension}!`);
    }

    @command('setinterior', '/setinterior <ID> <INTERIOR>', PERMISSIONS.ADMIN)
    private static setInteriorCommand(player: alt.Player, id: number, interior: string) {
        const target = triallife.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) return;

        triallife.state.set(target, 'interior', interior);
        triallife.player.emit.notification(player, `New Interior of ${target.data.name} is: ${interior}!`);
    }
}

PlayerEvents.on(TRIALLIFE_EVENTS_PLAYER.SELECTED_CHARACTER, (player: alt.Player) => {
    triallife.player.safe.setDimension(player, player.data.dimension);
});
