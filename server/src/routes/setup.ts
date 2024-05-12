"use strict";

import sqlInit = require('../services/sql_init');
import setupService = require('../services/setup');
import assetPath = require('../services/asset_path');
import appPath = require('../services/app_path');
import { Request, Response } from 'express';
import { SetupCompleteCallback } from './types';

function buildSetupRoute(setupCompleteCallback: SetupCompleteCallback) {
    return (req: Request, res: Response) => {
        if (sqlInit.isDbInitialized()) {
            setupCompleteCallback(res);    
            return;
        }
    
        // we got here because DB is not completely initialized, so if schema exists,
        // it means we're in "sync in progress" state.
        const syncInProgress = sqlInit.schemaExists();
    
        if (syncInProgress) {
            // trigger sync if it's not already running
            setupService.triggerSync();
        }
    
        res.render('setup', {
            syncInProgress: syncInProgress,
            assetPath: assetPath,
            appPath: appPath
        });
    }
}

export = {
    buildSetupRoute
};
