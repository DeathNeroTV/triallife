/**
 * First argument from an `alt.on` event should always be a vehicle.
 * @export
 * @enum {number}
 */
export enum triallife_EVENTS_VEHICLE {
    DESPAWNED = 'triallife:VehicleDespawned',
    ENGINE_STATE_CHANGE = 'triallife:VehicleEngineState',
    LOCK_STATE_CHANGE = 'triallife:VehicleLockState',
    REPAIRED = 'triallife:VehicleRepaired',
    SPAWNED = 'triallife:VehicleSpawned',
    DISTANCE_TRAVELED = 'triallife:DistanceTraveled',
    DESTROYED = 'triallife:VehicleDestroyed',
}

/**
 * First argument from an `alt.on` event should always be a player.
 * Server-side only.
 * @export
 * @enum {number}
 */
export enum TRIALLIFE_EVENTS_PLAYER {
    DIED = 'triallife:PlayerDied',
    DROPPED_ITEM = 'triallife:PlayerDroppedItem',
    ENTERED_INTERIOR = 'triallife:EnteredInterior',
    LEFT_INTERIOR = 'triallife:LeftInterior',
    PURCHASED_VEHICLE = 'triallife:PurchasedVehicle',
    SELECTED_CHARACTER = 'triallife:SelectedCharacter',
    SPAWNED = 'triallife:PlayerSpawned',
    TOGGLED_INTERIOR_LOCK = 'triallife:ToggleLock',
    EQUIPPED_WEAPON = 'triallife:equipped:weapon',
    UNEQUIPPED_WEAPON = 'triallife:unequipped:weapon',
    BANK_CREATE = 'triallife:BankCreate',
    BANK_DELETE = 'triallife:BankDelete',
}

export enum TRIALLIFE_EVENTS_PLAYER_CLIENT {
    WAYPOINT = 'triallife:PlayerWaypoint',
}
