const defaultStore = {};

const defaultStorage = {};

const defaultFaction = {
    _id: '',
    name: '',
    bank: 0.0,
    canDisband: false,
    type: 'state',
    members: [],
    ranks: [
        {
            name: '',
            actionPermissions: [],
            rankPermissions: [],
            vehicles: [''],
            weight: 0.0,
        },
    ],
    availableActions: [''],
    actions: {},
    tickActions: [''],
    vehicles: [],
    storages: [],
    settings: {
        position: {
            x: 0.0,
            y: 0.0,
            z: 0.0,
        },
        parkingSpots: [
            {
                pos: { x: 0.0, y: 0.0, z: 0.0 },
                rot: { x: 0.0, y: 0.0, z: 0.0 },
            },
        ],
        vehicles: [{ model: '', price: 0.0 }],
        maxVehicles: 0,
        blip: 0,
        blipColor: 0,
        motd: '',
    },
};

const defaultGarage = {
    position: { x: 0.0, y: 0.0, z: 0.0 },
    type: 'boat, aircraft, vehicle or train',
    index: 'name-of-garage',
    parking: [
        {
            position: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
            },
            rotation: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
            },
        },
    ],
};

const defaultInterior = {
    name: '',
    uid: '',
    outside: { x: 0, y: 0, z: 0 },
    inside: { x: 0, y: 0, z: 0 },
    objects: [],
    system: 'NONE',
    isUnlocked: true,
    interiorID: -1,
    ipl: '',
    entitySets: [{ name: '', active: true }],
    price: 0.0,
};

const defaultItem = {
    name: ``,
    description: ``,
    dbName: '',
    icon: '',
    slot: 0,
    sell: 1.25,
    buy: 2.5,
    maxStack: 10,
    quantity: 1,
    rarity: 1,
    behavior: 0,
    data: {
        event: '',
        amount: 5,
        sound: 'item_',
    },
    version: 1,
};

export default {
    defaultStore,
    defaultInterior,
    defaultItem,
    defaultGarage,
    defaultStorage,
    defaultFaction,
};
