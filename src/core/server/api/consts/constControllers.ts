import { ServerItemController } from '../../streamers/item';
import { ServerMarkerController } from '../../streamers/marker';
import { ServerObjectController } from '../../streamers/object';
import { PedController } from '../../streamers/ped';
import { ServerTextLabelController } from '../../streamers/textlabel';
import { WorldNotificationController } from '../../streamers/worldNotifications';
import { AdminController } from '../../systems/admin';
import { ServerBlipController } from '../../systems/blip';
import { HologramController } from '../../systems/hologram';
import { InteractionController } from '../../systems/interaction';

export const controllersConst = {
    admin: AdminController,
    blip: ServerBlipController,
    interaction: InteractionController,
    item: ServerItemController,
    holograms: HologramController,
    marker: ServerMarkerController,
    object: ServerObjectController,
    ped: PedController,
    text: ServerTextLabelController,
    notification: WorldNotificationController,
};
