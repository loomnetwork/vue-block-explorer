<template>
  <Layout :showConnectionDropdown="true"
          :defaultUrl="defaultUrl"
          :allowedUrls="allowedUrls"/>
</template>

<style lang="scss">
  body {
    font-family: 'Open Sans', sans-serif;
  }
</style>

<script lang="ts">
  import {Component, Vue } from 'vue-property-decorator'
  import BootstrapVue from 'bootstrap-vue'
  import FontAwesome from '@fortawesome/fontawesome'
  import SolidFontAwesome from '@fortawesome/fontawesome-free-solid'
  import RegularFontAwesome from '@fortawesome/fontawesome-free-regular'
  import FontAwesomeIcon  from '@fortawesome/vue-fontawesome'
  // @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
  import Layout from './components/Layout.vue'

  FontAwesome.library.add(SolidFontAwesome, RegularFontAwesome)
  Vue.use(BootstrapVue)
  Vue.component('fa', FontAwesomeIcon)
  @Component({
    components: {
      Layout
    }
  })
  export default class App extends Vue {
    allowedUrls = [
      'http://127.0.0.1:46657'
    ];
    defaultUrl = this.allowedUrls[0]
    mounted(){
      const customUrl = localStorage.customUrl
      const isInList = this.allowedUrls.indexOf(customUrl) > -1
      if(customUrl && !isInList){
        this.allowedUrls.push(customUrl);
        this.defaultUrl = customUrl;
      }
    }
  }
</script>
