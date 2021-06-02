import {Configuration} from "webpack";

const prodConfig: Configuration = {
    mode: 'production',
    optimization: {
        minimize: false,
        mangleExports: false,
    },
    externals: {
        'moment': 'moment',
        'bootstrap': 'bootstrap',
        'bootstrap-table': 'bootstrap-table',
        '$': 'jquery',
        'jquery': 'jquery',
        'window.jquery': 'jquery',
        'vue': 'vue',
        'element-plus': 'element-plus',
        'exceljs': 'exceljs'
    }
}

export {prodConfig}
