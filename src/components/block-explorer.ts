import Vue from 'vue'
import { VueConstructor } from 'vue/types/vue'
import Axios from 'axios'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import BlockList from './BlockList.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TransactionList from './TransactionList.vue'

interface IBlockchainStatusResponse {
  result: {
    latest_block_height: number
  }
}

export interface IBlockhainBlockMeta {
  block_id: {
    hash: string
  }
  header: {
    height: number
    time: string
    num_txs: number
  }
}

export interface IBlockchainTransaction {
  hash: string
  blockHeight: number
  txType: string
  time: string
  sender: string
}

interface IBlockchainResponse {
  result: {
    block_metas: IBlockhainBlockMeta[]
  }
}

export enum BlockExplorerView {
  Blocks = 'blocks',
  Transactions = 'transactions'
}

export interface IBlockchain {
  serverUrl: string
  isServerUrlEditable: boolean
  isConnected: boolean
  blocks: IBlockhainBlockMeta[]
  transactions: IBlockchainTransaction[]
}

interface IBlockExplorerData {
  blockchain: IBlockchain
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
      blockchain: {
        serverUrl: this.defaultUrl,
        isServerUrlEditable: this.isUrlEditable,
        isConnected: false,
        blocks: [],
        transactions: []
      }
    }
  },
  mounted() {
    this.fetchBlocks()
  },
  computed: {
    viewComponent(): VueConstructor {
      return this.view === BlockExplorerView.Transactions ? TransactionList : BlockList
    }
  },
  methods: {
    async fetchBlocks() {
      try {
        const statusResp = await Axios.get<IBlockchainStatusResponse>(
          `${this.blockchain.serverUrl}/status`
        )
        const lastBlockNum = statusResp.data.result.latest_block_height
        const firstBlockNum = Math.max(lastBlockNum - 10, 0)
        const chainResp = await Axios.get<IBlockchainResponse>(
          `${this.blockchain.serverUrl}/blockchain`,
          {
            params: {
              minHeight: firstBlockNum,
              maxHeight: lastBlockNum
            }
          }
        )
        this.blockchain.isConnected = true
        this.blockchain.blocks = chainResp.data.result.block_metas
        this.blockchain.transactions = this.blockchain.blocks.map<IBlockchainTransaction>(meta => {
          if (meta.header.num_txs > 0) {
            // TODO: Pull tx data out of somewhere
          }
          return {
            hash: meta.block_id.hash,
            blockHeight: meta.header.height,
            txType: 'question',
            time: meta.header.time,
            sender: 'alice'
          }
        })
        // TODO: Connect to the websocket for updates.
        setTimeout(() => {
          this.fetchBlocks()
        }, 1000)
      } catch (e) {
        this.blockchain.isConnected = false
        // Try fetching again a bit later.
        setTimeout(() => {
          this.fetchBlocks()
        }, 2000)
      }
    }
  }
})
