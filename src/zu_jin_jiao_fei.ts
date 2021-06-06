import {createApp} from 'vue';
import ZuJinJiaoFei from './ZuJinJiaoFei.vue';
import {loadStyle} from './utils';
import ElementPlus from 'element-plus';

const id = `app_vue_${Date.now()}`
const root = document.createElement('div')
root.id = id
//root.style.marginLeft = '5px'
document.querySelector('div.btn-toolbar').appendChild(root)

const app = createApp(ZuJinJiaoFei)

if (process.env.NODE_ENV === 'development') {
    loadStyle('https://cdn.jsdelivr.net/npm/element-plus@1.0.2-beta.45/lib/theme-chalk/index.css');
    //loadStyle('https://cdn.jsdelivr.net/npm/bootstrap@3.3.6/dist/css/bootstrap.min.css');
    //loadStyle('https://cdn.jsdelivr.net/npm/bootstrap@3.3.6/dist/css/bootstrap-theme.min.css');
}

//console.info(process.env.NODE_MODE)
app.use(ElementPlus, {size: 'small'})
app.mount(`#${id}`)
