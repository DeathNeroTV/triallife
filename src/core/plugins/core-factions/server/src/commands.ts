import * as alt from 'alt-server';
import { triallife } from '../../../../server/api/triallife';
import { command } from '../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { FactionFuncs } from './funcs';
import { FactionHandler } from './handler';
import { FactionPlayerFuncs } from './playerFuncs';

const lastInvite: { [character: string]: string } = {};

export class FactionCommands {
    static init() {
        alt.onClient(FACTION_EVENTS.PROTOCOL.OPEN, FactionCommands.handleOpenFactionPanel);
    }

    /**
     * It creates a new faction.
     * @param player - alt.Player - The player who created the faction.
     * @param {string[]} name - The name of the faction.
     * @returns The result of the add function.
     */
    @command('fcreate', '/fcreate [type: (Neutral, State, Gang)] [name] - Open faction panel if in faction.', PERMISSIONS.ADMIN)
    private static async handleFactionCreate(player: alt.Player, type: string, ...name: string[]) {
        const factionName = name.join(' ');
        const result = await FactionHandler.add(player.data._id, {
            bank: 0,
            canDisband: true,
            name: factionName,
            type: type.toUpperCase(),
        });

        if (!result.status) {
            triallife.player.emit.notification(player, result.response);
            return;
        }

        const id = result.response;
        triallife.player.emit.notification(player, `Created Faction with ID: ${id}`);
    }

    @command('fopen', '/fopen - Open faction panel if in faction.', PERMISSIONS.NONE)
    private static handleOpenFactionPanel(player: alt.Player) {
        if (!player.data.faction) {
            triallife.player.emit.notification(player, 'Sie sind in keiner Firma.');
            return;
        }

        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            triallife.player.emit.notification(player, 'Sie sind in keiner Firma.');
            return;
        }
        alt.emitClient(player, FACTION_EVENTS.PROTOCOL.OPEN, faction);
    }

    @command('fjoin', '/fjoin [uid] - Quits Current Faction & Joins Another', PERMISSIONS.ADMIN)
    private static async handleForceJoinFaction(player: alt.Player, uid: string) {
        if (!uid) {
            triallife.player.emit.notification(player, `You must specify a faction UID to join.`);
            return;
        }

        const faction = FactionHandler.get(uid);
        if (!faction) {
            triallife.player.emit.notification(player, `That faction does not exist.`);
            return;
        }

        if (player.data.faction) {
            const currentFaction = FactionHandler.get(player.data.faction);
            if (currentFaction) {
                await FactionFuncs.kickMember(currentFaction, player.data._id);
            }
        }

        FactionFuncs.addMember(faction, player.data._id);
        triallife.player.emit.notification(player, `Moved to Faction: ${faction.name}`);
    }

    @command('finvite', '/finvite [id_or_first_last] - Invite to faction', PERMISSIONS.NONE)
    private static async handleFactionInvite(player: alt.Player, idOrName: string) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            triallife.player.emit.notification(player, `You are not in a faction.`);
            return;
        }

        const rank = FactionPlayerFuncs.getPlayerFactionRank(player);
        if (!rank) {
            triallife.player.emit.notification(player, `You have no rank in the faction?`);
            return;
        }

        if (!rank.rankPermissions.addMembers) {
            triallife.player.emit.notification(player, `No permission to invite members to faction.`);
            return;
        }

        let target: alt.Player;

        if (isNaN(parseInt(idOrName))) {
            target = alt.Player.all.find((x) => x && x.data && x.data.name.toLowerCase().includes(idOrName.toLowerCase()));
        } else {
            target = triallife.systems.identifier.getPlayer(idOrName);
        }

        if (!target || !target.data || !target.valid || !idOrName || target === player) {
            triallife.player.emit.notification(player, `/finvite [id_or_first_last]`);
            return;
        }

        if (target.data.faction) {
            triallife.player.emit.notification(player, `${target.data.name} is already in a faction.`);
            return;
        }

        lastInvite[target.data._id] = player.data.faction;
        triallife.player.emit.notification(player, `${target.data.name} was invited to the faction.`);
        triallife.player.emit.notification(target, `${player.data.name} invited you to faction ${faction.name}.`);
        triallife.player.emit.notification(target, `Type '/faccept' to join`);
    }

    @command('faccept', '/faccept - Join last invited to faction', PERMISSIONS.NONE)
    private static async handleFactionAccept(player: alt.Player) {
        if (player.data.faction) {
            triallife.player.emit.notification(player, `Already in a faction.`);
            delete lastInvite[player.data._id];
            return;
        }

        if (!lastInvite[player.data._id]) {
            triallife.player.emit.notification(player, `Faction invite expired.`);
            delete lastInvite[player.data._id];
            return;
        }

        const faction = FactionHandler.get(lastInvite[player.data._id]);
        if (!faction) {
            triallife.player.emit.notification(player, `Faction invite expired.`);
            delete lastInvite[player.data._id];
            return;
        }

        delete lastInvite[player.data._id];
        const result = FactionFuncs.addMember(faction, player.data._id);
        if (!result) {
            triallife.player.emit.notification(player, `Failed to join faction.`);
            return;
        }

        triallife.player.emit.notification(player, `Joined faction ${faction.name}`);
    }

    @command('fsetowner', '/fsetowner <player_id> - Set a member inside a faction to the owner of their faction.', PERMISSIONS.ADMIN)
    private static async handleSetOwner(player: alt.Player, id: string) {
        const target = triallife.systems.identifier.getPlayer(id);
        if (!target) {
            triallife.player.emit.notification(player, 'Cannot find player with that ID.');
            return;
        }

        const faction = FactionHandler.get(target.data.faction);
        if (!faction) {
            triallife.player.emit.notification(player, `Target player is not in a faction.`);
            return;
        }

        const didUpdate = await FactionFuncs.setOwner(faction, target.data._id.toString());
        if (!didUpdate) {
            triallife.player.emit.notification(player, `${target.data.name} could not be set the owner of ${faction.name}.`);
            return;
        }

        triallife.player.emit.notification(player, `${target.data.name} was set to owner of ${faction.name}`);
    }
}
