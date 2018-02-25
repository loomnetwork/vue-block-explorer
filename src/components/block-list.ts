import { Component, Prop, Vue } from 'vue-property-decorator'
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

@Component({
  components: {
    BlockInfo,
    ConnectionStatus
  }
})
export default class BlockList extends Vue {
  @Prop({ required: true })
  blockchain!: Blockchain // prettier-ignore

  sortBy = 'blockHeight'
  sortDesc = true
  fields = [
    { key: 'blockHeight', label: 'Block', sortable: true },
    { key: 'numTransactions', label: 'Txs Processed', sortable: true },
    { key: 'age', sortable: true },
    { key: 'speed', sortable: true }
  ]
  muted = 'gray'
  selectedItem: IBlockListItem | null = null
  isBlockInfoVisible = false
  currentPage = 1
  perPage = 8

  get blocks(): IBlockListItem[] {
    return this.blockchain.blocks.map<IBlockListItem>(block => ({
      blockHeight: block.height,
      numTransactions: block.numTxs,
      age: distanceInWordsToNow(new Date(block.time)),
      speed: { time: 99, node: 66 },
      block
    }))
  }

  get blockInfoProps(): IBlockInfoProps {
    return {
      transaction: null,
      block: this.selectedItem ? this.selectedItem.block : null,
      blockchain: this.blockchain,
      onCloseBtnClicked: this.closeBlockInfoOverlay
    }
  }

  get totalNumBlocks(): number {
    return this.blockchain.totalNumBlocks
  }

  onRowClicked(item: IBlockListItem /*, index: number, event: Event*/) {
    if (this.selectedItem) {
      this.isBlockInfoVisible =
        this.selectedItem.blockHeight !== item.blockHeight || !this.isBlockInfoVisible
    } else {
      this.isBlockInfoVisible = true
    }
    this.selectedItem = item

    if (this.isBlockInfoVisible && this.selectedItem.block.numTxs > 0) {
      this.blockchain.fetchTxsInBlock(this.selectedItem.block)
    }
  }

  closeBlockInfoOverlay() {
    this.isBlockInfoVisible = false
  }

  onPageChanged(page: number) {
    let minHeight: number | undefined
    let maxHeight: number | undefined
    let autoFetch = false
    const numPages = Math.ceil(this.blockchain.totalNumBlocks / this.perPage)

    // NOTE: currently this code only works with the default sort order (most recent to least)
    if (page === 1) {
      // first page
      autoFetch = true
    } else if (page === numPages) {
      // last page
      minHeight = 1
    } else {
      maxHeight = page * this.perPage
    }
    this.blockchain.fetchBlocks({ minHeight, maxHeight, limit: this.perPage, autoFetch })
  }
}
