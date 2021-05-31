<template>
  <div>
    <dialog :msg="abc"></dialog>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import Dialog from "./components/Dialog";

@Options({
  components:{
    Dialog
  }
})
export default class App extends Vue {

}
</script>

<style scoped>

</style>
