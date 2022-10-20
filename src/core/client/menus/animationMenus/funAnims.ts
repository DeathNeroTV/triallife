import { ANIMATION_FLAGS } from '../../../shared/flags/animationFlags';

export default (callback: (...args: any[]) => void) => {
    return [
        {
            name: 'Luftgitarre',
            callback,
            data: ['anim@mp_player_intcelebrationfemale@air_guitar', 'air_guitar', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Luft-Synth',
            callback,
            data: ['anim@mp_player_intcelebrationfemale@air_synth', 'air_synth', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Streiten 1',
            callback,
            data: ['misscarsteal4@actor', 'actor_berating_loop', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Streiten 2',
            callback,
            data: ['oddjobs@assassinate@vice@hooker', 'argue_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Luftkuss 1',
            callback,
            data: ['anim@mp_player_intcelebrationfemale@blow_kiss', 'blow_kiss', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Luftkuss 2',
            callback,
            data: ['anim@mp_player_intselfieblow_kiss', 'exit', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Knicks',
            callback,
            data: ['anim@mp_player_intcelebrationpaired@f_f_sarcastic', 'sarcastic_left', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Es bringen',
            callback,
            data: ['misscommon@response', 'bring_it_on', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Komm zu mir',
            callback,
            data: ['mini@triathlon', 'want_some_of_this', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Jazz Hände',
            callback,
            data: ['anim@mp_player_intcelebrationfemale@jazz_hands', 'jazz_hands', ANIMATION_FLAGS.NORMAL],
        },
    ];
};
