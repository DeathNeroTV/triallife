import { VEHICLE_TYPE } from '../../../../shared/enums/vehicleTypeFlags';
import { GarageFunctions } from '../src/view';

const garage = {
    position: { x: 1036.4833, y: -763.2354, z: 56.993 },
    type: VEHICLE_TYPE.VEHICLE,
    index: 'mirror-park',
    parking: [
        {
            position: {
                x: 1046.4746,
                y: -774.2539,
                z: 56.2868,
            },
            rotation: {
                x: 0,
                y: 0,
                z: -1.5822,
            },
        },
        {
            position: {
                x: 1046.656,
                y: -778.0406,
                z: 56.2768,
            },
            rotation: {
                x: 0,
                y: 0,
                z: -1.5419,
            },
        },
        {
            position: {
                x: 1046.5592,
                y: -781.526,
                z: 56.269,
            },
            rotation: {
                x: 0,
                y: 0,
                z: -1.5774,
            },
        },
        {
            position: {
                x: 1046.3537,
                y: -785.4707,
                z: 56.2609,
            },
            rotation: {
                x: 0,
                y: 0,
                z: -1.5423,
            },
        },
        {
            position: {
                x: 1029.8826,
                y: -763.5482,
                z: 56.2558,
            },
            rotation: {
                x: 0,
                y: 0,
                z: -2.1789,
            },
        },
    ],
};

GarageFunctions.add(garage);
