export interface IRoleplayCmds {
    /**
     * Distance of the /ooc command
     * @type {number}
     * @memberof IRoleplayCmds
     */
    COMMAND_OOC_DISTANCE: number;

    /**
     * Distance of the /me command
     * @type {number}
     * @memberof IRoleplayCmds
     */
    COMMAND_ME_DISTANCE: number;

    /**
     * Distance of the /do command
     * @type {number}
     * @memberof IRoleplayCmds
     */
    COMMAND_DO_DISTANCE: number;

    /**
     * Distance of the /low command
     * @type {number}
     * @memberof IRoleplayCmds
     */
    COMMAND_LOW_DISTANCE: number;

    /**
     * Distance of the /w command
     * @type {number}
     * @memberof IRoleplayCmds
     */
    COMMAND_WHISPER_DISTANCE: number;
}
