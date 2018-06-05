<template>
  <div id="app">    
    <b-container fluid>
      <Nav></Nav>      
      <b-row id="flex-wrapper">        
        <Sidebar></Sidebar>
        <div class="custom-col">
          <component :is="currentTab"
                     :showConnectionDropdown="true"
                     :defaultUrl="allowedUrls[0]"
                     :allowedUrls="allowedUrls"
                     :searchQuery="searchQuery">
          </component>
        </div>
      </b-row>
      <b-row>
        Footer
      </b-row>
      <div class="block-search-query d-flex flex-row align-items-center">
        <fa :icon="['fas', 'search']" class="search-icon text-white" fixed-width/>
        <label for="sq-block-height" class="height-label text-white">Block Height:</label>
        <b-form-input id="sq-block-height" class="height-input bg-dark text-white" type="number" v-model="blockHeight"></b-form-input>
      </div>
    </b-container>
  </div>
</template>

<style lang="scss">
  .block-search-query {
    .search-icon {
      margin-right: 0.5rem;
      width: 32px;
      height: 32px;
    }
  
    .height-label {
      margin-right: 0.5rem;
      flex: 0 0 auto;
    }

    .height-input {
      flex: 0 0 200px;
    }
  }

  #flex-wrapper {
    flex-wrap: nowrap;
    flex-direction: row;
  }  

  @media (max-width: 576px) {
    #flex-wrapper {      
      flex-direction: column;
    }
  }

  // @media (min-width: 992px) {
  //   #sliding-column {
  //     max-width: 250px;
  //   }
  // }

  .custom-col {
    flex-grow: 1;
  }

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import BlockExplorer from './components/BlockExplorer.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import Sidebar from './components/Sidebar.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import Nav from './components/Nav.vue'

import { ISearchQuery } from './components/block-explorer'

@Component({
  components: {
    BlockExplorer,
    Sidebar,
    Nav
  },
})
export default class App extends Vue {
  allowedUrls = [
    'https://prodwss2.delegatecall.com',
    'https://prodwss.delegatecall.com',
    'https://stagewss.delegatecall.com'
  ]
  
  blockHeight: string | null = null
  showSidebar: boolean = true


  switchTab(tab) {
    console.log(tab)
  }

  get searchQuery(): ISearchQuery {
    let blockHeight: number | null = null
    if (this.blockHeight) {
      blockHeight = parseInt(this.blockHeight, 10)
      if (!Number.isInteger(blockHeight) || blockHeight < 0) {
        blockHeight = null
      }
    }
    return { blockHeight }
  }

  get currentTab() {
    return BlockExplorer
  }

}
</script>
