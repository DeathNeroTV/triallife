import { ANIMATION_FLAGS } from '../../../shared/flags/animationFlags';

export default (callback: (...args: any[]) => void) => {
    return [
        {
            name: 'Nein',
            callback,
            data: ['anim@heists@ornate_bank@chat_manager', 'fail', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Keines Wegs',
            callback,
            data: ['gestures@m@standing@casual', 'gesture_no_way', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Okay',
            callback,
            data: ['anim@mp_player_intselfiedock', 'idle_a', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Außer Puste',
            callback,
            data: ['re@construction', 'out_of_breath', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Salutieren',
            callback,
            data: ['anim@mp_player_intincarsalutestd@ds@', 'idle_a', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Salutieren 2',
            callback,
            data: ['anim@mp_player_intincarsalutestd@ps@', 'idle_a', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Verängstigt 1',
            callback,
            data: ['random@domestic', 'f_distressed_loop', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Verängstigt 2',
            callback,
            data: ['random@homelandsecurity', 'knees_loop_girl', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Klatschen',
            callback,
            data: ['amb@world_human_cheering@male_a', 'base', ANIMATION_FLAGS.NORMAL],
        },
        {
            name: 'Essen',
            callback,
            data: ['mp_player_inteat@burger', 'mp_player_int_eat_burger', ANIMATION_FLAGS.NORMAL],
        },
    ];
};
