#!/usr/bin/env node

// setup basic error handling even before requiring dependencies, since those can produce errors as well

process.on('unhandledRejection', error => {
    // this makes sure that stacktrace of failed promise is printed out
    console.log(error);

    // but also try to log it into file
    require('./services/log').info(error);
});

function exit() {
    console.log("Caught interrupt/termination signal. Exiting.");
    process.exit(0);
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);

import buildApp = require('./app');
import sessionParser = require('./routes/session_parser');
import fs = require('fs');
import http = require('http');
import https = require('https');
import config = require('./services/config');
import log = require('./services/log');
import appInfo = require('./services/app_info');
import ws = require('./services/ws');
import port = require('./services/port');
import host = require('./services/host');
import semver = require('semver');
import type { Express } from "express";
import { RouteConfig } from './routes/types';

function startTrilium(routeConfig: RouteConfig) {
    if (!semver.satisfies(process.version, ">=10.5.0")) {
        console.error("Trilium only supports node.js 10.5 and later");
        process.exit(1);
    }

    log.info(JSON.stringify(appInfo, null, 2));

    const app = buildApp(routeConfig);

    const cpuInfos = require('os').cpus();
    if (cpuInfos && cpuInfos[0] !== undefined) { // https://github.com/zadam/trilium/pull/3957
        log.info(`CPU model: ${cpuInfos[0].model}, logical cores: ${cpuInfos.length} freq: ${cpuInfos[0].speed} Mhz`); // for perf. issues it's good to know the rough configuration
    }

    const httpServer = startHttpServer(app);

    ws.init(httpServer, sessionParser as any); // TODO: Not sure why session parser is incompatible.

    return app;    
}

function startHttpServer(app: Express) {
    app.set('port', port);
    app.set('host', host);

    // Check from config whether to trust reverse proxies to supply user IPs, hostnames and protocols
    if (config['Network']['trustedReverseProxy']) {
        if (config['Network']['trustedReverseProxy'] === true || config['Network']['trustedReverseProxy'].trim().length) {
            app.set('trust proxy', config['Network']['trustedReverseProxy'])
        }
    }

    log.info(`Trusted reverse proxy: ${app.get('trust proxy')}`)

    let httpServer;

    if (config['Network']['https']) {
        if (!config['Network']['keyPath'] || !config['Network']['keyPath'].trim().length) {
            throw new Error("keyPath in config.ini is required when https=true, but it's empty");
        }

        if (!config['Network']['certPath'] || !config['Network']['certPath'].trim().length) {
            throw new Error("certPath in config.ini is required when https=true, but it's empty");
        }

        const options = {
            key: fs.readFileSync(config['Network']['keyPath']),
            cert: fs.readFileSync(config['Network']['certPath'])
        };

        httpServer = https.createServer(options, app);

        log.info(`App HTTPS server starting up at port ${port}`);
    } else {
        httpServer = http.createServer(app);

        log.info(`App HTTP server starting up at port ${port}`);
    }

    /**
     * Listen on provided port, on all network interfaces.
     */

    httpServer.keepAliveTimeout = 120000 * 5;
    const listenOnTcp = port !== 0;

    if (listenOnTcp) {
        httpServer.listen(port, host); // TCP socket.
    } else {
        httpServer.listen(host); // Unix socket.
    }

    httpServer.on('error', error => {
        if (!listenOnTcp || ("syscall" in error && error.syscall !== 'listen')) {
            throw error;
        }

        // handle specific listen errors with friendly messages
        if ("code" in error) {
            switch (error.code) {
                case 'EACCES':
                    console.error(`Port ${port} requires elevated privileges. It's recommended to use port above 1024.`);
                    process.exit(1);
                case 'EADDRINUSE':
                    console.error(`Port ${port} is already in use. Most likely, another Trilium process is already running. You might try to find it, kill it, and try again.`);
                    process.exit(1);
            }
        }

        throw error;
    }
    )

    httpServer.on('listening', () => {
        if (listenOnTcp) {
            log.info(`Listening on port ${port}`)
        } else {
            log.info(`Listening on unix socket ${host}`)
        }
    });

    return httpServer;
}

export = startTrilium;