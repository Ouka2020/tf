import {Configuration} from "webpack";
import HtmlsPlugin from "htmls-webpack-plugin";

const developConfig: Configuration = {
    mode: 'development',
    target: 'web',
    plugins: [
        new HtmlsPlugin({
            htmls: [{
                src: './src/index.ejs',
                filename: 'index.html'
            }]
        })
    ],
}

export {developConfig}
