import { VueConstructor } from 'vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

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

const NotUndefinedProp = { validator: (value: any) => value !== undefined }

@Component({
  components: {
    TransactionTable
  }
})
export default class BlockInfo extends Vue {
  @Prop(NotUndefinedProp) transaction!: IBlockchainTransaction | null // prettier-ignore
  @Prop(NotUndefinedProp) block!: IBlockchainBlock | null // prettier-ignore
  @Prop(NotUndefinedProp) blockchain!: Blockchain | null // prettier-ignore
  @Prop({ required: true }) onCloseBtnClicked!: () => void // prettier-ignore

  // Currently displayed tx (if any)
  selectedTx: IBlockchainTransaction | null = this.transaction

  // Clear the selected tx when the block prop changes
  @Watch('block')
  onBlockChanged() {
    this.selectedTx = this.transaction
  }
  // Replace the selected tx when the transaction prop changes
  @Watch('transaction')
  onTxChanged(newVal: IBlockchainTransaction) {
    this.selectedTx = newVal
  }

  get blockTitle(): string {
    return `Block #${this.block ? this.block.height.toString() : ''}`
  }
  get transactionTitle(): string {
    return `Tx ${this.selectedTx ? this.selectedTx.hash : ''}`
  }
  get breadcrumbs() {
    const items: Array<{ text: string; link: string }> = []
    if (this.block) {
      items.push({ text: this.blockTitle, link: '#' })
    }
    if (this.selectedTx) {
      items.push({ text: this.transactionTitle, link: '#' })
    }
    return items
  }
  get nodeName(): string {
    return 'Node #33'
  }

  get blockTimestamp(): string {
    return this.block ? this.block.time : ''
  }

  get txTimestamp(): string {
    return this.selectedTx ? this.selectedTx.time : ''
  }

  get isVerified(): boolean {
    return true
  }

  get txInfoComponent(): VueConstructor | null {
    if (this.selectedTx) {
      switch (this.selectedTx.data.txKind) {
        case TxKind.CreateAccount:
          return CreateAccountTxPreview
        case TxKind.PostComment:
          return PostCommentTxPreview
      }
    }
    return null
  }

  get isLoading(): boolean {
    if (this.block) {
      return this.block.isFetchingTxs
    }
    return false
  }

  get txTableProps(): ITransactionTableProps {
    return {
      columns: txTableColumns,
      transactions: this.block ? (this.block.txs || []) : [], // prettier-ignore
      onRowClicked: this.onTxClicked
    }
  }

  onTitleClicked() {
    this.selectedTx = null
  }
  onTxClicked(txItem: ITransactionTableItem) {
    this.selectedTx = txItem.tx
  }
}
