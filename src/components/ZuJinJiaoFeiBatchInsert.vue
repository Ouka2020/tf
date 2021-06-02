<template>
  <div>
    <button class="btn btn-primary" @click="dialogVisible = true">{{ msg }}</button>

    <el-dialog v-model="dialogVisible" width="30%" :fullscreen="dialogFullScreen" :close="closeHandler"
               :append-to-body="true">
      <template #title>
        <div class="dialog-title-div">{{ msg }}</div>
        <button aria-label="full-screen" type="button" class="el-dialog__headerbtn dialog-header-button"
                @click="fullscreen_click">
          <i class="el-icon-full-screen"></i>
        </button>
      </template>
      <el-steps :active="stepCurrent" align-center>
        <el-step title="选择数据源"></el-step>
        <el-step title="选择工作表"></el-step>
        <el-step title="执行"></el-step>
      </el-steps>
      <el-card shadow="never" v-show="stepCurrent === 0">
        <el-row>
          <el-col :span="6"><input type="file"></el-col>
          <el-col :span="4"><el-button type="primary" @click="doCard1">加载</el-button></el-col>
        </el-row>
      </el-card>
      <el-card shadow="never" v-show="stepCurrent === 1">
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-select v-model="selectedValue" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-button type="primary" @click="doCard2">加载2</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="never" v-show="stepCurrent === 2">
        <el-row>
          <input type="file">
          <el-button type="primary" @click="doCard3">加载3</el-button>
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeHandler">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, ref} from "vue";

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
    const msg = ref<string>('批量新增')
    const stepCurrent = ref<number>(0)
    const showResult = ref<boolean>(false)
    const dialogFullScreen = ref<boolean>(false)
    const resultList = ref<string[]>([])
    const selectedValue = ref<string>('')
    const options = ref<Option[]>([])

    // 必须返回模块中才能够使
    return {dialogVisible, msg, stepCurrent, showResult, dialogFullScreen, resultList, selectedValue, options}
  },
  methods: {
    async doCard1() {
      this.stepCurrent++
    },
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
    async closeHandler() {
      this.stepCurrent = 0

      return false
    }
  },
  mounted() {
    for (let i = 0; i < 10; i++) {
      const v = Math.random().toString()
      this.resultList.push(`<span style="color: red">${v}</span>`)

      this.options.push({label: 'opt' + i, value: i} as Option)
    }
  }
}
</script>

<style lang="scss" scoped>
.result-div {
  max-height: 100px;
  overflow: scroll;
}

.dialog-title-div {
  float: left;
}

.dialog-header-button {
  padding-right: 20px;
}

</style>
