import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { PizzaJob } from './src/job';

const PLUGIN_NAME = ' PIZZA-JOB';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~${PLUGIN_NAME} wurde geladen`);
    PizzaJob.init();
});
