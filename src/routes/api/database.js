"use strict";

import sql from '../../services/sql.js'
import log from '../../services/log.js'
import backupService from '../../services/backup.js'
import anonymizationService from '../../services/anonymization.js'
import consistencyChecksService from '../../services/consistency_checks.js'

function getExistingBackups() {
    return backupService.getExistingBackups();
}

async function backupDatabase() {
    return {
        backupFile: await backupService.backupNow("now")
    };
}

function vacuumDatabase() {
    sql.execute("VACUUM");

    log.info("Database has been vacuumed.");
}

function findAndFixConsistencyIssues() {
    consistencyChecksService.runOnDemandChecks(true);
}

function getExistingAnonymizedDatabases() {
    return anonymizationService.getExistingAnonymizedDatabases();
}

async function anonymize(req) {
    return await anonymizationService.createAnonymizedCopy(req.params.type);
}

function checkIntegrity() {
    const results = sql.getRows("PRAGMA integrity_check");

    log.info(`Integrity check result: ${JSON.stringify(results)}`);

    return {
        results
    };
}

export default {
    getExistingBackups,
    backupDatabase,
    vacuumDatabase,
    findAndFixConsistencyIssues,
    getExistingAnonymizedDatabases,
    anonymize,
    checkIntegrity
};
