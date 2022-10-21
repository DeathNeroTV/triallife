import * as alt from 'alt-server';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { IVoiceChannel } from '../../shared/interfaces';
import { TRIALLIFE_EVENTS_PLAYER } from '../../../../shared/enums/triallife-events';
import { VOICE_CONFIG } from '../../shared/src/config';
import { triallife } from '../../../../server/api/triallife';

const Channels: Array<IVoiceChannel<alt.Player, alt.VoiceChannel>> = [];

export class VoiceSystem {
    static init() {
        if (!VOICE_CONFIG.ENABLE_VOICE) return;
        try {
            VoiceSystem.createChannel('low', true, 3);
            VoiceSystem.createChannel('mid', true, 8);
            VoiceSystem.createChannel('long', true, 15);
            VoiceSystem.createChannel('ultra', true, 32);
            PlayerEvents.on(TRIALLIFE_EVENTS_PLAYER.SELECTED_CHARACTER, VoiceSystem.connect);
            alt.on('playerDisconnect', VoiceSystem.disconnectPlayer);
            alt.on('removeEntity', VoiceSystem.disconnectEntity);
            alt.onClient('voice:ChangeRange', VoiceSystem.changeRange);
        } catch (err) {
            alt.logWarning(`[CORE-VOICE] core-voice tried to load but configuration is missing voice properties.`);
        }
    }

    static createChannel(name: string, isSpatial: boolean, maxDistance: number): IVoiceChannel<alt.Player, alt.VoiceChannel> | null {
        const index = Channels.findIndex((x) => x.name === name);
        if (index >= 0) return Channels[index];
        const newChannel = { name, channel: new alt.VoiceChannel(isSpatial, maxDistance), joinEmits: [], leaveEmits: [] };
        Channels.push(newChannel);
        return newChannel;
    }

    static getChannel(name: string): IVoiceChannel<alt.Player, alt.VoiceChannel> | null {
        const index = Channels.findIndex((x) => x.name === name);
        if (index === -1) return null;
        return Channels[index];
    }

    static removeChannel(name: string) {
        const index = Channels.findIndex((x) => x.name === name);
        if (index === -1) return;
        if (Channels[index].channel) Channels[index].channel.destroy();
        Channels.splice(index, 1);
    }

    static addClientJoinEmitToChannel(eventName: string, channelName: string): boolean {
        const index = Channels.findIndex((x) => x.name === channelName);
        if (index === -1) return false;
        Channels[index].joinEmits.push(eventName);
        return true;
    }

    static addClientLeaveEmitToChannel(eventName: string, channelName: string): boolean {
        const index = Channels.findIndex((x) => x.name === channelName);
        if (index === -1) return false;
        Channels[index].leaveEmits.push(eventName);
        return true;
    }

    static addPlayer(player: alt.Player, channelName: string) {
        const index = Channels.findIndex((x) => x.name === channelName);
        if (index === -1) return null;
        const virtualChannel = Channels[index];
        if (virtualChannel.channel.isPlayerInChannel(player)) return;
        virtualChannel.channel.addPlayer(player);
        for (let i = 0; i < virtualChannel.joinEmits.length; i++) {
            alt.emitClient(player, virtualChannel.joinEmits[i], virtualChannel.name);
        }
    }

    static connect(player: alt.Player) {
        VoiceSystem.addPlayer(player, 'low');
        VoiceSystem.addPlayer(player, 'mid');
        VoiceSystem.addPlayer(player, 'long');
        VoiceSystem.addPlayer(player, 'ultra');
        triallife.player.emit.meta(player, 'voice', false);
    }

    static disconnectPlayer(player: alt.Player) {
        if (VoiceSystem.getChannel('low').channel.isPlayerInChannel(player)) VoiceSystem.getChannel('low').channel.removePlayer(player);
        if (VoiceSystem.getChannel('mid').channel.isPlayerInChannel(player)) VoiceSystem.getChannel('mid').channel.removePlayer(player);
        if (VoiceSystem.getChannel('long').channel.isPlayerInChannel(player)) VoiceSystem.getChannel('long').channel.removePlayer(player);
        if (VoiceSystem.getChannel('ultra').channel.isPlayerInChannel(player)) VoiceSystem.getChannel('ultra').channel.removePlayer(player);
    }

