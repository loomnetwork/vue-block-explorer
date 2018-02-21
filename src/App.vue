<template>
  <div id="app">
    <!--<HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
    <BlockExplorer/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
// import HelloWorld from './components/HelloWorld.vue';
import BlockExplorer from './components/BlockExplorer.vue'

@Component({
  components: {
    // HelloWorld,
    BlockExplorer
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
