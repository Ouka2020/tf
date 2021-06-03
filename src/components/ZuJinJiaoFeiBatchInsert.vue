<template>
  <div>
    <button class="btn btn-primary" @click="dialogVisible = true">{{ msg }}</button>

    <el-dialog v-model="dialogVisible" width="60%" :fullscreen="dialogFullScreen" @closed="closedHandler"
               :append-to-body="true">
      <template #title>
        <div class="dialog-title-div">{{ msg }}</div>
        <button aria-label="full-screen" type="button" class="el-dialog__headerbtn dialog-header-button"
                @click="fullscreen_click" data-toggle="tooltip" data-placement="bottom" title="最大/最小化">
          <i class="el-icon-full-screen"></i>
        </button>
      </template>
      <el-steps :active="stepCurrent" finish-status="success" align-center>
        <el-step title="选择数据源"></el-step>
        <el-step title="选择工作表"></el-step>
        <el-step title="选择附件"></el-step>
        <el-step title="执行"></el-step>
      </el-steps>
      <el-card shadow="never" v-show="stepCurrent === 0">
        <el-row type="flex" justify="center">
          <el-col :span="12"><input type="file" @change="excelFileChangeHandler"></el-col>
          <el-col :span="4">
            <el-button type="primary" @click="loadDataHanler">加载</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="never" v-show="stepCurrent === 1">
        <el-row :gutter="10" type="flex" justify="center">
          <el-col :span="12">
            <el-select v-model="selectedValue" placeholder="请选择">
              <el-option
                  v-for="item of options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="doCard2">加载2</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="never" v-show="stepCurrent === 2">
        <el-row :gutter="10" type="flex" justify="center">
          <el-col :span="12"><input type="file"></el-col>
            <el-col :span="4"><el-button type="primary" @click="doCard3">加载3</el-button></el-col>
        </el-row>
      </el-card>
      <el-card shadow="never" :body-style="{padding:'2px'}" :v-show="showResult">
        <template #header>
          <div>
            <span>执行结果</span>
          </div>
        </template>
        <el-scrollbar height="200px">
          <p v-for="it in resultList" v-html="it"></p>
        </el-scrollbar>
      </el-card>
      <template #footer>
        <el-button>取 消</el-button>
        <el-button type="primary" @click="hideHandler">隐 藏</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, ref} from "vue";
import { excel } from "../utils";

interface Option {
  label: string,
  value: string | number
}

export default {
  name: "ZuJinJiaoFeiBatchInsert",
  props: {
    // msg: {
    //   type: String
    // }
  },
  setup() {
    const dialogVisible = ref<boolean>(false)
    const dialogReset = ref<boolean>(true)
    const msg = ref<string>('批量新增')
    const stepCurrent = ref<number>(0)
    const showResult = ref<boolean>(false)
    const dialogFullScreen = ref<boolean>(false)
    const resultList = ref<string[]>([])
    const selectedValue = ref<string>('')
    const options = ref<Option[]>([])
    const excelFile = ref<File>()

    // webSQL
    const _webSql = window.openDatabase('threeFeiWebSQL', '1.0', '', 2 * 1024 * 1024, () => {
      console.debug('webSQL loaded.')
    })
    _webSql.transaction(function (tx) {
      tx.executeSql('DROP TABLE IF EXISTS zuJin_guHuaLuRu_insert')
    })

    const webSql = reactive(_webSql)

    // 必须返回模块中才能够使
    return {
      dialogVisible,
      msg,
      stepCurrent,
      showResult,
      dialogFullScreen,
      resultList,
      selectedValue,
      options,
      dialogReset,
      webSql,
      excelFile
    }
  },
  methods: {
    // async doCard1() {
    //   this.stepCurrent++
    // },
    async doCard2() {
      this.stepCurrent++
    },
    async doCard3() {
      this.stepCurrent++
      this.showResult = true
    },
    async fullscreen_click() {
      this.dialogFullScreen = !this.dialogFullScreen
    },
    async closedHandler() {
      if (this.dialogReset) {
        this.stepCurrent = 0
        return
      }

      this.dialogReset = true
    },
    async hideHandler() {
      this.dialogReset = false
      this.dialogVisible = false
    },
    async excelFileChangeHandler(e: Event) {
      //console.info(e)
      const target = e.target as HTMLInputElement
      this.excelFile = target.files.item(0)
    },
    async loadDataHanler() {
      if (!this.excelFile) {
        window.alert('请选择文件。')
        return
      }

      this.options = []
      let wb = await excel.xlsx.load(await this.excelFile.arrayBuffer())
      wb.eachSheet(async (ws, id) => {
        console.info(`eachSheet {label: ${ws.name}, value: ${id}}`)
        this.options.push({label: ws.name, value: id} as Option)
        // threeFei.sheetsValues.push(await changeRowsToDict(ws))
      })
      // console.debug(threeFei.sheetIndex)
      // console.debug(threeFei.sheetsValues)
      // let u = $('#zuJin_guHuaLuRu_insert_sheetSelector .panel-body .form-group:first')
      // u.empty()
      // threeFei.sheetIndex.forEach((val, index) => {
      //   console.debug(`value: ${val}, index: ${index}`)
      //   u.append(`<label class="btn btn-default"><input type="radio" name="selectedSheet" value="${index}">${val}</label>`)
      // })
      // $('#zuJin_guHuaLuRu_insert_sheetSelector').collapse('show')
      this.stepCurrent++
    }
  },
  mounted() {
    for (let i = 0; i < 10; i++) {
      const v = Math.random().toString()
      this.resultList.push(`<span style="color: red">${v}</span>`)
    }
  }
}
</script>

<style lang="scss" scoped>

.dialog-title-div {
  float: left;
}

.dialog-header-button {
  padding-right: 20px;
}

</style>
