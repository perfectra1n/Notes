const fs = require("fs-extra");
const path = require("path");

const DEST_DIR = "./dist";
const DEST_DIR_SRC = path.join(DEST_DIR, "src");
const DEST_DIR_NODE_MODULES = path.join(DEST_DIR, "node_modules");

async function copyNodeModuleFileOrFolder(source: string) {
  const adjustedSource = source.substring(13);
  const destination = path.join(DEST_DIR_NODE_MODULES, adjustedSource);

  console.log(`Copying ${source} to ${destination}`);
  await fs.ensureDir(path.dirname(destination));
  await fs.copy(source, destination);
}

const copy = async () => {
  const filesToCopy = ["config-sample.ini"];
  for (const file of filesToCopy) {
    console.log(`Copying ${file}`);
    await fs.copy(file, path.join(DEST_DIR, file));
  }

  const dirsToCopy = ["images", "libraries", "db"];
  for (const dir of dirsToCopy) {
    console.log(`Copying ${dir}`);
    await fs.copy(dir, path.join(DEST_DIR, dir));
  }

  const srcDirsToCopy = ["./src/public", "./src/views"];
  for (const dir of srcDirsToCopy) {
    console.log(`Copying ${dir}`);
    await fs.copy(dir, path.join(DEST_DIR_SRC, path.basename(dir)));
  }

  const nodeModulesFile = [
    "node_modules/react/umd/react.production.min.js",
    "node_modules/react/umd/react.development.js",
    "node_modules/react-dom/umd/react-dom.production.min.js",
    "node_modules/react-dom/umd/react-dom.development.js",
    "node_modules/katex/dist/katex.min.js",
    "node_modules/katex/dist/contrib/mhchem.min.js",
    "node_modules/katex/dist/contrib/auto-render.min.js",
  ];

  for (const file of nodeModulesFile) {
    await copyNodeModuleFileOrFolder(file);
  }

  const nodeModulesFolder = [
    "node_modules/@excalidraw/excalidraw/dist/",
    "node_modules/katex/dist/",
    "node_modules/dayjs/",
    "node_modules/force-graph/dist/",
    "node_modules/boxicons/css/",
    "node_modules/boxicons/fonts/",
    "node_modules/mermaid/dist/",
    "node_modules/jquery/dist/",
    "node_modules/jquery-hotkeys/",
    "node_modules/print-this/",
    "node_modules/split.js/dist/",
    "node_modules/panzoom/dist/",
  ];

  for (const folder of nodeModulesFolder) {
    await copyNodeModuleFileOrFolder(folder);
  }
};

copy()
  .then(() => console.log("Copying complete!"))
  .catch((err) => console.error("Error during copy:", err));
