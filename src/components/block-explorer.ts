import Vue from 'vue'
import { VueConstructor } from 'vue/types/vue'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import BlockList from './BlockList.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TransactionList from './TransactionList.vue'

import { Blockchain } from '../blockchain'

export enum BlockExplorerView {
  Blocks = 'blocks',
  Transactions = 'transactions'
}

interface IBlockExplorerData {
  blockchain: Blockchain
}

export default Vue.extend({
  name: 'BlockExplorer',
  props: {
    view: { type: String },
    defaultUrl: { type: String },
    isUrlEditable: { type: Boolean, default: true }
  },
  data(): IBlockExplorerData {
    return {
      blockchain: new Blockchain({
        serverUrl: this.defaultUrl,
        isServerUrlEditable: this.isUrlEditable
      })
    }
  },
  mounted() {
    this.blockchain.fetchBlocks()
  },
  computed: {
    viewComponent(): VueConstructor {
      return this.view === BlockExplorerView.Transactions ? TransactionList : BlockList
    }
  }
})
