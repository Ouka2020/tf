import merge from "webpack-merge"
import {developConfig} from "./webpack.development"
import {prodConfig} from "./webpack.production"

const commonConfig = {
    entry: {
        index: './src/index.ts'
    },
    resolve: {
        extensions: ['.vue', '.ts', '.js']
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
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
        ]
    },
    plugins: []
}

let finalConfig
if (process.env.NODE_MODE === '') {
    finalConfig = merge(commonConfig, developConfig)
} else {
    finalConfig = merge(commonConfig, prodConfig)
}
module.exports = finalConfig