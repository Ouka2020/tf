const prodConfig: {} = {
    mode: 'production',
    optimization: {
        minimize: false,
        mangleExports: false,
    },
    externals: {
        'moment': 'moment',
        'bootstrap': 'bootstrap',
        'bootstrap-table': 'bootstrap-table',
        '$': 'JQuery',
        'jquery': 'JQuery',
        'window.jquery': 'JQuery',
    }
}
export {prodConfig}