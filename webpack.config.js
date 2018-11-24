const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const keysTransformer = require('ts-transformer-keys/transformer').default;

const outputDirectory = "dist/client";

module.exports = {
    entry: "./src/client/index.tsx",
    output: {
        path: path.join(__dirname, outputDirectory),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".mjs", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "awesome-typescript-loader",
                    options: {
                        configFileName: "./src/client/tsconfig.json",
                        getCustomTransformers: program => ({
                            before: [
                                keysTransformer(program)
                            ]
                        })
                    }
                }],
                exclude: /node_modules/,
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "sass-loader"],
                include: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: ["style-loader", "typings-for-css-modules-loader?namedExport&camelCase&modules=true&importLoaders=1", "sass-loader"],
                exclude: /node_modules/
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
        proxy: {
            "/api": "http://localhost:8080"
        },
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            // favicon: "./public/favicon.ico"
        })
    ]
};