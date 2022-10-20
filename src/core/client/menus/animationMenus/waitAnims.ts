import { ANIMATION_FLAGS } from '../../../shared/flags/animationFlags';

export default (callback: (...args: any[]) => void) => {
    return [
        {
            name: 'Warten 1',
            callback,
            data: ['random@shop_tattoo', '_idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Warten 2',
            callback,
            data: ['missbigscore2aig_3', 'wait_for_van_c', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Warten 3',
            callback,
            data: ['amb@world_human_hang_out_street@female_hold_arm@idle_a', 'idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Warten 4',
            callback,
            data: ['amb@world_human_hang_out_street@Female_arm_side@idle_a', 'idle_a', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Warten 5',
            callback,
            data: ['missclothing', 'idle_storeclerk', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Warten 6',
            callback,
            data: ['timetable@amanda@ig_2', 'ig_2_base_amanda', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Warten 7',
            callback,
            data: ['rcmnigel1cnmt_1c', 'base', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Warten 8',
            callback,
            data: ['rcmjosh1', 'idle', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Warten 9',
            callback,
            data: ['rcmjosh2', 'josh_2_intp1_base', ANIMATION_FLAGS.REPEAT],
        },
        {
            name: 'Warten 10',
            callback,
            data: ['timetable@amanda@ig_3', 'ig_3_base_tracy', ANIMATION_FLAGS.REPEAT],
        },
    ];
};
