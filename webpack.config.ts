import {Configuration, DefinePlugin} from "webpack"
import merge from "webpack-merge"
import {developConfig} from "./webpack.development"
import {prodConfig} from "./webpack.production"
import VueLoaderPlugin from "vue-loader/dist/plugin"
import {CleanWebpackPlugin} from "clean-webpack-plugin"
import path from "path"

import dotenv from "dotenv"

const dotEnv = dotenv.config({
    path: path.join(__dirname, '.env')
})

const commonConfig = {
    entry: {
        index: './src/index.ts'
    },
    output: {
        path: path.resolve('dist'),
        assetModuleFilename: '[name]][ext]'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 9000,
    },
    resolve: {
        extensions: ['.vue', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(svg|ttf|eot|woff)$/,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new DefinePlugin({
            "process.env": dotEnv.parsed
        })
    ],
    experiments: {
        topLevelAwait: true
    }
}

let finalConfig: Configuration
if (process.env.NODE_ENV === 'development') {
    finalConfig = merge<Configuration>(commonConfig, developConfig)
} else {
    finalConfig = merge<Configuration>(commonConfig, prodConfig)
}

//console.info(process.env.NODE_ENV)
//console.info(process.env.NODE_MODE)
//console.info(finalConfig)
module.exports = finalConfig
