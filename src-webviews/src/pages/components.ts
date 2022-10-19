import { shallowRef } from 'vue';

import Designs from './designs/Designs.vue';
import Icons from './icons/Icons.vue';
import InputBox from './input/InputBox.vue';
import Inventory from './inventory/Inventory.vue';
import Job from './job/Job.vue';
import MultiPageExample from './multiPageExample/MultiPageExample.vue';
import Storage from './storage/Storage.vue';
import Audio from './audio/Audio.vue';
import Actions from './actions/Actions.vue';
import TriallifeLogo from './triallife-logo/TriallifeLogo.vue';
import TestDrop from './testDrop/TestDrop.vue';
import WheelMenu from './wheelMenu/WheelMenu.vue';

export const CORE_IMPORTS = {
    Actions: shallowRef(Actions),
    TriallifeLogo: shallowRef(TriallifeLogo),
    Audio: shallowRef(Audio),
    Designs: shallowRef(Designs),
    Icons: shallowRef(Icons),
    InputBox: shallowRef(InputBox),
    Inventory: shallowRef(Inventory),
    Job: shallowRef(Job),
    Storage: shallowRef(Storage),
    MultiPageExample: shallowRef(MultiPageExample),
    TestDrop: shallowRef(TestDrop),
    WheelMenu: shallowRef(WheelMenu),
};
