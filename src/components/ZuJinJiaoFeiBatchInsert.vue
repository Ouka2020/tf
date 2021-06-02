<template>
  <div class="flex-div">
    <button class="btn btn-primary" @click="dialogVisible = true">{{ msg }}</button>

    <el-dialog :title="msg" v-model="dialogVisible" width="30%">
      <el-steps :active="stepCurrent" align-center>
        <el-step title="选择数据源"></el-step>
        <el-step title="选择工作表"></el-step>
        <el-step title="执行"></el-step>
      </el-steps>
      <el-card shadow="never" v-show="stepCurrent === 0">
        <el-row>
          <input type="file">
          <el-button type="primary" @click="doCard1">加载</el-button>
        </el-row>
      </el-card>
      <el-card shadow="never" v-show="stepCurrent === 1">
        <el-row>
          <input type="file">
          <el-button type="primary" @click="doCard2">加载2</el-button>
        </el-row>
      </el-card>
      <el-card shadow="never" v-show="stepCurrent === 3">
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
        <div class="result-div">
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
          <p>kaada</p>
        </div>
      </el-card>
      <template #footer>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {ref} from "vue";

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

    // 必须返回模块中才能够使
    return {dialogVisible, msg, stepCurrent, showResult}
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
    }
  }
}
</script>

<style lang="scss">
.result-div {
  max-height: 100px;
  overflow: scroll;
}
</style>