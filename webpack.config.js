const path = require("path");

module.exports = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  entry: {
    setup: "./src/public/app/setup.js",
    mobile: "./src/public/app/mobile.js",
    desktop: "./src/public/app/desktop.js",
  },
  output: {
    publicPath: `assets/v0.63.5/app-dist/`,
    path: path.resolve(__dirname, "src/public/app-dist"),
    filename: "[name].js",
  },
  devtool: "source-map",
  target: "electron-renderer",
};
