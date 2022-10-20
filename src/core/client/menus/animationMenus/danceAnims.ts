import { ANIMATION_FLAGS } from '../../../shared/flags/animationFlags';

export default (callback: (...args: any[]) => void) => {
    return [
        {
            name: 'Tanz F1',
            callback,
            data: ['anim@amb@nightclub@dancers@solomun_entourage@', 'mi_dance_facedj_17_v1_female^1', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Tanz F2',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@female@var_a@', 'high_center', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Tanz F3',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@female@var_a@', 'high_center_up', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Tanz F4',
            callback,
            data: ['anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity', 'hi_dance_facedj_09_v2_female^1', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Tanz F5',
            callback,
            data: ['anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity', 'hi_dance_facedj_09_v2_female^3', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Tanz M1',
            callback,
            data: ['anim@amb@nightclub@dancers@podium_dancers@', 'hi_dance_facedj_17_v2_male^5', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Tanz M2',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@male@var_b@', 'high_center_down', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Tanz M3',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@male@var_a@', 'high_center', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Tanz M4',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@male@var_b@', 'high_center_up', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Tanz M5',
            callback,
            data: ['anim@amb@nightclub@mini@dance@dance_solo@male@var_b@', 'low_center', ANIMATION_FLAGS.REPEAT],
        },
    ];
};
