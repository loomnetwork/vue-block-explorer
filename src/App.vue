<template>
  <div id="app">
    <BlockExplorer/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import BlockExplorer from './components/BlockExplorer.vue'

@Component({
  components: {
    BlockExplorer
  },
})
export default class App extends Vue {}
</script>
