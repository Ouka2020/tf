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
            <el-button type="primary" @click="loadExcelHandler">加载</el-button>
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
            <el-button type="primary" @click="selectSheetHandler">选择</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="never" v-show="stepCurrent === 2">
        <el-row :gutter="10" type="flex" justify="center">
          <el-col :span="12"><input type="file" @change="attachFileChangeHandler"></el-col>
          <el-col :span="4">
            <el-button type="primary" @click="doRunHandler">执行</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="never" :body-style="{padding:'2px'}">
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
        <el-button :disabled="!cancelMark">取消</el-button>
        <el-button type="primary" @click="resetDialogHandler" :disabled="runningMark">重置</el-button>
        <el-button type="primary" @click="hideDialogHandler">隐藏</el-button>
        <el-button type="primary" @click="closeDialogHandler">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, ref} from "vue";
import {changeRowsToDict, excel, listToString, StringBuilder} from "../utils";
import {ElMessageBox} from 'element-plus';
import moment from "moment";

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
    const dialogFullScreen = ref<boolean>(false)
    const resultList = ref<string[]>([])
    const selectedValue = ref<string>('')
    const options = ref<Option[]>([])
    const excelFile = ref<File>()
    const attachFile = ref<File[]>([])
    const cancelMark = ref(false)
    const runningMark = ref(false)
    const wb = reactive(excel)

    // webSQL
    const _webSql = window.openDatabase('threeFeiWebSQL', '1.0', '', 2 * 1024 * 1024, () => {
      console.debug('webSQL loaded.')
    })
    _webSql.transaction(function (tx) {
      tx.executeSql('DROP TABLE IF EXISTS zuJin_guHuaLuRu_insert')
    })

    //const webSql = _webSql//reactive(_webSql)

    // 必须返回模块中才能够使
    return {
      dialogVisible,
      msg,
      stepCurrent,
      dialogFullScreen,
      resultList,
      selectedValue,
      options,
      dialogReset,
      webSql: _webSql,
      excelFile,
      cancelMark,
      runningMark,
      attachFile,
      wb
    }
  },
  methods: {
    async selectSheetHandler() {
      if (!this.selectedValue) {
        await ElMessageBox.alert('还没有选择工作表，无法继续。', '提示', {
          type: 'info'
        }).catch(() => {
        }) // 消除cancel事件未处理错误

        return
      }

      this.stepCurrent++

      const sheetData = await changeRowsToDict(this.wb.getWorksheet(Number(this.selectedValue)))
      const columnNameList: string[] = []
      for (let key in sheetData[0]) {
        if (key === 'id')
          continue

        columnNameList.push(key)
      }
      // 建表
      this.webSql.transaction((tx) => {
        const createTable_cmd = new StringBuilder()
        createTable_cmd.append('CREATE TABLE IF NOT EXISTS zuJin_jiaoFeiLuRu (id INTEGER PRIMARY KEY AUTOINCREMENT,{0})',
            listToString(columnNameList, ' text'))

        console.debug(createTable_cmd.toString())
        tx.executeSql(createTable_cmd.toString())
      }, (error) => { // error
        console.warn(error)
      }, () => { // ok
        console.debug('CREATE TABLE zuJin_jiaoFeiLuRu.')
      })

      // 填充数据
      this.webSql.transaction(function (tx) {
        for (let rowId in sheetData) {
          let field_value_list = []
          for (let k of columnNameList) {
            let value = sheetData[rowId][k]

            if (typeof value == 'string') {
              field_value_list.push(`"${value}"`)
            } else if (typeof value == 'undefined') {
              field_value_list.push('null')
            } else if (value instanceof Date) {
              field_value_list.push(`"${moment(value).format("YYYY-MM-DD")}"`)
            } else {
              field_value_list.push(value)
            }
          }

          const final_cmd = new StringBuilder()
          final_cmd.append('INSERT INTO zuJin_jiaoFeiLuRu ({0}) VALUES ({1})',
              listToString(columnNameList), field_value_list.join())

          console.debug(final_cmd.toString())
          tx.executeSql(final_cmd.toString())
        }
      }, (error) => { // error
        console.warn(error)
      }, () => { // ok
        console.debug('insert ok.')
      })
    },
    async fullscreen_click() {
      this.dialogFullScreen = !this.dialogFullScreen
    },
    async closedHandler() {
      if (this.dialogReset) {
        this.resetHandler()
        return
      }

      this.dialogReset = true
    },
    async resetHandler() {
      this.stepCurrent = 0
      this.cancelMark = false
      this.runningMark = false
    },
    async hideDialogHandler() {
      this.dialogReset = false
      this.closeDialogHandler()
    },
    async excelFileChangeHandler(e: Event) {
      //console.info(e)
      const target = e.target as HTMLInputElement
      this.excelFile = target.files.item(0)
    },
    async resetDialogHandler() {
      this.resetHandler()
    },
    async closeDialogHandler() {
      this.dialogVisible = false
    },
    async doRunHandler() {
      if (this.attachFile.length === 0) {
        const result = await ElMessageBox.confirm('未选择附件，继续提交将忽略上传附件。确定要继续吗？', '提示', {
          type: 'info'
        }).catch(() => {
        }) // 消除cancel事件未处理错误

        if (result === 'cancel') return


      }
    },
    async attachFileChangeHandler(e: Event) {
      const target = e.target as HTMLInputElement
      this.attachFile = target.files
    },
    async loadExcelHandler() {
      if (!this.excelFile) {
        await ElMessageBox.alert('还没有选择文件，无法继续。', '提示', {
          type: 'info'
        }).catch(() => {
        }) // 消除cancel事件未处理错误

        return
      }

      this.options = []
      this.wb = await excel.xlsx.load(await this.excelFile.arrayBuffer())
      this.wb.eachSheet(async (ws, id) => {
        console.debug(`eachSheet {label: ${ws.name}, value: ${id}}`)
        this.options.push({label: ws.name, value: id} as Option)
      })
      this.stepCurrent++
    }
  },
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
