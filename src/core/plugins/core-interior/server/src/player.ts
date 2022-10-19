import * as charRef from '../../../../shared/interfaces/character';

// Extends the player interface.
declare module 'alt-server' {
    export interface Player {
        interiorMinimumZ?: number;
    }

    export interface Character extends Partial<charRef.Character> {
        interior?: null | undefined | string;
    }
}
