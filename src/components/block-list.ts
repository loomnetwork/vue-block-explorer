import Vue from 'vue'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import BlockInfo from './BlockInfo.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import ConnectionStatus from './ConnectionStatus.vue'

import { IBlockInfoProps } from './block-info'
import { Blockchain, IBlockchainBlock } from '../blockchain'

interface IBlockListItem {
  blockHeight: number
  numTransactions: number
  age: string
  speed: any
  block: IBlockchainBlock
}

interface IBlockListData {
  sortBy: string
  sortDesc: boolean
  fields: Array<{
    key: string
    label?: string
    sortable?: boolean
  }>
  muted: string
  selectedItem: IBlockListItem | null
  isBlockInfoVisible: boolean
}

export default Vue.extend({
  name: 'BlockList',
  props: {
    blockchain: { type: Object, required: true }
  },
  data(): IBlockListData {
    return {
      sortBy: 'blockHeight',
      sortDesc: true,
      fields: [
        { key: 'blockHeight', label: 'Block', sortable: true },
        { key: 'numTransactions', label: 'Txs Processed', sortable: true },
        { key: 'age', sortable: true },
        { key: 'speed', sortable: true }
      ],
      muted: 'gray',
      selectedItem: null,
      isBlockInfoVisible: false
    }
  },
  computed: {
    blocks(): IBlockListItem[] {
      return (this.blockchain as Blockchain).blocks.map<IBlockListItem>(block => ({
        blockHeight: block.height,
        numTransactions: block.numTxs,
        age: distanceInWordsToNow(new Date(block.time)),
        speed: { time: 99, node: 66 },
        block
      }))
    },
    blockInfoProps(): IBlockInfoProps {
      return {
        transaction: null,
        block: this.selectedItem ? this.selectedItem.block : null,
        blockchain: this.blockchain,
        onCloseBtnClicked: this.closeBlockInfoOverlay
      }
    }
  },
  methods: {
    onRowClicked(item: IBlockListItem /*, index: number, event: Event*/) {
      if (this.selectedItem) {
        this.isBlockInfoVisible =
          this.selectedItem.blockHeight !== item.blockHeight || !this.isBlockInfoVisible
      } else {
        this.isBlockInfoVisible = true
      }
      this.selectedItem = item

      if (this.isBlockInfoVisible && this.selectedItem.block.numTxs > 0) {
        ;(this.blockchain as Blockchain).fetchTxsInBlock(this.selectedItem.block)
      }
    },
    closeBlockInfoOverlay() {
      this.isBlockInfoVisible = false
    }
  },
  components: {
    BlockInfo,
    ConnectionStatus
  }
})
