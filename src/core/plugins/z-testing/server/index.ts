import * as alt from 'alt-server';
import { triallife } from '../../../server/api/triallife';
import { PluginSystem } from '../../../server/systems/plugins';

const PLUGIN_NAME = 'Testing';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~${PLUGIN_NAME} ~w~wurde geladen`);

    triallife.state.subscribe((entity: alt.Player | alt.Vehicle, key: string, oldValue: any, newValue: any) => {
        if (!(entity instanceof alt.Player)) {
            return;
        }

        alt.logWarning(`Key ${key} | ${oldValue} --> ${newValue}`);
    });
});
