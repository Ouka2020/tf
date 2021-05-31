<template>
  <div>
    <button class="btn btn-primary" @click="dialogVisible = true">{{ msg }}</button>

    <el-dialog
        title="提示"
        v-model="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <span>这是一段信息{{ msg }}</span>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Vue} from "vue-class-component";
import {ElMessageBox} from "element-plus";
import {Prop} from "vue-property-decorator";

// const DialogProps = Vue.extend({
//   props: {
//     msg: String
//   }
// })

export default class Dialog extends Vue {
  @Prop({type:String}) msg!:string

  async handleClose(done: () => void) {
    console.info(await ElMessageBox.confirm('确认关闭？').catch(reason => {
      console.info(reason)
    }))
    done()
  }

}
</script>

<style scoped>

</style>
