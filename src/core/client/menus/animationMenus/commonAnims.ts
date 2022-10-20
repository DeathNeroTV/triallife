import { ANIMATION_FLAGS } from '../../../shared/flags/animationFlags';

export default (callback: (...args: any[]) => void) => {
    return [
        {
            name: 'Widerbelebung',
            callback,
            data: ['mini@cpr@char_a@cpr_str', 'cpr_pumpchest', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Fesseln lösen',
            callback,
            data: ['mp_arresting', 'a_uncuff', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Radio',
            callback,
            data: ['random@arrests', 'generic_radio_chatter', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Hände heben',
            callback,
            data: ['missminuteman_1ig_2', 'handsup_base', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Frieden',
            callback,
            data: ['mp_player_int_upperpeace_sign', 'mp_player_int_peace_sign', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Winken 1',
            callback,
            data: ['friends@frj@ig_1', 'wave_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Winken 2',
            callback,
            data: ['friends@frj@ig_1', 'wave_b', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Trampen',
            callback,
            data: ['random@hitch_lift', 'idle_f', ANIMATION_FLAGS.STOP_LAST_FRAME | ANIMATION_FLAGS.ENABLE_PLAYER_CONTROL],
        },
        {
            name: 'Lachen 1',
            callback,
            data: ['anim@arena@celeb@flat@paired@no_props@', 'laugh_a_player_b', ANIMATION_FLAGS.STOP_LAST_FRAME | ANIMATION_FLAGS.ENABLE_PLAYER_CONTROL],
        },
        {
            name: 'Lachen 2',
            callback,
            data: ['anim@arena@celeb@flat@solo@no_props@', 'giggle_a_player_b', ANIMATION_FLAGS.STOP_LAST_FRAME | ANIMATION_FLAGS.ENABLE_PLAYER_CONTROL],
        },
    ];
};
