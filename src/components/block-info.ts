import Vue, { VueConstructor } from 'vue'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TransactionTable from './TransactionTable.vue'
// @ts-ignore
import CreateAccountTxPreview from './delegatecall/CreateAccountTxPreview.vue'
// @ts-ignore
import PostCommentTxPreview from './delegatecall/PostCommentTxPreview.vue'

import { Blockchain, IBlockchainBlock, IBlockchainTransaction } from '../blockchain'
import {
  ITransactionTableProps,
  ITransactionTableColumn,
  TransactionTableColumnKey,
  ITransactionTableItem
} from './transaction-table'
import { TxKind } from '../transaction-reader'

const txTableColumns: ITransactionTableColumn[] = [
  { key: TransactionTableColumnKey.TxHash, sortable: false },
  { key: TransactionTableColumnKey.TxType, sortable: false },
  { key: TransactionTableColumnKey.Sender, sortable: false }
]

export interface IBlockInfoProps {
  transaction: IBlockchainTransaction | null
  block: IBlockchainBlock | null
  blockchain: Blockchain | null
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
      const block: IBlockchainBlock | null = this.block
      return `Block #${block ? block.height.toString() : ''}`
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
      const block: IBlockchainBlock | null = this.block
      return block ? block.time : ''
    },
    txTimestamp(): string {
      const tx: IBlockchainTransaction | null = this.selectedTx
      return tx ? tx.time : ''
    },
    isVerified(): boolean {
      return true
    },
    txInfoComponent(): VueConstructor | null {
      if (this.selectedTx) {
        switch (this.selectedTx.data.txKind) {
          case TxKind.CreateAccount:
            return CreateAccountTxPreview
          case TxKind.PostComment:
            return PostCommentTxPreview
        }
      }
      return null
    },
    txTableProps(): ITransactionTableProps {
      const block = this.block as IBlockchainBlock
      return {
        columns: txTableColumns,
        transactions: block ? (block.txs || []) : [], // prettier-ignore
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
