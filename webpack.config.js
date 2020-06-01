const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = env => ({
  entry: path.resolve(__dirname, "src/openmrs-esm-patient-chart-widgets.tsx"),
  output: {
    filename: "openmrs-esm-patient-chart-widgets.js",
    libraryTarget: "system",
    path: path.resolve(__dirname, "dist"),
    jsonpFunction: "webpackJsonp_openmrs_esm_patient_chart_widgets"
  },
  module: {
    rules: [
      {
        parser: {
          system: false
        }
      },
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: resourcePath => {
                  if (
                    /[a-zA-Z/]*react-html5-camera-photo\/build\/css\/index.css/i.test(
                      resourcePath
                    ) ||
                    /styles.css$/i.test(resourcePath)
                  ) {
                    return "global";
                  }
                  return "local";
                },
                localIdentName:
                  "esm-patient-chart-widgets__[name]__[local]___[hash:base64:5]"
              }
            }
          }
        ]
      }
    ]
  },
  devtool: "sourcemap",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    disableHostCheck: true
  },
  externals: [
    "react",
    "react-dom",
    "react-router-dom",
    /^@openmrs\/esm/,
    "i18next",
    "react-i18next"
  ],
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: env && env.analyze ? "server" : "disabled"
    })
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  }
});
