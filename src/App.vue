<template>
  <Layout :showConnectionDropdown="true"
          :defaultUrl="allowedUrls[1]"
          :allowedUrls="allowedUrls"/>
</template>

<style lang="scss">
  body {font-family: 'Open Sans', sans-serif;}
</style>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import Layout from './components/Layout.vue'

import { ISearchQuery } from './components/block-explorer'

@Component({
  components: {
    Layout
  }
})
export default class App extends Vue {
  allowedUrls = [
    "http://127.0.0.1:46657",
    "https://devwss-dc2.devdc.io",
  ]
}
</script>