    static disconnectEntity(entity: alt.Entity) {
        if (!(entity instanceof alt.Player)) return;
        const player = entity as alt.Player;
        if (VoiceSystem.getChannel('low').channel.isPlayerInChannel(player)) VoiceSystem.getChannel('low').channel.removePlayer(player);
        if (VoiceSystem.getChannel('mid').channel.isPlayerInChannel(player)) VoiceSystem.getChannel('mid').channel.removePlayer(player);
        if (VoiceSystem.getChannel('long').channel.isPlayerInChannel(player)) VoiceSystem.getChannel('long').channel.removePlayer(player);
        if (VoiceSystem.getChannel('ultra').channel.isPlayerInChannel(player)) VoiceSystem.getChannel('ultra').channel.removePlayer(player);
    }

    static muteInOtherChannels(player: alt.Player, range: number) {
        switch (range) {
            case 3:
                VoiceSystem.getChannel('mid').channel.mutePlayer(player);
                VoiceSystem.getChannel('long').channel.mutePlayer(player);
                VoiceSystem.getChannel('ultra').channel.mutePlayer(player);
                break;
            case 8:
                VoiceSystem.getChannel('low').channel.mutePlayer(player);
                VoiceSystem.getChannel('long').channel.mutePlayer(player);
                VoiceSystem.getChannel('ultra').channel.mutePlayer(player);
                break;
            case 15:
                VoiceSystem.getChannel('low').channel.mutePlayer(player);
                VoiceSystem.getChannel('mid').channel.mutePlayer(player);
                VoiceSystem.getChannel('ultra').channel.mutePlayer(player);
                break;
            case 32:
                VoiceSystem.getChannel('low').channel.mutePlayer(player);
                VoiceSystem.getChannel('mid').channel.mutePlayer(player);
                VoiceSystem.getChannel('long').channel.mutePlayer(player);
                break;
            default:
                VoiceSystem.getChannel('low').channel.mutePlayer(player);
                VoiceSystem.getChannel('mid').channel.mutePlayer(player);
                VoiceSystem.getChannel('long').channel.mutePlayer(player);
                VoiceSystem.getChannel('ultra').channel.mutePlayer(player);
                break;
        }
    }

    static changeRange(player: alt.Player) {
        if (!player.voiceRange) player.voiceRange = 0;
        switch (player.voiceRange) {
            case 0:
                player.voiceRange = 3;
                VoiceSystem.muteInOtherChannels(player, 3);
                VoiceSystem.getChannel('low').channel.unmutePlayer(player);
                triallife.player.emit.meta(player, 'voiceRange', player.voiceRange);
                break;
            case 3:
                player.voiceRange = 8;
                VoiceSystem.muteInOtherChannels(player, 8);
                VoiceSystem.getChannel('mid').channel.unmutePlayer(player);
                triallife.player.emit.meta(player, 'voiceRange', player.voiceRange);
                break;
            case 8:
                player.voiceRange = 15;
                VoiceSystem.muteInOtherChannels(player, 15);
                VoiceSystem.getChannel('long').channel.unmutePlayer(player);
                triallife.player.emit.meta(player, 'voiceRange', player.voiceRange);
                break;
            case 15:
                player.voiceRange = 32;
                VoiceSystem.muteInOtherChannels(player, 32);
                VoiceSystem.getChannel('ultra').channel.unmutePlayer(player);
                triallife.player.emit.meta(player, 'voiceRange', player.voiceRange);
                break;
            case 32:
                player.voiceRange = 0;
                VoiceSystem.muteInOtherChannels(player, 0);
                triallife.player.emit.meta(player, 'voiceRange', player.voiceRange);
                break;
            default:
                break;
        }
    }
}
