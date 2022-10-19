import * as alt from 'alt-client';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { triallife_EXAMPLE_AGENDA } from '../shared/enums';

// You should change this to match your Vue Template's ComponentName.
const PAGE_NAME = 'TriallifeLogo';

class InternalFunctions implements ViewModel {
    static async open() {
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
    }

    static async close() {
        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
    }
}

alt.onServer(triallife_EXAMPLE_AGENDA.SHOW, InternalFunctions.open);
alt.onServer(triallife_EXAMPLE_AGENDA.CLOSE, InternalFunctions.close);
