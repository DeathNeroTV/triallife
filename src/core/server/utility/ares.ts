import * as alt from 'alt-server';
import { sha256 } from './encryption';

export default class Ares {
    static getUniquePlayerHash(player: alt.Player, discord: string): string {
        return sha256(sha256(`${player.hwidHash}${player.hwidExHash}${player.ip}${discord}${player.socialID}`));
    }
}
