<template>
  <div>
    <Dialog msg="abc"></Dialog>
    <Dialog msg="cba"></Dialog>
  </div>
</template>

<script lang="ts">
import Dialog from "./components/Dialog.vue";
import {ref} from "vue";

export default {
  name: 'App',
  components: {Dialog},
  setup() {
    //const msg = ref<string>()
  }
}
</script>

<style scoped>

</style>
