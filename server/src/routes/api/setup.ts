"use strict";

import sqlInit = require('../../services/sql_init');
import setupService = require('../../services/setup');
import log = require('../../services/log');
import appInfo = require('../../services/app_info');
import { Request } from 'express';
import { InitDbOptions } from '../../types';

function buildRoutes(initOptions: InitDbOptions) {
    function getStatus() {
        return {
            isInitialized: sqlInit.isDbInitialized(),
            schemaExists: sqlInit.schemaExists(),
            syncVersion: appInfo.syncVersion
        };
    }
    
    async function setupNewDocument() {
        await sqlInit.createInitialDatabase(initOptions);
    }
    
    function setupSyncFromServer(req: Request) {
        const { syncServerHost, syncProxy, password } = req.body;
    
        return setupService.setupSyncFromSyncServer(syncServerHost, syncProxy, password, initOptions);
    }
    
    function saveSyncSeed(req: Request) {
        const { options, syncVersion } = req.body;
    
        if (appInfo.syncVersion !== syncVersion) {
            const message = `Could not setup sync since local sync protocol version is ${appInfo.syncVersion} while remote is ${syncVersion}. To fix this issue, use same Trilium version on all instances.`;
    
            log.error(message);
    
            return [400, {
                error: message
            }]
        }
    
        log.info("Saved sync seed.");
    
        sqlInit.createDatabaseForSync(options, initOptions);
    }
    
    function getSyncSeed() {
        log.info("Serving sync seed.");
    
        return {
            options: setupService.getSyncSeedOptions(),
            syncVersion: appInfo.syncVersion
        };
    }
    
    return {
        getStatus,
        setupNewDocument,
        setupSyncFromServer,
        getSyncSeed,
        saveSyncSeed
    };
}

export = buildRoutes;