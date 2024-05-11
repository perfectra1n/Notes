import fs = require("fs-extra");
import path = require("path");

const DEST_DIR = "./dist";
const DEST_DIR_SRC = path.join(DEST_DIR, "src");
const DEST_DIR_NODE_MODULES = path.join(DEST_DIR, "node_modules");

async function copyNodeModuleFileOrFolder(source: string) {
  const adjustedSource = source.substring(source.indexOf("node_modules") + "node_modules".length);
  const destination = path.join(DEST_DIR_NODE_MODULES, adjustedSource);

  console.log(`Copying ${source} to ${destination}`);
  await fs.ensureDir(path.dirname(destination));
  await fs.copy(source, destination);
}

function trimRelativePath(path: string) {
  return path.replace(/\.\.\//g, "")
}

async function copyFiles() {
  const filesToCopy = ["config-sample.ini"];
  for (const file of filesToCopy) {
    console.log(`Copying ${file}`);
    await fs.copy(file, path.join(DEST_DIR, file));
  }
}

async function copyDirs() {
  const dirsToCopy = ["../common/images", "../client/libraries", "../server/db"];
  for (const dir of dirsToCopy) {
    const destPath = path.join(DEST_DIR, trimRelativePath(dir));
    console.log(`Copying ${dir} -> ${destPath}`);
    await fs.copy(dir, destPath);
  }
}

async function copyClient() {
  const srcDirsToCopy = ["../client/src", "../server/src/views"];
  for (const dir of srcDirsToCopy) {
    console.log(`Copying ${dir}`);
    await fs.copy(dir, path.join(DEST_DIR_SRC, trimRelativePath(dir)));
  }
}

async function copyNodeModules() {
  const nodeModulesFile = [
    "../client/node_modules/react/umd/react.production.min.js",
    "../client/node_modules/react/umd/react.development.js",
    "../client/node_modules/react-dom/umd/react-dom.production.min.js",
    "../client/node_modules/react-dom/umd/react-dom.development.js",
    "../client/node_modules/katex/dist/katex.min.js",
    "../client/node_modules/katex/dist/contrib/mhchem.min.js",
    "../client/node_modules/katex/dist/contrib/auto-render.min.js",
  ];
  
  for (const file of nodeModulesFile) {
    await copyNodeModuleFileOrFolder(file);
  }
  
  const nodeModulesFolder = [
    "../client/node_modules/@excalidraw/excalidraw/dist/",
    "../client/node_modules/katex/dist/",
    "../client/node_modules/dayjs/",
    "../client/node_modules/force-graph/dist/",
    "../client/node_modules/boxicons/css/",
    "../client/node_modules/boxicons/fonts/",
    "../client/node_modules/mermaid/dist/",
    "../client/node_modules/jquery/dist/",
    "../client/node_modules/jquery-hotkeys/",
    "../client/node_modules/print-this/",
    "../client/node_modules/split.js/dist/",
    "../client/node_modules/panzoom/dist/",
  ];
  
  for (const folder of nodeModulesFolder) {
    await copyNodeModuleFileOrFolder(folder);
  }
}

try {
  copyFiles();
  copyDirs();
  copyClient();
  copyNodeModules();
  console.log("Copying complete!");
} catch (err: unknown) {
  console.error("Error during copy:", err);
  process.exit(1);
}