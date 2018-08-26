const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AwesomeTypescriptLoader = require("awesome-typescript-loader");

const outputDirectory = "dist/client";

module.exports = {
    entry: "./src/client/index.tsx",
    output: {
        path: path.join(__dirname, outputDirectory),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "awesome-typescript-loader",
                    options: {
                        configFileName: "./src/client/tsconfig.json"
                    }
                }],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader?limit=100000"
            }
        ]
    },
    devtool: "inline-source-map",
    devServer: {
        port: 3000,
        open: true,
        proxy: {
            "/api": "http://localhost:8080"
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            // favicon: "./public/favicon.ico"
        })
    ]
};