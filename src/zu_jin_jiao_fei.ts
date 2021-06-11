import {createApp} from 'vue';
import ZuJinJiaoFei from './ZuJinJiaoFei.vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import {loadStyle} from './utils'


const id = `app_vue_${Date.now()}`
const root = document.createElement('div')
root.id = id
root.className = 'flex-div-top'
document.querySelector('div.btn-toolbar').appendChild(root)

// 为工具栏按键设置浮动效果
const toolBar = document.querySelectorAll('div.btn-toolbar > button')
toolBar.forEach(btn => {
    btn.className = btn.className + ' flex-div-top'
})

const app = createApp(ZuJinJiaoFei)

loadStyle('https://cdn.jsdelivr.net/npm/element-plus@1.0.2-beta.46/lib/theme-chalk/index.css')

//console.info(process.env.NODE_MODE)
app.use(ElementPlus, {size: 'small', locale})
app.mount(`#${id}`)
