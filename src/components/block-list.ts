import Vue from 'vue'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import BlockInfo from './BlockInfo.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import ConnectionStatus from './ConnectionStatus.vue'

import { IBlockchain, IBlockhainBlockMeta } from './block-explorer'
import { IBlockInfoProps } from './block-info'

interface IBlockListItem {
  blockHeight: number
  numTransactions: number
  age: string
  speed: any
  block: IBlockhainBlockMeta
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
      return (this.blockchain as IBlockchain).blocks.map<IBlockListItem>(meta => ({
        blockHeight: meta.header.height,
        numTransactions: meta.header.num_txs,
        age: distanceInWordsToNow(new Date(meta.header.time)),
        speed: { time: 99, node: 66 },
        block: meta
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
