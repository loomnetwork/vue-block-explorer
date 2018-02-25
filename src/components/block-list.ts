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
  isBusy = false
  totalNumBlocks = 0
  refreshTimer: number | null = null

  beforeDestroy() {
    this.clearRefreshTimer()
  }

  setRefreshTimer() {
    if (this.refreshTimer === null) {
      this.refreshTimer = window.setInterval(() => {
        if (this.totalNumBlocks !== this.blockchain.totalNumBlocks && this.currentPage === 1) {
          this.totalNumBlocks = this.blockchain.totalNumBlocks
          if (this.$refs.blocksTable) {
            ;(this.$refs.blocksTable as any).refresh()
          }
        }
      }, 5000)
    }
  }

  clearRefreshTimer() {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  async blocks(): Promise<IBlockListItem[]> {
    this.clearRefreshTimer()

    let minHeight: number | undefined
    let maxHeight: number | undefined
    let autoFetch = false
    const numPages = Math.ceil(this.totalNumBlocks / this.perPage)

    // NOTE: currently this code only works with the default sort order (most recent to least)
    if (this.currentPage === 1) {
      // first page
      autoFetch = true
    } else if (this.currentPage === numPages) {
      // last page
      minHeight = 1
    } else {
      maxHeight = Math.max(numPages - this.currentPage + 1, 1) * this.perPage
    }

    // Must return empty array on error so that b-table can update busy state
    let items: IBlockListItem[] = []
    try {
      const blocks = await this.blockchain.fetchBlocks({
        minHeight,
        maxHeight,
        limit: this.perPage,
        autoFetch
      })
      items = blocks.map<IBlockListItem>(block => ({
        blockHeight: block.height,
        numTransactions: block.numTxs,
        age: distanceInWordsToNow(new Date(block.time)),
        speed: { time: 99, node: 66 },
        block
      }))
    } catch (err) {
      console.log(err)
    }

    if (autoFetch) {
      this.setRefreshTimer()
    }
    return items
  }

  get blockInfoProps(): IBlockInfoProps {
    return {
      transaction: null,
      block: this.selectedItem ? this.selectedItem.block : null,
      blockchain: this.blockchain,
      onCloseBtnClicked: this.closeBlockInfoOverlay
    }
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
}
