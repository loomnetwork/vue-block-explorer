<template>
  <Layout :showConnectionDropdown="true"
          :defaultUrl="allowedUrls[0]"
          :allowedUrls="allowedUrls"/>
</template>

<style lang="scss">

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
    'https://prodwss2.delegatecall.com',
    'https://prodwss.delegatecall.com',
    'https://stagewss.delegatecall.com'
  ]
}
</script>
