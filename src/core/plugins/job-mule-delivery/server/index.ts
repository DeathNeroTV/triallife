import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { MuleJob } from './src/job';

const PLUGIN_NAME = ' TRANSPORT-JOB';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~${PLUGIN_NAME} wurde geladen`);
    MuleJob.init();
});
