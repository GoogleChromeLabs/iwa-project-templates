import { merge } from "webpack-merge";
import common from "./webpack.common.js";

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    port: 4321,
    allowedHosts: "all",
    client: {
      webSocketURL: {
        protocol: "ws",
        hostname: "localhost",
        port: 4321,
      },
    },
    static: "./dist",
    hot: true,
  },
});
