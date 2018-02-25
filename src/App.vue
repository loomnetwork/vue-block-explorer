<template>
  <div id="app">
    <b-container fluid>
      <b-row>
        <b-col cols="12">
          <BlockExplorer
            :showConnectionDropdown="true"
            :defaultUrl="allowedUrls[0]"
            :allowedUrls="allowedUrls"/>
        </b-col>
      </b-row>
    </b-container>
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
export default class App extends Vue {
  allowedUrls = [
    'https://prodwss.delegatecall.com',
    'https://stagewss.delegatecall.com'
  ]
}
</script>
