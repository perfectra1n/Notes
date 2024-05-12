import startTrilium = require("./www");
import path = require("path");
import express = require("express");

startTrilium({
    setupCompleteCallback: (res) => {
        res.redirect('.');
    },
    
    getInitialTheme() {
        // default based on the poll in https://github.com/zadam/trilium/issues/2516
        return "dark";
    },

    registerAdditionalMiddleware(app) {
        const assetsDir = path.join(__dirname, "..", "..", "client", "assets");
        app.use(`/manifest.webmanifest`, express.static(path.join(assetsDir, 'manifest.webmanifest')));
        app.use(`/robots.txt`, express.static(path.join(assetsDir, 'robots.txt')));
    },
});
