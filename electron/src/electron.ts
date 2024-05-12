"use strict";

import electron = require("electron");
import sqlInit = require("../../server/src/services/sql_init");
import appIconService = require("./services/app_icon");
import windowService = require("./services/window");
import tray = require("./services/tray");
import startTrilium = require("../../server/src/www");
import electronRouting = require('./routes/electron');

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

/**
 * The intended behavior is to detect when a second instance is running, in that case open the old instance
 * instead of the new one. This is complicated by the fact that it is possible to run multiple instances of Trilium
 * if port and data dir are configured separately. This complication is the source of the following weird usage.
 *
 * The line below makes sure that the "second-instance" (process in window.ts) is fired. Normally it returns a boolean
 * indicating whether another instance is running or not, but we ignore that and kill the app only based on the port conflict.
 *
 * A bit weird is that "second-instance" is triggered also on the valid usecases (different port/data dir) and
 * focuses the existing window. But the new process is start as well and will steal the focus too, it will win, because
 * its startup is slower than focusing the existing process/window. So in the end, it works out without having
 * to do a complex evaluation.
 */
electron.app.requestSingleInstanceLock();

const app = startTrilium();
electronRouting(app);