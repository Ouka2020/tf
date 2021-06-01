<template>
  <div>
    <button class="btn btn-primary" @click="dialogVisible = true">{{ msg }}</button>

    <el-dialog
        title="提示"
        v-model="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <span>这是一段信息{{ msg }}</span>
      <div slot="footer">
      <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {ElMessageBox} from "element-plus";
import {ref} from "vue";

export default {
  name: 'Dialog',
  props: {
    msg: {
      type: String
    }
  },
  setup() {
    //const msg = ref<string>()
    const dialogVisible = ref<boolean>(false)

    // 必须返回模块中才能够使
    return {dialogVisible}
  },
  methods: {
    async handleClose(done: () => void) {
      console.info(await ElMessageBox.confirm('确认关闭？').catch(reason => {
        console.info(reason)
      }))
      done()
    }
  }
}
</script>

<style scoped>

</style>
