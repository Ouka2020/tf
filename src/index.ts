import {createApp} from 'vue';
import App from './App.vue';
import {loadStyle} from './utils';

const id = `app_vue_${Date.now()}`
const root = document.createElement('div')
root.id = id
document.body.appendChild(root)

const app = createApp(App)

if (process.env.NODE_ENV === 'development') {
    loadStyle('https://cdn.jsdelivr.net/npm/element-plus@1.0.2-beta.45/lib/theme-chalk/index.css');
    loadStyle('https://cdn.jsdelivr.net/npm/bootstrap@3.3.6/dist/css/bootstrap.min.css');
    loadStyle('https://cdn.jsdelivr.net/npm/bootstrap@3.3.6/dist/css/bootstrap-theme.min.css');

    //const ElementUI = require('element-ui')
    const elementPlus = await import('element-plus')
    app.use(elementPlus, {size: 'small'})
}

//Vue.config.productionTip = false
//console.info(process.env.NODE_MODE)
app.mount(`#${id}`)
