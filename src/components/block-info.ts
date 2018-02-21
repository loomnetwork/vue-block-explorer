import Vue from 'vue'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TransactionTable from './TransactionTable.vue'

import { IBlockhainBlockMeta, IBlockchain, IBlockchainTransaction } from './block-explorer'
import {
  ITransactionTableProps,
  ITransactionTableColumn,
  TransactionTableColumnKey,
  ITransactionTableItem
} from './transaction-table'

const txTableColumns: ITransactionTableColumn[] = [
  { key: TransactionTableColumnKey.TxHash, sortable: false },
  { key: TransactionTableColumnKey.TxType, sortable: false },
  { key: TransactionTableColumnKey.Sender, sortable: false }
]

export interface IBlockInfoProps {
  transaction: IBlockchainTransaction | null
  block: IBlockhainBlockMeta | null
  blockchain: IBlockchain | null
  onCloseBtnClicked: () => void
}

interface IBlockInfoData {
  // Currently displayed tx (if any)
  selectedTx: IBlockchainTransaction | null
}

const NotUndefinedProp = { validator: (value: any) => value !== undefined }

export default Vue.extend({
  name: 'BlockInfo',
  props: {
    transaction: NotUndefinedProp,
    block: NotUndefinedProp,
    blockchain: NotUndefinedProp,
    onCloseBtnClicked: { type: Function, required: true }
  },
  data(): IBlockInfoData {
    return {
      selectedTx: this.transaction
    }
  },
  watch: {
    // Clear the selected tx when the block prop changes
    block() {
      this.selectedTx = this.transaction
    },
    // Replace the selected tx when the transaction prop changes
    transaction(newVal: IBlockchainTransaction) {
      this.selectedTx = newVal
    }
  },
  computed: {
    blockTitle(): string {
      const block: IBlockhainBlockMeta | null = this.block
      return `Block #${block ? block.header.height.toString() : ''}`
    },
    transactionTitle(): string {
      const tx: IBlockchainTransaction | null = this.selectedTx
      return `Tx ${tx ? tx.hash : ''}`
    },
    breadcrumbs() {
      const items: Array<{ text: string; link: string }> = []
      if (this.block) {
        items.push({ text: this.blockTitle, link: '#' })
      }
      if (this.selectedTx) {
        items.push({ text: this.transactionTitle, link: '#' })
      }
      return items
    },
    nodeName(): string {
      return 'Node #33'
    },
    blockTimestamp(): string {
      const block: IBlockhainBlockMeta | null = this.block
      return block ? block.header.time : ''
    },
    txTimestamp(): string {
      const tx: IBlockchainTransaction | null = this.selectedTx
      return tx ? tx.time : ''
    },
    isVerified(): boolean {
      return true
    },
    txTableProps(): ITransactionTableProps {
      const block = this.block as IBlockhainBlockMeta
      const txs: IBlockchainTransaction[] = []
      // TODO: Pull real tx data from somewhere.
      if (block) {
        for (let i = 0; i < 5; i++) {
          txs.push({
            hash: block.block_id.hash + i,
            blockHeight: block.header.height,
            txType: 'question',
            time: block.header.time,
            sender: 'alice'
          })
        }
      }
      return {
        columns: txTableColumns,
        transactions: txs,
        onRowClicked: this.onTxClicked
      }
    }
  },
  methods: {
    onTitleClicked() {
      this.selectedTx = null
    },
    onTxClicked(txItem: ITransactionTableItem) {
      this.selectedTx = txItem.tx
    }
  },
  components: {
    TransactionTable
  }
})
