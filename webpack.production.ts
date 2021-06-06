import {Configuration} from "webpack";

const prodConfig: Configuration = {
    mode: 'production',
    optimization: {
        minimize: false,
        mangleExports: false,
    },
    externals: {
        'window.moment': 'moment',
        'bootstrap': 'bootstrap',
        'bootstrap-table': 'bootstrap-table',
        '$': 'jquery',
        'jquery': 'jquery',
        'window.jquery': 'jquery',
        'window.vue': 'vue',
        'element-plus': 'element-plus',
        'window.exceljs': 'exceljs'
    }
}

export {prodConfig}
