"use strict";

import electron = require("electron");
import sqlInit = require("../../server/src/services/sql_init");
import appIconService = require("./services/app_icon");
import windowService = require("./services/window");
import tray = require("./services/tray");

// Adds debug features like hotkeys for triggering dev tools and reload
require("electron-debug")();

appIconService.installLocalAppIcon();

require("electron-dl")({ saveAs: true });

// needed for excalidraw export https://github.com/zadam/trilium/issues/4271
electron.app.commandLine.appendSwitch(
  "enable-experimental-web-platform-features"
);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});

electron.app.on("ready", async () => {
  //    electron.app.setAppUserModelId('com.github.zadam.trilium');

  // if db is not initialized -> setup process
  // if db is initialized, then we need to wait until the migration process is finished
  if (sqlInit.isDbInitialized()) {
    await sqlInit.dbReady;

    await windowService.createMainWindow(electron.app);

    if (process.platform === "darwin") {
      electron.app.on("activate", async () => {
        if (electron.BrowserWindow.getAllWindows().length === 0) {
          await windowService.createMainWindow(electron.app);
        }
      });
    }

    tray.createTray();
  } else {
    await windowService.createSetupWindow();
  }

  await windowService.registerGlobalShortcuts();
});

electron.app.on("will-quit", () => {
  electron.globalShortcut.unregisterAll();
});

// this is to disable electron warning spam in the dev console (local development only)
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

require("./src/www.js");
